const globalLocals = (req, res, next) => {
  res.locals.siteName = 'Proyecto Airbnb';
  next();
};

export { globalLocals };
