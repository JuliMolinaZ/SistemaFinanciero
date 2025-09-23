// server.js
const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config({ path: './config.env' });

// Inicializar Firebase Admin SDK
const { initializeFirebase } = require('./src/config/firebase');
try {
  initializeFirebase();
  console.log('✅ Firebase Admin SDK inicializado correctamente');
} catch (error) {
  console.error('❌ Error inicializando Firebase Admin SDK:', error.message);
  console.log('⚠️ Continuando sin Firebase Admin SDK...');
}

const app = express();

// Configuración de CORS que FUNCIONA PERFECTAMENTE
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept', 'x-firebase-token'],
  optionsSuccessStatus: 200
}));

// Middleware de logging para debug CORS
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  console.log(`🔍 Headers recibidos:`, req.headers);
  if (req.method === 'OPTIONS') {
    console.log('🔍 OPTIONS request detected - CORS preflight');
    console.log('🔍 Access-Control-Request-Method:', req.headers['access-control-request-method']);
    console.log('🔍 Access-Control-Request-Headers:', req.headers['access-control-request-headers']);
  }
  next();
});

app.use(bodyParser.json());

// Health check endpoint (después de CORS y bodyParser)
app.get('/api/health', (req, res) => {
  console.log('✅ Health check endpoint called');
  res.status(200).json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 5555,
    cors: 'enabled'
  });
});

// Test endpoint muy básico
console.log('🧪 REGISTRANDO ENDPOINT /test...');
app.get('/test', (req, res) => {
  console.log('🧪 TEST endpoint called');
  res.json({ message: 'Test endpoint works!' });
});
console.log('✅ ENDPOINT /test REGISTRADO');

// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const authRoutes = require('./src/routes/auth');
const permisosRoutes = require('./src/routes/permisos');
const usuariosRoutes = require('./src/routes/usuarios');
const userRegistrationRoutes = require('./src/routes/userRegistration');
const clientsRoutes = require('./src/routes/clients');
const projectsRoutes = require('./src/routes/projects');
const proveedoresRoutes = require('./src/routes/proveedores');
const cuentasPagarRoutes = require('./src/routes/cuentasPagar');
const cuentasCobrarRoutes = require('./src/routes/cuentasCobrar');
const contabilidadRoutes = require('./src/routes/contabilidad');
const categoriasRoutes = require('./src/routes/categorias');
const recuperacionRoutes = require('./src/routes/recuperacion');
const rolesRoutes = require('./src/routes/roles');
const assetsRoutes = require('./src/routes/assets');
const phasesRoutes = require('./src/routes/phases');
const costosFijosRoutes = require('./src/routes/costosFijos');
const projectCostsRoutes = require('./src/routes/projectCosts');
const emitidasRoutes = require('./src/routes/emitidas');
const flowRecoveryV2Routes = require('./src/routes/flowRecoveryV2');
const complementosPagoRoutes = require('./src/routes/complementosPago');
const requisicionesRoutes = require('./routes/requisiciones');

// Nueva ruta para Cotizaciones
const cotizacionesRoutes = require('./src/routes/cotizaciones');

// Rutas del módulo de gestión de proyectos
const projectManagementRoutes = require('./src/routes/projectManagementSimple');
const managementTasksRoutes = require('./src/routes/managementTasks');

// Middleware para loggear cada solicitud (opcional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  
  // Log detallado para peticiones PUT a management-projects
  if (req.method === 'PUT' && req.url.includes('/api/management-projects/')) {
    console.log('🔍 PUT REQUEST DEBUG:');
    console.log('  - URL:', req.url);
    console.log('  - Content-Type:', req.headers['content-type']);
    console.log('  - Content-Length:', req.headers['content-length']);
    console.log('  - Body preview:', req.body);
  }
  
  next();
});

// Prefijo "/api" para las rutas
app.use('/api/auth', authRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/user-registration', userRegistrationRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/cuentas-pagar', cuentasPagarRoutes);
app.use('/api/cuentas-cobrar', cuentasCobrarRoutes);
app.use('/api/contabilidad', contabilidadRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/recuperacion', recuperacionRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/phases', phasesRoutes);
app.use('/api/costos-fijos', costosFijosRoutes);
// app.use('/api/graph', graphRoutes); // Ruta no disponible
app.use('/api/project-costs', projectCostsRoutes);
app.use('/api/emitidas', emitidasRoutes);
app.use('/api/flowRecoveryV2', flowRecoveryV2Routes);
app.use('/api/complementos-pago', complementosPagoRoutes);
app.use('/api/requisiciones', requisicionesRoutes);

// Nueva ruta de cotizaciones
app.use('/api/cotizaciones', cotizacionesRoutes);

// Rutas del módulo de gestión de proyectos
console.log('🚀 Cargando rutas de gestión de proyectos...');
app.use('/api/project-management', projectManagementRoutes);
app.use('/api/management-projects', require('./src/routes/managementProjects'));
app.use('/api/management-tasks', managementTasksRoutes);
console.log('✅ Rutas de gestión de proyectos configuradas');

// Rutas de usuarios
console.log('🚀 Cargando rutas de usuarios...');
app.use('/api/users', require('./src/routes/users'));
app.use('/api/permissions', require('./src/routes/permissions'));

// Rutas de prueba temporal
const { testDatabaseConnection, configureDevOperatorPermissionsSimple } = require('./src/controllers/testPermissionsController');
app.get('/api/test-db', testDatabaseConnection);
app.post('/api/test-permissions', configureDevOperatorPermissionsSimple);
console.log('✅ Rutas de usuarios configuradas');

// Ruta temporal que funciona (bypass de problemas de Prisma)
const projectsWorkingRoutes = require('./src/routes/projectsWorking');
app.use('/api/projects-working', projectsWorkingRoutes);
console.log('✅ Rutas temporales de proyectos configuradas');

// Ruta de prueba directa
app.get('/api/project-management/test-direct', (req, res) => {
  res.json({ message: 'Ruta de prueba directa funcionando' });
});

// Ruta temporal de usuarios para testing
app.get('/api/users', async (req, res) => {
  try {
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    });
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
});

// Ruta 404 para solicitudes no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('🚨 ERROR CAPTURADO:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('Request URL:', req.url);
  console.error('Request method:', req.method);
  console.error('Request headers:', req.headers);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 8765;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en el puerto ${PORT}`);
  console.log(`🌐 URL: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/api/health`);
});
