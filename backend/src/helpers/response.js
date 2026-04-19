const esPeticionJson = (req) =>
  req.is('application/json') || req.get('accept')?.includes('application/json');

const construirRuta = (ruta, query = {}) => {
  const params = new URLSearchParams();

  Object.entries(query).forEach(([key, value]) => {
    if (value === undefined || value === null || value === '') {
      return;
    }

    if (Array.isArray(value)) {
      value.forEach((item) => {
        if (item !== undefined && item !== null && item !== '') {
          params.append(key, item);
        }
      });
      return;
    }

    params.append(key, value);
  });

  const queryString = params.toString();
  return queryString ? `${ruta}?${queryString}` : ruta;
};

const mapearErrores = (errors) =>
  errors.array().map(({ path, msg }) => ({
    field: path,
    message: msg,
    msg,
  }));

const enviarErrorValidacion = (req, res, errors, ruta, valores = {}) => {
  const errores = mapearErrores(errors);

  if (esPeticionJson(req)) {
    return res.status(422).json({
      ok: false,
      message: 'Revisa los datos enviados.',
      errors: errores,
    });
  }

  return res.redirect(
    construirRuta(ruta, {
      ...valores,
      error: errores.map((error) => error.msg),
      mostrarComoErrores: true,
    }),
  );
};

const enviarError = (req, res, error, ruta, valores = {}, fallbackMessage = 'Ocurrio un error interno.') => {
  if (esPeticionJson(req)) {
    return res.status(error.statusCode || 500).json({
      ok: false,
      message: error.message || fallbackMessage,
      errors: error.errors || [],
    });
  }

  return res.redirect(
    construirRuta(ruta, {
      ...valores,
      error: [error.message || fallbackMessage],
      mostrarComoErrores: true,
    }),
  );
};

export { esPeticionJson, construirRuta, enviarErrorValidacion, enviarError };
