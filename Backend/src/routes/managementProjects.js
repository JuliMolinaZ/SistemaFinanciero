const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
} = require('../controllers/managementProjectControllerNew');

// ========================================
// RUTAS DE GESTIÓN DE PROYECTOS (PM)
// ========================================

// Obtener todos los proyectos de gestión
router.get('/', getAllProjects);

// Obtener un proyecto de gestión por ID
router.get('/:id', getProjectById);

// Crear un nuevo proyecto de gestión
router.post('/', createProject);

// Actualizar un proyecto de gestión
router.put('/:id', updateProject);

// Eliminar un proyecto de gestión
router.delete('/:id', deleteProject);

// ========================================
// RUTAS DE MIEMBROS DE PROYECTOS
// ========================================

// Agregar miembro a un proyecto
router.post('/:id/members', addProjectMember);

// Remover miembro de un proyecto
router.delete('/:id/members/:memberId', removeProjectMember);

module.exports = router;
