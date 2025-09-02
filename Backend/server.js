// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');

// Cargar configuración personalizada ANTES de dotenv
require('./src/config/env');

// Ahora cargar dotenv
require('dotenv').config();

// Importar middlewares de seguridad y validación
const {
  helmetConfig,
  apiLimiter,
  sanitizeInput,
  validateContentType,
  validatePayloadSize,
  validateSecurityHeaders
} = require('./src/middlewares/security');

// Importar middlewares de logging
const { requestLogger, errorLogger, performanceLogger } = require('./src/middlewares/logger');

// Importar middleware de bloqueo de usuarios invitados
const { blockInvitedUsers } = require('./src/middlewares/invitationBlock');

const app = express();

// Configuración de CORS para permitir solicitudes desde producción y desde localhost:3000
const corsOptions = {
  origin: (origin, callback) => {
    // Permite solicitudes sin origen (por ejemplo, desde Postman) o cuando no se especifica origen
    if (!origin) return callback(null, true);

    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://sigma.runsolutions-services.com', 
      'http://localhost:3000'                     
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  }
};

// Aplicar middlewares de logging
app.use(requestLogger);
app.use(performanceLogger);

// Aplicar middlewares de seguridad básicos
app.use(helmetConfig);
app.use(apiLimiter);
app.use(validateSecurityHeaders);

// Configurar CORS y parsing del body ANTES de las validaciones
app.use(cors(corsOptions));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '10mb' }));

// Sanitizar y validar DESPUÉS de parsear el body
app.use(sanitizeInput);
app.use(validateContentType);
app.use(validatePayloadSize('10mb'));

// Aplicar middleware de bloqueo de usuarios invitados
app.use(blockInvitedUsers);

// Middleware de debug temporal para verificar parsing del body
app.use((req, res, next) => {
  if (req.method === 'PUT' && req.url.includes('/api/projects/')) {
    console.log('🔍 DEBUG MIDDLEWARE - Body parseado:', req.body);
    console.log('🔍 DEBUG MIDDLEWARE - Tipo de body:', typeof req.body);
    console.log('🔍 DEBUG MIDDLEWARE - Keys del body:', Object.keys(req.body));
  }
  next();
});

// Middleware de debug FINAL para verificar que el body se mantenga
app.use((req, res, next) => {
  if (req.method === 'PUT' && req.url.includes('/api/projects/')) {
    console.log('🔍 FINAL MIDDLEWARE - Body ANTES de las rutas:', req.body);
    console.log('🔍 FINAL MIDDLEWARE - Tipo de body:', typeof req.body);
    console.log('🔍 FINAL MIDDLEWARE - Keys del body:', Object.keys(req.body));
  }
  next();
});

// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar middlewares de manejo de errores
const { errorHandler, notFoundHandler, methodNotAllowedHandler } = require('./src/middlewares/errorHandler');

// Importar rutas
const authRoutes = require('./src/routes/auth');
const permisosRoutes = require('./src/routes/permisos');
const usuariosRoutes = require('./src/routes/usuarios');
const clientsRoutes = require('./src/routes/clients');
const projectsRoutes = require('./src/routes/projects');
const proveedoresRoutes = require('./src/routes/proveedores');
const cuentasPagarRoutes = require('./src/routes/cuentasPagar');
const cuentasCobrarRoutes = require('./src/routes/cuentasCobrar');
const contabilidadRoutes = require('./src/routes/contabilidad');
const impuestosIMSSRoutes = require('./src/routes/impuestosIMSS');
const categoriasRoutes = require('./src/routes/categorias');
const recuperacionRoutes = require('./src/routes/recuperacion');
const rolesRoutes = require('./src/routes/roles');
const assetsRoutes = require('./src/routes/assets');
const phasesRoutes = require('./src/routes/phases');
const costosFijosRoutes = require('./src/routes/costosFijos');
const projectCostsRoutes = require('./src/routes/projectCosts');
const emitidasRoutes = require('./src/routes/emitidas');
const flowRecoveryV2Routes = require('./src/routes/flowRecoveryV2');
const moneyFlowRecoveryRoutes = require('./src/routes/moneyFlowRecovery');
const complementosPagoRoutes = require('./src/routes/complementosPago');

// Nueva ruta para Cotizaciones
const cotizacionesRoutes = require('./src/routes/cotizaciones');

// Nueva ruta para Seguridad
const securityRoutes = require('./src/routes/security');

// Nueva ruta para Registro de Usuarios
const userRegistrationRoutes = require('./src/routes/userRegistration');

// Nueva ruta para Gestión de Roles
const roleManagementRoutes = require('./src/routes/roleManagement');

// Nueva ruta para Dashboard
const dashboardRoutes = require('./routes/dashboard');

// Middleware para loggear cada solicitud (opcional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Prefijo "/api" para las rutas

// Ruta de health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

