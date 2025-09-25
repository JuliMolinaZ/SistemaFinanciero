// =====================================================
// WEBSOCKET SIMPLE PARA NOTIFICACIONES (SIN AUTENTICACIÓN)
// =====================================================

const WebSocket = require('ws');
const { PrismaClient } = require('@prisma/client');
const notificationService = require('../services/notificationService');

const prisma = new PrismaClient();

class SimpleNotificationWebSocket {
  constructor(server) {
    this.server = server;
    this.wss = null;
    this.initializeWebSocket();
  }

  initializeWebSocket() {
    this.wss = new WebSocket.Server({
      server: this.server,
      path: '/ws/notifications-simple',
      verifyClient: this.verifyClient.bind(this)
    });

    this.wss.on('connection', this.handleConnection.bind(this));

  }

  // =====================================================
  // VERIFICACIÓN DE CLIENTE (SIMPLIFICADA)
  // =====================================================

  async verifyClient(info) {
    try {
      const url = new URL(info.req.url, `http://${info.req.headers.host}`);
      const userId = url.searchParams.get('userId');

      if (!userId) {

        return false;
      }

      // Verificar que el usuario existe
      const user = await prisma.user.findUnique({
        where: { id: parseInt(userId) },
        select: { id: true, email: true, name: true }
      });

      if (!user) {

        return false;
      }

      // Agregar información del usuario al request
      info.req.user = user;
      info.req.userId = user.id;

      return true;

    } catch (error) {

      return false;
    }
  }

  // =====================================================
  // MANEJO DE CONEXIONES
  // =====================================================

  handleConnection(ws, req) {
    const userId = req.userId;
    const user = req.user;

    // Agregar cliente al servicio de notificaciones
    notificationService.addClient(userId, ws);

    // Enviar mensaje de bienvenida
    ws.send(JSON.stringify({
      type: 'connection_established',
      message: 'Conexión establecida correctamente',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      timestamp: new Date().toISOString()
    }));

    // Manejar mensajes del cliente
    ws.on('message', (message) => {
      this.handleMessage(ws, userId, message);
    });

    // Manejar cierre de conexión
    ws.on('close', (code, reason) => {

      notificationService.removeClient(userId, ws);
    });

    // Manejar errores
    ws.on('error', (error) => {
      console.error(`❌ Error en WebSocket para usuario ${user.name}:`, error);
      notificationService.removeClient(userId, ws);
    });

    // Enviar ping cada 30 segundos para mantener la conexión
    const pingInterval = setInterval(() => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.ping();
      } else {
        clearInterval(pingInterval);
        notificationService.removeClient(userId, ws);
      }
    }, 30000);

    // Limpiar intervalo al cerrar
    ws.on('close', () => {
      clearInterval(pingInterval);
    });
  }

  // =====================================================
  // MANEJO DE MENSAJES
  // =====================================================

  async handleMessage(ws, userId, message) {
    try {
      const data = JSON.parse(message);

      switch (data.type) {
        case 'ping':
          // Responder al ping
          ws.send(JSON.stringify({
            type: 'pong',
            timestamp: new Date().toISOString()
          }));
          break;

        case 'get_unread_count':
          // Obtener conteo de notificaciones no leídas
          const unreadCount = await prisma.systemNotification.count({
            where: {
              user_id: userId,
              is_read: false
            }
          });

          ws.send(JSON.stringify({
            type: 'unread_count',
            count: unreadCount,
            timestamp: new Date().toISOString()
          }));
          break;

        case 'mark_as_read':
          // Marcar notificación como leída
          if (data.notificationId) {
            await prisma.systemNotification.update({
              where: {
                id: data.notificationId,
                user_id: userId
              },
              data: {
                is_read: true,
                read_at: new Date()
              }
            });

            // Notificar a otros clientes del mismo usuario
            notificationService.notifyNotificationRead(userId, data.notificationId);

            ws.send(JSON.stringify({
              type: 'notification_marked_read',
              notificationId: data.notificationId,
              timestamp: new Date().toISOString()
            }));
          }
          break;

        case 'mark_all_as_read':
          // Marcar todas las notificaciones como leídas
          await prisma.systemNotification.updateMany({
            where: {
              user_id: userId,
              is_read: false
            },
            data: {
              is_read: true,
              read_at: new Date()
            }
          });

          // Notificar a otros clientes del mismo usuario
          notificationService.notifyAllNotificationsRead(userId);

          ws.send(JSON.stringify({
            type: 'all_notifications_marked_read',
            timestamp: new Date().toISOString()
          }));
          break;

        default:

          ws.send(JSON.stringify({
            type: 'error',
            message: 'Tipo de mensaje no reconocido',
            timestamp: new Date().toISOString()
          }));
      }

    } catch (error) {
      console.error('❌ Error al procesar mensaje WebSocket:', error);
      ws.send(JSON.stringify({
        type: 'error',
        message: 'Error al procesar el mensaje',
        timestamp: new Date().toISOString()
      }));
    }
  }

  // =====================================================
  // MÉTODOS PÚBLICOS
  // =====================================================

  /**
   * Obtener estadísticas de conexiones
   */
  getStats() {
    return notificationService.getConnectionStats();
  }

  /**
   * Cerrar todas las conexiones
   */
  closeAll() {
    this.wss.clients.forEach((ws) => {
      ws.close(1000, 'Servidor cerrando');
    });
  }

  /**
   * Enviar mensaje a todos los usuarios conectados
   */
  broadcast(message) {
    notificationService.broadcast(message);
  }

  /**
   * Enviar mensaje a un usuario específico
   */
  sendToUser(userId, message) {
    notificationService.sendToUser(userId, message);
  }
}

module.exports = SimpleNotificationWebSocket;
