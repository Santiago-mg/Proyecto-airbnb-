import { validationResult } from 'express-validator';

import {
  registrarUsuario, autenticarUsuario, obtenerPerfil, actualizarPerfil,
} from '../services/authService.js';

const erroresValidacion = (req, res) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    res.status(422).json({ ok: false, message: 'Revisa los datos enviados.', errors: errores.array() });
    return true;
  }
  return false;
};

const cookieOpciones = {
  httpOnly: true,
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const registrar = async (req, res, next) => {
  if (erroresValidacion(req, res)) return;
  try {
    const { usuario, token } = await registrarUsuario(req.body);
    res.cookie('token', token, cookieOpciones);
    res.status(201).json({ ok: true, message: 'Cuenta creada correctamente.', usuario, token });
  } catch (error) {
    next(error);
  }
};

const login = async (req, res, next) => {
  if (erroresValidacion(req, res)) return;
  try {
    const { usuario, token } = await autenticarUsuario(req.body);
    res.cookie('token', token, cookieOpciones);
    res.json({ ok: true, message: 'Inicio de sesion correcto.', usuario, token });
  } catch (error) {
    next(error);
  }
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.json({ ok: true, message: 'Sesion cerrada.' });
};

const perfil = async (req, res, next) => {
  try {
    const usuario = await obtenerPerfil(req.usuario.id);
    res.json({ ok: true, usuario });
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  if (erroresValidacion(req, res)) return;
  try {
    const usuario = await actualizarPerfil(req.usuario.id, req.body);
    res.json({ ok: true, message: 'Perfil actualizado.', usuario });
  } catch (error) {
    next(error);
  }
};

export { registrar, login, logout, perfil, actualizar };
