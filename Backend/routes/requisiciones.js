const express = require('express');
const router = express.Router();
const requisicionesController = require('../controllers/requisicionesController');

// Ruta para crear una requisición
router.post('/', requisicionesController.createRequisicion);

// Ruta para obtener todas las requisiciones
router.get('/', requisicionesController.getRequisiciones);

// Ruta para actualizar una requisición
router.put('/:id', requisicionesController.updateRequisicion);

// Ruta para eliminar una requisición
router.delete('/:id', requisicionesController.deleteRequisicion);

module.exports = router;
