import { Router } from 'express';

import { alternar, listar } from '../controllers/favoritoController.js';
import { proteger } from '../middlewares/auth.js';

const router = Router();

router.get('/', proteger, listar);
router.post('/:propiedadId', proteger, alternar);

export default router;
