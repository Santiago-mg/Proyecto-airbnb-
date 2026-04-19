import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import dotenv from 'dotenv';
import { createProxyMiddleware } from 'http-proxy-middleware';

import pageRoutes from './routes/pageRoutes.js';
import { globalLocals } from './middlewares/globalLocals.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const backendInternalUrl = process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000';

const app = express();

app.disable('x-powered-by');
app.use(
  '/api',
  createProxyMiddleware({
    target: `${backendInternalUrl}/api`,
    changeOrigin: true,
    xfwd: true,
  }),
);

app.use(express.urlencoded({ extended: true }));
app.use(globalLocals);

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/', pageRoutes);

app.use((req, res) => {
  res.status(404).render('template/mensaje', {
    pagina: 'Pagina no encontrada',
    mensaje: 'La ruta que estas buscando no existe o ya fue movida.',
    textoBoton: 'Volver al inicio',
    hrefBoton: '/',
    alert: {
      type: 'error',
      message: 'No encontramos la pagina solicitada.',
    },
  });
});

export default app;
