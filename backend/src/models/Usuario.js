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
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
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
  },
  {
    hooks: {
      beforeCreate: hashPassword,
      beforeUpdate: hashPassword,
    },
  },
);

Usuario.prototype.verificarPassword = async function verificarPassword(password) {
  return bcrypt.compare(password, this.password);
};

export default Usuario;
