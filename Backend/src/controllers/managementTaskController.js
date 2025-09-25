// 🎯 MANAGEMENT TASK CONTROLLER - CONTROLADOR DE TAREAS
// =====================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { 
  sendTaskAssignmentNotification, 
  sendTaskStatusChangeNotification, 
  sendTaskCreatedNotification,
  sendTaskReviewNotification
} = require('../services/taskNotificationService');

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
        COALESCE(creator.name, 'Usuario del Sistema') as created_by_name,
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
    console.error('❌ Error al obtener tareas del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener todas las tareas de un proyecto
 */
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

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
        COALESCE(creator.name, 'Usuario del Sistema') as created_by_name
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN users creator ON t.created_by = creator.id
      WHERE t.project_id = ${parseInt(projectId)}
      ORDER BY t.created_at DESC
    `;

    // Agrupar tareas por estado
    const tasksByStatus = {
      todo: [],
      in_progress: [],
      review: [],
      done: []
    };

    tasks.forEach(task => {
      const taskData = {
        id: Number(task.id),
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        assigned_to: task.assigned_to ? Number(task.assigned_to) : null,
        due_date: task.due_date,
        created_at: task.created_at,
        updated_at: task.updated_at,
        project_id: Number(task.project_id),
        sprint_id: task.sprint_id ? Number(task.sprint_id) : null,
        phase_id: task.phase_id,
        created_by: task.created_by ? Number(task.created_by) : null,
        created_by_name: task.created_by_name,
        assignee: task.assigned_to ? {
          id: Number(task.assigned_to),
          name: task.assignee_name,
          email: task.assignee_email
        } : null
      };

      if (tasksByStatus[task.status]) {
        tasksByStatus[task.status].push(taskData);
      }
    });

    res.json({
      success: true,
      data: {
        tasks,
        tasksByStatus,
        total: tasks.length
      }
    });

  } catch (error) {
    console.error('❌ Error al obtener tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener tareas',
      error: error.message
    });
  }
};

/**
 * Crear una nueva tarea
 */
const createTask = async (req, res) => {
  try {
    // Obtener el usuario actual desde el token de autenticación
    const currentUser = req.user;
    if (!currentUser || !currentUser.firebase_uid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Buscar el usuario en la base de datos para obtener su ID
    const user = await prisma.user.findUnique({
      where: { firebase_uid: currentUser.firebase_uid },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en la base de datos'
      });
    }

    const {
      project_id,
      sprint_id,
      phase_id,
      title,
      description,
      priority = 'medium',
      assigned_to,
      due_date
    } = req.body;

    // Validar que el proyecto existe
    const project = await prisma.$queryRaw`
      SELECT id, nombre FROM management_projects 
      WHERE id = ${parseInt(project_id)} 
      LIMIT 1
    `;

    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Crear la tarea
    const newTask = await prisma.$queryRaw`
      INSERT INTO management_tasks (
        project_id, sprint_id, phase_id, title, description, 
        status, priority, assigned_to, due_date, created_by, created_at, updated_at
      ) VALUES (
        ${parseInt(project_id)},
        ${sprint_id ? parseInt(sprint_id) : null},
        ${phase_id || null},
        ${title},
        ${description || null},
        'todo',
        ${priority},
        ${assigned_to ? parseInt(assigned_to) : null},
        ${due_date ? new Date(due_date) : null},
        ${user.id},
        NOW(),
        NOW()
      )
    `;

    // Obtener la tarea creada con información del asignado
    const createdTask = await prisma.$queryRaw`
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
        u.name as assignee_name,
        u.email as assignee_email
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = LAST_INSERT_ID()
    `;

    const taskData = {
      id: Number(createdTask[0].id),
      title: createdTask[0].title,
      description: createdTask[0].description,
      status: createdTask[0].status,
      priority: createdTask[0].priority,
      assigned_to: createdTask[0].assigned_to ? Number(createdTask[0].assigned_to) : null,
      due_date: createdTask[0].due_date,
      created_at: createdTask[0].created_at,
      updated_at: createdTask[0].updated_at,
      project_id: Number(createdTask[0].project_id),
      sprint_id: createdTask[0].sprint_id ? Number(createdTask[0].sprint_id) : null,
      phase_id: createdTask[0].phase_id,
      assignee: createdTask[0].assigned_to ? {
        id: Number(createdTask[0].assigned_to),
        name: createdTask[0].assignee_name,
        email: createdTask[0].assignee_email
      } : null
    };

    // Enviar notificación por email si hay un usuario asignado
    if (taskData.assignee) {
      try {
        // Obtener información del proyecto
        const project = await prisma.$queryRaw`
          SELECT nombre FROM management_projects WHERE id = ${parseInt(project_id)} LIMIT 1
        `;
        
        if (project.length > 0) {

          await sendTaskAssignmentNotification(taskData, taskData.assignee, project[0]);
        }
      } catch (emailError) {

      }
    }

    res.status(201).json({
      success: true,
      data: taskData,
      message: 'Tarea creada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al crear tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear tarea',
      error: error.message
    });
  }
};

/**
 * Actualizar una tarea
 */
const updateTask = async (req, res) => {
  try {
    const { taskId } = req.params;
    const {
      title,
      description,
      status,
      priority,
      assigned_to,
      due_date,
      sprint_id,
      phase_id
    } = req.body;

    // Verificar que la tarea existe
    const existingTask = await prisma.$queryRaw`
      SELECT id FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
    `;

    if (existingTask.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Construir query de actualización dinámicamente
    const updateFields = [];
    const updateValues = [];

    if (title !== undefined) {
      updateFields.push('title = ?');
      updateValues.push(title);
    }
    if (description !== undefined) {
      updateFields.push('description = ?');
      updateValues.push(description);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (assigned_to !== undefined) {
      updateFields.push('assigned_to = ?');
      updateValues.push(assigned_to ? parseInt(assigned_to) : null);
    }
    if (due_date !== undefined) {
      updateFields.push('due_date = ?');
      updateValues.push(due_date ? new Date(due_date) : null);
    }
    if (sprint_id !== undefined) {
      updateFields.push('sprint_id = ?');
      updateValues.push(sprint_id ? parseInt(sprint_id) : null);
    }
    if (phase_id !== undefined) {
      updateFields.push('phase_id = ?');
      updateValues.push(phase_id || null);
    }

    updateFields.push('updated_at = NOW()');
    updateValues.push(parseInt(taskId));

    const updateQuery = `
      UPDATE management_tasks
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    await prisma.$executeRawUnsafe(updateQuery, ...updateValues);

    // Obtener la tarea actualizada
    const updatedTask = await prisma.$queryRaw`
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
        u.name as assignee_name,
        u.email as assignee_email
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      WHERE t.id = ${parseInt(taskId)}
    `;

    const taskData = {
      id: Number(updatedTask[0].id),
      title: updatedTask[0].title,
      description: updatedTask[0].description,
      status: updatedTask[0].status,
      priority: updatedTask[0].priority,
      assigned_to: updatedTask[0].assigned_to ? Number(updatedTask[0].assigned_to) : null,
      due_date: updatedTask[0].due_date,
      created_at: updatedTask[0].created_at,
      updated_at: updatedTask[0].updated_at,
      project_id: Number(updatedTask[0].project_id),
      sprint_id: updatedTask[0].sprint_id ? Number(updatedTask[0].sprint_id) : null,
      phase_id: updatedTask[0].phase_id,
      assignee: updatedTask[0].assigned_to ? {
        id: Number(updatedTask[0].assigned_to),
        name: updatedTask[0].assignee_name,
        email: updatedTask[0].assignee_email
      } : null
    };

    // Enviar notificaciones por email
    if (taskData.assignee) {
      try {
        // Obtener información del proyecto
        const project = await prisma.$queryRaw`
          SELECT nombre FROM management_projects WHERE id = ${parseInt(taskData.project_id)} LIMIT 1
        `;
        
        if (project.length > 0) {
          // Si cambió el estado, enviar notificación de cambio de estado
          if (status !== undefined) {
            // Obtener el estado anterior y el creador
            const oldTask = await prisma.$queryRaw`
              SELECT status, created_by FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
            `;
            
            if (oldTask.length > 0 && oldTask[0].status !== status) {
              // Notificar al usuario asignado sobre el cambio de estado
              await sendTaskStatusChangeNotification(
                taskData, 
                oldTask[0].status, 
                status, 
                taskData.assignee, 
                project[0]
              );

              // Si la tarea va a estado "review", notificar al creador
              if (status === 'review' && oldTask[0].created_by) {
                // Obtener información del creador
                const creator = await prisma.$queryRaw`
                  SELECT id, name, email FROM users WHERE id = ${parseInt(oldTask[0].created_by)} LIMIT 1
                `;
                
                if (creator.length > 0) {
                  await sendTaskReviewNotification(
                    taskData,
                    creator[0],
                    taskData.assignee,
                    project[0]
                  );
                }
              }
            }
          }
          
          // Si cambió la asignación, enviar notificación de asignación
          if (assigned_to !== undefined) {
            // Obtener el asignado anterior
            const oldTask = await prisma.$queryRaw`
              SELECT assigned_to FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
            `;
            
            // Solo enviar notificación si realmente cambió el asignado
            if (oldTask.length > 0 && oldTask[0].assigned_to !== (assigned_to ? parseInt(assigned_to) : null)) {
              await sendTaskAssignmentNotification(taskData, taskData.assignee, project[0]);
            }
          }
        }
      } catch (emailError) {
        console.error('❌ Error enviando notificaciones:', emailError);
      }
    }

    res.json({
      success: true,
      data: taskData,
      message: 'Tarea actualizada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al actualizar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar tarea',
      error: error.message
    });
  }
};

