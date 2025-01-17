// routes/contabilidad.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const contabilidadController = require('../controllers/contabilidadController');

// Configuración de Multer para almacenar archivos en la carpeta 'uploads/'
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function(req, file, cb) {
    // Generar un nombre único para el archivo
    cb(null, Date.now() + '-' + file.originalname);
  }
});
const upload = multer({ storage: storage });

// Rutas con middleware de multer para manejar archivos en POST y PUT
router.get('/', contabilidadController.getAllMovimientos);
router.get('/:id', contabilidadController.getMovimientoById);
router.post(
  '/', 
  upload.fields([{ name: 'facturaPDF' }, { name: 'facturaXML' }]), 
  contabilidadController.createMovimiento
);
router.put(
  '/:id', 
  upload.fields([{ name: 'facturaPDF' }, { name: 'facturaXML' }]), 
  contabilidadController.updateMovimiento
);
router.delete('/:id', contabilidadController.deleteMovimiento);

// Rutas adicionales según sea necesario
module.exports = router;
