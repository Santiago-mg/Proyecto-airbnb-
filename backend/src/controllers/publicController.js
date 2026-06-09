import { Op, fn, col } from 'sequelize';

import { Categoria, Propiedad } from '../models/index.js';
import { anuncioActivo } from '../services/adminService.js';

// Lista curada de destinos populares en Colombia (usada como fallback).
const DESTINOS_COLOMBIA = [
  'Bogota', 'Medellin', 'Cartagena', 'Santa Marta', 'Cali', 'Barranquilla',
  'Bucaramanga', 'Pereira', 'Manizales', 'Villavicencio', 'Pasto', 'Ibague',
  'Cucuta', 'Armenia', 'Monteria', 'Neiva', 'Popayan', 'Tunja', 'Valledupar',
  'Guatape', 'Villa de Leyva', 'Barichara', 'Salento', 'Jardin', 'Jerico',
  'San Andres', 'Providencia', 'Leticia', 'Mompox', 'El Penol', 'Capurgana',
  'Nuqui', 'Filandia', 'Taganga', 'Palomino', 'Tierralta', 'Baru',
];

const categorias = async (req, res, next) => {
  try {
    const lista = await Categoria.findAll({ order: [['nombre', 'ASC']] });
    res.json({ ok: true, categorias: lista });
  } catch (error) {
    next(error);
  }
};

const anuncio = async (req, res, next) => {
  try {
    const activo = await anuncioActivo();
    res.json({ ok: true, anuncio: activo });
  } catch (error) {
    next(error);
  }
};

// Sugerencias de destino: combina ciudades de la BD + lista curada.
const sugerencias = async (req, res, next) => {
  try {
    const q = (req.query.q || '').trim();
    if (!q || q.length < 2) {
      return res.json({ ok: true, ciudades: [] });
    }

    const qLower = q.toLowerCase();

    // Ciudades de propiedades aprobadas en la BD.
    const filas = await Propiedad.findAll({
      attributes: [[fn('DISTINCT', col('ciudad')), 'ciudad']],
      where: {
        ciudad: { [Op.like]: `%${q}%` },
        estado: 'aprobada',
        activa: true,
      },
      raw: true,
    });
    const ciudadesDB = filas.map((r) => r.ciudad);

    // Lista curada filtrada.
    const ciudadesCuradas = DESTINOS_COLOMBIA.filter((c) =>
      c.toLowerCase().includes(qLower),
    );

    // Merge sin duplicados (DB primero, son destinos reales disponibles).
    const vistas = new Set(ciudadesDB.map((c) => c.toLowerCase()));
    const combinadas = [
      ...ciudadesDB,
      ...ciudadesCuradas.filter((c) => !vistas.has(c.toLowerCase())),
    ].slice(0, 8);

    return res.json({ ok: true, ciudades: combinadas });
  } catch (error) {
    return next(error);
  }
};

export { categorias, anuncio, sugerencias };
