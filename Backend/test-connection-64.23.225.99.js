#!/usr/bin/env node

// =====================================================
// PRUEBA DE CONEXIÓN DIRECTA AL SERVIDOR 64.23.225.99
// =====================================================

const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configuración de conexión
const dbConfig = {
  host: '64.23.225.99',
  port: 3306,
  user: 'root',
  password: 'o70#%s$nyK2TnU',
  database: 'runite',
  connectTimeout: 10000,
  acquireTimeout: 10000,
  timeout: 10000
};

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
  log('🔌 PRUEBA DE CONEXIÓN DIRECTA AL SERVIDOR 64.23.225.99', 'bright');
  log('='.repeat(70), 'cyan');
}

async function testConnection() {
  let connection;
  
  try {
    logHeader();
    
    log('\n📡 INTENTANDO CONEXIÓN DIRECTA...', 'yellow');
    log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`, 'white');
    log(`🗄️  Base de datos: ${dbConfig.database}`, 'white');
    log(`👤 Usuario: ${dbConfig.user}`, 'white');
    log(`⏱️  Timeout: ${dbConfig.connectTimeout}ms`, 'white');
    
    // Crear conexión
    log('\n🔄 Creando conexión...', 'cyan');
    connection = await mysql.createConnection(dbConfig);
    
    log('✅ Conexión establecida exitosamente!', 'green');
    
    // Probar consulta simple
    log('\n🧪 Probando consulta simple...', 'cyan');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as timestamp, VERSION() as version');
    
    log('✅ Consulta ejecutada exitosamente!', 'green');
    log(`📊 Resultado: ${JSON.stringify(rows[0])}`, 'white');
    
    // Obtener información del servidor
    log('\n📊 INFORMACIÓN DEL SERVIDOR:', 'yellow');
    
    const [serverInfo] = await connection.execute('SHOW VARIABLES LIKE "version%"');
    serverInfo.forEach(row => {
      log(`   ${row.Variable_name}: ${row.Value}`, 'white');
    });
    
    // Obtener información de la base de datos
    log('\n🗄️  INFORMACIÓN DE LA BASE DE DATOS:', 'yellow');
    
    const [dbInfo] = await connection.execute('SELECT DATABASE() as current_db, USER() as current_user');
    log(`   Base de datos actual: ${dbInfo[0].current_db}`, 'white');
    log(`   Usuario actual: ${dbInfo[0].current_user}`, 'white');
    
    // Listar tablas disponibles
    log('\n📋 TABLAS DISPONIBLES:', 'yellow');
    
    const [tables] = await connection.execute('SHOW TABLES');
    if (tables.length > 0) {
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        log(`   ${index + 1}. ${tableName}`, 'white');
      });
    } else {
      log('   No hay tablas en esta base de datos', 'yellow');
    }
    
    log('\n🎉 ¡CONEXIÓN DIRECTA FUNCIONA PERFECTAMENTE!', 'green');
    log('💡 No necesitas túnel SSH para esta conexión', 'cyan');
    
  } catch (error) {
    log('\n❌ ERROR DE CONEXIÓN:', 'red');
    log(`   Tipo: ${error.code || 'UNKNOWN'}`, 'white');
    log(`   Mensaje: ${error.message}`, 'white');
    
    // Análisis del error
    log('\n🔍 ANÁLISIS DEL ERROR:', 'yellow');
    
    switch (error.code) {
      case 'ECONNREFUSED':
        log('   ❌ El servidor rechaza la conexión', 'red');
        log('   💡 Posibles causas:', 'yellow');
        log('      - Puerto 3306 cerrado en firewall', 'white');
        log('      - MySQL no está corriendo', 'white');
        log('      - Servidor no está activo', 'white');
        break;
        
      case 'ETIMEDOUT':
        log('   ⏰ Timeout de conexión', 'red');
        log('   💡 Posibles causas:', 'yellow');
        log('      - Problemas de red', 'white');
        log('      - Firewall bloqueando', 'white');
        log('      - Servidor sobrecargado', 'white');
        break;
        
      case 'ER_ACCESS_DENIED_ERROR':
        log('   🔐 Acceso denegado', 'red');
        log('   💡 Posibles causas:', 'yellow');
        log('      - Usuario o contraseña incorrectos', 'white');
        log('      - Usuario no tiene permisos para conectar desde tu IP', 'white');
        log('      - Host no permitido en MySQL', 'white');
        break;
        
      case 'ER_BAD_DB_ERROR':
        log('   🗄️  Base de datos no existe', 'red');
        log('   💡 Solución:', 'yellow');
        log('      - Crear la base de datos "runite"', 'white');
        log('      - O usar una base de datos existente', 'white');
        break;
        
      default:
        log('   ❓ Error desconocido', 'red');
        log('   💡 Revisar logs del servidor MySQL', 'yellow');
    }
    
    log('\n🛠️  SOLUCIONES SUGERIDAS:', 'cyan');
    log('   1. Verificar que el servidor esté activo', 'white');
    log('   2. Verificar que MySQL esté corriendo en puerto 3306', 'white');
    log('   3. Verificar credenciales de usuario', 'white');
    log('   4. Verificar permisos del usuario root', 'white');
    log('   5. Verificar configuración de firewall', 'white');
    
  } finally {
    if (connection) {
      try {
        await connection.end();
        log('\n🔌 Conexión cerrada', 'cyan');
      } catch (err) {
        log(`\n⚠️  Error al cerrar conexión: ${err.message}`, 'yellow');
      }
    }
  }
}

// Ejecutar prueba
if (require.main === module) {
  testConnection().catch(console.error);
}

module.exports = { testConnection };
