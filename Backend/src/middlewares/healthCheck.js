// Middleware para verificar la salud de la base de datos
const { checkConnection } = require('../config/prisma');

const healthCheck = async (req, res, next) => {
  try {
    // Verificar conexión a la base de datos
    const isConnected = await checkConnection();
    
    if (!isConnected) {
      console.warn('⚠️ Base de datos no disponible, reintentando...');
      // Esperar un poco y reintentar
      await new Promise(resolve => setTimeout(resolve, 1000));
      const retryConnection = await checkConnection();
      
      if (!retryConnection) {
        return res.status(503).json({
          success: false,
          error: 'Base de datos no disponible',
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Agregar información de salud al request
    req.dbHealth = {
      connected: isConnected,
      timestamp: new Date().toISOString()
    };
    
    next();
  } catch (error) {
    console.error('❌ Error en health check:', error);
    res.status(503).json({
      success: false,
      error: 'Error de salud del sistema',
      details: error.message
    });
  }
};

module.exports = healthCheck;
