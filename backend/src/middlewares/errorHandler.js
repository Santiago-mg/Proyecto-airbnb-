const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  return res.status(error.statusCode || 500).json({
    ok: false,
    message: error.message || 'Ocurrio un error interno en el servidor.',
  });
};

export { errorHandler };
