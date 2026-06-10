import { Op } from 'sequelize';

import { Reserva, Propiedad, Usuario } from '../models/index.js';
import { crearError } from '../helpers/errors.js';
import { crearNotificacion } from './notificacionService.js';

const formatoFecha = (valor) => {
  try {
    return new Date(valor).toLocaleDateString('es-CO', { day: '2-digit', month: 'short' });
  } catch (error) {
    return valor;
  }
};

const calcularNoches = (inicio, fin) => {
  const ms = new Date(fin).getTime() - new Date(inicio).getTime();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};

// Verifica que no exista solapamiento de fechas para la propiedad.
const hayDisponibilidad = async (propiedadId, fechaInicio, fechaFin, excluirId = null) => {
  const where = {
    propiedadId,
    estado: { [Op.ne]: 'cancelada' },
    fechaInicio: { [Op.lt]: fechaFin },
    fechaFin: { [Op.gt]: fechaInicio },
  };
  if (excluirId) {
    where.id = { [Op.ne]: excluirId };
  }
  const conflicto = await Reserva.findOne({ where });
  return !conflicto;
};

const crearReserva = async (viajeroId, { propiedadId, fechaInicio, fechaFin, huespedes }) => {
  const propiedad = await Propiedad.findByPk(propiedadId);
  if (!propiedad || !propiedad.activa || propiedad.estado !== 'aprobada') {
    throw crearError('La propiedad no esta disponible.', 404);
  }

  if (propiedad.anfitrionId === viajeroId) {
    throw crearError('No puedes reservar tu propia propiedad.', 400);
  }

  const noches = calcularNoches(fechaInicio, fechaFin);
  if (noches <= 0) {
    throw crearError('El rango de fechas no es valido.', 400);
  }

  if (Number(huespedes) > propiedad.huespedes) {
    throw crearError(`La propiedad admite maximo ${propiedad.huespedes} huespedes.`, 400);
  }

  const disponible = await hayDisponibilidad(propiedadId, fechaInicio, fechaFin);
  if (!disponible) {
    throw crearError('Las fechas seleccionadas ya estan reservadas.', 409);
  }

  const total = noches * Number(propiedad.precioNoche);

  const reserva = await Reserva.create({
    propiedadId,
    viajeroId,
    fechaInicio,
    fechaFin,
    huespedes,
    noches,
    total,
    estado: 'confirmada',
  });

  // Notifica al anfitrion de la nueva reserva. Si algo falla aqui,
  // la reserva ya quedo creada y no debe verse afectada.
  try {
    const viajero = await Usuario.findByPk(viajeroId, { attributes: ['nombre'] });
    const nombreViajero = viajero?.nombre || 'Un huesped';
    await crearNotificacion({
      usuarioId: propiedad.anfitrionId,
      tipo: 'reserva',
      titulo: 'Nueva reserva recibida',
      mensaje: `${nombreViajero} reservo "${propiedad.titulo}" (${formatoFecha(fechaInicio)} - ${formatoFecha(fechaFin)}, ${noches} ${noches === 1 ? 'noche' : 'noches'}).`,
      enlace: '/panel/reservas',
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('No se pudo crear la notificacion de reserva:', error.message);
  }

  return reserva;
};

const listarReservasViajero = async (viajeroId) =>
  Reserva.findAll({
    where: { viajeroId },
    include: [{ model: Propiedad, as: 'propiedad', include: [{ model: Usuario, as: 'anfitrion', attributes: ['id', 'nombre'] }] }],
    order: [['fechaInicio', 'DESC']],
  });

const listarReservasAnfitrion = async (anfitrionId) =>
  Reserva.findAll({
    include: [
      { model: Propiedad, as: 'propiedad', where: { anfitrionId }, required: true },
      { model: Usuario, as: 'viajero', attributes: ['id', 'nombre', 'email'] },
    ],
    order: [['fechaInicio', 'DESC']],
  });

const cancelarReserva = async (id, usuario) => {
  const reserva = await Reserva.findByPk(id, { include: [{ model: Propiedad, as: 'propiedad' }] });
  if (!reserva) {
    throw crearError('Reserva no encontrada.', 404);
  }

  const esViajero = reserva.viajeroId === usuario.id;
  const esAnfitrion = reserva.propiedad?.anfitrionId === usuario.id;
  if (!esViajero && !esAnfitrion && usuario.rol !== 'admin') {
    throw crearError('No puedes cancelar esta reserva.', 403);
  }

  reserva.estado = 'cancelada';
  await reserva.save();
  return reserva;
};

const fechasOcupadas = async (propiedadId) => {
  const reservas = await Reserva.findAll({
    where: { propiedadId, estado: { [Op.ne]: 'cancelada' } },
    attributes: ['fechaInicio', 'fechaFin'],
  });
  return reservas.map((r) => ({ inicio: r.fechaInicio, fin: r.fechaFin }));
};

export {
  crearReserva,
  listarReservasViajero,
  listarReservasAnfitrion,
  cancelarReserva,
  fechasOcupadas,
  calcularNoches,
};
