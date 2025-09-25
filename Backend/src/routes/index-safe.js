const express = require('express');
const router = express.Router();

// Función para importar rutas de forma segura
const safeRequire = (path, routeName) => {
  try {
    return require(path);
  } catch (error) {

    // Retornar un router vacío
    const emptyRouter = express.Router();
    emptyRouter.get('/', (req, res) => {
      res.status(501).json({
        error: 'Endpoint no disponible',
        message: `La ruta ${routeName} no está implementada aún`,
        timestamp: new Date().toISOString()
      });
    });
    return emptyRouter;
  }
};

// Importar todas las rutas de forma segura

const authRoutes = safeRequire('./auth', 'auth');
const userRoutes = safeRequire('./usuarios', 'usuarios');
const clientRoutes = safeRequire('./clients', 'clients');
const projectRoutes = safeRequire('./projects', 'projects');
const providerRoutes = safeRequire('./proveedores', 'proveedores');
const cuentaPagarRoutes = safeRequire('./cuentasPagar', 'cuentasPagar');
const cuentaCobrarRoutes = safeRequire('./cuentasCobrar', 'cuentasCobrar');
const contabilidadRoutes = safeRequire('./contabilidad', 'contabilidad');
const categoriaRoutes = safeRequire('./categorias', 'categorias');
const phaseRoutes = safeRequire('./phases', 'phases');
const costoFijoRoutes = safeRequire('./costosFijos', 'costosFijos');
const cotizacionRoutes = safeRequire('./cotizaciones', 'cotizaciones');
const assetRoutes = safeRequire('./assets', 'assets');
const complementoPagoRoutes = safeRequire('./complementosPago', 'complementosPago');
const emitidaRoutes = safeRequire('./emitidas', 'emitidas');

const flowRecoveryRoutes = require('./flowRecoveryV2');

const permisoRoutes = safeRequire('./permisos', 'permisos');
const recuperacionRoutes = safeRequire('./recuperacion', 'recuperacion');
const rolRoutes = safeRequire('./roles', 'roles');
const securityRoutes = safeRequire('./security', 'security');
const managementProjectsRoutes = safeRequire('./managementProjects', 'managementProjects');
const managementTasksRoutes = safeRequire('./managementTasks', 'managementTasks');
const testTaskNotificationsRoutes = safeRequire('./testTaskNotifications', 'testTaskNotifications');
const testUserTasksRoutes = safeRequire('./testUserTasks', 'testUserTasks');
const notificationsRoutes = safeRequire('./notifications', 'notifications');

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/proveedores', providerRoutes);
router.use('/cuentas-pagar', cuentaPagarRoutes);
router.use('/cuentas-cobrar', cuentaCobrarRoutes);
router.use('/contabilidad', contabilidadRoutes);
router.use('/categorias', categoriaRoutes);
router.use('/phases', phaseRoutes);
router.use('/costos-fijos', costoFijoRoutes);
router.use('/cotizaciones', cotizacionRoutes);
router.use('/assets', assetRoutes);
router.use('/complementos-pago', complementoPagoRoutes);
router.use('/emitidas', emitidaRoutes);
router.use('/flow-recovery', flowRecoveryRoutes);
router.use('/permisos', permisoRoutes);
router.use('/recuperacion', recuperacionRoutes);
router.use('/roles', rolRoutes);
router.use('/security', securityRoutes);
router.use('/management-projects', managementProjectsRoutes);
router.use('/management-tasks', managementTasksRoutes);
router.use('/test-task-notifications', testTaskNotificationsRoutes);
router.use('/test-user-tasks', testUserTasksRoutes);
router.use('/notifications', notificationsRoutes);

// Ruta de salud del sistema
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '1.0.0'
  });
});

// Ruta de información del sistema
router.get('/info', (req, res) => {
  res.json({
    name: 'Sistema Financiero API',
    description: 'API para gestión financiera y contable',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    database: 'MySQL + Prisma',
    features: [
      'Autenticación JWT + Firebase',
      'Gestión de usuarios y roles',
      'Gestión de clientes y proveedores',
      'Gestión de proyectos',
      'Cuentas por pagar y cobrar',
      'Contabilidad',
      'Logs de auditoría',
      'Sistema de seguridad'
    ]
  });
});

module.exports = router; 