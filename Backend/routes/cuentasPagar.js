// routes/cuentasPagar.js
const express = require('express');
const router = express.Router();
const cuentasPagarController = require('../controllers/cuentasPagarController');

router.get('/export', cuentasPagarController.exportCuentasPagarCSV);

router.get('/', cuentasPagarController.getAllCuentasPagar);
router.get('/:id', cuentasPagarController.getCuentaPagarById);
router.post('/', cuentasPagarController.createCuentaPagar);
router.put('/:id', cuentasPagarController.updateCuentaPagar);
router.put('/:id/pagado', cuentasPagarController.togglePagado);
router.delete('/:id', cuentasPagarController.deleteCuentaPagar);

module.exports = router;

