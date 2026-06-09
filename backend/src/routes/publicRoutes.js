import { Router } from 'express';

import { categorias, anuncio } from '../controllers/publicController.js';

const router = Router();

router.get('/categorias', categorias);
router.get('/anuncio', anuncio);

export default router;
