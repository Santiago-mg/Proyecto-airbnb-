# Proyecto Airbnb
Es una aplicación web inspirada en Airbnb, esta consiste en un sistema fullstack contenerizado con arquitectura monorepo, compuesto por un frontend renderizado en servidor, un backend API REST y una base de datos relacional.

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

## Tecnologías utilizadas

- Frontend: React / Angular / Vue (según elección).
- Backend: Node.js / Python / Java (según elección) con documentación en Swagger (OpenAPI).
- Base de Datos: Motor relacional con esquema definido.
- Infraestructura: Docker y Docker Compose para la orquestación de servicios.

## Estructura

```text
proyecto-airbnb/
├── docker-compose.yml          
├── .env.example                
├── .gitignore
├── README.md
├── frontend/                  
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
├── backend/                    
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
    └── init.sql                
```

## Requisitos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
- Git bash
- Docker
- Docker Compose

## Instalación y ejecución
  Clonar el repositorio
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd tu-repo
```

Ejecutar los servicios
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

## Flujo de prueba
1. El usuario accede al frontend.
2. El frontend realiza peticiones al backend.
3. El backend procesa la información y consulta la base de datos.
4. Se retorna la respuesta al frontend

## Autores
  - Santiago Gonzalez
  - Mario Andrade
  - David Rivera
    
