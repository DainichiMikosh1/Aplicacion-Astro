import { Hono } from 'hono'
import { serve } from '@hono/node-server'
import { rutasUsuarios } from './rutas/usuarios.js'
import { rutasProductos } from './rutas/productos.js'

const aplicacion = new Hono()

// Middleware para CORS
aplicacion.use('*', async (c, next) => {
  // Configurar headers CORS
  c.header('Access-Control-Allow-Origin', '*')
  c.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
  c.header('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Manejar preflight requests
  if (c.req.method === 'OPTIONS') {
    return c.text('', 200)
  }
  
  await next()
})

// Middleware para logs
aplicacion.use('*', async (c, next) => {
  console.log(`${new Date().toISOString()} - ${c.req.method} ${c.req.url}`)
  await next()
})

// Ruta principal
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

// Middleware para rutas no encontradas
aplicacion.notFound((c) => {
  return c.json({ error: 'Ruta no encontrada' }, 404)
})

// Middleware para manejo de errores
aplicacion.onError((err, c) => {
  console.error('Error:', err)
  return c.json({ error: 'Error interno del servidor' }, 500)
})

const puerto = process.env.PORT || 3000

console.log(`🚀 Servidor iniciando en el puerto ${puerto}`)

serve({
  fetch: aplicacion.fetch,
  port: puerto
})
