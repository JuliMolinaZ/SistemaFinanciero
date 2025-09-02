const express = require('express');
const router = express.Router();

// Importar todas las rutas
const authRoutes = require('./auth');
const userRoutes = require('./usuarios');
const clientRoutes = require('./clients');
const projectRoutes = require('./projects');
const providerRoutes = require('./proveedores');
const cuentaPagarRoutes = require('./cuentasPagar');
const cuentaCobrarRoutes = require('./cuentasCobrar');
const contabilidadRoutes = require('./contabilidad');
const categoriaRoutes = require('./categorias');
const phaseRoutes = require('./phases');
const costoFijoRoutes = require('./costosFijos');
const cotizacionRoutes = require('./cotizaciones');
const assetRoutes = require('./assets');
const complementoPagoRoutes = require('./complementosPago');
const emitidaRoutes = require('./emitidas');
const flowRecoveryRoutes = require('./flowRecoveryV2');
const permisoRoutes = require('./permisos');
const recuperacionRoutes = require('./recuperacion');
const rolRoutes = require('./roles');
const securityRoutes = require('./security');

// Configurar rutas
router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/clients', clientRoutes);
router.use('/projects', projectRoutes);
router.use('/providers', providerRoutes);
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