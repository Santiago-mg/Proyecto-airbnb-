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

const databaseName = DB_NAME || 'bienes_raices_node_mvc';
const databaseUser = DB_USER || 'root';
const databasePassword = DB_PASSWORD || 'root';
const databaseHost = DB_HOST || 'localhost';
const databasePort = Number(DB_PORT || 3307);

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
