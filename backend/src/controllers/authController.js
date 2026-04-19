import { validationResult } from 'express-validator';

import {
  autenticarUsuario,
  confirmarUsuario,
  generarTokenReestablecerPassword,
  registrarUsuario,
  reestablecerPasswordUsuario,
} from '../services/authService.js';
import {
  construirRuta,
  enviarError,
  enviarErrorValidacion,
  esPeticionJson,
} from '../helpers/response.js';

const registrar = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return enviarErrorValidacion(req, res, errors, '/registro', {
      nombre: req.body.nombre,
      email: req.body.email,
    });
  }

  try {
    const resultado = await registrarUsuario(req.body);

    if (esPeticionJson(req)) {
      return res.status(201).json({
        ok: true,
        message: 'Cuenta creada correctamente.',
        previewUrl: resultado.previewUrl,
      });
    }

    return res.redirect(
      construirRuta('/mensaje', {
        pagina: 'Cuenta creada correctamente',
        mensaje:
          'Hemos generado un enlace de confirmacion para tu cuenta. Presiona el boton para continuar.',
        accion: 'Confirmar cuenta',
        href: resultado.previewPath,
        tipo: 'success',
      }),
    );
  } catch (error) {
    return enviarError(req, res, error, '/registro', {
      nombre: req.body.nombre,
      email: req.body.email,
    }, 'No fue posible crear la cuenta.');
  }
};

const autenticar = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return enviarErrorValidacion(req, res, errors, '/login', {
      email: req.body.email,
    });
  }

  try {
    await autenticarUsuario(req.body);

    if (esPeticionJson(req)) {
      return res.json({
        ok: true,
        message: 'Inicio de sesion correcto.',
        redirectTo: '/',
      });
    }

    return res.redirect('/?mensaje=Inicio de sesion correcto.&tipo=success');
  } catch (error) {
    return enviarError(req, res, error, '/login', {
      email: req.body.email,
    }, 'No fue posible iniciar sesion.');
  }
};

const olvidePassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return enviarErrorValidacion(req, res, errors, '/olvide-password', {
      email: req.body.email,
    });
  }

  try {
    const resultado = await generarTokenReestablecerPassword(req.body.email);

    if (esPeticionJson(req)) {
      return res.json({
        ok: true,
        message: 'Proceso de recuperacion generado correctamente.',
        previewUrl: resultado.previewUrl,
      });
    }

    if (!resultado.previewPath) {
      return res.redirect(
        construirRuta('/mensaje', {
          pagina: 'Revisa tu solicitud',
          mensaje:
            'Si el usuario existe, pronto podras continuar con el reestablecimiento del password.',
          accion: 'Volver al login',
          href: '/login',
          tipo: 'info',
        }),
      );
    }

    return res.redirect(
      construirRuta('/mensaje', {
        pagina: 'Reestablece tu password',
        mensaje:
          'Hemos generado un enlace temporal para que actualices tu password.',
        accion: 'Reestablecer password',
        href: resultado.previewPath,
        tipo: 'success',
      }),
    );
  } catch (error) {
    return enviarError(req, res, error, '/olvide-password', {
      email: req.body.email,
    }, 'No fue posible iniciar la recuperacion.');
  }
};

const confirmarCuenta = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return enviarErrorValidacion(req, res, errors, '/mensaje');
  }

  try {
    await confirmarUsuario(req.params.token);

    if (esPeticionJson(req)) {
      return res.json({
        ok: true,
        message: 'Cuenta confirmada correctamente.',
        redirectTo: '/login',
      });
    }

    return res.redirect(
      '/login?mensaje=Cuenta confirmada correctamente. Ya puedes iniciar sesion.&tipo=success',
    );
  } catch (error) {
    return res.redirect(
      construirRuta('/mensaje', {
        pagina: 'No fue posible confirmar la cuenta',
        mensaje: error.message || 'El token de confirmacion no es valido.',
        accion: 'Crear cuenta',
        href: '/registro',
        tipo: 'error',
      }),
    );
  }
};

const reestablecerPassword = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return enviarErrorValidacion(
      req,
      res,
      errors,
      `/reestablecer-password/${req.params.token}`,
    );
  }

  try {
    await reestablecerPasswordUsuario(req.params.token, req.body.password);

    if (esPeticionJson(req)) {
      return res.json({
        ok: true,
        message: 'Password actualizado correctamente.',
        redirectTo: '/login',
      });
    }

    return res.redirect(
      '/login?mensaje=Password actualizado correctamente. Ya puedes iniciar sesion.&tipo=success',
    );
  } catch (error) {
    return res.redirect(
      construirRuta('/mensaje', {
        pagina: 'No fue posible actualizar el password',
        mensaje: error.message || 'El token para reestablecer el password no es valido.',
        accion: 'Intentar de nuevo',
        href: '/olvide-password',
        tipo: 'error',
      }),
    );
  }
};

export {
  registrar,
  autenticar,
  olvidePassword,
  confirmarCuenta,
  reestablecerPassword,
};
