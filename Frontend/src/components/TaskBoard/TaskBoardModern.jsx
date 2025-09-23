// 🚀 TABLERO DE TAREAS MODERNO CON DRAG & DROP
// ==============================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
  CSS,
} from '@dnd-kit/sortable';

import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  Avatar,
  Chip,
  IconButton,
  Tooltip,
  Paper,
  Badge,
  Stack,
  useTheme,
  alpha
} from '@mui/material';

import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Flag as FlagIcon,
  MoreVert as MoreVertIcon,
  DragIndicator as DragIcon
} from '@mui/icons-material';

// Importar servicios y utilidades
import managementTaskService from '../../services/managementTaskService';
import { useNotify } from '../../hooks/useNotify';

// 🎨 ESTILOS MODERNOS
const boardStyles = {
  container: {
    display: 'flex',
    gap: 3,
    padding: 3,
    minHeight: '70vh',
    overflowX: 'auto',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: 2
  },
  column: {
    minWidth: 320,
    maxWidth: 350,
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    backdropFilter: 'blur(10px)',
    borderRadius: 2,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    padding: 2
  },
  columnHeader: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
    padding: 1,
    borderRadius: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  },
  dropZone: {
    minHeight: 200,
    padding: 1,
    borderRadius: 1,
    transition: 'all 0.2s ease',
    border: '2px dashed transparent'
  },
  dropZoneActive: {
    border: '2px dashed rgba(255, 255, 255, 0.5)',
    backgroundColor: 'rgba(255, 255, 255, 0.1)'
  }
};

// 🃏 COMPONENTE DE TARJETA DE TAREA
const TaskCard = ({ task, isDragging = false, ...props }) => {
  const theme = useTheme();
  const notify = useNotify();

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
      urgent: theme.palette.error.dark
    };
    return colors[priority] || colors.medium;
  };

  // Formatear fecha
  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  // Calcular días restantes
  const getDaysInfo = (dueDate) => {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: diffDays,
      isOverdue: diffDays < 0,
      isDueSoon: diffDays >= 0 && diffDays <= 3
    };
  };

  const daysInfo = getDaysInfo(task.due_date);

  return (
    <Paper
      ref={setNodeRef}
      style={style}
      {...attributes}
      sx={{
        p: 2,
        mb: 2,
        cursor: 'grab',
        '&:hover': {
          boxShadow: theme.shadows[8],
          transform: 'translateY(-2px)'
        },
        '&:active': {
          cursor: 'grabbing'
        },
        backgroundColor: alpha(theme.palette.background.paper, 0.95),
        backdropFilter: 'blur(10px)',
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        transition: 'all 0.2s ease'
      }}
      {...props}
    >
      {/* Header con prioridad y drag handle */}
      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1 }}>
        <Chip
          size="small"
          label={task.priority}
          sx={{
            backgroundColor: getPriorityColor(task.priority),
            color: 'white',
            fontWeight: 'bold',
            fontSize: '0.7rem'
          }}
        />
        <IconButton
          size="small"
          {...listeners}
          sx={{
            cursor: 'grab',
            '&:active': { cursor: 'grabbing' },
            color: theme.palette.text.secondary
          }}
        >
          <DragIcon fontSize="small" />
        </IconButton>
      </Box>

      {/* Título */}
      <Typography
        variant="subtitle2"
        sx={{
          fontWeight: 'bold',
          mb: 1,
          lineHeight: 1.3,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}
      >
        {task.title}
      </Typography>

      {/* Descripción */}
      {task.description && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mb: 2,
            fontSize: '0.8rem',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {task.description}
        </Typography>
      )}

      {/* Footer con asignado y fecha */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Asignado */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {task.assignee ? (
            <Tooltip title={task.assignee.name}>
              <Avatar
                src={task.assignee.avatar}
                sx={{ width: 24, height: 24, fontSize: '0.7rem' }}
              >
                {task.assignee.name?.charAt(0)?.toUpperCase()}
              </Avatar>
            </Tooltip>
          ) : (
            <Tooltip title="Sin asignar">
              <Avatar sx={{ width: 24, height: 24, backgroundColor: 'grey.400' }}>
                <PersonIcon fontSize="small" />
              </Avatar>
            </Tooltip>
          )}
        </Box>

        {/* Fecha límite */}
        {task.due_date && (
          <Tooltip title={`Vence: ${formatDate(task.due_date)}`}>
            <Chip
              size="small"
              icon={<ScheduleIcon fontSize="small" />}
              label={formatDate(task.due_date)}
              sx={{
                fontSize: '0.6rem',
                height: 20,
                backgroundColor: daysInfo?.isOverdue
                  ? theme.palette.error.main
                  : daysInfo?.isDueSoon
                  ? theme.palette.warning.main
                  : theme.palette.info.main,
                color: 'white'
              }}
            />
          </Tooltip>
        )}
      </Box>

      {/* Sprint info */}
      {task.sprint && (
        <Box sx={{ mt: 1 }}>
          <Chip
            size="small"
            label={task.sprint.name}
            variant="outlined"
            sx={{ fontSize: '0.6rem', height: 18 }}
          />
        </Box>
      )}
    </Paper>
  );
};

