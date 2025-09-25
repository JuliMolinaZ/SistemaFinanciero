// 🎯 MY TASKS DASHBOARD - DASHBOARD PERSONAL DE TAREAS
// ===================================================

import React, { useState, useEffect, useContext, useCallback } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Button,
  IconButton,
  Tooltip,
  LinearProgress,
  Avatar,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Divider,
  Stack,
  Paper
} from '@mui/material';
import {
  CheckCircle,
  PlayArrow,
  Schedule,
  Person,
  Assignment,
  Done,
  DoneAll,
  Edit,
  Comment,
  CalendarToday,
  Flag,
  TrendingUp,
  Refresh,
  NotificationsActive
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalContext } from '../../context/GlobalState';
import { taskManagementService } from '../../services/taskManagementService';
import { useNotify } from '../../hooks/useNotify';

// 🎨 ESTILOS CON DESIGN SYSTEM MEJORADO
const TaskCard = ({ task, onStatusChange, onComplete, currentUser, users = [], canChangeTaskStatus }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  // 🎯 COLORES POR PRIORIDAD (mejorados)
  const getPriorityColor = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'alta': case 'high': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      case 'media': case 'medium': return { bg: '#fffbeb', text: '#d97706', border: '#fed7aa' };
      case 'baja': case 'low': return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      case 'critical': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  // 🎯 COLORES POR ESTADO (sincronizados con kanban)
  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pendiente': case 'todo': return { bg: '#fffbeb', text: '#d97706', border: '#fed7aa' };
      case 'en progreso': case 'in_progress': return { bg: '#eff6ff', text: '#2563eb', border: '#bfdbfe' };
      case 'en revisión': case 'review': return { bg: '#faf5ff', text: '#7c3aed', border: '#c4b5fd' };
      case 'completada': case 'done': case 'completed': return { bg: '#f0fdf4', text: '#16a34a', border: '#bbf7d0' };
      case 'cancelada': case 'cancelled': return { bg: '#fef2f2', text: '#dc2626', border: '#fecaca' };
      default: return { bg: '#f9fafb', text: '#6b7280', border: '#e5e7eb' };
    }
  };

  // 📅 FORMATEAR FECHA (mejorado)
  const formatDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays < 0) {
      return `Vencida hace ${Math.abs(diffDays)} días`;
    } else if (diffDays === 0) {
      return 'Vence hoy';
    } else if (diffDays === 1) {
      return 'Vence mañana';
    } else {
      return `Vence en ${diffDays} días`;
    }
  };

  // 📅 FORMATEAR FECHA COMPLETA
  const formatFullDate = (dateString) => {
    if (!dateString) return 'Sin fecha';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  // 👤 OBTENER INICIALES DEL USUARIO
  const getUserInitials = (name) => {
    if (!name) return '??';
    if (typeof name !== 'string') return '??';
    try {
      return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    } catch (error) {

      return '??';
    }
  };

  // ✅ MANEJAR COMPLETAR TAREA
  const handleCompleteTask = () => {
    setShowCompletionDialog(true);
  };

  // 📝 CONFIRMAR COMPLETAR TAREA
  const confirmCompleteTask = async () => {
    try {
      setIsCompleting(true);
      await onComplete(task.id, completionNotes);
      setShowCompletionDialog(false);
      setCompletionNotes('');
    } catch (error) {
      console.error('Error completando tarea:', error);
    } finally {
      setIsCompleting(false);
    }
  };

  // 🚀 MANEJAR CAMBIOS DE ESTADO ESPECÍFICOS
  const handleStartTask = async () => {
    await onStatusChange(task.id, 'en progreso');
  };

  const handleMoveToReview = async () => {
    await onStatusChange(task.id, 'en revisión');
  };

  const handleBackToProgress = async () => {
    await onStatusChange(task.id, 'en progreso');
  };

  const statusColors = getStatusColor(task.status);
  const priorityColors = getPriorityColor(task.priority);

  return (
    <>
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ y: -2 }}
        transition={{ duration: 0.2 }}
      >
        <Card
          sx={{
            borderRadius: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
            border: `2px solid ${statusColors.border}`,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            height: 'auto',
            minHeight: '400px',
            maxHeight: '500px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            '&:hover': {
              boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
              transform: 'translateY(-4px) scale(1.02)',
              border: `2px solid ${statusColors.text}`,
              '& .task-preview-btn': {
                opacity: 1,
                transform: 'translateY(0)'
              }
            },
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: '4px',
              background: `linear-gradient(90deg, ${statusColors.text}, ${priorityColors.text})`,
              borderRadius: '16px 16px 0 0'
            }
          }}
        >
          <CardContent sx={{
            p: 3,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'hidden',
            position: 'relative'
          }}>
            {/* HEADER DE LA TAREA */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                {/* INDICADOR ESPECIAL PARA REVISIÓN DEL CREADOR */}
                {task.is_review_for_creator && (
                  <Box sx={{ mb: 1 }}>
                    <Tooltip title="Esta tarea está esperando tu revisión como creador">
                      <Chip
                        icon={<NotificationsActive />}
                        label="Revisión Pendiente"
                        size="small"
                        sx={{
                          backgroundColor: '#fef3c7',
                          color: '#92400e',
                          fontWeight: '700',
                          fontSize: '0.7rem',
                          border: '2px solid #f59e0b',
                          height: '28px',
                          animation: 'pulse 2s infinite',
                          '@keyframes pulse': {
                            '0%': { opacity: 1 },
                            '50%': { opacity: 0.7 },
                            '100%': { opacity: 1 }
                          }
                        }}
                      />
                    </Tooltip>
                  </Box>
                )}
                
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: '700',
                    color: '#0f172a',
                    mb: 2,
                    fontSize: '1.1rem',
                    lineHeight: 1.3,
                    minHeight: '2.6rem',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    transition: 'color 0.2s ease',
                    '&:hover': {
                      color: statusColors.text
                    }
                  }}
                  onClick={() => setShowPreview(true)}
                  title="Click para ver detalles completos"
                >
                  {task.title}
                </Typography>

                {/* ETIQUETAS DE ESTADO Y PRIORIDAD */}
                <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                  <Chip
                    label={task.status}
                    size="small"
                    sx={{
                      backgroundColor: statusColors.bg,
                      color: statusColors.text,
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      border: `1px solid ${statusColors.border}`,
                      height: '24px'
                    }}
                  />
                  <Chip
                    label={task.priority || 'Media'}
                    size="small"
                    sx={{
                      backgroundColor: priorityColors.bg,
                      color: priorityColors.text,
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      border: `1px solid ${priorityColors.border}`,
                      height: '24px'
                    }}
                  />
                </Box>
              </Box>

              {/* ACCIONES RÁPIDAS CON PERMISOS */}
              <Box sx={{ display: 'flex', gap: 0.5 }}>
                {/* PENDIENTE → EN PROGRESO */}
                {task.status?.toLowerCase() === 'pendiente' && (
                  <Tooltip title="Iniciar tarea">
                    <IconButton
                      onClick={handleStartTask}
                      size="small"
                      sx={{
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        width: '32px',
                        height: '32px',
                        '&:hover': { backgroundColor: '#2563eb' }
                      }}
                    >
                      <PlayArrow sx={{ fontSize: '16px' }} />
                    </IconButton>
                  </Tooltip>
                )}

                {/* EN PROGRESO → REVISIÓN (siempre) y COMPLETADA (solo creador) */}
                {task.status?.toLowerCase() === 'en progreso' && (
                  <>
                    <Tooltip title="Enviar a revisión">
                      <IconButton
                        onClick={handleMoveToReview}
                        size="small"
                        sx={{
                          backgroundColor: '#8b5cf6',
                          color: 'white',
                          width: '32px',
                          height: '32px',
                          '&:hover': { backgroundColor: '#7c3aed' }
                        }}
                      >
                        <Flag sx={{ fontSize: '16px' }} />
                      </IconButton>
                    </Tooltip>

                    {/* COMPLETAR - Solo si es el creador */}
                    {(() => {
                      const canComplete = canChangeTaskStatus(task, 'completada');
                      return canComplete.allowed && (
                        <Tooltip title="Marcar como completada (Solo creador)">
                          <IconButton
                            onClick={handleCompleteTask}
                            size="small"
                            sx={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': { backgroundColor: '#059669' }
                            }}
                          >
                            <CheckCircle sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                      );
                    })()}
                  </>
                )}

                {/* EN REVISIÓN → Solo el creador puede cambiarla */}
                {task.status?.toLowerCase() === 'en revisión' && (() => {
                  const canMoveFromReview = canChangeTaskStatus(task, 'en progreso');
                  const canComplete = canChangeTaskStatus(task, 'completada');

                  return canMoveFromReview.allowed && (
                    <>
                      <Tooltip title="Devolver a progreso (Solo creador)">
                        <IconButton
                          onClick={handleBackToProgress}
                          size="small"
                          sx={{
                            backgroundColor: '#6b7280',
                            color: 'white',
                            width: '32px',
                            height: '32px',
                            '&:hover': { backgroundColor: '#4b5563' }
                          }}
                        >
                          <Edit sx={{ fontSize: '16px' }} />
                        </IconButton>
                      </Tooltip>
                      {canComplete.allowed && (
                        <Tooltip title="Aprobar y completar (Solo creador)">
                          <IconButton
                            onClick={handleCompleteTask}
                            size="small"
                            sx={{
                              backgroundColor: '#10b981',
                              color: 'white',
                              width: '32px',
                              height: '32px',
                              '&:hover': { backgroundColor: '#059669' }
                            }}
                          >
                            <CheckCircle sx={{ fontSize: '16px' }} />
                          </IconButton>
                        </Tooltip>
                      )}
                    </>
                  );
                })()}
              </Box>
            </Box>

            {/* DESCRIPCIÓN MEJORADA */}
            <Box sx={{ mb: 2, position: 'relative' }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#64748b',
                  lineHeight: 1.6,
                  fontSize: '0.875rem',
                  minHeight: '2.5rem',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'color 0.2s ease',
                  '&:hover': {
                    color: '#475569'
                  }
                }}
                onClick={() => setShowPreview(true)}
                title="Click para ver descripción completa"
              >
                {task.description || 'Sin descripción disponible'}
              </Typography>

              {/* Botón de vista previa flotante */}
              <Button
                className="task-preview-btn"
                size="small"
                variant="outlined"
                onClick={() => setShowPreview(true)}
                sx={{
                  position: 'absolute',
                  top: -8,
                  right: -8,
                  minWidth: 'auto',
                  px: 1,
                  py: 0.5,
                  fontSize: '0.7rem',
                  opacity: 0,
                  transform: 'translateY(10px)',
                  transition: 'all 0.3s ease',
                  backgroundColor: 'rgba(255,255,255,0.95)',
                  backdropFilter: 'blur(8px)',
                  border: `1px solid ${statusColors.text}30`,
                  color: statusColors.text,
                  '&:hover': {
                    backgroundColor: statusColors.bg,
                    borderColor: statusColors.text
                  }
                }}
              >
                Ver tarea
              </Button>
            </Box>

            {/* INFORMACIÓN DETALLADA */}
            <Box sx={{ 
              mb: 2,
              flex: 1, // Usar flex-grow para ocupar espacio disponible
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              minHeight: '7rem' // Altura mínima para asegurar que se vea el asignador
            }}>
              {/* FECHA DE VENCIMIENTO */}
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <CalendarToday sx={{ fontSize: '14px', color: '#9ca3af' }} />
                <Typography variant="caption" sx={{ color: '#6b7280', fontWeight: '500' }}>
                  {formatDate(task.due_date)}
                </Typography>
                <Typography variant="caption" sx={{ color: '#9ca3af', ml: 1 }}>
                  ({formatFullDate(task.due_date)})
                </Typography>
              </Box>

              {/* INFORMACIÓN DETALLADA - DISEÑO LIMPIO Y PROFESIONAL */}
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                gap: 2, 
                mb: 2 
              }}>
                {/* PROYECTO */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#3b82f6',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Assignment sx={{ fontSize: '16px', color: '#ffffff' }} />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{ 
                      color: '#64748b', 
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      mb: 0.5
                    }}>
                      PROYECTO
                    </Typography>
                    <Typography variant="body2" sx={{ 
                      color: '#1e293b', 
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      lineHeight: 1.2
                    }}>
                      {task.project_name || task.project?.name || 'Sin proyecto asignado'}
                    </Typography>
                  </Box>
                </Box>

                {/* CREADO POR */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#f0f9ff',
                  borderRadius: '8px',
                  border: '1px solid #e0f2fe'
                }}>
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#0ea5e9',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {getUserInitials(task.created_by_name || task.created_by_user?.name || task.created_by || 'Sistema')}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{
                      color: '#0369a1',
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      mb: 0.5
                    }}>
                      CREADO POR
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#0c4a6e',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      lineHeight: 1.2
                    }}>
                      {(() => {
                        // Intentar obtener el nombre del creador
                        let createdByName = task.created_by_name || 
                                          task.created_by_user?.name || 
                                          task.created_by;
                        
                        // Si created_by es un número (ID), buscar el usuario en la lista
                        if (typeof createdByName === 'number' || (typeof createdByName === 'string' && /^\d+$/.test(createdByName))) {
                          const userId = typeof createdByName === 'string' ? parseInt(createdByName) : createdByName;
                          const user = users?.find(u => u.id === userId);
                          
                          if (user) {
                            return user.name || user.nombre || user.email || `Usuario ${userId}`;
                          } else {
                            return `Usuario ${userId}`;
                          }
                        }
                        
                        return createdByName || 'Sistema';
                      })()}
                    </Typography>
                  </Box>
                </Box>

                {/* ASIGNADO A */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#f0fdf4',
                  borderRadius: '8px',
                  border: '1px solid #dcfce7'
                }}>
                  <Avatar sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#16a34a',
                    fontSize: '0.875rem',
                    fontWeight: 'bold'
                  }}>
                    {getUserInitials(task.assigned_to_name || task.assigned_to_user?.name || task.assigned_to || 'Sin asignar')}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{
                      color: '#15803d',
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      mb: 0.5
                    }}>
                      ASIGNADO A
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#14532d',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      lineHeight: 1.2
                    }}>
                      {(() => {
                        // Intentar obtener el nombre del usuario asignado
                        let assignedName = task.assigned_to_name || 
                                         task.assigned_to_user?.name || 
                                         task.assigned_to_user_name ||
                                         task.assigned_to;
                        
                        // Si assigned_to es un número (ID), buscar el usuario en la lista
                        if (typeof assignedName === 'number' || (typeof assignedName === 'string' && /^\d+$/.test(assignedName))) {
                          const userId = typeof assignedName === 'string' ? parseInt(assignedName) : assignedName;
                          const user = users?.find(u => u.id === userId);
                          
                          if (user) {
                            return user.name || user.nombre || user.email || `Usuario ${userId}`;
                          } else {
                            return `Usuario ${userId}`;
                          }
                        }
                        
                        return assignedName || 'Sin asignar';
                      })()}
                    </Typography>
                  </Box>
                </Box>

                {/* PROGRESO */}
                <Box sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  p: 2,
                  backgroundColor: '#fffbeb',
                  borderRadius: '8px',
                  border: '1px solid #fed7aa'
                }}>
                  <Box sx={{
                    width: 32,
                    height: 32,
                    backgroundColor: '#f59e0b',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <TrendingUp sx={{ fontSize: '16px', color: '#ffffff' }} />
                  </Box>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="caption" sx={{
                      color: '#d97706',
                      fontWeight: '600',
                      fontSize: '0.75rem',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                      display: 'block',
                      mb: 0.5
                    }}>
                      PROGRESO
                    </Typography>
                    <Typography variant="body2" sx={{
                      color: '#92400e',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      lineHeight: 1.2
                    }}>
                      {task.progress || 0}%
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>

          </CardContent>
        </Card>
      </motion.div>

      {/* MODAL DE VISTA PREVIA DE TAREA */}
      <Dialog
        open={showPreview}
        onClose={() => setShowPreview(false)}
        maxWidth="md"
        fullWidth
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: '16px',
            boxShadow: '0 24px 56px rgba(0,0,0,0.2)',
            overflow: 'visible'
          }
        }}
      >
        <Box sx={{
          background: `linear-gradient(135deg, ${statusColors.bg}, ${priorityColors.bg})`,
          p: 3,
          borderRadius: '16px 16px 0 0',
          position: 'relative',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '4px',
            background: `linear-gradient(90deg, ${statusColors.text}, ${priorityColors.text})`
          }
        }}>
          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 3 }}>
            <Avatar sx={{
              width: 48,
              height: 48,
              bgcolor: statusColors.text,
              fontSize: '1rem',
              fontWeight: 'bold'
            }}>
              {getUserInitials(task.title)}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h5" sx={{
                fontWeight: '700',
                color: '#0f172a',
                mb: 1,
                lineHeight: 1.2
              }}>
                {task.title}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                <Chip
                  label={task.status}
                  size="small"
                  sx={{
                    backgroundColor: statusColors.text,
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}
                />
                <Chip
                  label={task.priority || 'Media'}
                  size="small"
                  sx={{
                    backgroundColor: priorityColors.text,
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.75rem'
                  }}
                />
                <Chip
                  label={`${task.progress || 0}% completado`}
                  size="small"
                  icon={<TrendingUp />}
                  sx={{
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    color: '#10b981',
                    fontWeight: '600',
                    fontSize: '0.75rem',
                    border: '1px solid rgba(16, 185, 129, 0.2)'
                  }}
                />
              </Box>
            </Box>
            <IconButton
              onClick={() => setShowPreview(false)}
              sx={{
                color: '#6b7280',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.1)',
                  color: '#374151'
                }
              }}
            >
              ✕
            </IconButton>
          </Box>
        </Box>

        <DialogContent sx={{ p: 3, maxHeight: '70vh', overflow: 'auto' }}>
          <Grid container spacing={3}>
            {/* Descripción completa */}
            <Grid item xs={12}>
              <Paper sx={{
                p: 3,
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: '600',
                  color: '#1e293b',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Comment sx={{ fontSize: '1.2rem', color: '#64748b' }} />
                  Descripción
                </Typography>
                <Typography variant="body1" sx={{
                  color: '#475569',
                  lineHeight: 1.7,
                  fontSize: '0.95rem',
                  whiteSpace: 'pre-wrap'
                }}>
                  {task.description || 'No hay descripción disponible para esta tarea.'}
                </Typography>
              </Paper>
            </Grid>

            {/* Información del proyecto */}
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: 3,
                backgroundColor: '#eff6ff',
                borderRadius: '12px',
                border: '1px solid #dbeafe',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: '600',
                  color: '#1e40af',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Assignment sx={{ fontSize: '1.2rem' }} />
                  Proyecto
                </Typography>
                <Typography variant="body1" sx={{
                  color: '#1e3a8a',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}>
                  {task.project_name || 'Sin proyecto asignado'}
                </Typography>
              </Paper>
            </Grid>

            {/* Fechas */}
            <Grid item xs={12} md={6}>
              <Paper sx={{
                p: 3,
                backgroundColor: '#fef3c7',
                borderRadius: '12px',
                border: '1px solid #fde68a',
                height: '100%'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: '600',
                  color: '#92400e',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <CalendarToday sx={{ fontSize: '1.2rem' }} />
                  Fecha límite
                </Typography>
                <Typography variant="body1" sx={{
                  color: '#78350f',
                  fontWeight: '600'
                }}>
                  {formatDate(task.due_date)}
                </Typography>
                <Typography variant="body2" sx={{
                  color: '#a16207',
                  mt: 1
                }}>
                  {formatFullDate(task.due_date)}
                </Typography>
              </Paper>
            </Grid>

            {/* Personas involucradas */}
            <Grid item xs={12}>
              <Paper sx={{
                p: 3,
                backgroundColor: '#f0f9ff',
                borderRadius: '12px',
                border: '1px solid #e0f2fe'
              }}>
                <Typography variant="h6" sx={{
                  fontWeight: '600',
                  color: '#0c4a6e',
                  mb: 3,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  <Person sx={{ fontSize: '1.2rem' }} />
                  Personas involucradas
                </Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(14, 165, 233, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(14, 165, 233, 0.2)'
                    }}>
                      <Avatar sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#0ea5e9',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        {getUserInitials(task.created_by_name || task.created_by || 'Sistema')}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{
                          color: '#0369a1',
                          fontWeight: '700',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block'
                        }}>
                          Creado por
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: '#0c4a6e',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {task.created_by_name || task.created_by || 'Sistema'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 2,
                      p: 2,
                      backgroundColor: 'rgba(16, 163, 74, 0.1)',
                      borderRadius: '8px',
                      border: '1px solid rgba(16, 163, 74, 0.2)'
                    }}>
                      <Avatar sx={{
                        width: 40,
                        height: 40,
                        bgcolor: '#16a34a',
                        fontSize: '0.9rem',
                        fontWeight: 'bold'
                      }}>
                        {getUserInitials(task.assigned_to_name || task.assigned_to || 'Sin asignar')}
                      </Avatar>
                      <Box>
                        <Typography variant="caption" sx={{
                          color: '#15803d',
                          fontWeight: '700',
                          fontSize: '0.7rem',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px',
                          display: 'block'
                        }}>
                          Asignado a
                        </Typography>
                        <Typography variant="body1" sx={{
                          color: '#14532d',
                          fontWeight: '600',
                          fontSize: '0.9rem'
                        }}>
                          {task.assigned_to_name || task.assigned_to || 'Sin asignar'}
                        </Typography>
                      </Box>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* Barra de progreso expandida */}
            <Grid item xs={12}>
              <Paper sx={{
                p: 3,
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <Box sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 2
                }}>
                  <Typography variant="h6" sx={{
                    fontWeight: '600',
                    color: '#1e293b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}>
                    <TrendingUp sx={{ fontSize: '1.2rem', color: '#64748b' }} />
                    Progreso de la tarea
                  </Typography>
                  <Chip
                    label={`${task.progress || 0}%`}
                    sx={{
                      backgroundColor: statusColors.text,
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '0.9rem'
                    }}
                  />
                </Box>
                <LinearProgress
                  variant="determinate"
                  value={task.progress || 0}
                  sx={{
                    height: '12px',
                    borderRadius: '6px',
                    backgroundColor: '#e5e7eb',
                    '& .MuiLinearProgress-bar': {
                      backgroundColor: statusColors.text,
                      borderRadius: '6px',
                      boxShadow: `0 2px 8px ${statusColors.text}40`
                    }
                  }}
                />
              </Paper>
            </Grid>
          </Grid>
        </DialogContent>

        <Box sx={{
          p: 3,
          backgroundColor: '#f8fafc',
          borderTop: '1px solid #e2e8f0',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: 2
        }}>
          <Button
            onClick={() => setShowPreview(false)}
            variant="outlined"
            sx={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              '&:hover': {
                borderColor: '#9ca3af',
                backgroundColor: '#f9fafb'
              }
            }}
          >
            Cerrar
          </Button>
          {/* Botones de acción rápida */}
          {task.status?.toLowerCase() === 'pendiente' && (
            <Button
              onClick={() => {
                setShowPreview(false);
                handleStartTask();
              }}
              variant="contained"
              startIcon={<PlayArrow />}
              sx={{
                backgroundColor: '#3b82f6',
                '&:hover': { backgroundColor: '#2563eb' }
              }}
            >
              Iniciar tarea
            </Button>
          )}
        </Box>
      </Dialog>

      {/* DIALOG DE COMPLETAR TAREA */}
      <Dialog
        open={showCompletionDialog}
        onClose={() => setShowCompletionDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CheckCircle sx={{ color: '#10b981' }} />
            <Typography variant="h6">Completar Tarea</Typography>
          </Box>
        </DialogTitle>

        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            ¿Estás seguro de que quieres marcar esta tarea como completada?
          </Typography>

          <Typography variant="h6" sx={{ mb: 2, color: '#1e293b' }}>
            {task.title}
          </Typography>

          <TextField
            label="Notas de finalización (opcional)"
            multiline
            rows={4}
            fullWidth
            value={completionNotes}
            onChange={(e) => setCompletionNotes(e.target.value)}
            placeholder="Describe qué se completó o cualquier nota relevante..."
            sx={{ mt: 2 }}
          />
        </DialogContent>

        <DialogActions sx={{ p: 3, gap: 1 }}>
          <Button
            onClick={() => setShowCompletionDialog(false)}
            variant="outlined"
            disabled={isCompleting}
          >
            Cancelar
          </Button>
          <Button
            onClick={confirmCompleteTask}
            variant="contained"
            disabled={isCompleting}
            startIcon={isCompleting ? null : <DoneAll />}
            sx={{
              backgroundColor: '#10b981',
              '&:hover': { backgroundColor: '#059669' }
            }}
          >
            {isCompleting ? 'Completando...' : 'Completar Tarea'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

// 🎯 COMPONENTE PRINCIPAL
const MyTasksDashboard = () => {
  const { profileData } = useContext(GlobalContext);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');
  const { success: notifySuccess, error: notifyError } = useNotify();

  // 📊 ESTADÍSTICAS DE TAREAS
  const taskStats = React.useMemo(() => {
    const stats = {
      total: tasks.length,
      pending: tasks.filter(t => ['pendiente', 'todo'].includes(t.status?.toLowerCase())).length,
      inProgress: tasks.filter(t => ['en progreso', 'in_progress'].includes(t.status?.toLowerCase())).length,
      review: tasks.filter(t => ['en revisión', 'review'].includes(t.status?.toLowerCase())).length,
      completed: tasks.filter(t => ['completada', 'done', 'completed'].includes(t.status?.toLowerCase())).length,
      overdue: 0,
      // Nuevas estadísticas para tareas en revisión del creador
      reviewForCreator: tasks.filter(t => 
        ['en revisión', 'review'].includes(t.status?.toLowerCase()) && 
        (t.created_by_id === profileData?.id || t.creator_id === profileData?.id)
      ).length,
      assignedToMe: tasks.filter(t => 
        t.assigned_to === profileData?.id || t.assigned_to_id === profileData?.id
      ).length
    };

    // Calcular tareas vencidas
    const now = new Date();
    stats.overdue = tasks.filter(t => {
      if (!t.due_date || ['completada', 'done', 'completed'].includes(t.status?.toLowerCase())) return false;
      return new Date(t.due_date) < now;
    }).length;

    return stats;
  }, [tasks, profileData?.id]);

  // 🔄 OBTENER TAREAS ASIGNADAS AL USUARIO
  const fetchMyTasks = useCallback(async () => {
    // Usar el ID del usuario logueado (profileData.id) o fallback a 29
    const userId = profileData?.id || 29;
    
    if (!userId) {
      return;
    }

    try {
      setLoading(true);

      // Llamada real al backend con URL completa - USAR TAREAS REALES
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8765';
      const fullUrl = `${apiUrl}/api/management-tasks/user/${userId}`;

      const response = await fetch(fullUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      if (response.ok) {
        const data = await response.json();

        // Mapear estados del backend al frontend
        const mappedTasks = (data.data || []).map(task => ({
          ...task,
          status: mapBackendStatus(task.status),
          priority: task.priority || 'media',
          project_name: task.project_name || 'Sin proyecto asignado',
          created_by: task.created_by_name || task.created_by || 'Sistema',
          progress: task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : task.status === 'review' ? 75 : 0,
          // Agregar información sobre el tipo de tarea
          task_type: task.task_type || 'assigned',
          is_review_for_creator: task.task_type === 'created_for_review',
          created_by_id: task.created_by,
          creator_id: task.created_by
        }));

        setTasks(mappedTasks);
        
        // Cargar usuarios para mostrar nombres reales
        try {
          const usersResponse = await fetch(`${apiUrl}/api/usuarios`, {
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' }
          });
          
          if (usersResponse.ok) {
            const usersData = await usersResponse.json();
            const formattedUsers = (usersData.data || usersData || []).map(user => ({
              id: user.id,
              name: user.name || user.nombre || user.email?.split('@')[0] || `Usuario ${user.id}`,
              email: user.email
            }));
            setUsers(formattedUsers);
          }
        } catch (usersError) {
        }
        
      } else {

        const errorText = await response.text();

        // Datos informativos sobre el problema
        setTasks([
          {
            id: 1,
            title: 'Endpoint de tareas en desarrollo',
            description: `El sistema está conectando con la base de datos real. Ve a la pestaña "Tareas" del módulo para crear tareas que aparecerán aquí automáticamente.`,
            status: 'todo',
            priority: 'alta',
            due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
            progress: 0,
            project_name: 'Sin proyecto asignado',
            assigned_to: profileData.id,
            created_by: 'Sistema'
          }
        ]);
      }

    } catch (error) {
      console.error('❌ Error cargando tareas:', error);
      // Fallback con mensaje informativo
      setTasks([
        {
          id: 1,
          title: 'Sistema conectando con base de datos',
          description: 'El dashboard está configurado y listo. Las tareas reales aparecerán aquí cuando sean asignadas desde el módulo de gestión de proyectos.',
          status: 'todo',
          priority: 'alta',
          due_date: new Date().toISOString(),
          progress: 0,
          project_name: 'Sistema de Gestión',
          assigned_to: profileData.id,
          created_by: 'Sistema'
        }
      ]);
    } finally {
      setLoading(false);
    }
  }, [profileData?.id]);

  // 🔄 MAPEAR ESTADOS DEL BACKEND AL FRONTEND
  const mapBackendStatus = (backendStatus) => {
    const statusMap = {
      'todo': 'pendiente',
      'in_progress': 'en progreso',
      'review': 'en revisión',
      'done': 'completada',
      'completed': 'completada',
      'pending': 'pendiente'
    };
    return statusMap[backendStatus] || backendStatus;
  };

  // 🔄 MAPEAR ESTADOS DEL FRONTEND AL BACKEND
  const mapFrontendStatus = (frontendStatus) => {
    const statusMap = {
      'pendiente': 'todo',
      'en progreso': 'in_progress',
      'en revisión': 'review',
      'completada': 'done'
    };
    return statusMap[frontendStatus] || frontendStatus;
  };

  // 🔐 VERIFICAR PERMISOS PARA CAMBIAR ESTADO
  const canChangeTaskStatus = (task, newStatus) => {
    const currentUserId = profileData?.id;
    const isCreator = task.created_by_id === currentUserId || task.creator_id === currentUserId;
    const isAssigned = task.assigned_to === currentUserId || task.assigned_to_id === currentUserId;

    // Verificar permisos para cambiar estado

    // Regla 1: Solo el CREADOR puede marcar como COMPLETADA
    if (newStatus === 'completada' && !isCreator) {
      return {
        allowed: false,
        reason: 'Solo el creador de la tarea puede marcarla como finalizada'
      };
    }

    // Regla 2: El usuario ASIGNADO puede mover hasta REVISIÓN pero no a COMPLETADA directamente
    if (!isCreator && isAssigned && newStatus === 'completada') {
      return {
        allowed: false,
        reason: 'Como usuario asignado, solo puedes enviar la tarea a revisión. El creador debe aprobar la finalización.'
      };
    }

    // Regla 3: Si la tarea está en revisión, solo el CREADOR puede cambiarla
    if (task.status === 'en revisión' && !isCreator) {
      return {
        allowed: false,
        reason: 'Solo el creador puede cambiar el estado de una tarea en revisión'
      };
    }

    // Regla 4: Verificar transiciones válidas según el rol
    const validTransitions = {
      'pendiente': ['en progreso'],
      'en progreso': isCreator ? ['en revisión', 'completada'] : ['en revisión'], // El asignado solo puede enviar a revisión
      'en revisión': isCreator ? ['en progreso', 'completada'] : [], // Solo el creador puede cambiar desde revisión
      'completada': [] // No se puede cambiar desde completada
    };

    const allowedStates = validTransitions[task.status] || [];
    if (!allowedStates.includes(newStatus)) {
      return {
        allowed: false,
        reason: `No puedes cambiar de "${task.status}" a "${newStatus}" con tu rol actual`
      };
    }

    // Regla 5: Solo usuarios involucrados en la tarea pueden cambiarla
    if (!isCreator && !isAssigned) {
      return {
        allowed: false,
        reason: 'Solo el creador o el usuario asignado pueden cambiar esta tarea'
      };
    }

    return { allowed: true };
  };

  // 🔄 REFRESH MANUAL
  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchMyTasks();
    setRefreshing(false);
    notifySuccess({ title: 'Tareas actualizadas', description: 'La lista de tareas se ha actualizado correctamente' });
  };

  // ✅ CAMBIAR ESTADO DE TAREA
  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      // Verificar permisos antes de hacer el cambio
      const permission = canChangeTaskStatus(task, newStatus);
      if (!permission.allowed) {
        notifyError({
          title: 'Cambio no permitido',
          description: permission.reason
        });
        return;
      }

      // Actualizar localmente primero para UX inmediata
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      // Llamar al API real
      const backendStatus = mapFrontendStatus(newStatus);
      await taskManagementService.updateTask(taskId, { status: backendStatus });

      notifySuccess({
        title: `Tarea actualizada a: ${newStatus}`,
        description: 'El estado se ha sincronizado con el tablero kanban'
      });
    } catch (error) {
      console.error('❌ Error updating task status:', error);
      notifyError({
        title: 'Error al actualizar la tarea',
        description: error.message || 'No se pudo actualizar el estado de la tarea'
      });
      // Revertir cambio local
      await fetchMyTasks();
    }
  };

  // ✅ COMPLETAR TAREA
  const handleCompleteTask = async (taskId, notes) => {
    try {
      // Actualizar localmente primero
      setTasks(prev => prev.map(task =>
        task.id === taskId ? {
          ...task,
          status: 'completada',
          progress: 100,
          completion_notes: notes,
          completed_at: new Date().toISOString()
        } : task
      ));

      // Llamar al API real
      await taskManagementService.updateTask(taskId, {
        status: 'done',
        progress: 100,
        completion_notes: notes
      });

      notifySuccess({
        title: '¡Tarea completada exitosamente!',
        description: 'La tarea se ha marcado como completada'
      });
    } catch (error) {
      console.error('❌ Error completing task:', error);
      notifyError({
        title: 'Error al completar la tarea',
        description: error.message || 'No se pudo completar la tarea'
      });
      await fetchMyTasks();
    }
  };

  // 📝 FILTRAR TAREAS
  const filteredTasks = React.useMemo(() => {
    switch (filter) {
      case 'pending':
        return tasks.filter(t => ['pendiente', 'todo'].includes(t.status?.toLowerCase()));
      case 'inProgress':
        return tasks.filter(t => ['en progreso', 'in_progress'].includes(t.status?.toLowerCase()));
      case 'review':
        return tasks.filter(t => ['en revisión', 'review'].includes(t.status?.toLowerCase()));
      case 'completed':
        return tasks.filter(t => ['completada', 'done', 'completed'].includes(t.status?.toLowerCase()));
      default:
        // Por defecto, mostrar todas las tareas EXCEPTO las completadas
        return tasks.filter(t => !['completada', 'done', 'completed'].includes(t.status?.toLowerCase()));
    }
  }, [tasks, filter]);

  // 🚀 EFECTO INICIAL
  useEffect(() => {

    fetchMyTasks();
  }, [fetchMyTasks]);

  if (loading) {
    return (
      <Box sx={{ p: 3 }}>
        <Typography>Cargando tus tareas...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
      p: 0
    }}>
      {/* HEADER MEJORADO */}
      <Box sx={{ 
        background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
        p: 4,
        color: 'white'
      }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: 'white', 
                mb: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}>
                📋 Mis Tareas
              </Typography>
              <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                Gestiona tus tareas asignadas de forma eficiente
              </Typography>
            </Box>

            <Button
              onClick={handleRefresh}
              disabled={refreshing}
              startIcon={<Refresh />}
              variant="contained"
              sx={{ 
                height: 'fit-content',
                backgroundColor: 'rgba(255,255,255,0.1)',
                color: 'white',
                border: '1px solid rgba(255,255,255,0.2)',
                backdropFilter: 'blur(10px)',
                '&:hover': {
                  backgroundColor: 'rgba(255,255,255,0.2)'
                }
              }}
            >
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </Button>
          </Box>
        </Box>
      </Box>

      {/* CONTENIDO PRINCIPAL */}
      <Box sx={{ 
        background: '#f8fafc',
        minHeight: 'calc(100vh - 200px)',
        p: 4
      }}>
        <Box sx={{ maxWidth: '1200px', mx: 'auto' }}>

          {/* ESTADÍSTICAS MEJORADAS */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid item xs={6} sm={6} md={2.4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2.5rem' }}>
                  {taskStats.total}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>Total</Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(245, 158, 11, 0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(245, 158, 11, 0.4)'
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2.5rem' }}>
                  {taskStats.pending}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>Pendientes</Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(59, 130, 246, 0.4)'
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2.5rem' }}>
                  {taskStats.inProgress}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>En Progreso</Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(139, 92, 246, 0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(139, 92, 246, 0.4)'
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2.5rem' }}>
                  {taskStats.review}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>En Revisión</Typography>
              </Paper>
            </Grid>

            <Grid item xs={6} sm={6} md={2.4}>
              <Paper
                sx={{
                  p: 3,
                  borderRadius: '20px',
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  textAlign: 'center',
                  boxShadow: '0 8px 32px rgba(16, 185, 129, 0.3)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 12px 40px rgba(16, 185, 129, 0.4)'
                  }
                }}
              >
                <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 1, fontSize: '2.5rem' }}>
                  {taskStats.completed}
                </Typography>
                <Typography variant="body2" sx={{ fontSize: '0.9rem', opacity: 0.9 }}>Completadas</Typography>
              </Paper>
            </Grid>
          </Grid>

          {/* ALERTA ESPECIAL PARA TAREAS EN REVISIÓN DEL CREADOR */}
          {taskStats.reviewForCreator > 0 && (
            <Box sx={{ mb: 3 }}>
              <Alert 
                severity="warning" 
                sx={{ 
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                  border: '2px solid #f59e0b',
                  '& .MuiAlert-icon': {
                    color: '#d97706',
                    fontSize: '1.5rem'
                  },
                  '& .MuiAlert-message': {
                    color: '#92400e',
                    fontWeight: 600
                  }
                }}
                icon={<NotificationsActive />}
              >
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1, color: '#92400e' }}>
                  👀 ¡Tienes {taskStats.reviewForCreator} tarea{taskStats.reviewForCreator > 1 ? 's' : ''} esperando tu revisión!
                </Typography>
                <Typography variant="body2" sx={{ color: '#92400e', opacity: 0.9 }}>
                  El usuario asignado ha completado el trabajo y necesita tu aprobación para finalizar la tarea.
                </Typography>
              </Alert>
            </Box>
          )}

          {/* FILTROS MEJORADOS */}
          <Box sx={{ mb: 4 }}>
            <FormControl size="small" sx={{ 
              minWidth: 200,
              '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                backgroundColor: 'white',
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }
            }}>
              <InputLabel sx={{ color: '#6b7280' }}>Filtrar por estado</InputLabel>
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                label="Filtrar por estado"
                sx={{
                  borderRadius: '12px',
                  '& .MuiSelect-select': {
                    padding: '12px 16px'
                  }
                }}
              >
                <MenuItem value="all">Todas las tareas (activas)</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="inProgress">En progreso</MenuItem>
                <MenuItem value="review">En revisión</MenuItem>
                <MenuItem value="completed">Completadas</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* LISTA DE TAREAS MEJORADA */}
          {filteredTasks.length === 0 ? (
            <Box sx={{ 
              textAlign: 'center', 
              py: 8,
              backgroundColor: 'white',
              borderRadius: '20px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              border: '1px solid rgba(0,0,0,0.05)'
            }}>
              <Assignment sx={{ fontSize: 64, color: '#cbd5e1', mb: 2 }} />
              <Typography variant="h6" sx={{ color: '#64748b', mb: 1 }}>
                No hay tareas para mostrar
              </Typography>
              <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                {filter === 'all'
                  ? 'No tienes tareas asignadas actualmente'
                  : `No hay tareas con el filtro seleccionado`
                }
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              <AnimatePresence>
                {filteredTasks.map((task) => (
                  <Grid item xs={12} md={6} lg={4} key={task.id}>
                    <TaskCard
                      task={task}
                      onStatusChange={handleStatusChange}
                      onComplete={handleCompleteTask}
                      currentUser={profileData}
                      users={users}
                      canChangeTaskStatus={canChangeTaskStatus}
                    />
                  </Grid>
                ))}
              </AnimatePresence>
            </Grid>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default MyTasksDashboard;