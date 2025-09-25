// 🎯 MANAGEMENT TASK CONTROLLER V2 - CONTROLADOR DE TAREAS
// ========================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Obtener tareas asignadas a un usuario específico
 * Incluye tareas asignadas al usuario Y tareas creadas por el usuario que están en revisión
 */
const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Consulta que incluye:
    // 1. Tareas asignadas al usuario
    // 2. Tareas creadas por el usuario que están en estado 'review'
    const tasks = await prisma.$queryRaw`
      SELECT
        t.id,
        t.title,
        t.description,
        t.status,
        t.priority,
        t.assigned_to,
        t.due_date,
        t.created_at,
        t.updated_at,
        t.project_id,
        t.sprint_id,
        t.phase_id,
        t.created_by,
        u.name as assignee_name,
        u.email as assignee_email,
        p.nombre as project_name,
        COALESCE(creator.name, 'Sistema') as created_by_name,
        CASE 
          WHEN t.assigned_to = ${parseInt(userId)} THEN 'assigned'
          WHEN t.created_by = ${parseInt(userId)} AND t.status = 'review' THEN 'created_for_review'
          ELSE 'other'
        END as task_type
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN management_projects p ON t.project_id = p.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE (
        t.assigned_to = ${parseInt(userId)} 
        OR (t.created_by = ${parseInt(userId)} AND t.status = 'review')
      )
      ORDER BY 
        CASE 
          WHEN t.status = 'review' AND t.created_by = ${parseInt(userId)} THEN 0
          ELSE 1
        END,
        t.created_at DESC
    `;

    res.json({
      success: true,
      data: tasks,
      total: tasks.length,
      message: `Tareas del usuario obtenidas correctamente (incluye tareas en revisión creadas por el usuario)`
    });

  } catch (error) {
    console.error('❌ V2 - Error al obtener tareas del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener tareas reales del sistema principal (Task) asignadas a un usuario
 */
const getRealTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    // Consulta para obtener tareas del sistema principal usando Prisma ORM
    const tasks = await prisma.task.findMany({
      where: { assignee_id: parseInt(userId) },
      include: {
        assignee: {
          select: {
            name: true,
            email: true
          }
        },
        project: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Mapear los datos al formato esperado
    const mappedTasks = tasks.map(task => ({
      id: task.id,
      title: task.title,
      description: task.description,
      status: task.status,
      priority: task.priority,
      assigned_to: task.assignee_id,
      due_date: task.due_date,
      created_at: task.created_at,
      updated_at: task.updated_at,
      project_id: task.project_id,
      assignee_name: task.assignee?.name || null,
      assignee_email: task.assignee?.email || null,
      project_name: task.project?.name || null
    }));

    res.json({
      success: true,
      data: mappedTasks,
      total: mappedTasks.length,
      message: `Tareas reales del usuario obtenidas correctamente`
    });

  } catch (error) {
    console.error('❌ V2 - Error al obtener tareas reales del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Debug: Ver todas las tareas en la base de datos
 */
const getAllTasksDebug = async (req, res) => {
  try {

    const allTasks = await prisma.$queryRaw`
      SELECT
        t.id,
        t.title,
        t.assigned_to,
        t.status,
        u.name as assignee_name
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      ORDER BY t.created_at DESC
    `;

    allTasks.forEach(task => {

    });

    res.json({
      success: true,
      data: allTasks,
      total: allTasks.length,
      message: `DEBUG: Todas las tareas en la base de datos`
    });

  } catch (error) {
    console.error('❌ DEBUG ERROR:', error);
    res.status(500).json({
      success: false,
      message: 'Error en debug',
      error: error.message
    });
  }
};

module.exports = {
  getTasksByUser,
  getRealTasksByUser,
  getAllTasksDebug
};