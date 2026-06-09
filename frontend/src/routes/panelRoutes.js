import { Router } from 'express';

import {
  dashboard, misReservas, misFavoritos, perfil, actualizarPerfil,
  misPropiedades, formNuevaPropiedad, crearPropiedad, formEditarPropiedad, actualizarPropiedad,
} from '../controllers/panelController.js';
import { requiereSesion, requiereRol } from '../middlewares/sesion.js';

const router = Router();

router.use(requiereSesion);

router.get('/', dashboard);
router.get('/reservas', misReservas);
router.get('/favoritos', misFavoritos);
router.get('/perfil', perfil);
router.post('/perfil', actualizarPerfil);

// Anfitrion
const soloAnfitrion = requiereRol('anfitrion', 'admin');
router.get('/propiedades', soloAnfitrion, misPropiedades);
router.get('/propiedades/nueva', soloAnfitrion, formNuevaPropiedad);
router.post('/propiedades', soloAnfitrion, crearPropiedad);
router.get('/propiedades/:id/editar', soloAnfitrion, formEditarPropiedad);
router.post('/propiedades/:id', soloAnfitrion, actualizarPropiedad);

export default router;
