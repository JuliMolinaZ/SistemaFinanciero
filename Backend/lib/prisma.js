const { PrismaClient } = require('@prisma/client');

// Crear una instancia global de Prisma
const globalForPrisma = globalThis;

const prisma = globalForPrisma.prisma || new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
});

// En desarrollo, guardar la instancia globalmente para evitar múltiples conexiones
if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Middleware para logging de consultas
prisma.$use(async (params, next) => {
  const before = Date.now();
  const result = await next(params);
  const after = Date.now();
  
  console.log(`Query ${params.model}.${params.action} took ${after - before}ms`);
  
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

module.exports = prisma; 