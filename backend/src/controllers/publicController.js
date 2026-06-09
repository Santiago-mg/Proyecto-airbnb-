import { Categoria } from '../models/index.js';
import { anuncioActivo } from '../services/adminService.js';

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

export { categorias, anuncio };
