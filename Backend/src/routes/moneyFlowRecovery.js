// Backend/routes/moneyFlowRecovery.js
const express = require('express');
const router = express.Router();
const moneyFlowRecoveryController = require('../controllers/moneyFlowRecoveryController');

// Rutas básicas CRUD
router.get('/', (req, res, next) => {

  next();
}, moneyFlowRecoveryController.getAllMoneyFlowRecovery);

router.get('/:id', moneyFlowRecoveryController.getMoneyFlowRecoveryById);
router.post('/', moneyFlowRecoveryController.createMoneyFlowRecovery);
router.put('/:id', moneyFlowRecoveryController.updateMoneyFlowRecovery);
router.delete('/:id', moneyFlowRecoveryController.deleteMoneyFlowRecovery);

module.exports = router;
