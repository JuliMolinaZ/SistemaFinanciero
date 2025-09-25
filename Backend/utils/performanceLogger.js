// 📊 PERFORMANCE LOGGER - MONITOREO DE RENDIMIENTO
// =================================================

const os = require('os');

// 🎯 MÉTRICAS DE RENDIMIENTO
class PerformanceLogger {
  constructor() {
    this.metrics = new Map();
    this.startTimes = new Map();
  }

  // ⏱️ Iniciar medición
  start(operationId) {
    this.startTimes.set(operationId, {
      timestamp: Date.now(),
      memoryUsage: process.memoryUsage(),
      cpuUsage: process.cpuUsage()
    });
  }

  // ⏹️ Finalizar medición
  end(operationId, metadata = {}) {
    const startData = this.startTimes.get(operationId);
    if (!startData) {

      return null;
    }

    const endTime = Date.now();
    const duration = endTime - startData.timestamp;
    const endMemory = process.memoryUsage();
    const endCpu = process.cpuUsage(startData.cpuUsage);

    const metrics = {
      operationId,
      duration,
      memoryUsage: {
        heapUsed: endMemory.heapUsed - startData.memoryUsage.heapUsed,
        heapTotal: endMemory.heapTotal - startData.memoryUsage.heapTotal,
        external: endMemory.external - startData.memoryUsage.external,
        rss: endMemory.rss - startData.memoryUsage.rss
      },
      cpuUsage: {
        user: endCpu.user,
        system: endCpu.system
      },
      timestamp: endTime,
      metadata
    };

    this.metrics.set(operationId, metrics);
    this.startTimes.delete(operationId);

    // Log si la operación fue lenta
    if (duration > 1000) {

    }

    return metrics;
  }

  // 📊 Obtener métricas
  getMetrics(operationId) {
    if (operationId) {
      return this.metrics.get(operationId);
    }
    return Array.from(this.metrics.values());
  }

  // 🧹 Limpiar métricas antiguas
  cleanup(maxAge = 3600000) { // 1 hora por defecto
    const now = Date.now();
    for (const [id, metrics] of this.metrics.entries()) {
      if (now - metrics.timestamp > maxAge) {
        this.metrics.delete(id);
      }
    }
  }

  // 📈 Estadísticas del sistema
  getSystemStats() {
    return {
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      cpu: process.cpuUsage(),
      platform: process.platform,
      nodeVersion: process.version,
      loadAverage: os.loadavg(),
      freeMemory: os.freemem(),
      totalMemory: os.totalmem()
    };
  }
}

// 🎯 Instancia singleton
const performanceLogger = new PerformanceLogger();

// 🔄 Cleanup automático cada 30 minutos
setInterval(() => {
  performanceLogger.cleanup();
}, 30 * 60 * 1000);

// 📊 Funciones de conveniencia
const logOperation = (operationName, fn) => {
  return async (...args) => {
    const operationId = `${operationName}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    performanceLogger.start(operationId);
    
    try {
      const result = await fn(...args);
      const metrics = performanceLogger.end(operationId, { success: true });
      
      // Log solo si es una operación significativa
      if (metrics && metrics.duration > 100) {

      }
      
      return result;
    } catch (error) {
      performanceLogger.end(operationId, { success: false, error: error.message });
      throw error;
    }
  };
};

// 📊 Middleware para Express
const performanceMiddleware = (req, res, next) => {
  const operationId = `${req.method}_${req.path}_${Date.now()}`;
  req.performanceId = operationId;
  
  performanceLogger.start(operationId);
  
  // Hook en el final de la respuesta
  const originalSend = res.send;
  res.send = function(data) {
    const metrics = performanceLogger.end(operationId, {
      method: req.method,
      path: req.path,
      statusCode: res.statusCode,
      contentLength: data ? data.length : 0
    });
    
    // Log requests lentos
    if (metrics && metrics.duration > 500) {

    }
    
    return originalSend.call(this, data);
  };
  
  next();
};

module.exports = {
  performanceLogger,
  logOperation,
  performanceMiddleware,
  
  // Funciones de conveniencia
  start: (id) => performanceLogger.start(id),
  end: (id, metadata) => performanceLogger.end(id, metadata),
  getMetrics: (id) => performanceLogger.getMetrics(id),
  getSystemStats: () => performanceLogger.getSystemStats(),
  cleanup: () => performanceLogger.cleanup()
};
