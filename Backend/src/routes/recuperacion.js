// routes/recuperacion.js
const express = require('express');
const router = express.Router();
const recuperacionController = require('../controllers/recuperacionController');

router.get('/', recuperacionController.getAllRecuperaciones);
router.get('/:id', recuperacionController.getRecuperacionById);

// Añadir middleware de depuración para POST
router.post('/', (req, res, next) => {

  next();
}, recuperacionController.createRecuperacion);

router.put('/:id', recuperacionController.updateRecuperacion);
router.delete('/:id', recuperacionController.deleteRecuperacion);
router.put('/:id/toggle', recuperacionController.toggleRecuperado);

module.exports = router;
