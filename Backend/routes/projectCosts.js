const express = require('express');
const router = express.Router();
const projectCostsController = require('../controllers/projectCostsController');

router.get('/:projectId', projectCostsController.getCostsByProjectId);
router.post('/:projectId', projectCostsController.addCostToProject);
router.put('/project-costs/:costId', projectCostsController.updateCost);
router.delete('/project-costs/:costId', projectCostsController.deleteCost);


module.exports = router;
