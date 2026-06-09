// Utilidades de formato disponibles en todas las vistas Pug.

const formatearPrecio = (valor) => {
  const numero = Number(valor || 0);
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    maximumFractionDigits: 0,
  }).format(numero);
};

const formatearFecha = (fecha) => {
  if (!fecha) return '';
  return new Date(fecha).toLocaleDateString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const estrellas = (rating) => {
  const valor = Math.round(Number(rating) || 0);
  return { llenas: valor, vacias: 5 - valor };
};

const iniciales = (nombre = '') =>
  nombre
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');

const helpers = { formatearPrecio, formatearFecha, estrellas, iniciales };

export { helpers, formatearPrecio, formatearFecha, estrellas, iniciales };
