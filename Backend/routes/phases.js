// routes/phases.js
const express = require('express');
const router = express.Router();
const phaseController = require('../controllers/phaseController');

// Obtener todas las fases
router.get('/', phaseController.getAllPhases);

module.exports = router;
