// src/routes/cotizaciones.js
const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizacionesController');
const upload = require('../middlewares/uploadMiddleware'); // Configurado con multer
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { cotizacionSchemas } = require('../validations/schemas');

// Crear cotización (con archivo PDF)
router.post('/', upload.single('documento'), validateWithJoi(cotizacionSchemas.create), cotizacionesController.createCotizacion);

// Listar todas las cotizaciones
router.get('/', cotizacionesController.getAllCotizaciones);

// Obtener una cotización por ID
router.get('/:id', validateId, cotizacionesController.getCotizacionById);

// Actualizar cotización (posiblemente con un nuevo archivo)
router.put('/:id', validateId, upload.single('documento'), validateWithJoi(cotizacionSchemas.update), cotizacionesController.updateCotizacion);

// Eliminar cotización
router.delete('/:id', validateId, cotizacionesController.deleteCotizacion);

module.exports = router;
