// Controladores principales
const userController = require('./usuarioController');
const clientController = require('./clientController');
const projectController = require('./projectController');
const providerController = require('./proveedorController');

// Controladores de finanzas
const cuentaPagarController = require('./cuentasPagarController');
const cuentaCobrarController = require('./cuentasCobrarController');
const contabilidadController = require('./contabilidadController');

// Controladores de gestión
const categoriaController = require('./categoriasController');
const phaseController = require('./phaseController');
const costoFijoController = require('./costosFijosController');
const cotizacionController = require('./cotizacionesController');

// Controladores de seguridad
const authController = require('./authController');
const securityController = require('./securityController');

// Controladores adicionales
const assetController = require('./assetController');
const complementoPagoController = require('./complementosPagoController');
const emitidaController = require('./emitidasController');
const flowRecoveryController = require('./flowRecoveryV2Controller');
const permisoController = require('./permisosController');
const recuperacionController = require('./recuperacionController');
const rolController = require('./rolController');


module.exports = {
  // Controladores principales
  userController,
  clientController,
  projectController,
  providerController,
  
  // Controladores de finanzas
  cuentaPagarController,
  cuentaCobrarController,
  contabilidadController,
  
  // Controladores de gestión
  categoriaController,
  phaseController,
  costoFijoController,
  cotizacionController,
  
  // Controladores de seguridad
  authController,
  securityController,
  
  // Controladores adicionales
  assetController,
  complementoPagoController,
  emitidaController,
  flowRecoveryController,
  permisoController,
  recuperacionController,
  rolController,

}; 