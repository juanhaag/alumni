# Alumni Project

Este proyecto consiste en una aplicación fullstack con un backend en Node.js/Express y un frontend en React para gestionar recursos de alumnos.

## Estructura del Proyecto

```
alumni/
├── backend/           # API REST con Express y Sequelize
│   ├── config/        # Configuración de base de datos 
│   ├── controllers/   # Controladores de recursos
│   ├── models/        # Modelos Sequelize
│   ├── routes/        # Rutas de la API
│   └── migrations/    # Migraciones de base de datos
├── frontend/          # Aplicación React
│   ├── public/
│   └── src/
│       ├── layouts/   # Componentes de layout
│       ├── pages/     # Componentes de páginas
│       └── services/  # Servicios para API
```

## Requisitos Previos

- Node.js (v14+)
- MySQL
- npm o yarn
- docker compose para levantar el mysql (opcional)

## Configuración Inicial

### Base de datos

1. Crea una base de datos MySQL llamada `alumni`:

```sql
CREATE DATABASE alumni;
```

2. Configura las credenciales en `backend/config/database.js` si es necesario.

### Backend

1. Instala las dependencias:

```bash
cd backend
npm install
```

2. Ejecuta las migraciones(Puede que no tenga):

```bash
npx sequelize-cli db:migrate
```

### Frontend

1. Instala las dependencias:

```bash
cd frontend
npm install
```

2. Crea un archivo `.env` para configurar la URL de la API:

```
REACT_APP_API_URL=http://localhost:3001/api
```

## Ejecución del Proyecto

### Backend

```bash
cd backend
npm start
# O para desarrollo
npx nodemon server.js
```

El servidor se ejecutará en http://localhost:3001

### Frontend

```bash
cd frontend
npm start
```

La aplicación se ejecutará en http://localhost:3000

## Generador de Recursos

El proyecto incluye un generador CLI para crear nuevos recursos CRUD completos:

### Uso

```bash
cd backend
node create-resource.js <NombreDelRecurso>
```

> **Nota**: El nombre del recurso debe estar en singular y con la primera letra mayúscula (ej. User, Product, Student)

### Ejemplo

```bash
node create-resource.js Student
```

Este comando generará:

#### En el Backend:
- Modelo `Student.js`
- Controlador `StudentController.js` 
- Rutas `StudentRoutes.js`
- Migración para la tabla `students`

#### En el Frontend:
- Páginas CRUD en `frontend/src/pages/Student/`:
  - `List.jsx`: Vista de lista
  - `Create.jsx`: Formulario de creación
  - `Edit.jsx`: Formulario de edición
  - `View.jsx`: Vista de detalles
- Registro automático de rutas

### Después de Generar un Recurso

1. Ejecuta la migración:

```bash
cd backend
npx sequelize-cli db:migrate
```

2. Reinicia el servidor backend y el frontend

## API REST

La API sigue convenciones RESTful:

- `GET /api/resource` - Lista todos los recursos
- `GET /api/resource/:id` - Obtiene un recurso por ID
- `POST /api/resource` - Crea un nuevo recurso
- `PUT /api/resource/:id` - Actualiza un recurso existente
- `DELETE /api/resource/:id` - Elimina un recurso

## Rutas Frontend

- `/:resource` - Listado de recursos (ej: `/students`)
- `/:resource/create` - Formulario para crear un recurso
- `/:resource/:id` - Vista detallada de un recurso
- `/:resource/:id/edit` - Formulario para editar un recurso

## Tecnologías

### Backend
- Express.js: Framework web
- Sequelize: ORM para MySQL
- Commander: Para la CLI de generación de recursos

### Frontend
- React
- React Router DOM
- Material UI
- Axios