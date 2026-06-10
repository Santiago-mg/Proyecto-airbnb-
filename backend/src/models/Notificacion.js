import { DataTypes } from 'sequelize';

import db from '../config/db.js';

// Notificaciones dirigidas a un usuario (p. ej. al anfitrion cuando recibe una reserva).
const Notificacion = db.define(
  'notificaciones',
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
    tipo: {
      type: DataTypes.ENUM('reserva', 'resena', 'sistema'),
      allowNull: false,
      defaultValue: 'sistema',
    },
    titulo: {
      type: DataTypes.STRING(140),
      allowNull: false,
    },
    mensaje: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    enlace: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    leida: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
  },
);

export default Notificacion;
