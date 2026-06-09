import dotenv from 'dotenv';

dotenv.config();

const BACKEND_URL = process.env.BACKEND_INTERNAL_URL || 'http://localhost:4000';

// Cliente HTTP server-side hacia el backend. Reenvia el token como cookie
// para que el middleware de autenticacion del backend identifique al usuario.
const apiFetch = async (path, { method = 'GET', body, token, headers = {} } = {}) => {
  const finalHeaders = { 'Content-Type': 'application/json', ...headers };
  if (token) {
    finalHeaders.Cookie = `token=${token}`;
  }

  try {
    const respuesta = await fetch(`${BACKEND_URL}/api${path}`, {
      method,
      headers: finalHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    let data = {};
    try {
      data = await respuesta.json();
    } catch (error) {
      data = {};
    }

    return { status: respuesta.status, ok: respuesta.ok, data };
  } catch (error) {
    return { status: 503, ok: false, data: { ok: false, message: 'No se pudo conectar con el backend.' } };
  }
};

export { apiFetch, BACKEND_URL };
