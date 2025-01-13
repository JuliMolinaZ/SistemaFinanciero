// routes/recuperacion.js
const express = require('express');
const router = express.Router();
const recuperacionController = require('../controllers/recuperacionController');

router.get('/', recuperacionController.getAllRecuperaciones);
router.get('/:id', recuperacionController.getRecuperacionById);
router.post('/', recuperacionController.createRecuperacion);
router.put('/:id', recuperacionController.updateRecuperacion);
router.delete('/:id', recuperacionController.deleteRecuperacion);

module.exports = router;