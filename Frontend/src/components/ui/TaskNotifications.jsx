// 🔔 TASK NOTIFICATIONS - FEEDBACK VISUAL AVANZADO
// ================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import { Box, IconButton, Typography, alpha } from '@mui/material';

// 🎨 TIPOS DE NOTIFICACIÓN
const NOTIFICATION_TYPES = {
  success: {
    icon: SuccessIcon,
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)'
  },
  error: {
    icon: ErrorIcon,
    color: '#ef4444',
    bgColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: 'rgba(239, 68, 68, 0.3)'
  },
  warning: {
    icon: WarningIcon,
    color: '#f59e0b',
    bgColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.3)'
  },
  info: {
    icon: InfoIcon,
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: 'rgba(59, 130, 246, 0.3)'
  }
};

// 🎯 COMPONENTE DE NOTIFICACIÓN INDIVIDUAL
const TaskNotification = ({
  id,
  type = 'info',
  title,
  message,
  duration = 4000,
  onClose,
  action
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const config = NOTIFICATION_TYPES[type];
  const IconComponent = config.icon;

  // Auto-close timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false);
        setTimeout(() => onClose(id), 300);
      }, duration);

      // Progress bar animation
      const progressTimer = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev - (100 / (duration / 100));
          return newProgress <= 0 ? 0 : newProgress;
        });
      }, 100);

      return () => {
        clearTimeout(timer);
        clearInterval(progressTimer);
      };
    }
  }, [duration, id, onClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => onClose(id), 300);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 400, scale: 0.9 }}
      animate={{
        opacity: isVisible ? 1 : 0,
        x: isVisible ? 0 : 400,
        scale: isVisible ? 1 : 0.9
      }}
      exit={{ opacity: 0, x: 400, scale: 0.9 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
      style={{
        width: '100%',
        maxWidth: 400,
        marginBottom: 12
      }}
    >
      <Box
        sx={{
          position: 'relative',
          backgroundColor: config.bgColor,
          border: `1px solid ${config.borderColor}`,
          borderRadius: 2,
          padding: 2,
          backdropFilter: 'blur(10px)',
          boxShadow: `0 4px 12px ${alpha(config.color, 0.2)}`,
          overflow: 'hidden'
        }}
      >
        {/* Progress bar */}
        {duration > 0 && (
          <Box
            sx={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              height: 3,
              width: `${progress}%`,
              backgroundColor: config.color,
              transition: 'width 0.1s linear',
              borderRadius: '0 0 8px 8px'
            }}
          />
        )}

        {/* Content */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
          {/* Icon */}
          <Box
            sx={{
              p: 0.5,
              borderRadius: '50%',
              backgroundColor: alpha(config.color, 0.2),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0
            }}
          >
            <IconComponent
              sx={{
                fontSize: 20,
                color: config.color
              }}
            />
          </Box>

          {/* Text content */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                color: config.color,
                mb: 0.5,
                fontSize: '0.875rem'
              }}
            >
              {title}
            </Typography>
            {message && (
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  fontSize: '0.8rem',
                  lineHeight: 1.4
                }}
              >
                {message}
              </Typography>
            )}
            {action && (
              <Box sx={{ mt: 1 }}>
                {action}
              </Box>
            )}
          </Box>

          {/* Close button */}
          <IconButton
            size="small"
            onClick={handleClose}
            sx={{
              color: config.color,
              opacity: 0.7,
              '&:hover': {
                opacity: 1,
                backgroundColor: alpha(config.color, 0.1)
              },
              width: 24,
              height: 24
            }}
          >
            <CloseIcon sx={{ fontSize: 16 }} />
          </IconButton>
        </Box>
      </Box>
    </motion.div>
  );
};

// 🎭 CONTENEDOR DE NOTIFICACIONES
const TaskNotificationContainer = ({ notifications, onRemove }) => {
  return (
    <Box
      sx={{
        position: 'fixed',
        top: 24,
        right: 24,
        zIndex: 9999,
        maxWidth: 400,
        width: '100%',
        pointerEvents: 'none',
        // Evitar superposición con botones superiores
        marginTop: '80px', // Espacio para botones de acción superior
        '& > *': {
          pointerEvents: 'auto'
        }
      }}
    >
      <AnimatePresence mode="popLayout">
        {notifications.map((notification) => (
          <TaskNotification
            key={notification.id}
            {...notification}
            onClose={onRemove}
          />
        ))}
      </AnimatePresence>
    </Box>
  );
};

// 🚀 HOOK PARA GESTIONAR NOTIFICACIONES
export const useTaskNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    setNotifications(prev => [...prev, { ...notification, id }]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  // Métodos de conveniencia
  const success = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'success',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const error = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 6000, // Errores duran más
      ...options
    });
  }, [addNotification]);

  const warning = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'warning',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  const info = useCallback((title, message, options = {}) => {
    return addNotification({
      type: 'info',
      title,
      message,
      ...options
    });
  }, [addNotification]);

  // Notificaciones específicas de tareas
  const taskCreated = useCallback((taskTitle) => {
    return success(
      'Tarea creada',
      `"${taskTitle}" se creó correctamente`
    );
  }, [success]);

  const taskUpdated = useCallback((taskTitle) => {
    return success(
      'Tarea actualizada',
      `"${taskTitle}" se actualizó correctamente`
    );
  }, [success]);

  const taskDeleted = useCallback((taskTitle) => {
    return success(
      'Tarea eliminada',
      `"${taskTitle}" se eliminó correctamente`
    );
  }, [success]);

  const taskMoved = useCallback((taskTitle, newStatus) => {
    const statusNames = {
      todo: 'Por Hacer',
      in_progress: 'En Progreso',
      review: 'En Revisión',
      done: 'Completado'
    };

    return success(
      'Tarea movida',
      `"${taskTitle}" se movió a ${statusNames[newStatus] || newStatus}`
    );
  }, [success]);

  const taskError = useCallback((action, error) => {
    return error(
      `Error al ${action}`,
      error.message || 'Ocurrió un error inesperado'
    );
  }, [error]);

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
    taskCreated,
    taskUpdated,
    taskDeleted,
    taskMoved,
    taskError,
    NotificationContainer: () => (
      <TaskNotificationContainer
        notifications={notifications}
        onRemove={removeNotification}
      />
    )
  };
};

export default TaskNotificationContainer;