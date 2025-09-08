#!/usr/bin/env node

// =====================================================
// PRUEBA COMPLETA DEL MÓDULO DE CLIENTES
// =====================================================

const axios = require('axios');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Colores para la consola
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logHeader() {
  log('\n' + '='.repeat(70), 'cyan');
  log('🧪 PRUEBA COMPLETA DEL MÓDULO DE CLIENTES', 'bright');
  log('='.repeat(70), 'cyan');
}

function logSection(title) {
  log(`\n📋 ${title}`, 'yellow');
  log('─'.repeat(title.length + 4), 'yellow');
}

async function testClientsModule() {
  const API_BASE = 'http://localhost:8765/api';
  const API_URL = `${API_BASE}/clients`;
  
  try {
    logHeader();
    
    log('\n📡 CONFIGURACIÓN DE PRUEBA:', 'cyan');
    log(`📍 Backend URL: ${API_BASE}`, 'white');
    log(`📍 Clientes API: ${API_URL}`, 'white');
    log(`📍 Puerto Backend: ${process.env.PORT || 8765}`, 'white');
    
    // 1. Verificar que el backend esté corriendo
    logSection('VERIFICANDO CONECTIVIDAD DEL BACKEND');
    
    try {
      const healthResponse = await axios.get(`${API_BASE}/health`);
      log(`✅ Backend respondiendo: ${healthResponse.status}`, 'green');
      log(`📊 Estado: ${JSON.stringify(healthResponse.data)}`, 'white');
    } catch (error) {
      log(`❌ Backend no responde: ${error.message}`, 'red');
      log('💡 Asegúrate de que el backend esté corriendo con: npm start', 'yellow');
      return;
    }
    
    // 2. Probar GET /api/clients
    logSection('PROBANDO LISTADO DE CLIENTES');
    
    try {
      const getResponse = await axios.get(API_URL);
      log(`✅ GET ${API_URL}: ${getResponse.status}`, 'green');
      log(`📊 Total de clientes: ${getResponse.data.length || 0}`, 'white');
      
      if (getResponse.data.length > 0) {
        log('📋 Primeros 3 clientes:', 'cyan');
        getResponse.data.slice(0, 3).forEach((client, index) => {
          log(`   ${index + 1}. ${client.nombre || 'Sin nombre'} (ID: ${client.id})`, 'white');
        });
      }
    } catch (error) {
      log(`❌ Error en GET ${API_URL}: ${error.response?.status || error.message}`, 'red');
      if (error.response?.data) {
        log(`📄 Respuesta: ${JSON.stringify(error.response.data)}`, 'white');
      }
    }
    
    // 3. Probar creación de cliente
    logSection('PROBANDO CREACIÓN DE CLIENTE');
    
    const testClient = {
      run_cliente: 'TEST123456',
      nombre: 'Cliente de Prueba',
      rfc: 'TEST123456789',
      direccion: 'Dirección de prueba para testing'
    };
    
    try {
      const createResponse = await axios.post(API_URL, testClient);
      log(`✅ POST ${API_URL}: ${createResponse.status}`, 'green');
      log(`📊 Cliente creado con ID: ${createResponse.data.id}`, 'white');
      log(`📋 Datos: ${JSON.stringify(createResponse.data)}`, 'white');
      
      const createdClientId = createResponse.data.id;
      
      // 4. Probar obtención de cliente específico
      logSection('PROBANDO OBTENCIÓN DE CLIENTE ESPECÍFICO');
      
      try {
        const getByIdResponse = await axios.get(`${API_URL}/${createdClientId}`);
        log(`✅ GET ${API_URL}/${createdClientId}: ${getByIdResponse.status}`, 'green');
        log(`📊 Cliente encontrado: ${getByIdResponse.data.nombre}`, 'white');
      } catch (error) {
        log(`❌ Error en GET ${API_URL}/${createdClientId}: ${error.response?.status || error.message}`, 'red');
      }
      
      // 5. Probar actualización de cliente
      logSection('PROBANDO ACTUALIZACIÓN DE CLIENTE');
      
      const updateData = {
        ...testClient,
        nombre: 'Cliente de Prueba Actualizado',
        direccion: 'Dirección actualizada para testing'
      };
      
      try {
        const updateResponse = await axios.put(`${API_URL}/${createdClientId}`, updateData);
        log(`✅ PUT ${API_URL}/${createdClientId}: ${updateResponse.status}`, 'green');
        log(`📊 Cliente actualizado: ${updateResponse.data.nombre}`, 'white');
      } catch (error) {
        log(`❌ Error en PUT ${API_URL}/${createdClientId}: ${error.response?.status || error.message}`, 'red');
      }
      
      // 6. Probar eliminación de cliente
      logSection('PROBANDO ELIMINACIÓN DE CLIENTE');
      
      try {
        const deleteResponse = await axios.delete(`${API_URL}/${createdClientId}`);
        log(`✅ DELETE ${API_URL}/${createdClientId}: ${deleteResponse.status}`, 'green');
        log(`📊 Cliente eliminado exitosamente`, 'white');
      } catch (error) {
        log(`❌ Error en DELETE ${API_URL}/${createdClientId}: ${error.response?.status || error.message}`, 'red');
      }
      
    } catch (error) {
      log(`❌ Error en POST ${API_URL}: ${error.response?.status || error.message}`, 'red');
      if (error.response?.data) {
        log(`📄 Respuesta: ${JSON.stringify(error.response.data)}`, 'white');
      }
    }
    
    // 7. Verificar estado final
    logSection('VERIFICANDO ESTADO FINAL');
    
    try {
      const finalResponse = await axios.get(API_URL);
      log(`✅ Estado final: ${finalResponse.data.length || 0} clientes en la base de datos`, 'green');
    } catch (error) {
      log(`❌ Error al verificar estado final: ${error.message}`, 'red');
    }
    
    log('\n🎉 ¡PRUEBA COMPLETA FINALIZADA!', 'green');
    log('💡 Revisa los resultados arriba para identificar cualquier problema', 'cyan');
    
  } catch (error) {
    log('\n❌ ERROR GENERAL EN LA PRUEBA:', 'red');
    log(`   Mensaje: ${error.message}`, 'white');
    log(`   Stack: ${error.stack}`, 'white');
  }
}

// Ejecutar si se llama directamente
if (require.main === module) {
  testClientsModule().catch(console.error);
}

module.exports = { testClientsModule };
