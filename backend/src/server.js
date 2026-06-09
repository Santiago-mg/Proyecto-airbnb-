import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

import app from './app.js';
import { db } from './models/index.js';
import { ejecutarSeed } from './seed/seed.js';

const port = Number(process.env.PORT) || 4000;

// Crea la base de datos si aun no existe (util fuera de Docker).
const asegurarBaseDeDatos = async () => {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT || 3306),
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
  });
  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'estadiapro'}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
};

const iniciar = async () => {
  try {
    await asegurarBaseDeDatos();
    await db.authenticate();
    await db.sync({ alter: true });
    await ejecutarSeed();

    app.listen(port, () => {
      // eslint-disable-next-line no-console
      console.log(`Backend EstadiaPro escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('No fue posible iniciar el backend:', error.message);
    process.exit(1);
  }
};

iniciar();
