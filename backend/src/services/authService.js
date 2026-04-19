import Usuario from '../models/Usuario.js';
import { generarId } from '../helpers/tokens.js';

const createServiceError = (message, statusCode = 400) =>
  Object.assign(new Error(message), { statusCode });

const buildFrontendUrl = (pathname) => {
  const baseUrl = process.env.FRONTEND_PUBLIC_URL || 'http://localhost:3000';
  return new URL(pathname, baseUrl).toString();
};

const registrarUsuario = async ({ nombre, email, password }) => {
  const existingUser = await Usuario.findOne({ where: { email } });

  if (existingUser) {
    throw createServiceError('El usuario ya esta registrado.', 409);
  }

  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    token: generarId(),
    confirmado: false,
  });

  return {
    usuario,
    previewPath: `/confirmar/${usuario.token}`,
    previewUrl: buildFrontendUrl(`/confirmar/${usuario.token}`),
  };
};

const autenticarUsuario = async ({ email, password }) => {
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    throw createServiceError('Credenciales invalidas.', 401);
  }

  if (!usuario.confirmado) {
    throw createServiceError('Debes confirmar tu cuenta antes de iniciar sesion.', 403);
  }

  const isValidPassword = await usuario.verificarPassword(password);

  if (!isValidPassword) {
    throw createServiceError('Credenciales invalidas.', 401);
  }

  return {
    id: usuario.id,
    nombre: usuario.nombre,
    email: usuario.email,
  };
};

const confirmarUsuario = async (token) => {
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    throw createServiceError('El token de confirmacion no es valido o ya fue usado.', 404);
  }

  usuario.token = null;
  usuario.confirmado = true;

  await usuario.save();

  return usuario;
};

const generarTokenReestablecerPassword = async (email) => {
  const usuario = await Usuario.findOne({ where: { email } });

  if (!usuario) {
    return {
      usuario: null,
      previewPath: null,
      previewUrl: null,
    };
  }

  usuario.token = generarId();
  await usuario.save();

  return {
    usuario,
    previewPath: `/reestablecer-password/${usuario.token}`,
    previewUrl: buildFrontendUrl(`/reestablecer-password/${usuario.token}`),
  };
};

const reestablecerPasswordUsuario = async (token, password) => {
  const usuario = await Usuario.findOne({ where: { token } });

  if (!usuario) {
    throw createServiceError('El token para reestablecer el password no es valido.', 404);
  }

  usuario.password = password;
  usuario.token = null;

  await usuario.save();

  return usuario;
};

export {
  registrarUsuario,
  autenticarUsuario,
  confirmarUsuario,
  generarTokenReestablecerPassword,
  reestablecerPasswordUsuario,
};
