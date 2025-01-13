// routes/contabilidad.js
const express = require('express');
const router = express.Router();
const contabilidadController = require('../controllers/contabilidadController');

router.get('/', contabilidadController.getAllMovimientos);
router.get('/:id', contabilidadController.getMovimientoById);
router.post('/', contabilidadController.createMovimiento);
router.put('/:id', contabilidadController.updateMovimiento);
router.delete('/:id', contabilidadController.deleteMovimiento);

module.exports = router;
