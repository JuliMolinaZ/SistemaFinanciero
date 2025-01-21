const express = require('express');
const router = express.Router();
const realtimeGraphController = require('../controllers/realtimeGraphController');

// Ruta para obtener los datos del gráfico en tiempo real
router.get('/', realtimeGraphController.getGraphData);

module.exports = router;


