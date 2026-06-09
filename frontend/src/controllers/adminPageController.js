import { apiFetch } from '../config/api.js';

const alerta = (query = {}) =>
  query.mensaje ? { tipo: query.tipo || 'info', mensaje: query.mensaje } : null;

const base = (seccion, extra = {}) => ({ seccion, ...extra });

const panel = async (req, res) => {
  const { data } = await apiFetch('/admin/metricas', { token: res.locals.token });
  res.render('admin/dashboard', {
    pagina: 'Panel de control',
    ...base('dashboard'),
    metricas: data || {},
    alert: alerta(req.query),
  });
};

const usuarios = async (req, res) => {
  const filtros = new URLSearchParams(req.query).toString();
  const { data } = await apiFetch(`/admin/usuarios${filtros ? `?${filtros}` : ''}`, { token: res.locals.token });
  res.render('admin/usuarios', {
    pagina: 'Gestión de usuarios',
    ...base('usuarios'),
    usuarios: data?.usuarios || [],
    filtros: req.query,
    alert: alerta(req.query),
  });
};

const propiedades = async (req, res) => {
  const filtros = new URLSearchParams(req.query).toString();
  const { data } = await apiFetch(`/admin/propiedades${filtros ? `?${filtros}` : ''}`, { token: res.locals.token });
  res.render('admin/propiedades', {
    pagina: 'Moderación de propiedades',
    ...base('propiedades'),
    propiedades: data?.propiedades || [],
    filtros: req.query,
    alert: alerta(req.query),
  });
};

const resenas = async (req, res) => {
  const { data } = await apiFetch('/admin/resenas', { token: res.locals.token });
  res.render('admin/resenas', {
    pagina: 'Moderación de reseñas',
    ...base('resenas'),
    resenas: data?.resenas || [],
    alert: alerta(req.query),
  });
};

const anuncios = async (req, res) => {
  const { data } = await apiFetch('/admin/anuncios', { token: res.locals.token });
  res.render('admin/anuncios', {
    pagina: 'Anuncios globales',
    ...base('anuncios'),
    anuncios: data?.anuncios || [],
    alert: alerta(req.query),
  });
};

const auditoria = async (req, res) => {
  const { data } = await apiFetch('/admin/auditoria', { token: res.locals.token });
  res.render('admin/auditoria', {
    pagina: 'Bitácora de auditoría',
    ...base('auditoria'),
    registros: data?.registros || [],
    alert: alerta(req.query),
  });
};

const precios = async (req, res) => {
  const { data } = await apiFetch('/admin/precios', { token: res.locals.token });
  res.render('admin/precios', {
    pagina: 'Motor de precios dinámicos',
    ...base('precios'),
    sugerencias: data?.sugerencias || [],
    alert: alerta(req.query),
  });
};

export { panel, usuarios, propiedades, resenas, anuncios, auditoria, precios };
