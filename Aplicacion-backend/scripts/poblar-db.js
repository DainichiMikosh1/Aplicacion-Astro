import { conectarBaseDatos, obtenerBaseDatos, cerrarConexion } from './config/database.js'

// Datos iniciales para usuarios
const usuariosIniciales = [
  { nombre: 'Juan Pérez', email: 'juan@email.com', edad: 30 },
  { nombre: 'María García', email: 'maria@email.com', edad: 25 },
  { nombre: 'Carlos López', email: 'carlos@email.com', edad: 35 }
]

// Datos iniciales para productos
const productosIniciales = [
  { nombre: 'Laptop Dell', precio: 800.99, categoria: 'Electrónicos', stock: 15 },
  { nombre: 'Smartphone Samsung', precio: 450.00, categoria: 'Electrónicos', stock: 25 },
  { nombre: 'Mesa de Oficina', precio: 120.50, categoria: 'Muebles', stock: 8 },
  { nombre: 'Libro de JavaScript', precio: 35.99, categoria: 'Libros', stock: 50 }
]

async function poblarBaseDatos() {
  try {
    console.log('🌱 Iniciando población de la base de datos...')
    
    // Conectar a la base de datos
    await conectarBaseDatos()
    const bd = obtenerBaseDatos()
    
    // Obtener colecciones
    const coleccionUsuarios = bd.collection('usuarios')
    const coleccionProductos = bd.collection('productos')
    
    // Verificar si ya existen datos
    const usuariosExistentes = await coleccionUsuarios.countDocuments()
    const productosExistentes = await coleccionProductos.countDocuments()
    
    if (usuariosExistentes > 0) {
      console.log(`⚠️  Ya existen ${usuariosExistentes} usuarios en la base de datos`)
    } else {
      // Insertar usuarios iniciales
      const usuariosConFechas = usuariosIniciales.map(usuario => ({
        ...usuario,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }))
      
      await coleccionUsuarios.insertMany(usuariosConFechas)
      console.log(`✅ Insertados ${usuariosIniciales.length} usuarios iniciales`)
    }
    
    if (productosExistentes > 0) {
      console.log(`⚠️  Ya existen ${productosExistentes} productos en la base de datos`)
    } else {
      // Insertar productos iniciales
      const productosConFechas = productosIniciales.map(producto => ({
        ...producto,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }))
      
      await coleccionProductos.insertMany(productosConFechas)
      console.log(`✅ Insertados ${productosIniciales.length} productos iniciales`)
    }
    
    console.log('🎉 Base de datos poblada exitosamente')
    
  } catch (error) {
    console.error('❌ Error poblando la base de datos:', error)
  } finally {
    // Cerrar conexión
    await cerrarConexion()
  }
}

// Ejecutar si se llama directamente
if (import.meta.url === `file://${process.argv[1]}`) {
  poblarBaseDatos()
}

export { poblarBaseDatos }
