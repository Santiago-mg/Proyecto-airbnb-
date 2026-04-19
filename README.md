# Proyecto Airbnb

Proyecto reorganizado en tres servicios:

- `frontend/`: Express + Pug para renderizado de vistas y archivos estaticos.
- `backend/`: Express API + Sequelize para autenticacion y logica de negocio.
- `database/`: inicializacion de MySQL para Docker Compose.

## Estructura

```text
Proyecto-airbnb/
├── frontend/
├── backend/
├── database/
├── docker-compose.yml
├── .env
└── README.md
```

## Levantar con Docker

```bash
docker compose up --build
```

Servicios expuestos:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4000`
- MySQL: `localhost:3306`

## Desarrollo local

Backend:

```bash
cd backend
npm install
npm run dev
```

Frontend:

```bash
cd frontend
npm install
npm run build:css
npm run dev
```

Si usas MySQL local fuera de Docker, ajusta `backend/.env` con un usuario y password que existan en tu maquina.

## Flujo funcional

- Registro: `GET /registro` y `POST /api/auth/registro`
- Login: `GET /login` y `POST /api/auth/login`
- Olvide password: `GET /olvide-password` y `POST /api/auth/olvide-password`
- Confirmacion: `GET /confirmar/:token` y `GET /api/auth/confirmar/:token`
- Reset password: `GET /reestablecer-password/:token` y `POST /api/auth/reestablecer-password/:token`

En local y en Docker, el backend devuelve `previewUrl` para confirmacion y recuperacion, lo que permite probar el flujo sin integrar un servicio de correo todavia.
