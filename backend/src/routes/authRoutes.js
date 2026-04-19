import { Router } from 'express';
import { body, param } from 'express-validator';

import {
  autenticar,
  confirmarCuenta,
  olvidePassword,
  registrar,
  reestablecerPassword,
} from '../controllers/authController.js';

const router = Router();

router.post(
  '/registro',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('email')
      .trim()
      .isEmail()
      .withMessage('No es un email valido.')
      .normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('El password debe tener al menos 6 caracteres.'),
    body('repetir_password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Los passwords no son iguales.'),
  ],
  registrar,
);

router.post(
  '/login',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('No es un email valido.')
      .normalizeEmail(),
    body('password').trim().notEmpty().withMessage('El password es obligatorio.'),
  ],
  autenticar,
);

router.post(
  '/olvide-password',
  [
    body('email')
      .trim()
      .isEmail()
      .withMessage('No es un email valido.')
      .normalizeEmail(),
  ],
  olvidePassword,
);

router.get(
  '/confirmar/:token',
  [param('token').trim().notEmpty().withMessage('El token es obligatorio.')],
  confirmarCuenta,
);

router.post(
  '/reestablecer-password/:token',
  [
    param('token').trim().notEmpty().withMessage('El token es obligatorio.'),
    body('password')
      .trim()
      .isLength({ min: 6 })
      .withMessage('El password debe tener al menos 6 caracteres.'),
    body('repetir_password')
      .custom((value, { req }) => value === req.body.password)
      .withMessage('Los passwords no son iguales.'),
  ],
  reestablecerPassword,
);

export default router;
