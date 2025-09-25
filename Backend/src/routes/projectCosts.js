const express = require('express');
const router = express.Router();
const projectCostsController = require('../controllers/projectCostsController'); // Asegúrate de que la ruta es correcta

router.get('/:projectId', projectCostsController.getCostsByProjectId); // Verifica que `getCostsByProjectId` exista y esté exportado
router.post('/:projectId', projectCostsController.addCostToProject);
router.put('/:costId', projectCostsController.updateCost);
router.delete('/:costId', projectCostsController.deleteCost);

module.exports = router;

