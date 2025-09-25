// =====================================================
// SERVICIO DE NOTIFICACIONES EN TIEMPO REAL
// =====================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class NotificationService {
  constructor() {
    this.clients = new Map(); // Map<userId, WebSocket[]>
  }

  // =====================================================
  // GESTIÓN DE CONEXIONES WEBSOCKET
  // =====================================================

  /**
   * Agregar cliente WebSocket
   */
  addClient(userId, ws) {
    if (!this.clients.has(userId)) {
      this.clients.set(userId, []);
    }
    
    this.clients.get(userId).push(ws);

    // Enviar notificaciones no leídas al conectar
    this.sendUnreadNotifications(userId);
  }

  /**
   * Remover cliente WebSocket
   */
  removeClient(userId, ws) {
    if (this.clients.has(userId)) {
      const userClients = this.clients.get(userId);
      const index = userClients.indexOf(ws);
      
      if (index > -1) {
        userClients.splice(index, 1);
        
        if (userClients.length === 0) {
          this.clients.delete(userId);
        }

      }
    }
  }

  /**
   * Enviar mensaje a un usuario específico
   */
  sendToUser(userId, message) {
    if (this.clients.has(userId)) {
      const userClients = this.clients.get(userId);
      const messageStr = JSON.stringify(message);
      
      userClients.forEach((ws, index) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(messageStr);
        } else {
          // Remover conexiones cerradas
          userClients.splice(index, 1);
        }
      });

      if (userClients.length === 0) {
        this.clients.delete(userId);
      }
    }
  }

  /**
   * Enviar mensaje a todos los usuarios conectados
   */
  broadcast(message) {
    const messageStr = JSON.stringify(message);
    
    this.clients.forEach((userClients, userId) => {
      userClients.forEach((ws, index) => {
        if (ws.readyState === ws.OPEN) {
          ws.send(messageStr);
        } else {
          userClients.splice(index, 1);
        }
      });

      if (userClients.length === 0) {
        this.clients.delete(userId);
      }
    });
  }

  // =====================================================
  // FUNCIONES DE NOTIFICACIÓN
  // =====================================================

  /**
   * Crear y enviar notificación
   */
  async createAndSendNotification(notificationData) {
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
      } = notificationData;

      // Crear notificación en base de datos
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

      // Enviar en tiempo real
      this.sendToUser(user_id, {
        type: 'new_notification',
        notification: notification
      });

      return notification;
    } catch (error) {
      console.error('❌ Error al crear y enviar notificación:', error);
      throw error;
    }
  }

  /**
   * Crear notificaciones para múltiples usuarios
   */
  async createBulkNotifications(notificationData) {
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
      } = notificationData;

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
        throw new Error('Algunos usuarios no existen');
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

      // Enviar en tiempo real a usuarios conectados
      user_ids.forEach(user_id => {
        this.sendToUser(user_id, {
          type: 'new_notification',
          notification: {
            user_id: parseInt(user_id),
            title,
            message,
            type,
            category,
            priority,
            action_url,
            metadata,
            created_at: new Date().toISOString()
          }
        });
      });

      return result;
    } catch (error) {
      console.error('❌ Error al crear notificaciones en lote:', error);
      throw error;
    }
  }

  /**
   * Enviar notificaciones no leídas a un usuario
   */
  async sendUnreadNotifications(userId) {
    try {
      const unreadNotifications = await prisma.systemNotification.findMany({
        where: {
          user_id: parseInt(userId),
          is_read: false
        },
        orderBy: {
          created_at: 'desc'
        },
        take: 10,
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

      if (unreadNotifications.length > 0) {
        this.sendToUser(userId, {
          type: 'unread_notifications',
          notifications: unreadNotifications,
          count: unreadNotifications.length
        });

      }
    } catch (error) {
      console.error('❌ Error al enviar notificaciones no leídas:', error);
    }
  }

  /**
   * Notificar cuando una notificación es marcada como leída
   */
  notifyNotificationRead(userId, notificationId) {
    this.sendToUser(userId, {
      type: 'notification_read',
      notificationId: notificationId
    });
  }

  /**
   * Notificar cuando todas las notificaciones son marcadas como leídas
   */
  notifyAllNotificationsRead(userId) {
    this.sendToUser(userId, {
      type: 'all_notifications_read'
    });
  }

  // =====================================================
  // NOTIFICACIONES DEL SISTEMA
  // =====================================================

  /**
   * Notificar nuevo usuario registrado
   */
  async notifyNewUser(userId, userName) {
    await this.createAndSendNotification({
      user_id: userId,
      title: "Bienvenido al sistema",
      message: `Hola ${userName}, bienvenido al Sistema Financiero. Tu cuenta ha sido creada exitosamente.`,
      type: "success",
      category: "system",
      priority: "medium",
      action_url: "/profile/setup"
    });
  }

  /**
   * Notificar nuevo proyecto asignado
   */
  async notifyProjectAssigned(userId, projectName, projectId) {
    await this.createAndSendNotification({
      user_id: userId,
      title: "Nuevo proyecto asignado",
      message: `Se te ha asignado el proyecto "${projectName}". Revisa los detalles y comienza a trabajar.`,
      type: "info",
      category: "project",
      priority: "high",
      action_url: `/projects/${projectId}`,
      metadata: {
        projectId: projectId,
        projectName: projectName
      }
    });
  }

  /**
   * Notificar tarea completada
   */
  async notifyTaskCompleted(userId, taskName, taskId) {
    await this.createAndSendNotification({
      user_id: userId,
      title: "Tarea completada",
      message: `La tarea "${taskName}" ha sido marcada como completada.`,
      type: "success",
      category: "task",
      priority: "medium",
      action_url: `/tasks/${taskId}`,
      metadata: {
        taskId: taskId,
        taskName: taskName
      }
    });
  }

  /**
   * Notificar error del sistema
   */
  async notifySystemError(userIds, errorMessage, errorDetails) {
    await this.createBulkNotifications({
      user_ids: userIds,
      title: "Error del sistema detectado",
      message: `Se ha detectado un error en el sistema: ${errorMessage}. El equipo técnico está trabajando en la solución.`,
      type: "error",
      category: "system",
      priority: "critical",
      action_url: "/system/status",
      metadata: {
        errorDetails: errorDetails,
        timestamp: new Date().toISOString()
      }
    });
  }

  // =====================================================
  // ESTADÍSTICAS
  // =====================================================

  /**
   * Obtener estadísticas de conexiones
   */
  getConnectionStats() {
    const totalConnections = Array.from(this.clients.values())
      .reduce((total, userClients) => total + userClients.length, 0);

    return {
      connectedUsers: this.clients.size,
      totalConnections: totalConnections,
      users: Array.from(this.clients.keys())
    };
  }
}

// Crear instancia singleton
const notificationService = new NotificationService();

module.exports = notificationService;
