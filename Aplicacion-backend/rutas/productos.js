import { Hono } from 'hono'

export const rutasProductos = new Hono()

// Base de datos simulada en memoria
let productos = [
  { id: 1, nombre: 'Laptop Dell', precio: 800.99, categoria: 'Electrónicos', stock: 15 },
  { id: 2, nombre: 'Smartphone Samsung', precio: 450.00, categoria: 'Electrónicos', stock: 25 },
  { id: 3, nombre: 'Mesa de Oficina', precio: 120.50, categoria: 'Muebles', stock: 8 },
  { id: 4, nombre: 'Libro de JavaScript', precio: 35.99, categoria: 'Libros', stock: 50 }
]

let siguienteId = 5

// GET - Obtener todos los productos
rutasProductos.get('/', (c) => {
  const categoria = c.req.query('categoria')
  const precioMin = c.req.query('precio_min')
  const precioMax = c.req.query('precio_max')
  
  let productosFiltrados = [...productos]
  
  // Filtrar por categoría
  if (categoria) {
    productosFiltrados = productosFiltrados.filter(p => 
      p.categoria.toLowerCase().includes(categoria.toLowerCase())
    )
  }
  
  // Filtrar por precio mínimo
  if (precioMin) {
    productosFiltrados = productosFiltrados.filter(p => p.precio >= parseFloat(precioMin))
  }
  
  // Filtrar por precio máximo
  if (precioMax) {
    productosFiltrados = productosFiltrados.filter(p => p.precio <= parseFloat(precioMax))
  }
  
  return c.json({
    mensaje: 'Lista de productos obtenida exitosamente',
    datos: productosFiltrados,
    total: productosFiltrados.length,
    filtros_aplicados: {
      categoria: categoria || 'ninguno',
      precio_min: precioMin || 'ninguno',
      precio_max: precioMax || 'ninguno'
    }
  })
})

// GET - Obtener producto por ID
rutasProductos.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const producto = productos.find(p => p.id === id)
  
  if (!producto) {
    return c.json({ error: 'Producto no encontrado' }, 404)
  }
  
  return c.json({
    mensaje: 'Producto encontrado',
    datos: producto
  })
})

// GET - Obtener productos por categoría
rutasProductos.get('/categoria/:categoria', (c) => {
  const categoria = c.req.param('categoria')
  const productosPorCategoria = productos.filter(p => 
    p.categoria.toLowerCase() === categoria.toLowerCase()
  )
  
  return c.json({
    mensaje: `Productos de la categoría "${categoria}"`,
    datos: productosPorCategoria,
    total: productosPorCategoria.length
  })
})

// POST - Crear nuevo producto
rutasProductos.post('/', async (c) => {
  try {
    const { nombre, precio, categoria, stock } = await c.req.json()
    
    // Validaciones básicas
    if (!nombre || precio === undefined || !categoria || stock === undefined) {
      return c.json({ 
        error: 'Faltan campos requeridos', 
        campos_requeridos: ['nombre', 'precio', 'categoria', 'stock'] 
      }, 400)
    }
    
    // Validar tipos de datos
    if (isNaN(precio) || isNaN(stock)) {
      return c.json({ error: 'Precio y stock deben ser números válidos' }, 400)
    }
    
    if (precio < 0 || stock < 0) {
      return c.json({ error: 'Precio y stock no pueden ser negativos' }, 400)
    }
    
    const nuevoProducto = {
      id: siguienteId++,
      nombre,
      precio: parseFloat(precio),
      categoria,
      stock: parseInt(stock)
    }
    
    productos.push(nuevoProducto)
    
    return c.json({
      mensaje: 'Producto creado exitosamente',
      datos: nuevoProducto
    }, 201)
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})

// PUT - Actualizar producto completo
rutasProductos.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const { nombre, precio, categoria, stock } = await c.req.json()
    
    const indiceProducto = productos.findIndex(p => p.id === id)
    if (indiceProducto === -1) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    // Validaciones
    if (!nombre || precio === undefined || !categoria || stock === undefined) {
      return c.json({ 
        error: 'Faltan campos requeridos', 
        campos_requeridos: ['nombre', 'precio', 'categoria', 'stock'] 
      }, 400)
    }
    
    if (isNaN(precio) || isNaN(stock)) {
      return c.json({ error: 'Precio y stock deben ser números válidos' }, 400)
    }
    
    if (precio < 0 || stock < 0) {
      return c.json({ error: 'Precio y stock no pueden ser negativos' }, 400)
    }
    
    productos[indiceProducto] = {
      id,
      nombre,
      precio: parseFloat(precio),
      categoria,
      stock: parseInt(stock)
    }
    
    return c.json({
      mensaje: 'Producto actualizado exitosamente',
      datos: productos[indiceProducto]
    })
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})

// PATCH - Actualizar producto parcialmente
rutasProductos.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const actualizaciones = await c.req.json()
    
    const indiceProducto = productos.findIndex(p => p.id === id)
    if (indiceProducto === -1) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    // Validar tipos si se proporcionan
    if (actualizaciones.precio !== undefined && (isNaN(actualizaciones.precio) || actualizaciones.precio < 0)) {
      return c.json({ error: 'Precio debe ser un número válido no negativo' }, 400)
    }
    
    if (actualizaciones.stock !== undefined && (isNaN(actualizaciones.stock) || actualizaciones.stock < 0)) {
      return c.json({ error: 'Stock debe ser un número válido no negativo' }, 400)
    }
    
    // Actualizar solo los campos proporcionados
    productos[indiceProducto] = {
      ...productos[indiceProducto],
      ...actualizaciones,
      id, // Mantener el ID original
      precio: actualizaciones.precio !== undefined ? parseFloat(actualizaciones.precio) : productos[indiceProducto].precio,
      stock: actualizaciones.stock !== undefined ? parseInt(actualizaciones.stock) : productos[indiceProducto].stock
    }
    
    return c.json({
      mensaje: 'Producto actualizado parcialmente',
      datos: productos[indiceProducto]
    })
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})

// DELETE - Eliminar producto
rutasProductos.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const indiceProducto = productos.findIndex(p => p.id === id)
  
  if (indiceProducto === -1) {
    return c.json({ error: 'Producto no encontrado' }, 404)
  }
  
  const productoEliminado = productos.splice(indiceProducto, 1)[0]
  
  return c.json({
    mensaje: 'Producto eliminado exitosamente',
    datos: productoEliminado
  })
})

// PUT - Actualizar stock del producto
rutasProductos.put('/:id/stock', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const { stock } = await c.req.json()
    
    const indiceProducto = productos.findIndex(p => p.id === id)
    if (indiceProducto === -1) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    if (stock === undefined || isNaN(stock) || stock < 0) {
      return c.json({ error: 'Stock debe ser un número válido no negativo' }, 400)
    }
    
    productos[indiceProducto].stock = parseInt(stock)
    
    return c.json({
      mensaje: 'Stock actualizado exitosamente',
      datos: productos[indiceProducto]
    })
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})