app.use('/api/auth', authRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clients', clientsRoutes);

// Middleware de debug ESPECÍFICO para /api/projects
app.use('/api/projects', (req, res, next) => {
  if (req.method === 'PUT') {
    console.log('🔍 ROUTE MIDDLEWARE - Body ANTES de entrar a la ruta:', req.body);
    console.log('🔍 ROUTE MIDDLEWARE - Tipo de body:', typeof req.body);
    console.log('🔍 ROUTE MIDDLEWARE - Keys del body:', Object.keys(req.body));
  }
  next();
}, projectsRoutes);

// Middleware de debug ESPECÍFICO para /api/flowRecoveryV2
app.use('/api/flowRecoveryV2', (req, res, next) => {
  console.log('🔍 FLOW RECOVERY V2 MIDDLEWARE - Método:', req.method);
  console.log('🔍 FLOW RECOVERY V2 MIDDLEWARE - URL:', req.url);
  console.log('🔍 FLOW RECOVERY V2 MIDDLEWARE - Body:', req.body);
  console.log('🔍 FLOW RECOVERY V2 MIDDLEWARE - Headers:', req.headers);
  console.log('🔍 FLOW RECOVERY V2 MIDDLEWARE - Query:', req.query);
  console.log('🔍 FLOW RECOVERY V2 MIDDLEWARE - Params:', req.params);
  next();
}, flowRecoveryV2Routes);

// Middleware de debug ESPECÍFICO para /api/moneyFlowRecovery
app.use('/api/moneyFlowRecovery', (req, res, next) => {
  console.log('🔍 MONEY FLOW RECOVERY MIDDLEWARE - Método:', req.method);
  console.log('🔍 MONEY FLOW RECOVERY MIDDLEWARE - URL:', req.url);
  console.log('🔍 MONEY FLOW RECOVERY MIDDLEWARE - Body:', req.body);
  console.log('🔍 MONEY FLOW RECOVERY MIDDLEWARE - Headers:', req.headers);
  console.log('🔍 MONEY FLOW RECOVERY MIDDLEWARE - Query:', req.query);
  console.log('🔍 MONEY FLOW RECOVERY MIDDLEWARE - Params:', req.params);
  next();
}, moneyFlowRecoveryRoutes);

app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/cuentas-pagar', cuentasPagarRoutes);
app.use('/api/cuentas-cobrar', cuentasCobrarRoutes);
app.use('/api/contabilidad', contabilidadRoutes);
app.use('/api/impuestos-imss', impuestosIMSSRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/recuperacion', recuperacionRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/phases', phasesRoutes);
app.use('/api/costos-fijos', costosFijosRoutes);

app.use('/api/project-costs', projectCostsRoutes);
app.use('/api/emitidas', emitidasRoutes);
app.use('/api/flowRecoveryV2', flowRecoveryV2Routes);
app.use('/api/moneyFlowRecovery', moneyFlowRecoveryRoutes);
app.use('/api/complementos-pago', complementosPagoRoutes);

// Nueva ruta de cotizaciones
app.use('/api/cotizaciones', cotizacionesRoutes);

// Nueva ruta de seguridad
app.use('/api/security', securityRoutes);

// Nueva ruta de registro de usuarios
app.use('/api/user-registration', userRegistrationRoutes);

// Ruta para gestión de roles y permisos
app.use('/api/role-management', roleManagementRoutes);

// Ruta para el dashboard
app.use('/api/dashboard', dashboardRoutes);



// Configurar middlewares de manejo de errores
app.use(notFoundHandler);
app.use(methodNotAllowedHandler);
app.use(errorHandler);

// Iniciar el servidor
const PORT = process.env.PORT || 5001;
const server = app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌐 API disponible en: http://localhost:${PORT}/api`);
  console.log(`📊 Health check en: http://localhost:${PORT}/api/health`);
});

// =====================================================
// CONFIGURACIÓN DE ESTABILIDAD Y MANEJO DE SEÑALES
// =====================================================

// Manejo de señales para cierre graceful
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM recibido, cerrando servidor gracefulmente...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT recibido, cerrando servidor gracefulmente...');
  server.close(() => {
    console.log('✅ Servidor cerrado exitosamente');
    process.exit(0);
  });
});

// Manejo de errores no capturados
process.on('uncaughtException', (error) => {
  console.error('❌ Error no capturado:', error);
  server.close(() => {
    console.log('🛑 Servidor cerrado debido a error no capturado');
    process.exit(1);
  });
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Promesa rechazada no manejada:', reason);
  server.close(() => {
    console.log('🛑 Servidor cerrado debido a promesa rechazada');
    process.exit(1);
  });
});

// Configuración de timeouts del servidor
server.keepAliveTimeout = 65000; // 65 segundos
server.headersTimeout = 66000;    // 66 segundos

console.log('🚀 Servidor configurado con manejo de señales y timeouts');
