import { Router } from 'express';
import { body } from 'express-validator';

import {
  metricas, usuarios, editarUsuario, propiedades, moderarPropiedadCtrl,
  resenas, moderarResenaCtrl, anuncios, crearAnuncioCtrl, alternarAnuncioCtrl,
  eliminarAnuncioCtrl, auditoria, precios, exportarReservas,
} from '../controllers/adminController.js';
import { proteger, permitir } from '../middlewares/auth.js';

const router = Router();

// Todas las rutas requieren rol admin.
router.use(proteger, permitir('admin'));

router.get('/metricas', metricas);

router.get('/usuarios', usuarios);
router.patch('/usuarios/:id', editarUsuario);

router.get('/propiedades', propiedades);
router.patch('/propiedades/:id', moderarPropiedadCtrl);

router.get('/resenas', resenas);
router.patch('/resenas/:id', moderarResenaCtrl);

router.get('/anuncios', anuncios);
router.post(
  '/anuncios',
  [
    body('titulo').trim().notEmpty().withMessage('El titulo es obligatorio.'),
    body('mensaje').trim().notEmpty().withMessage('El mensaje es obligatorio.'),
  ],
  crearAnuncioCtrl,
);
router.patch('/anuncios/:id', alternarAnuncioCtrl);
router.delete('/anuncios/:id', eliminarAnuncioCtrl);

router.get('/auditoria', auditoria);
router.get('/precios', precios);
router.get('/exportar/reservas', exportarReservas);

export default router;
