import { Op, fn, col } from 'sequelize';

import { Propiedad, Usuario, Categoria, Resena, Reserva } from '../models/index.js';
import { crearError } from '../helpers/errors.js';

const incluirRelaciones = [
  { model: Usuario, as: 'anfitrion', attributes: ['id', 'nombre', 'avatar', 'verificado'] },
  { model: Categoria, as: 'categoria' },
];

// Calcula rating promedio y numero de resenas para una propiedad.
const adjuntarRating = async (propiedad) => {
  const stats = await Resena.findOne({
    where: { propiedadId: propiedad.id, oculta: false },
    attributes: [
      [fn('AVG', col('calificacion')), 'promedio'],
      [fn('COUNT', col('id')), 'total'],
    ],
    raw: true,
  });

  const plain = propiedad.toJSON ? propiedad.toJSON() : propiedad;
  plain.rating = stats?.promedio ? Number(Number(stats.promedio).toFixed(2)) : null;
  plain.totalResenas = stats?.total ? Number(stats.total) : 0;
  return plain;
};

const listarPropiedades = async (filtros = {}) => {
  const where = { estado: 'aprobada', activa: true };

  if (filtros.ciudad) {
    where.ciudad = { [Op.like]: `%${filtros.ciudad}%` };
  }
  if (filtros.categoriaId) {
    where.categoriaId = filtros.categoriaId;
  }
  if (filtros.huespedes) {
    where.huespedes = { [Op.gte]: Number(filtros.huespedes) };
  }
  if (filtros.precioMin || filtros.precioMax) {
    where.precioNoche = {};
    if (filtros.precioMin) where.precioNoche[Op.gte] = Number(filtros.precioMin);
    if (filtros.precioMax) where.precioNoche[Op.lte] = Number(filtros.precioMax);
  }
  if (filtros.q) {
    where[Op.or] = [
      { titulo: { [Op.like]: `%${filtros.q}%` } },
      { ciudad: { [Op.like]: `%${filtros.q}%` } },
      { descripcion: { [Op.like]: `%${filtros.q}%` } },
    ];
  }

  let orden = [['destacada', 'DESC'], ['createdAt', 'DESC']];
  if (filtros.orden === 'precio_asc') orden = [['precioNoche', 'ASC']];
  if (filtros.orden === 'precio_desc') orden = [['precioNoche', 'DESC']];
  if (filtros.orden === 'populares') orden = [['vistas', 'DESC']];

  const propiedades = await Propiedad.findAll({
    where,
    include: incluirRelaciones,
    order: orden,
  });

  return Promise.all(propiedades.map(adjuntarRating));
};

const obtenerPropiedad = async (id, { contarVista = false } = {}) => {
  const propiedad = await Propiedad.findByPk(id, {
    include: [
      ...incluirRelaciones,
      {
        model: Resena,
        as: 'resenas',
        where: { oculta: false },
        required: false,
        include: [{ model: Usuario, as: 'autor', attributes: ['id', 'nombre', 'avatar'] }],
      },
    ],
    order: [[{ model: Resena, as: 'resenas' }, 'createdAt', 'DESC']],
  });

  if (!propiedad) {
    throw crearError('Propiedad no encontrada.', 404);
  }

  if (contarVista) {
    await propiedad.increment('vistas');
  }

  return adjuntarRating(propiedad);
};

const crearPropiedad = async (anfitrionId, datos) => {
  const propiedad = await Propiedad.create({
    ...datos,
    anfitrionId,
    estado: 'pendiente',
  });
  return propiedad;
};

const actualizarPropiedad = async (id, usuario, datos) => {
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    throw crearError('Propiedad no encontrada.', 404);
  }

  const esDueno = propiedad.anfitrionId === usuario.id;
  if (!esDueno && usuario.rol !== 'admin') {
    throw crearError('No puedes editar esta propiedad.', 403);
  }

  const campos = [
    'titulo', 'descripcion', 'ciudad', 'pais', 'direccion', 'lat', 'lng',
    'precioNoche', 'huespedes', 'habitaciones', 'camas', 'banos',
    'servicios', 'imagenes', 'categoriaId', 'activa',
  ];
  campos.forEach((campo) => {
    if (datos[campo] !== undefined) {
      propiedad[campo] = datos[campo];
    }
  });

  // Una edicion del anfitrion vuelve a moderacion.
  if (esDueno && usuario.rol !== 'admin') {
    propiedad.estado = 'pendiente';
  }

  await propiedad.save();
  return propiedad;
};

const eliminarPropiedad = async (id, usuario) => {
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) {
    throw crearError('Propiedad no encontrada.', 404);
  }
  if (propiedad.anfitrionId !== usuario.id && usuario.rol !== 'admin') {
    throw crearError('No puedes eliminar esta propiedad.', 403);
  }
  await propiedad.destroy();
  return true;
};

const listarPorAnfitrion = async (anfitrionId) => {
  const propiedades = await Propiedad.findAll({
    where: { anfitrionId },
    include: incluirRelaciones,
    order: [['createdAt', 'DESC']],
  });
  return Promise.all(propiedades.map(adjuntarRating));
};

export {
  listarPropiedades,
  obtenerPropiedad,
  crearPropiedad,
  actualizarPropiedad,
  eliminarPropiedad,
  listarPorAnfitrion,
  adjuntarRating,
};
