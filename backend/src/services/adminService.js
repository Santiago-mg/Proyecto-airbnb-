import { Op, fn, col, literal } from 'sequelize';

import {
  Usuario, Propiedad, Reserva, Resena, Categoria, Anuncio, AuditLog,
} from '../models/index.js';
import { crearError } from '../helpers/errors.js';

// ---- Bitacora de auditoria ----
const registrarAuditoria = async (admin, accion, { detalle, entidad, entidadId } = {}) => {
  try {
    await AuditLog.create({
      accion,
      detalle,
      entidad,
      entidadId,
      adminId: admin?.id || null,
      adminNombre: admin?.nombre || 'sistema',
    });
  } catch (error) {
    // No interrumpe la operacion principal si falla la auditoria.
  }
};

// ---- Dashboard / metricas ----
const obtenerMetricas = async () => {
  const [
    totalUsuarios,
    totalAnfitriones,
    totalPropiedades,
    propiedadesPendientes,
    totalReservas,
    ingresos,
    totalResenas,
  ] = await Promise.all([
    Usuario.count(),
    Usuario.count({ where: { rol: 'anfitrion' } }),
    Propiedad.count(),
    Propiedad.count({ where: { estado: 'pendiente' } }),
    Reserva.count({ where: { estado: { [Op.ne]: 'cancelada' } } }),
    Reserva.sum('total', { where: { estado: { [Op.ne]: 'cancelada' } } }),
    Resena.count(),
  ]);

  // Reservas e ingresos por mes (ultimos 6 meses).
  const reservasPorMes = await Reserva.findAll({
    attributes: [
      [fn('DATE_FORMAT', col('createdAt'), '%Y-%m'), 'mes'],
      [fn('COUNT', col('id')), 'reservas'],
      [fn('SUM', col('total')), 'ingresos'],
    ],
    where: { estado: { [Op.ne]: 'cancelada' } },
    group: [literal('mes')],
    order: [literal('mes ASC')],
    raw: true,
  });

  // Propiedades por categoria.
  const porCategoria = await Propiedad.findAll({
    attributes: [
      [col('categoria.nombre'), 'categoria'],
      [fn('COUNT', col('propiedades.id')), 'total'],
    ],
    include: [{ model: Categoria, as: 'categoria', attributes: [] }],
    group: ['categoria.id', 'categoria.nombre'],
    raw: true,
  });

  // Top 5 propiedades por reservas.
  const topPropiedades = await Reserva.findAll({
    attributes: [
      [col('propiedad.titulo'), 'titulo'],
      [col('propiedad.ciudad'), 'ciudad'],
      [fn('COUNT', col('reservas.id')), 'reservas'],
      [fn('SUM', col('reservas.total')), 'ingresos'],
    ],
    include: [{ model: Propiedad, as: 'propiedad', attributes: [] }],
    where: { estado: { [Op.ne]: 'cancelada' } },
    group: ['propiedad.id', 'propiedad.titulo', 'propiedad.ciudad'],
    order: [literal('reservas DESC')],
    limit: 5,
    raw: true,
  });

  return {
    tarjetas: {
      totalUsuarios,
      totalAnfitriones,
      totalPropiedades,
      propiedadesPendientes,
      totalReservas,
      ingresos: Number(ingresos || 0),
      totalResenas,
    },
    reservasPorMes,
    porCategoria,
    topPropiedades,
  };
};

// ---- Gestion de usuarios ----
const listarUsuarios = async (filtros = {}) => {
  const where = {};
  if (filtros.q) {
    where[Op.or] = [
      { nombre: { [Op.like]: `%${filtros.q}%` } },
      { email: { [Op.like]: `%${filtros.q}%` } },
    ];
  }
  if (filtros.rol) where.rol = filtros.rol;

  return Usuario.findAll({ where, order: [['createdAt', 'DESC']] });
};

const actualizarUsuario = async (admin, id, datos) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) throw crearError('Usuario no encontrado.', 404);

  if (datos.rol && ['viajero', 'anfitrion', 'admin'].includes(datos.rol)) {
    usuario.rol = datos.rol;
  }
  if (datos.activo !== undefined) usuario.activo = Boolean(datos.activo);
  if (datos.verificado !== undefined) usuario.verificado = Boolean(datos.verificado);

  await usuario.save();
  await registrarAuditoria(admin, 'Actualizo usuario', {
    detalle: `${usuario.email} -> rol:${usuario.rol} activo:${usuario.activo} verificado:${usuario.verificado}`,
    entidad: 'usuario',
    entidadId: usuario.id,
  });
  return usuario;
};

// ---- Moderacion de propiedades ----
const listarPropiedadesAdmin = async (filtros = {}) => {
  const where = {};
  if (filtros.estado) where.estado = filtros.estado;
  return Propiedad.findAll({
    where,
    include: [{ model: Usuario, as: 'anfitrion', attributes: ['id', 'nombre', 'email'] }, { model: Categoria, as: 'categoria' }],
    order: [['createdAt', 'DESC']],
  });
};

