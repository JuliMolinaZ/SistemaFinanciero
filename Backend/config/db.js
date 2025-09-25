const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno desde el archivo .env ubicado en la raíz del Backend
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Verificar que se haya cargado la variable de entorno DB_USER

// Parsear DATABASE_URL para obtener los parámetros de conexión
const parseDatabaseUrl = (url) => {
  try {
    const urlObj = new URL(url);
    return {
      host: urlObj.hostname,
      port: urlObj.port || 3306,
      user: urlObj.username,
      password: urlObj.password,
      database: urlObj.pathname.substring(1), // Remover el slash inicial
    };
  } catch (error) {
    console.error('Error parsing DATABASE_URL:', error);
    return {
      host: 'localhost',
      port: 3306,
      user: 'root',
      password: '',
      database: 'test',
    };
  }
};

const dbConfig = parseDatabaseUrl(process.env.DATABASE_URL);

const pool = mysql.createPool({
  host: dbConfig.host,
  port: dbConfig.port,
  user: dbConfig.user,
  password: dbConfig.password,
  database: dbConfig.database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;

