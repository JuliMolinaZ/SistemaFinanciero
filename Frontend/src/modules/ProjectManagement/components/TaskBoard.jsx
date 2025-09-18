// 📋 TABLERO DE TAREAS KANBAN - REFACTORIZADO CON DISEÑO UNIFICADO
// ================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Box,
  Typography,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  Badge,
  Paper,
  alpha
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Assignment as AssignmentIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  Comment as CommentIcon,
  AttachFile as AttachFileIcon,
  AccessTime as AccessTimeIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  PlayArrow as PlayIcon,
  Pause as PauseIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 🎨 Importar sistema de diseño unificado
import {
  UnifiedCard,
  UnifiedButton,
  UnifiedInput,
  UnifiedAlert,
  UnifiedSkeleton
} from '../../../components/DesignSystem/BaseComponents';
import {
  UnifiedSelect,
  UnifiedFormLayout
} from '../../../components/DesignSystem/FormComponents';
import { designTheme, styleUtils } from '../../../components/DesignSystem';

// 🎯 CARD DE TAREA UNIFICADO
const TaskCard = React.memo(({ task, onEdit, onDelete, onView }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return designTheme.colors.semantic.danger[400];
      case 'high': return designTheme.colors.semantic.warning[400];
      case 'medium': return designTheme.colors.semantic.primary[400];
      case 'low': return designTheme.colors.semantic.success[400];
      default: return designTheme.colors.semantic.neutral[400];
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'critical': return 'Crítica';
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return priority;
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'critical': return <FlagIcon sx={{ fontSize: 12 }} />;
      case 'high': return <WarningIcon sx={{ fontSize: 12 }} />;
      case 'medium': return <InfoIcon sx={{ fontSize: 12 }} />;
      case 'low': return <CheckCircleIcon sx={{ fontSize: 12 }} />;
      default: return <InfoIcon sx={{ fontSize: 12 }} />;
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-CL');
  };

  const isOverdue = (dueDate) => {
    if (!dueDate) return false;
    return new Date(dueDate) < new Date();
  };

  const overdue = isOverdue(task.due_date);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      whileHover={{ scale: 1.02 }}
    >
      <UnifiedCard
        variant="glass"
        sx={{
          mb: 2,
          cursor: 'pointer',
          position: 'relative',
          border: overdue ? `1px solid ${designTheme.colors.semantic.danger[400]}` : undefined,
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '3px',
            background: overdue
              ? designTheme.gradients.danger
              : `linear-gradient(90deg, ${getPriorityColor(task.priority)} 0%, ${alpha(getPriorityColor(task.priority), 0.8)} 100%)`,
          },
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: overdue ? designTheme.shadows.glowDanger : designTheme.shadows.glow,
          },
          transition: `all ${designTheme.animations.duration.normal}`
        }}
      >
        <Box sx={{ p: 2 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
            <Typography variant="subtitle2" sx={{
              fontWeight: 700,
              flexGrow: 1,
              color: designTheme.colors.semantic.neutral[800],
              fontSize: '1rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}>
              {task.title}
            </Typography>
            <IconButton size="small" sx={{ color: designTheme.colors.semantic.neutral[600] }}>
              <MoreVertIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Description */}
          {task.description && (
            <Typography
              variant="body2"
              sx={{
                mb: 1,
                color: designTheme.colors.semantic.neutral[600],
                fontSize: '0.875rem',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {task.description}
            </Typography>
          )}

          {/* Priority and Story Points */}
          <Box sx={{ display: 'flex', gap: 1, mb: 1, flexWrap: 'wrap' }}>
            <Chip
              icon={getPriorityIcon(task.priority)}
              label={getPriorityLabel(task.priority)}
              sx={{
                backgroundColor: getPriorityColor(task.priority),
                color: designTheme.colors.semantic.neutral[900],
                fontWeight: 600,
                fontSize: '0.75rem',
                height: 28,
                borderRadius: designTheme.borderRadius.md,
                boxShadow: `0 4px 15px ${alpha(getPriorityColor(task.priority), 0.4)}`,
                '&:hover': {
                  transform: 'scale(1.05)',
                },
                transition: `all ${designTheme.animations.duration.normal}`
              }}
              size="small"
            />
            {task.story_points && (
              <Chip
                label={`${task.story_points} pts`}
                size="small"
                sx={{
                  backgroundColor: designTheme.colors.semantic.neutral[200],
                  color: designTheme.colors.semantic.neutral[700],
                  fontWeight: 500,
                  fontSize: '0.75rem',
                  height: 24,
                }}
              />
            )}
          </Box>

          {/* Assignee */}
          {task.assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
              <Avatar src={task.assignee.avatar} sx={{ width: 20, height: 20 }}>
                {task.assignee.name?.charAt(0) || 'U'}
              </Avatar>
              <Typography variant="caption" sx={{
                color: designTheme.colors.semantic.neutral[600],
                fontSize: '0.75rem',
                fontWeight: 500
              }}>
                {task.assignee.name}
              </Typography>
            </Box>
          )}

          {/* Due Date */}
          {task.due_date && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1 }}>
              <ScheduleIcon sx={{
                fontSize: 12,
                color: overdue ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.neutral[600]
              }} />
              <Typography
                variant="caption"
                sx={{
                  color: overdue ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.neutral[600],
                  fontWeight: overdue ? 600 : 500,
                  fontSize: '0.75rem'
                }}
              >
                {formatDate(task.due_date)}
              </Typography>
            </Box>
          )}

          {/* Stats */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              {task._count?.comments > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <CommentIcon sx={{ fontSize: 12, color: designTheme.colors.semantic.neutral[600] }} />
                  <Typography variant="caption" sx={{
                    color: designTheme.colors.semantic.neutral[600],
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {task._count.comments}
                  </Typography>
                </Box>
              )}
              {task._count?.attachments > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AttachFileIcon sx={{ fontSize: 12, color: designTheme.colors.semantic.neutral[600] }} />
                  <Typography variant="caption" sx={{
                    color: designTheme.colors.semantic.neutral[600],
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {task._count.attachments}
                  </Typography>
                </Box>
              )}
              {task.actual_hours > 0 && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTimeIcon sx={{ fontSize: 12, color: designTheme.colors.semantic.neutral[600] }} />
                  <Typography variant="caption" sx={{
                    color: designTheme.colors.semantic.neutral[600],
                    fontSize: '0.75rem',
                    fontWeight: 500
                  }}>
                    {task.actual_hours}h
                  </Typography>
                </Box>
              )}
            </Box>

            <Box sx={{ display: 'flex', gap: 0.5 }}>
              <Tooltip title="Ver detalles">
                <IconButton
                  size="small"
                  onClick={() => onView && onView(task)}
                  sx={{
                    p: 0.5,
                    color: designTheme.colors.semantic.primary[500],
                    '&:hover': { backgroundColor: alpha(designTheme.colors.semantic.primary[500], 0.1) }
                  }}
                >
                  <VisibilityIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Editar">
                <IconButton
                  size="small"
                  onClick={() => onEdit && onEdit(task)}
                  sx={{
                    p: 0.5,
                    color: designTheme.colors.semantic.success[500],
                    '&:hover': { backgroundColor: alpha(designTheme.colors.semantic.success[500], 0.1) }
                  }}
                >
                  <EditIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
              <Tooltip title="Eliminar">
                <IconButton
                  size="small"
                  onClick={() => onDelete && onDelete(task.id)}
                  sx={{
                    p: 0.5,
                    color: designTheme.colors.semantic.danger[500],
                    '&:hover': { backgroundColor: alpha(designTheme.colors.semantic.danger[500], 0.1) }
                  }}
                >
                  <DeleteIcon sx={{ fontSize: 14 }} />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
        </Box>
      </UnifiedCard>
    </motion.div>
  );
});

