-- Inicialización de la base de datos de EstadiaPro.
-- El esquema de tablas lo crea Sequelize automáticamente al arrancar el backend
-- (db.sync) y los datos de demostración los inserta el seed del backend.
-- Este script solo garantiza que la base de datos y la codificación existan.

CREATE DATABASE IF NOT EXISTS estadiapro
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE estadiapro;
