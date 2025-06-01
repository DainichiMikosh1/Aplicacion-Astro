# 🚀 Aplicación CRUD Completa - Backend + Frontend

Esta aplicación consiste en un sistema CRUD completo con backend desarrollado en **Hono.js** y frontend desarrollado en **Astro**.

## 📁 Estructura del Proyecto

```
Backend/
├── Aplicacion-backend/          # Backend API con Hono.js
│   ├── servidor.js             # Servidor principal
│   ├── rutas/
│   │   ├── usuarios.js         # CRUD de usuarios
│   │   └── productos.js        # CRUD de productos
│   ├── utilidades.js           # Funciones utilitarias
│   ├── package.json            # Dependencias del backend
│   ├── README.md               # Documentación del backend
│   └── EJEMPLOS.md             # Ejemplos de uso de la API
│
└── Aplicacion/                  # Frontend con Astro
    ├── src/pages/index.astro    # Interfaz de pruebas
    ├── package.json             # Dependencias del frontend
    └── README.md                # Documentación del frontend
```

## 🛠️ Tecnologías Utilizadas

### Backend (Aplicacion-backend)
- **Hono.js**: Framework web ligero y rápido
- **Node.js**: Runtime de JavaScript
- **ES Modules**: Módulos modernos de JavaScript

### Frontend (Aplicacion)
- **Astro**: Framework moderno para sitios web estáticos
- **HTML/CSS/JavaScript**: Tecnologías web estándar
- **Fetch API**: Para comunicación con el backend

## 🚀 Instrucciones de Ejecución

### 1. Iniciar el Backend

```bash
cd Aplicacion-backend
npm install    # (si no está instalado)
npm start
```

El backend se ejecutará en: `http://localhost:3000`

### 2. Iniciar el Frontend

```bash
cd Aplicacion
npm install    # (si no está instalado)
npm run dev
```

El frontend se ejecutará en: `http://localhost:4321`

### 3. Usar la Aplicación

1. Abre tu navegador en `http://localhost:4321`
2. Verás una interfaz con tres pestañas:
   - **Usuarios**: Gestión completa de usuarios
   - **Productos**: Gestión completa de productos
   - **Info API**: Información sobre la API

## 📋 Funcionalidades Implementadas

### 👥 Gestión de Usuarios
- ✅ **Listar usuarios**: Ver todos los usuarios
- ✅ **Buscar por ID**: Obtener un usuario específico
- ✅ **Crear usuario**: Agregar nuevo usuario
- ✅ **Actualizar completo (PUT)**: Modificar todos los campos
- ✅ **Actualizar parcial (PATCH)**: Modificar campos específicos
- ✅ **Eliminar usuario**: Borrar usuario por ID

### 🛍️ Gestión de Productos
- ✅ **Listar productos**: Ver todos los productos con filtros
- ✅ **Buscar por ID**: Obtener un producto específico
- ✅ **Buscar por categoría**: Filtrar productos por categoría
- ✅ **Filtros avanzados**: Por precio mínimo/máximo
- ✅ **Crear producto**: Agregar nuevo producto
- ✅ **Actualizar stock**: Modificar cantidad en inventario
- ✅ **Eliminar producto**: Borrar producto por ID

## 🔧 Características Técnicas

### Backend
- **CORS habilitado**: Permite peticiones desde el frontend
- **Validación de datos**: Verificación de campos requeridos
- **Manejo de errores**: Respuestas consistentes de error
- **Logs automáticos**: Registro de todas las peticiones
- **Datos en memoria**: Base de datos simulada para demostración

### Frontend
- **Interfaz intuitiva**: Diseño moderno y responsive
- **Manejo de respuestas**: Visualización clara de éxitos/errores
- **Formularios dinámicos**: Validación del lado cliente
- **Pruebas en tiempo real**: Comunicación inmediata con la API

## 🧪 Ejemplos de Uso

### Crear un Usuario
1. Ve a la pestaña "Usuarios"
2. Llena el formulario "Crear Usuario"
3. Haz clic en "Crear Usuario"
4. Verás la respuesta de la API

### Filtrar Productos
1. Ve a la pestaña "Productos" 
2. En la sección de filtros, ingresa:
   - Categoría: "Electrónicos"
   - Precio mínimo: 100
3. Haz clic en "Obtener Productos"
4. Verás solo los productos que coincidan

## 📡 Endpoints de la API

### Usuarios
- `GET /usuarios` - Listar todos los usuarios
- `GET /usuarios/:id` - Obtener usuario por ID
- `POST /usuarios` - Crear nuevo usuario
- `PUT /usuarios/:id` - Actualizar usuario completo
- `PATCH /usuarios/:id` - Actualizar usuario parcial
- `DELETE /usuarios/:id` - Eliminar usuario

### Productos
- `GET /productos` - Listar productos (con filtros opcionales)
- `GET /productos/:id` - Obtener producto por ID
- `GET /productos/categoria/:categoria` - Productos por categoría
- `POST /productos` - Crear nuevo producto
- `PATCH /productos/:id/stock` - Actualizar stock
- `DELETE /productos/:id` - Eliminar producto

## ⚡ Estado Actual

✅ **Backend**: Completamente funcional con todas las rutas CRUD
✅ **Frontend**: Interfaz completa para probar todas las funcionalidades
✅ **CORS**: Configurado para permitir comunicación entre frontend y backend
✅ **Pruebas**: Ambos servidores ejecutándose correctamente

## 🎯 Próximos Pasos

- [ ] Agregar persistencia de datos (base de datos real)
- [ ] Implementar autenticación y autorización
- [ ] Agregar más validaciones del lado servidor
- [ ] Mejorar el diseño del frontend
- [ ] Agregar tests automatizados

---

**¡La aplicación está lista para usar!** 🎉

Ambos servidores están funcionando correctamente y puedes comenzar a probar todas las funcionalidades CRUD desde la interfaz web.
