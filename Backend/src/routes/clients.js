const express = require('express');
const router = express.Router();
const clientController = require('../controllers/clientController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { clientSchemas } = require('../validations/schemas');

router.get('/', clientController.getAllClients);
router.get('/stats', clientController.getClientStats);
router.get('/:id', validateId, clientController.getClientById);
router.post('/', validateWithJoi(clientSchemas.create), clientController.createClient);
router.put('/:id', validateId, validateWithJoi(clientSchemas.update), clientController.updateClient);
router.delete('/:id', validateId, clientController.deleteClient);

module.exports = router;
