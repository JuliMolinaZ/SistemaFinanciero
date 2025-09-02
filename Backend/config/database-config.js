// =====================================================
// CONFIGURACIÓN DE BASE DE DATOS - MÚLTIPLES ENTORNOS
// =====================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuraciones de base de datos para diferentes entornos
const databaseConfigs = {
  // CONFIGURACIÓN REMOTA (ACTIVA)
  remote: {
    host: '198.23.62.251',
    port: 3306,
    user: 'runsolutions_runite',
    password: 'KuHh4AW1v2QJS3',
    database: 'runsolutions_runite'
  },

  // CONFIGURACIÓN LOCAL (para desarrollo)
  local: {
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: '',
    database: 'sistema_financiero'
  },

  // CONFIGURACIÓN ALTERNATIVA (comentada)
  alternative: {
    host: '64.23.225.99',
    port: 3306,
    user: 'root',
    password: 'o70#%s$nyK2TnU',
    database: 'runite'
  }
};

// Función para obtener la configuración activa
function getActiveConfig() {
  const env = process.env.NODE_ENV || 'production';
  
  // Si tienes DATABASE_URL configurado, usarlo
  if (process.env.DATABASE_URL) {
    return parseDatabaseUrl(process.env.DATABASE_URL);
  }
  
  // Si no, usar configuración por defecto según el entorno
  switch (env) {
    case 'production':
      return databaseConfigs.remote;
    case 'development':
      return databaseConfigs.local;
    default:
      return databaseConfigs.remote;
  }
}

// Función para parsear DATABASE_URL
function parseDatabaseUrl(url) {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: parseInt(urlObj.port) || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.substring(1), // Remover el slash inicial
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    return databaseConfigs.remote;
  }
}

// Función para generar DATABASE_URL
function generateDatabaseUrl(config) {
  return `mysql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
}

// Función para cambiar configuración activa
function switchDatabaseConfig(configName) {
  if (!databaseConfigs[configName]) {
    throw new Error(`Configuración '${configName}' no encontrada`);
  }
  
  const config = databaseConfigs[configName];
  const databaseUrl = generateDatabaseUrl(config);
  
  console.log(`🔄 Cambiando a configuración: ${configName}`);
  console.log(`📍 Host: ${config.host}:${config.port}`);
  console.log(`🗄️  Base de datos: ${config.database}`);
  console.log(`👤 Usuario: ${config.user}`);
  
  return {
    ...config,
    url: databaseUrl
  };
}

// Función para mostrar configuraciones disponibles
function showAvailableConfigs() {
  console.log('\n📋 CONFIGURACIONES DISPONIBLES:');
  console.log('====================================================');
  
  Object.keys(databaseConfigs).forEach(configName => {
    const config = databaseConfigs[configName];
    console.log(`\n🔧 ${configName.toUpperCase()}:`);
    console.log(`   📍 Host: ${config.host}:${config.port}`);
    console.log(`   🗄️  Base de datos: ${config.database}`);
    console.log(`   👤 Usuario: ${config.user}`);
  });
  
  console.log('\n📝 Para cambiar configuración:');
  console.log('   node scripts/switch-database.js [nombre_configuracion]');
}

// Función para probar conexión
async function testConnection(configName = 'remote') {
  const config = databaseConfigs[configName];
  if (!config) {
    throw new Error(`Configuración '${configName}' no encontrada`);
  }
  
  console.log(`🔍 Probando conexión a: ${config.host}:${config.port}`);
  
  try {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });
    
    console.log('✅ Conexión exitosa');
    await connection.end();
    return true;
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    return false;
  }
}

// Exportar funciones
module.exports = {
  databaseConfigs,
  getActiveConfig,
  parseDatabaseUrl,
  generateDatabaseUrl,
  switchDatabaseConfig,
  showAvailableConfigs,
  testConnection
};

// Si se ejecuta directamente, mostrar configuraciones
if (require.main === module) {
  showAvailableConfigs();
  
  // Probar conexión actual
  const currentConfig = getActiveConfig();
  console.log('\n🔍 CONFIGURACIÓN ACTUAL:');
  console.log(`📍 Host: ${currentConfig.host}:${currentConfig.port}`);
  console.log(`🗄️  Base de datos: ${currentConfig.database}`);
  console.log(`👤 Usuario: ${currentConfig.user}`);
  
  // Probar conexión
  testConnection('remote').then(success => {
    if (success) {
      console.log('\n🎉 ¡La base de datos remota está funcionando correctamente!');
    } else {
      console.log('\n⚠️  No se pudo conectar a la base de datos remota');
      console.log('Verifica la configuración y la conectividad de red');
    }
  });
}
