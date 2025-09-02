// debug-profile.js - Script para debug de la carga del perfil
console.log('🔍 DEBUG PROFILE - Script de debug iniciado');

// Función para probar la API directamente
async function debugProfileAPI() {
  console.log('🔍 DEBUG PROFILE - Iniciando prueba de API');
  
  try {
    // 1. Probar health check
    console.log('🔍 DEBUG PROFILE - Probando health check...');
    const healthResponse = await fetch('http://localhost:5001/api/health');
    const healthData = await healthResponse.json();
    console.log('✅ DEBUG PROFILE - Health check exitoso:', healthData);
    
    // 2. Probar obtener usuariosido aIpo
    console.log('🔍 DEBUG PROFILE - Probando obtener usuarios...');
    const usersResponse = await fetch('http://localhost:5001/api/usuarios');
    const usersData = await usersResponse.json();
    console.log('✅ DEBUG PROFILE - Usuarios obtenidos:', usersData.total, 'usuarios');
    
    // 3. Probar obtener usuario específico
    console.log('🔍 DEBUG PROFILE - Probando obtener usuario específico...');
    const testUID = '5QxiYiipoUeCEY0n46CKk9QOIUk2';
    const userResponse = await fetch(`http://localhost:5001/api/usuarios/firebase/${testUID}`);
    const userData = await userResponse.json();
    console.log('✅ DEBUG PROFILE - Usuario obtenido:', userData.data?.name);
    
    console.log('🎉 DEBUG PROFILE - Todas las pruebas exitosas');
    
  } catch (error) {
    console.error('❌ DEBUG PROFILE - Error en las pruebas:', error);
    console.error('❌ DEBUG PROFILE - Detalles del error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
  }
}

// Función para probar con Axios (si está disponible)
async function debugProfileAxios() {
  console.log('🔍 DEBUG PROFILE - Probando con Axios...');
  
  if (typeof axios !== 'undefined') {
    try {
      const response = await axios.get('http://localhost:5001/api/usuarios/firebase/5QxiYiipoUeCEY0n46CKk9QOIUk2');
      console.log('✅ DEBUG PROFILE - Axios exitoso:', response.data);
    } catch (error) {
      console.error('❌ DEBUG PROFILE - Error con Axios:', error);
      console.error('❌ DEBUG PROFILE - Detalles del error de Axios:', {
        message: error.message,
        name: error.name,
        response: error.response?.data,
        status: error.response?.status
      });
    }
  } else {
    console.log('⚠️ DEBUG PROFILE - Axios no está disponible');
  }
}

// Función para verificar variables de entorno
function debugEnvironment() {
  console.log('🔍 DEBUG PROFILE - Variables de entorno:');
  console.log('🔍 REACT_APP_API_URL:', process.env.REACT_APP_API_URL);
  console.log('🔍 NODE_ENV:', process.env.NODE_ENV);
  console.log('🔍 window.location:', window.location.href);
  console.log('🔍 window.location.origin:', window.location.origin);
  console.log('🔍 window.location.protocol:', window.location.protocol);
  console.log('🔍 window.location.hostname:', window.location.hostname);
  console.log('🔍 window.location.port:', window.location.port);
}

// Función para probar CORS específicamente
async function debugCORS() {
  console.log('🔍 DEBUG PROFILE - Probando CORS...');
  
  try {
    const response = await fetch('http://localhost:5001/api/health', {
      method: 'OPTIONS',
      headers: {
        'Origin': 'http://localhost:3000',
        'Access-Control-Request-Method': 'GET',
        'Access-Control-Request-Headers': 'Content-Type'
      }
    });
    
    console.log('✅ DEBUG PROFILE - CORS OPTIONS exitoso');
    console.log('🔍 DEBUG PROFILE - CORS Headers:', {
      'Access-Control-Allow-Origin': response.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': response.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': response.headers.get('Access-Control-Allow-Headers')
    });
    
  } catch (error) {
    console.error('❌ DEBUG PROFILE - Error en CORS:', error);
  }
}

// Función para probar con diferentes métodos HTTP
async function debugHTTPMethods() {
  console.log('🔍 DEBUG PROFILE - Probando diferentes métodos HTTP...');
  
  const testUID = '5QxiYiipoUeCEY0n46CKk9QOIUk2';
  const baseURL = 'http://localhost:5001/api';
  
  try {
    // GET
    console.log('🔍 DEBUG PROFILE - Probando GET...');
    const getResponse = await fetch(`${baseURL}/usuarios/firebase/${testUID}`);
    console.log('✅ DEBUG PROFILE - GET exitoso:', getResponse.status);
    
    // POST (debería fallar para usuarios no autorizados)
    console.log('🔍 DEBUG PROFILE - Probando POST...');
    const postResponse = await fetch(`${baseURL}/usuarios`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ test: 'data' })
    });
    console.log('🔍 DEBUG PROFILE - POST status:', postResponse.status);
    
  } catch (error) {
    console.error('❌ DEBUG PROFILE - Error en métodos HTTP:', error);
  }
}

// Función para verificar si hay problemas de red
async function debugNetwork() {
  console.log('🔍 DEBUG PROFILE - Verificando conectividad de red...');
  
  try {
    // Probar con diferentes URLs
    const urls = [
      'http://localhost:5001/api/health',
      'http://127.0.0.1:5001/api/health',
      'http://localhost:5001/api/usuarios'
    ];
    
    for (const url of urls) {
      try {
        const start = Date.now();
        const response = await fetch(url);
        const end = Date.now();
        console.log(`✅ DEBUG PROFILE - ${url}: ${response.status} (${end - start}ms)`);
      } catch (error) {
        console.log(`❌ DEBUG PROFILE - ${url}: ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ DEBUG PROFILE - Error en verificación de red:', error);
  }
}

// Ejecutar todas las pruebas
console.log('🔍 DEBUG PROFILE - Ejecutando todas las pruebas...');
debugEnvironment();
debugCORS();
debugNetwork();
debugHTTPMethods();
debugProfileAPI();
debugProfileAxios();

// Exportar funciones para uso manual
window.debugProfile = {
  debugProfileAPI,
  debugProfileAxios,
  debugEnvironment,
  debugCORS,
  debugNetwork,
  debugHTTPMethods
};

console.log('🔍 DEBUG PROFILE - Script cargado. Usa window.debugProfile para ejecutar pruebas manualmente.');
console.log('🔍 DEBUG PROFILE - Ejemplo: window.debugProfile.debugProfileAPI()');
