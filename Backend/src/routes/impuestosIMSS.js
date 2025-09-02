// routes/impuestosIMSS.js
const express = require('express');
const router = express.Router();
const impuestosIMSSController = require('../controllers/impuestosIMSSController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { impuestosIMSSSchemas } = require('../validations/schemas');

// Rutas de exportación y estadísticas
router.get('/export', impuestosIMSSController.exportarImpuestosIMSSCSV);
router.get('/stats', impuestosIMSSController.getEstadisticasImpuestosIMSS);

// Rutas CRUD principales
router.get('/', impuestosIMSSController.getAllImpuestosIMSS);
router.get('/:id', validateId, impuestosIMSSController.getImpuestoIMSSById);
router.post('/', validateWithJoi(impuestosIMSSSchemas.create), impuestosIMSSController.createImpuestoIMSS);
router.put('/:id', validateId, validateWithJoi(impuestosIMSSSchemas.update), impuestosIMSSController.updateImpuestoIMSS);
router.delete('/:id', validateId, impuestosIMSSController.deleteImpuestoIMSS);

module.exports = router;
