import { apiFetch } from '../config/api.js';

const alerta = (query = {}) =>
  query.mensaje ? { tipo: query.tipo || 'info', mensaje: query.mensaje } : null;

const parsearPropiedad = (body) => {
  const servicios = Array.isArray(body.servicios)
    ? body.servicios
    : body.servicios ? [body.servicios] : [];
  const imagenes = (body.imagenes || '')
    .split('\n')
    .map((l) => l.trim())
    .filter(Boolean);

  return {
    titulo: body.titulo,
    descripcion: body.descripcion,
    ciudad: body.ciudad,
    pais: body.pais || 'Colombia',
    direccion: body.direccion,
    precioNoche: Number(body.precioNoche),
    huespedes: Number(body.huespedes),
    habitaciones: Number(body.habitaciones),
    camas: Number(body.camas),
    banos: Number(body.banos),
    categoriaId: body.categoriaId ? Number(body.categoriaId) : null,
    servicios,
    imagenes,
  };
};

const dashboard = async (req, res) => {
  const { token, usuario } = res.locals;
  const esAnfitrion = usuario.rol === 'anfitrion' || usuario.rol === 'admin';

  const [reservasRes, favoritosRes, propiedadesRes, recibidasRes] = await Promise.all([
    apiFetch('/reservas/mias', { token }),
    apiFetch('/favoritos', { token }),
    esAnfitrion ? apiFetch('/propiedades/mias', { token }) : Promise.resolve({ data: {} }),
    esAnfitrion ? apiFetch('/reservas/recibidas', { token }) : Promise.resolve({ data: {} }),
  ]);

  const reservas = reservasRes.data?.reservas || [];
  const propiedades = propiedadesRes.data?.propiedades || [];
  const recibidas = recibidasRes.data?.reservas || [];
  const ingresos = recibidas
    .filter((r) => r.estado !== 'cancelada')
    .reduce((acc, r) => acc + Number(r.total), 0);

  res.render('panel/dashboard', {
    pagina: 'Mi panel',
    seccion: 'inicio',
    reservas,
    favoritos: favoritosRes.data?.propiedades || [],
    propiedades,
    recibidas,
    ingresos,
    alert: alerta(req.query),
  });
};

const misReservas = async (req, res) => {
  const { data } = await apiFetch('/reservas/mias', { token: res.locals.token });
  res.render('panel/reservas', {
    pagina: 'Mis reservas',
    seccion: 'reservas',
    reservas: data?.reservas || [],
    alert: alerta(req.query),
  });
};

const misFavoritos = async (req, res) => {
  const { data } = await apiFetch('/favoritos', { token: res.locals.token });
  res.render('panel/favoritos', {
    pagina: 'Mis favoritos',
    seccion: 'favoritos',
    propiedades: data?.propiedades || [],
    favoritos: (data?.propiedades || []).map((p) => p.id),
    alert: alerta(req.query),
  });
};

const perfil = (req, res) => {
  res.render('panel/perfil', {
    pagina: 'Mi perfil',
    seccion: 'perfil',
    alert: alerta(req.query),
  });
};

const actualizarPerfil = async (req, res) => {
  const body = {
    nombre: req.body.nombre,
    telefono: req.body.telefono,
    bio: req.body.bio,
    avatar: req.body.avatar,
  };
  if (req.body.rol === 'anfitrion') body.rol = 'anfitrion';
  if (req.body.password) body.password = req.body.password;

  const { data } = await apiFetch('/auth/perfil', { method: 'PUT', token: res.locals.token, body });
  const tipo = data?.ok ? 'success' : 'error';
  const mensaje = data?.ok ? 'Perfil actualizado correctamente.' : (data?.message || 'No se pudo actualizar.');
  res.redirect(`/panel/perfil?mensaje=${encodeURIComponent(mensaje)}&tipo=${tipo}`);
};

// ---- Anfitrion: propiedades ----
const misPropiedades = async (req, res) => {
  const [propsRes, recibidasRes] = await Promise.all([
    apiFetch('/propiedades/mias', { token: res.locals.token }),
    apiFetch('/reservas/recibidas', { token: res.locals.token }),
  ]);
  res.render('panel/propiedades', {
    pagina: 'Mis propiedades',
    seccion: 'propiedades',
    propiedades: propsRes.data?.propiedades || [],
    recibidas: recibidasRes.data?.reservas || [],
    alert: alerta(req.query),
  });
};

const formNuevaPropiedad = async (req, res) => {
  const { data } = await apiFetch('/public/categorias');
  res.render('panel/propiedad-form', {
    pagina: 'Publicar propiedad',
    seccion: 'propiedades',
    categorias: data?.categorias || [],
    propiedad: null,
    accion: '/panel/propiedades',
    alert: alerta(req.query),
  });
};

const crearPropiedad = async (req, res) => {
  const body = parsearPropiedad(req.body);
  const { data } = await apiFetch('/propiedades', { method: 'POST', token: res.locals.token, body });

  if (!data?.ok) {
    const cat = await apiFetch('/public/categorias');
    return res.render('panel/propiedad-form', {
      pagina: 'Publicar propiedad',
      seccion: 'propiedades',
      categorias: cat.data?.categorias || [],
      propiedad: { ...body, imagenes: req.body.imagenes },
      accion: '/panel/propiedades',
      errores: data?.errors?.length ? data.errors : [{ msg: data?.message || 'Revisa los datos.' }],
    });
  }

  return res.redirect('/panel/propiedades?mensaje=Propiedad publicada. Queda pendiente de aprobación.&tipo=success');
};

const formEditarPropiedad = async (req, res) => {
  const [propRes, catRes] = await Promise.all([
    apiFetch(`/propiedades/${req.params.id}`),
    apiFetch('/public/categorias'),
  ]);
  if (!propRes.data?.ok) {
    return res.redirect('/panel/propiedades?mensaje=Propiedad no encontrada.&tipo=error');
  }
  const propiedad = propRes.data.propiedad;
  return res.render('panel/propiedad-form', {
    pagina: 'Editar propiedad',
    seccion: 'propiedades',
    categorias: catRes.data?.categorias || [],
    propiedad: { ...propiedad, imagenes: (propiedad.imagenes || []).join('\n') },
    accion: `/panel/propiedades/${propiedad.id}`,
    alert: alerta(req.query),
  });
};

const actualizarPropiedad = async (req, res) => {
  const body = parsearPropiedad(req.body);
  const { data } = await apiFetch(`/propiedades/${req.params.id}`, { method: 'PUT', token: res.locals.token, body });
  const tipo = data?.ok ? 'success' : 'error';
  const mensaje = data?.ok ? 'Propiedad actualizada. Vuelve a moderación.' : (data?.message || 'No se pudo actualizar.');
  res.redirect(`/panel/propiedades?mensaje=${encodeURIComponent(mensaje)}&tipo=${tipo}`);
};

export {
  dashboard, misReservas, misFavoritos, perfil, actualizarPerfil,
  misPropiedades, formNuevaPropiedad, crearPropiedad, formEditarPropiedad, actualizarPropiedad,
};
