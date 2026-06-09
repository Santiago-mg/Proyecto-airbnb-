import { Router } from 'express';
import { body } from 'express-validator';

import {
  crear, misReservas, reservasRecibidas, cancelar,
} from '../controllers/reservaController.js';
import { proteger, permitir } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/',
  proteger,
  [
    body('propiedadId').isInt().withMessage('Propiedad invalida.'),
    body('fechaInicio').isISO8601().withMessage('Fecha de inicio invalida.'),
    body('fechaFin').isISO8601().withMessage('Fecha de fin invalida.'),
    body('huespedes').isInt({ min: 1 }).withMessage('Numero de huespedes invalido.'),
  ],
  crear,
);

router.get('/mias', proteger, misReservas);
router.get('/recibidas', proteger, permitir('anfitrion', 'admin'), reservasRecibidas);
router.patch('/:id/cancelar', proteger, cancelar);

export default router;
