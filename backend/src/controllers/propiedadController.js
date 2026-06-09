import { validationResult } from 'express-validator';

import {
  listarPropiedades, obtenerPropiedad, crearPropiedad,
  actualizarPropiedad, eliminarPropiedad, listarPorAnfitrion,
} from '../services/propiedadService.js';
import { fechasOcupadas } from '../services/reservaService.js';

const listar = async (req, res, next) => {
  try {
    const propiedades = await listarPropiedades(req.query);
    res.json({ ok: true, propiedades });
  } catch (error) {
    next(error);
  }
};

const detalle = async (req, res, next) => {
  try {
    const propiedad = await obtenerPropiedad(req.params.id, { contarVista: true });
    const ocupadas = await fechasOcupadas(req.params.id);
    res.json({ ok: true, propiedad, ocupadas });
  } catch (error) {
    next(error);
  }
};

const misPropiedades = async (req, res, next) => {
  try {
    const propiedades = await listarPorAnfitrion(req.usuario.id);
    res.json({ ok: true, propiedades });
  } catch (error) {
    next(error);
  }
};

const crear = async (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ ok: false, message: 'Revisa los datos.', errors: errores.array() });
  }
  try {
    const propiedad = await crearPropiedad(req.usuario.id, req.body);
    res.status(201).json({ ok: true, message: 'Propiedad creada. Queda pendiente de aprobacion.', propiedad });
  } catch (error) {
    next(error);
  }
};

const actualizar = async (req, res, next) => {
  try {
    const propiedad = await actualizarPropiedad(req.params.id, req.usuario, req.body);
    res.json({ ok: true, message: 'Propiedad actualizada.', propiedad });
  } catch (error) {
    next(error);
  }
};

const eliminar = async (req, res, next) => {
  try {
    await eliminarPropiedad(req.params.id, req.usuario);
    res.json({ ok: true, message: 'Propiedad eliminada.' });
  } catch (error) {
    next(error);
  }
};

export { listar, detalle, misPropiedades, crear, actualizar, eliminar };
