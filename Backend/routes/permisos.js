// routes/permisos.js
const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permisosController');

// Rutas de permisos
router.get('/', permisosController.getPermisos); // Obtener todos los permisos
router.put('/:modulo', permisosController.updatePermiso); // Actualizar permisos para un módulo específico

module.exports = router;




