const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ===========================================
// CONTROLADOR DE DAILY STANDUPS
// ===========================================

// Obtener daily standups de un sprint
const getDailyStandupsBySprint = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { date } = req.query;

    const whereClause = {
      sprint_id: parseInt(sprintId)
    };

    if (date) {
      whereClause.date = new Date(date);
    }

    const standups = await prisma.dailyStandup.findMany({
      where: whereClause,
      include: {
        user: {
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
      },
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      data: standups
    });
  } catch (error) {
    console.error('Error obteniendo daily standups:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear o actualizar un daily standup
const createOrUpdateDailyStandup = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { user_id, date, yesterday, today, blockers } = req.body;

    const standupDate = date ? new Date(date) : new Date();
    standupDate.setHours(0, 0, 0, 0); // Establecer a medianoche

    const standup = await prisma.dailyStandup.upsert({
      where: {
        sprint_id_user_id_date: {
          sprint_id: parseInt(sprintId),
          user_id: parseInt(user_id),
          date: standupDate
        }
      },
      update: {
        yesterday,
        today,
        blockers
      },
      create: {
        sprint_id: parseInt(sprintId),
        user_id: parseInt(user_id),
        date: standupDate,
        yesterday,
        today,
        blockers
      },
      include: {
        user: {
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
      message: 'Daily standup guardado exitosamente',
      data: standup
    });
  } catch (error) {
    console.error('Error guardando daily standup:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener daily standups de un usuario en un sprint
const getUserDailyStandups = async (req, res) => {
  try {
    const { sprintId, userId } = req.params;

    const standups = await prisma.dailyStandup.findMany({
      where: {
        sprint_id: parseInt(sprintId),
        user_id: parseInt(userId)
      },
      include: {
        sprint: {
          select: {
            id: true,
            name: true,
            status: true
          }
        }
      },
      orderBy: { date: 'desc' }
    });

    res.json({
      success: true,
      data: standups
    });
  } catch (error) {
    console.error('Error obteniendo daily standups del usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener resumen de daily standups de un sprint
const getSprintStandupSummary = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: parseInt(sprintId) },
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        },
        members: {
          include: {
            user: {
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

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    // Obtener todos los daily standups del sprint
    const standups = await prisma.dailyStandup.findMany({
      where: { sprint_id: parseInt(sprintId) },
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
    });

    // Agrupar por fecha
    const standupsByDate = {};
    standups.forEach(standup => {
      const dateKey = standup.date.toISOString().split('T')[0];
      if (!standupsByDate[dateKey]) {
        standupsByDate[dateKey] = [];
      }
      standupsByDate[dateKey].push(standup);
    });

    // Calcular estadísticas
    const totalStandups = standups.length;
    const uniqueDates = Object.keys(standupsByDate).length;
    const teamMembers = sprint.members.length;
    const participationRate = teamMembers > 0 ? 
      Math.round((totalStandups / (uniqueDates * teamMembers)) * 100) : 0;

    // Obtener bloqueadores más comunes
    const blockers = standups
      .filter(s => s.blockers && s.blockers.trim())
      .map(s => s.blockers.toLowerCase())
      .join(' ')
      .split(/\s+/)
      .filter(word => word.length > 3);

    const blockerCounts = {};
    blockers.forEach(blocker => {
      blockerCounts[blocker] = (blockerCounts[blocker] || 0) + 1;
    });

    const topBlockers = Object.entries(blockerCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([blocker, count]) => ({ blocker, count }));

    const summary = {
      sprint: {
        id: sprint.id,
        name: sprint.name,
        status: sprint.status,
        project: sprint.project
      },
      statistics: {
        totalStandups,
        uniqueDates,
        teamMembers,
        participationRate
      },
      standupsByDate,
      topBlockers,
      teamMembers: sprint.members.map(member => ({
        id: member.user.id,
        name: member.user.name,
        avatar: member.user.avatar,
        standupCount: standups.filter(s => s.user_id === member.user.id).length
      }))
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error obteniendo resumen de daily standups:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ===========================================
// CONTROLADOR DE RETROSPECTIVAS
// ===========================================

// Obtener retrospectivas de un sprint
const getRetrospectivesBySprint = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const retrospectives = await prisma.retrospective.findMany({
      where: { sprint_id: parseInt(sprintId) },
      include: {
        user: {
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
      },
      orderBy: { created_at: 'desc' }
    });

    res.json({
      success: true,
      data: retrospectives
    });
  } catch (error) {
    console.error('Error obteniendo retrospectivas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Crear o actualizar una retrospectiva
const createOrUpdateRetrospective = async (req, res) => {
  try {
    const { sprintId } = req.params;
    const { user_id, what_went_well, what_could_improve, action_items, rating } = req.body;

    const retrospective = await prisma.retrospective.upsert({
      where: {
        sprint_id_user_id: {
          sprint_id: parseInt(sprintId),
          user_id: parseInt(user_id)
        }
      },
      update: {
        what_went_well,
        what_could_improve,
        action_items,
        rating: rating ? parseInt(rating) : null
      },
      create: {
        sprint_id: parseInt(sprintId),
        user_id: parseInt(user_id),
        what_went_well,
        what_could_improve,
        action_items,
        rating: rating ? parseInt(rating) : null
      },
      include: {
        user: {
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
      message: 'Retrospectiva guardada exitosamente',
      data: retrospective
    });
  } catch (error) {
    console.error('Error guardando retrospectiva:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// Obtener resumen de retrospectivas de un sprint
const getSprintRetrospectiveSummary = async (req, res) => {
  try {
    const { sprintId } = req.params;

    const sprint = await prisma.sprint.findUnique({
      where: { id: parseInt(sprintId) },
      include: {
        project: {
          select: {
            id: true,
            nombre: true
          }
        },
        members: {
          include: {
            user: {
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

    if (!sprint) {
      return res.status(404).json({
        success: false,
        message: 'Sprint no encontrado'
      });
    }

    const retrospectives = await prisma.retrospective.findMany({
      where: { sprint_id: parseInt(sprintId) },
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

    // Calcular estadísticas
    const totalRetrospectives = retrospectives.length;
    const teamMembers = sprint.members.length;
    const participationRate = teamMembers > 0 ? 
      Math.round((totalRetrospectives / teamMembers) * 100) : 0;

    // Calcular rating promedio
    const ratings = retrospectives
      .filter(r => r.rating !== null)
      .map(r => r.rating);
    const averageRating = ratings.length > 0 ? 
      ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length : 0;

    // Agrupar comentarios por categoría
    const whatWentWell = retrospectives
      .filter(r => r.what_went_well)
      .map(r => r.what_went_well);
    
    const whatCouldImprove = retrospectives
      .filter(r => r.what_could_improve)
      .map(r => r.what_could_improve);
    
    const actionItems = retrospectives
      .filter(r => r.action_items)
      .map(r => r.action_items);

    const summary = {
      sprint: {
        id: sprint.id,
        name: sprint.name,
        status: sprint.status,
        project: sprint.project
      },
      statistics: {
        totalRetrospectives,
        teamMembers,
        participationRate,
        averageRating: Math.round(averageRating * 10) / 10
      },
      feedback: {
        whatWentWell,
        whatCouldImprove,
        actionItems
      },
      retrospectives: retrospectives.map(r => ({
        id: r.id,
        user: r.user,
        what_went_well: r.what_went_well,
        what_could_improve: r.what_could_improve,
        action_items: r.action_items,
        rating: r.rating,
        created_at: r.created_at
      }))
    };

    res.json({
      success: true,
      data: summary
    });
  } catch (error) {
    console.error('Error obteniendo resumen de retrospectivas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getDailyStandupsBySprint,
  createOrUpdateDailyStandup,
  getUserDailyStandups,
  getSprintStandupSummary,
  getRetrospectivesBySprint,
  createOrUpdateRetrospective,
  getSprintRetrospectiveSummary
};
