import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
} = process.env;

const db = new Sequelize(
  DB_NAME || 'estadiapro',
  DB_USER || 'root',
  DB_PASSWORD || 'root',
  {
    host: DB_HOST || 'localhost',
    port: Number(DB_PORT || 3306),
    dialect: 'mysql',
    logging: false,
    define: {
      timestamps: true,
    },
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
  },
);

export default db;
