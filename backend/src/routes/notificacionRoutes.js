import { Router } from 'express';

import { listar, leer, leerTodas } from '../controllers/notificacionController.js';
import { proteger } from '../middlewares/auth.js';

const router = Router();

router.get('/', proteger, listar);
router.patch('/leer-todas', proteger, leerTodas);
router.patch('/:id/leer', proteger, leer);

export default router;
