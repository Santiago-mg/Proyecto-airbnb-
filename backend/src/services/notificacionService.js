import { Notificacion } from '../models/index.js';
import { crearError } from '../helpers/errors.js';

// Crea una notificacion para un usuario. Nunca debe romper el flujo que la dispara.
const crearNotificacion = async ({
  usuarioId, tipo = 'sistema', titulo, mensaje, enlace = null,
}) =>
  Notificacion.create({
    usuarioId, tipo, titulo, mensaje, enlace,
  });

const listarNotificaciones = async (usuarioId, limite = 15) =>
  Notificacion.findAll({
    where: { usuarioId },
    order: [['createdAt', 'DESC']],
    limit: limite,
  });

const contarNoLeidas = async (usuarioId) =>
  Notificacion.count({ where: { usuarioId, leida: false } });

const marcarLeida = async (id, usuarioId) => {
  const notificacion = await Notificacion.findOne({ where: { id, usuarioId } });
  if (!notificacion) {
    throw crearError('Notificacion no encontrada.', 404);
  }
  notificacion.leida = true;
  await notificacion.save();
  return notificacion;
};

const marcarTodasLeidas = async (usuarioId) => {
  await Notificacion.update({ leida: true }, { where: { usuarioId, leida: false } });
  return true;
};

export {
  crearNotificacion,
  listarNotificaciones,
  contarNoLeidas,
  marcarLeida,
  marcarTodasLeidas,
};
