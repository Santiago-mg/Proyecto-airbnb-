import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const {
  DB_NAME,
  DB_USER,
  DB_PASSWORD,
  DB_HOST,
  DB_PORT,
  BD_NOMBRE,
  BD_USER,
  BD_PASS,
  BD_HOST,
  BD_PORT,
} = process.env;

const databaseName = DB_NAME || BD_NOMBRE || 'proyecto_airbnb';
const databaseUser = DB_USER || BD_USER || 'airbnb_user';
const databasePassword = DB_PASSWORD || BD_PASS || 'airbnb_password';
const databaseHost = DB_HOST || BD_HOST || 'localhost';
const databasePort = Number(DB_PORT || BD_PORT || 3306);

const db = new Sequelize(databaseName, databaseUser, databasePassword, {
  host: databaseHost,
  port: databasePort,
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
});

export default db;
