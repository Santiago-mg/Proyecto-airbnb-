import { Router } from 'express';
import { body } from 'express-validator';

import {
  listar, detalle, misPropiedades, crear, actualizar, eliminar,
} from '../controllers/propiedadController.js';
import { proteger, permitir } from '../middlewares/auth.js';

const router = Router();

const validarPropiedad = [
  body('titulo').trim().notEmpty().withMessage('El titulo es obligatorio.'),
  body('descripcion').trim().isLength({ min: 10 }).withMessage('La descripcion debe tener al menos 10 caracteres.'),
  body('ciudad').trim().notEmpty().withMessage('La ciudad es obligatoria.'),
  body('precioNoche').isFloat({ gt: 0 }).withMessage('El precio por noche debe ser mayor a 0.'),
];

router.get('/', listar);
router.get('/mias', proteger, permitir('anfitrion', 'admin'), misPropiedades);
router.get('/:id', detalle);
router.post('/', proteger, permitir('anfitrion', 'admin'), validarPropiedad, crear);
router.put('/:id', proteger, actualizar);
router.delete('/:id', proteger, eliminar);

export default router;
