// test-prisma-connection.js
const { PrismaClient } = require('@prisma/client');

// Cargar configuración personalizada
require('./src/config/env');

async function testPrismaConnection() {
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
    errorFormat: 'pretty',
  });

  try {
    console.log('🔍 Intentando conectar a la base de datos...');
    console.log('📡 DATABASE_URL:', process.env.DATABASE_URL);
    
    // Probar la conexión
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa!');
    
    // Probar una consulta simple
    console.log('🔍 Probando consulta simple...');
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Consulta exitosa:', result);
    
    // Probar obtener algunos registros de cuentas por pagar
    console.log('🔍 Probando obtener cuentas por pagar...');
    const cuentasPagar = await prisma.cuentaPagar.findMany({
      take: 5,
      include: {
        provider: {
          select: {
            nombre: true
          }
        }
      }
    });
    console.log('✅ Cuentas por pagar obtenidas:', cuentasPagar.length);
    if (cuentasPagar.length > 0) {
      console.log('📊 Primera cuenta:', JSON.stringify(cuentasPagar[0], null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error en la conexión:', error);
    console.error('🔍 Detalles del error:', {
      message: error.message,
      code: error.code,
      meta: error.meta
    });
  } finally {
    await prisma.$disconnect();
    console.log('✅ Conexión cerrada');
  }
}

testPrismaConnection();
