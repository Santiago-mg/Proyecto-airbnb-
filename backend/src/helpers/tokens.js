import jwt from 'jsonwebtoken';

const generarId = () =>
  Date.now().toString(32) + Math.random().toString(32).slice(2);

const generarJWT = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET || 'secreto-dev', {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });

const verificarJWT = (token) =>
  jwt.verify(token, process.env.JWT_SECRET || 'secreto-dev');

export { generarId, generarJWT, verificarJWT };
