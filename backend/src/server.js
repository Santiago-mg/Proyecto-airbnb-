import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

import app from './app.js';
import db from './config/db.js';
import './models/Usuario.js';

const port = Number(process.env.PORT) || 4000;

const ensureDatabaseExists = async () => {
  const databaseHost = process.env.DB_HOST || process.env.BD_HOST || 'localhost';
  const databasePort = Number(process.env.DB_PORT || process.env.BD_PORT || 3306);
  const databaseUser = process.env.DB_USER || process.env.BD_USER || 'airbnb_user';
  const databasePassword =
    process.env.DB_PASSWORD || process.env.BD_PASS || 'airbnb_password';
  const databaseName =
    process.env.DB_NAME || process.env.BD_NOMBRE || 'proyecto_airbnb';

  const connection = await mysql.createConnection({
    host: databaseHost,
    port: databasePort,
    user: databaseUser,
    password: databasePassword,
  });

  try {
    await connection.query(
      `CREATE DATABASE IF NOT EXISTS \`${databaseName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`,
    );
  } finally {
    await connection.end();
  }
};

const startServer = async () => {
  try {
    await ensureDatabaseExists();
    await db.authenticate();
    await db.sync();

    app.listen(port, () => {
      console.log(`Backend escuchando en http://localhost:${port}`);
    });
  } catch (error) {
    console.error('No fue posible iniciar el backend:', error.message);
    process.exit(1);
  }
};

startServer();
