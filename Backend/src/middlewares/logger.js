const fs = require('fs');
const path = require('path');

// Crear directorio de logs si no existe
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Función para escribir logs
const writeLog = (level, message, data = {}) => {
  const timestamp = new Date().toISOString();
  const logEntry = {
    timestamp,
    level,
    message,
    ...data
  };

  const logFile = path.join(logsDir, `${new Date().toISOString().split('T')[0]}.log`);
  const logLine = JSON.stringify(logEntry) + '\n';

  fs.appendFileSync(logFile, logLine);
};

// Middleware de logging para solicitudes
const requestLogger = (req, res, next) => {
  const start = Date.now();
  const { method, url, ip, headers } = req;

  // Log de la solicitud entrante
  writeLog('INFO', 'Request received', {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    contentType: headers['content-type'],
    contentLength: headers['content-length']
  });

  // Interceptar la respuesta para loggear
  const originalSend = res.send;
  res.send = function(data) {
    const duration = Date.now() - start;
    
    // Log de la respuesta
    writeLog('INFO', 'Response sent', {
      method,
      url,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: data ? data.length : 0
    });

    originalSend.call(this, data);
  };

  next();
};

// Middleware de logging para errores
const errorLogger = (err, req, res, next) => {
  const { method, url, ip, headers } = req;

  writeLog('ERROR', 'Request error', {
    method,
    url,
    ip,
    userAgent: headers['user-agent'],
    error: {
      message: err.message,
      stack: err.stack,
      code: err.code,
      statusCode: err.statusCode
    }
  });

  next(err);
};

// Función para loggear eventos específicos
const logEvent = (event, data = {}) => {
  writeLog('EVENT', event, data);
};

// Función para loggear operaciones de base de datos
const logDatabaseOperation = (operation, table, duration, success, error = null) => {
  writeLog('DATABASE', `Database ${operation}`, {
    operation,
    table,
    duration: `${duration}ms`,
    success,
    error: error ? error.message : null
  });
};

// Función para loggear autenticación
const logAuth = (action, userId, success, ip, userAgent) => {
  writeLog('AUTH', `Authentication ${action}`, {
    action,
    userId,
    success,
    ip,
    userAgent
  });
};

// Función para loggear operaciones de archivos
const logFileOperation = (operation, filename, size, success, error = null) => {
  writeLog('FILE', `File ${operation}`, {
    operation,
    filename,
    size: size ? `${size} bytes` : null,
    success,
    error: error ? error.message : null
  });
};

// Middleware para loggear performance
const performanceLogger = (req, res, next) => {
  const start = process.hrtime.bigint();

  res.on('finish', () => {
    const end = process.hrtime.bigint();
    const duration = Number(end - start) / 1000000; // Convertir a milisegundos

    if (duration > 1000) { // Log solo operaciones lentas (> 1 segundo)
      writeLog('PERFORMANCE', 'Slow operation detected', {
        method: req.method,
        url: req.url,
        duration: `${duration.toFixed(2)}ms`,
        statusCode: res.statusCode
      });
    }
  });

  next();
};

// Función para limpiar logs antiguos (mantener solo 30 días)
const cleanupOldLogs = () => {
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  fs.readdir(logsDir, (err, files) => {
    if (err) {
      console.error('Error reading logs directory:', err);
      return;
    }

    files.forEach(file => {
      const filePath = path.join(logsDir, file);
      const stats = fs.statSync(filePath);
      
      if (stats.mtime < thirtyDaysAgo) {
        fs.unlinkSync(filePath);
        console.log(`Deleted old log file: ${file}`);
      }
    });
  });
};

// Ejecutar limpieza de logs diariamente
setInterval(cleanupOldLogs, 24 * 60 * 60 * 1000); // 24 horas

module.exports = {
  requestLogger,
  errorLogger,
  logEvent,
  logDatabaseOperation,
  logAuth,
  logFileOperation,
  performanceLogger,
  cleanupOldLogs
}; 