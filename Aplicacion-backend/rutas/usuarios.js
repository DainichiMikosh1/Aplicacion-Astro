import { Hono } from 'hono'

export const rutasUsuarios = new Hono()

// Base de datos simulada en memoria
let usuarios = [
  { id: 1, nombre: 'Juan Pérez', email: 'juan@email.com', edad: 30 },
  { id: 2, nombre: 'María García', email: 'maria@email.com', edad: 25 },
  { id: 3, nombre: 'Carlos López', email: 'carlos@email.com', edad: 35 }
]

let siguienteId = 4

// GET - Obtener todos los usuarios
rutasUsuarios.get('/', (c) => {
  return c.json({
    mensaje: 'Lista de usuarios obtenida exitosamente',
    datos: usuarios,
    total: usuarios.length
  })
})

// GET - Obtener usuario por ID
rutasUsuarios.get('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const usuario = usuarios.find(u => u.id === id)
  
  if (!usuario) {
    return c.json({ error: 'Usuario no encontrado' }, 404)
  }
  
  return c.json({
    mensaje: 'Usuario encontrado',
    datos: usuario
  })
})

// POST - Crear nuevo usuario
rutasUsuarios.post('/', async (c) => {
  try {
    const { nombre, email, edad } = await c.req.json()
    
    if (!nombre || !email || !edad) {
      return c.json({ 
        error: 'Faltan campos requeridos', 
        campos_requeridos: ['nombre', 'email', 'edad'] 
      }, 400)
    }
    
    const emailExiste = usuarios.some(u => u.email === email)
    if (emailExiste) {
      return c.json({ error: 'El email ya está registrado' }, 400)
    }
    
    const nuevoUsuario = {
      id: siguienteId++,
      nombre,
      email,
      edad: parseInt(edad)
    }
    
    usuarios.push(nuevoUsuario)
    
    return c.json({
      mensaje: 'Usuario creado exitosamente',
      datos: nuevoUsuario
    }, 201)
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})

// PUT - Actualizar usuario completo
rutasUsuarios.put('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const { nombre, email, edad } = await c.req.json()
    
    const indiceUsuario = usuarios.findIndex(u => u.id === id)
    if (indiceUsuario === -1) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }
    
    // Validaciones
    if (!nombre || !email || !edad) {
      return c.json({ 
        error: 'Faltan campos requeridos', 
        campos_requeridos: ['nombre', 'email', 'edad'] 
      }, 400)
    }
    
    // Verificar email único (excluyendo el usuario actual)
    const emailExiste = usuarios.some(u => u.email === email && u.id !== id)
    if (emailExiste) {
      return c.json({ error: 'El email ya está registrado por otro usuario' }, 400)
    }
    
    usuarios[indiceUsuario] = {
      id,
      nombre,
      email,
      edad: parseInt(edad)
    }
    
    return c.json({
      mensaje: 'Usuario actualizado exitosamente',
      datos: usuarios[indiceUsuario]
    })
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})

// PATCH - Actualizar usuario parcialmente
rutasUsuarios.patch('/:id', async (c) => {
  try {
    const id = parseInt(c.req.param('id'))
    const actualizaciones = await c.req.json()
    
    const indiceUsuario = usuarios.findIndex(u => u.id === id)
    if (indiceUsuario === -1) {
      return c.json({ error: 'Usuario no encontrado' }, 404)
    }
    
    // Verificar email único si se está actualizando
    if (actualizaciones.email) {
      const emailExiste = usuarios.some(u => u.email === actualizaciones.email && u.id !== id)
      if (emailExiste) {
        return c.json({ error: 'El email ya está registrado por otro usuario' }, 400)
      }
    }
    
    // Actualizar solo los campos proporcionados
    usuarios[indiceUsuario] = {
      ...usuarios[indiceUsuario],
      ...actualizaciones,
      id, // Mantener el ID original
      edad: actualizaciones.edad ? parseInt(actualizaciones.edad) : usuarios[indiceUsuario].edad
    }
    
    return c.json({
      mensaje: 'Usuario actualizado parcialmente',
      datos: usuarios[indiceUsuario]
    })
  } catch (error) {
    return c.json({ error: 'Datos inválidos en el cuerpo de la petición' }, 400)
  }
})

// DELETE - Eliminar usuario
rutasUsuarios.delete('/:id', (c) => {
  const id = parseInt(c.req.param('id'))
  const indiceUsuario = usuarios.findIndex(u => u.id === id)
  
  if (indiceUsuario === -1) {
    return c.json({ error: 'Usuario no encontrado' }, 404)
  }
  
  const usuarioEliminado = usuarios.splice(indiceUsuario, 1)[0]
  
  return c.json({
    mensaje: 'Usuario eliminado exitosamente',
    datos: usuarioEliminado
  })
})
