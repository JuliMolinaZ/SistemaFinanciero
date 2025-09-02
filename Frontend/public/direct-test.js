// direct-test.js - Script de prueba muy directo
console.log('🚨 DIRECT TEST - Script ejecutado directamente');

// Función para probar la API básica
async function testDirectAPI() {
  console.log('🚨 DIRECT TEST - Probando API directamente...');
  
  try {
    // Probar health check
    console.log('🚨 DIRECT TEST - Probando health check...');
    const response = await fetch('http://localhost:5001/api/health');
    const data = await response.json();
    console.log('✅ DIRECT TEST - Health check exitoso:', data);
    
    // Probar usuarios
    console.log('🚨 DIRECT TEST - Probando usuarios...');
    const usersResponse = await fetch('http://localhost:5001/api/usuarios');
    const usersData = await usersResponse.json();
    console.log('✅ DIRECT TEST - Usuarios obtenidos:', usersData.total);
    
    // Probar usuario específico
    console.log('🚨 DIRECT TEST - Probando usuario específico...');
    const testUID = '5QxiYiipoUeCEY0n46CKk9QOIUk2';
    const userResponse = await fetch(`http://localhost:5001/api/usuarios/firebase/${testUID}`);
    const userData = await userResponse.json();
    console.log('✅ DIRECT TEST - Usuario específico:', userData.data?.name);
    
    console.log('🎉 DIRECT TEST - Todas las pruebas exitosas');
    return true;
    
  } catch (error) {
    console.error('❌ DIRECT TEST - Error:', error);
    console.error('❌ DIRECT TEST - Detalles:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return false;
  }
}

// Función para verificar configuración básica
function checkBasicConfig() {
  console.log('🚨 DIRECT TEST - Verificando configuración básica...');
  console.log('🚨 DIRECT TEST - window.location:', window.location.href);
  console.log('🚨 DIRECT TEST - navigator.userAgent:', navigator.userAgent);
  console.log('🚨 DIRECT TEST - Date:', new Date().toISOString());
  console.log('🚨 DIRECT TEST - window.env:', window.env);
  console.log('🚨 DIRECT TEST - process.env:', process.env);
}

// Función para probar Firebase
function testFirebaseConfig() {
  console.log('🚨 DIRECT TEST - Verificando Firebase...');
  
  if (typeof firebase !== 'undefined') {
    console.log('✅ DIRECT TEST - Firebase está disponible');
    try {
      const config = firebase.app().options;
      console.log('🚨 DIRECT TEST - Configuración de Firebase:', {
        apiKey: config.apiKey ? 'Configurado' : 'NO configurado',
        authDomain: config.authDomain ? 'Configurado' : 'NO configurado',
        projectId: config.projectId ? 'Configurado' : 'NO configurado'
      });
    } catch (error) {
      console.error('❌ DIRECT TEST - Error al obtener configuración de Firebase:', error);
    }
  } else {
    console.log('❌ DIRECT TEST - Firebase NO está disponible');
  }
}

// Función para probar Axios
function testAxios() {
  console.log('🚨 DIRECT TEST - Verificando Axios...');
  
  if (typeof axios !== 'undefined') {
    console.log('✅ DIRECT TEST - Axios está disponible');
    console.log('🚨 DIRECT TEST - axios.defaults.baseURL:', axios.defaults.baseURL);
  } else {
    console.log('❌ DIRECT TEST - Axios NO está disponible');
  }
}

// Función para ejecutar todas las pruebas
async function runAllDirectTests() {
  console.log('🚨 DIRECT TEST - Ejecutando todas las pruebas...');
  console.log('🚨 DIRECT TEST - Timestamp:', new Date().toISOString());
  
  checkBasicConfig();
  testFirebaseConfig();
  testAxios();
  await testDirectAPI();
  
  console.log('🎉 DIRECT TEST - Todas las pruebas completadas');
}

// Ejecutar pruebas automáticamente
runAllDirectTests();

// Exportar funciones para uso manual
window.directTest = {
  testDirectAPI,
  checkBasicConfig,
  testFirebaseConfig,
  testAxios,
  runAllDirectTests
};

console.log('🚨 DIRECT TEST - Script cargado. Usa window.directTest para ejecutar pruebas manualmente.');
console.log('🚨 DIRECT TEST - Ejemplo: window.directTest.runAllDirectTests()');
