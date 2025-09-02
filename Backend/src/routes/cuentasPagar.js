// routes/cuentasPagar.js
const express = require('express');
const router = express.Router();
const cuentasPagarController = require('../controllers/cuentasPagarController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { cuentaPagarSchemas, dateFilterSchema } = require('../validations/schemas');

router.get('/export', cuentasPagarController.exportarCuentasPagarCSV);
router.get('/stats', cuentasPagarController.getEstadisticasCuentasPagar);

router.get('/', cuentasPagarController.getAllCuentasPagar);
router.get('/:id', validateId, cuentasPagarController.getCuentaPagarById);
router.post('/', validateWithJoi(cuentaPagarSchemas.create), cuentasPagarController.createCuentaPagar);
router.put('/:id', validateId, validateWithJoi(cuentaPagarSchemas.update), cuentasPagarController.updateCuentaPagar);
router.delete('/:id', validateId, cuentasPagarController.deleteCuentaPagar);

module.exports = router;

