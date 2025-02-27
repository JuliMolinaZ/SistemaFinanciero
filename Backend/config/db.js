const mysql = require('mysql2/promise');
const path = require('path');

// Cargar variables de entorno desde el archivo .env ubicado en la raíz del Backend
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

// Verificar que se haya cargado la variable de entorno DB_USER
console.log("DB_USER:", process.env.DB_USER);

const pool = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'tu_usuario',
  password: process.env.DB_PASSWORD || 'tu_contraseña',
  database: process.env.DB_NAME || 'tu_basedatos',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;


