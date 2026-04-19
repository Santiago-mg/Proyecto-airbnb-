# Proyecto Airbnb
Es una aplicación web inspirada en Airbnb, consiste en un sistema fullstack contenerizado con arquitectura monorepo, compuesto por un frontend renderizado en servidor, un backend API REST y una base de datos relacional.

Proyecto reorganizado en tres servicios:

- `frontend/`: Express + Pug para renderizado de vistas y archivos estaticos.
- `backend/`: Express API + Sequelize para autenticacion y logica de negocio.
- `database/`: inicializacion de MySQL para Docker Compose.
## Arquitectura del proyecto
El proyecto está compuesto por los siguientes servicios:

- Frontend: Aplicación cliente encargada de la interfaz de usuario.
- Backend: API encargada de la lógica de negocio y comunicación con la base de datos.
- Base de datos: Sistema de almacenamiento de información.

Todos los servicios se comunican entre sí mediante Docker Compose.
## Estructura

```text
proyecto-airbnb/
├── docker-compose.yml          # Orquestación de servicios
├── .env.example                # Variables de entorno de ejemplo
├── .gitignore
├── README.md
├── frontend/                   # App frontend (Express + Pug + Tailwind)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── controllers/
│       ├── middlewares/
│       ├── routes/
│       ├── public/css/
│       └── views/
├── backend/                    # App backend (API REST con Express + Sequelize)
│   ├── Dockerfile
│   ├── .dockerignore
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js
│       ├── app.js
│       ├── config/
│       ├── controllers/
│       ├── helpers/
│       ├── middlewares/
│       ├── models/
│       ├── routes/
│       └── services/
└── database/
    └── init.sql                # Esquema inicial de la base de datos
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
