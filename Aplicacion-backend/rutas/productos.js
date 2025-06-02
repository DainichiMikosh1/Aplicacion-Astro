import { Hono } from 'hono'
import {
  obtenerTodosLosProductos,
  obtenerProductoPorId,
  obtenerProductosPorCategoria,
  crearProducto,
  actualizarProducto,
  eliminarProducto,
  actualizarStockProducto
} from '../modelos/Producto.js'

export const rutasProductos = new Hono()

// GET - Obtener todos los productos (con filtros opcionales)
rutasProductos.get('/', async (c) => {
  try {
    const filtros = {}
    
    // Obtener parámetros de consulta
    const categoria = c.req.query('categoria')
    const precioMin = c.req.query('precio_min')
    const precioMax = c.req.query('precio_max')
    
    if (categoria) filtros.categoria = categoria
    if (precioMin) filtros.precio_min = precioMin
    if (precioMax) filtros.precio_max = precioMax
    
    const productos = await obtenerTodosLosProductos(filtros)
    
    return c.json({
      mensaje: 'Lista de productos obtenida exitosamente',
      datos: productos,
      total: productos.length,
      filtros_aplicados: {
        categoria: categoria || 'ninguno',
        precio_min: precioMin || 'ninguno',
        precio_max: precioMax || 'ninguno'
      }
    })
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// GET - Obtener producto por ID
rutasProductos.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const producto = await obtenerProductoPorId(id)
    
    if (!producto) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Producto encontrado',
      datos: producto
    })
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// GET - Obtener productos por categoría
rutasProductos.get('/categoria/:categoria', async (c) => {
  try {
    const categoria = c.req.param('categoria')
    const productos = await obtenerProductosPorCategoria(categoria)
    
    return c.json({
      mensaje: `Productos de la categoría "${categoria}"`,
      datos: productos,
      total: productos.length
    })
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// POST - Crear nuevo producto
rutasProductos.post('/', async (c) => {
  try {
    const datosProducto = await c.req.json()
    
    const nuevoProducto = await crearProducto(datosProducto)
    
    return c.json({
      mensaje: 'Producto creado exitosamente',
      datos: nuevoProducto
    }, 201)
  } catch (error) {
    console.error('Error creando producto:', error)
    
    if (error.message.includes('Errores de validación')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// PUT - Actualizar producto completo
rutasProductos.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const datosActualizacion = await c.req.json()
    
    const productoActualizado = await actualizarProducto(id, datosActualizacion)
    
    if (!productoActualizado) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Producto actualizado exitosamente',
      datos: productoActualizado
    })
  } catch (error) {
    console.error('Error actualizando producto:', error)
    
    if (error.message.includes('Errores de validación') ||
        error.message.includes('ID de producto inválido')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// PATCH - Actualizar producto parcialmente
rutasProductos.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const datosActualizacion = await c.req.json()
    
    const productoActualizado = await actualizarProducto(id, datosActualizacion)
    
    if (!productoActualizado) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Producto actualizado parcialmente',
      datos: productoActualizado
    })
  } catch (error) {
    console.error('Error actualizando producto parcialmente:', error)
    
    if (error.message.includes('Errores de validación') ||
        error.message.includes('ID de producto inválido')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// DELETE - Eliminar producto
rutasProductos.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const productoEliminado = await eliminarProducto(id)
    
    if (!productoEliminado) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Producto eliminado exitosamente',
      datos: productoEliminado
    })
  } catch (error) {
    console.error('Error eliminando producto:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// PUT - Actualizar stock del producto
rutasProductos.put('/:id/stock', async (c) => {
  try {
    const id = c.req.param('id')
    const { stock } = await c.req.json()
    
    const productoActualizado = await actualizarStockProducto(id, stock)
    
    if (!productoActualizado) {
      return c.json({ error: 'Producto no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Stock actualizado exitosamente',
      datos: productoActualizado
    })
  } catch (error) {
    console.error('Error actualizando stock:', error)
    
    if (error.message.includes('ID de producto inválido') ||
        error.message.includes('Stock debe ser')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})
