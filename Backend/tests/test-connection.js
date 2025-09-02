const { PrismaClient } = require('@prisma/client');

console.log('🔍 Probando conexión a la base de datos...\n');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {
    console.log('📋 1. Conectando a la base de datos...');
    await prisma.$connect();
    console.log('✅ Conexión exitosa!');
    
    console.log('\n📋 2. Verificando tablas existentes...');
    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'runsolutions_runite'
      ORDER BY TABLE_NAME
    `;
    
    console.log('📊 Tablas encontradas:');
    if (tables.length === 0) {
      console.log('   ⚠️  No se encontraron tablas');
    } else {
      tables.forEach(table => {
        console.log(`   ✅ ${table.TABLE_NAME}`);
      });
    }
    
    console.log('\n📋 3. Probando consulta simple...');
    
    // Intentar contar registros en diferentes tablas
    const tableTests = ['users', 'clients', 'projects', 'cuentas_por_pagar'];
    
    for (const tableName of tableTests) {
      try {
        const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${prisma.raw(tableName)}`;
        console.log(`   ✅ ${tableName}: ${count[0].count} registros`);
      } catch (error) {
        console.log(`   ❌ ${tableName}: ${error.message}`);
      }
    }
    
    console.log('\n🎉 ¡Conexión y consultas exitosas!');
    
  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar que la base de datos esté accesible');
    console.error('   2. Verificar las credenciales en .env');
    console.error('   3. Verificar que el servidor MySQL esté corriendo');
    console.error('   4. Verificar la configuración de red/firewall');
    
  } finally {
    await prisma.$disconnect();
    console.log('\n🔌 Conexión cerrada');
  }
}

testConnection(); 