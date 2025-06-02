import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { rutasUsuarios } from './rutas/usuarios.js'
import { rutasProductos } from './rutas/productos.js'
import { conectarBaseDatos, cerrarConexion } from './config/database.js'

const aplicacion = new Hono()

aplicacion.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200)
  }
  
  await next()
})

aplicacion.use('*', async (c, next) => {
  console.log(`${new Date().toISOString()} - ${c.req.method} ${c.req.url}`)
  await next()
})

aplicacion.get('/', (c) => {
  return c.json({ 
    mensaje: '¡Bienvenido a la API CRUD!',
    version: '1.0.0',
    rutas_disponibles: {
      usuarios: '/usuarios',
      productos: '/productos'
    }
  })
})

// Registrar rutas
aplicacion.route('/usuarios', rutasUsuarios)
aplicacion.route('/productos', rutasProductos)

aplicacion.notFound((c) => {
  return c.json({ error: 'Ruta no encontrada' }, 404)
})

aplicacion.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Error interno del servidor' }, 500)
})

const puerto = process.env.PORT || 3000

// Función para inicializar el servidor
async function iniciarServidor() {
  try {
    // Conectar a MongoDB primero
    await conectarBaseDatos()
    console.log(`Base de datos conectada exitosamente`)
    
    // Iniciar el servidor HTTP
    console.log(`Servidor iniciando en el puerto ${puerto}`)
    
    serve({
      fetch: aplicacion.fetch,
      port: puerto
    })
    
    console.log(`Servidor corriendo en http://localhost:${puerto}`)
  } catch (error) {
    console.error('Error iniciando el servidor:', error)
    process.exit(1)
  }
}

// Manejar cierre del proceso
process.on('SIGINT', async () => {
  console.log('\n Cerrando servidor...')
  await cerrarConexion()
  process.exit(0)
})

process.on('SIGTERM', async () => {
  console.log('\n Cerrando servidor...')
  await cerrarConexion()
  process.exit(0)
})

// Inicializar el servidor
iniciarServidor()
