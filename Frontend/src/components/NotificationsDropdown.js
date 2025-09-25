// =====================================================
// COMPONENTE DE DROPDOWN DE NOTIFICACIONES PREMIUM
// =====================================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  IconButton,
  Badge,
  Popover,
  Typography,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  Button,
  Chip,
  Divider,
  Avatar,
  Tooltip,
  CircularProgress,
  Alert,
  Stack,
  Paper,
  Fade,
  Slide,
  Menu,
  MenuItem,
  ListItemText,
  Switch,
  FormControlLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText,
  Card,
  CardContent,
  CardActions,
  Grid,
  Container
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Close as CloseIcon,
  CheckCircle as CheckCircleIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  SystemUpdate as SystemIcon,
  MoreVert as MoreVertIcon,
  Refresh as RefreshIcon,
  MarkEmailRead as MarkReadIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  DoneAll as CheckAllIcon,
  DeleteSweep as DeleteSweepIcon,
  FilterList as FilterListIcon,
  Settings as SettingsIcon,
  Star as StarIcon,
  StarBorder as StarBorderIcon,
  AccessTime as TimeIcon,
  Category as CategoryIcon,
  Flag as FlagIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotifications } from '../context/NotificationsContext';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// =====================================================
// COMPONENTE DE NOTIFICACIÓN INDIVIDUAL PREMIUM
// =====================================================

