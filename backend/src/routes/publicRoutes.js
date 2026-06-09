import { Router } from 'express';

import { categorias, anuncio, sugerencias } from '../controllers/publicController.js';

const router = Router();

router.get('/categorias', categorias);
router.get('/anuncio', anuncio);
router.get('/sugerencias', sugerencias);

export default router;
