import {
  listarNotificaciones, contarNoLeidas, marcarLeida, marcarTodasLeidas,
} from '../services/notificacionService.js';

const listar = async (req, res, next) => {
  try {
    const [notificaciones, noLeidas] = await Promise.all([
      listarNotificaciones(req.usuario.id),
      contarNoLeidas(req.usuario.id),
    ]);
    res.json({ ok: true, notificaciones, noLeidas });
  } catch (error) {
    next(error);
  }
};

const leer = async (req, res, next) => {
  try {
    const notificacion = await marcarLeida(req.params.id, req.usuario.id);
    res.json({ ok: true, notificacion });
  } catch (error) {
    next(error);
  }
};

const leerTodas = async (req, res, next) => {
  try {
    await marcarTodasLeidas(req.usuario.id);
    res.json({ ok: true, message: 'Notificaciones marcadas como leidas.' });
  } catch (error) {
    next(error);
  }
};

export { listar, leer, leerTodas };
