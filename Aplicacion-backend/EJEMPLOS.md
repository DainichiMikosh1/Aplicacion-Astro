# Ejemplos de Uso de la API

Este archivo contiene ejemplos prácticos de cómo usar todas las rutas de la API CRUD.

## Información General
- **Base URL**: http://localhost:3000
- **Content-Type**: application/json (para peticiones POST/PUT/PATCH)

## 🏠 Ruta Principal

### Obtener información de la API
```bash
curl http://localhost:3000
```

## 👥 Gestión de Usuarios

### 1. Obtener todos los usuarios
```bash
curl http://localhost:3000/usuarios
```

### 2. Obtener usuario específico por ID
```bash
curl http://localhost:3000/usuarios/1
```

### 3. Crear nuevo usuario
```bash
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Ana Martínez",
    "email": "ana@email.com",
    "edad": 28
  }'
```

### 4. Actualizar usuario completo (PUT)
```bash
curl -X PUT http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan Carlos Pérez",
    "email": "juan.carlos@email.com",
    "edad": 31
  }'
```

### 5. Actualizar usuario parcialmente (PATCH)
```bash
curl -X PATCH http://localhost:3000/usuarios/1 \
  -H "Content-Type: application/json" \
  -d '{
    "edad": 32
  }'
```

### 6. Eliminar usuario
```bash
curl -X DELETE http://localhost:3000/usuarios/1
```

## 📦 Gestión de Productos

### 1. Obtener todos los productos
```bash
curl http://localhost:3000/productos
```

### 2. Obtener productos con filtros
```bash
# Por categoría
curl "http://localhost:3000/productos?categoria=Electrónicos"

# Por rango de precio
curl "http://localhost:3000/productos?precio_min=100&precio_max=500"

# Combinando filtros
curl "http://localhost:3000/productos?categoria=Libros&precio_max=50"
```

### 3. Obtener producto específico por ID
```bash
curl http://localhost:3000/productos/1
```

### 4. Obtener productos por categoría (ruta específica)
```bash
curl http://localhost:3000/productos/categoria/Electrónicos
```

### 5. Crear nuevo producto
```bash
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Tablet iPad",
    "precio": 299.99,
    "categoria": "Electrónicos",
    "stock": 10
  }'
```

### 6. Actualizar producto completo (PUT)
```bash
curl -X PUT http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Laptop Dell XPS",
    "precio": 899.99,
    "categoria": "Electrónicos",
    "stock": 12
  }'
```

### 7. Actualizar producto parcialmente (PATCH)
```bash
curl -X PATCH http://localhost:3000/productos/1 \
  -H "Content-Type: application/json" \
  -d '{
    "precio": 750.99,
    "stock": 20
  }'
```

### 8. Actualizar solo el stock
```bash
curl -X PUT http://localhost:3000/productos/1/stock \
  -H "Content-Type: application/json" \
  -d '{
    "stock": 25
  }'
```

### 9. Eliminar producto
```bash
curl -X DELETE http://localhost:3000/productos/1
```

## 🔧 Ejemplos con PowerShell (Windows)

Si usas PowerShell en Windows, puedes usar `Invoke-RestMethod`:

### Obtener usuarios
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/usuarios" -Method GET
```

### Crear usuario
```powershell
$usuario = @{
    nombre = "Pedro González"
    email = "pedro@email.com"
    edad = 27
} | ConvertTo-Json

Invoke-RestMethod -Uri "http://localhost:3000/usuarios" -Method POST -Body $usuario -ContentType "application/json"
```

### Obtener productos con filtros
```powershell
Invoke-RestMethod -Uri "http://localhost:3000/productos?categoria=Electrónicos&precio_max=500" -Method GET
```

## 📊 Respuestas Esperadas

### Usuario creado exitosamente
```json
{
  "mensaje": "Usuario creado exitosamente",
  "datos": {
    "id": 4,
    "nombre": "Ana Martínez",
    "email": "ana@email.com",
    "edad": 28
  }
}
```

### Lista de productos
```json
{
  "mensaje": "Lista de productos obtenida exitosamente",
  "datos": [
    {
      "id": 1,
      "nombre": "Laptop Dell",
      "precio": 800.99,
      "categoria": "Electrónicos",
      "stock": 15
    }
  ],
  "total": 1,
  "filtros_aplicados": {
    "categoria": "ninguno",
    "precio_min": "ninguno",
    "precio_max": "ninguno"
  }
}
```

### Error - Usuario no encontrado
```json
{
  "error": "Usuario no encontrado"
}
```

### Error - Campos faltantes
```json
{
  "error": "Faltan campos requeridos",
  "campos_requeridos": ["nombre", "email", "edad"]
}
```

## 🧪 Secuencia de Pruebas Completa

```bash
# 1. Verificar que el servidor funciona
curl http://localhost:3000

# 2. Ver usuarios iniciales
curl http://localhost:3000/usuarios

# 3. Crear un nuevo usuario
curl -X POST http://localhost:3000/usuarios \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Test User", "email": "test@email.com", "edad": 25}'

# 4. Ver productos iniciales
curl http://localhost:3000/productos

# 5. Crear un nuevo producto
curl -X POST http://localhost:3000/productos \
  -H "Content-Type: application/json" \
  -d '{"nombre": "Producto Test", "precio": 99.99, "categoria": "Test", "stock": 5}'

# 6. Actualizar el producto creado
curl -X PATCH http://localhost:3000/productos/5 \
  -H "Content-Type: application/json" \
  -d '{"precio": 89.99}'

# 7. Filtrar productos por categoría
curl "http://localhost:3000/productos?categoria=Test"
```
