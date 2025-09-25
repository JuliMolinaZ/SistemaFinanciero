// =====================================================
// RUTAS PARA NOTIFICACIONES DEL SISTEMA
// =====================================================

const express = require('express');
const router = express.Router();
const {
  getUserNotifications,
  markAsRead,
  markAllAsRead,
  createNotification,
  deleteNotification,
  deleteAllNotifications,
  getNotificationStats,
  createBulkNotification
} = require('../controllers/notificationsController');

// Middleware de autenticación (asumiendo que existe)
// const { authenticateToken } = require('../middlewares/auth');

// =====================================================
// RUTAS PARA USUARIOS
// =====================================================

/**
 * @route GET /api/notifications/user/:userId
 * @desc Obtener notificaciones de un usuario específico
 * @access Private
 * @params userId - ID del usuario
 * @query page - Número de página (opcional, default: 1)
 * @query limit - Límite de resultados por página (opcional, default: 20)
 * @query unread_only - Solo notificaciones no leídas (opcional, default: false)
 */
router.get('/user/:userId', getUserNotifications);

/**
 * @route PUT /api/notifications/:notificationId/read
 * @desc Marcar una notificación específica como leída
 * @access Private
 * @params notificationId - ID de la notificación
 * @body userId - ID del usuario
 */
router.put('/:notificationId/read', markAsRead);

/**
 * @route PUT /api/notifications/user/:userId/read-all
 * @desc Marcar todas las notificaciones de un usuario como leídas
 * @access Private
 * @params userId - ID del usuario
 */
router.put('/user/:userId/read-all', markAllAsRead);

/**
 * @route DELETE /api/notifications/:notificationId
 * @desc Eliminar una notificación específica
 * @access Private
 * @params notificationId - ID de la notificación
 * @body userId - ID del usuario
 */
router.delete('/:notificationId', deleteNotification);

/**
 * @route DELETE /api/notifications/user/:userId/delete-all
 * @desc Eliminar todas las notificaciones de un usuario
 * @access Private
 * @params userId - ID del usuario
 * @body userId - ID del usuario
 */
router.delete('/user/:userId/delete-all', deleteAllNotifications);

/**
 * @route GET /api/notifications/user/:userId/stats
 * @desc Obtener estadísticas de notificaciones de un usuario
 * @access Private
 * @params userId - ID del usuario
 */
router.get('/user/:userId/stats', getNotificationStats);

// =====================================================
// RUTAS PARA ADMINISTRADORES
// =====================================================

/**
 * @route POST /api/notifications
 * @desc Crear una nueva notificación para un usuario
 * @access Admin
 * @body user_id, title, message, type, category, priority, action_url, metadata
 */
router.post('/', createNotification);

/**
 * @route POST /api/notifications/bulk
 * @desc Crear notificaciones para múltiples usuarios
 * @access Admin
 * @body user_ids, title, message, type, category, priority, action_url, metadata
 */
router.post('/bulk', createBulkNotification);

module.exports = router;
