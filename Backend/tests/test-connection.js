const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  const prisma = new PrismaClient();
  
  try {

    await prisma.$connect();

    const tables = await prisma.$queryRaw`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = 'runsolutions_runite'
      ORDER BY TABLE_NAME
    `;

    if (tables.length === 0) {

    } else {
      tables.forEach(table => {

      });
    }

    // Intentar contar registros en diferentes tablas
    const tableTests = ['users', 'clients', 'projects', 'cuentas_por_pagar'];
    
    for (const tableName of tableTests) {
      try {
        const count = await prisma.$queryRaw`SELECT COUNT(*) as count FROM ${prisma.raw(tableName)}`;

      } catch (error) {

      }
    }

  } catch (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\n💡 Posibles soluciones:');
    console.error('   1. Verificar que la base de datos esté accesible');
    console.error('   2. Verificar las credenciales en .env');
    console.error('   3. Verificar que el servidor MySQL esté corriendo');
    console.error('   4. Verificar la configuración de red/firewall');
    
  } finally {
    await prisma.$disconnect();

  }
}

testConnection(); 