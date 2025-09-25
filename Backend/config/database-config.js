// =====================================================
// CONFIGURACIÓN DE BASE DE DATOS - MÚLTIPLES ENTORNOS
// =====================================================

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Configuraciones de base de datos para diferentes entornos
const databaseConfigs = {
  // CONFIGURACIÓN REMOTA (ACTIVA)
  remote: {
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sistema_financiero'
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
    host: process.env.ALT_DB_HOST || 'localhost',
    port: process.env.ALT_DB_PORT || 3306,
    user: process.env.ALT_DB_USER || 'root',
    password: process.env.ALT_DB_PASSWORD || '',
    database: process.env.ALT_DB_NAME || 'runite'
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

  return {
    ...config,
    url: databaseUrl
  };
}

// Función para mostrar configuraciones disponibles
function showAvailableConfigs() {

  Object.keys(databaseConfigs).forEach(configName => {
    const config = databaseConfigs[configName];

  });

}

// Función para probar conexión
async function testConnection(configName = 'remote') {
  const config = databaseConfigs[configName];
  if (!config) {
    throw new Error(`Configuración '${configName}' no encontrada`);
  }

  try {
    const mysql = require('mysql2/promise');
    const connection = await mysql.createConnection({
      host: config.host,
      port: config.port,
      user: config.user,
      password: config.password,
      database: config.database
    });

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

  // Probar conexión
  testConnection('remote').then(success => {
    if (success) {

    } else {

    }
  });
}
