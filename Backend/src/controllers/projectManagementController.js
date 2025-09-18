const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// CONTROLADOR DE GESTIÓN DE PROYECTOS
// ===========================================

// 🚀 Obtener todos los proyectos - VERSIÓN SIMPLIFICADA SIN ERRORES
const getAllProjects = async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      priority,
      search,
      detailed = false
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Construir filtros dinámicos
    const where = {};
    if (status) where.status = status;
    if (priority) where.priority = priority;
    if (search) {
      where.OR = [
        { nombre: { contains: search, mode: 'insensitive' } },
        { descripcion: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Query optimizada con inclusión condicional
    const includeOptions = {
      client: {
        select: {
          id: true,
          nombre: true,
          email: true
        }
      },
      project_manager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      members: {
        select: {
          id: true,
          team_type: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    };

    // Solo incluir datos detallados si se solicita
    if (detailed === 'true') {
      includeOptions.members = {
        where: { is_active: true },
        take: 5,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          role: {
            select: {
              name: true,
              level: true
            }
          }
        }
      };
      includeOptions.sprints = {
        where: { status: 'active' },
        take: 3,
        orderBy: { created_at: 'desc' }
      };
    }

    // Ejecutar consultas en paralelo para mejor performance
    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        include: includeOptions,
        orderBy: { created_at: 'desc' },
        skip,
        take
      }),
      prisma.project.count({ where })
    ]);

    // Calcular progreso de tareas solo para proyectos visibles
    const projectsWithProgress = await Promise.all(
      projects.map(async (project) => {
        if (detailed === 'true') {
          const taskStats = await prisma.task.groupBy({
            by: ['status'],
            where: { project_id: project.id },
            _count: true
          });

          const totalTasks = taskStats.reduce((sum, stat) => sum + stat._count, 0);
          const completedTasks = taskStats.find(stat => stat.status === 'done')?._count || 0;
          const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

          return { ...project, progress, totalTasks };
        }
        return project;
      })
    );

    const totalPages = Math.ceil(totalCount / take);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;

    res.json({
      success: true,
      data: projectsWithProgress,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: take,
        totalPages,
        hasNextPage,
        hasPrevPage
      },
      meta: {
        count: projects.length,
        detailed: detailed === 'true'
      }
    });
  } catch (error) {
    console.error('Error obteniendo proyectos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🔍 Obtener un proyecto específico con carga optimizada
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      include_tasks = 'true',
      include_sprints = 'true',
      include_members = 'true',
      tasks_limit = 20,
      sprints_limit = 10
    } = req.query;

    // Consulta base optimizada
    const baseInclude = {
      client: {
        select: {
          id: true,
          nombre: true,
          email: true,
          telefono: true
        }
      },
      methodology: {
        select: {
          id: true,
          name: true,
          description: true
        }
      },
      project_manager: {
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true
        }
      },
      _count: {
        select: {
          tasks: true,
          sprints: true,
          members: true,
          documents: true
        }
      }
    };

    // Incluir miembros condicionalmente
    if (include_members === 'true') {
      baseInclude.members = {
        where: { is_active: true },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          },
          role: {
            select: {
              id: true,
              name: true,
              level: true,
              permissions: true
            }
          }
        },
        orderBy: { created_at: 'asc' }
      };
    }

    // Incluir sprints condicionalmente con paginación
    if (include_sprints === 'true') {
      baseInclude.sprints = {
        take: parseInt(sprints_limit),
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              tasks: true
            }
          }
        }
      };
    }

    // Incluir tareas condicionalmente con paginación
    if (include_tasks === 'true') {
      baseInclude.tasks = {
        take: parseInt(tasks_limit),
        orderBy: { updated_at: 'desc' },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
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
      };
    }

    // Milestones activos únicamente
    baseInclude.milestones = {
      where: {
        OR: [
          { status: 'pending' },
          { status: 'in_progress' }
        ]
      },
      orderBy: { due_date: 'asc' },
      take: 5
    };

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: baseInclude
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    console.error('Error obteniendo proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 CREAR UN NUEVO PROYECTO CON VALIDACIONES Y TRANSACCIONES
const createProject = async (req, res) => {
  try {
    const {
      nombre,
      cliente_id,
      descripcion,
      monto_sin_iva,
      monto_con_iva,
      methodology_id,
      start_date,
      end_date,
      budget,
      priority,
      project_manager_id,
      members = [],
      terms_conditions
    } = req.body;

    // 🔍 Validaciones adicionales de negocio
    if (cliente_id) {
      const clientExists = await prisma.client.findUnique({
        where: { id: parseInt(cliente_id) }
      });
      if (!clientExists) {
        return res.status(400).json({
          success: false,
          message: 'El cliente especificado no existe'
        });
      }
    }

    if (methodology_id) {
      const methodologyExists = await prisma.projectMethodology.findUnique({
        where: { id: parseInt(methodology_id) }
      });
      if (!methodologyExists) {
        return res.status(400).json({
          success: false,
          message: 'La metodología especificada no existe'
        });
      }
    }

    if (project_manager_id) {
      const managerExists = await prisma.user.findUnique({
        where: { id: parseInt(project_manager_id) }
      });
      if (!managerExists) {
        return res.status(400).json({
          success: false,
          message: 'El gerente de proyecto especificado no existe'
        });
      }
    }

    // 💾 Usar transacción para crear proyecto, fases por defecto y miembros
    const result = await prisma.$transaction(async (prisma) => {
      // Crear el proyecto
      const project = await prisma.project.create({
        data: {
          nombre: nombre.trim(),
          cliente_id: cliente_id ? parseInt(cliente_id) : null,
          descripcion: descripcion?.trim() || null,
          monto_sin_iva: monto_sin_iva ? parseFloat(monto_sin_iva) : null,
          monto_con_iva: monto_con_iva ? parseFloat(monto_con_iva) : null,
          methodology_id: methodology_id ? parseInt(methodology_id) : null,
          start_date: start_date ? new Date(start_date) : null,
          end_date: end_date ? new Date(end_date) : null,
          budget: budget ? parseFloat(budget) : null,
          priority: priority || 'medium',
          project_manager_id: project_manager_id ? parseInt(project_manager_id) : null,
          status: 'planning'
        },
        include: {
          client: true,
          methodology: true,
          project_manager: {
            select: {
              id: true,
              name: true,
              email: true,
              avatar: true
            }
          }
        }
      });

      // 📋 Crear fases por defecto
      const DEFAULT_PHASES = [
        { name: 'Backlog', position: 0 },
        { name: 'Planificación', position: 1 },
        { name: 'En desarrollo', position: 2 },
        { name: 'QA', position: 3 },
        { name: 'Revisión', position: 4 },
        { name: 'Completado', position: 5 }
      ];

      const phases = [];
      for (const phaseData of DEFAULT_PHASES) {
        const phase = await prisma.projectPhase.create({
          data: {
            ...phaseData,
            project_id: project.id
          }
        });
        phases.push(phase);
      }

      // Establecer la primera fase como actual (Backlog)
      if (phases.length > 0) {
        await prisma.project.update({
          where: { id: project.id },
          data: { current_phase_id: phases[0].id }
        });
      }

      // 👥 Agregar miembros si se proporcionaron
      if (members.length > 0) {
        // Validar que los usuarios y roles existan
        for (const member of members) {
          const userExists = await prisma.user.findUnique({
            where: { id: parseInt(member.user_id) }
          });
          const roleExists = await prisma.projectRole.findUnique({
            where: { id: parseInt(member.role_id) }
          });

          if (!userExists) {
            throw new Error(`El usuario con ID ${member.user_id} no existe`);
          }
          if (!roleExists) {
            throw new Error(`El rol con ID ${member.role_id} no existe`);
          }
        }

        await prisma.projectMember.createMany({
          data: members.map(member => ({
            project_id: project.id,
            user_id: parseInt(member.user_id),
            role_id: parseInt(member.role_id)
          }))
        });
      }

      // Incluir las fases creadas en la respuesta
      return {
        ...project,
        project_phases: phases,
        current_phase: phases[0]
      };
    });

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: result
    });
  } catch (error) {
    console.error('Error creando proyecto:', error);

    // 🔍 Manejo específico de errores
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        message: 'Ya existe un proyecto con ese nombre',
        error: 'Duplicate entry'
      });
    }

    if (error.code === 'P2003') {
      return res.status(400).json({
        success: false,
        message: 'Referencia de clave foránea inválida',
        error: 'Foreign key constraint failed'
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.stack : 'Internal server error'
    });
  }
};

