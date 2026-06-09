import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Categoria = db.define(
  'categorias',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(60),
      allowNull: false,
      unique: true,
    },
    icono: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
  },
  {
    timestamps: false,
  },
);

export default Categoria;
