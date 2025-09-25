// 🎯 MANAGEMENT TASKS ROUTES - RUTAS DE TAREAS
// ============================================

const express = require('express');
const router = express.Router();
const {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getAvailableUsers,
  testEmailNotification
} = require('../controllers/managementTaskController');

// Importar middleware de autenticación
const { verifyAuth } = require('../middlewares/auth');

const { getTasksByUser, getRealTasksByUser, getAllTasksDebug } = require('../controllers/managementTaskControllerV2');

// 🔍 GET /api/management-tasks/project/:projectId - Obtener tareas de un proyecto
router.get('/project/:projectId', getTasksByProject);

// 👤 GET /api/management-tasks/user/:userId - Obtener tareas de un usuario
router.get('/user/:userId', getTasksByUser);

// 🎯 GET /api/management-tasks/real/user/:userId - Obtener tareas reales del sistema principal
router.get('/real/user/:userId', getRealTasksByUser);

// 👥 GET /api/management-tasks/project/:projectId/users - Obtener usuarios disponibles
router.get('/project/:projectId/users', getAvailableUsers);

// ✨ POST /api/management-tasks - Crear nueva tarea
router.post('/', verifyAuth, createTask);

// ✏️ PUT /api/management-tasks/:taskId - Actualizar tarea
router.put('/:taskId', verifyAuth, updateTask);

// 🗑️ DELETE /api/management-tasks/:taskId - Eliminar tarea
router.delete('/:taskId', verifyAuth, deleteTask);

// 🧪 POST /api/management-tasks/test-email - Probar envío de email
router.post('/test-email', testEmailNotification);

// 🧪 GET /api/management-tasks/debug/all - Ver todas las tareas en BD
router.get('/debug/all', getAllTasksDebug);

module.exports = router;