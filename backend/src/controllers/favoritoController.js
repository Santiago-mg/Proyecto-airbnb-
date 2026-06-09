import { alternarFavorito, listarFavoritos } from '../services/favoritoService.js';

const alternar = async (req, res, next) => {
  try {
    const resultado = await alternarFavorito(req.usuario.id, req.params.propiedadId);
    res.json({ ok: true, ...resultado });
  } catch (error) {
    next(error);
  }
};

const listar = async (req, res, next) => {
  try {
    const propiedades = await listarFavoritos(req.usuario.id);
    res.json({ ok: true, propiedades });
  } catch (error) {
    next(error);
  }
};

export { alternar, listar };
