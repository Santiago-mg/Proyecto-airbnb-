import { DataTypes } from 'sequelize';

import db from '../config/db.js';

// Anuncios globales publicados por el administrador (banner del sitio).
const Anuncio = db.define(
  'anuncios',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    titulo: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    tipo: {
      type: DataTypes.ENUM('info', 'success', 'warning', 'promo'),
      allowNull: false,
      defaultValue: 'info',
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
);

export default Anuncio;
