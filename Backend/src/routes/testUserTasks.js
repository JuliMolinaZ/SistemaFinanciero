// 🧪 TEST USER TASKS ROUTES - RUTA DE PRUEBA PARA TAREAS DE USUARIO
// ================================================================

const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔍 GET /api/test-user-tasks/:userId - Obtener tareas de un usuario (TEST)
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Primero ver qué tareas existen en total
    const allTasks = await prisma.$queryRaw`
      SELECT COUNT(*) as total FROM management_tasks
    `;

    // Ver tareas asignadas a este usuario específico
    const userTasks = await prisma.$queryRaw`
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.assigned_to,
        t.due_date,
        t.created_at,
        t.project_id,
        u.name as assignee_name
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.assigned_to = ${parseInt(userId)}
      ORDER BY t.created_at DESC
    `;

    res.json({
      success: true,
      data: userTasks,
      total: userTasks.length,
      debug: {
        userId: parseInt(userId),
        totalTasksInDB: allTasks[0]?.total || 0,
        userTasksFound: userTasks.length
      },
      message: `TEST: Tareas del usuario ${userId}`
    });

  } catch (error) {
    console.error('🧪 TEST ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Error en prueba',
      error: error.message
    });
  }
});

module.exports = router;