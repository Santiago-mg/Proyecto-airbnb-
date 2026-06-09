import { DataTypes } from 'sequelize';

import db from '../config/db.js';

// Bitacora de acciones del administrador para trazabilidad.
const AuditLog = db.define(
  'audit_logs',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    accion: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    detalle: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    entidad: {
      type: DataTypes.STRING(60),
      allowNull: true,
    },
    entidadId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    adminId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    adminNombre: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
  },
);

export default AuditLog;
