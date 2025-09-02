// simple-test.js - Script de prueba muy simple
console.log('🧪 SIMPLE TEST - Script iniciado');

// Función para probar la API básica
async function simpleTest() {
  console.log('🧪 SIMPLE TEST - Iniciando prueba simple...');
  
  try {
    // Probar health check
    console.log('🧪 SIMPLE TEST - Probando health check...');
    const response = await fetch('http://localhost:5001/api/health');
    const data = await response.json();
    console.log('✅ SIMPLE TEST - Health check exitoso:', data);
    
    // Probar usuarios
    console.log('🧪 SIMPLE TEST - Probando usuarios...');
    const usersResponse = await fetch('http://localhost:5001/api/usuarios');
    const usersData = await usersResponse.json();
    console.log('✅ SIMPLE TEST - Usuarios obtenidos:', usersData.total);
    
    console.log('🎉 SIMPLE TEST - Todas las pruebas exitosas');
    
  } catch (error) {
    console.error('❌ SIMPLE TEST - Error:', error.message);
  }
}

// Función para verificar configuración
function checkConfig() {
  console.log('🧪 SIMPLE TEST - Verificando configuración...');
  console.log('🧪 SIMPLE TEST - window.location:', window.location.href);
  console.log('🧪 SIMPLE TEST - navigator.userAgent:', navigator.userAgent);
  console.log('🧪 SIMPLE TEST - Date:', new Date().toISOString());
}

// Ejecutar pruebas automáticamente
console.log('🧪 SIMPLE TEST - Ejecutando pruebas automáticamente...');
checkConfig();
simpleTest();

// Exportar para uso manual
window.simpleTest = {
  simpleTest,
  checkConfig
};

console.log('🧪 SIMPLE TEST - Script cargado. Usa window.simpleTest para ejecutar pruebas manualmente.');
