import { apiFetch } from '../config/api.js';

const cookieOpciones = {
  httpOnly: true,
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

const alerta = (query = {}) =>
  query.mensaje ? { tipo: query.tipo || 'info', mensaje: query.mensaje } : null;

const formularioLogin = (req, res) => {
  res.render('auth/login', {
    pagina: 'Inicia sesión',
    alert: alerta(req.query),
    valores: { email: req.query.email || '' },
  });
};

const procesarLogin = async (req, res) => {
  const { email, password } = req.body;
  const { data } = await apiFetch('/auth/login', {
    method: 'POST',
    body: { email, password },
  });

  if (!data?.ok) {
    return res.render('auth/login', {
      pagina: 'Inicia sesión',
      errores: data?.errors?.length ? data.errors : [{ msg: data?.message || 'No fue posible iniciar sesión.' }],
      valores: { email },
    });
  }

  res.cookie('token', data.token, cookieOpciones);
  const destino = data.usuario.rol === 'admin' ? '/admin' : '/panel';
  return res.redirect(`${destino}?mensaje=Hola ${data.usuario.nombre.split(' ')[0]}, bienvenido de nuevo.&tipo=success`);
};

const formularioRegistro = (req, res) => {
  res.render('auth/registro', {
    pagina: 'Crear cuenta',
    alert: alerta(req.query),
    valores: {},
  });
};

const procesarRegistro = async (req, res) => {
  const { nombre, email, password, repetir_password: repetirPassword, rol } = req.body;
  const { data } = await apiFetch('/auth/registro', {
    method: 'POST',
    body: { nombre, email, password, repetir_password: repetirPassword, rol },
  });

  if (!data?.ok) {
    return res.render('auth/registro', {
      pagina: 'Crear cuenta',
      errores: data?.errors?.length ? data.errors : [{ msg: data?.message || 'No fue posible crear la cuenta.' }],
      valores: { nombre, email, rol },
    });
  }

  res.cookie('token', data.token, cookieOpciones);
  return res.redirect('/panel?mensaje=Tu cuenta fue creada. ¡Bienvenido a EstadiaPro!&tipo=success');
};

const formularioOlvide = (req, res) => {
  res.render('auth/olvide-password', {
    pagina: 'Recupera tu acceso',
    alert: alerta(req.query),
  });
};

const procesarOlvide = (req, res) => {
  // Flujo simulado para el proyecto academico.
  res.redirect('/login?mensaje=Si el correo existe, enviamos instrucciones para restablecer tu contraseña.&tipo=info');
};

const logout = (req, res) => {
  res.clearCookie('token');
  res.redirect('/?mensaje=Cerraste sesión correctamente.&tipo=success');
};

export {
  formularioLogin, procesarLogin, formularioRegistro, procesarRegistro,
  formularioOlvide, procesarOlvide, logout,
};
