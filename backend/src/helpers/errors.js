// Crea un error de negocio con codigo HTTP asociado.
const crearError = (message, statusCode = 400) =>
  Object.assign(new Error(message), { statusCode });

export { crearError };
