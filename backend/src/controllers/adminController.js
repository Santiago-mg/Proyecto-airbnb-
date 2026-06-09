import {
  obtenerMetricas, listarUsuarios, actualizarUsuario,
  listarPropiedadesAdmin, moderarPropiedad, listarResenasAdmin, moderarResena,
  listarAnuncios, crearAnuncio, alternarAnuncio, eliminarAnuncio,
  listarAuditoria, sugerenciasPrecio,
} from '../services/adminService.js';
import { listarReservasViajero } from '../services/reservaService.js';
import { Reserva, Propiedad, Usuario } from '../models/index.js';

const metricas = async (req, res, next) => {
  try {
    res.json({ ok: true, ...(await obtenerMetricas()) });
  } catch (error) {
    next(error);
  }
};

const usuarios = async (req, res, next) => {
  try {
    res.json({ ok: true, usuarios: await listarUsuarios(req.query) });
  } catch (error) {
    next(error);
  }
};

const editarUsuario = async (req, res, next) => {
  try {
    const usuario = await actualizarUsuario(req.usuario, req.params.id, req.body);
    res.json({ ok: true, message: 'Usuario actualizado.', usuario });
  } catch (error) {
    next(error);
  }
};

const propiedades = async (req, res, next) => {
  try {
    res.json({ ok: true, propiedades: await listarPropiedadesAdmin(req.query) });
  } catch (error) {
    next(error);
  }
};

const moderarPropiedadCtrl = async (req, res, next) => {
  try {
    const propiedad = await moderarPropiedad(req.usuario, req.params.id, req.body.accion);
    res.json({ ok: true, message: 'Propiedad actualizada.', propiedad });
  } catch (error) {
    next(error);
  }
};

const resenas = async (req, res, next) => {
  try {
    res.json({ ok: true, resenas: await listarResenasAdmin() });
  } catch (error) {
    next(error);
  }
};

const moderarResenaCtrl = async (req, res, next) => {
  try {
    const resena = await moderarResena(req.usuario, req.params.id, req.body.accion);
    res.json({ ok: true, message: 'Resena actualizada.', resena });
  } catch (error) {
    next(error);
  }
};

const anuncios = async (req, res, next) => {
  try {
    res.json({ ok: true, anuncios: await listarAnuncios() });
  } catch (error) {
    next(error);
  }
};

const crearAnuncioCtrl = async (req, res, next) => {
  try {
    const anuncio = await crearAnuncio(req.usuario, req.body);
    res.status(201).json({ ok: true, message: 'Anuncio publicado.', anuncio });
  } catch (error) {
    next(error);
  }
};

const alternarAnuncioCtrl = async (req, res, next) => {
  try {
    const anuncio = await alternarAnuncio(req.usuario, req.params.id);
    res.json({ ok: true, message: 'Anuncio actualizado.', anuncio });
  } catch (error) {
    next(error);
  }
};

const eliminarAnuncioCtrl = async (req, res, next) => {
  try {
    await eliminarAnuncio(req.usuario, req.params.id);
    res.json({ ok: true, message: 'Anuncio eliminado.' });
  } catch (error) {
    next(error);
  }
};

const auditoria = async (req, res, next) => {
  try {
    res.json({ ok: true, registros: await listarAuditoria() });
  } catch (error) {
    next(error);
  }
};

const precios = async (req, res, next) => {
  try {
    res.json({ ok: true, sugerencias: await sugerenciasPrecio() });
  } catch (error) {
    next(error);
  }
};

// Exportacion de reservas a CSV.
const exportarReservas = async (req, res, next) => {
  try {
    const reservas = await Reserva.findAll({
      include: [
        { model: Propiedad, as: 'propiedad', attributes: ['titulo', 'ciudad'] },
        { model: Usuario, as: 'viajero', attributes: ['nombre', 'email'] },
      ],
      order: [['createdAt', 'DESC']],
    });

    const cabecera = 'id,propiedad,ciudad,viajero,email,fechaInicio,fechaFin,noches,total,estado\n';
    const filas = reservas.map((r) => [
      r.id,
      `"${r.propiedad?.titulo || ''}"`,
      `"${r.propiedad?.ciudad || ''}"`,
      `"${r.viajero?.nombre || ''}"`,
      r.viajero?.email || '',
      r.fechaInicio,
      r.fechaFin,
      r.noches,
      r.total,
      r.estado,
    ].join(',')).join('\n');

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="reservas.csv"');
    res.send(cabecera + filas);
  } catch (error) {
    next(error);
  }
};

export {
  metricas, usuarios, editarUsuario, propiedades, moderarPropiedadCtrl,
  resenas, moderarResenaCtrl, anuncios, crearAnuncioCtrl, alternarAnuncioCtrl,
  eliminarAnuncioCtrl, auditoria, precios, exportarReservas,
};
