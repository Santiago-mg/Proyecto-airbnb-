import { Router } from 'express';
import { body } from 'express-validator';

import { crear } from '../controllers/resenaController.js';
import { proteger } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/',
  proteger,
  [
    body('propiedadId').isInt().withMessage('Propiedad invalida.'),
    body('calificacion').isInt({ min: 1, max: 5 }).withMessage('La calificacion debe ser entre 1 y 5.'),
    body('comentario').trim().isLength({ min: 5 }).withMessage('El comentario es muy corto.'),
  ],
  crear,
);

export default router;
