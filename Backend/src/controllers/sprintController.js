const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// CONTROLADOR DE SPRINTS
// ===========================================

// Obtener todos los sprints de un proyecto
const getSprintsByProject = async (req, res) => {
  try {
    const { projectId } = req.params;

    const sprints = await prisma.sprint.findMany({
      where: { project_id: parseInt(projectId) },
      include: {
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        dailies: {
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
        },
        retrospectives: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        },
        _count: {
          select: {
            tasks: true,
            dailies: true,
            retrospectives: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      data: sprints
    });
  } catch (error) {
    console.error('Error obteniendo sprints:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear un nuevo sprint
const createSprint = async (req, res) => {
  try {
    const {
      project_id,
      name,
      description,
      start_date,
      end_date,
      goal
    } = req.body;

    const sprint = await prisma.sprint.create({
      data: {
        project_id: parseInt(project_id),
        name,
        description,
        start_date: start_date ? new Date(start_date) : null,
        end_date: end_date ? new Date(end_date) : null,
        goal,
        status: 'planning'
      },
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Sprint creado exitosamente',
      data: sprint
    });
  } catch (error) {
    console.error('Error creando sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Actualizar un sprint
const updateSprint = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Convertir fechas si están presentes
    if (updateData.start_date) {
      updateData.start_date = new Date(updateData.start_date);
    }
    if (updateData.end_date) {
      updateData.end_date = new Date(updateData.end_date);
    }

    const sprint = await prisma.sprint.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Sprint actualizado exitosamente',
      data: sprint
    });
  } catch (error) {
    console.error('Error actualizando sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un sprint
const deleteSprint = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.sprint.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Sprint eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Iniciar un sprint
const startSprint = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que no haya otro sprint activo en el mismo proyecto
    const sprint = await prisma.sprint.findUnique({
      where: { id: parseInt(id) },
      include: { project: true }
    });

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    // Pausar otros sprints activos del mismo proyecto
    await prisma.sprint.updateMany({
      where: {
        project_id: sprint.project_id,
        status: 'active',
        id: { not: parseInt(id) }
      },
      data: { status: 'completed' }
    });

    // Iniciar el sprint
    const updatedSprint = await prisma.sprint.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'active',
        start_date: new Date()
      },
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Sprint iniciado exitosamente',
      data: updatedSprint
    });
  } catch (error) {
    console.error('Error iniciando sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Completar un sprint
const completeSprint = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await prisma.sprint.update({
      where: { id: parseInt(id) },
      data: { 
        status: 'completed',
        end_date: new Date()
      },
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        },
        tasks: {
          include: {
            assignee: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Sprint completado exitosamente',
      data: sprint
    });
  } catch (error) {
    console.error('Error completando sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener métricas de un sprint
const getSprintMetrics = async (req, res) => {
  try {
    const { id } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          select: {
            status: true,
            priority: true,
            story_points: true,
            estimated_hours: true,
            actual_hours: true
          }
        },
        dailies: {
          select: {
            date: true,
            user_id: true
          }
        }
      }
    });

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    // Calcular métricas
    const totalTasks = sprint.tasks.length;
    const completedTasks = sprint.tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = sprint.tasks.filter(task => task.status === 'in_progress').length;
    const todoTasks = sprint.tasks.filter(task => task.status === 'todo').length;

    const totalStoryPoints = sprint.tasks.reduce((sum, task) => 
      sum + (task.story_points || 0), 0
    );
    const completedStoryPoints = sprint.tasks
      .filter(task => task.status === 'done')
      .reduce((sum, task) => sum + (task.story_points || 0), 0);

    const totalEstimatedHours = sprint.tasks.reduce((sum, task) => 
      sum + (task.estimated_hours || 0), 0
    );
    const totalActualHours = sprint.tasks.reduce((sum, task) => 
      sum + (task.actual_hours || 0), 0
    );

    // Calcular velocidad del sprint
    const velocity = completedStoryPoints;

    // Calcular burndown (tareas completadas por día)
    const dailyProgress = {};
    sprint.dailies.forEach(daily => {
      const date = daily.date.toISOString().split('T')[0];
      if (!dailyProgress[date]) {
        dailyProgress[date] = 0;
      }
      dailyProgress[date]++;
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
        remaining: totalStoryPoints - completedStoryPoints,
        velocity
      },
      time: {
        estimated: parseFloat(totalEstimatedHours),
        actual: parseFloat(totalActualHours),
        efficiency: totalEstimatedHours > 0 ? 
          Math.round((totalActualHours / totalEstimatedHours) * 100) : 0
      },
      dailyProgress
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error obteniendo métricas del sprint:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getSprintsByProject,
  createSprint,
  updateSprint,
  deleteSprint,
  startSprint,
  completeSprint,
  getSprintMetrics
};
