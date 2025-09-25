// =====================================================
// CONTROLADOR DE NOTIFICACIONES DEL SISTEMA
// =====================================================

const { PrismaClient } = require('@prisma/client');

// Crear instancia de Prisma específica para notificaciones
let prisma;

try {
  prisma = new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'info', 'warn', 'error'] : ['error'],
    errorFormat: 'minimal',
  });

  // Verificar que la instancia se creó correctamente
  console.log('✅ Prisma client initialized for notifications controller');
  console.log('🔍 SystemNotification model available:', !!prisma.systemNotification);

} catch (error) {
  console.error('❌ Error initializing Prisma client for notifications:', error);
  throw error;
}

/**
 * Función auxiliar para convertir userId (puede ser Firebase UID o ID numérico) a ID numérico
 */
const getNumericUserId = async (userId) => {
  if (isNaN(userId)) {
    // Es un Firebase UID, buscar el usuario
    const user = await prisma.user.findUnique({
      where: { firebase_uid: userId },
      select: { id: true }
    });
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    return user.id;
  } else {
    // Es un ID numérico
    return parseInt(userId);
  }
};

/**
 * Obtener todas las notificaciones de un usuario
 */
const getUserNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { page = 1, limit = 20, unread_only = false } = req.query;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const take = parseInt(limit);

    // Convertir userId a ID numérico
    let numericUserId;
    try {
      numericUserId = await getNumericUserId(userId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // Construir filtros
    const where = {
      user_id: numericUserId
    };

    if (unread_only === 'true') {
      where.is_read = false;
    }

    // Debug: Verificar que prisma.systemNotification existe
    console.log('🔍 Debug - Prisma systemNotification:', {
      exists: !!prisma.systemNotification,
      isFunction: typeof prisma.systemNotification?.findMany === 'function',
      prismaModels: Object.keys(prisma).filter(key => key !== '_' && typeof prisma[key] === 'object'),
      systemNotificationKeys: prisma.systemNotification ? Object.keys(prisma.systemNotification) : 'undefined'
    });

    if (!prisma.systemNotification) {
      throw new Error('SystemNotification model not found in Prisma client');
    }

    if (typeof prisma.systemNotification.findMany !== 'function') {
      throw new Error('systemNotification.findMany is not a function');
    }

    // Obtener notificaciones con paginación
    const [notifications, total] = await Promise.all([
      prisma.systemNotification.findMany({
        where,
        orderBy: {
          created_at: 'desc'
        },
        skip,
        take,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.systemNotification.count({ where })
    ]);

    // Contar notificaciones no leídas
    const unreadCount = await prisma.systemNotification.count({
      where: {
        user_id: numericUserId,
        is_read: false
      }
    });

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / parseInt(limit))
        },
        unreadCount
      }
    });

  } catch (error) {
    console.error('Error al obtener notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Marcar una notificación como leída
 */
const markAsRead = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    // Convertir userId a ID numérico
    let numericUserId;
    try {
      numericUserId = await getNumericUserId(userId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.systemNotification.findFirst({
      where: {
        id: parseInt(notificationId),
        user_id: numericUserId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    // Marcar como leída
    const updatedNotification = await prisma.systemNotification.update({
      where: {
        id: parseInt(notificationId)
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    res.json({
      success: true,
      data: updatedNotification,
      message: 'Notificación marcada como leída'
    });

  } catch (error) {
    console.error('Error al marcar notificación como leída:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Marcar todas las notificaciones como leídas
 */
const markAllAsRead = async (req, res) => {
  try {
    const { userId } = req.body;

    // Convertir userId a ID numérico
    let numericUserId;
    try {
      numericUserId = await getNumericUserId(userId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    const result = await prisma.systemNotification.updateMany({
      where: {
        user_id: numericUserId,
        is_read: false
      },
      data: {
        is_read: true,
        read_at: new Date()
      }
    });

    res.json({
      success: true,
      data: {
        updatedCount: result.count
      },
      message: `${result.count} notificaciones marcadas como leídas`
    });

  } catch (error) {
    console.error('Error al marcar todas las notificaciones como leídas:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Crear una nueva notificación
 */
const createNotification = async (req, res) => {
  try {
    const {
      user_id,
      title,
      message,
      type = 'info',
      category = 'system',
      priority = 'medium',
      action_url = null,
      metadata = null
    } = req.body;

    // Validar datos requeridos
    if (!user_id || !title || !message) {
      return res.status(400).json({
        success: false,
        message: 'user_id, title y message son requeridos'
      });
    }

    // Verificar que el usuario existe
    const user = await prisma.user.findUnique({
      where: { id: parseInt(user_id) }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Crear la notificación
    const notification = await prisma.systemNotification.create({
      data: {
        user_id: parseInt(user_id),
        title,
        message,
        type,
        category,
        priority,
        action_url,
        metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    res.status(201).json({
      success: true,
      data: notification,
      message: 'Notificación creada exitosamente'
    });

  } catch (error) {
    console.error('Error al crear notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Eliminar una notificación
 */
const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.params;
    const { userId } = req.body;

    // Convertir userId a ID numérico
    let numericUserId;
    try {
      numericUserId = await getNumericUserId(userId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // Verificar que la notificación pertenece al usuario
    const notification = await prisma.systemNotification.findFirst({
      where: {
        id: parseInt(notificationId),
        user_id: numericUserId
      }
    });

    if (!notification) {
      return res.status(404).json({
        success: false,
        message: 'Notificación no encontrada'
      });
    }

    // Eliminar la notificación
    await prisma.systemNotification.delete({
      where: {
        id: parseInt(notificationId)
      }
    });

    res.json({
      success: true,
      message: 'Notificación eliminada exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar notificación:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Obtener estadísticas de notificaciones para un usuario
 */
const getNotificationStats = async (req, res) => {
  try {
    const { userId } = req.params;

    // Convertir userId a ID numérico
    let numericUserId;
    try {
      numericUserId = await getNumericUserId(userId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    const stats = await prisma.systemNotification.groupBy({
      by: ['type', 'is_read'],
      where: {
        user_id: numericUserId
      },
      _count: {
        id: true
      }
    });

    // Procesar estadísticas
    const processedStats = {
      total: 0,
      unread: 0,
      byType: {},
      byReadStatus: {
        read: 0,
        unread: 0
      }
    };

    stats.forEach(stat => {
      processedStats.total += stat._count.id;
      
      if (stat.is_read) {
        processedStats.byReadStatus.read += stat._count.id;
      } else {
        processedStats.byReadStatus.unread += stat._count.id;
        processedStats.unread += stat._count.id;
      }

      if (!processedStats.byType[stat.type]) {
        processedStats.byType[stat.type] = { read: 0, unread: 0, total: 0 };
      }

      processedStats.byType[stat.type].total += stat._count.id;
      
      if (stat.is_read) {
        processedStats.byType[stat.type].read += stat._count.id;
      } else {
        processedStats.byType[stat.type].unread += stat._count.id;
      }
    });

    res.json({
      success: true,
      data: processedStats
    });

  } catch (error) {
    console.error('Error al obtener estadísticas de notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Crear notificación para múltiples usuarios
 */
const createBulkNotification = async (req, res) => {
  try {
    const {
      user_ids,
      title,
      message,
      type = 'info',
      category = 'system',
      priority = 'medium',
      action_url = null,
      metadata = null
    } = req.body;

    // Validar datos requeridos
    if (!user_ids || !Array.isArray(user_ids) || user_ids.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'user_ids debe ser un array no vacío'
      });
    }

    if (!title || !message) {
      return res.status(400).json({
        success: false,
        message: 'title y message son requeridos'
      });
    }

    // Verificar que todos los usuarios existen
    const users = await prisma.user.findMany({
      where: {
        id: {
          in: user_ids.map(id => parseInt(id))
        }
      },
      select: { id: true }
    });

    if (users.length !== user_ids.length) {
      return res.status(400).json({
        success: false,
        message: 'Algunos usuarios no existen'
      });
    }

    // Crear notificaciones en lote
    const notificationsData = user_ids.map(user_id => ({
      user_id: parseInt(user_id),
      title,
      message,
      type,
      category,
      priority,
      action_url,
      metadata: metadata ? JSON.parse(JSON.stringify(metadata)) : null
    }));

    const result = await prisma.systemNotification.createMany({
      data: notificationsData
    });

    res.status(201).json({
      success: true,
      data: {
        createdCount: result.count,
        userCount: user_ids.length
      },
      message: `${result.count} notificaciones creadas exitosamente`
    });

  } catch (error) {
    console.error('Error al crear notificaciones en lote:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

/**
 * Eliminar todas las notificaciones de un usuario
 */
const deleteAllNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    const { userId: bodyUserId } = req.body;

    // Convertir userId a ID numérico
    let numericUserId;
    try {
      numericUserId = await getNumericUserId(userId);
    } catch (error) {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    // Verificar que el userId del body coincida con el del parámetro
    if (bodyUserId && bodyUserId !== numericUserId) {
      return res.status(400).json({
        success: false,
        message: 'ID de usuario no coincide'
      });
    }

    // Eliminar todas las notificaciones del usuario
    const deletedCount = await prisma.systemNotification.deleteMany({
      where: {
        user_id: numericUserId
      }
    });

    res.json({
      success: true,
      data: {
        deletedCount: deletedCount.count
      },
      message: `${deletedCount.count} notificaciones eliminadas exitosamente`
    });

  } catch (error) {
    console.error('Error al eliminar todas las notificaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats,
  createBulkNotification
};
