import { Favorito, Propiedad, Usuario, Categoria } from '../models/index.js';
import { adjuntarRating } from './propiedadService.js';

const alternarFavorito = async (usuarioId, propiedadId) => {
  const existente = await Favorito.findOne({ where: { usuarioId, propiedadId } });

  if (existente) {
    await existente.destroy();
    return { favorito: false };
  }

  await Favorito.create({ usuarioId, propiedadId });
  return { favorito: true };
};

const listarFavoritos = async (usuarioId) => {
  const favoritos = await Favorito.findAll({
    where: { usuarioId },
    include: [
      {
        model: Propiedad,
        as: 'propiedad',
        include: [
          { model: Usuario, as: 'anfitrion', attributes: ['id', 'nombre', 'avatar'] },
          { model: Categoria, as: 'categoria' },
        ],
      },
    ],
    order: [['createdAt', 'DESC']],
  });

  const propiedades = favoritos.map((f) => f.propiedad).filter(Boolean);
  return Promise.all(propiedades.map(adjuntarRating));
};

const idsFavoritos = async (usuarioId) => {
  const favoritos = await Favorito.findAll({ where: { usuarioId }, attributes: ['propiedadId'] });
  return favoritos.map((f) => f.propiedadId);
};

export { alternarFavorito, listarFavoritos, idsFavoritos };
