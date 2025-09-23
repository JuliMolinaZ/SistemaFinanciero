// 🚀 TASK BOARD DRAG & DROP - OPTIMIZADO PARA MACBOOK AIR 13"
// ================================================================

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  rectIntersection,
  useDroppable,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Chip,
  Avatar,
  Paper,
  Button,
  CircularProgress,
  Alert,
  alpha,
  useTheme
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Flag as FlagIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  MoreVert as MoreVertIcon
} from '@mui/icons-material';

// Servicios y hooks
import taskManagementService from '../../services/taskManagementService';
import useNotifications from '../../hooks/useNotifications';
import useConfirm from '../../hooks/useConfirm';
import { useTaskNotifications } from '../ui/TaskNotifications';
import TaskFormModal from '../../modules/ProjectManagement/components/TaskFormModal';
import ConfirmDialog from '../ui/ConfirmDialog';
import { GlobalContext } from '../../context/GlobalState';
import './TaskBoardEnhanced.css';

// 🎨 CONFIGURACIÓN DE COLUMNAS - CONSISTENTE CON MÓDULO DE PROYECTOS
const COLUMN_CONFIG = [
  {
    id: 'todo',
    title: '📋 Por Hacer',
    status: 'todo',
    color: 'hsl(215 16% 55%)', // Consistente con CSS unificado
    bgColor: 'hsla(215, 16%, 55%, 0.1)',
    borderColor: 'hsla(215, 16%, 55%, 0.2)',
    maxItems: 10
  },
  {
    id: 'in_progress',
    title: '🚀 En Progreso',
    status: 'in_progress',
    color: 'hsl(221 83% 53%)', // Primary color del módulo
    bgColor: 'hsla(221, 83%, 53%, 0.1)',
    borderColor: 'hsla(221, 83%, 53%, 0.2)',
    maxItems: 5
  },
  {
    id: 'review',
    title: '👀 En Revisión',
    status: 'review',
    color: 'hsl(38 92% 50%)', // Warning color del módulo
    bgColor: 'hsla(38, 92%, 50%, 0.1)',
    borderColor: 'hsla(38, 92%, 50%, 0.2)',
    maxItems: 3
  },
  {
    id: 'done',
    title: '✅ Completado',
    status: 'done',
    color: 'hsl(142 76% 36%)', // Success color del módulo
    bgColor: 'hsla(142, 76%, 36%, 0.1)',
    borderColor: 'hsla(142, 76%, 36%, 0.2)',
    maxItems: 20
  }
];

