import { Router } from 'express';

import {
  formularioLogin,
  formularioRegistro,
  formularioOlvidePassword,
  paginaInicio,
  confirmarCuenta,
  formularioReestablecerPassword,
  paginaMensaje,
} from '../controllers/pageController.js';

const router = Router();

router.get('/', paginaInicio);
router.get('/login', formularioLogin);
router.get('/registro', formularioRegistro);
router.get('/olvide-password', formularioOlvidePassword);
router.get('/confirmar/:token', confirmarCuenta);
router.get('/reestablecer-password/:token', formularioReestablecerPassword);
router.get('/mensaje', paginaMensaje);

export default router;
