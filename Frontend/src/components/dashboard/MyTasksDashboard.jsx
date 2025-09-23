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
const TaskCard = ({ task, onStatusChange, onComplete, currentUser }) => {
  const [isCompleting, setIsCompleting] = useState(false);
  const [completionNotes, setCompletionNotes] = useState('');
  const [showCompletionDialog, setShowCompletionDialog] = useState(false);

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
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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
            borderRadius: '12px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            border: `1px solid ${statusColors.border}`,
            background: 'linear-gradient(135deg, #ffffff 0%, #fafbfc 100%)',
            transition: 'all 0.3s ease',
            height: '420px', // Altura aumentada para mostrar todas las secciones
            display: 'flex',
            flexDirection: 'column',
            '&:hover': {
              boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
              transform: 'translateY(-2px)',
              border: `1px solid ${statusColors.text}40`
            }
          }}
        >
          <CardContent sx={{ 
            p: 2.5,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            overflow: 'visible' // Asegurar que todo el contenido sea visible
          }}>
            {/* HEADER DE LA TAREA */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: '600',
                    color: '#1f2937',
                    mb: 1.5,
                    fontSize: '1rem',
                    lineHeight: 1.4,
                    minHeight: '2.8rem', // Altura fija para título
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}
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

              {/* ACCIONES RÁPIDAS */}
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

                {/* EN PROGRESO → REVISIÓN o COMPLETADA */}
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
                    <Tooltip title="Marcar como completada">
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
                  </>
                )}

                {/* EN REVISIÓN → PROGRESO o COMPLETADA */}
                {task.status?.toLowerCase() === 'en revisión' && (
                  <>
                    <Tooltip title="Devolver a progreso">
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
                    <Tooltip title="Aprobar y completar">
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
                  </>
                )}
              </Box>
            </Box>

            {/* DESCRIPCIÓN */}
            <Typography
              variant="body2"
              sx={{
                color: '#6b7280',
                mb: 2,
                lineHeight: 1.5,
                fontSize: '0.875rem',
                minHeight: '3rem', // Altura fija para descripción
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {task.description || 'Sin descripción'}
            </Typography>

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

              {/* PROYECTO - MÁS PROMINENTE */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1, 
                mb: 1,
                p: 1,
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <Assignment sx={{ fontSize: '16px', color: '#3b82f6' }} />
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: '#64748b', 
                    fontWeight: '500',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    PROYECTO
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#1e293b', 
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    lineHeight: 1.2
                  }}>
                    {task.project_name || 'Sin proyecto asignado'}
                  </Typography>
                </Box>
              </Box>

              {/* ASIGNADO POR */}
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                p: 1,
                backgroundColor: '#f0f9ff',
                borderRadius: '6px',
                border: '1px solid #e0f2fe',
                minHeight: '3rem' // Altura mínima para asegurar visibilidad
              }}>
                <Person sx={{ fontSize: '16px', color: '#0ea5e9' }} />
                <Box>
                  <Typography variant="caption" sx={{ 
                    color: '#0369a1', 
                    fontWeight: '600',
                    fontSize: '0.7rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    ASIGNADO POR
                  </Typography>
                  <Typography variant="body2" sx={{ 
                    color: '#0c4a6e', 
                    fontWeight: '600',
                    fontSize: '0.8rem',
                    lineHeight: 1.2
                  }}>
                    {task.created_by || 'Sistema'}
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* PROGRESO */}
            <Box sx={{ 
              mb: 1,
              minHeight: '3rem', // Altura aumentada para mejor espaciado
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              p: 1.5, // Padding interno para más espacio
              backgroundColor: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 1.5 // Más espacio entre texto y barra
              }}>
                <Typography variant="caption" sx={{ 
                  color: '#6b7280', 
                  fontWeight: '600',
                  fontSize: '0.8rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Progreso
                </Typography>
                <Typography variant="body2" sx={{ 
                  color: '#374151', 
                  fontWeight: '700',
                  fontSize: '0.9rem'
                }}>
                  {task.progress || 0}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={task.progress || 0}
                sx={{
                  height: '8px', // Barra más gruesa
                  borderRadius: '4px',
                  backgroundColor: '#e5e7eb',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: statusColors.text,
                    borderRadius: '4px',
                    transition: 'all 0.3s ease'
                  }
                }}
              />
            </Box>
          </CardContent>
        </Card>
      </motion.div>

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
      overdue: 0
    };

    // Calcular tareas vencidas
    const now = new Date();
    stats.overdue = tasks.filter(t => {
      if (!t.due_date || ['completada', 'done', 'completed'].includes(t.status?.toLowerCase())) return false;
      return new Date(t.due_date) < now;
    }).length;

    return stats;
  }, [tasks]);

  // 🔄 OBTENER TAREAS ASIGNADAS AL USUARIO
  const fetchMyTasks = useCallback(async () => {
    // Usar el ID del usuario logueado (profileData.id) o fallback a 29
    const userId = profileData?.id || 29;
    
    if (!userId) {
      console.log('❌ No hay userId disponible:', profileData);
      return;
    }

    try {
      setLoading(true);

      console.log('🔄 Cargando tareas para usuario logueado:', {
      userId: userId,
      userName: profileData?.name || 'Usuario',
      userEmail: profileData?.email || 'Sin email',
      profileData: profileData
    });
      
      // Llamada real al backend con URL completa - USAR TAREAS REALES
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8765';
      const fullUrl = `${apiUrl}/api/management-tasks/user/${userId}`;
      console.log('🔍 URL completa (TAREAS REALES):', fullUrl);

      const response = await fetch(fullUrl, {
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' }
      });

      console.log('🔍 Respuesta del servidor:', response.status, response.statusText);

      if (response.ok) {
        const data = await response.json();
        console.log('✅ Tareas reales obtenidas:', data.data?.length || 0);
        console.log('🔍 Datos completos:', data);

        // Mapear estados del backend al frontend
        const mappedTasks = (data.data || []).map(task => ({
          ...task,
          status: mapBackendStatus(task.status),
          priority: task.priority || 'media',
          project_name: task.project_name || 'Sin proyecto asignado',
          created_by: task.created_by_name || task.created_by || 'Sistema',
          progress: task.status === 'done' ? 100 : task.status === 'in_progress' ? 50 : task.status === 'review' ? 75 : 0
        }));

        console.log('🔍 Tareas mapeadas:', mappedTasks);
        setTasks(mappedTasks);
      } else {
        console.warn('⚠️ Error en respuesta del servidor:', response.status, response.statusText);
        const errorText = await response.text();
        console.warn('⚠️ Error detalle:', errorText);
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
    // Si la tarea está en revisión, solo el creador puede moverla
    if (task.status === 'en revisión' && task.created_by !== profileData?.id) {
      return {
        allowed: false,
        reason: 'Solo el creador de la tarea puede cambiar su estado desde "En Revisión"'
      };
    }

    // Verificar transiciones válidas
    const validTransitions = {
      'pendiente': ['en progreso'],
      'en progreso': ['en revisión', 'completada'],
      'en revisión': ['en progreso', 'completada'],
      'completada': [] // No se puede cambiar desde completada
    };

    const allowedStates = validTransitions[task.status] || [];
    if (!allowedStates.includes(newStatus)) {
      return {
        allowed: false,
        reason: `No se puede cambiar de "${task.status}" a "${newStatus}"`
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
        return tasks;
    }
  }, [tasks, filter]);

  // 🚀 EFECTO INICIAL
  useEffect(() => {
    console.log('🔍 DEBUG - profileData completo:', profileData);
    console.log('🔍 DEBUG - profileData.id:', profileData?.id);
    console.log('🔍 DEBUG - profileData.role:', profileData?.role);
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
                <MenuItem value="all">Todas las tareas</MenuItem>
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