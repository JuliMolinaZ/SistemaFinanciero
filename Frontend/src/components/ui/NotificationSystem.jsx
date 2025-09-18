// 🔔 NOTIFICATION SYSTEM - ULTRA PROFESIONAL
// ===========================================

import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Alert,
  AlertTitle,
  Snackbar,
  Box,
  IconButton,
  Typography,
  Stack,
  LinearProgress,
  Portal,
  CircularProgress
} from '@mui/material';
import {
  Close as CloseIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon
} from '@mui/icons-material';

// 🎯 NOTIFICATION CONTEXT
const NotificationContext = createContext(null);

// 📋 NOTIFICATION TYPES
const NOTIFICATION_TYPES = {
  success: 'success',
  error: 'error',
  warning: 'warning',
  info: 'info',
  loading: 'loading'
};

// ⏰ DEFAULT DURATIONS (en milisegundos)
const DEFAULT_DURATIONS = {
  success: 4000,
  error: 6000,
  warning: 5000,
  info: 4000,
  loading: 0 // No auto-dismiss
};

// 🎨 NOTIFICATION POSITIONS
const POSITIONS = {
  topRight: 'top-right',
  topLeft: 'top-left',
  topCenter: 'top-center',
  bottomRight: 'bottom-right',
  bottomLeft: 'bottom-left',
  bottomCenter: 'bottom-center'
};

// 🎭 ANIMATION VARIANTS
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const notificationVariants = {
  hidden: {
    opacity: 0,
    y: -50,
    scale: 0.8
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'spring',
      damping: 25,
      stiffness: 300,
      mass: 0.8
    }
  },
  exit: {
    opacity: 0,
    y: -50,
    scale: 0.8,
    transition: {
      duration: 0.2
    }
  }
};

// 🎯 PROVIDER COMPONENT
export function NotificationProvider({
  children,
  position = POSITIONS.topRight,
  maxNotifications = 5
}) {
  const [notifications, setNotifications] = useState([]);
  const notificationId = useRef(0);
  const timers = useRef(new Map());

  // 🔄 Helper para generar ID único
  const generateId = useCallback(() => {
    return `notification-${++notificationId.current}`;
  }, []);

  // 🔄 Helper para limpiar timer
  const clearTimer = useCallback((id) => {
    const timer = timers.current.get(id);
    if (timer) {
      clearTimeout(timer);
      timers.current.delete(id);
    }
  }, []);

  // 🔄 Helper para configurar auto-dismiss
  const setAutoDismiss = useCallback((id, duration) => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        removeNotification(id);
      }, duration);
      timers.current.set(id, timer);
    }
  }, []);

  // ➕ Agregar notificación
  const addNotification = useCallback((options) => {
    const {
      type = NOTIFICATION_TYPES.info,
      title,
      description,
      duration,
      persistent = false,
      actions = [],
      progress,
      onClose,
      ...rest
    } = options;

    const id = generateId();
    const finalDuration = persistent ? 0 : (duration ?? DEFAULT_DURATIONS[type]);

    const notification = {
      id,
      type,
      title,
      description,
      duration: finalDuration,
      persistent,
      actions,
      progress,
      onClose,
      createdAt: Date.now(),
      ...rest
    };

    setNotifications(prev => {
      const newNotifications = [notification, ...prev];
      // Limitar número máximo de notificaciones
      return newNotifications.slice(0, maxNotifications);
    });

    // Configurar auto-dismiss
    setAutoDismiss(id, finalDuration);

    return id;
  }, [generateId, setAutoDismiss, maxNotifications]);

  // ➖ Remover notificación
  const removeNotification = useCallback((id) => {
    setNotifications(prev => {
      const notification = prev.find(n => n.id === id);
      if (notification?.onClose) {
        notification.onClose();
      }
      return prev.filter(n => n.id !== id);
    });
    clearTimer(id);
  }, [clearTimer]);

  // 🔄 Actualizar notificación
  const updateNotification = useCallback((id, updates) => {
    setNotifications(prev =>
      prev.map(notification =>
        notification.id === id
          ? { ...notification, ...updates }
          : notification
      )
    );

    // Si cambia la duración, reconfigurar timer
    if ('duration' in updates) {
      clearTimer(id);
      setAutoDismiss(id, updates.duration);
    }
  }, [clearTimer, setAutoDismiss]);

  // 🧹 Limpiar todas las notificaciones
  const clearAll = useCallback(() => {
    notifications.forEach(notification => {
      clearTimer(notification.id);
      if (notification.onClose) {
        notification.onClose();
      }
    });
    setNotifications([]);
  }, [notifications, clearTimer]);

  // 🎯 API de conveniencia
  const notify = {
    success: (options) => addNotification({ type: NOTIFICATION_TYPES.success, ...options }),
    error: (options) => addNotification({ type: NOTIFICATION_TYPES.error, ...options }),
    warning: (options) => addNotification({ type: NOTIFICATION_TYPES.warning, ...options }),
    info: (options) => addNotification({ type: NOTIFICATION_TYPES.info, ...options }),
    loading: (options) => addNotification({
      type: NOTIFICATION_TYPES.loading,
      persistent: true,
      ...options
    }),
    remove: removeNotification,
    update: updateNotification,
    clear: clearAll
  };

  const contextValue = {
    notifications,
    notify,
    position,
    maxNotifications
  };

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <NotificationContainer />
    </NotificationContext.Provider>
  );
}

