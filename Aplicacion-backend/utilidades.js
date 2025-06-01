// Utilidades comunes para la aplicación

/**
 * Valida si un email tiene formato válido
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido, false si no
 */
export function validarEmail(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return regex.test(email)
}

/**
 * Valida si un número es positivo
 * @param {number} numero - Número a validar
 * @returns {boolean} - True si es positivo, false si no
 */
export function esNumeroPositivo(numero) {
  return !isNaN(numero) && numero >= 0
}

/**
 * Sanitiza un string removiendo caracteres especiales
 * @param {string} texto - Texto a sanitizar
 * @returns {string} - Texto sanitizado
 */
export function sanitizarTexto(texto) {
  if (typeof texto !== 'string') return ''
  return texto.trim().replace(/[<>]/g, '')
}

/**
 * Genera un ID único (simplificado para demostración)
 * @returns {string} - ID único
 */
export function generarId() {
  return Date.now().toString(36) + Math.random().toString(36).substr(2)
}

/**
 * Formatea una respuesta exitosa estándar
 * @param {string} mensaje - Mensaje de éxito
 * @param {any} datos - Datos a incluir
 * @param {number} total - Total de elementos (opcional)
 * @returns {object} - Respuesta formateada
 */
export function respuestaExitosa(mensaje, datos, total = null) {
  const respuesta = { mensaje, datos }
  if (total !== null) {
    respuesta.total = total
  }
  return respuesta
}

/**
 * Formatea una respuesta de error estándar
 * @param {string} error - Mensaje de error
 * @param {array} camposRequeridos - Lista de campos requeridos (opcional)
 * @returns {object} - Respuesta de error formateada
 */
export function respuestaError(error, camposRequeridos = null) {
  const respuesta = { error }
  if (camposRequeridos) {
    respuesta.campos_requeridos = camposRequeridos
  }
  return respuesta
}

/**
 * Valida los campos requeridos en un objeto
 * @param {object} objeto - Objeto a validar
 * @param {array} camposRequeridos - Array de nombres de campos requeridos
 * @returns {object} - { valido: boolean, camposFaltantes: array }
 */
export function validarCamposRequeridos(objeto, camposRequeridos) {
  const camposFaltantes = camposRequeridos.filter(campo => 
    objeto[campo] === undefined || objeto[campo] === null || objeto[campo] === ''
  )
  
  return {
    valido: camposFaltantes.length === 0,
    camposFaltantes
  }
}

/**
 * Convierte un string a formato de título (Primera letra mayúscula)
 * @param {string} texto - Texto a convertir
 * @returns {string} - Texto en formato título
 */
export function formatoTitulo(texto) {
  if (typeof texto !== 'string') return ''
  return texto.charAt(0).toUpperCase() + texto.slice(1).toLowerCase()
}

/**
 * Filtra un array de objetos basado en criterios
 * @param {array} array - Array a filtrar
 * @param {object} criterios - Objeto con criterios de filtrado
 * @returns {array} - Array filtrado
 */
export function filtrarArray(array, criterios) {
  return array.filter(item => {
    return Object.keys(criterios).every(clave => {
      const valor = criterios[clave]
      if (valor === undefined || valor === null || valor === '') return true
      
      if (typeof item[clave] === 'string') {
        return item[clave].toLowerCase().includes(valor.toLowerCase())
      }
      
      return item[clave] === valor
    })
  })
}

/**
 * Registra información en la consola con timestamp
 * @param {string} mensaje - Mensaje a registrar
 * @param {string} tipo - Tipo de log (info, error, warn)
 */
export function log(mensaje, tipo = 'info') {
  const timestamp = new Date().toISOString()
  const prefijo = `[${timestamp}] [${tipo.toUpperCase()}]`
  
  switch (tipo) {
    case 'error':
      console.error(`${prefijo} ${mensaje}`)
      break
    case 'warn':
      console.warn(`${prefijo} ${mensaje}`)
      break
    default:
      console.log(`${prefijo} ${mensaje}`)
  }
}
