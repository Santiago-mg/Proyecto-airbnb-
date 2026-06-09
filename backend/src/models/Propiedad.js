import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const Propiedad = db.define(
  'propiedades',
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
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    ciudad: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    pais: {
      type: DataTypes.STRING(100),
      allowNull: false,
      defaultValue: 'Colombia',
    },
    direccion: {
      type: DataTypes.STRING(200),
      allowNull: true,
    },
    lat: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    lng: {
      type: DataTypes.DECIMAL(10, 7),
      allowNull: true,
    },
    precioNoche: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0,
    },
    huespedes: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    habitaciones: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    camas: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    banos: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    },
    servicios: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    imagenes: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    // Estado de moderacion: pendiente -> aprobada -> rechazada
    estado: {
      type: DataTypes.ENUM('pendiente', 'aprobada', 'rechazada'),
      allowNull: false,
      defaultValue: 'pendiente',
    },
    destacada: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    activa: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    vistas: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 0,
    },
    categoriaId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: true,
    },
    anfitrionId: {
      type: DataTypes.INTEGER.UNSIGNED,
      allowNull: false,
    },
  },
);

export default Propiedad;
