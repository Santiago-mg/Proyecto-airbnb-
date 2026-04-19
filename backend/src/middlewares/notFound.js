const notFoundHandler = (req, res) => {
  res.status(404).json({
    ok: false,
    message: `No existe la ruta ${req.originalUrl}.`,
  });
};

export { notFoundHandler };
