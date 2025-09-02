// routes/costosFijos.js
const express = require('express');
const costosFijosController = require('../controllers/costosFijosController');
const router = express.Router();
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { costoFijoSchemas } = require('../validations/schemas');

router.get('/', costosFijosController.getCostosFijos);
router.post('/', validateWithJoi(costoFijoSchemas.create), costosFijosController.createCostoFijo);
router.put('/:id', validateId, validateWithJoi(costoFijoSchemas.update), costosFijosController.updateCostoFijo);
router.delete('/:id', validateId, costosFijosController.deleteCostoFijo);

// Nueva ruta para enviar a cuentas por pagar
router.post('/:id/enviar', validateId, costosFijosController.enviarACuentasPagar);

module.exports = router;