// 🃏 TARJETA DE TAREA DRAGGABLE
const DragTaskCard = ({ task, users = [], currentUser, onEdit, onDelete, isDragging = false }) => {
  const theme = useTheme();
  const [showActions, setShowActions] = useState(false);

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
    zIndex: isSortableDragging ? 1000 : 'auto',
  };

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      low: theme.palette.success.main,
      medium: theme.palette.warning.main,
      high: theme.palette.error.main,
      critical: theme.palette.error.dark
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

  // Obtener usuario asignado
  const assignee = users.find(user => user.id === task.assigned_to);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      whileHover={{ y: -2 }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30
      }}
    >
      <Paper
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={`task-card-enhanced ${isSortableDragging ? 'task-dragging' : ''} priority-${task.priority} status-${task.status}`}
        elevation={isSortableDragging ? 8 : 2}
        sx={{
          p: 1.5,
          mb: 1,
          cursor: 'grab',
          position: 'relative',
          overflow: 'hidden',
          border: '1px solid var(--pm-border)',
          borderRadius: 'var(--pm-radius-md)',
          backgroundColor: isSortableDragging
            ? 'var(--pm-surface-glass)'
            : 'var(--pm-surface-3)',
          backdropFilter: 'var(--pm-glass-blur)',
          boxShadow: 'var(--pm-shadow-xs)',
          '&:hover': {
            boxShadow: 'var(--pm-shadow-md)',
            transform: 'translateY(-1px)',
            borderColor: 'var(--pm-primary)',
            '& .task-actions': {
              opacity: 1,
              transform: 'translateY(0)'
            }
          },
          '&:active': {
            cursor: 'grabbing'
          },
          transition: 'var(--pm-transition-normal)',
          minHeight: '120px', // Más altura para mostrar información adicional
          maxHeight: '180px' // Límite de altura ajustado
        }}
      >
        {/* Barra de prioridad */}
        <Box
          className="priority-indicator"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: getPriorityColor(task.priority),
            boxShadow: `0 0 8px ${getPriorityColor(task.priority)}40`
          }}
        />

        {/* Indicador de estado */}
        <Box
          className="status-indicator"
          sx={{
            position: 'absolute',
            bottom: 8,
            right: 8,
            width: 12,
            height: 12,
            borderRadius: '50%',
            border: '2px solid white',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)'
          }}
        />

        {/* Chip de prioridad */}
        <Box sx={{ mb: 1, pr: 6 }}> {/* Padding right para no chocar con botones */}
          <Chip
            size="small"
            label={task.priority?.toUpperCase() || 'MEDIUM'}
            sx={{
              backgroundColor: getPriorityColor(task.priority),
              color: 'white',
              fontWeight: 'bold',
              fontSize: '0.65rem',
              height: 18
            }}
          />
        </Box>

        {/* Acciones en esquina superior derecha */}
        <Box
          className="task-actions"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            display: 'flex',
            gap: 0.5,
            opacity: 0,
            transform: 'translateY(-5px)',
            transition: 'all 0.2s ease',
            zIndex: 2
          }}
        >
            <Tooltip title="Editar">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(task);
                }}
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: alpha(theme.palette.primary.main, 0.1),
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.2),
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <EditIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>

            <Tooltip title="Eliminar">
              <IconButton
                size="small"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(task.id);
                }}
                sx={{
                  width: 20,
                  height: 20,
                  backgroundColor: alpha(theme.palette.error.main, 0.1),
                  color: theme.palette.error.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.error.main, 0.2),
                    transform: 'scale(1.1)'
                  }
                }}
              >
                <DeleteIcon sx={{ fontSize: 12 }} />
              </IconButton>
            </Tooltip>
          </Box>

          {/* Drag Handle en esquina inferior derecha */}
          <Box
            sx={{
              position: 'absolute',
              bottom: 4,
              right: 4,
              zIndex: 1
            }}
          >
            <IconButton
              size="small"
              {...listeners}
              sx={{
                cursor: 'grab',
                '&:active': { cursor: 'grabbing' },
                color: alpha(theme.palette.text.secondary, 0.5),
                width: 16,
                height: 16,
                '&:hover': {
                  color: theme.palette.text.secondary
                }
              }}
            >
              <DragIcon sx={{ fontSize: 10 }} />
            </IconButton>
          </Box>

        {/* Título */}
        <Typography
          variant="subtitle2"
          sx={{
            fontWeight: 600,
            mb: 1,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            fontSize: '0.875rem',
            color: 'var(--pm-text-primary)'
          }}
        >
          {task.title}
        </Typography>

        {/* Descripción */}
        {task.description && (
          <Typography
            variant="body2"
            sx={{
              mb: 1.5,
              fontSize: '0.75rem',
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.3,
              color: 'var(--pm-text-secondary)'
            }}
          >
            {task.description}
          </Typography>
        )}

        {/* Información de asignación con avatares */}
        <Box sx={{ mb: 1, pr: 2 }}>
          {/* Creador */}
          {(task.created_by || task.created_by_user || task.created_by_name) && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: 'var(--pm-text-muted)',
                  mr: 0.5
                }}
              >
                Creado por:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: 'var(--pm-text-secondary)',
                  fontWeight: 500
                }}
              >
                {task.created_by_name ||
                 task.created_by_user?.name ||
                 task.created_by?.name ||
                 (typeof task.created_by === 'string' ? task.created_by : 'Usuario desconocido')}
              </Typography>
            </Box>
          )}

          {/* Asignado */}
          {assignee && (
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: 'var(--pm-text-muted)',
                  mr: 0.5
                }}
              >
                Asignado a:
              </Typography>
              <Typography
                variant="caption"
                sx={{
                  fontSize: '0.65rem',
                  color: 'var(--pm-text-secondary)',
                  fontWeight: 500
                }}
              >
                {assignee.name}
              </Typography>
            </Box>
          )}
        </Box>

        {/* Footer */}
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          mt: 'auto'
        }}>
          {/* Avatares: Creador y Asignado */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            {/* Avatar del creador (siempre visible) */}
            {(task.created_by_user || task.created_by || task.created_by_name) ? (
              <Tooltip title={`Creado por: ${task.created_by_name || task.created_by_user?.name || task.created_by?.name || task.created_by}`}>
                <Avatar
                  src={task.created_by_user?.avatar || task.created_by?.avatar}
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.7rem',
                    border: `2px solid var(--pm-warning)`, // Color diferente para el creador
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    position: 'relative',
                    '&::after': {
                      content: '"\uD83D\uDCDD"', // Emoji de lápiz para indicar creador
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      fontSize: '8px',
                      backgroundColor: 'var(--pm-warning)',
                      borderRadius: '50%',
                      width: 12,
                      height: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }}
                >
                  {(task.created_by_name || task.created_by_user?.name || task.created_by?.name || task.created_by)?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ) : (
              <Tooltip title="Creador desconocido">
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: 'var(--pm-text-muted)',
                    border: `2px solid var(--pm-border)`,
                    opacity: 0.7
                  }}
                >
                  <PersonIcon sx={{ fontSize: 12 }} />
                </Avatar>
              </Tooltip>
            )}

            {/* Avatar del asignado */}
            {assignee ? (
              <Tooltip title={`Asignado a: ${assignee.name}`}>
                <Avatar
                  src={assignee.avatar}
                  sx={{
                    width: 24,
                    height: 24,
                    fontSize: '0.7rem',
                    border: `2px solid var(--pm-primary)`, // Color azul para asignado
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                    ml: -0.5, // Overlap ligero
                    position: 'relative',
                    '&::after': {
                      content: '"\u2705"', // Emoji de check para indicar asignado
                      position: 'absolute',
                      bottom: -2,
                      right: -2,
                      fontSize: '8px',
                      backgroundColor: 'var(--pm-primary)',
                      borderRadius: '50%',
                      width: 12,
                      height: 12,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }
                  }}
                >
                  {assignee.name?.charAt(0)?.toUpperCase()}
                </Avatar>
              </Tooltip>
            ) : (
              <Tooltip title="Sin asignar">
                <Avatar
                  sx={{
                    width: 24,
                    height: 24,
                    backgroundColor: 'var(--pm-text-muted)',
                    border: `2px solid var(--pm-border)`,
                    opacity: 0.7,
                    ml: -0.5
                  }}
                >
                  <PersonIcon sx={{ fontSize: 12 }} />
                </Avatar>
              </Tooltip>
            )}
          </Box>

          {/* Fecha límite */}
          {task.due_date && (
            <Tooltip title={`Vence: ${formatDate(task.due_date)}`}>
              <Chip
                size="small"
                icon={<ScheduleIcon sx={{ fontSize: 10 }} />}
                label={formatDate(task.due_date)}
                sx={{
                  fontSize: '0.6rem',
                  height: 18,
                  backgroundColor: 'var(--pm-info)',
                  color: 'white',
                  '& .MuiChip-icon': {
                    color: 'white'
                  }
                }}
              />
            </Tooltip>
          )}
        </Box>
      </Paper>
    </motion.div>
  );
};

