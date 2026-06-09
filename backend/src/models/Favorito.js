import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Favorito = db.define(
  'favoritos',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    usuarioId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    propiedadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
  {
    indexes: [
      { unique: true, fields: ['usuarioId', 'propiedadId'] },
    ],
  },
);

export default Favorito;
