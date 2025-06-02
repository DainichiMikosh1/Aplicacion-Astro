import { ObjectId } from 'mongodb'
import { obtenerBaseDatos } from '../config/database.js'

const COLECCION_USUARIOS = 'usuarios'

function obtenerColeccionUsuarios() {
  const bd = obtenerBaseDatos()
  return bd.collection(COLECCION_USUARIOS)
}

function validarUsuario(usuario, esActualizacion = false) {
  const errores = []
  
  if (!esActualizacion || usuario.nombre !== undefined) {
    if (!usuario.nombre || typeof usuario.nombre !== 'string' || usuario.nombre.trim().length === 0) {
      errores.push('nombre es requerido y debe ser una cadena no vacía')
    }
  }
  
  if (!esActualizacion || usuario.email !== undefined) {
    if (!usuario.email || typeof usuario.email !== 'string') {
      errores.push('email es requerido y debe ser una cadena')
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(usuario.email)) {
        errores.push('email debe tener un formato válido')
      }
    }
  }
  
  if (!esActualizacion || usuario.edad !== undefined) {
    if (usuario.edad === undefined || usuario.edad === null) {
      errores.push('edad es requerida')
    } else {
      const edad = parseInt(usuario.edad)
      if (isNaN(edad) || edad < 0 || edad > 150) {
        errores.push('edad debe ser un número entre 0 y 150')
      }
    }
  }
  
  return errores
}

export async function obtenerTodosLosUsuarios() {
  try {
    const coleccion = obtenerColeccionUsuarios()
    const usuarios = await coleccion.find({}).toArray()
    return usuarios
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    throw error
  }
}

export async function obtenerUsuarioPorId(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    const coleccion = obtenerColeccionUsuarios()
    const usuario = await coleccion.findOne({ _id: new ObjectId(id) })
    return usuario
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error)
    throw error
  }
}

export async function obtenerUsuarioPorEmail(email) {
  try {
    const coleccion = obtenerColeccionUsuarios()
    const usuario = await coleccion.findOne({ email })
    return usuario
  } catch (error) {
    console.error('Error obteniendo usuario por email:', error)
    throw error
  }
}

export async function crearUsuario(datosUsuario) {
  try {
    // Validar datos
    const errores = validarUsuario(datosUsuario)
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`)
    }
    
    // Verificar si el email ya existe
    const usuarioExistente = await obtenerUsuarioPorEmail(datosUsuario.email)
    if (usuarioExistente) {
      throw new Error('El email ya está registrado')
    }
    
    const coleccion = obtenerColeccionUsuarios()
    const nuevoUsuario = {
      nombre: datosUsuario.nombre.trim(),
      email: datosUsuario.email.toLowerCase().trim(),
      edad: parseInt(datosUsuario.edad),
      fechaCreacion: new Date(),
      fechaActualizacion: new Date()
    }
    
    const resultado = await coleccion.insertOne(nuevoUsuario)
    return await obtenerUsuarioPorId(resultado.insertedId)
  } catch (error) {
    console.error('Error creando usuario:', error)
    throw error
  }
}

export async function actualizarUsuario(id, datosActualizacion) {
  try {
    if (!ObjectId.isValid(id)) {
      throw new Error('ID de usuario inválido')
    }
    
    // Validar datos
    const errores = validarUsuario(datosActualizacion, true)
    if (errores.length > 0) {
      throw new Error(`Errores de validación: ${errores.join(', ')}`)
    }
    
    // Verificar si el usuario existe
    const usuarioExistente = await obtenerUsuarioPorId(id)
    if (!usuarioExistente) {
      return null
    }
    
    // Si se está actualizando el email, verificar que no exista en otro usuario
    if (datosActualizacion.email && datosActualizacion.email !== usuarioExistente.email) {
      const emailEnUso = await obtenerUsuarioPorEmail(datosActualizacion.email)
      if (emailEnUso && emailEnUso._id.toString() !== id) {
        throw new Error('El email ya está registrado por otro usuario')
      }
    }
    
    const coleccion = obtenerColeccionUsuarios()
    const actualizacion = {
      ...datosActualizacion,
      fechaActualizacion: new Date()
    }
    
    // Limpiar y formatear datos si se proporcionan
    if (actualizacion.nombre) {
      actualizacion.nombre = actualizacion.nombre.trim()
    }
    if (actualizacion.email) {
      actualizacion.email = actualizacion.email.toLowerCase().trim()
    }
    if (actualizacion.edad !== undefined) {
      actualizacion.edad = parseInt(actualizacion.edad)
    }
    
    await coleccion.updateOne(
      { _id: new ObjectId(id) },
      { $set: actualizacion }
    )
    
    return await obtenerUsuarioPorId(id)
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    throw error
  }
}

export async function eliminarUsuario(id) {
  try {
    if (!ObjectId.isValid(id)) {
      return null
    }
    
    const coleccion = obtenerColeccionUsuarios()
    const usuarioAEliminar = await obtenerUsuarioPorId(id)
    
    if (!usuarioAEliminar) {
      return null
    }
    
    await coleccion.deleteOne({ _id: new ObjectId(id) })
    return usuarioAEliminar
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    throw error
  }
}
