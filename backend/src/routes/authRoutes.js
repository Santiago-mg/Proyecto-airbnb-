import { Router } from 'express';
import { body } from 'express-validator';

import { registrar, login, logout, perfil, actualizar } from '../controllers/authController.js';
import { proteger } from '../middlewares/auth.js';

const router = Router();

router.post(
  '/registro',
  [
    body('nombre').trim().notEmpty().withMessage('El nombre es obligatorio.'),
    body('email').trim().isEmail().withMessage('No es un email valido.').normalizeEmail(),
    body('password').isLength({ min: 6 }).withMessage('El password debe tener al menos 6 caracteres.'),
    body('repetir_password').custom((v, { req }) => v === req.body.password).withMessage('Los passwords no son iguales.'),
  ],
  registrar,
);

router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('No es un email valido.').normalizeEmail(),
    body('password').notEmpty().withMessage('El password es obligatorio.'),
  ],
  login,
);

router.post('/logout', logout);
router.get('/perfil', proteger, perfil);
router.put('/perfil', proteger, actualizar);

export default router;
