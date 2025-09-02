// test-db-connection.js
const db = require('./config/db');

console.log('🔍 Verificando conexión a la base de datos...');
console.log('Tipo de db:', typeof db);
console.log('Métodos disponibles:', Object.getOwnPropertyNames(db));
console.log('db.query existe:', typeof db.query);
console.log('db.execute existe:', typeof db.execute);

// Probar una consulta simple
async function testQuery() {
  try {
    console.log('🧪 Probando consulta...');
    const [rows] = await db.query('SELECT 1 as test');
    console.log('✅ Consulta exitosa:', rows);
  } catch (error) {
    console.error('❌ Error en consulta:', error);
  }
}

testQuery();
