import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Frontend EstadiaPro escuchando en http://localhost:${port}`);
});
