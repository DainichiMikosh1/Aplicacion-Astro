import { MongoClient } from 'mongodb'

const URL_MONGODB = process.env.MONGODB_URL || 'mongodb://localhost:27017'
const NOMBRE_BASE_DATOS = process.env.DB_NAME || 'aplicacion_crud'

let cliente = null
let baseDatos = null

export async function conectarBaseDatos() {
  try {
    if (!cliente) {
      console.log(`Conectando a MongoDB en: ${URL_MONGODB}`)
      cliente = new MongoClient(URL_MONGODB, {
        serverSelectionTimeoutMS: 5000,
        connectTimeoutMS: 10000,
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

export function obtenerBaseDatos() {
  if (!baseDatos) {
    throw new Error('Base de datos no conectada. Llama primero a conectarBaseDatos()')
  }
  return baseDatos
}

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
