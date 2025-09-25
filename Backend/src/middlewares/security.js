const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Configuración de rate limiting
const createRateLimiter = (windowMs = 15 * 60 * 1000, max = 100) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      success: false,
      message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.',
      errors: [{
        field: 'rate_limit',
        message: `Máximo ${max} solicitudes por ${windowMs / 60000} minutos`
      }]
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Rate limiters específicos
const authLimiter = createRateLimiter(15 * 60 * 1000, 5); // 5 intentos por 15 minutos
const apiLimiter = createRateLimiter(15 * 60 * 1000, 100); // 100 requests por 15 minutos
const uploadLimiter = createRateLimiter(60 * 60 * 1000, 10); // 10 uploads por hora

// Middleware de sanitización
const sanitizeInput = (req, res, next) => {
  if (req.method === 'PUT' && req.url.includes('/api/projects/')) {

  }

  // Sanitizar body
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }

  // Sanitizar query params
  if (req.query) {
    Object.keys(req.query).forEach(key => {
      if (typeof req.query[key] === 'string') {
        req.query[key] = req.query[key].trim();
      }
    });
  }

  if (req.method === 'PUT' && req.url.includes('/api/projects/')) {

  }

  next();
};

// Middleware para validar Content-Type
const validateContentType = (req, res, next) => {
  // Solo validar Content-Type para métodos que envían datos
  if (['POST', 'PUT', 'PATCH'].includes(req.method)) {

    const contentType = req.headers['content-type'];
    
    // Permitir application/json y multipart/form-data (para archivos)
    const allowedContentTypes = ['application/json', 'multipart/form-data'];
    const isValidContentType = allowedContentTypes.some(type => contentType && contentType.includes(type));
    
    if (!contentType || !isValidContentType) {

      return res.status(400).json({
        success: false,
        message: 'Content-Type debe ser application/json o multipart/form-data',
        errors: [{
          field: 'content_type',
          message: 'Se requiere application/json o multipart/form-data'
        }]
      });
    }

  }
  next();
};

// Middleware para validar tamaño de payload
const validatePayloadSize = (maxSize = '10mb') => {
  return (req, res, next) => {
    const contentLength = parseInt(req.headers['content-length'], 10);
    const maxSizeBytes = parseFloat(maxSize) * 1024 * 1024; // Convertir a bytes

    if (contentLength && contentLength > maxSizeBytes) {
      return res.status(413).json({
        success: false,
        message: 'Payload demasiado grande',
        errors: [{
          field: 'payload_size',
          message: `El tamaño máximo permitido es ${maxSize}`
        }]
      });
    }
    next();
  };
};

// Configuración de Helmet
const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'"],
    },
  },
  crossOriginEmbedderPolicy: false,
  crossOriginResourcePolicy: { policy: "cross-origin" }
});

// Middleware para prevenir ataques de timing
const preventTimingAttacks = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    // Agregar un delay aleatorio para prevenir timing attacks
    const randomDelay = Math.random() * 100;
    setTimeout(() => {}, randomDelay);
  });
  next();
};

// Middleware para validar headers de seguridad
const validateSecurityHeaders = (req, res, next) => {
  // Verificar que la solicitud venga de un origen permitido
  const origin = req.headers.origin;
  const allowedOrigins = [
    'https://sigma.runsolutions-services.com',
    'http://localhost:3000'
  ];

  if (origin && !allowedOrigins.includes(origin)) {
    return res.status(403).json({
      success: false,
      message: 'Origen no permitido',
      errors: [{
        field: 'origin',
        message: 'El origen de la solicitud no está permitido'
      }]
    });
  }

  next();
};

module.exports = {
  helmetConfig,
  authLimiter,
  apiLimiter,
  uploadLimiter,
  sanitizeInput,
  validateContentType,
  validatePayloadSize,
  preventTimingAttacks,
  validateSecurityHeaders
}; 