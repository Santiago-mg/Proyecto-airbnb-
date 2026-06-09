import { Resena, Reserva, Propiedad } from '../models/index.js';
import { crearError } from '../helpers/errors.js';

const crearResena = async (autorId, { propiedadId, calificacion, comentario }) => {
  const propiedad = await Propiedad.findByPk(propiedadId);
  if (!propiedad) {
    throw crearError('Propiedad no encontrada.', 404);
  }

  // Solo puede resenar quien ha reservado la propiedad.
  const haReservado = await Reserva.findOne({ where: { propiedadId, viajeroId: autorId } });
  if (!haReservado && propiedad.anfitrionId !== autorId) {
    throw crearError('Solo puedes resenar propiedades en las que te has hospedado.', 403);
  }

  const resena = await Resena.create({ propiedadId, autorId, calificacion, comentario });
  return resena;
};

const listarFavoritosResenas = async (propiedadId) =>
  Resena.findAll({ where: { propiedadId, oculta: false }, order: [['createdAt', 'DESC']] });

export { crearResena, listarFavoritosResenas };