// Actualizar un proyecto
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Función helper para limpiar y convertir campos de fecha
    const cleanDateField = (fieldName) => {
      if (updateData[fieldName] === '' || updateData[fieldName] === undefined || updateData[fieldName] === null) {
        updateData[fieldName] = null;
      } else if (updateData[fieldName]) {
        try {
          // Si es una fecha en formato YYYY-MM-DD, convertir a ISO DateTime
          const dateStr = updateData[fieldName];
          if (typeof dateStr === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
            // Agregar tiempo para hacer ISO DateTime válido
            updateData[fieldName] = new Date(dateStr + 'T00:00:00.000Z');
          } else if (typeof dateStr === 'string') {
            // Intentar parsear cualquier otro formato de fecha
            updateData[fieldName] = new Date(dateStr);
          }

          // Verificar que la fecha sea válida
          if (updateData[fieldName] && isNaN(updateData[fieldName].getTime())) {
            console.warn(`Fecha inválida para ${fieldName}: ${dateStr}, convirtiendo a null`);
            updateData[fieldName] = null;
          }
        } catch (error) {
          console.warn(`Error convirtiendo fecha ${fieldName}: ${updateData[fieldName]}, convirtiendo a null`);
          updateData[fieldName] = null;
        }
      }
    };

    // Convertir fechas si están presentes y no son strings vacíos
    cleanDateField('start_date');
    cleanDateField('end_date');

    // Convertir números si están presentes
    if (updateData.monto_sin_iva) {
      updateData.monto_sin_iva = parseFloat(updateData.monto_sin_iva);
    }
    if (updateData.monto_con_iva) {
      updateData.monto_con_iva = parseFloat(updateData.monto_con_iva);
    }
    if (updateData.budget) {
      updateData.budget = parseFloat(updateData.budget);
    }

    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        client: true,
        methodology: true,
        project_manager: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            },
            role: true
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      data: project
    });
  } catch (error) {
    console.error('Error actualizando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Eliminar un proyecto
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener métricas del proyecto
const getProjectMetrics = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        tasks: {
          select: {
            status: true,
            priority: true,
            estimated_hours: true,
            actual_hours: true,
            created_at: true,
            due_date: true
          }
        },
        sprints: {
          select: {
            status: true,
            start_date: true,
            end_date: true
          }
        },
        members: {
          select: {
            is_active: true
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Calcular métricas
    const totalTasks = project.tasks.length;
    const completedTasks = project.tasks.filter(task => task.status === 'done').length;
    const inProgressTasks = project.tasks.filter(task => task.status === 'in_progress').length;
    const todoTasks = project.tasks.filter(task => task.status === 'todo').length;
    
    const totalEstimatedHours = project.tasks.reduce((sum, task) => 
      sum + (task.estimated_hours || 0), 0
    );
    const totalActualHours = project.tasks.reduce((sum, task) => 
      sum + (task.actual_hours || 0), 0
    );

    const activeSprints = project.sprints.filter(sprint => sprint.status === 'active').length;
    const completedSprints = project.sprints.filter(sprint => sprint.status === 'completed').length;

    const activeMembers = project.members.filter(member => member.is_active).length;

    // Calcular progreso del proyecto
    const progress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    // Tareas por prioridad
    const tasksByPriority = {
      low: project.tasks.filter(task => task.priority === 'low').length,
      medium: project.tasks.filter(task => task.priority === 'medium').length,
      high: project.tasks.filter(task => task.priority === 'high').length,
      critical: project.tasks.filter(task => task.priority === 'critical').length
    };

    // Tareas vencidas
    const today = new Date();
    const overdueTasks = project.tasks.filter(task => 
      task.due_date && new Date(task.due_date) < today && task.status !== 'done'
    ).length;

    const metrics = {
      overview: {
        totalTasks,
        completedTasks,
        inProgressTasks,
        todoTasks,
        progress,
        activeMembers,
        activeSprints,
        completedSprints
      },
      time: {
        totalEstimatedHours: parseFloat(totalEstimatedHours),
        totalActualHours: parseFloat(totalActualHours),
        efficiency: totalEstimatedHours > 0 ? 
          Math.round((totalActualHours / totalEstimatedHours) * 100) : 0
      },
      tasks: {
        byPriority: tasksByPriority,
        overdue: overdueTasks
      }
    };

    res.json({
      success: true,
      data: metrics
    });
  } catch (error) {
    console.error('Error obteniendo métricas del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener metodologías disponibles
const getMethodologies = async (req, res) => {
  try {
    const methodologies = await prisma.projectMethodology.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: methodologies
    });
  } catch (error) {
    console.error('Error obteniendo metodologías:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener roles de proyecto
const getProjectRoles = async (req, res) => {
  try {
    const roles = await prisma.projectRole.findMany({
      where: { is_active: true },
      orderBy: { level: 'desc' }
    });

    res.json({
      success: true,
      data: roles
    });
  } catch (error) {
    console.error('Error obteniendo roles de proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 📊 Analíticas avanzadas de proyectos con caché
const getProjectAnalytics = async (req, res) => {
  try {
    const {
      period = '30',
      status,
      client_id,
      manager_id
    } = req.query;

    const periodDays = parseInt(period);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - periodDays);

    const whereClause = {
      created_at: {
        gte: startDate
      }
    };

    if (status) whereClause.status = status;
    if (client_id) whereClause.cliente_id = parseInt(client_id);
    if (manager_id) whereClause.project_manager_id = parseInt(manager_id);

    // Ejecutar consultas en paralelo para mejor performance
    const [projectsOverview, taskStats, timeStats, clientStats] = await Promise.all([
      // Resumen de proyectos
      prisma.project.groupBy({
        by: ['status'],
        where: whereClause,
        _count: true,
        _avg: {
          budget: true
        },
        _sum: {
          budget: true,
          monto_con_iva: true
        }
      }),

      // Estadísticas de tareas
      prisma.task.groupBy({
        by: ['status', 'priority'],
        where: {
          project: {
            created_at: {
              gte: startDate
            }
          }
        },
        _count: true,
        _avg: {
          estimated_hours: true,
          actual_hours: true
        }
      }),

      // Estadísticas de tiempo
      prisma.timeEntry.groupBy({
        by: ['created_at'],
        where: {
          created_at: {
            gte: startDate
          }
        },
        _sum: {
          hours: true
        }
      }),

      // Estadísticas por cliente
      prisma.project.groupBy({
        by: ['cliente_id'],
        where: whereClause,
        _count: true,
        _sum: {
          monto_con_iva: true
        },
        orderBy: {
          _count: {
            cliente_id: 'desc'
          }
        },
        take: 10
      })
    ]);

    // Calcular métricas derivadas
    const totalProjects = projectsOverview.reduce((sum, item) => sum + item._count, 0);
    const totalRevenue = projectsOverview.reduce((sum, item) => sum + (item._sum.monto_con_iva || 0), 0);
    const avgProjectValue = totalProjects > 0 ? totalRevenue / totalProjects : 0;

    const completionRate = projectsOverview.find(p => p.status === 'completed')?._count || 0;
    const completionPercentage = totalProjects > 0 ? (completionRate / totalProjects) * 100 : 0;

    const analytics = {
      overview: {
        totalProjects,
        totalRevenue: parseFloat(totalRevenue.toFixed(2)),
        avgProjectValue: parseFloat(avgProjectValue.toFixed(2)),
        completionRate: parseFloat(completionPercentage.toFixed(2)),
        period: `Últimos ${periodDays} días`
      },
      projectsByStatus: projectsOverview.map(item => ({
        status: item.status,
        count: item._count,
        avgBudget: parseFloat((item._avg.budget || 0).toFixed(2)),
        totalRevenue: parseFloat((item._sum.monto_con_iva || 0).toFixed(2))
      })),
      taskMetrics: {
        byStatus: taskStats.reduce((acc, item) => {
          if (!acc[item.status]) acc[item.status] = 0;
          acc[item.status] += item._count;
          return acc;
        }, {}),
        byPriority: taskStats.reduce((acc, item) => {
          if (!acc[item.priority]) acc[item.priority] = 0;
          acc[item.priority] += item._count;
          return acc;
        }, {}),
        estimationAccuracy: taskStats.reduce((acc, item) => {
          const estimated = item._avg.estimated_hours || 0;
          const actual = item._avg.actual_hours || 0;
          if (estimated > 0) {
            acc.push({
              accuracy: parseFloat(((actual / estimated) * 100).toFixed(2)),
              count: item._count
            });
          }
          return acc;
        }, [])
      },
      clientDistribution: clientStats.map(item => ({
        client_id: item.cliente_id,
        projectCount: item._count,
        totalRevenue: parseFloat((item._sum.monto_con_iva || 0).toFixed(2))
      }))
    };

    res.json({
      success: true,
      data: analytics,
      generated_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error obteniendo analíticas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 Búsqueda avanzada de proyectos con filtros
const searchProjects = async (req, res) => {
  try {
    const {
      q = '',
      status,
      priority,
      client_id,
      manager_id,
      start_date_from,
      start_date_to,
      budget_min,
      budget_max,
      page = 1,
      limit = 10,
      sort_by = 'created_at',
      sort_order = 'desc'
    } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Construir filtros dinámicos
    const where = {
      AND: []
    };

    if (q.trim()) {
      where.AND.push({
        OR: [
          { nombre: { contains: q, mode: 'insensitive' } },
          { descripcion: { contains: q, mode: 'insensitive' } },
          {
            client: {
              nombre: { contains: q, mode: 'insensitive' }
            }
          }
        ]
      });
    }

    if (status) where.AND.push({ status });
    if (priority) where.AND.push({ priority });
    if (client_id) where.AND.push({ cliente_id: parseInt(client_id) });
    if (manager_id) where.AND.push({ project_manager_id: parseInt(manager_id) });

    if (start_date_from || start_date_to) {
      const dateFilter = {};
      if (start_date_from) dateFilter.gte = new Date(start_date_from);
      if (start_date_to) dateFilter.lte = new Date(start_date_to);
      where.AND.push({ start_date: dateFilter });
    }

    if (budget_min || budget_max) {
      const budgetFilter = {};
      if (budget_min) budgetFilter.gte = parseFloat(budget_min);
      if (budget_max) budgetFilter.lte = parseFloat(budget_max);
      where.AND.push({ budget: budgetFilter });
    }

    // Si no hay filtros, eliminar el array AND vacío
    if (where.AND.length === 0) {
      delete where.AND;
    }

    const orderBy = {};
    orderBy[sort_by] = sort_order;

    const [projects, totalCount] = await Promise.all([
      prisma.project.findMany({
        where,
        include: {
          client: {
            select: {
              id: true,
              nombre: true
            }
          },
          project_manager: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          _count: {
            select: {
              tasks: true,
              members: true
            }
          }
        },
        orderBy,
        skip,
        take
      }),
      prisma.project.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / take);

    res.json({
      success: true,
      data: projects,
      pagination: {
        total: totalCount,
        page: parseInt(page),
        limit: take,
        totalPages,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      },
      filters: {
        query: q,
        status,
        priority,
        client_id,
        manager_id,
        date_range: { start_date_from, start_date_to },
        budget_range: { budget_min, budget_max }
      }
    });
  } catch (error) {
    console.error('Error en búsqueda de proyectos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ===========================================
// GESTIÓN DE FASES DE PROYECTO
// ===========================================

// 🚀 Obtener fases de un proyecto
const getProjectPhases = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        current_phase: true,
        project_phases: {
          orderBy: { position: 'asc' }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      data: {
        current_phase: project.current_phase,
        phases: project.project_phases
      }
    });
  } catch (error) {
    console.error('Error obteniendo fases del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 Crear una nueva fase para un proyecto
const createProjectPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la fase debe tener al menos 2 caracteres'
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la fase no puede exceder 100 caracteres'
      });
    }

    // Verificar que el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Verificar que no existe otra fase con el mismo nombre en el proyecto
    const existingPhase = await prisma.projectPhase.findFirst({
      where: {
        project_id: parseInt(id),
        name: name.trim()
      }
    });

    if (existingPhase) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una fase con ese nombre en este proyecto'
      });
    }

    // Obtener la siguiente posición
    const lastPhase = await prisma.projectPhase.findFirst({
      where: { project_id: parseInt(id) },
      orderBy: { position: 'desc' }
    });

    const nextPosition = lastPhase ? lastPhase.position + 1 : 0;

    // Crear la nueva fase
    const newPhase = await prisma.projectPhase.create({
      data: {
        name: name.trim(),
        position: nextPosition,
        project_id: parseInt(id)
      }
    });

    res.status(201).json({
      success: true,
      data: newPhase,
      message: 'Fase creada exitosamente'
    });
  } catch (error) {
    console.error('Error creando fase del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 Actualizar una fase (renombrar)
const updateProjectPhase = async (req, res) => {
  try {
    const { id, phaseId } = req.params;
    const { name } = req.body;

    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la fase debe tener al menos 2 caracteres'
      });
    }

    if (name.length > 100) {
      return res.status(400).json({
        success: false,
        message: 'El nombre de la fase no puede exceder 100 caracteres'
      });
    }

    // Verificar que la fase existe y pertenece al proyecto
    const phase = await prisma.projectPhase.findFirst({
      where: {
        id: phaseId,
        project_id: parseInt(id)
      }
    });

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: 'Fase no encontrada'
      });
    }

    // Verificar que no existe otra fase con el mismo nombre en el proyecto
    const existingPhase = await prisma.projectPhase.findFirst({
      where: {
        project_id: parseInt(id),
        name: name.trim(),
        id: { not: phaseId }
      }
    });

    if (existingPhase) {
      return res.status(409).json({
        success: false,
        message: 'Ya existe una fase con ese nombre en este proyecto'
      });
    }

    // Actualizar la fase
    const updatedPhase = await prisma.projectPhase.update({
      where: { id: phaseId },
      data: { name: name.trim() }
    });

    res.json({
      success: true,
      data: updatedPhase,
      message: 'Fase actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando fase del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 Reordenar fases
const reorderProjectPhases = async (req, res) => {
  try {
    const { id } = req.params;
    const { phases } = req.body;

    if (!Array.isArray(phases)) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere un array de fases con phaseId y position'
      });
    }

    // Verificar que el proyecto existe
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Verificar que todas las fases pertenecen al proyecto
    const phaseIds = phases.map(p => p.phaseId);
    const existingPhases = await prisma.projectPhase.findMany({
      where: {
        id: { in: phaseIds },
        project_id: parseInt(id)
      }
    });

    if (existingPhases.length !== phaseIds.length) {
      return res.status(400).json({
        success: false,
        message: 'Una o más fases no pertenecen a este proyecto'
      });
    }

    // Ejecutar las actualizaciones en una transacción
    const updates = phases.map(({ phaseId, position }) =>
      prisma.projectPhase.update({
        where: { id: phaseId },
        data: { position: parseInt(position) }
      })
    );

    const updatedPhases = await prisma.$transaction(updates);

    res.json({
      success: true,
      data: updatedPhases,
      message: 'Fases reordenadas exitosamente'
    });
  } catch (error) {
    console.error('Error reordenando fases del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 Eliminar una fase
const deleteProjectPhase = async (req, res) => {
  try {
    const { id, phaseId } = req.params;

    // Verificar que la fase existe y pertenece al proyecto
    const phase = await prisma.projectPhase.findFirst({
      where: {
        id: phaseId,
        project_id: parseInt(id)
      }
    });

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: 'Fase no encontrada'
      });
    }

    // Verificar que no es la fase actual del proyecto
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      select: { current_phase_id: true }
    });

    if (project.current_phase_id === phaseId) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la fase actual. Cambia la fase actual antes de eliminar esta fase.'
      });
    }

    // Verificar que no es la única fase del proyecto
    const phaseCount = await prisma.projectPhase.count({
      where: { project_id: parseInt(id) }
    });

    if (phaseCount <= 1) {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar la única fase del proyecto. Debe existir al menos una fase.'
      });
    }

    // Eliminar la fase y compactar posiciones
    await prisma.$transaction(async (tx) => {
      // Eliminar la fase
      await tx.projectPhase.delete({
        where: { id: phaseId }
      });

      // Compactar posiciones de las fases posteriores
      const phasesToUpdate = await tx.projectPhase.findMany({
        where: {
          project_id: parseInt(id),
          position: { gt: phase.position }
        },
        orderBy: { position: 'asc' }
      });

      for (let i = 0; i < phasesToUpdate.length; i++) {
        await tx.projectPhase.update({
          where: { id: phasesToUpdate[i].id },
          data: { position: phase.position + i }
        });
      }
    });

    res.json({
      success: true,
      message: 'Fase eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error eliminando fase del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🚀 Cambiar la fase actual del proyecto
const updateCurrentPhase = async (req, res) => {
  try {
    const { id } = req.params;
    const { phaseId } = req.body;

    if (!phaseId) {
      return res.status(400).json({
        success: false,
        message: 'Se requiere el ID de la fase'
      });
    }

    // Verificar que la fase existe y pertenece al proyecto
    const phase = await prisma.projectPhase.findFirst({
      where: {
        id: phaseId,
        project_id: parseInt(id)
      }
    });

    if (!phase) {
      return res.status(404).json({
        success: false,
        message: 'Fase no encontrada o no pertenece a este proyecto'
      });
    }

    // Actualizar la fase actual del proyecto
    const updatedProject = await prisma.project.update({
      where: { id: parseInt(id) },
      data: { current_phase_id: phaseId },
      include: {
        current_phase: true
      }
    });

    res.json({
      success: true,
      data: {
        project_id: updatedProject.id,
        current_phase: updatedProject.current_phase
      },
      message: 'Fase actual actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error actualizando fase actual del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  getProjectMetrics,
  getMethodologies,
  getProjectRoles,
  getProjectAnalytics,
  searchProjects,
  // Funciones de gestión de fases
  getProjectPhases,
  createProjectPhase,
  updateProjectPhase,
  reorderProjectPhases,
  deleteProjectPhase,
  updateCurrentPhase
};
