// Script principal para la aplicación CRUD
// @ts-nocheck

console.log('Script cargado correctamente');

const API_BASE = 'http://localhost:3000';
console.log('API_BASE configurado:', API_BASE);

// Test básico al cargar
console.log('Verificando funciones...');

// Función para cambiar tabs - global
window.showTab = function(tabName, element) {
	// Ocultar todas las secciones
	document.querySelectorAll('.section').forEach(section => {
		section.classList.remove('active');
	});
	
	// Remover clase activa de todos los tabs
	document.querySelectorAll('.nav-tab').forEach(tab => {
		tab.classList.remove('active');
	});
	
	// Mostrar la sección seleccionada
	const targetSection = document.getElementById(tabName);
	if (targetSection) {
		targetSection.classList.add('active');
	}
	
	// Activar el tab seleccionado
	if (element) {
		element.classList.add('active');
	}
}

// Función para mostrar respuestas - global
window.mostrarRespuesta = function(elementId, data, esError = false) {
	console.log('Mostrando respuesta en elemento:', elementId);
	console.log('Datos:', data);
	console.log('Es error:', esError);
	
	const element = document.getElementById(elementId);
	if (element) {
		console.log('Elemento encontrado:', element);
		element.style.display = 'block';
		element.className = `response ${esError ? 'error' : 'success'}`;
		element.textContent = JSON.stringify(data, null, 2);
	} else {
		console.error('No se encontró el elemento con ID:', elementId);
	}
}

// Función para realizar peticiones - global
window.realizarPeticion = async function(url, opciones = {}) {
	console.log('Realizando petición a:', url);
	console.log('Opciones:', opciones);
	
	try {
		const response = await fetch(url, {
			...opciones,
			headers: {
				'Content-Type': 'application/json',
				...(opciones.headers || {})
			}
		});
		
		console.log('Respuesta HTTP:', response.status, response.statusText);
		
		const data = await response.json();
		console.log('Datos JSON recibidos:', data);
		
		return { data, esError: !response.ok };
	} catch (error) {
		console.error('Error en la petición:', error);
		return { 
			data: { error: 'Error de conexión: ' + (error instanceof Error ? error.message : 'Error desconocido') }, 
			esError: true 
		};
	}
}

// Función de test simple - global
window.testFuncion = function() {
	console.log('¡Función de test llamada correctamente!');
	alert('¡Test exitoso! Las funciones JavaScript están funcionando.');
	return true;
}

// Funciones para Usuarios - globales
window.obtenerUsuarios = async function() {
	console.log('=== INICIO obtenerUsuarios ===');
	alert('Función obtenerUsuarios llamada');
	
	try {
		console.log('Realizando fetch a:', `${API_BASE}/usuarios`);
		const response = await fetch(`${API_BASE}/usuarios`);
		console.log('Response status:', response.status);
		
		const data = await response.json();
		console.log('Data recibida:', data);
		
		// Mostrar en el elemento response
		const responseElement = document.getElementById('response-usuarios-list');
		if (responseElement) {
			responseElement.style.display = 'block';
			responseElement.className = 'response success';
			responseElement.textContent = JSON.stringify(data, null, 2);
			console.log('Respuesta mostrada en elemento');
		} else {
			console.error('No se encontró el elemento response-usuarios-list');
		}
	} catch (error) {
		console.error('Error en obtenerUsuarios:', error);
		alert('Error: ' + error.message);
	}
	
	console.log('=== FIN obtenerUsuarios ===');
}

window.obtenerUsuarioPorId = async function() {
	console.log('Obteniendo usuario por ID...');
	const idElement = document.getElementById('usuario-id');
	const id = idElement ? idElement.value : '';
	if (!id) {
		mostrarRespuesta('response-usuario-by-id', { error: 'Por favor ingresa un ID' }, true);
		return;
	}
	
	console.log('Buscando usuario con ID:', id);
	const { data, esError } = await realizarPeticion(`${API_BASE}/usuarios/${id}`);
	console.log('Respuesta recibida:', data);
	mostrarRespuesta('response-usuario-by-id', data, esError);
}