// 📋 COLUMNA DROPPABLE
const DroppableColumn = ({
  column,
  tasks,
  users,
  currentUser,
  onAddTask,
  onEditTask,
  onDeleteTask
}) => {
  const theme = useTheme();

  const {
    setNodeRef,
    isOver,
  } = useDroppable({
    id: `column-${column.status}`,
    data: {
      type: 'column',
      status: column.status,
      accepts: ['task']
    }
  });

  console.log(`📋 Column ${column.status} droppable setup:`, {
    id: `column-${column.status}`,
    isOver,
    status: column.status
  });

  return (
    <Box
      className={`column-drop-zone ${isOver ? 'drag-over' : ''}`}
      sx={{
        minWidth: { xs: 280, sm: 300, md: 320 }, // Responsive widths
        maxWidth: 340,
        backgroundColor: column.bgColor,
        borderRadius: 'var(--pm-radius-lg)',
        border: `1px solid ${column.borderColor}`,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        transition: 'var(--pm-transition-normal)',
        backdropFilter: 'var(--pm-glass-blur)',
        boxShadow: 'var(--pm-shadow-sm)',
        ...(isOver && {
          backgroundColor: alpha(column.color, 0.15),
          borderColor: column.color,
          transform: 'scale(1.02)',
          boxShadow: `var(--pm-shadow-lg), 0 0 24px ${alpha(column.color, 0.3)}`
        })
      }}
    >
      {/* Header */}
      <Box sx={{
        p: 1.5,
        borderBottom: `1px solid ${column.borderColor}`,
        backgroundColor: alpha(column.color, 0.03),
        backgroundImage: `linear-gradient(135deg, ${alpha(column.color, 0.05)} 0%, transparent 100%)`
      }}>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              sx={{
                color: column.color,
                fontWeight: 700,
                fontSize: '0.9rem'
              }}
            >
              {column.title}
            </Typography>
            <Chip
              size="small"
              label={tasks.length}
              sx={{
                backgroundColor: alpha(column.color, 0.2),
                color: column.color,
                fontWeight: 600,
                fontSize: '0.7rem',
                height: 20,
                minWidth: 24
              }}
            />
          </Box>

          <Tooltip title="Agregar tarea">
            <IconButton
              size="small"
              onClick={() => onAddTask(column.status)}
              sx={{
                color: column.color,
                '&:hover': {
                  backgroundColor: alpha(column.color, 0.1),
                  transform: 'scale(1.1)'
                },
                transition: 'all 0.2s ease'
              }}
            >
              <AddIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      {/* Lista de tareas */}
      <Box
        ref={setNodeRef}
        className={`pm-kanban-tasks ${isOver ? 'column-receiving' : ''}`}
        sx={{
          p: 1.5,
          flex: 1,
          minHeight: { xs: 400, md: 500 }, // Más altura para 50+ tareas
          maxHeight: { xs: 'calc(100vh - 300px)', md: 'calc(100vh - 250px)' }, // Altura dinámica
          overflowY: 'auto',
          overflowX: 'hidden',
          scrollBehavior: 'smooth', // Scroll suave
          borderRadius: 'var(--pm-radius-md)',
          transition: 'var(--pm-transition-normal)',
          ...(isOver && {
            backgroundColor: alpha(column.color, 0.15),
            border: `2px dashed ${column.color}`,
            transform: 'scale(1.02)',
          }),
          '&::-webkit-scrollbar': {
            width: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(column.color, 0.1),
            borderRadius: 4
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(column.color, 0.4),
            borderRadius: 4,
            '&:hover': {
              backgroundColor: alpha(column.color, 0.6)
            }
          },
          // Estilos para Firefox
          scrollbarWidth: 'thin',
          scrollbarColor: `${alpha(column.color, 0.4)} ${alpha(column.color, 0.1)}`
        }}
      >
        <SortableContext
          items={tasks.map(task => task.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {tasks.map((task) => (
              <DragTaskCard
                key={task.id}
                task={task}
                users={users}
                currentUser={currentUser}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
              />
            ))}
          </AnimatePresence>
        </SortableContext>

        {tasks.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{
              textAlign: 'center',
              padding: '2rem 1rem',
              color: alpha(theme.palette.text.secondary, 0.6)
            }}
          >
            <Box sx={{ fontSize: '2rem', mb: 1 }}>📝</Box>
            <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>
              Arrastra tareas aquí
            </Typography>
          </motion.div>
        )}
      </Box>
    </Box>
  );
};

