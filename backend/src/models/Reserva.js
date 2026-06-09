import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Reserva = db.define(
  'reservas',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    fechaInicio: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    fechaFin: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    huespedes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    noches: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    total: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    estado: {
      type: DataTypes.ENUM('pendiente', 'confirmada', 'cancelada', 'completada'),
      allowNull: false,
      defaultValue: 'confirmada',
    },
    propiedadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
    viajeroId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
);

export default Reserva;
