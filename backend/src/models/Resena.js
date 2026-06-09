import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Resena = db.define(
  'resenas',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    calificacion: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 5,
      validate: { min: 1, max: 5 },
    },
    comentario: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    oculta: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    propiedadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    autorId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
);

export default Resena;
