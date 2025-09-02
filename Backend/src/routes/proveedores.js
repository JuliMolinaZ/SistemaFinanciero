// routes/proveedores.js
const express = require('express');
const router = express.Router();
const proveedorController = require('../controllers/proveedorController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { providerSchemas } = require('../validations/schemas');

router.get('/', proveedorController.getAllProveedores);
router.get('/:id', validateId, proveedorController.getProveedorById);
router.post('/', validateWithJoi(providerSchemas.create), proveedorController.createProveedor);
router.put('/:id', validateId, validateWithJoi(providerSchemas.update), proveedorController.updateProveedor);
router.delete('/:id', validateId, proveedorController.deleteProveedor);

module.exports = router;
