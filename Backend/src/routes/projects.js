// routes/projects.js
const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { projectSchemas } = require('../validations/schemas');
const Joi = require('joi');

router.get('/', projectController.getAllProjects);
router.get('/:id', validateId, projectController.getProjectById);
router.post('/', validateWithJoi(projectSchemas.create), projectController.createProject);
router.put('/:id', validateId, validateWithJoi(projectSchemas.update), projectController.updateProject);
router.put('/:projectId/phase', validateId, validateWithJoi(Joi.object({ phaseId: Joi.number().integer().positive().required() })), projectController.updateProjectPhase);
router.delete('/:id', validateId, projectController.deleteProject);

module.exports = router;
