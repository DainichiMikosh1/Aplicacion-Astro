import { ObjectId } from 'mongodb'
import { obtenerBaseDatos } from '../config/database.js'

const COLECCION_PRODUCTOS = 'productos'

function obtenerColeccionProductos() {
  const bd = obtenerBaseDatos()
  return bd.collection(COLECCION_PRODUCTOS)
}

function validarProducto(producto, esActualizacion = false) {
  const errores = []
  
  if (!esActualizacion || producto.nombre !== undefined) {
    if (!producto.nombre || typeof producto.nombre !== 'string' || producto.nombre.trim().length === 0) {
      errores.push('nombre es requerido y debe ser una cadena no vacía')
    }
  }
  
  if (!esActualizacion || producto.precio !== undefined) {
    if (producto.precio === undefined || producto.precio === null) {
      errores.push('precio es requerido')
    } else {
      const precio = parseFloat(producto.precio)
      if (isNaN(precio) || precio < 0) {
        errores.push('precio debe ser un número no negativo')
      }
    }
  }
  
  if (!esActualizacion || producto.categoria !== undefined) {
    if (!producto.categoria || typeof producto.categoria !== 'string' || producto.categoria.trim().length === 0) {
      errores.push('categoria es requerida y debe ser una cadena no vacía')
    }
  }
  
  if (!esActualizacion || producto.stock !== undefined) {
    if (producto.stock === undefined || producto.stock === null) {
      errores.push('stock es requerido')
    } else {
      const stock = parseInt(producto.stock)
      if (isNaN(stock) || stock < 0) {
        errores.push('stock debe ser un número entero no negativo')
      }
    }
  }
  
  return errores
}

function construirFiltros(filtros = {}) {
  const filtroMongo = {}
  
  if (filtros.categoria) {
    filtroMongo.categoria = { $regex: filtros.categoria, $options: 'i' }
  }
  
  if (filtros.precio_min !== undefined || filtros.precio_max !== undefined) {
    filtroMongo.precio = {}
    if (filtros.precio_min !== undefined) {
      filtroMongo.precio.$gte = parseFloat(filtros.precio_min)
    }
    if (filtros.precio_max !== undefined) {
      filtroMongo.precio.$lte = parseFloat(filtros.precio_max)
    }
  }
  
  return filtroMongo
}

export async function obtenerTodosLosProductos(filtros = {}) {
  try {
    const coleccion = obtenerColeccionProductos()
    const filtroMongo = construirFiltros(filtros)
    const productos = await coleccion.find(filtroMongo).toArray()
    return productos
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    throw error
  }
}

export async function obtenerProductoPorId(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    const coleccion = obtenerColeccionProductos()
    const producto = await coleccion.findOne({ _id: new ObjectId(id) })
    return producto
  } catch (error) {
    console.error('Error obteniendo producto por ID:', error)
    throw error
  }
}

export async function obtenerProductosPorCategoria(categoria) {
  try {
    const coleccion = obtenerColeccionProductos()
    const productos = await coleccion.find({ 
      categoria: { $regex: categoria, $options: 'i' } 
    }).toArray()
    return productos
  } catch (error) {
    console.error('Error obteniendo productos por categoría:', error)
    throw error
  }
}

export async function crearProducto(datosProducto) {
  try {
    // Validar datos
    const errores = validarProducto(datosProducto)
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`)
    }
    
    const coleccion = obtenerColeccionProductos()
    const nuevoProducto = {
      nombre: datosProducto.nombre.trim(),
      precio: parseFloat(datosProducto.precio),
      categoria: datosProducto.categoria.trim(),
      stock: parseInt(datosProducto.stock),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    
    const resultado = await coleccion.insertOne(nuevoProducto)
    return await obtenerProductoPorId(resultado.insertedId)
  } catch (error) {
    console.error('Error creando producto:', error)
    throw error
  }
}

export async function actualizarProducto(id, datosActualizacion) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID de producto inválido')
    }
    
    // Validar datos
    const errores = validarProducto(datosActualizacion, true)
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`)
    }
    
    // Verificar si el producto existe
    const productoExistente = await obtenerProductoPorId(id)
    if (!productoExistente) {
      return null
    }
    
    const coleccion = obtenerColeccionProductos()
    const actualizacion = {
      ...datosActualizacion,
      fechaActualizacion: new Date()
    }
    
    // Limpiar y formatear datos si se proporcionan
    if (actualizacion.nombre) {
      actualizacion.nombre = actualizacion.nombre.trim()
    }
    if (actualizacion.categoria) {
      actualizacion.categoria = actualizacion.categoria.trim()
    }
    if (actualizacion.precio !== undefined) {
      actualizacion.precio = parseFloat(actualizacion.precio)
    }
    if (actualizacion.stock !== undefined) {
      actualizacion.stock = parseInt(actualizacion.stock)
    }
    
    await coleccion.updateOne(
      { _id: new ObjectId(id) },
      { $set: actualizacion }
    )
    
    return await obtenerProductoPorId(id)
  } catch (error) {
    console.error('Error actualizando producto:', error)
    throw error
  }
}

export async function eliminarProducto(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    const coleccion = obtenerColeccionProductos()
    const productoAEliminar = await obtenerProductoPorId(id)
    
    if (!productoAEliminar) {
      return null
    }
    
    await coleccion.deleteOne({ _id: new ObjectId(id) })
    return productoAEliminar
  } catch (error) {
    console.error('Error eliminando producto:', error)
    throw error
  }
}

export async function actualizarStockProducto(id, nuevoStock) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID de producto inválido')
    }
    
    const stock = parseInt(nuevoStock)
    if (isNaN(stock) || stock < 0) {
      throw new Error('Stock debe ser un número entero no negativo')
    }
    
    // Verificar si el producto existe
    const productoExistente = await obtenerProductoPorId(id)
    if (!productoExistente) {
      return null
    }
    
    const coleccion = obtenerColeccionProductos()
    await coleccion.updateOne(
      { _id: new ObjectId(id) },
      { 
        $set: { 
          stock: stock,
          fechaActualizacion: new Date()
        }
      }
    )
    
    return await obtenerProductoPorId(id)
  } catch (error) {
    console.error('Error actualizando stock:', error)
    throw error
  }
}
