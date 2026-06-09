import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

import { sesion } from './middlewares/sesion.js';
import { helpers } from './helpers/format.js';
import pageRoutes from './routes/pageRoutes.js';
import authRoutes from './routes/authRoutes.js';
import panelRoutes from './routes/panelRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000';

const app = express();
app.disable('x-powered-by');

// Proxy de la API hacia el backend (antes de parsear el body).
app.use(
  '/api',
  createProxyMiddleware({
    target: `${backendInternalUrl}/api`,
    changeOrigin: true,
    xfwd: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// Motor de vistas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.helpers = helpers;
app.locals.siteName = 'EstadiaPro';
app.locals.anioActual = new Date().getFullYear();

// Archivos estaticos
app.use(express.static(path.join(__dirname, 'public')));

// Sesion global
app.use(sesion);

// Rutas
app.use('/', pageRoutes);
app.use('/', authRoutes);
app.use('/panel', panelRoutes);
app.use('/admin', adminRoutes);

// 404
app.use((req, res) => {
  res.status(404).render('template/mensaje', {
    pagina: 'Pagina no encontrada',
    mensaje: 'La ruta que buscas no existe o fue movida.',
    textoBoton: 'Volver al inicio',
    hrefBoton: '/',
  });
});

export default app;