const NotificationItem = ({ notification, onMarkAsRead, onDelete, onToggleStar }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState(false);

  const getNotificationIcon = (type) => {
    const iconProps = { sx: { fontSize: 20 } };
    
    switch (type) {
      case 'success':
        return <CheckCircleIcon {...iconProps} sx={{ ...iconProps.sx, color: '#10b981' }} />;
      case 'warning':
        return <WarningIcon {...iconProps} sx={{ ...iconProps.sx, color: '#f59e0b' }} />;
      case 'error':
        return <ErrorIcon {...iconProps} sx={{ ...iconProps.sx, color: '#ef4444' }} />;
      case 'system':
        return <SystemIcon {...iconProps} sx={{ ...iconProps.sx, color: '#3b82f6' }} />;
      default:
        return <InfoIcon {...iconProps} sx={{ ...iconProps.sx, color: '#6b7280' }} />;
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      case 'high':
        return { bg: '#fffbeb', color: '#d97706', border: '#fed7aa' };
      case 'medium':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      case 'low':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'success':
        return { bg: '#f0fdf4', color: '#16a34a', border: '#bbf7d0' };
      case 'warning':
        return { bg: '#fffbeb', color: '#d97706', border: '#fed7aa' };
      case 'error':
        return { bg: '#fef2f2', color: '#dc2626', border: '#fecaca' };
      case 'system':
        return { bg: '#eff6ff', color: '#2563eb', border: '#bfdbfe' };
      default:
        return { bg: '#f9fafb', color: '#6b7280', border: '#e5e7eb' };
    }
  };

  const priorityColors = getPriorityColor(notification.priority);
  const typeColors = getTypeColor(notification.type);

  const handleMenuOpen = (event) => {
    event.stopPropagation();
    setMenuAnchor(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchor(null);
  };

  const handleMarkAsRead = () => {
    onMarkAsRead(notification.id);
    handleMenuClose();
  };

  const handleDeleteClick = () => {
    setDeleteDialog(true);
    handleMenuClose();
  };

  const handleDeleteConfirm = () => {
    onDelete(notification.id);
    setDeleteDialog(false);
  };

  const handleDeleteCancel = () => {
    setDeleteDialog(false);
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ 
          opacity: 1, 
          y: 0, 
          scale: 1,
          transition: { duration: 0.4, ease: [0.4, 0, 0.2, 1] }
        }}
        exit={{ 
          opacity: 0, 
          y: -20, 
          scale: 0.95,
          transition: { duration: 0.3 }
        }}
        whileHover={{ 
          scale: 1.02,
          y: -2,
          transition: { duration: 0.2 }
        }}
        layout
      >
        <Card
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          sx={{
            mb: 2,
            mx: 1,
            borderRadius: 3,
            border: notification.is_read 
              ? '1px solid rgba(0, 0, 0, 0.06)' 
              : '2px solid rgba(59, 130, 246, 0.3)',
            backgroundColor: notification.is_read 
              ? '#ffffff' 
              : 'linear-gradient(135deg, rgba(59, 130, 246, 0.02) 0%, rgba(147, 197, 253, 0.05) 100%)',
            boxShadow: notification.is_read 
              ? '0 1px 3px rgba(0, 0, 0, 0.1)' 
              : '0 4px 12px rgba(59, 130, 246, 0.15)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            overflow: 'hidden',
            position: 'relative',
            '&:hover': {
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              transform: 'translateY(-4px)',
            },
            '&::before': notification.is_read ? {} : {
              content: '""',
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: 4,
              background: 'linear-gradient(180deg, #3b82f6 0%, #1d4ed8 100%)',
              borderRadius: '0 2px 2px 0'
            }
          }}
        >
          {/* Indicador de no leída */}
          {!notification.is_read && (
            <Box
              sx={{
                position: 'absolute',
                top: 12,
                right: 12,
                width: 8,
                height: 8,
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                animation: 'pulse 2s infinite',
                zIndex: 1
              }}
            />
          )}

          <CardContent sx={{ p: 3, pb: 2 }}>
            {/* Header con icono y título */}
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2, mb: 2 }}>
              <Avatar
                sx={{
                  width: 44,
                  height: 44,
                  backgroundColor: typeColors.bg,
                  border: `2px solid ${typeColors.border}`,
                  mt: 0.5
                }}
              >
                {getNotificationIcon(notification.type)}
              </Avatar>

              <Box sx={{ flex: 1, minWidth: 0 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: notification.is_read ? 600 : 700,
                    fontSize: '1rem',
                    color: notification.is_read ? '#374151' : '#111827',
                    lineHeight: 1.4,
                    mb: 1
                  }}
                >
                  {notification.title}
                </Typography>

                {/* Chips de prioridad y categoría */}
                <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                  <Chip
                    icon={<FlagIcon sx={{ fontSize: 14 }} />}
                    label={notification.priority.toUpperCase()}
                    size="small"
                    sx={{
                      backgroundColor: priorityColors.bg,
                      color: priorityColors.color,
                      border: `1px solid ${priorityColors.border}`,
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      height: 24
                    }}
                  />
                  
                  {notification.category && (
                    <Chip
                      icon={<CategoryIcon sx={{ fontSize: 14 }} />}
                      label={notification.category}
                      size="small"
                      variant="outlined"
                      sx={{ 
                        fontSize: '0.7rem', 
                        height: 24,
                        borderColor: typeColors.border,
                        color: typeColors.color
                      }}
                    />
                  )}
                </Box>
              </Box>

              {/* Menú de opciones */}
              <IconButton
                size="small"
                onClick={handleMenuOpen}
                sx={{ 
                  opacity: isHovered ? 1 : 0.3,
                  transition: 'opacity 0.2s',
                  color: '#6b7280'
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
            </Box>

            {/* Mensaje */}
            <Typography
              variant="body2"
              sx={{
                color: '#4b5563',
                lineHeight: 1.6,
                fontSize: '0.9rem',
                mb: 2,
                display: '-webkit-box',
                WebkitLineClamp: 3,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
                textOverflow: 'ellipsis'
              }}
            >
              {notification.message}
            </Typography>

            {/* Footer con timestamp y acciones */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              pt: 1,
              borderTop: '1px solid rgba(0, 0, 0, 0.06)'
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TimeIcon sx={{ fontSize: 14, color: '#9ca3af' }} />
                <Typography
                  variant="caption"
                  sx={{
                    fontSize: '0.75rem',
                    color: '#6b7280',
                    fontWeight: 500
                  }}
                >
                  {formatDistanceToNow(new Date(notification.created_at), {
                    addSuffix: true,
                    locale: es
                  })}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', gap: 0.5, opacity: isHovered ? 1 : 0.3, transition: 'opacity 0.2s' }}>
                {!notification.is_read && (
                  <Tooltip title="Marcar como leída">
                    <IconButton
                      size="small"
                      onClick={handleMarkAsRead}
                      sx={{ 
                        color: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        '&:hover': { 
                          backgroundColor: '#10b981', 
                          color: 'white' 
                        }
                      }}
                    >
                      <VisibilityIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </Box>
          </CardContent>
        </Card>
      </motion.div>

      {/* Menú de opciones */}
      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={handleMenuClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.15)',
            minWidth: 180,
            border: '1px solid rgba(0, 0, 0, 0.05)'
          }
        }}
      >
        {!notification.is_read && (
          <MenuItem onClick={handleMarkAsRead} sx={{ py: 1.5, gap: 1.5 }}>
            <VisibilityIcon sx={{ fontSize: 18, color: '#10b981' }} />
            <Typography variant="body2">Marcar como leída</Typography>
          </MenuItem>
        )}
        <MenuItem onClick={handleDeleteClick} sx={{ py: 1.5, gap: 1.5, color: '#ef4444' }}>
          <DeleteIcon sx={{ fontSize: 18 }} />
          <Typography variant="body2">Eliminar</Typography>
        </MenuItem>
      </Menu>

      {/* Diálogo de confirmación de eliminación */}
      <Dialog
        open={deleteDialog}
        onClose={handleDeleteCancel}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 400 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon color="error" />
            Eliminar notificación
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar esta notificación? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={handleDeleteCancel} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteConfirm} variant="contained" color="error" sx={{ borderRadius: 2 }}>
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

// =====================================================
// COMPONENTE PRINCIPAL DE DROPDOWN PREMIUM
// =====================================================

const NotificationsDropdown = ({ variant = 'header' }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showSettings, setShowSettings] = useState(false);
  const [bulkDeleteDialog, setBulkDeleteDialog] = useState(false);

  const {
    notifications,
    unreadCount,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications
  } = useNotifications();

  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    if (!notifications.length) {
      fetchNotifications();
    }
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      await markAsRead(notificationId);
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const handleDelete = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const handleDeleteAll = async () => {
    try {
      await deleteAllNotifications();
      setBulkDeleteDialog(false);
    } catch (error) {
      console.error('Error al eliminar todas:', error);
    }
  };

  const handleRefresh = async () => {
    try {

      await fetchNotifications({ unread_only: false });
    } catch (error) {
      console.error('Error al actualizar:', error);
    }
  };

  // Filtrar y ordenar notificaciones
  const filteredNotifications = React.useMemo(() => {

    let filtered = [...notifications];

    // Filtrar por estado
    if (filter === 'unread') {
      filtered = filtered.filter(n => !n.is_read);
    } else if (filter === 'read') {
      filtered = filtered.filter(n => n.is_read);
    }

    // Ordenar
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return new Date(a.created_at) - new Date(b.created_at);
        case 'priority':
          const priorityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

    return filtered;
  }, [notifications, filter, sortBy]);

  const renderNotificationsList = () => {
    if (loading && !notifications.length) {
      return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 6, gap: 2 }}>
          <CircularProgress size={40} />
          <Typography variant="body2" color="text.secondary">
            Cargando notificaciones...
          </Typography>
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 3, borderRadius: 2 }}>
          Error al cargar notificaciones: {error}
        </Alert>
      );
    }

    if (!filteredNotifications.length) {
      const message = filter === 'all' ? 'No tienes notificaciones' :
                     filter === 'unread' ? 'No tienes notificaciones sin leer' :
                     'No tienes notificaciones leídas';

      return (
        <Box sx={{ textAlign: 'center', py: 6 }}>
          <NotificationsIcon sx={{ fontSize: 64, color: '#e5e7eb', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            {message}
          </Typography>
          <Typography variant="body2" color="text.disabled">
            {filter === 'all' ? 'Las notificaciones aparecerán aquí cuando las recibas' : 
             'Prueba cambiar el filtro para ver más notificaciones'}
          </Typography>
        </Box>
      );
    }

    return (
      <AnimatePresence mode="popLayout">
        <Box sx={{ p: 1 }}>
          {filteredNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onMarkAsRead={handleMarkAsRead}
              onDelete={handleDelete}
            />
          ))}
        </Box>
      </AnimatePresence>
    );
  };

  return (
    <>
      {/* Botón del header */}
      <Tooltip title="Notificaciones">
        <IconButton
          onClick={handleClick}
          sx={{
            color: variant === 'header' ? 'inherit' : 'primary.main',
            position: 'relative'
          }}
        >
          <Badge 
            badgeContent={unreadCount} 
            color="error"
            max={99}
            sx={{
              '& .MuiBadge-badge': {
                fontSize: '0.7rem',
                height: 18,
                minWidth: 18,
                animation: unreadCount > 0 ? 'pulse 2s infinite' : 'none'
              }
            }}
          >
            <NotificationsIcon />
          </Badge>
        </IconButton>
      </Tooltip>

      {/* Popover del dropdown */}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        PaperProps={{
          sx: {
            width: 480,
            maxHeight: 700,
            borderRadius: 3,
            boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }
        }}
        TransitionComponent={Fade}
        transitionDuration={300}
      >
        {/* Header del dropdown */}
        <Box sx={{ 
          p: 3, 
          borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
          background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Typography variant="h5" sx={{ fontWeight: 700, color: '#111827' }}>
              Notificaciones
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title="Actualizar">
                <IconButton 
                  size="small" 
                  onClick={handleRefresh} 
                  disabled={loading}
                  sx={{
                    animation: loading ? 'spin 1s linear infinite' : 'none',
                    '@keyframes spin': {
                      '0%': { transform: 'rotate(0deg)' },
                      '100%': { transform: 'rotate(360deg)' }
                    }
                  }}
                >
                  <RefreshIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Configuración">
                <IconButton size="small" onClick={() => setShowSettings(!showSettings)}>
                  <SettingsIcon fontSize="small" />
                </IconButton>
              </Tooltip>
              <Tooltip title="Cerrar">
                <IconButton size="small" onClick={handleClose}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          {/* Filtros */}
          <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
            <Chip
              label="Todas"
              size="small"
              variant={filter === 'all' ? 'filled' : 'outlined'}
              onClick={() => setFilter('all')}
              sx={{ 
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: 2
              }}
            />
            <Chip
              label={`Sin leer (${notifications.filter(n => !n.is_read).length})`}
              size="small"
              variant={filter === 'unread' ? 'filled' : 'outlined'}
              color={filter === 'unread' ? 'primary' : 'default'}
              onClick={() => setFilter('unread')}
              sx={{ 
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: 2
              }}
            />
            <Chip
              label="Leídas"
              size="small"
              variant={filter === 'read' ? 'filled' : 'outlined'}
              onClick={() => setFilter('read')}
              sx={{ 
                cursor: 'pointer',
                fontWeight: 600,
                borderRadius: 2
              }}
            />
          </Box>

          {/* Acciones masivas */}
          {notifications.length > 0 && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {notifications.some(n => !n.is_read) && (
                <Button
                  size="small"
                  startIcon={<CheckAllIcon />}
                  onClick={handleMarkAllAsRead}
                  variant="contained"
                  sx={{ 
                    fontSize: '0.75rem',
                    borderRadius: 2,
                    textTransform: 'none',
                    fontWeight: 600
                  }}
                >
                  Marcar todas como leídas
                </Button>
              )}
              <Button
                size="small"
                startIcon={<DeleteSweepIcon />}
                onClick={() => setBulkDeleteDialog(true)}
                variant="outlined"
                color="error"
                sx={{ 
                  fontSize: '0.75rem',
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600
                }}
              >
                Eliminar todas
              </Button>
            </Box>
          )}
        </Box>

        {/* Lista de notificaciones */}
        <Box sx={{ maxHeight: 500, overflow: 'auto', backgroundColor: '#fafbfc' }}>
          {renderNotificationsList()}
        </Box>

        {/* Footer con estadísticas */}
        {notifications.length > 0 && (
          <Box sx={{ 
            p: 2, 
            borderTop: '1px solid rgba(0, 0, 0, 0.08)', 
            backgroundColor: '#f8fafc',
            borderBottomLeftRadius: 12,
            borderBottomRightRadius: 12
          }}>
            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>
              {notifications.length} notificaciones • {unreadCount} sin leer
            </Typography>
          </Box>
        )}
      </Popover>

      {/* Diálogo de confirmación para eliminar todas */}
      <Dialog
        open={bulkDeleteDialog}
        onClose={() => setBulkDeleteDialog(false)}
        PaperProps={{
          sx: { borderRadius: 3, maxWidth: 400 }
        }}
      >
        <DialogTitle sx={{ pb: 1 }}>
          <Typography variant="h6" component="div" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteSweepIcon color="error" />
            Eliminar todas las notificaciones
          </Typography>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            ¿Estás seguro de que quieres eliminar todas las notificaciones? Esta acción no se puede deshacer.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2, gap: 1 }}>
          <Button onClick={() => setBulkDeleteDialog(false)} variant="outlined" sx={{ borderRadius: 2 }}>
            Cancelar
          </Button>
          <Button onClick={handleDeleteAll} variant="contained" color="error" sx={{ borderRadius: 2 }}>
            Eliminar todas
          </Button>
        </DialogActions>
      </Dialog>

      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
      `}</style>
    </>
  );
};

export default NotificationsDropdown;