/**
 * Eliminar una tarea
 */
const deleteTask = async (req, res) => {
  try {
    const { taskId } = req.params;

    // Obtener el usuario actual desde el token de autenticación
    const currentUser = req.user;
    if (!currentUser || !currentUser.firebase_uid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Buscar el usuario en la base de datos para obtener su ID
    const user = await prisma.user.findUnique({
      where: { firebase_uid: currentUser.firebase_uid },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en la base de datos'
      });
    }

    // Verificar que la tarea existe y obtener el creador
    const existingTask = await prisma.$queryRaw`
      SELECT id, title, created_by FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
    `;

    if (existingTask.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    const task = existingTask[0];

    // Verificar permisos: solo el creador puede eliminar
    if (task.created_by !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar esta tarea. Solo el creador puede eliminarla.'
      });
    }

    // Eliminar la tarea
    await prisma.$executeRaw`
      DELETE FROM management_tasks WHERE id = ${parseInt(taskId)}
    `;

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar tarea',
      error: error.message
    });
  }
};

/**
 * Obtener usuarios disponibles para asignar tareas
 */
const getAvailableUsers = async (req, res) => {
  try {
    const { projectId } = req.params;

    const users = await prisma.$queryRaw`
      SELECT DISTINCT
        u.id,
        u.name,
        u.email,
        u.department,
        u.position
      FROM users u
      INNER JOIN management_project_members mpm ON u.id = mpm.user_id
      WHERE mpm.project_id = ${parseInt(projectId)}
      AND u.is_active = true
      ORDER BY u.name ASC
    `;

    const userList = users.map(user => ({
      id: Number(user.id),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      department: user.department,
      position: user.position
    }));

    res.json({
      success: true,
      data: userList
    });

  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message
    });
  }
};

/**
 * Probar envío de email de asignación
 */
const testEmailNotification = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    // Datos de prueba
    const testTask = {
      id: 999,
      title: 'Tarea de Prueba - SIGMA',
      description: 'Esta es una tarea de prueba para verificar que el sistema de notificaciones por email funcione correctamente.',
      status: 'todo',
      priority: 'high',
      assigned_to: 1,
      due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      project_id: 1
    };

    const testAssignee = {
      id: 1,
      name: 'Usuario de Prueba',
      email: email
    };

    const testProject = {
      id: 1,
      nombre: 'Proyecto SIGMA de Prueba'
    };

    const result = await sendTaskAssignmentNotification(testTask, testAssignee, testProject);

    res.json({
      success: true,
      message: `Email de prueba enviado exitosamente a ${email}`,
      data: {
        task: testTask.title,
        assignee: testAssignee.name,
        project: testProject.nombre,
        result: result
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error enviando email de prueba',
      error: error.message,
      stack: error.stack
    });
  }
};

module.exports = {
  getTasksByProject,
  getTasksByUser,
  createTask,
  updateTask,
  deleteTask,
  getAvailableUsers,
  testEmailNotification
};