import { validationResult } from 'express-validator';

import {
  crearReserva, listarReservasViajero, listarReservasAnfitrion, cancelarReserva,
} from '../services/reservaService.js';

const crear = async (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ ok: false, message: 'Revisa los datos.', errors: errores.array() });
  }
  try {
    const reserva = await crearReserva(req.usuario.id, req.body);
    res.status(201).json({ ok: true, message: 'Reserva confirmada.', reserva });
  } catch (error) {
    next(error);
  }
};

const misReservas = async (req, res, next) => {
  try {
    const reservas = await listarReservasViajero(req.usuario.id);
    res.json({ ok: true, reservas });
  } catch (error) {
    next(error);
  }
};

const reservasRecibidas = async (req, res, next) => {
  try {
    const reservas = await listarReservasAnfitrion(req.usuario.id);
    res.json({ ok: true, reservas });
  } catch (error) {
    next(error);
  }
};

const cancelar = async (req, res, next) => {
  try {
    const reserva = await cancelarReserva(req.params.id, req.usuario);
    res.json({ ok: true, message: 'Reserva cancelada.', reserva });
  } catch (error) {
    next(error);
  }
};

export { crear, misReservas, reservasRecibidas, cancelar };
