#!/usr/bin/env node

// =====================================================
// SCRIPT PARA CREAR TABLA DE CLIENTES
// =====================================================

const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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
  log('🏗️  CREANDO TABLA DE CLIENTES', 'bright');
  log('='.repeat(60), 'cyan');
}

async function createClientsTable() {
  let connection;
  
  try {
    logHeader();
    
    // Parsear DATABASE_URL
    const databaseUrl = process.env.DATABASE_URL;
    if (!databaseUrl) {
      throw new Error('DATABASE_URL no está configurado en .env');
    }
    
    const urlObj = new URL(databaseUrl);
    const dbConfig = {
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.substring(1)
    };
    
    log('\n📡 CONECTANDO A LA BASE DE DATOS...', 'yellow');
    log(`📍 Host: ${dbConfig.host}:${dbConfig.port}`, 'white');
    log(`🗄️  Base de datos: ${dbConfig.database}`, 'white');
    log(`👤 Usuario: ${dbConfig.user}`, 'white');
    
    // Crear conexión
    connection = await mysql.createConnection(dbConfig);
    log('✅ Conexión establecida exitosamente!', 'green');
    
    // Crear tabla de clientes
    log('\n🔨 CREANDO TABLA DE CLIENTES...', 'cyan');
    
    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS clients (
        id INT AUTO_INCREMENT PRIMARY KEY,
        run_cliente VARCHAR(50) UNIQUE,
        nombre VARCHAR(255) NOT NULL,
        rfc VARCHAR(50),
        direccion TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_run_cliente (run_cliente),
        INDEX idx_nombre (nombre),
        INDEX idx_created_at (created_at)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `;
    
    await connection.execute(createTableSQL);
    log('✅ Tabla de clientes creada exitosamente!', 'green');
    
    // Verificar si la tabla existe
    log('\n🔍 VERIFICANDO TABLA CREADA...', 'cyan');
    const [tables] = await connection.execute('SHOW TABLES LIKE "clients"');
    
    if (tables.length > 0) {
      log('✅ Tabla "clients" encontrada en la base de datos', 'green');
      
      // Mostrar estructura de la tabla
      const [columns] = await connection.execute('DESCRIBE clients');
      log('\n📋 ESTRUCTURA DE LA TABLA:', 'yellow');
      columns.forEach(column => {
        log(`   ${column.Field} - ${column.Type} - ${column.Null} - ${column.Key}`, 'white');
      });
      
      // Verificar si hay datos
      const [countResult] = await connection.execute('SELECT COUNT(*) as count FROM clients');
      const count = countResult[0].count;
      log(`\n📊 Total de clientes en la tabla: ${count}`, count > 0 ? 'green' : 'yellow');
      
      if (count === 0) {
        log('💡 La tabla está vacía, puedes agregar clientes desde la aplicación', 'cyan');
      }
      
    } else {
      log('❌ Error: La tabla no se creó correctamente', 'red');
    }
    
    log('\n🎉 ¡TABLA DE CLIENTES CONFIGURADA EXITOSAMENTE!', 'green');
    log('💡 Ahora puedes usar el módulo de clientes en la aplicación', 'cyan');
    
  } catch (error) {
    log('\n❌ ERROR AL CREAR TABLA:', 'red');
    log(`   Tipo: ${error.code || 'UNKNOWN'}`, 'white');
    log(`   Mensaje: ${error.message}`, 'white');
    
    // Análisis del error
    log('\n🔍 ANÁLISIS DEL ERROR:', 'yellow');
    
    switch (error.code) {
      case 'ER_ACCESS_DENIED_ERROR':
        log('   🔐 Acceso denegado a la base de datos', 'red');
        log('   💡 Verificar credenciales en .env', 'yellow');
        break;
        
      case 'ER_BAD_DB_ERROR':
        log('   🗄️  Base de datos no existe', 'red');
        log('   💡 Crear la base de datos primero', 'yellow');
        break;
        
      case 'ECONNREFUSED':
        log('   ❌ No se puede conectar al servidor MySQL', 'red');
        log('   💡 Verificar que MySQL esté corriendo', 'yellow');
        break;
        
      default:
        log('   ❓ Error desconocido', 'red');
        log('   💡 Revisar logs del servidor', 'yellow');
    }
    
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

// Ejecutar si se llama directamente
if (require.main === module) {
  createClientsTable().catch(console.error);
}

module.exports = { createClientsTable };
