import { Hono } from 'hono'
import {
  obtenerTodosLosUsuarios,
  obtenerUsuarioPorId,
  crearUsuario,
  actualizarUsuario,
  eliminarUsuario
} from '../modelos/Usuario.js'

export const rutasUsuarios = new Hono()

// GET - Obtener todos los usuarios
rutasUsuarios.get('/', async (c) => {
  try {
    const usuarios = await obtenerTodosLosUsuarios()
    return c.json({
      mensaje: 'Lista de usuarios obtenida exitosamente',
      datos: usuarios,
      total: usuarios.length
    })
  } catch (error) {
    console.error('Error obteniendo usuarios:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// GET - Obtener usuario por ID
rutasUsuarios.get('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const usuario = await obtenerUsuarioPorId(id)
    
    if (!usuario) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Usuario encontrado',
      datos: usuario
    })
  } catch (error) {
    console.error('Error obteniendo usuario por ID:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// POST - Crear nuevo usuario
rutasUsuarios.post('/', async (c) => {
  try {
    const datosUsuario = await c.req.json()
    
    const nuevoUsuario = await crearUsuario(datosUsuario)
    
    return c.json({
      mensaje: 'Usuario creado exitosamente',
      datos: nuevoUsuario
    }, 201)
  } catch (error) {
    console.error('Error creando usuario:', error)
    
    if (error.message.includes('Errores de validación') || 
        error.message.includes('email ya está registrado')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// PUT - Actualizar usuario completo
rutasUsuarios.put('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const datosActualizacion = await c.req.json()
    
    const usuarioActualizado = await actualizarUsuario(id, datosActualizacion)
    
    if (!usuarioActualizado) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Usuario actualizado exitosamente',
      datos: usuarioActualizado
    })
  } catch (error) {
    console.error('Error actualizando usuario:', error)
    
    if (error.message.includes('Errores de validación') || 
        error.message.includes('email ya está registrado') ||
        error.message.includes('ID de usuario inválido')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// PATCH - Actualizar usuario parcialmente
rutasUsuarios.patch('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const datosActualizacion = await c.req.json()
    
    const usuarioActualizado = await actualizarUsuario(id, datosActualizacion)
    
    if (!usuarioActualizado) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Usuario actualizado parcialmente',
      datos: usuarioActualizado
    })
  } catch (error) {
    console.error('Error actualizando usuario parcialmente:', error)
    
    if (error.message.includes('Errores de validación') || 
        error.message.includes('email ya está registrado') ||
        error.message.includes('ID de usuario inválido')) {
      return c.json({ error: error.message }, 400)
    }
    
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})

// DELETE - Eliminar usuario
rutasUsuarios.delete('/:id', async (c) => {
  try {
    const id = c.req.param('id')
    const usuarioEliminado = await eliminarUsuario(id)
    
    if (!usuarioEliminado) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }
    
    return c.json({
      mensaje: 'Usuario eliminado exitosamente',
      datos: usuarioEliminado
    })
  } catch (error) {
    console.error('Error eliminando usuario:', error)
    return c.json({ error: 'Error interno del servidor' }, 500)
  }
})