// 📋 COMPONENTE DE COLUMNA
const TaskColumn = ({ title, status, tasks, onAddTask, icon, color }) => {
  const theme = useTheme();

  const {
    setNodeRef,
    isOver,
  } = useSortable({
    id: status,
    data: {
      type: 'column',
      status,
    },
  });

  return (
    <Box sx={boardStyles.column}>
      {/* Header de columna */}
      <Box sx={boardStyles.columnHeader}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Box sx={{ fontSize: '1.2rem' }}>{icon}</Box>
          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
            {title}
          </Typography>
          <Badge
            badgeContent={tasks.length}
            sx={{
              '& .MuiBadge-badge': {
                backgroundColor: alpha(color, 0.8),
                color: 'white'
              }
            }}
          />
        </Box>

        <Tooltip title="Agregar tarea">
          <IconButton
            size="small"
            onClick={() => onAddTask(status)}
            sx={{
              color: 'white',
              '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
            }}
          >
            <AddIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Drop zone */}
      <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
        <Box
          ref={setNodeRef}
          sx={{
            ...boardStyles.dropZone,
            ...(isOver ? boardStyles.dropZoneActive : {})
          }}
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
              >
                <TaskCard task={task} />
              </motion.div>
            ))}
          </AnimatePresence>

          {tasks.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 4,
                color: 'rgba(255, 255, 255, 0.7)',
                fontStyle: 'italic'
              }}
            >
              Arrastra tareas aquí
            </Box>
          )}
        </Box>
      </SortableContext>
    </Box>
  );
};

// 🚀 COMPONENTE PRINCIPAL DEL TABLERO
const TaskBoardModern = ({ projectId, initialTasks = [], onTaskUpdate, onTaskCreate, onTaskEdit }) => {
  const theme = useTheme();
  const notify = useNotify();

  // Estados
  const [tasks, setTasks] = useState(initialTasks);
  const [loading, setLoading] = useState(false);
  const [activeId, setActiveId] = useState(null);

  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Organizar tareas por estado
  const tasksByStatus = useMemo(() => {
    const organized = {
      todo: [],
      in_progress: [],
      done: [],
      blocked: []
    };

    tasks.forEach(task => {
      if (organized[task.status]) {
        organized[task.status].push(task);
      }
    });

    return organized;
  }, [tasks]);

  // Configuración de columnas
  const columns = [
    {
      id: 'todo',
      title: 'Por Hacer',
      status: 'todo',
      icon: '📋',
      color: theme.palette.grey[500]
    },
    {
      id: 'in_progress',
      title: 'En Progreso',
      status: 'in_progress',
      icon: '⚡',
      color: theme.palette.primary.main
    },
    {
      id: 'done',
      title: 'Completado',
      status: 'done',
      icon: '✅',
      color: theme.palette.success.main
    },
    {
      id: 'blocked',
      title: 'Bloqueado',
      status: 'blocked',
      icon: '🚫',
      color: theme.palette.error.main
    }
  ];

  // Cargar tareas del proyecto
  const loadTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      const result = await managementTaskService.getTaskBoard(projectId);
      setTasks(result.tasks);
    } catch (error) {
      console.error('Error cargando tareas:', error);
      notify.error({
        title: 'Error',
        description: 'No se pudieron cargar las tareas'
      });
    } finally {
      setLoading(false);
    }
  }, [projectId, notify]);

  // Cargar tareas al montar o cambiar proyecto
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // Manejar inicio de drag
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Manejar fin de drag
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {
      setActiveId(null);
      return;
    }

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) {
      setActiveId(null);
      return;
    }

    // Si se mueve a una columna diferente
    if (over.id !== activeTask.status && columns.find(col => col.status === over.id)) {
      const newStatus = over.id;

      try {
        // Actualizar UI optimísticamente
        setTasks(prev => prev.map(task =>
          task.id === activeTask.id
            ? { ...task, status: newStatus }
            : task
        ));

        // Actualizar en backend
        await managementTaskService.updateTaskStatus(activeTask.id, newStatus);

        notify.success({
          title: 'Tarea movida',
          description: `Tarea movida a ${columns.find(col => col.status === newStatus)?.title}`
        });

        // Notificar al componente padre
        if (onTaskUpdate) {
          onTaskUpdate({ ...activeTask, status: newStatus });
        }

      } catch (error) {
        console.error('Error moviendo tarea:', error);

        // Revertir cambio optimista
        setTasks(prev => prev.map(task =>
          task.id === activeTask.id
            ? activeTask
            : task
        ));

        notify.error({
          title: 'Error',
          description: 'No se pudo mover la tarea'
        });
      }
    }

    setActiveId(null);
  };

  // Manejar creación de tarea
  const handleAddTask = (status) => {
    if (onTaskCreate) {
      onTaskCreate({ status, project_id: projectId });
    }
  };

  // Obtener tarea activa para overlay
  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography>Cargando tareas...</Typography>
      </Box>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <Box sx={boardStyles.container}>
        {columns.map((column) => (
          <TaskColumn
            key={column.id}
            title={column.title}
            status={column.status}
            tasks={tasksByStatus[column.status]}
            onAddTask={handleAddTask}
            icon={column.icon}
            color={column.color}
          />
        ))}
      </Box>

      {/* Overlay para drag */}
      <DragOverlay>
        {activeTask ? (
          <TaskCard task={activeTask} isDragging />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default TaskBoardModern;