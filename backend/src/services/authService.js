import { Usuario } from '../models/index.js';
import { crearError } from '../helpers/errors.js';
import { generarId, generarJWT } from '../helpers/tokens.js';

const sanear = (usuario) => ({
  id: usuario.id,
  nombre: usuario.nombre,
  email: usuario.email,
  rol: usuario.rol,
  avatar: usuario.avatar,
  telefono: usuario.telefono,
  bio: usuario.bio,
  verificado: usuario.verificado,
});

const registrarUsuario = async ({ nombre, email, password, rol }) => {
  const existe = await Usuario.scope('conPassword').findOne({ where: { email } });

  if (existe) {
    throw crearError('El usuario ya esta registrado.', 409);
  }

  const rolFinal = rol === 'anfitrion' ? 'anfitrion' : 'viajero';

  const usuario = await Usuario.create({
    nombre,
    email,
    password,
    rol: rolFinal,
    token: generarId(),
    confirmado: true,
  });

  const token = generarJWT({ id: usuario.id, rol: usuario.rol });
  return { usuario: sanear(usuario), token };
};

const autenticarUsuario = async ({ email, password }) => {
  const usuario = await Usuario.scope('conPassword').findOne({ where: { email } });

  if (!usuario) {
    throw crearError('Credenciales invalidas.', 401);
  }

  if (!usuario.activo) {
    throw crearError('Tu cuenta esta suspendida. Contacta al administrador.', 403);
  }

  const passwordValido = await usuario.verificarPassword(password);
  if (!passwordValido) {
    throw crearError('Credenciales invalidas.', 401);
  }

  usuario.ultimoAcceso = new Date();
  await usuario.save();

  const token = generarJWT({ id: usuario.id, rol: usuario.rol });
  return { usuario: sanear(usuario), token };
};

const obtenerPerfil = async (id) => {
  const usuario = await Usuario.findByPk(id);
  if (!usuario) {
    throw crearError('Usuario no encontrado.', 404);
  }
  return sanear(usuario);
};

const actualizarPerfil = async (id, datos) => {
  const usuario = await Usuario.scope('conPassword').findByPk(id);
  if (!usuario) {
    throw crearError('Usuario no encontrado.', 404);
  }

  const camposPermitidos = ['nombre', 'telefono', 'bio', 'avatar'];
  camposPermitidos.forEach((campo) => {
    if (datos[campo] !== undefined) {
      usuario[campo] = datos[campo];
    }
  });

  if (datos.password) {
    usuario.password = datos.password;
  }

  // Convertirse en anfitrion desde el panel de usuario.
  if (datos.rol === 'anfitrion' && usuario.rol === 'viajero') {
    usuario.rol = 'anfitrion';
  }

  await usuario.save();
  return sanear(usuario);
};

export { registrarUsuario, autenticarUsuario, obtenerPerfil, actualizarPerfil, sanear };
