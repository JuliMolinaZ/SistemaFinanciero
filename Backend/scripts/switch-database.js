#!/usr/bin/env node

// =====================================================
// SCRIPT PARA CAMBIAR CONFIGURACIÓN DE BASE DE DATOS
// =====================================================

const fs = require('fs');
const path = require('path');
const { databaseConfigs, switchDatabaseConfig, showAvailableConfigs } = require('../config/database-config');

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
  log('🔄 CAMBIADOR DE CONFIGURACIÓN DE BASE DE DATOS', 'bright');
  log('='.repeat(60), 'cyan');
}

function showHelp() {
  logHeader();
  log('\n📖 USO:', 'yellow');
  log('   node scripts/switch-database.js [configuración]', 'white');
  log('\n📋 CONFIGURACIONES DISPONIBLES:', 'yellow');
  
  Object.keys(databaseConfigs).forEach(configName => {
    const config = databaseConfigs[configName];
    log(`\n🔧 ${configName.toUpperCase()}:`, 'green');
    log(`   📍 Host: ${config.host}:${config.port}`, 'white');
    log(`   🗄️  Base de datos: ${config.database}`, 'white');
    log(`   👤 Usuario: ${config.user}`, 'white');
  });
  
  log('\n💡 EJEMPLOS:', 'yellow');
  log('   node scripts/switch-database.js current    # Usar configuración actual', 'white');
  log('   node scripts/switch-database.js remote     # Usar configuración remota', 'white');
  log('   node scripts/switch-database.js local      # Usar configuración local', 'white');
  log('   node scripts/switch-database.js            # Mostrar ayuda', 'white');
  
  log('\n⚠️  NOTA:', 'red');
  log('   Este script solo muestra la configuración. Para aplicarla,', 'white');
  log('   edita el archivo .env con los valores mostrados.', 'white');
}

function updateEnvFile(configName) {
  const config = databaseConfigs[configName];
  if (!config) {
    log(`❌ Configuración '${configName}' no encontrada`, 'red');
    return false;
  }
  
  const envPath = path.join(__dirname, '..', '.env');
  if (!fs.existsSync(envPath)) {
    log('❌ Archivo .env no encontrado', 'red');
    log('💡 Crea el archivo .env primero', 'yellow');
    return false;
  }
  
  try {
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Generar nueva DATABASE_URL
    const newDatabaseUrl = `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
    
    // Actualizar o agregar DATABASE_URL
    if (envContent.includes('DATABASE_URL=')) {
      envContent = envContent.replace(
        /DATABASE_URL="[^"]*"/,
        `DATABASE_URL="${newDatabaseUrl}"`
      );
    } else {
      envContent += `\nDATABASE_URL="${newDatabaseUrl}"\n`;
    }
    
    // Actualizar variables individuales si existen
    if (envContent.includes('DB_HOST=')) {
      envContent = envContent.replace(/DB_HOST=[^\n]*/, `DB_HOST=${config.host}`);
    }
    if (envContent.includes('DB_PORT=')) {
      envContent = envContent.replace(/DB_PORT=[^\n]*/, `DB_PORT=${config.port}`);
    }
    if (envContent.includes('DB_USER=')) {
      envContent = envContent.replace(/DB_USER=[^\n]*/, `DB_USER=${config.user}`);
    }
    if (envContent.includes('DB_PASSWORD=')) {
      envContent = envContent.replace(/DB_PASSWORD=[^\n]*/, `DB_PASSWORD=${config.password}`);
    }
    if (envContent.includes('DB_NAME=')) {
      envContent = envContent.replace(/DB_NAME=[^\n]*/, `DB_NAME=${config.database}`);
    }
    
    fs.writeFileSync(envPath, envContent);
    
    log(`✅ Archivo .env actualizado con configuración '${configName}'`, 'green');
    log(`📍 DATABASE_URL: ${newDatabaseUrl}`, 'cyan');
    
    return true;
  } catch (error) {
    log(`❌ Error al actualizar archivo .env: ${error.message}`, 'red');
    return false;
  }
}

function main() {
  const configName = process.argv[2];
  
  if (!configName || configName === '--help' || configName === '-h') {
    showHelp();
    return;
  }
  
  if (!databaseConfigs[configName]) {
    log(`❌ Configuración '${configName}' no válida`, 'red');
    showHelp();
    return;
  }
  
  logHeader();
  
  // Mostrar configuración seleccionada
  const config = databaseConfigs[configName];
  log(`\n🎯 CONFIGURACIÓN SELECCIONADA: ${configName.toUpperCase()}`, 'green');
  log(`📍 Host: ${config.host}:${config.port}`, 'white');
  log(`🗄️  Base de datos: ${config.database}`, 'white');
  log(`👤 Usuario: ${config.user}`, 'white');
  
  // Preguntar si actualizar el archivo .env
  log('\n❓ ¿Deseas actualizar el archivo .env con esta configuración? (y/N)', 'yellow');
  
  // En modo no interactivo, asumir que sí
  if (process.env.NODE_ENV === 'production' || process.env.AUTO_UPDATE === 'true') {
    log('🔄 Actualizando archivo .env automáticamente...', 'cyan');
    updateEnvFile(configName);
    return;
  }
  
  // En modo interactivo, mostrar instrucciones
  log('\n💡 Para aplicar esta configuración:', 'cyan');
  log('   1. Edita el archivo .env', 'white');
  log('   2. Actualiza DATABASE_URL con:', 'white');
  log(`      mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`, 'magenta');
  log('   3. O ejecuta: node scripts/switch-database.js --update', 'white');
  
  log('\n🔧 Variables de entorno sugeridas:', 'cyan');
  log(`   DB_HOST=${config.host}`, 'white');
  log(`   DB_PORT=${config.port}`, 'white');
  log(`   DB_USER=${config.user}`, 'white');
  log(`   DB_PASSWORD=${config.password}`, 'white');
  log(`   DB_NAME=${config.database}`, 'white');
}

// Ejecutar si se llama directamente
if (require.main === module) {
  main();
}

module.exports = {
  updateEnvFile,
  showHelp
};