const moderarPropiedad = async (admin, id, accion) => {
  const propiedad = await Propiedad.findByPk(id);
  if (!propiedad) throw crearError('Propiedad no encontrada.', 404);

  if (accion === 'aprobar') propiedad.estado = 'aprobada';
  else if (accion === 'rechazar') propiedad.estado = 'rechazada';
  else if (accion === 'destacar') propiedad.destacada = !propiedad.destacada;
  else throw crearError('Accion no valida.', 400);

  await propiedad.save();
  await registrarAuditoria(admin, `Modero propiedad (${accion})`, {
    detalle: propiedad.titulo,
    entidad: 'propiedad',
    entidadId: propiedad.id,
  });
  return propiedad;
};

// ---- Moderacion de resenas ----
const listarResenasAdmin = async () =>
  Resena.findAll({
    include: [
      { model: Usuario, as: 'autor', attributes: ['id', 'nombre'] },
      { model: Propiedad, as: 'propiedad', attributes: ['id', 'titulo'] },
    ],
    order: [['createdAt', 'DESC']],
  });

const moderarResena = async (admin, id, accion) => {
  const resena = await Resena.findByPk(id);
  if (!resena) throw crearError('Resena no encontrada.', 404);

  if (accion === 'ocultar') resena.oculta = true;
  else if (accion === 'mostrar') resena.oculta = false;
  else if (accion === 'eliminar') {
    await resena.destroy();
    await registrarAuditoria(admin, 'Elimino resena', { entidad: 'resena', entidadId: id });
    return null;
  } else throw crearError('Accion no valida.', 400);

  await resena.save();
  await registrarAuditoria(admin, `Modero resena (${accion})`, { entidad: 'resena', entidadId: id });
  return resena;
};

// ---- Anuncios globales ----
const listarAnuncios = async () => Anuncio.findAll({ order: [['createdAt', 'DESC']] });

const anuncioActivo = async () =>
  Anuncio.findOne({ where: { activo: true }, order: [['createdAt', 'DESC']] });

const crearAnuncio = async (admin, datos) => {
  const anuncio = await Anuncio.create(datos);
  await registrarAuditoria(admin, 'Publico anuncio', { detalle: anuncio.titulo, entidad: 'anuncio', entidadId: anuncio.id });
  return anuncio;
};

const alternarAnuncio = async (admin, id) => {
  const anuncio = await Anuncio.findByPk(id);
  if (!anuncio) throw crearError('Anuncio no encontrado.', 404);
  anuncio.activo = !anuncio.activo;
  await anuncio.save();
  await registrarAuditoria(admin, 'Cambio estado de anuncio', { entidad: 'anuncio', entidadId: id });
  return anuncio;
};

const eliminarAnuncio = async (admin, id) => {
  const anuncio = await Anuncio.findByPk(id);
  if (!anuncio) throw crearError('Anuncio no encontrado.', 404);
  await anuncio.destroy();
  await registrarAuditoria(admin, 'Elimino anuncio', { entidad: 'anuncio', entidadId: id });
  return true;
};

// ---- Bitacora ----
const listarAuditoria = async () =>
  AuditLog.findAll({ order: [['createdAt', 'DESC']], limit: 100 });

// ---- Motor de precios dinamicos (sugerencias) ----
// Compara cada propiedad con el promedio de su ciudad/categoria y sugiere ajuste.
const sugerenciasPrecio = async () => {
  const propiedades = await Propiedad.findAll({
    where: { estado: 'aprobada' },
    include: [{ model: Categoria, as: 'categoria', attributes: ['nombre'] }],
  });

  const promedios = await Propiedad.findAll({
    attributes: ['ciudad', [fn('AVG', col('precioNoche')), 'promedio']],
    where: { estado: 'aprobada' },
    group: ['ciudad'],
    raw: true,
  });
  const mapaPromedio = Object.fromEntries(promedios.map((p) => [p.ciudad, Number(p.promedio)]));

  return propiedades.map((p) => {
    const promedio = mapaPromedio[p.ciudad] || Number(p.precioNoche);
    const actual = Number(p.precioNoche);
    const diferencia = promedio ? ((actual - promedio) / promedio) * 100 : 0;
    let recomendacion = 'Precio alineado con el mercado.';
    let sugerido = actual;
    if (diferencia > 20) {
      recomendacion = 'Por encima del mercado: considera bajar para mejorar ocupacion.';
      sugerido = Math.round(promedio * 1.05);
    } else if (diferencia < -20) {
      recomendacion = 'Por debajo del mercado: puedes subir el precio.';
      sugerido = Math.round(promedio * 0.95);
    }
    return {
      id: p.id,
      titulo: p.titulo,
      ciudad: p.ciudad,
      categoria: p.categoria?.nombre || 'Sin categoria',
      precioActual: actual,
      promedioCiudad: Math.round(promedio),
      diferencia: Math.round(diferencia),
      sugerido,
      recomendacion,
    };
  });
};

export {
  registrarAuditoria,
  obtenerMetricas,
  listarUsuarios,
  actualizarUsuario,
  listarPropiedadesAdmin,
  moderarPropiedad,
  listarResenasAdmin,
  moderarResena,
  listarAnuncios,
  anuncioActivo,
  crearAnuncio,
  alternarAnuncio,
  eliminarAnuncio,
  listarAuditoria,
  sugerenciasPrecio,
};