// 📦 NOTIFICATION CONTAINER
function NotificationContainer() {
  const { notifications, position } = useContext(NotificationContext);

  // 🎨 Obtener estilos de posición
  const getPositionStyles = () => {
    const styles = {
      position: 'fixed',
      zIndex: 9999,
      pointerEvents: 'none',
      maxWidth: '420px',
      width: '100%'
    };

    switch (position) {
      case POSITIONS.topRight:
        return { ...styles, top: 16, right: 16 };
      case POSITIONS.topLeft:
        return { ...styles, top: 16, left: 16 };
      case POSITIONS.topCenter:
        return { ...styles, top: 16, left: '50%', transform: 'translateX(-50%)' };
      case POSITIONS.bottomRight:
        return { ...styles, bottom: 16, right: 16 };
      case POSITIONS.bottomLeft:
        return { ...styles, bottom: 16, left: 16 };
      case POSITIONS.bottomCenter:
        return { ...styles, bottom: 16, left: '50%', transform: 'translateX(-50%)' };
      default:
        return { ...styles, top: 16, right: 16 };
    }
  };

  return (
    <Portal>
      <motion.div
        style={getPositionStyles()}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence>
          {notifications.map(notification => (
            <NotificationItem
              key={notification.id}
              notification={notification}
            />
          ))}
        </AnimatePresence>
      </motion.div>
    </Portal>
  );
}

// 📄 NOTIFICATION ITEM
function NotificationItem({ notification }) {
  const { notify } = useContext(NotificationContext);
  const {
    id,
    type,
    title,
    description,
    actions = [],
    progress,
    persistent
  } = notification;

  // 🎨 Obtener icono por tipo
  const getIcon = () => {
    const iconProps = { fontSize: 'small' };

    switch (type) {
      case NOTIFICATION_TYPES.success:
        return <SuccessIcon {...iconProps} />;
      case NOTIFICATION_TYPES.error:
        return <ErrorIcon {...iconProps} />;
      case NOTIFICATION_TYPES.warning:
        return <WarningIcon {...iconProps} />;
      case NOTIFICATION_TYPES.loading:
        return <CircularProgress size={20} />;
      default:
        return <InfoIcon {...iconProps} />;
    }
  };

  // 🎨 Obtener severidad para Alert
  const getSeverity = () => {
    if (type === NOTIFICATION_TYPES.loading) return 'info';
    return type;
  };

  const handleClose = () => {
    notify.remove(id);
  };

  return (
    <motion.div
      variants={notificationVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      style={{
        marginBottom: 8,
        pointerEvents: 'auto'
      }}
    >
      <Alert
        severity={getSeverity()}
        icon={getIcon()}
        action={
          <Stack direction="row" spacing={1} alignItems="center">
            {/* 🎯 ACCIONES PERSONALIZADAS */}
            {actions.map((action, index) => (
              <Box key={index}>
                {action}
              </Box>
            ))}

            {/* 🔘 BOTÓN DE CERRAR */}
            {!persistent && (
              <IconButton
                aria-label="cerrar"
                color="inherit"
                size="small"
                onClick={handleClose}
              >
                <CloseIcon fontSize="inherit" />
              </IconButton>
            )}
          </Stack>
        }
        sx={{
          width: '100%',
          boxShadow: 'var(--shadow-elevation-medium)',
          border: 'var(--border-subtle)',
          borderRadius: 2,
          '& .MuiAlert-message': {
            width: '100%'
          }
        }}
      >
        <Stack spacing={1}>
          {/* 📝 TÍTULO */}
          {title && (
            <AlertTitle sx={{ mb: description ? 1 : 0 }}>
              {title}
            </AlertTitle>
          )}

          {/* 📝 DESCRIPCIÓN */}
          {description && (
            <Typography variant="body2">
              {description}
            </Typography>
          )}

          {/* 📊 BARRA DE PROGRESO */}
          {typeof progress === 'number' && (
            <Box sx={{ mt: 1 }}>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  height: 4,
                  borderRadius: 2,
                  backgroundColor: 'var(--surface-variant)',
                  '& .MuiLinearProgress-bar': {
                    borderRadius: 2
                  }
                }}
              />
              <Typography variant="caption" color="text.secondary">
                {Math.round(progress)}%
              </Typography>
            </Box>
          )}
        </Stack>
      </Alert>
    </motion.div>
  );
}

// 🎯 HOOK PARA USAR NOTIFICACIONES
export function useNotifications() {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationProvider');
  }

  return context;
}

// 🎯 EXPORT TYPES Y POSITIONS
export { NOTIFICATION_TYPES, POSITIONS };

// 🎯 DEFAULT EXPORT
export default NotificationProvider;