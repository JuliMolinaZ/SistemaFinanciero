// Configuración de Prisma Client con pool de conexiones y manejo de reconexión
const { PrismaClient } = require('@prisma/client');

// Configuración del cliente Prisma con opciones de estabilidad
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  // Configuración de logging para debugging
  log: [
    {
      emit: 'event',
      level: 'query',
    },
    {
      emit: 'stdout',
      level: 'error',
    },
    {
      emit: 'stdout',
      level: 'info',
    },
    {
      emit: 'stdout',
      level: 'warn',
    },
  ],
  // Configuración de pool de conexiones
  __internal: {
    engine: {
      connectionLimit: 10,
      pool: {
        min: 2,
        max: 10,
        acquireTimeoutMillis: 60000,
        createTimeoutMillis: 30000,
        destroyTimeoutMillis: 5000,
        idleTimeoutMillis: 30000,
        reapIntervalMillis: 1000,
        createRetryIntervalMillis: 200,
      }
    }
  }
});

// Manejo de eventos de conexión
prisma.$on('query', (e) => {
  console.log(`[PRISMA QUERY] ${e.query} - ${e.duration}ms`);
});

prisma.$on('error', (e) => {
  console.error(`[PRISMA ERROR] ${e.message}`);
});

prisma.$on('info', (e) => {
  console.log(`[PRISMA INFO] ${e.message}`);
});

prisma.$on('warn', (e) => {
  console.warn(`[PRISMA WARN] ${e.message}`);
});

// Función para verificar la conexión
async function checkConnection() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Conexión a la base de datos establecida');
    return true;
  } catch (error) {
    console.error('❌ Error de conexión a la base de datos:', error);
    return false;
  }
}

// Función para reconectar automáticamente
async function reconnect() {
  try {
    console.log('🔄 Intentando reconectar a la base de datos...');
    await prisma.$disconnect();
    await prisma.$connect();
    console.log('✅ Reconexión exitosa');
    return true;
  } catch (error) {
    console.error('❌ Error en la reconexión:', error);
    return false;
  }
}

// Middleware para manejar conexiones perdidas
async function withConnectionRetry(operation) {
  try {
    return await operation();
  } catch (error) {
    if (error.code === 'P1001' || error.code === 'P1008' || error.message.includes('connection')) {
      console.log('🔄 Conexión perdida, intentando reconectar...');
      const reconnected = await reconnect();
      if (reconnected) {
        return await operation();
      }
    }
    throw error;
  }
}

// Verificar conexión al inicializar
checkConnection();

module.exports = {
  prisma,
  checkConnection,
  reconnect,
  withConnectionRetry
};
