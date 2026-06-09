import { validationResult } from 'express-validator';

import { crearResena } from '../services/resenaService.js';

const crear = async (req, res, next) => {
  const errores = validationResult(req);
  if (!errores.isEmpty()) {
    return res.status(422).json({ ok: false, message: 'Revisa los datos.', errors: errores.array() });
  }
  try {
    const resena = await crearResena(req.usuario.id, req.body);
    res.status(201).json({ ok: true, message: 'Resena publicada.', resena });
  } catch (error) {
    next(error);
  }
};

export { crear };
