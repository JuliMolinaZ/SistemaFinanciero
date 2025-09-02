// Middleware de manejo de errores
const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    body: req.body,
    params: req.params,
    query: req.query,
    userAgent: req.get('User-Agent'),
    ip: req.ip,
    timestamp: new Date().toISOString()
  });

  // Errores de validación de Joi
  if (err.isJoi) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: err.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }))
    });
  }

  // Errores de MySQL
  if (err.code === 'ER_DUP_ENTRY') {
    return res.status(409).json({
      success: false,
      message: 'Registro duplicado',
      errors: [{
        field: 'database',
        message: 'Ya existe un registro con estos datos'
      }]
    });
  }

  if (err.code === 'ER_NO_REFERENCED_ROW_2') {
    return res.status(400).json({
      success: false,
      message: 'Referencia inválida',
      errors: [{
        field: 'foreign_key',
        message: 'La referencia especificada no existe'
      }]
    });
  }

  if (err.code === 'ER_ROW_IS_REFERENCED_2') {
    return res.status(400).json({
      success: false,
      message: 'No se puede eliminar',
      errors: [{
        field: 'constraint',
        message: 'Este registro está siendo utilizado por otros registros'
      }]
    });
  }

  // Errores de conexión a base de datos
  if (err.code === 'ECONNREFUSED' || err.code === 'ENOTFOUND') {
    return res.status(503).json({
      success: false,
      message: 'Error de conexión a la base de datos',
      errors: [{
        field: 'database',
        message: 'No se pudo conectar con la base de datos'
      }]
    });
  }

  // Errores de archivo
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(413).json({
      success: false,
      message: 'Archivo demasiado grande',
      errors: [{
        field: 'file',
        message: 'El tamaño del archivo excede el límite permitido'
      }]
    });
  }

  if (err.code === 'LIMIT_UNEXPECTED_FILE') {
    return res.status(400).json({
      success: false,
      message: 'Archivo inesperado',
      errors: [{
        field: 'file',
        message: 'Se recibió un archivo no esperado'
      }]
    });
  }

  // Errores de autenticación
  if (err.name === 'UnauthorizedError') {
    return res.status(401).json({
      success: false,
      message: 'No autorizado',
      errors: [{
        field: 'auth',
        message: 'Token de autenticación inválido o expirado'
      }]
    });
  }

  // Errores de permisos
  if (err.name === 'ForbiddenError') {
    return res.status(403).json({
      success: false,
      message: 'Acceso denegado',
      errors: [{
        field: 'permissions',
        message: 'No tienes permisos para realizar esta acción'
      }]
    });
  }

  // Errores de validación de datos
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      success: false,
      message: 'Datos inválidos',
      errors: [{
        field: 'validation',
        message: err.message
      }]
    });
  }

  // Errores de sintaxis JSON
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({
      success: false,
      message: 'JSON inválido',
      errors: [{
        field: 'json',
        message: 'El cuerpo de la solicitud no es un JSON válido'
      }]
    });
  }

  // Errores de timeout
  if (err.code === 'ETIMEDOUT') {
    return res.status(408).json({
      success: false,
      message: 'Tiempo de espera agotado',
      errors: [{
        field: 'timeout',
        message: 'La operación tardó demasiado en completarse'
      }]
    });
  }

  // Errores de memoria
  if (err.code === 'ENOMEM') {
    return res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      errors: [{
        field: 'memory',
        message: 'Error de memoria del servidor'
      }]
    });
  }

  // Error por defecto (500)
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Error interno del servidor';

  res.status(statusCode).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Error interno del servidor' : message,
    ...(process.env.NODE_ENV !== 'production' && {
      stack: err.stack,
      details: err
    })
  });
};

// Middleware para manejar rutas no encontradas
const notFoundHandler = (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    errors: [{
      field: 'route',
      message: `La ruta ${req.method} ${req.originalUrl} no existe`
    }]
  });
};

// Middleware para manejar métodos HTTP no permitidos
const methodNotAllowedHandler = (req, res) => {
  res.status(405).json({
    success: false,
    message: 'Método no permitido',
    errors: [{
      field: 'method',
      message: `El método ${req.method} no está permitido para esta ruta`
    }]
  });
};

module.exports = {
  errorHandler,
  notFoundHandler,
  methodNotAllowedHandler
}; 