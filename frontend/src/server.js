import dotenv from 'dotenv';

dotenv.config();

import app from './app.js';

const port = Number(process.env.PORT) || 3000;

app.listen(port, () => {
  console.log(`Frontend escuchando en http://localhost:${port}`);
});