window.crearUsuario = async function() {
	const nombreElement = document.getElementById('nuevo-nombre');
	const emailElement = document.getElementById('nuevo-email');
	const edadElement = document.getElementById('nueva-edad');
	
	const nombre = nombreElement ? nombreElement.value : '';
	const email = emailElement ? emailElement.value : '';
	const edad = edadElement ? edadElement.value : '';
	
	if (!nombre || !email || !edad) {
		mostrarRespuesta('response-crear-usuario', { error: 'Todos los campos son requeridos' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/usuarios`, {
		method: 'POST',
		body: JSON.stringify({ nombre, email, edad: parseInt(edad) })
	});
	
	mostrarRespuesta('response-crear-usuario', data, esError);
	
	if (!esError) {
		// Limpiar formulario
		if (nombreElement) nombreElement.value = '';
		if (emailElement) emailElement.value = '';
		if (edadElement) edadElement.value = '';
	}
}

window.actualizarUsuario = async function() {
	const idElement = document.getElementById('actualizar-id');
	const nombreElement = document.getElementById('actualizar-nombre');
	const emailElement = document.getElementById('actualizar-email');
	const edadElement = document.getElementById('actualizar-edad');
	
	const id = idElement ? idElement.value : '';
	const nombre = nombreElement ? nombreElement.value : '';
	const email = emailElement ? emailElement.value : '';
	const edad = edadElement ? edadElement.value : '';
	
	if (!id || !nombre || !email || !edad) {
		mostrarRespuesta('response-actualizar-usuario', { error: 'Todos los campos son requeridos para PUT' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/usuarios/${id}`, {
		method: 'PUT',
		body: JSON.stringify({ nombre, email, edad: parseInt(edad) })
	});
	
	mostrarRespuesta('response-actualizar-usuario', data, esError);
}

window.actualizarUsuarioParcial = async function() {
	const idElement = document.getElementById('actualizar-id');
	const nombreElement = document.getElementById('actualizar-nombre');
	const emailElement = document.getElementById('actualizar-email');
	const edadElement = document.getElementById('actualizar-edad');
	
	const id = idElement ? idElement.value : '';
	const nombre = nombreElement ? nombreElement.value : '';
	const email = emailElement ? emailElement.value : '';
	const edad = edadElement ? edadElement.value : '';
	
	if (!id) {
		mostrarRespuesta('response-actualizar-usuario', { error: 'El ID es requerido' }, true);
		return;
	}
	
	const actualizaciones = {};
	if (nombre) actualizaciones.nombre = nombre;
	if (email) actualizaciones.email = email;
	if (edad) actualizaciones.edad = parseInt(edad);
	
	if (Object.keys(actualizaciones).length === 0) {
		mostrarRespuesta('response-actualizar-usuario', { error: 'Al menos un campo debe ser proporcionado para PATCH' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/usuarios/${id}`, {
		method: 'PATCH',
		body: JSON.stringify(actualizaciones)
	});
	
	mostrarRespuesta('response-actualizar-usuario', data, esError);
}

window.eliminarUsuario = async function() {
	const idElement = document.getElementById('eliminar-id');
	const id = idElement ? idElement.value : '';
	if (!id) {
		mostrarRespuesta('response-eliminar-usuario', { error: 'Por favor ingresa un ID' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/usuarios/${id}`, {
		method: 'DELETE'
	});
	
	mostrarRespuesta('response-eliminar-usuario', data, esError);
	
	if (!esError && idElement) {
		idElement.value = '';
	}
}

// Funciones para Productos - globales
window.obtenerProductos = async function() {
	const categoriaElement = document.getElementById('filtro-categoria');
	const precioMinElement = document.getElementById('filtro-precio-min');
	const precioMaxElement = document.getElementById('filtro-precio-max');
	
	const categoria = categoriaElement ? categoriaElement.value : '';
	const precioMin = precioMinElement ? precioMinElement.value : '';
	const precioMax = precioMaxElement ? precioMaxElement.value : '';
	
	let url = `${API_BASE}/productos`;
	const params = new URLSearchParams();
	
	if (categoria) params.append('categoria', categoria);
	if (precioMin) params.append('precio_min', precioMin);
	if (precioMax) params.append('precio_max', precioMax);
	
	if (params.toString()) {
		url += '?' + params.toString();
	}
	
	const { data, esError } = await realizarPeticion(url);
	mostrarRespuesta('response-productos-list', data, esError);
}

window.limpiarFiltros = function() {
	const categoriaElement = document.getElementById('filtro-categoria');
	const precioMinElement = document.getElementById('filtro-precio-min');
	const precioMaxElement = document.getElementById('filtro-precio-max');
	
	if (categoriaElement) categoriaElement.value = '';
	if (precioMinElement) precioMinElement.value = '';
	if (precioMaxElement) precioMaxElement.value = '';
}

window.obtenerProductoPorId = async function() {
	const idElement = document.getElementById('producto-id');
	const id = idElement ? idElement.value : '';
	if (!id) {
		mostrarRespuesta('response-producto-by-id', { error: 'Por favor ingresa un ID' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/productos/${id}`);
	mostrarRespuesta('response-producto-by-id', data, esError);
}

window.obtenerProductosPorCategoria = async function() {
	const categoriaElement = document.getElementById('categoria-buscar');
	const categoria = categoriaElement ? categoriaElement.value : '';
	if (!categoria) {
		mostrarRespuesta('response-productos-categoria', { error: 'Por favor ingresa una categoría' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/productos/categoria/${encodeURIComponent(categoria)}`);
	mostrarRespuesta('response-productos-categoria', data, esError);
}

window.crearProducto = async function() {
	const nombreElement = document.getElementById('nuevo-producto-nombre');
	const precioElement = document.getElementById('nuevo-producto-precio');
	const categoriaElement = document.getElementById('nuevo-producto-categoria');
	const stockElement = document.getElementById('nuevo-producto-stock');
	
	const nombre = nombreElement ? nombreElement.value : '';
	const precio = precioElement ? precioElement.value : '';
	const categoria = categoriaElement ? categoriaElement.value : '';
	const stock = stockElement ? stockElement.value : '';
	
	if (!nombre || !precio || !categoria || !stock) {
		mostrarRespuesta('response-crear-producto', { error: 'Todos los campos son requeridos' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/productos`, {
		method: 'POST',
		body: JSON.stringify({ 
			nombre, 
			precio: parseFloat(precio), 
			categoria, 
			stock: parseInt(stock) 
		})
	});
	
	mostrarRespuesta('response-crear-producto', data, esError);
	
	if (!esError) {
		// Limpiar formulario
		if (nombreElement) nombreElement.value = '';
		if (precioElement) precioElement.value = '';
		if (categoriaElement) categoriaElement.value = '';
		if (stockElement) stockElement.value = '';
	}
}

window.actualizarStock = async function() {
	const idElement = document.getElementById('stock-producto-id');
	const stockElement = document.getElementById('nuevo-stock');
	
	const id = idElement ? idElement.value : '';
	const stock = stockElement ? stockElement.value : '';
	
	if (!id || !stock) {
		mostrarRespuesta('response-actualizar-stock', { error: 'ID y stock son requeridos' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/productos/${id}/stock`, {
		method: 'PUT',
		body: JSON.stringify({ stock: parseInt(stock) })
	});
	
	mostrarRespuesta('response-actualizar-stock', data, esError);
	
	if (!esError) {
		if (idElement) idElement.value = '';
		if (stockElement) stockElement.value = '';
	}
}

window.eliminarProducto = async function() {
	const idElement = document.getElementById('eliminar-producto-id');
	const id = idElement ? idElement.value : '';
	if (!id) {
		mostrarRespuesta('response-eliminar-producto', { error: 'Por favor ingresa un ID' }, true);
		return;
	}
	
	const { data, esError } = await realizarPeticion(`${API_BASE}/productos/${id}`, {
		method: 'DELETE'
	});
	
	mostrarRespuesta('response-eliminar-producto', data, esError);
	
	if (!esError && idElement) {
		idElement.value = '';
	}
}

// Función para probar conexión - global
window.probarConexion = async function() {
	const { data, esError } = await realizarPeticion(`${API_BASE}/`);
	mostrarRespuesta('response-conexion', data, esError);
}

// Probar conexión al cargar la página
window.addEventListener('load', function() {
	console.log('Página cargada, probando conexión...');
	probarConexion();
});

console.log('Todas las funciones han sido definidas globalmente');
