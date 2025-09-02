// test-cuentas-pagar.js
const db = require('./config/db');

async function testCuentasPagar() {
  try {
    console.log('🔍 Probando conexión a la base de datos...');
    
    // Probar conexión
    const connection = await db.getConnection();
    console.log('✅ Conexión exitosa a la base de datos');
    
    // Verificar que la tabla existe
    const [tables] = await connection.query(`
      SHOW TABLES LIKE 'cuentas_por_pagar'
    `);
    
    if (tables.length === 0) {
      console.log('❌ La tabla cuentas_por_pagar no existe');
      return;
    }
    
    console.log('✅ Tabla cuentas_por_pagar existe');
    
    // Contar registros
    const [countResult] = await connection.query(`
      SELECT COUNT(*) as total FROM cuentas_por_pagar
    `);
    
    console.log('📊 Total de registros en cuentas_por_pagar:', countResult[0].total);
    
    // Obtener algunos registros de ejemplo
    const [rows] = await connection.query(`
      SELECT * FROM cuentas_por_pagar LIMIT 5
    `);
    
    if (rows.length > 0) {
      console.log('📋 Primeros registros:');
      rows.forEach((row, index) => {
        console.log(`  ${index + 1}. ID: ${row.id}, Concepto: ${row.concepto}, Monto: ${row.monto_neto}`);
      });
    } else {
      console.log('📭 No hay registros en la tabla');
    }
    
    // Verificar estructura de la tabla
    const [columns] = await connection.query(`
      DESCRIBE cuentas_por_pagar
    `);
    
    console.log('🏗️ Estructura de la tabla:');
    columns.forEach(col => {
      console.log(`  - ${col.Field}: ${col.Type} ${col.Null === 'NO' ? '(NOT NULL)' : ''}`);
    });
    
    connection.release();
    console.log('✅ Prueba completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error);
  } finally {
    process.exit();
  }
}

testCuentasPagar();
