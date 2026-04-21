# Proyecto Airbnb

Aplicacion web fullstack inspirada en Airbnb, organizada como monorepo y separada en tres servicios:

- `frontend/`: servidor Express con vistas Pug.
- `backend/`: API REST con Express y Sequelize.
- `database/`: inicializacion de MySQL para Docker.

La forma principal de ejecutar el proyecto es con `docker compose`.

## Repositorio y rama

Repositorio oficial de GitHub:

```text
https://github.com/Santiago-mg/Proyecto-airbnb-.git
```

La rama de refactor que se debe usar para clonar y ejecutar este proyecto es:

```text
refactor/docker-structure
```

## Clonado paso a paso

Si vas a clonar el proyecto desde cero, ejecuta:

```bash
git clone -b refactor/docker-structure --single-branch https://github.com/Santiago-mg/Proyecto-airbnb-.git proyecto-airbnb
cd proyecto-airbnb
```

Si ya tienes el repositorio clonado y solo quieres cambiarte a la rama correcta:

```bash
git fetch origin
git checkout refactor/docker-structure
git pull origin refactor/docker-structure
```

## Arquitectura del proyecto

El sistema esta compuesto por:

- `frontend`: interfaz web del proyecto.
- `backend`: logica de negocio, autenticacion y acceso a base de datos.
- `mysql`: base de datos relacional.

Docker Compose se encarga de:

- construir las imagenes del `frontend` y `backend`
- descargar la imagen de `mysql`
- crear los contenedores
- levantar los servicios en el orden correcto
- crear el volumen persistente de la base de datos
- ejecutar `database/init.sql` la primera vez que se inicializa MySQL

## Estructura general

```text
proyecto-airbnb/
|-- docker-compose.yml
|-- .env.example
|-- README.md
|-- frontend/
|   |-- Dockerfile
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   `-- src/
|-- backend/
|   |-- Dockerfile
|   |-- .env
|   |-- .env.example
|   |-- package.json
|   `-- src/
`-- database/
    `-- init.sql
```

## Requisitos previos

Antes de ejecutar el proyecto, asegurate de tener instalado:

- Git
- Docker Desktop
- Docker Compose

Importante:

- Docker Desktop debe estar abierto y en estado `Running`
- los puertos `3000`, `3306` y `4001` deben estar disponibles

## Puertos del proyecto

Cuando el proyecto esta levantado con Docker Compose, los servicios quedan asi:

- Frontend: `http://localhost:3000`
- Backend: `http://localhost:4001`
- Health del backend: `http://localhost:4001/api/health`
- MySQL: `localhost:3306`

Nota:

- dentro de Docker, el backend escucha en el puerto `4000`
- hacia tu maquina, Docker lo publica en `4001`
- esto se hizo para evitar conflictos con procesos locales que ya usaban `4000`

## Ejecucion completa con Docker Compose

Estas son las instrucciones recomendadas para correr el proyecto correctamente desde cero.

### 1. Abre Docker Desktop

Antes de cualquier comando, abre Docker Desktop y espera a que aparezca como activo.

Si Docker no esta corriendo, `docker compose` no va a funcionar.

### 2. Ubicate en la raiz del proyecto

Debes estar en la carpeta donde se encuentra `docker-compose.yml`.

Ejemplo:

```bash
cd proyecto-airbnb
```

### 3. Construye las imagenes

Este comando construye las imagenes del `frontend` y `backend`:

```bash
docker compose build
```

### 4. Crea y levanta los contenedores

Este es el comando principal:

```bash
docker compose up --build
```

Ese comando hace todo esto:

- construye las imagenes si hace falta
- crea los contenedores
- crea la red de Docker
- crea el volumen `mysql_data`
- inicia `mysql`, `backend` y `frontend`

Si prefieres dejarlo corriendo en segundo plano:

```bash
docker compose up --build -d
```

### 5. Verifica que los contenedores esten arriba

En otra terminal puedes revisar:

```bash
docker compose ps
```

Deberias ver corriendo estos servicios:

- `proyecto-airbnb-mysql`
- `proyecto-airbnb-backend`
- `proyecto-airbnb-frontend`

### 6. Revisa los logs si necesitas diagnosticar algo

Para ver logs de todos los servicios:

```bash
docker compose logs -f
```

Para ver solo el backend:

```bash
docker compose logs -f backend
```

Para ver solo MySQL:

```bash
docker compose logs -f mysql
```

### 7. Abre el proyecto en el navegador

Usa estas rutas:

- Frontend: `http://localhost:3000`
- Backend health: `http://localhost:4001/api/health`

Si el backend esta bien, la ruta de health debe responder algo como:

```json
{"ok":true,"message":"Backend operativo."}
```

## Comandos mas usados

Levantar todo:

```bash
docker compose up
```

Levantar todo reconstruyendo imagenes:

```bash
docker compose up --build
```

Levantar todo en segundo plano:

```bash
docker compose up -d
```

Detener y eliminar contenedores:

```bash
docker compose down
```

Detener, eliminar contenedores y borrar el volumen de MySQL:

```bash
docker compose down -v
```

Reconstruir desde cero despues de borrar volumen:

```bash
docker compose down -v
docker compose up --build
```

## Importante sobre la base de datos

La base de datos se inicializa con:

```text
database/init.sql
```

Ese script se ejecuta cuando MySQL se crea por primera vez con un volumen nuevo.

Si cambias `database/init.sql` y quieres que MySQL vuelva a inicializar todo desde cero, debes borrar el volumen:

```bash
docker compose down -v
docker compose up --build
```

Si no borras el volumen, MySQL conserva los datos anteriores.

## Configuracion actual usada por Docker Compose

El `docker-compose.yml` ya tiene definidas las variables necesarias para que el profesor pueda ejecutar el proyecto directamente, sin depender del `.env` raiz.

Configuracion principal:

- Frontend en `3000`
- Backend publicado en `4001`
- MySQL en `3306`
- Base de datos: `bienes_raices_node_mvc`

## Prueba rapida de funcionamiento

Cuando todo este arriba:

1. Abre `http://localhost:3000`
2. Verifica que cargue el frontend
3. Abre `http://localhost:4001/api/health`
4. Verifica que el backend responda correctamente
5. Prueba el flujo de registro desde la aplicacion

## Ejecucion local sin Docker

Si necesitas ejecutar los servicios manualmente sin Docker, puedes hacerlo asi.

### Backend

```bash
cd backend
npm install
npm run dev
```

El backend local usa `backend/.env`.

### Frontend

```bash
cd frontend
npm install
npm run build:css
npm run dev
```

El frontend local usa `frontend/.env`.

Nota:

- en ejecucion local, normalmente el backend corre en `http://localhost:4000`
- en Docker Compose, el backend se expone en `http://localhost:4001`

## Problemas comunes

### Docker no inicia

Si aparece un error relacionado con:

```text
dockerDesktopLinuxEngine
```

abre Docker Desktop y espera a que termine de iniciar.

### El puerto del backend ya esta ocupado

Si Docker indica que un puerto no esta disponible, revisa si tienes otro proceso usando `3000`, `3306` o `4001`.

Puedes inspeccionarlo en Windows con:

```powershell
netstat -ano | findstr :4001
```

### Los cambios de `init.sql` no se reflejan

Debes borrar el volumen y reconstruir:

```bash
docker compose down -v
docker compose up --build
```

## Autores

- Santiago Gonzalez
- Mario Andrade
- David Rivera
