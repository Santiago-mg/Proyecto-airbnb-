import { apiFetch } from '../config/api.js';

const obtenerAlerta = (query = {}) => {
  if (!query.mensaje) return null;
  return { tipo: query.tipo || 'info', mensaje: query.mensaje };
};

const idsFavoritos = async (token) => {
  if (!token) return [];
  const { data } = await apiFetch('/favoritos', { token });
  return data?.ok ? data.propiedades.map((p) => p.id) : [];
};

const paginaInicio = async (req, res) => {
  const filtros = new URLSearchParams(req.query).toString();
  const [propiedadesRes, categoriasRes] = await Promise.all([
    apiFetch(`/propiedades${filtros ? `?${filtros}` : ''}`),
    apiFetch('/public/categorias'),
  ]);

  const propiedades = propiedadesRes.data?.propiedades || [];
  const favoritos = await idsFavoritos(res.locals.token);

  res.render('paginas/inicio', {
    pagina: 'Encuentra tu próxima estadía',
    propiedades,
    destacadas: propiedades.filter((p) => p.destacada).slice(0, 3),
    categorias: categoriasRes.data?.categorias || [],
    favoritos,
    filtros: req.query,
    alert: obtenerAlerta(req.query),
  });
};

const detallePropiedad = async (req, res) => {
  const { data, status } = await apiFetch(`/propiedades/${req.params.id}`);

  if (!data?.ok || status === 404) {
    return res.status(404).render('template/mensaje', {
      pagina: 'Propiedad no encontrada',
      mensaje: 'La propiedad que buscas no existe o fue retirada.',
      textoBoton: 'Explorar propiedades',
      hrefBoton: '/',
    });
  }

  const favoritos = await idsFavoritos(res.locals.token);

  return res.render('paginas/propiedad', {
    pagina: data.propiedad.titulo,
    propiedad: data.propiedad,
    ocupadas: data.ocupadas || [],
    esFavorito: favoritos.includes(data.propiedad.id),
    alert: obtenerAlerta(req.query),
  });
};

export { paginaInicio, detallePropiedad };
