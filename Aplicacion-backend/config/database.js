import { MongoClient } from 'mongodb'

// URL de conexión a MongoDB (usando variable de entorno o valor por defecto)
const URL_MONGODB = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const NOMBRE_BASE_DATOS = process.env.DB_NAME || 'aplicacion_crud'

let cliente = null
let baseDatos = null

// Función para conectar a MongoDB
export async function conectarBaseDatos() {
  try {
    if (!cliente) {
      console.log(`Conectando a MongoDB en: ${URL_MONGODB}`)
      cliente = new MongoClient(URL_MONGODB, {
        serverSelectionTimeoutMS: 5000, // Timeout de 5 segundos
        connectTimeoutMS: 10000, // Timeout de conexión de 10 segundos
      })
      await cliente.connect()
      console.log('Conectado exitosamente a MongoDB')
    }
    
    if (!baseDatos) {
      baseDatos = cliente.db(NOMBRE_BASE_DATOS)
      console.log(`Usando base de datos: ${NOMBRE_BASE_DATOS}`)
    }
    
    return baseDatos
  } catch (error) {
    console.error('Error conectando a MongoDB:', error.message)
    throw error
  }
}

// Función para obtener la base de datos (debe estar ya conectada)
export function obtenerBaseDatos() {
  if (!baseDatos) {
    throw new Error('Base de datos no conectada. Llama primero a conectarBaseDatos()')
  }
  return baseDatos
}

// Función para cerrar la conexión
export async function cerrarConexion() {
  if (cliente) {
    await cliente.close()
    cliente = null
    baseDatos = null
    console.log('Conexión a MongoDB cerrada')
  }
}

export async function verificarConexion() {
  try {
    if (!baseDatos) {
      await conectarBaseDatos()
    }
    
    await baseDatos.admin().ping()
    return true
  } catch (error) {
    console.error('Error verificando conexión:', error)
    return false
  }
}
