// routes/permisos.js
const express = require('express');
const router = express.Router();
const permisosController = require('../controllers/permisosController');

router.get('/', permisosController.getPermisos);
router.put('/:id', permisosController.updatePermiso);

module.exports = router;





