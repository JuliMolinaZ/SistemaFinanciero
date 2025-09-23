// 🎯 MANAGEMENT TASKS ROUTES - RUTAS DE TAREAS
// ============================================

const express = require('express');
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getAvailableUsers
} = require('../controllers/managementTaskController');

// 🔍 GET /api/management-tasks/project/:projectId - Obtener tareas de un proyecto
router.get('/project/:projectId', getTasksByProject);

// 👥 GET /api/management-tasks/project/:projectId/users - Obtener usuarios disponibles
router.get('/project/:projectId/users', getAvailableUsers);

// ✨ POST /api/management-tasks - Crear nueva tarea
router.post('/', createTask);

// ✏️ PUT /api/management-tasks/:taskId - Actualizar tarea
router.put('/:taskId', updateTask);

// 🗑️ DELETE /api/management-tasks/:taskId - Eliminar tarea
router.delete('/:taskId', deleteTask);

module.exports = router;