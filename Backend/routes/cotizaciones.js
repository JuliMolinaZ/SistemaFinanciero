// src/routes/cotizaciones.js
const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizacionesController');
const upload = require('../middlewares/uploadMiddleware'); // Configurado con multer

// Crear cotización (con archivo PDF)
router.post('/', upload.single('documento'), cotizacionesController.createCotizacion);

// Listar cotizaciones
router.get('/', cotizacionesController.getCotizaciones);

// Actualizar cotización (posiblemente con un nuevo archivo)
router.put('/:id', upload.single('documento'), cotizacionesController.updateCotizacion);

// Eliminar cotización
router.delete('/:id', cotizacionesController.deleteCotizacion);

module.exports = router;
