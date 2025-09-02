#!/usr/bin/env node

// =====================================================
// SCRIPT DE PRUEBA PARA EL ENDPOINT DE CLIENTES
// =====================================================

const axios = require('axios');

// Configuración
const BASE_URL = 'http://localhost:5001';
const ENDPOINTS = {
  test: `${BASE_URL}/api/test-db`,
  clients: `${BASE_URL}/api/clients`,
  usuarios: `${BASE_URL}/api/usuarios`,
  roles: `${BASE_URL}/api/roles`,
  permisos: `${BASE_URL}/api/permisos`
};

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = (message, color = 'reset') => {
  console.log(`${colors[color]}${message}${colors.reset}`);
};

const logSuccess = (message) => log(`✅ ${message}`, 'green');
const logError = (message) => log(`❌ ${message}`, 'red');
const logWarning = (message) => log(`⚠️  ${message}`, 'yellow');
const logInfo = (message) => log(`ℹ️  ${message}`, 'blue');
const logStep = (message) => log(`\n🔧 ${message}`, 'cyan');

// Función para probar un endpoint
const testEndpoint = async (name, url, description) => {
  try {
    logStep(`Probando ${name}: ${description}`);
    const response = await axios.get(url);
    
    logSuccess(`${name} - Status: ${response.status}`);
    
    if (response.data) {
      if (response.data.success !== undefined) {
        logInfo(`   Estructura: { success: ${response.data.success}, data: [...], total: ${response.data.total || 'N/A'} }`);
        
        if (Array.isArray(response.data.data)) {
          logSuccess(`   Datos: ${response.data.data.length} registros encontrados`);
          
          if (response.data.data.length > 0) {
            const firstItem = response.data.data[0];
            logInfo(`   Primer registro:`, 'blue');
            Object.keys(firstItem).forEach(key => {
              logInfo(`     ${key}: ${firstItem[key]}`, 'blue');
            });
          }
        }
      } else {
        logInfo(`   Estructura: Array directo (${response.data.length} registros)`);
        
        if (Array.isArray(response.data) && response.data.length > 0) {
          const firstItem = response.data[0];
          logInfo(`   Primer registro:`, 'blue');
          Object.keys(firstItem).forEach(key => {
            logInfo(`     ${key}: ${firstItem[key]}`, 'blue');
          });
        }
      }
    }
    
    return true;
  } catch (error) {
    logError(`${name} - Error: ${error.message}`);
    
    if (error.response) {
      logError(`   Status: ${error.response.status}`);
      logError(`   Data: ${JSON.stringify(error.response.data)}`);
    }
    
    return false;
  }
};

// Función principal
const main = async () => {
  log('🚀 INICIANDO PRUEBAS DE ENDPOINTS', 'bright');
  log('====================================================', 'bright');
  
  try {
    // Probar conexión a la base de datos
    logStep('Probando conexión a la base de datos...');
    const dbTest = await testEndpoint('Test DB', ENDPOINTS.test, 'Verificar conexión a la base de datos');
    
    if (!dbTest) {
      logWarning('No se pudo conectar a la base de datos. Verifica que el servidor esté corriendo.');
      return;
    }
    
    // Probar endpoints principales
    logStep('Probando endpoints principales...');
    
    const results = await Promise.all([
      testEndpoint('Clientes', ENDPOINTS.clients, 'Obtener lista de clientes'),
      testEndpoint('Usuarios', ENDPOINTS.usuarios, 'Obtener lista de usuarios'),
      testEndpoint('Roles', ENDPOINTS.roles, 'Obtener lista de roles'),
      testEndpoint('Permisos', ENDPOINTS.permisos, 'Obtener lista de permisos')
    ]);
    
    // Resumen
    log('\n📊 RESUMEN DE PRUEBAS:', 'bright');
    log('====================================================', 'bright');
    
    const endpoints = ['Test DB', 'Clientes', 'Usuarios', 'Roles', 'Permisos'];
    endpoints.forEach((endpoint, index) => {
      const result = index === 0 ? dbTest : results[index - 1];
      const status = result ? '✅ EXITOSO' : '❌ FALLÓ';
      log(`${endpoint}: ${status}`);
    });
    
    const successCount = results.filter(r => r).length + (dbTest ? 1 : 0);
    const totalCount = endpoints.length;
    
    log(`\n🎯 RESULTADO FINAL: ${successCount}/${totalCount} endpoints funcionando`);
    
    if (successCount === totalCount) {
      logSuccess('🎉 ¡Todos los endpoints están funcionando correctamente!');
    } else {
      logWarning('⚠️  Algunos endpoints tienen problemas. Revisa los errores arriba.');
    }
    
  } catch (error) {
    logError('Error inesperado durante las pruebas:');
    logError(error.message);
  }
};

// Ejecutar script
main().catch(error => {
  logError('Error fatal:');
  logError(error.message);
  process.exit(1);
});
