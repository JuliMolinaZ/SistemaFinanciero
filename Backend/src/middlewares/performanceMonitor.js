// 🚀 MIDDLEWARE DE MONITOREO DE PERFORMANCE
const performanceLogger = require('../../utils/performanceLogger');

// Middleware para monitorear tiempo de respuesta de queries
const queryPerformanceMonitor = (req, res, next) => {
  const startTime = Date.now();
  const originalSend = res.send;

  res.send = function(data) {
    const endTime = Date.now();
    const responseTime = endTime - startTime;

    // Log solo queries lentas (más de 1 segundo)
    if (responseTime > 1000) {
      console.warn(`🐌 Query lenta detectada:`, {
        method: req.method,
        url: req.originalUrl,
        responseTime: `${responseTime}ms`,
        timestamp: new Date().toISOString(),
        userAgent: req.get('User-Agent'),
        ip: req.ip
      });
    }

    // Log para desarrollo
    if (process.env.NODE_ENV === 'development' && responseTime > 500) {
      console.log(`⚡ Performance Monitor:`, {
        endpoint: `${req.method} ${req.originalUrl}`,
        responseTime: `${responseTime}ms`,
        status: res.statusCode
      });
    }

    // Agregar header de performance
    res.setHeader('X-Response-Time', `${responseTime}ms`);

    return originalSend.call(this, data);
  };

  next();
};

// Middleware para limitar queries por IP
const rateLimiter = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
  const requests = new Map();

  return (req, res, next) => {
    const ip = req.ip;
    const now = Date.now();

    if (!requests.has(ip)) {
      requests.set(ip, { count: 1, resetTime: now + windowMs });
      return next();
    }

    const clientRequests = requests.get(ip);

    if (now > clientRequests.resetTime) {
      clientRequests.count = 1;
      clientRequests.resetTime = now + windowMs;
      return next();
    }

    if (clientRequests.count >= maxRequests) {
      return res.status(429).json({
        success: false,
        message: 'Demasiadas solicitudes. Intenta nuevamente en unos minutos.',
        retryAfter: Math.ceil((clientRequests.resetTime - now) / 1000)
      });
    }

    clientRequests.count++;
    next();
  };
};

// Middleware para cachear respuestas GET
const cacheMiddleware = (duration = 300) => { // 5 minutos por defecto
  const cache = new Map();

  return (req, res, next) => {
    if (req.method !== 'GET') {
      return next();
    }

    const key = req.originalUrl;
    const cached = cache.get(key);

    if (cached && Date.now() < cached.expiry) {
      res.setHeader('X-Cache', 'HIT');
      res.setHeader('X-Cache-Expiry', new Date(cached.expiry).toISOString());
      return res.json(cached.data);
    }

    const originalSend = res.send;
    res.send = function(data) {
      if (res.statusCode === 200) {
        try {
          const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
          cache.set(key, {
            data: parsedData,
            expiry: Date.now() + (duration * 1000)
          });
          res.setHeader('X-Cache', 'MISS');
        } catch (error) {
          console.error('Error caching response:', error);
        }
      }
      return originalSend.call(this, data);
    };

    next();
  };
};

// Cleanup automático del cache cada hora
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of cache.entries()) {
    if (now > value.expiry) {
      cache.delete(key);
    }
  }
}, 60 * 60 * 1000);

module.exports = {
  queryPerformanceMonitor,
  rateLimiter,
  cacheMiddleware
};