// 🚀 COMPONENTE PRINCIPAL
const TaskBoardDragDrop = ({
  projectId,
  projectName,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete
}) => {
  const theme = useTheme();
  const { notify } = useNotifications();
  const { confirmState, handleConfirm, handleCancel } = useConfirm();
  const taskNotify = useTaskNotifications();

  // Obtener usuario actual desde el contexto global
  const { profileData } = React.useContext(GlobalContext);

  // Estados
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeId, setActiveId] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [newTaskStatus, setNewTaskStatus] = useState('todo');

  // Configurar sensores para drag & drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Método para intentar obtener usuario desde diferentes fuentes
  const tryGetUserFallback = useCallback(async () => {
    try {
      // 1. Intentar desde el servicio nuevamente
      const user = await taskManagementService.getCurrentUser();
      if (user) {
        console.log('🔄 Usuario obtenido desde servicio fallback:', user.name);
        return user;
      }

      // 2. Intentar desde localStorage
      const storedUser = localStorage.getItem('user') || localStorage.getItem('currentUser');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        const fallbackUser = {
          id: parsed.id || Date.now(),
          name: parsed.name || parsed.username || parsed.email?.split('@')[0] || 'Usuario',
          email: parsed.email,
          avatar: parsed.avatar
        };
        console.log('🔄 Usuario obtenido desde localStorage:', fallbackUser.name);
        return fallbackUser;
      }

      // 3. Intentar desde sessionStorage
      const sessionUser = sessionStorage.getItem('user') || sessionStorage.getItem('currentUser');
      if (sessionUser) {
        const parsed = JSON.parse(sessionUser);
        const fallbackUser = {
          id: parsed.id || Date.now(),
          name: parsed.name || parsed.username || parsed.email?.split('@')[0] || 'Usuario',
          email: parsed.email,
          avatar: parsed.avatar
        };
        console.log('🔄 Usuario obtenido desde sessionStorage:', fallbackUser.name);
        return fallbackUser;
      }

      // 4. Usuario genérico como último recurso
      const genericUser = {
        id: Date.now(),
        name: 'Usuario del Sistema',
        email: 'usuario@sistema.com',
        avatar: null
      };
      console.log('🔄 Usando usuario genérico como último recurso');
      return genericUser;

    } catch (error) {
      console.error('❌ Error en tryGetUserFallback:', error);
      return null;
    }
  }, []);

  // Organizar tareas por estado
  const tasksByStatus = useMemo(() => {
    const organized = {};

    COLUMN_CONFIG.forEach(column => {
      organized[column.status] = tasks.filter(task => task.status === column.status);
    });

    return organized;
  }, [tasks]);

  // Cargar datos
  const loadData = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);

      const [tasksResponse, usersResponse] = await Promise.all([
        taskManagementService.getTasksByProject(projectId),
        taskManagementService.getUsersByProject(projectId)
      ]);

      console.log('👥 Datos de usuario desde contexto global:', {
        profileData,
        hasProfileData: !!profileData,
        userName: profileData?.name,
        userEmail: profileData?.email,
        userId: profileData?.id
      });

      setTasks(tasksResponse.data?.tasks || []);
      setUsers(usersResponse.data || []);

      // Establecer usuario actual desde contexto global
      if (profileData) {
        const processedUser = {
          id: profileData.id,
          name: profileData.name ||
                `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() ||
                profileData.email?.split('@')[0] ||
                'Usuario',
          email: profileData.email,
          avatar: profileData.avatar || profileData.profile_picture,
          firebase_uid: profileData.firebase_uid
        };

        setCurrentUser(processedUser);
        console.log('👤 Usuario actual establecido desde contexto:', {
          id: processedUser.id,
          name: processedUser.name,
          email: processedUser.email,
          source: 'GlobalContext.profileData'
        });
      } else {
        console.log('⚠️ No hay profileData en contexto global');
        // Intentar fallback
        const fallbackUser = await tryGetUserFallback();
        if (fallbackUser) {
          setCurrentUser(fallbackUser);
          console.log('👤 Usuario establecido desde fallback:', fallbackUser.name);
        } else {
          console.log('⚠️ No se pudo obtener usuario, usará genérico');
          setCurrentUser(null);
        }
      }

    } catch (err) {
      console.error('Error cargando datos:', err);
      setError('Error al cargar los datos del proyecto');
      // Notificación sin dependency para evitar bucle
      taskNotify.error('Error cargando datos', 'No se pudieron cargar los datos del proyecto');
    } finally {
      setLoading(false);
    }
  }, [projectId, taskNotify]);

  // Cargar datos al montar - solo cuando cambie projectId
  useEffect(() => {
    if (projectId) {
      loadData();
    }
  }, [projectId]); // Dependencia directa solo en projectId

  // Actualizar usuario actual cuando cambie profileData
  useEffect(() => {
    if (profileData && (!currentUser || currentUser.id !== profileData.id)) {
      const processedUser = {
        id: profileData.id,
        name: profileData.name ||
              `${profileData.first_name || ''} ${profileData.last_name || ''}`.trim() ||
              profileData.email?.split('@')[0] ||
              'Usuario',
        email: profileData.email,
        avatar: profileData.avatar || profileData.profile_picture,
        firebase_uid: profileData.firebase_uid
      };

      setCurrentUser(processedUser);
      console.log('🔄 Usuario actualizado desde profileData:', {
        id: processedUser.id,
        name: processedUser.name,
        email: processedUser.email
      });
    }
  }, [profileData, currentUser]);

  // Escuchar evento de crear nueva tarea desde botón superior
  useEffect(() => {
    const handleCreateNewTask = (event) => {
      const { projectId: eventProjectId, status } = event.detail;
      if (eventProjectId === projectId) {
        console.log('🎯 Evento createNewTask capturado:', { projectId: eventProjectId, status });
        handleAddTask(status || 'todo');
      }
    };

    window.addEventListener('createNewTask', handleCreateNewTask);

    return () => {
      window.removeEventListener('createNewTask', handleCreateNewTask);
    };
  }, [projectId]);

  // Manejar inicio de drag
  const handleDragStart = (event) => {
    setActiveId(event.active.id);
  };

  // Manejar fin de drag
  const handleDragEnd = async (event) => {
    const { active, over } = event;
    setActiveId(null);

    if (!over) {
      console.log('🚫 No drop target found');
      return;
    }

    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) {
      console.log('❌ Active task not found:', active.id);
      return;
    }

    console.log('🎯 Drag ended:', {
      activeId: active.id,
      overId: over.id,
      overData: over.data?.current,
      activeTask: activeTask.title
    });

    // Determinar nueva columna
    let newStatus = null;

    // Si se suelta en una columna (formato column-status)
    if (over.id && over.id.toString().startsWith('column-')) {
      newStatus = over.id.toString().replace('column-', '');
      console.log('📋 Dropped on column:', newStatus);
    }
    // Si se suelta en otra tarea, usar el estado de esa tarea
    else if (over.data?.current?.task) {
      newStatus = over.data.current.task.status;
      console.log('🃏 Dropped on task, inheriting status:', newStatus);
    }
    // Si se suelta en el área de drop de una columna
    else if (over.data?.current?.status) {
      newStatus = over.data.current.status;
      console.log('🎯 Dropped on drop area, status:', newStatus);
    }
    // Fallback: buscar por overId directamente en las columnas
    else {
      const columnMatch = COLUMN_CONFIG.find(col =>
        over.id === col.status ||
        over.id === col.id ||
        over.id === `column-${col.status}`
      );
      if (columnMatch) {
        newStatus = columnMatch.status;
        console.log('🔍 Fallback column match:', newStatus);
      }
    }

    console.log('🔄 Status change:', {
      from: activeTask.status,
      to: newStatus,
      willUpdate: newStatus && newStatus !== activeTask.status
    });

    if (!newStatus || newStatus === activeTask.status) {
      console.log('⚠️ No status change needed');
      return;
    }

    try {
      // Actualizar UI optimísticamente
      setTasks(prev => prev.map(task =>
        task.id === activeTask.id
          ? { ...task, status: newStatus }
          : task
      ));

      // Actualizar en backend
      await taskManagementService.updateTask(activeTask.id, { status: newStatus });

      // Notificación mejorada
      taskNotify.taskMoved(activeTask.title, newStatus);

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
  };

  // Manejar creación de tarea
  const handleAddTask = (status) => {
    setNewTaskStatus(status);
    setEditingTask(null);
    setShowTaskForm(true);
  };

  // Manejar edición de tarea
  const handleEditTask = (task) => {
    setEditingTask(task);
    setShowTaskForm(true);
  };

  // Manejar eliminación de tarea con confirmación personalizada
  const handleDeleteTask = async (taskId) => {
    const taskToDelete = tasks.find(task => task.id === taskId);
    if (!taskToDelete) return;

    // Usar el sistema de confirmación personalizado
    const confirmed = await handleConfirm({
      title: 'Eliminar Tarea',
      message: `¿Estás seguro de que deseas eliminar la tarea "${taskToDelete.title}"?`,
      description: 'Esta acción no se puede deshacer.',
      confirmText: 'Eliminar',
      cancelText: 'Cancelar',
      severity: 'error'
    });

    if (!confirmed) return;

    try {
      await taskManagementService.deleteTask(taskId);

      setTasks(prev => prev.filter(task => task.id !== taskId));

      // Notificación mejorada
      taskNotify.taskDeleted(taskToDelete.title || 'Tarea');

      if (onTaskDelete) {
        onTaskDelete(taskId);
      }

    } catch (error) {
      console.error('Error eliminando tarea:', error);
      taskNotify.taskError('eliminar la tarea', error);
    }
  };

  // Manejar envío de formulario
  const handleTaskSubmit = async (taskData) => {
    try {
      if (editingTask) {
        // Actualizar tarea existente
        await taskManagementService.updateTask(editingTask.id, taskData);

        setTasks(prev => prev.map(task =>
          task.id === editingTask.id
            ? { ...task, ...taskData }
            : task
        ));

        // Notificación mejorada
        taskNotify.taskUpdated(taskData.title || editingTask.title);

        if (onTaskUpdate) {
          onTaskUpdate({ ...editingTask, ...taskData });
        }
      } else {
        // Crear nueva tarea (con o sin usuario)
        console.log('✨ Creando nueva tarea:', {
          title: taskData.title,
          hasCurrentUser: !!currentUser,
          currentUserName: currentUser?.name
        });

        // Preparar información del creador
        let creatorInfo = null;
        if (currentUser) {
          creatorInfo = {
            id: currentUser.id,
            name: currentUser.name,
            email: currentUser.email,
            avatar: currentUser.avatar
          };
        } else {
          // Si no hay usuario, usar información genérica
          creatorInfo = {
            id: null,
            name: 'Usuario del Sistema',
            email: null,
            avatar: null
          };
          console.log('⚠️ Creando tarea con usuario genérico');
        }

        const newTaskData = {
          ...taskData,
          project_id: projectId,
          status: newTaskStatus,
          created_by: creatorInfo.id,
          created_by_user: creatorInfo
        };

        const newTask = await taskManagementService.createTask(newTaskData);

        // Añadir información del creador a la tarea recién creada
        const taskWithCreator = {
          ...newTask.data,
          created_by: creatorInfo.id,
          created_by_user: creatorInfo,
          created_by_name: creatorInfo.name
        };

        setTasks(prev => [...prev, taskWithCreator]);

        // Notificación mejorada
        taskNotify.taskCreated(taskData.title);

        if (onTaskCreate) {
          onTaskCreate(taskWithCreator);
        }
      }

      setShowTaskForm(false);
      setEditingTask(null);

    } catch (error) {
      console.error('Error guardando tarea:', error);
      taskNotify.taskError(
        editingTask ? 'actualizar la tarea' : 'crear la tarea',
        error
      );
    }
  };

  // Obtener tarea activa para overlay
  const activeTask = activeId ? tasks.find(task => task.id === activeId) : null;

  if (!projectId) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Selecciona un proyecto para ver las tareas
        </Typography>
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: 400,
        flexDirection: 'column',
        gap: 2
      }}>
        <CircularProgress size={40} />
        <Typography variant="body1" color="text.secondary">
          Cargando tareas...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button
          variant="contained"
          onClick={loadData}
        >
          Reintentar
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header con estilo del módulo */}
      <Box
        className="pm-kanban-header"
        sx={{
          mb: 2,
          p: 2,
          background: 'var(--pm-surface-glass)',
          backdropFilter: 'var(--pm-glass-blur)',
          border: '1px solid var(--pm-border-glass)',
          borderRadius: 'var(--pm-radius-lg)',
          boxShadow: 'var(--pm-shadow-sm)'
        }}
      >
        <Typography
          variant="h4"
          className="pm-kanban-title"
          sx={{
            fontWeight: 700,
            mb: 0.5,
            color: 'var(--pm-text-primary)',
            fontSize: '1.5rem'
          }}
        >
          🎯 {projectName ? `Tareas de ${projectName}` : 'Gestión de Tareas'}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Typography
            variant="body2"
            sx={{
              color: 'var(--pm-text-secondary)',
              fontSize: '0.875rem'
            }}
          >
            {tasks.length} tareas • Arrastra para cambiar estado
          </Typography>
          <Box
            className="pm-kanban-badge"
            sx={{
              background: 'var(--pm-primary)',
              color: 'white',
              padding: '0.25rem 0.75rem',
              borderRadius: 'var(--pm-radius-md)',
              fontSize: '0.75rem',
              fontWeight: 600,
              boxShadow: 'var(--pm-glow-primary)'
            }}
          >
            {tasks.length} tareas
          </Box>
        </Box>
      </Box>

      {/* Board */}
      <DndContext
        sensors={sensors}
        collisionDetection={rectIntersection}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Box sx={{
          display: 'flex',
          gap: 2,
          overflowX: 'auto',
          pb: 2,
          minHeight: { xs: 500, md: 600 },
          '&::-webkit-scrollbar': {
            height: 8
          },
          '&::-webkit-scrollbar-track': {
            backgroundColor: alpha(theme.palette.divider, 0.1)
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: alpha(theme.palette.divider, 0.3),
            borderRadius: 4
          }
        }}>
          {COLUMN_CONFIG.map((column) => (
            <DroppableColumn
              key={column.id}
              column={column}
              tasks={tasksByStatus[column.status] || []}
              users={users}
              currentUser={currentUser}
              onAddTask={handleAddTask}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
            />
          ))}
        </Box>

        {/* Drag Overlay */}
        {createPortal(
          <DragOverlay>
            {activeTask ? (
              <DragTaskCard
                task={activeTask}
                users={users}
                currentUser={currentUser}
                isDragging
              />
            ) : null}
          </DragOverlay>,
          document.body
        )}
      </DndContext>

      {/* Modal de formulario */}
      <TaskFormModal
        isOpen={showTaskForm}
        onClose={() => {
          setShowTaskForm(false);
          setEditingTask(null);
        }}
        onSave={handleTaskSubmit}
        task={editingTask}
        users={users}
        currentUser={currentUser}
        projectId={projectId}
      />

      {/* Modal de confirmación */}
      <ConfirmDialog
        open={confirmState.open}
        onClose={handleCancel}
        onConfirm={handleConfirm}
        {...confirmState.config}
      />

      {/* Sistema de notificaciones mejorado */}
      <taskNotify.NotificationContainer />
    </Box>
  );
};

export default TaskBoardDragDrop;