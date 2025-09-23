// 🎯 MANAGEMENT TASK CONTROLLER - CONTROLADOR DE TAREAS
// =====================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { 
  sendTaskAssignmentNotification, 
  sendTaskStatusChangeNotification, 
  sendTaskCreatedNotification 
} = require('../services/taskNotificationService');

/**
 * Obtener todas las tareas de un proyecto
 */
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    
    console.log('🔍 Obteniendo tareas del proyecto:', projectId);
    
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
        u.name as assignee_name,
        u.email as assignee_email
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
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

    console.log('✅ Tareas obtenidas:', tasks.length);

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

    console.log('📝 Creando nueva tarea:', { project_id, title, priority });

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
        status, priority, assigned_to, due_date, created_at, updated_at
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

    console.log('✅ Tarea creada:', taskData.id);

    // Enviar notificación por email si hay un usuario asignado
    if (taskData.assignee) {
      try {
        // Obtener información del proyecto
        const project = await prisma.$queryRaw`
          SELECT nombre FROM management_projects WHERE id = ${parseInt(project_id)} LIMIT 1
        `;
        
        if (project.length > 0) {
          await sendTaskCreatedNotification(taskData, taskData.assignee, project[0]);
        }
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar notificación de creación:', emailError.message);
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

    console.log('✏️ Actualizando tarea:', taskId, { status, priority });

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

    console.log('✅ Tarea actualizada:', taskData.id);

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
            // Obtener el estado anterior
            const oldTask = await prisma.$queryRaw`
              SELECT status FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
            `;
            
            if (oldTask.length > 0 && oldTask[0].status !== status) {
              await sendTaskStatusChangeNotification(
                taskData, 
                oldTask[0].status, 
                status, 
                taskData.assignee, 
                project[0]
              );
            }
          }
          
          // Si cambió la asignación, enviar notificación de asignación
          if (assigned_to !== undefined) {
            await sendTaskAssignmentNotification(taskData, taskData.assignee, project[0]);
          }
        }
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar notificación:', emailError.message);
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

    console.log('🗑️ Eliminando tarea:', taskId);

    // Verificar que la tarea existe
    const existingTask = await prisma.$queryRaw`
      SELECT id, title FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
    `;

    if (existingTask.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    // Eliminar la tarea
    await prisma.$executeRaw`
      DELETE FROM management_tasks WHERE id = ${parseInt(taskId)}
    `;

    console.log('✅ Tarea eliminada:', existingTask[0].title);

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

    console.log('👥 Obteniendo usuarios disponibles para el proyecto:', projectId);

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

    console.log('✅ Usuarios obtenidos:', userList.length);

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

module.exports = {
  getTasksByProject,
  createTask,
  updateTask,
  deleteTask,
  getAvailableUsers
};