// routes/phases.js
const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { phaseSchemas } = require('../validations/schemas');

// Obtener todas las fases
router.get('/', phaseController.getAllPhases);
router.post('/', validateWithJoi(phaseSchemas.create), phaseController.createPhase);
router.put('/:id', validateId, validateWithJoi(phaseSchemas.update), phaseController.updatePhase);
router.delete('/:id', validateId, phaseController.deletePhase);

module.exports = router;
