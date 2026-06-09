import { Router } from 'express';

import {
  panel, usuarios, propiedades, resenas, anuncios, auditoria, precios,
} from '../controllers/adminPageController.js';
import { requiereSesion, requiereRol } from '../middlewares/sesion.js';

const router = Router();

router.use(requiereSesion, requiereRol('admin'));

router.get('/', panel);
router.get('/usuarios', usuarios);
router.get('/propiedades', propiedades);
router.get('/resenas', resenas);
router.get('/anuncios', anuncios);
router.get('/auditoria', auditoria);
router.get('/precios', precios);

export default router;
