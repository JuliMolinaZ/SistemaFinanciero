// config/db.js
const mysql = require('mysql2/promise');
const path = require('path');
// __dirname es '/root/SistemaFinanciero/Backend/config', así que retrocedemos un nivel para llegar a la carpeta 'Backend'
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

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

