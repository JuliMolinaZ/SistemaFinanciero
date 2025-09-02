#!/usr/bin/env node

// =====================================================
// PRUEBA DE CONEXIÓN LOCAL A LA BASE DE DATOS
// =====================================================

const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Configuración de conexión local
const dbConfig = {
  host: 'localhost',
  port: 3306,
  user: 'root',
  password: 'Julian99',
  database: 'runite',
  connectTimeout: 10000
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
  log('\n' + '='.repeat(60), 'cyan');
  log('🏠 PRUEBA DE CONEXIÓN LOCAL A LA BASE DE DATOS', 'bright');
  log('='.repeat(60), 'cyan');
}

async function testLocalConnection() {
  let connection;
  
  try {
    logHeader();
    
    log('\n📡 INTENTANDO CONEXIÓN LOCAL...', 'yellow');
    log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`, 'white');
    log(`🗄️  Base de datos: ${dbConfig.database}`, 'white');
    log(`👤 Usuario: ${dbConfig.user}`, 'white');
    
    // Crear conexión
    log('\n🔄 Creando conexión...', 'cyan');
    connection = await mysql.createConnection(dbConfig);
    
    log('✅ Conexión local establecida exitosamente!', 'green');
    
    // Probar consulta simple
    log('\n🧪 Probando consulta simple...', 'cyan');
    const [rows] = await connection.execute('SELECT 1 as test, NOW() as timestamp, VERSION() as version');
    
    log('✅ Consulta ejecutada exitosamente!', 'green');
    log(`📊 Resultado: ${JSON.stringify(rows[0])}`, 'white');
    
    // Obtener información del servidor
    log('\n📊 INFORMACIÓN DEL SERVIDOR LOCAL:', 'yellow');
    
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
    log('\n📋 TABLAS DISPONIBLES EN "runite":', 'yellow');
    
    const [tables] = await connection.execute('SHOW TABLES');
    if (tables.length > 0) {
      log(`   Total de tablas: ${tables.length}`, 'green');
      tables.forEach((table, index) => {
        const tableName = Object.values(table)[0];
        log(`   ${index + 1}. ${tableName}`, 'white');
      });
    } else {
      log('   ⚠️  No hay tablas en la base de datos "runite"', 'yellow');
      log('   💡 Esto es normal si es una base de datos nueva', 'cyan');
    }
    
    // Verificar si hay datos en algunas tablas comunes
    log('\n🔍 VERIFICANDO DATOS EN TABLAS COMUNES:', 'yellow');
    
    const commonTables = ['users', 'clients', 'projects', 'cuentas_pagar', 'cuentas_cobrar'];
    
    for (const tableName of commonTables) {
      try {
        const [countResult] = await connection.execute(`SELECT COUNT(*) as count FROM ${tableName}`);
        const count = countResult[0].count;
        log(`   📊 ${tableName}: ${count} registros`, count > 0 ? 'green' : 'yellow');
      } catch (error) {
        if (error.code === 'ER_NO_SUCH_TABLE') {
          log(`   ❌ ${tableName}: Tabla no existe`, 'red');
        } else {
          log(`   ⚠️  ${tableName}: Error al verificar (${error.code})`, 'yellow');
        }
      }
    }
    
    log('\n🎉 ¡CONEXIÓN LOCAL FUNCIONA PERFECTAMENTE!', 'green');
    log('💡 Puedes usar esta configuración para desarrollo local', 'cyan');
    
  } catch (error) {
    log('\n❌ ERROR DE CONEXIÓN LOCAL:', 'red');
    log(`   Tipo: ${error.code || 'UNKNOWN'}`, 'white');
    log(`   Mensaje: ${error.message}`, 'white');
    
    // Análisis del error
    log('\n🔍 ANÁLISIS DEL ERROR:', 'yellow');
    
    switch (error.code) {
      case 'ECONNREFUSED':
        log('   ❌ MySQL no está corriendo en localhost', 'red');
        log('   💡 Soluciones:', 'yellow');
        log('      - Iniciar servicio MySQL: sudo systemctl start mysql', 'white');
        log('      - Verificar estado: sudo systemctl status mysql', 'white');
        break;
        
      case 'ER_ACCESS_DENIED_ERROR':
        log('   🔐 Acceso denegado', 'red');
        log('   💡 Posibles causas:', 'yellow');
        log('      - Contraseña incorrecta', 'white');
        log('      - Usuario no existe', 'white');
        log('      - Permisos insuficientes', 'white');
        break;
        
      case 'ER_BAD_DB_ERROR':
        log('   🗄️  Base de datos "runite" no existe', 'red');
        log('   💡 Soluciones:', 'yellow');
        log('      - Crear base de datos: CREATE DATABASE runite;', 'white');
        log('      - O usar una base de datos existente', 'white');
        break;
        
      default:
        log('   ❓ Error desconocido', 'red');
        log('   💡 Revisar logs de MySQL', 'yellow');
    }
    
    log('\n🛠️  SOLUCIONES SUGERIDAS:', 'cyan');
    log('   1. Verificar que MySQL esté corriendo: sudo systemctl status mysql', 'white');
    log('   2. Verificar credenciales: mysql -u root -p', 'white');
    log('   3. Crear base de datos: CREATE DATABASE runite;', 'white');
    log('   4. Verificar permisos del usuario root', 'white');
    
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
  testLocalConnection().catch(console.error);
}

module.exports = { testLocalConnection };
