const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // eslint-disable-next-line no-console
  console.error('Error:', error.message);

  return res.status(error.statusCode || 500).json({
    ok: false,
    message: error.message || 'Ocurrio un error interno en el servidor.',
  });
};

export { errorHandler };
