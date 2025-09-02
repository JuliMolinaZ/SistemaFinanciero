const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

// Configuración
const config = require('./config/app');

// Middlewares - Importación segura
let requestLogger, errorLogger, errorHandler, sanitizeInput, validateContentType, validatePayloadSize;

try {
  const middlewares = require('./middlewares');
  requestLogger = middlewares.requestLogger;
  errorLogger = middlewares.errorLogger;
  errorHandler = middlewares.errorHandler;
  sanitizeInput = middlewares.sanitizeInput;
  validateContentType = middlewares.validateContentType;
  validatePayloadSize = middlewares.validatePayloadSize;
} catch (error) {
  console.warn('⚠️ Algunos middlewares no están disponibles, usando middlewares básicos');
  
  // Middlewares básicos de respaldo
  requestLogger = (req, res, next) => next();
  errorLogger = (err, req, res, next) => next(err);
  errorHandler = (err, req, res, next) => {
    res.status(500).json({ error: err.message });
  };
  sanitizeInput = (req, res, next) => next();
  validateContentType = (req, res, next) => next();
  validatePayloadSize = (maxSize) => (req, res, next) => next();
}

// Rutas
const routes = require('./routes/index-safe');

// Crear aplicación Express
const app = express();

// =====================================================
// MIDDLEWARES DE SEGURIDAD
// =====================================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: config.cors?.origin || '*',
  credentials: config.cors?.credentials || true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
      max: 1000, // Aumentado temporalmente para pruebas
  message: {
    success: false,
    message: 'Demasiadas solicitudes desde esta IP, inténtalo de nuevo más tarde.',
    errors: [
      {
        field: 'rate_limit',
        message: 'Máximo 1000 solicitudes por 15 minutos'
      }
    ]
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Configuración de estabilidad
  skipSuccessfulRequests: true, // No contar requests exitosos
  skipFailedRequests: false,    // Contar requests fallidos
  keyGenerator: (req) => {
    // Usar IP + User Agent para mejor identificación
    return req.ip + ':' + (req.headers['user-agent'] || 'unknown');
  }
});

app.use('/api/', limiter);

// =====================================================
// CONFIGURACIONES DE ESTABILIDAD
// =====================================================

// Timeout para requests largos
app.use((req, res, next) => {
  // Establecer timeout de 2 minutos para requests
  req.setTimeout(120000);
  res.setTimeout(120000);
  next();
});

// Middleware de keep-alive para conexiones
app.use((req, res, next) => {
  res.set('Connection', 'keep-alive');
  res.set('Keep-Alive', 'timeout=5, max=1000');
  next();
});

// =====================================================
// MIDDLEWARES DE PROCESAMIENTO
// =====================================================

// Compresión
app.use(compression());

// Parsing de JSON
app.use(express.json({ 
  limit: '10mb',
  verify: (req, res, buf) => {
    req.rawBody = buf;
  }
}));

// Parsing de URL encoded
app.use(express.urlencoded({ 
  extended: true, 
  limit: '10mb' 
}));

// =====================================================
// MIDDLEWARES DE VALIDACIÓN Y SEGURIDAD
// =====================================================

// Validación de Content-Type
app.use(validateContentType);

// Validación de tamaño de payload
app.use(validatePayloadSize('10mb'));

// Sanitización de entrada
app.use(sanitizeInput);

// =====================================================
// MIDDLEWARES DE LOGGING
// =====================================================

// Logging de requests
app.use(requestLogger);

// =====================================================
// RUTAS
// =====================================================

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema Financiero API',
    version: process.env.npm_package_version || '1.0.0',
    environment: config.server.environment,
    timestamp: new Date().toISOString(),
    endpoints: {
      health: '/api/health',
      info: '/api/info',
      docs: '/api/docs'
    }
  });
});

// Rutas de la API
app.use('/api', routes);

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Logging de errores
app.use(errorLogger);

// Manejador de errores global
app.use(errorHandler);

// Manejador de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString()
  });
});

module.exports = app; 