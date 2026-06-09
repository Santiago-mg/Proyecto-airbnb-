import { Router } from 'express';

import {
  formularioLogin, procesarLogin, formularioRegistro, procesarRegistro,
  formularioOlvide, procesarOlvide, logout,
} from '../controllers/authPageController.js';

const router = Router();

router.get('/login', formularioLogin);
router.post('/login', procesarLogin);
router.get('/registro', formularioRegistro);
router.post('/registro', procesarRegistro);
router.get('/olvide-password', formularioOlvide);
router.post('/olvide-password', procesarOlvide);
router.get('/logout', logout);
router.post('/logout', logout);

export default router;
