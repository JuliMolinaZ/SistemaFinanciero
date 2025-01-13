// routes/projects.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');

router.get('/', projectController.getAllProjects);
router.get('/:id', projectController.getProjectById);
router.post('/', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.put('/:projectId/phase', projectController.updateProjectPhase);
router.delete('/:id', projectController.deleteProject);

module.exports = router;
