// Middlewares de autenticación y autorización
const auth = require('./auth');
const { validateJWT, validateFirebase } = require('./auth');

// Middlewares de validación
const validation = require('./validation');
const { validateWithJoi, validateId, validatePagination } = require('./validation');

// Middlewares de seguridad
const security = require('./security');
const { sanitizeInput, validateContentType } = require('./security');
const validatePayloadSize = require('./security').validatePayloadSize;

// Middlewares de logging
const logger = require('./logger');
const { requestLogger, errorLogger, performanceLogger } = require('./logger');

// Middlewares de auditoría
const audit = require('./audit');
const { auditEvent, AUDIT_ACTIONS } = require('./audit');

// Middlewares de manejo de errores
const errorHandler = require('./errorHandler');

// Middlewares de paginación
const pagination = require('./pagination');
const { processPaginationParams, manualPagination } = require('./pagination');

// Middlewares de backup (temporalmente deshabilitado)
// const backup = require('./backup');

module.exports = {
  // Autenticación
  auth,
  validateJWT,
  validateFirebase,
  
  // Validación
  validation,
  validateWithJoi,
  validateId,
  validatePagination,
  
  // Seguridad
  security,
  sanitizeInput,
  validateContentType,
  validatePayloadSize,
  
  // Logging
  logger,
  requestLogger,
  errorLogger,
  performanceLogger,
  
  // Auditoría
  audit,
  auditEvent,
  AUDIT_ACTIONS,
  
  // Manejo de errores
  errorHandler,
  
  // Paginación
  pagination,
  processPaginationParams,
  manualPagination,
  
  // Backup (temporalmente deshabilitado)
  // backup
}; 