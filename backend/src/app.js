import express from 'express';

import authRoutes from './routes/authRoutes.js';
import { notFoundHandler } from './middlewares/notFound.js';
import { errorHandler } from './middlewares/errorHandler.js';

const app = express();

app.disable('x-powered-by');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'Backend operativo.' });
});

app.use('/api/auth', authRoutes);
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