TaskCard.displayName = 'TaskCard';

// 🎯 COMPONENTE PRINCIPAL DEL TABLERO
const TaskBoard = ({
  projects = [],
  tasks = [],
  onTaskUpdate,
  onTaskCreate
}) => {
  const [localTasks, setLocalTasks] = useState(tasks);
  const [selectedProject, setSelectedProject] = useState('');
  const [selectedSprint, setSelectedSprint] = useState('');
  const [loading, setLoading] = useState(false);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [sprints, setSprints] = useState([]);
  const [users, setUsers] = useState([]);

  // 🎨 Configuración de columnas con colores unificados
  const columns = useMemo(() => [
    {
      id: 'todo',
      title: 'Por Hacer',
      color: designTheme.colors.semantic.neutral[100],
      accent: designTheme.colors.semantic.warning[400],
      gradient: `linear-gradient(135deg, ${designTheme.colors.semantic.neutral[100]} 0%, ${alpha(designTheme.colors.semantic.warning[50], 0.5)} 100%)`
    },
    {
      id: 'in_progress',
      title: 'En Progreso',
      color: designTheme.colors.semantic.neutral[100],
      accent: designTheme.colors.semantic.primary[400],
      gradient: `linear-gradient(135deg, ${designTheme.colors.semantic.neutral[100]} 0%, ${alpha(designTheme.colors.semantic.primary[50], 0.5)} 100%)`
    },
    {
      id: 'review',
      title: 'En Revisión',
      color: designTheme.colors.semantic.neutral[100],
      accent: designTheme.colors.semantic.warning[500],
      gradient: `linear-gradient(135deg, ${designTheme.colors.semantic.neutral[100]} 0%, ${alpha(designTheme.colors.semantic.warning[100], 0.5)} 100%)`
    },
    {
      id: 'done',
      title: 'Completado',
      color: designTheme.colors.semantic.neutral[100],
      accent: designTheme.colors.semantic.success[400],
      gradient: `linear-gradient(135deg, ${designTheme.colors.semantic.neutral[100]} 0%, ${alpha(designTheme.colors.semantic.success[50], 0.5)} 100%)`
    }
  ], []);

  // Sincronizar tareas locales con props
  useEffect(() => {
    setLocalTasks(tasks);
  }, [tasks]);

  // Cargar datos cuando cambie el proyecto
  useEffect(() => {
    if (selectedProject) {
      loadTasks();
      loadSprints();
      loadUsers();
    }
  }, [selectedProject, selectedSprint]);

  const loadTasks = useCallback(async () => {
    if (!selectedProject) return;

    setLoading(true);
    try {
      const url = selectedSprint
        ? `/api/project-management/projects-debug/${selectedProject}/tasks?sprint_id=${selectedSprint}`
        : `/api/project-management/projects-debug/${selectedProject}/tasks`;

      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setLocalTasks(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedProject, selectedSprint]);

  const loadSprints = useCallback(async () => {
    if (!selectedProject) return;

    try {
      const response = await fetch(`/api/project-management/projects-debug/${selectedProject}/sprints`);
      if (response.ok) {
        const data = await response.json();
        setSprints(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando sprints:', error);
    }
  }, [selectedProject]);

  const loadUsers = useCallback(async () => {
    try {
      const response = await fetch('/api/usuarios');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || []);
      }
    } catch (error) {
      console.error('Error cargando usuarios:', error);
    }
  }, []);

  const handleCreateTask = useCallback(() => {
    setSelectedTask(null);
    setShowTaskForm(true);
    if (onTaskCreate) onTaskCreate();
  }, [onTaskCreate]);

  const handleEditTask = useCallback((task) => {
    setSelectedTask(task);
    setShowTaskForm(true);
  }, []);

  const handleTaskSaved = useCallback((savedTask) => {
    if (selectedTask) {
      setLocalTasks(prev => prev.map(t => t.id === savedTask.id ? savedTask : t));
    } else {
      setLocalTasks(prev => [savedTask, ...prev]);
    }
    setShowTaskForm(false);
    setSelectedTask(null);
    if (onTaskUpdate) onTaskUpdate(savedTask);
  }, [selectedTask, onTaskUpdate]);

  const handleDeleteTask = useCallback(async (taskId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      try {
        const response = await fetch(`/api/project-management/tasks/${taskId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          setLocalTasks(prev => prev.filter(t => t.id !== taskId));
        }
      } catch (error) {
        console.error('Error eliminando tarea:', error);
      }
    }
  }, []);

  const getTasksByStatus = useCallback((status) => {
    return localTasks.filter(task => task.status === status);
  }, [localTasks]);

  return (
    <Box>
      {/* 🔍 Selección de proyecto y sprint */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <UnifiedCard variant="glass" sx={{ mb: 3 }}>
          <Box sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
              <UnifiedSelect
                label="Proyecto"
                value={selectedProject}
                onChange={(e) => {
                  setSelectedProject(e.target.value);
                  setSelectedSprint('');
                }}
                options={projects.map(project => ({
                  value: project.id,
                  label: project.nombre || project.name
                }))}
                sx={{ minWidth: 200 }}
              />

              {selectedProject && (
                <UnifiedSelect
                  label="Sprint"
                  value={selectedSprint}
                  onChange={(e) => setSelectedSprint(e.target.value)}
                  options={[
                    { value: '', label: 'Todos los sprints' },
                    ...sprints.map(sprint => ({
                      value: sprint.id,
                      label: sprint.name
                    }))
                  ]}
                  sx={{ minWidth: 200 }}
                />
              )}

              {selectedProject && (
                <UnifiedButton
                  variant="primary"
                  icon={<AddIcon />}
                  onClick={handleCreateTask}
                >
                  Nueva Tarea
                </UnifiedButton>
              )}
            </Box>
          </Box>
        </UnifiedCard>
      </motion.div>

      {/* 📋 Tablero Kanban */}
      {selectedProject ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {loading ? (
            <Grid container spacing={3}>
              {columns.map((column) => (
                <Grid item xs={12} sm={6} md={3} key={column.id}>
                  <UnifiedSkeleton height={600} />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Grid container spacing={3}>
              {columns.map((column) => {
                const columnTasks = getTasksByStatus(column.id);

                return (
                  <Grid item xs={12} sm={6} md={3} key={column.id}>
                    <Paper sx={{
                      ...styleUtils.createGlassStyle('secondary'),
                      p: 3,
                      minHeight: 600,
                      borderRadius: designTheme.borderRadius.xl,
                      border: `1px solid ${alpha(column.accent, 0.3)}`,
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '4px',
                        background: `linear-gradient(90deg, ${column.accent} 0%, ${alpha(column.accent, 0.8)} 100%)`,
                      }
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
                        <Typography variant="h6" sx={{
                          fontWeight: 700,
                          color: designTheme.colors.semantic.neutral[800],
                          fontSize: '1.1rem',
                          ...styleUtils.createTextGradient([
                            designTheme.colors.semantic.neutral[700],
                            column.accent
                          ])
                        }}>
                          {column.title}
                        </Typography>
                        <Badge
                          badgeContent={columnTasks.length}
                          sx={{
                            '& .MuiBadge-badge': {
                              backgroundColor: column.accent,
                              color: designTheme.colors.semantic.neutral[900],
                              fontWeight: 700,
                              fontSize: '0.75rem',
                              minWidth: 20,
                              height: 20,
                            }
                          }}
                        >
                          <AssignmentIcon sx={{
                            color: column.accent,
                            fontSize: '1.5rem'
                          }} />
                        </Badge>
                      </Box>

                      <Box sx={{
                        maxHeight: 500,
                        overflowY: 'auto',
                        '&::-webkit-scrollbar': {
                          width: '6px',
                        },
                        '&::-webkit-scrollbar-track': {
                          backgroundColor: alpha(designTheme.colors.semantic.neutral[200], 0.3),
                          borderRadius: designTheme.borderRadius.sm,
                        },
                        '&::-webkit-scrollbar-thumb': {
                          backgroundColor: alpha(column.accent, 0.5),
                          borderRadius: designTheme.borderRadius.sm,
                        }
                      }}>
                        <AnimatePresence>
                          {columnTasks.map((task) => (
                            <TaskCard
                              key={task.id}
                              task={task}
                              onEdit={handleEditTask}
                              onDelete={handleDeleteTask}
                              onView={handleEditTask}
                            />
                          ))}
                        </AnimatePresence>
                      </Box>
                    </Paper>
                  </Grid>
                );
              })}
            </Grid>
          )}
        </motion.div>
      ) : (
        <UnifiedAlert severity="info">
          Selecciona un proyecto para ver sus tareas.
        </UnifiedAlert>
      )}

      {/* 📝 Formulario de tarea */}
      <Dialog
        open={showTaskForm}
        onClose={() => setShowTaskForm(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            ...styleUtils.createGlassStyle('secondary'),
            border: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
            boxShadow: designTheme.shadows.xxl,
          }
        }}
      >
        <TaskForm
          task={selectedTask}
          projectId={selectedProject}
          sprintId={selectedSprint}
          users={users}
          onSave={handleTaskSaved}
          onCancel={() => setShowTaskForm(false)}
        />
      </Dialog>
    </Box>
  );
};

// 📝 FORMULARIO DE TAREA UNIFICADO
const TaskForm = ({ task, projectId, sprintId, users, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    story_points: '',
    assignee_id: '',
    due_date: '',
    estimated_hours: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (task) {
      setFormData({
        title: task.title || '',
        description: task.description || '',
        priority: task.priority || 'medium',
        story_points: task.story_points || '',
        assignee_id: task.assignee_id || '',
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        estimated_hours: task.estimated_hours || ''
      });
    }
  }, [task]);

  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  }, []);

  const handleSubmit = useCallback(async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const submitData = {
        ...formData,
        project_id: projectId,
        sprint_id: sprintId || null,
        story_points: formData.story_points ? parseInt(formData.story_points) : null,
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null
      };

      const url = task ? `/api/project-management/tasks/${task.id}` : '/api/project-management/tasks';
      const method = task ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submitData)
      });

      if (response.ok) {
        const result = await response.json();
        onSave(result.data);
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error al guardar la tarea');
      }
    } catch (err) {
      console.error('Error guardando tarea:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [formData, projectId, sprintId, task, onSave]);

  return (
    <UnifiedFormLayout
      title={task ? 'Editar Tarea' : 'Nueva Tarea'}
      onSubmit={handleSubmit}
      error={error}
      actions={[
        <UnifiedButton
          key="cancel"
          variant="secondary"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </UnifiedButton>,
        <UnifiedButton
          key="submit"
          variant="primary"
          type="submit"
          loading={loading}
        >
          {task ? 'Actualizar' : 'Crear'}
        </UnifiedButton>
      ]}
    >
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <UnifiedInput
            label="Título de la Tarea"
            value={formData.title}
            onChange={(e) => handleInputChange('title', e.target.value)}
            required
            placeholder="Describe brevemente la tarea"
            fullWidth
          />
        </Grid>

        <Grid item xs={12}>
          <UnifiedInput
            label="Descripción"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            multiline
            rows={4}
            placeholder="Detalla los requerimientos y criterios de aceptación"
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedSelect
            label="Prioridad"
            value={formData.priority}
            onChange={(e) => handleInputChange('priority', e.target.value)}
            options={[
              { value: 'low', label: 'Baja' },
              { value: 'medium', label: 'Media' },
              { value: 'high', label: 'Alta' },
              { value: 'critical', label: 'Crítica' }
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedInput
            label="Story Points"
            type="number"
            value={formData.story_points}
            onChange={(e) => handleInputChange('story_points', e.target.value)}
            placeholder="1, 2, 3, 5, 8, 13..."
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedSelect
            label="Asignado a"
            value={formData.assignee_id}
            onChange={(e) => handleInputChange('assignee_id', e.target.value)}
            options={[
              { value: '', label: 'Sin asignar' },
              ...users.map(user => ({
                value: user.id,
                label: user.name
              }))
            ]}
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedInput
            label="Fecha de Vencimiento"
            type="date"
            value={formData.due_date}
            onChange={(e) => handleInputChange('due_date', e.target.value)}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Grid>

        <Grid item xs={12} sm={6}>
          <UnifiedInput
            label="Horas Estimadas"
            type="number"
            value={formData.estimated_hours}
            onChange={(e) => handleInputChange('estimated_hours', e.target.value)}
            placeholder="8.5"
            inputProps={{ step: 0.5 }}
            fullWidth
          />
        </Grid>
      </Grid>
    </UnifiedFormLayout>
  );
};

export default React.memo(TaskBoard);