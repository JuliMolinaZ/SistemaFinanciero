const express = require('express');
const router = express.Router();
const complementosPagoController = require('../controllers/complementosPagoController');

// Ruta para obtener complementos de una cuenta
router.get('/:cuentaId', complementosPagoController.getComplementosByCuenta);

// Ruta para crear un complemento para una cuenta
router.post('/:cuentaId', complementosPagoController.createComplemento);

// Ruta para actualizar un complemento (opcional)
router.put('/:id', complementosPagoController.updateComplemento);

// Ruta para eliminar un complemento
router.delete('/:id', complementosPagoController.deleteComplemento);

module.exports = router;