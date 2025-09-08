require('dotenv').config();

module.exports = {
  // Configuración del servidor
  server: {
    port: process.env.PORT || 5000,
    host: process.env.HOST || 'localhost',
    environment: process.env.NODE_ENV || 'production'
  },

  // Configuración de la base de datos
  database: {
    url: process.env.DATABASE_URL,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    name: process.env.DB_NAME
  },

  // Configuración de seguridad
  security: {
    jwtSecret: process.env.JWT_SECRET || 'your-secret-key',
    jwtExpiration: process.env.JWT_EXPIRATION || '24h',
    encryptionKey: process.env.ENCRYPTION_KEY || 'your-encryption-key',
    bcryptRounds: 12
  },

  // Configuración de rate limiting
  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutos
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100
  },

  // Configuración de logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    file: process.env.LOG_FILE || './logs/app.log'
  },

  // Configuración de backup
  backup: {
    directory: process.env.BACKUP_DIR || './backups',
    retentionDays: parseInt(process.env.BACKUP_RETENTION_DAYS) || 30,
    compress: process.env.BACKUP_COMPRESS === 'true',
    encrypt: process.env.BACKUP_ENCRYPT === 'true',
    encryptionKey: process.env.BACKUP_ENCRYPTION_KEY
  },

  // Configuración de Firebase
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID
  },

  // Configuración de CORS
  cors: {
    origin: process.env.CORS_ORIGIN ? process.env.CORS_ORIGIN.split(',') : ['https://sigma.runsolutions-services.com'],
    credentials: true
  }
}; 