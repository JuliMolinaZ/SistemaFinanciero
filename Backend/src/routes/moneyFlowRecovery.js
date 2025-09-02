// Backend/routes/moneyFlowRecovery.js
const express = require('express');
const router = express.Router();
const moneyFlowRecoveryController = require('../controllers/moneyFlowRecoveryController');

console.log('🚀 Cargando rutas de moneyFlowRecovery...');
console.log('📋 Controlador cargado:', Object.keys(moneyFlowRecoveryController));

// Rutas básicas CRUD
router.get('/', (req, res, next) => {
  console.log('🔍 GET / recibido en moneyFlowRecovery');
  next();
}, moneyFlowRecoveryController.getAllMoneyFlowRecovery);

router.get('/:id', moneyFlowRecoveryController.getMoneyFlowRecoveryById);
router.post('/', moneyFlowRecoveryController.createMoneyFlowRecovery);
router.put('/:id', moneyFlowRecoveryController.updateMoneyFlowRecovery);
router.delete('/:id', moneyFlowRecoveryController.deleteMoneyFlowRecovery);

console.log('✅ Rutas de moneyFlowRecovery configuradas');

module.exports = router;
