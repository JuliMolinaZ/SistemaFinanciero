// console-test.js - Script para ejecutar directamente en la consola del navegador
console.log('🚨 CONSOLE TEST - Script ejecutado directamente en la consola');

// Función para probar la API básica
async function testAPI() {
  console.log('🚨 CONSOLE TEST - Probando API...');
  
  try {
    // Probar health check
    const response = await fetch('http://localhost:5001/api/health');
    const data = await response.json();
    console.log('✅ CONSOLE TEST - Health check:', data);
    
    // Probar usuarios
    const usersResponse = await fetch('http://localhost:5001/api/usuarios');
    const usersData = await usersResponse.json();
    console.log('✅ CONSOLE TEST - Usuarios:', usersData.total);
    
    return true;
  } catch (error) {
    console.error('❌ CONSOLE TEST - Error:', error);
    return false;
  }
}

// Función para verificar configuración
function checkConfig() {
  console.log('🚨 CONSOLE TEST - Verificando configuración...');
  console.log('🚨 CONSOLE TEST - window.location:', window.location.href);
  console.log('🚨 CONSOLE TEST - navigator.userAgent:', navigator.userAgent);
  console.log('🚨 CONSOLE TEST - Date:', new Date().toISOString());
  
  // Verificar si hay algún problema con el contexto
  if (window.GlobalContext) {
    console.log('✅ CONSOLE TEST - GlobalContext disponible');
  } else {
    console.log('❌ CONSOLE TEST - GlobalContext NO disponible');
  }
  
  if (window.firebase) {
    console.log('✅ CONSOLE TEST - Firebase disponible');
  } else {
    console.log('❌ CONSOLE TEST - Firebase NO disponible');
  }
  
  if (window.axios) {
    console.log('✅ CONSOLE TEST - Axios disponible');
  } else {
    console.log('❌ CONSOLE TEST - Axios NO disponible');
  }
}

// Función para probar Firebase directamente
async function testFirebase() {
  console.log('🚨 CONSOLE TEST - Probando Firebase...');
  
  try {
    // Verificar si Firebase está configurado
    if (typeof firebase !== 'undefined') {
      console.log('✅ CONSOLE TEST - Firebase está disponible');
      
      // Verificar configuración
      const config = firebase.app().options;
      console.log('🚨 CONSOLE TEST - Configuración de Firebase:', {
        apiKey: config.apiKey ? 'Configurado' : 'NO configurado',
        authDomain: config.authDomain ? 'Configurado' : 'NO configurado',
        projectId: config.projectId ? 'Configurado' : 'NO configurado'
      });
      
    } else {
      console.log('❌ CONSOLE TEST - Firebase NO está disponible');
    }
  } catch (error) {
    console.error('❌ CONSOLE TEST - Error con Firebase:', error);
  }
}

// Función para ejecutar todas las pruebas
async function runAllTests() {
  console.log('🚨 CONSOLE TEST - Ejecutando todas las pruebas...');
  
  checkConfig();
  await testAPI();
  await testFirebase();
  
  console.log('🎉 CONSOLE TEST - Todas las pruebas completadas');
}

// Ejecutar pruebas automáticamente
runAllTests();

// Exportar funciones para uso manual
window.consoleTest = {
  testAPI,
  checkConfig,
  testFirebase,
  runAllTests
};

console.log('🚨 CONSOLE TEST - Script cargado. Usa window.consoleTest para ejecutar pruebas manualmente.');
console.log('🚨 CONSOLE TEST - Ejemplo: window.consoleTest.runAllTests()');
