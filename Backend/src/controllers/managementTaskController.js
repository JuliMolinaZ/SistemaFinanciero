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
 * Obtener tareas asignadas a un usuario específico
 */
const getTasksByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    console.log('🔍 Obteniendo tareas del usuario:', userId);

    // Usar la misma consulta que funciona en getTasksByProject pero filtrar por usuario
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
        u.email as assignee_email,
        p.nombre as project_name,
        'Administrador' as created_by_name
      FROM management_tasks t
      LEFT JOIN users u ON t.assigned_to = u.id
      LEFT JOIN projects p ON t.project_id = p.id
      WHERE t.assigned_to = ${parseInt(userId)}
      ORDER BY t.created_at DESC
    `;

    console.log(`✅ Encontradas ${tasks.length} tareas para el usuario ${userId}`);

    res.json({
      success: true,
      data: tasks,
      total: tasks.length,
      message: `Tareas del usuario obtenidas correctamente`
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
          console.log('📧 Enviando notificación de asignación a:', taskData.assignee.email);
          await sendTaskAssignmentNotification(taskData, taskData.assignee, project[0]);
        }
      } catch (emailError) {
        console.warn('⚠️ No se pudo enviar notificación de asignación:', emailError.message);
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
            // Obtener el asignado anterior
            const oldTask = await prisma.$queryRaw`
              SELECT assigned_to FROM management_tasks WHERE id = ${parseInt(taskId)} LIMIT 1
            `;
            
            // Solo enviar notificación si realmente cambió el asignado
            if (oldTask.length > 0 && oldTask[0].assigned_to !== (assigned_to ? parseInt(assigned_to) : null)) {
              console.log('📧 Enviando notificación de nueva asignación a:', taskData.assignee.email);
              await sendTaskAssignmentNotification(taskData, taskData.assignee, project[0]);
            }
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

    console.log('🧪 Iniciando prueba de email a:', email);
    console.log('🔧 Variables de entorno:');
    console.log('   NODE_ENV:', process.env.NODE_ENV);
    console.log('   GMAIL_USER:', process.env.GMAIL_USER);
    console.log('   GMAIL_APP_PASSWORD:', process.env.GMAIL_APP_PASSWORD ? '***configurado***' : 'NO CONFIGURADO');
    console.log('   SMTP_USER:', process.env.SMTP_USER);
    console.log('   SMTP_PASS:', process.env.SMTP_PASS ? '***configurado***' : 'NO CONFIGURADO');

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

    console.log('📧 Enviando notificación de asignación...');
    
    const result = await sendTaskAssignmentNotification(testTask, testAssignee, testProject);
    
    console.log('✅ Resultado del envío:', result);

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