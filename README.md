# EstadiaPro · Plataforma de estadías estilo Airbnb

Aplicación web full‑stack inspirada en Airbnb, organizada como **monorepo** y separada
en **tres capas independientes**, cada una con su propia imagen de Docker:

| Capa | Carpeta | Tecnología | Puerto |
|------|---------|-----------|--------|
| **Frontend** | `frontend/` | Express + Pug + Tailwind (SSR) | `3000` |
| **Backend** | `backend/` | API REST con Express + Sequelize | `4001` → `4000` interno |
| **Base de datos** | `database/` | MySQL 8 (inicialización + volumen) | `3306` |

El `frontend` nunca habla directamente con la base de datos: consume la **API REST** del
`backend` (proxy `/api` + render del lado del servidor). El `backend` es el único que
accede a **MySQL**. Esta separación permite construir, escalar y desplegar cada capa por
separado.

```
┌────────────┐      HTTP /api      ┌────────────┐     Sequelize     ┌──────────┐
│  Frontend  │  ───────────────▶   │  Backend   │  ───────────────▶ │  MySQL   │
│  (Pug SSR) │                     │ (REST API) │                   │   8.0    │
└────────────┘                     └────────────┘                   └──────────┘
   :3000                              :4001/:4000                       :3306
```

## ✨ Funcionalidades

### Para viajeros
- Explorar estadías con **buscador** (destino, tipo, huéspedes), filtros y ordenamiento.
- **Ficha de propiedad** con galería, servicios, anfitrión, reseñas y mapa de datos.
- **Reservas** con cálculo automático de noches/total y control de disponibilidad.
- **Favoritos**, **panel personal** y **perfil editable**.
- Publicar **reseñas** de propiedades en las que se ha hospedado.

### Para anfitriones
- Convertirse en anfitrión desde el perfil.
- **CRUD de propiedades** (con servicios y fotos) y cola de moderación.
- Ver **reservas recibidas** e ingresos.

### Panel de administración (funcionalidades destacadas)
1. **Dashboard analítico** con gráficos (reservas e ingresos por mes, propiedades por
   categoría, top propiedades) usando Chart.js.
2. **Moderación de propiedades**: aprobar, rechazar y destacar publicaciones.
3. **Gestión de usuarios**: cambiar rol, verificar, suspender/reactivar cuentas.
4. **Moderación de reseñas**: ocultar, mostrar o eliminar comentarios.
5. **Motor de precios dinámicos**: compara cada propiedad con el promedio de su ciudad y
   sugiere un precio óptimo de mercado.
6. **Anuncios globales**: publica un banner visible en todo el sitio.
7. **Bitácora de auditoría**: registra cada acción administrativa.
8. **Exportación de reservas a CSV**.

## 🚀 Ejecución con Docker Compose (recomendada)

> Requisitos: Docker Desktop **abierto y en estado *Running*** y los puertos `3000`,
> `3306` y `4001` libres.

```bash
# Desde la raíz del proyecto (donde está docker-compose.yml)
docker compose up --build
```

Esto construye las imágenes de `frontend` y `backend`, descarga `mysql:8.0`, crea el
volumen persistente, ejecuta `database/init.sql` y levanta los tres servicios en orden.
El backend crea las tablas (Sequelize) y siembra datos de demostración automáticamente.

Luego abre:

- Frontend: <http://localhost:3000>
- Salud del backend: <http://localhost:4001/api/health>

Para detener y borrar todo (incluida la base de datos):

```bash
docker compose down -v
```

## 🧪 Pruebas

Las pruebas unitarias viven en el backend y corren sin necesidad de base de datos:

```bash
cd backend
npm install
npm test
```

## 🔑 Cuentas de demostración

| Rol | Email | Contraseña |
|-----|-------|-----------|
| Administrador | `admin@estadiapro.com` | `admin123` |
| Anfitrión | `valentina@estadiapro.com` | `anfitrion123` |
| Viajero | `camila@estadiapro.com` | `viajero123` |

## 💻 Ejecución local sin Docker

Requiere un MySQL accesible. Copia los `.env.example` a `.env` en cada carpeta y ajústalos.

```bash
# Backend (crea la BD, las tablas y el seed automáticamente)
cd backend && npm install && npm run dev

# Frontend (en otra terminal)
cd frontend && npm install && npm run build:css && npm run dev
```

## 📁 Estructura

```
.
├── docker-compose.yml
├── database/            # init.sql de MySQL
├── backend/             # API REST (Express + Sequelize)
│   └── src/{config,models,services,controllers,routes,middlewares,helpers,seed}
└── frontend/            # SSR (Express + Pug + Tailwind)
    └── src/{config,controllers,routes,middlewares,helpers,views,public}
```

## 👥 Autor

- Santiago González Marín
