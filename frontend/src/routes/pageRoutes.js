import { Router } from 'express';

import { paginaInicio, detallePropiedad } from '../controllers/pageController.js';

const router = Router();

router.get('/', paginaInicio);
router.get('/propiedades/:id', detallePropiedad);

export default router;
