import { verificarJWT } from '../helpers/tokens.js';
import { Usuario } from '../models/index.js';

// Lee el JWT desde la cookie `token` o el header Authorization.
const extraerToken = (req) => {
  if (req.cookies?.token) {
    return req.cookies.token;
  }

  const header = req.headers.authorization || '';
  if (header.startsWith('Bearer ')) {
    return header.slice(7);
  }

  return null;
};

// Requiere usuario autenticado.
const proteger = async (req, res, next) => {
  try {
    const token = extraerToken(req);

    if (!token) {
      return res.status(401).json({ ok: false, message: 'No autenticado.' });
    }

    const decoded = verificarJWT(token);
    const usuario = await Usuario.findByPk(decoded.id);

    if (!usuario || !usuario.activo) {
      return res.status(401).json({ ok: false, message: 'Sesion invalida.' });
    }

    req.usuario = usuario;
    return next();
  } catch (error) {
    return res.status(401).json({ ok: false, message: 'Token invalido o expirado.' });
  }
};

// Identifica al usuario si hay token, pero no obliga.
const identificar = async (req, res, next) => {
  try {
    const token = extraerToken(req);
    if (token) {
      const decoded = verificarJWT(token);
      const usuario = await Usuario.findByPk(decoded.id);
      if (usuario && usuario.activo) {
        req.usuario = usuario;
      }
    }
  } catch (error) {
    // Silencioso: simplemente queda como anonimo.
  }
  return next();
};

// Restringe a uno o varios roles.
const permitir = (...roles) => (req, res, next) => {
  if (!req.usuario || !roles.includes(req.usuario.rol)) {
    return res.status(403).json({ ok: false, message: 'No tienes permisos para esta accion.' });
  }
  return next();
};

export { proteger, identificar, permitir };
