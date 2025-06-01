# API CRUD - Aplicación Backend

Una API REST simple construida con Hono.js que implementa operaciones CRUD para usuarios y productos.

## 🚀 Características

- **Framework**: Hono.js - Framework web ultrarrápido para JavaScript
- **Arquitectura**: RESTful API con rutas modulares
- **Base de datos**: Simulada en memoria (para propósitos de demostración)
- **Idioma**: Rutas y funciones en español
- **Validaciones**: Validación de entrada y manejo de errores

## 📦 Instalación

1. Navegar al directorio del proyecto:
```bash
cd Aplicacion-backend
```

2. Instalar dependencias:
```bash
npm install
```

3. Iniciar el servidor:
```bash
npm start
```

O para desarrollo con auto-reload:
```bash
npm run dev
```

El servidor se ejecutará en `http://localhost:3000`

## 📚 Endpoints de la API

### Ruta Principal
- `GET /` - Información de bienvenida y rutas disponibles

### Usuarios (`/usuarios`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/usuarios` | Obtener todos los usuarios |
| `GET` | `/usuarios/:id` | Obtener usuario por ID |
| `POST` | `/usuarios` | Crear nuevo usuario |
| `PUT` | `/usuarios/:id` | Actualizar usuario completo |
| `PATCH` | `/usuarios/:id` | Actualizar usuario parcialmente |
| `DELETE` | `/usuarios/:id` | Eliminar usuario |

#### Estructura de Usuario
```json
{
  "id": 1,
  "nombre": "Juan Pérez",
  "email": "juan@email.com",
  "edad": 30
}
```

### Productos (`/productos`)

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `GET` | `/productos` | Obtener todos los productos (con filtros opcionales) |
| `GET` | `/productos/:id` | Obtener producto por ID |
| `GET` | `/productos/categoria/:categoria` | Obtener productos por categoría |
| `POST` | `/productos` | Crear nuevo producto |
| `PUT` | `/productos/:id` | Actualizar producto completo |
| `PATCH` | `/productos/:id` | Actualizar producto parcialmente |
| `PUT` | `/productos/:id/stock` | Actualizar solo el stock |
| `DELETE` | `/productos/:id` | Eliminar producto |

#### Estructura de Producto
```json
{
  "id": 1,
  "nombre": "Laptop Dell",
  "precio": 800.99,
  "categoria": "Electrónicos",
  "stock": 15
}
```

#### Filtros para Productos
- `?categoria=Electrónicos` - Filtrar por categoría
- `?precio_min=100` - Precio mínimo
- `?precio_max=500` - Precio máximo

## 🔧 Ejemplos de Uso

### Crear un Usuario
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Martínez",
    "email": "ana@email.com",
    "edad": 28
  }'
```

### Obtener Todos los Productos
```bash
curl http://localhost:3000/productos
```

### Filtrar Productos por Categoría y Precio
```bash
curl "http://localhost:3000/productos?categoria=Electrónicos&precio_max=500"
```

### Actualizar Stock de un Producto
```bash
curl -X PUT http://localhost:3000/productos/1/stock \
  -H "Content-Type: application/json" \
  -d '{"stock": 20}'
```

## 📁 Estructura del Proyecto

```
Aplicacion-backend/
├── servidor.js          # Archivo principal del servidor
├── rutas/
│   ├── usuarios.js      # Rutas CRUD para usuarios
│   └── productos.js     # Rutas CRUD para productos
├── package.json         # Configuración del proyecto
└── README.md           # Este archivo
```

## 🛠️ Características Técnicas

- **Middleware de logging**: Registra todas las peticiones HTTP
- **Manejo de errores**: Middleware centralizado para errores
- **Validaciones**: Validación de entrada para todos los endpoints
- **Respuestas consistentes**: Formato JSON estructurado
- **Códigos de estado HTTP**: Implementación correcta de códigos de respuesta

## 🔄 Respuestas de la API

Todas las respuestas siguen un formato consistente:

### Éxito
```json
{
  "mensaje": "Descripción de la operación",
  "datos": { /* objeto o array de datos */ },
  "total": 10 // solo en listados
}
```

### Error
```json
{
  "error": "Descripción del error",
  "campos_requeridos": ["campo1", "campo2"] // cuando aplique
}
```

## 🚧 Próximas Mejoras

- [ ] Integración con base de datos real (MongoDB, PostgreSQL)
- [ ] Autenticación y autorización
- [ ] Paginación para listados grandes
- [ ] Documentación interactiva con Swagger
- [ ] Tests unitarios y de integración
- [ ] Variables de entorno para configuración
- [ ] Rate limiting
- [ ] Logging avanzado

## 📝 Notas

Esta es una implementación de demostración que utiliza almacenamiento en memoria. En un entorno de producción, se recomienda integrar con una base de datos real y agregar autenticación, validaciones más robustas y manejo de errores más completo.
