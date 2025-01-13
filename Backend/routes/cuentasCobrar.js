// routes/cuentasCobrar.js
const express = require('express');
const router = express.Router();
const cuentasCobrarController = require('../controllers/cuentasCobrarController');

router.get('/', cuentasCobrarController.getAllCuentasCobrar);
router.get('/:id', cuentasCobrarController.getCuentaCobrarById);
router.post('/', cuentasCobrarController.createCuentaCobrar);
router.put('/:id', cuentasCobrarController.updateCuentaCobrar);
router.delete('/:id', cuentasCobrarController.deleteCuentaCobrar);

module.exports = router;
