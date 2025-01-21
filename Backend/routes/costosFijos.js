// routes/costosFijos.js
const express = require('express');
const costosFijosController = require('../controllers/costosFijosController');
const router = express.Router();

router.get('/', costosFijosController.getCostosFijos);
router.post('/', costosFijosController.createCostoFijo);
router.put('/:id', costosFijosController.updateCostoFijo);
router.delete('/:id', costosFijosController.deleteCostoFijo);

module.exports = router;






