// routes/permisos.js - VERSIÓN COMPLETA CON CRUD
const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permisosController');

// Rutas CRUD para permisos
router.get('/', permisosController.getPermisos);
router.post('/', permisosController.createPermiso);
router.put('/:id', permisosController.updatePermiso);
router.delete('/:id', permisosController.deletePermiso);

module.exports = router;

