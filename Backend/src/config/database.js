const { PrismaClient } = require('@prisma/client');

// Configuración de Prisma Client
const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
  errorFormat: 'pretty',
});

// Middleware para logging de queries
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  if (process.env.NODE_ENV === 'development') {
    console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  }
  
  return result;
});

// Middleware para manejo de errores
prisma.$use(async (params, next) => {
  try {
    return await next(params);
  } catch (error) {
    console.error('Prisma Error:', {
      model: params.model,
      action: params.action,
      error: error.message,
      code: error.code
    });
    throw error;
  }
});

// Función para probar la conexión
const testConnection = async () => {
  try {
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error conectando a la base de datos:', error);
    return false;
  }
};

// Función para cerrar la conexión
const closeConnection = async () => {
  try {
    await prisma.$disconnect();
    console.log('✅ Conexión a la base de datos cerrada');
  } catch (error) {
    console.error('❌ Error cerrando conexión a la base de datos:', error);
  }
};

// Manejar cierre graceful del proceso
process.on('beforeExit', closeConnection);
process.on('SIGINT', closeConnection);
process.on('SIGTERM', closeConnection);

module.exports = {
  prisma,
  testConnection,
  closeConnection
}; 