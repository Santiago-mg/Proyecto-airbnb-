const obtenerAlerta = (query = {}) => {
  if (!query.mensaje || query.mostrarComoErrores === 'true') {
    return null;
  }

  return {
    type: query.tipo || 'info',
    message: query.mensaje,
  };
};

const obtenerErrores = (query = {}) => {
  if (!query.error) {
    return [];
  }

  const errores = Array.isArray(query.error) ? query.error : [query.error];
  return errores.map((msg) => ({ msg }));
};

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Inicia sesion',
    alert: obtenerAlerta(req.query),
    errores: obtenerErrores(req.query),
    usuario: {
      email: req.query.email || '',
    },
  });
};

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear cuenta',
    alert: obtenerAlerta(req.query),
    errores: obtenerErrores(req.query),
    usuario: {
      nombre: req.query.nombre || '',
      email: req.query.email || '',
    },
  });
};

const formularioOlvidePassword = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso a Bienes Raices',
    alert: obtenerAlerta(req.query),
    errores: obtenerErrores(req.query),
    email: req.query.email || '',
  });
};

const paginaInicio = (req, res) => {
  res.render('template/inicio', {
    pagina: 'Inicio',
    alert: obtenerAlerta(req.query),
  });
};

const confirmarCuenta = (req, res) => {
  res.redirect(`/api/auth/confirmar/${req.params.token}`);
};

const formularioReestablecerPassword = (req, res) => {
  res.render('auth/reestablecer-password', {
    pagina: 'Reestablece tu password',
    alert: obtenerAlerta(req.query),
    errores: obtenerErrores(req.query),
    token: req.params.token,
  });
};

const paginaMensaje = (req, res) => {
  res.render('template/mensaje', {
    pagina: req.query.pagina || 'Mensaje',
    alert: obtenerAlerta(req.query),
    mensaje: req.query.mensaje || '',
    textoBoton: req.query.accion || 'Volver al inicio',
    hrefBoton: req.query.href || '/',
  });
};

export {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  paginaInicio,
  confirmarCuenta,
  formularioReestablecerPassword,
  paginaMensaje,
};
