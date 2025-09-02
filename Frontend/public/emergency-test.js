// emergency-test.js - Script de emergencia muy simple
console.log('🚨 EMERGENCY TEST - Script de emergencia iniciado');

// Función para probar la API básica
async function emergencyTest() {
  console.log('🚨 EMERGENCY TEST - Iniciando prueba de emergencia...');
  
  try {
    // Probar health check
    console.log('🚨 EMERGENCY TEST - Probando health check...');
    const response = await fetch('http://localhost:5001/api/health');
    const data = await response.json();
    console.log('✅ EMERGENCY TEST - Health check exitoso:', data);
    
    // Probar usuarios
    console.log('🚨 EMERGENCY TEST - Probando usuarios...');
    const usersResponse = await fetch('http://localhost:5001/api/usuarios');
    const usersData = await usersResponse.json();
    console.log('✅ EMERGENCY TEST - Usuarios obtenidos:', usersData.total);
    
    // Probar usuario específico
    console.log('🚨 EMERGENCY TEST - Probando usuario específico...');
    const testUID = '5QxiYiipoUeCEY0n46CKk9QOIUk2';
    const userResponse = await fetch(`http://localhost:5001/api/usuarios/firebase/${testUID}`);
    const userData = await userResponse.json();
    console.log('✅ EMERGENCY TEST - Usuario específico:', userData.data?.name);
    
    console.log('🎉 EMERGENCY TEST - Todas las pruebas exitosas');
    return true;
    
  } catch (error) {
    console.error('❌ EMERGENCY TEST - Error:', error);
    console.error('❌ EMERGENCY TEST - Detalles:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    return false;
  }
}

// Función para verificar configuración básica
function emergencyCheckConfig() {
  console.log('🚨 EMERGENCY TEST - Verificando configuración básica...');
  console.log('🚨 EMERGENCY TEST - window.location:', window.location.href);
  console.log('🚨 EMERGENCY TEST - navigator.userAgent:', navigator.userAgent);
  console.log('🚨 EMERGENCY TEST - Date:', new Date().toISOString());
  console.log('🚨 EMERGENCY TEST - window.env:', window.env);
  console.log('🚨 EMERGENCY TEST - process.env:', process.env);
}

// Función para probar Firebase
function emergencyTestFirebase() {
  console.log('🚨 EMERGENCY TEST - Verificando Firebase...');
  
  if (typeof firebase !== 'undefined') {
    console.log('✅ EMERGENCY TEST - Firebase está disponible');
    try {
      const config = firebase.app().options;
      console.log('🚨 EMERGENCY TEST - Configuración de Firebase:', {
        apiKey: config.apiKey ? 'Configurado' : 'NO configurado',
        authDomain: config.authDomain ? 'Configurado' : 'NO configurado',
        projectId: config.projectId ? 'Configurado' : 'NO configurado'
      });
    } catch (error) {
      console.error('❌ EMERGENCY TEST - Error al obtener configuración de Firebase:', error);
    }
  } else {
    console.log('❌ EMERGENCY TEST - Firebase NO está disponible');
  }
}

// Función para probar Axios
function emergencyTestAxios() {
  console.log('🚨 EMERGENCY TEST - Verificando Axios...');
  
  if (typeof axios !== 'undefined') {
    console.log('✅ EMERGENCY TEST - Axios está disponible');
    console.log('🚨 EMERGENCY TEST - axios.defaults.baseURL:', axios.defaults.baseURL);
  } else {
    console.log('❌ EMERGENCY TEST - Axios NO está disponible');
  }
}

// Función para ejecutar todas las pruebas
async function runEmergencyTests() {
  console.log('🚨 EMERGENCY TEST - Ejecutando todas las pruebas de emergencia...');
  console.log('🚨 EMERGENCY TEST - Timestamp:', new Date().toISOString());
  
  emergencyCheckConfig();
  emergencyTestFirebase();
  emergencyTestAxios();
  await emergencyTest();
  
  console.log('🎉 EMERGENCY TEST - Todas las pruebas de emergencia completadas');
}

// Ejecutar pruebas automáticamente
runEmergencyTests();

// Exportar funciones para uso manual
window.emergencyTest = {
  emergencyTest,
  emergencyCheckConfig,
  emergencyTestFirebase,
  emergencyTestAxios,
  runEmergencyTests
};

console.log('🚨 EMERGENCY TEST - Script de emergencia cargado. Usa window.emergencyTest para ejecutar pruebas manualmente.');
console.log('🚨 EMERGENCY TEST - Ejemplo: window.emergencyTest.runEmergencyTests()');
