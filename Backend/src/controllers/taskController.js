const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// CONTROLADOR DE TAREAS
// ===========================================

// Obtener todas las tareas de un proyecto
const getTasksByProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { status, priority, assignee_id, sprint_id } = req.query;

    const whereClause = {
      project_id: parseInt(projectId)
    };

    // Aplicar filtros
    if (status) whereClause.status = status;
    if (priority) whereClause.priority = priority;
    if (assignee_id) whereClause.assignee_id = parseInt(assignee_id);
    if (sprint_id) whereClause.sprint_id = parseInt(sprint_id);

    const tasks = await prisma.task.findMany({
      where: whereClause,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { created_at: 'desc' },
          take: 3
        },
        attachments: {
          select: {
            id: true,
            filename: true,
            original_name: true,
            file_size: true,
            mime_type: true,
            created_at: true
          }
        },
        _count: {
          select: {
            comments: true,
            attachments: true,
            timeEntries: true
          }
        }
      },
      orderBy: [
        { priority: 'desc' },
        { created_at: 'desc' }
      ]
    });

    res.json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error('Error obteniendo tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener una tarea específica
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        },
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true,
            status: true
          }
        },
        comments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { created_at: 'asc' }
        },
        attachments: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { created_at: 'desc' }
        },
        timeEntries: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          },
          orderBy: { date: 'desc' }
        }
      }
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Tarea no encontrada'
      });
    }

    res.json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error('Error obteniendo tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear una nueva tarea
const createTask = async (req, res) => {
  try {
    const {
      project_id,
      sprint_id,
      title,
      description,
      priority,
      story_points,
      assignee_id,
      reporter_id,
      due_date,
      estimated_hours
    } = req.body;

    const task = await prisma.task.create({
      data: {
        project_id: parseInt(project_id),
        sprint_id: sprint_id ? parseInt(sprint_id) : null,
        title,
        description,
        priority: priority || 'medium',
        story_points: story_points ? parseInt(story_points) : null,
        assignee_id: assignee_id ? parseInt(assignee_id) : null,
        reporter_id: reporter_id ? parseInt(reporter_id) : null,
        due_date: due_date ? new Date(due_date) : null,
        estimated_hours: estimated_hours ? parseFloat(estimated_hours) : null,
        status: 'todo'
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Tarea creada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error creando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar una tarea
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convertir fechas si están presentes
    if (updateData.due_date) {
      updateData.due_date = new Date(updateData.due_date);
    }

    // Convertir números si están presentes
    if (updateData.story_points) {
      updateData.story_points = parseInt(updateData.story_points);
    }
    if (updateData.estimated_hours) {
      updateData.estimated_hours = parseFloat(updateData.estimated_hours);
    }
    if (updateData.actual_hours) {
      updateData.actual_hours = parseFloat(updateData.actual_hours);
    }

    const task = await prisma.task.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        reporter: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        sprint: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Tarea actualizada exitosamente',
      data: task
    });
  } catch (error) {
    console.error('Error actualizando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar una tarea
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.task.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Tarea eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando tarea:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Agregar comentario a una tarea
const addComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, comment } = req.body;

    const taskComment = await prisma.taskComment.create({
      data: {
        task_id: parseInt(id),
        user_id: parseInt(user_id),
        comment
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Comentario agregado exitosamente',
      data: taskComment
    });
  } catch (error) {
    console.error('Error agregando comentario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Registrar tiempo en una tarea
const logTime = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, description, hours, date } = req.body;

    const timeEntry = await prisma.timeEntry.create({
      data: {
        task_id: parseInt(id),
        user_id: parseInt(user_id),
        description,
        hours: parseFloat(hours),
        date: date ? new Date(date) : new Date()
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            avatar: true
          }
        }
      }
    });

    // Actualizar las horas actuales de la tarea
    const task = await prisma.task.findUnique({
      where: { id: parseInt(id) },
      select: { actual_hours: true }
    });

    const newActualHours = (task.actual_hours || 0) + parseFloat(hours);

    await prisma.task.update({
      where: { id: parseInt(id) },
      data: { actual_hours: newActualHours }
    });

    res.status(201).json({
      success: true,
      message: 'Tiempo registrado exitosamente',
      data: timeEntry
    });
  } catch (error) {
    console.error('Error registrando tiempo:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener métricas de tareas
const getTaskMetrics = async (req, res) => {
  try {
    const { projectId } = req.params;

    const tasks = await prisma.task.findMany({
      where: { project_id: parseInt(projectId) },
      select: {
        status: true,
        priority: true,
        story_points: true,
        estimated_hours: true,
        actual_hours: true,
        created_at: true,
        due_date: true
      }
    });

    // Calcular métricas
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in_progress').length;
    const todoTasks = tasks.filter(task => task.status === 'todo').length;

    const totalStoryPoints = tasks.reduce((sum, task) => 
      sum + (task.story_points || 0), 0
    );
    const completedStoryPoints = tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + (task.story_points || 0), 0);

    const totalEstimatedHours = tasks.reduce((sum, task) => 
      sum + (task.estimated_hours || 0), 0
    );
    const totalActualHours = tasks.reduce((sum, task) => 
      sum + (task.actual_hours || 0), 0
    );

    // Tareas por prioridad
    const tasksByPriority = {
      low: tasks.filter(task => task.priority === 'low').length,
      medium: tasks.filter(task => task.priority === 'medium').length,
      high: tasks.filter(task => task.priority === 'high').length,
      critical: tasks.filter(task => task.priority === 'critical').length
    };

    // Tareas vencidas
    const today = new Date();
    const overdueTasks = tasks.filter(task => 
      task.due_date && new Date(task.due_date) < today && task.status !== 'done'
    ).length;

    // Tareas creadas por mes (últimos 6 meses)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const tasksByMonth = {};
    tasks
      .filter(task => task.created_at >= sixMonthsAgo)
      .forEach(task => {
        const month = task.created_at.toISOString().substring(0, 7);
        tasksByMonth[month] = (tasksByMonth[month] || 0) + 1;
      });

    const metrics = {
      overview: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        completionRate: totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0
      },
      storyPoints: {
        total: totalStoryPoints,
        completed: completedStoryPoints,
        remaining: totalStoryPoints - completedStoryPoints
      },
      time: {
        estimated: parseFloat(totalEstimatedHours),
        actual: parseFloat(totalActualHours),
        efficiency: totalEstimatedHours > 0 ? 
          Math.round((totalActualHours / totalEstimatedHours) * 100) : 0
      },
      tasks: {
        byPriority: tasksByPriority,
        overdue: overdueTasks
      },
      trends: {
        byMonth: tasksByMonth
      }
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error obteniendo métricas de tareas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getTasksByProject,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  addComment,
  logTime,
  getTaskMetrics
};
