import { apiFetch } from '../config/api.js';

// Identifica al usuario a partir de la cookie y lo expone a las vistas.
const sesion = async (req, res, next) => {
  res.locals.usuario = null;
  res.locals.token = req.cookies?.token || null;
  res.locals.rutaActual = req.path;

  const token = req.cookies?.token;
  if (token) {
    const { data } = await apiFetch('/auth/perfil', { token });
    if (data?.ok) {
      res.locals.usuario = data.usuario;
    }
  }

  // Anuncio global activo (banner superior).
  try {
    const { data } = await apiFetch('/public/anuncio');
    res.locals.anuncio = data?.anuncio || null;
  } catch (error) {
    res.locals.anuncio = null;
  }

  next();
};

// Exige sesion iniciada para rutas privadas.
const requiereSesion = (req, res, next) => {
  if (!res.locals.usuario) {
    return res.redirect('/login?mensaje=Inicia sesion para continuar.&tipo=info');
  }
  return next();
};

// Exige uno de los roles indicados.
const requiereRol = (...roles) => (req, res, next) => {
  if (!res.locals.usuario || !roles.includes(res.locals.usuario.rol)) {
    return res.status(403).render('template/mensaje', {
      pagina: 'Acceso restringido',
      mensaje: 'No tienes permisos para acceder a esta seccion.',
      textoBoton: 'Volver al inicio',
      hrefBoton: '/',
    });
  }
  return next();
};

export { sesion, requiereSesion, requiereRol };
