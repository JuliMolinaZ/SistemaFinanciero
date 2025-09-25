// =====================================================
// COMPONENTE DE CONEXIÓN WEBSOCKET
// =====================================================

import React, { useEffect, useContext } from 'react';
import { Box, Chip, Tooltip, IconButton } from '@mui/material';
import { Wifi, WifiOff, Refresh } from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import useWebSocket from '../hooks/useWebSocket';
import { useNotifications } from '../context/NotificationsContext';
import { GlobalContext } from '../context/GlobalState';

const WebSocketConnection = ({ showStatus = false }) => {
  const { setCurrentUser } = useContext(GlobalContext);
  const { fetchNotifications, markAsRead, markAllAsRead } = useNotifications();
  
  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';
  const WS_URL = API_BASE_URL.replace('http', 'ws') + '/ws/notifications-simple';

  const {
    isConnected,
    error,
    lastMessage,
    connect,
    disconnect,
    getUnreadCount,
    markAsRead: wsMarkAsRead,
    markAllAsRead: wsMarkAllAsRead
  } = useWebSocket(WS_URL, {
    autoConnect: true,
    maxReconnectAttempts: 5
  });

  // =====================================================
  // MANEJO DE MENSAJES
  // =====================================================

  useEffect(() => {
    if (lastMessage) {
      switch (lastMessage.type) {
        case 'connection_established':

          getUnreadCount();
          break;

        case 'new_notification':

          // Actualizar notificaciones
          fetchNotifications();
          break;

        case 'unread_count':

          break;

        case 'notification_read':

          // Actualizar notificaciones
          fetchNotifications();
          break;

        case 'all_notifications_read':

          // Actualizar notificaciones
          fetchNotifications();
          break;

        case 'unread_notifications':

          break;

        case 'pong':
          // Respuesta al ping - no hacer nada
          break;

        case 'error':
          console.error('❌ Error del WebSocket:', lastMessage.message);
          break;

        default:

      }
    }
  }, [lastMessage, fetchNotifications]);

  // =====================================================
  // HANDLERS
  // =====================================================

  const handleReconnect = () => {
    disconnect();
    setTimeout(() => {
      connect();
    }, 1000);
  };

  // =====================================================
  // RENDER
  // =====================================================

  const getConnectionStatus = () => {
    if (isConnected) {
      return {
        color: 'success',
        icon: Wifi,
        text: 'Conectado',
        tooltip: 'Conexión WebSocket activa'
      };
    } else if (error) {
      return {
        color: 'error',
        icon: WifiOff,
        text: 'Error',
        tooltip: `Error de conexión: ${error}`
      };
    } else {
      return {
        color: 'warning',
        icon: WifiOff,
        text: 'Desconectado',
        tooltip: 'Intentando reconectar...'
      };
    }
  };

  const status = getConnectionStatus();
  const StatusIcon = status.icon;

  if (!showStatus) {
    return null;
  }

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={isConnected ? 'connected' : 'disconnected'}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{ duration: 0.3 }}
        >
          <Tooltip title={status.tooltip} arrow>
            <Chip
              icon={<StatusIcon />}
              label={status.text}
              color={status.color}
              size="small"
              variant={isConnected ? 'filled' : 'outlined'}
              sx={{
                fontSize: '0.75rem',
                height: 24,
                '& .MuiChip-icon': {
                  fontSize: '1rem'
                }
              }}
            />
          </Tooltip>
        </motion.div>
      </AnimatePresence>

      {!isConnected && (
        <Tooltip title="Reconectar" arrow>
          <IconButton
            size="small"
            onClick={handleReconnect}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                color: 'primary.main'
              }
            }}
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Tooltip>
      )}
    </Box>
  );
};

export default WebSocketConnection;
