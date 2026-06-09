import bcrypt from 'bcrypt';
import { DataTypes } from 'sequelize';

import db from '../config/db.js';

const hashPassword = async (usuario) => {
  if (!usuario.changed('password')) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  usuario.password = await bcrypt.hash(usuario.password, salt);
};

const Usuario = db.define(
  'usuarios',
  {
    id: {
      type: DataTypes.INTEGER.UNSIGNED,
      autoIncrement: true,
      primaryKey: true,
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(120),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    telefono: {
      type: DataTypes.STRING(30),
      allowNull: true,
    },
    bio: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    avatar: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    rol: {
      type: DataTypes.ENUM('viajero', 'anfitrion', 'admin'),
      allowNull: false,
      defaultValue: 'viajero',
    },
    token: {
      type: DataTypes.STRING(120),
      allowNull: true,
    },
    confirmado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    ultimoAcceso: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
    defaultScope: {
      attributes: { exclude: ['password', 'token'] },
    },
    scopes: {
      conPassword: { attributes: {} },
    },
  },
);

Usuario.prototype.verificarPassword = function verificarPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default Usuario;
