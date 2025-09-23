// 🎯 TASK MANAGEMENT FINAL - VERSIÓN DEFINITIVA CON API REAL
// ===========================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
  useDroppable
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

// Icons
import {
  X,
  Plus,
  Search,
  Calendar,
  User,
  Flag,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Circle,
  AlertCircle,
  Target,
  Activity,
  Clock,
  Save,
  XIcon
} from 'lucide-react';

// Services
import { taskManagementService } from '../../../services/taskManagementService';

// 🎨 DESIGN TOKENS (mismos colores que ProjectManagement)
const theme = {
  colors: {
    primary: {
      50: '#eff6ff',
      100: '#dbeafe',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8'
    },
    success: {
      50: '#f0fdf4',
      100: '#dcfce7',
      500: '#22c55e',
      600: '#16a34a'
    },
    warning: {
      50: '#fffbeb',
      100: '#fef3c7',
      500: '#f59e0b',
      600: '#d97706'
    },
    danger: {
      50: '#fef2f2',
      100: '#fee2e2',
      500: '#ef4444',
      600: '#dc2626'
    },
    neutral: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a'
    }
  },
  gradients: {
    dark: 'linear-gradient(135deg, hsl(222 47% 7%) 0%, hsl(222 36% 12%) 100%)',
    glass: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
  }
};

// 🎨 CONFIGURACIÓN DE COLUMNAS
const TASK_COLUMNS = [
  {
    id: 'todo',
    title: 'Por Hacer',
    color: theme.colors.primary[500],
    bgColor: theme.colors.primary[50],
    icon: Circle,
    description: 'Tareas pendientes de iniciar'
  },
  {
    id: 'in_progress',
    title: 'En Progreso',
    color: theme.colors.warning[500],
    bgColor: theme.colors.warning[50],
    icon: Activity,
    description: 'Tareas en desarrollo'
  },
  {
    id: 'review',
    title: 'En Revisión',
    color: '#8b5cf6',
    bgColor: '#f3e8ff',
    icon: Eye,
    description: 'Esperando aprobación'
  },
  {
    id: 'done',
    title: 'Completado',
    color: theme.colors.success[500],
    bgColor: theme.colors.success[50],
    icon: CheckCircle,
    description: 'Tareas finalizadas'
  }
];

// 🎯 DROPPABLE COLUMN WRAPPER
const DroppableColumn = ({ id, children }) => {
  const { setNodeRef, isOver } = useDroppable({ id });

  return (
    <div ref={setNodeRef} style={{ height: '100%' }}>
      {React.cloneElement(children, { isOver })}
    </div>
  );
};

// 🎯 TASK CARD COMPONENT
const TaskCard = ({ task, onEdit, onView, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.8 : 1,
    cursor: isDragging ? 'grabbing' : 'grab'
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return { color: theme.colors.danger[500], bg: theme.colors.danger[50] };
      case 'medium':
        return { color: theme.colors.warning[500], bg: theme.colors.warning[50] };
      case 'low':
        return { color: theme.colors.success[500], bg: theme.colors.success[50] };
      default:
        return { color: theme.colors.neutral[500], bg: theme.colors.neutral[50] };
    }
  };

  const priorityConfig = getPriorityConfig(task.priority);

  return (
    <div
      ref={setNodeRef}
      style={{
        ...style,
        backgroundColor: 'white',
        border: `1px solid ${theme.colors.neutral[200]}`,
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: theme.shadows.sm,
        position: 'relative',
        transition: 'all 0.2s ease'
      }}
      {...attributes}
      {...listeners}
      onMouseEnter={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = theme.shadows.md;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        if (!isDragging) {
          e.currentTarget.style.boxShadow = theme.shadows.sm;
          e.currentTarget.style.transform = 'translateY(0)';
        }
      }}
    >
      {/* Priority Badge */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        alignItems: 'center',
        gap: '4px',
        padding: '2px 8px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '500',
        backgroundColor: priorityConfig.bg,
        color: priorityConfig.color
      }}>
        <Flag style={{ width: '10px', height: '10px' }} />
        {task.priority || 'normal'}
      </div>

      {/* Title */}
      <div style={{
        fontSize: '14px',
        fontWeight: '600',
        color: theme.colors.neutral[800],
        marginBottom: '8px',
        marginRight: '60px',
        lineHeight: '1.4'
      }}>
        {task.title}
      </div>

      {/* Description */}
      {task.description && (
        <div style={{
          fontSize: '12px',
          color: theme.colors.neutral[600],
          marginBottom: '12px',
          lineHeight: '1.4'
        }}>
          {task.description.length > 100
            ? task.description.substring(0, 100) + '...'
            : task.description
          }
        </div>
      )}

      {/* Progress Bar */}
      {task.progress !== undefined && (
        <div style={{ marginBottom: '12px' }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '4px'
          }}>
            <span style={{ fontSize: '11px', color: theme.colors.neutral[500] }}>
              Progreso
            </span>
            <span style={{ fontSize: '11px', fontWeight: '600', color: theme.colors.neutral[700] }}>
              {task.progress}%
            </span>
          </div>
          <div style={{
            width: '100%',
            height: '4px',
            backgroundColor: theme.colors.neutral[200],
            borderRadius: '2px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${task.progress}%`,
              backgroundColor: theme.colors.primary[500],
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }} />
          </div>
        </div>
      )}

      {/* Meta Info */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        fontSize: '11px',
        color: theme.colors.neutral[500]
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User style={{ width: '12px', height: '12px' }} />
          {task.assignee?.name || 'Sin asignar'}
        </div>
        {task.due_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar style={{ width: '12px', height: '12px' }} />
            {new Date(task.due_date).toLocaleDateString('es-ES', {
              month: 'short',
              day: 'numeric'
            })}
          </div>
        )}
      </div>

      {/* Story Points */}
      {task.story_points && (
        <div style={{
          position: 'absolute',
          bottom: '8px',
          right: '8px',
          padding: '2px 6px',
          backgroundColor: theme.colors.primary[100],
          color: theme.colors.primary[700],
          borderRadius: '4px',
          fontSize: '10px',
          fontWeight: '600'
        }}>
          {task.story_points} pts
        </div>
      )}

      {/* Actions */}
      <div style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        display: 'flex',
        gap: '4px',
        opacity: 0,
        transition: 'opacity 0.2s'
      }}
      className="task-actions"
      >
        <button
          onClick={(e) => { e.stopPropagation(); onView && onView(task); }}
          style={{
            padding: '4px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: theme.colors.primary[100],
            color: theme.colors.primary[600],
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Eye style={{ width: '12px', height: '12px' }} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onEdit && onEdit(task); }}
          style={{
            padding: '4px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: theme.colors.success[100],
            color: theme.colors.success[600],
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Edit2 style={{ width: '12px', height: '12px' }} />
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete && onDelete(task); }}
          style={{
            padding: '4px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: theme.colors.danger[100],
            color: theme.colors.danger[600],
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
        >
          <Trash2 style={{ width: '12px', height: '12px' }} />
        </button>
      </div>
    </div>
  );
};

// 🏗️ COLUMN COMPONENT
const TaskColumn = ({ column, tasks, isOver, onAddTask, onEditTask, onViewTask, onDeleteTask }) => {
  const Icon = column.icon;

  return (
    <div style={{
      backgroundColor: 'white',
      borderRadius: '12px',
      border: `1px solid ${theme.colors.neutral[200]}`,
      boxShadow: theme.shadows.sm,
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      transition: 'all 0.2s ease',
      ...(isOver && {
        borderColor: column.color,
        boxShadow: `0 0 0 2px ${column.color}20`,
        backgroundColor: `${column.color}05`
      })
    }}>
      {/* Header */}
      <div style={{
        padding: '16px',
        borderBottom: `1px solid ${theme.colors.neutral[200]}`,
        background: `linear-gradient(135deg, ${column.bgColor} 0%, white 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            padding: '6px',
            backgroundColor: column.color,
            color: 'white',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Icon style={{ width: '14px', height: '14px' }} />
          </div>
          <div>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: theme.colors.neutral[800]
            }}>
              {column.title}
            </div>
            <div style={{
              fontSize: '11px',
              color: theme.colors.neutral[500]
            }}>
              {tasks.length} tarea{tasks.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        <button
          onClick={() => onAddTask && onAddTask(column.id)}
          style={{
            padding: '6px',
            border: 'none',
            borderRadius: '6px',
            backgroundColor: column.bgColor,
            color: column.color,
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = column.color;
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = column.bgColor;
            e.target.style.color = column.color;
          }}
        >
          <Plus style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      {/* Content */}
      <div style={{
        flex: 1,
        padding: '16px',
        overflow: 'auto',
        minHeight: '400px'
      }}>
        <SortableContext items={tasks.map(task => task.id)} strategy={verticalListSortingStrategy}>
          {tasks.map(task => (
            <TaskCard
              key={task.id}
              task={task}
              onEdit={onEditTask}
              onView={onViewTask}
              onDelete={onDeleteTask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px 20px',
            color: theme.colors.neutral[400],
            textAlign: 'center'
          }}>
            <Icon style={{ width: '32px', height: '32px', marginBottom: '8px' }} />
            <div style={{ fontSize: '14px', marginBottom: '4px' }}>No hay tareas</div>
            <div style={{ fontSize: '12px' }}>{column.description}</div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 MAIN COMPONENT
const TaskManagementFinal = ({ projectId, projectName, onClose }) => {
  // Estados principales
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);
  const [error, setError] = useState(null);

  // Estados de modales
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  // Estados de estadísticas
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    done: 0,
    overdue: 0
  });

  console.log('🎯 TaskManagementFinal renderizado con:', { projectId, projectName });

  // Configurar sensores para drag and drop
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

  // 🔄 CARGAR TAREAS DESDE API REAL
  const loadTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      setError(null);
      console.log('🔄 Cargando tareas reales para proyecto:', projectId);

      const response = await taskManagementService.getTasksByProject(projectId);
      console.log('✅ Respuesta de API:', response);

      const tasksData = response.data || response.tasks || [];
      setTasks(tasksData);

      // Calcular estadísticas
      const newStats = {
        total: tasksData.length,
        todo: tasksData.filter(t => t.status === 'todo').length,
        inProgress: tasksData.filter(t => t.status === 'in_progress').length,
        review: tasksData.filter(t => t.status === 'review').length,
        done: tasksData.filter(t => t.status === 'done').length,
        overdue: tasksData.filter(t => {
          return t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done';
        }).length
      };
      setStats(newStats);

    } catch (error) {
      console.error('❌ Error cargando tareas:', error);
      setError(error.message || 'Error al cargar las tareas');

      // Fallback a datos mock para desarrollo
      const mockTasks = [
        {
          id: 1,
          title: 'Implementar autenticación de usuarios',
          description: 'Desarrollar sistema completo de login/logout con JWT y manejo de sesiones',
          status: 'in_progress',
          priority: 'high',
          assignee: { name: 'Juan Pérez' },
          due_date: '2024-12-30',
          progress: 75,
          story_points: 8
        },
        {
          id: 2,
          title: 'Diseñar interfaz de dashboard',
          description: 'Crear wireframes y mockups para el dashboard principal del sistema',
          status: 'todo',
          priority: 'medium',
          assignee: { name: 'María García' },
          due_date: '2024-12-28',
          progress: 0,
          story_points: 5
        },
        {
          id: 3,
          title: 'Configurar CI/CD pipeline',
          description: 'Setup de GitHub Actions para deployment automático en staging y producción',
          status: 'done',
          priority: 'high',
          assignee: { name: 'Carlos López' },
          due_date: '2024-12-25',
          progress: 100,
          story_points: 13
        },
        {
          id: 4,
          title: 'Escribir documentación técnica',
          description: 'Documentar APIs, guías de desarrollo y procesos de deployment',
          status: 'review',
          priority: 'low',
          assignee: { name: 'Ana Martín' },
          due_date: '2025-01-05',
          progress: 90,
          story_points: 3
        }
      ];

      setTasks(mockTasks);
      const mockStats = {
        total: mockTasks.length,
        todo: mockTasks.filter(t => t.status === 'todo').length,
        inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
        review: mockTasks.filter(t => t.status === 'review').length,
        done: mockTasks.filter(t => t.status === 'done').length,
        overdue: 0
      };
      setStats(mockStats);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // 🔄 ACTUALIZAR TAREA EN API
  const updateTaskStatus = useCallback(async (taskId, newStatus) => {
    try {
      console.log('🔄 Actualizando estado de tarea:', { taskId, newStatus });

      // Actualizar en el backend
      await taskManagementService.updateTask(taskId, { status: newStatus });

      // Actualizar estado local
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, status: newStatus } : task
      ));

      console.log('✅ Estado de tarea actualizado exitosamente');
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      // Recargar tareas en caso de error
      loadTasks();
    }
  }, [loadTasks]);

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    return tasks.filter(task =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [tasks, searchTerm]);

  // Organizar tareas por columnas
  const tasksByColumn = useMemo(() => {
    const columns = {};
    TASK_COLUMNS.forEach(column => {
      columns[column.id] = filteredTasks.filter(task => task.status === column.id);
    });
    return columns;
  }, [filteredTasks]);

  // 🎯 DRAG AND DROP HANDLERS
  const handleDragStart = useCallback((event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setDraggedTask(task);
    console.log('🎯 Iniciando drag:', task?.title);
  }, [tasks]);

  const handleDragEnd = useCallback(async (event) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over) {
      console.log('❌ Drop cancelado - no hay destino válido');
      return;
    }

    const taskId = active.id;
    const newStatus = over.id;

    // Verificar que el destino sea una columna válida
    const validColumns = TASK_COLUMNS.map(col => col.id);
    if (!validColumns.includes(newStatus)) {
      console.log('❌ Drop cancelado - destino no válido:', newStatus);
      return;
    }

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      console.log('🎯 Moviendo tarea:', {
        taskTitle: task.title,
        from: task.status,
        to: newStatus
      });

      // Actualizar optimistamente la UI
      setTasks(prev => prev.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      ));

      // Actualizar en el backend
      await updateTaskStatus(taskId, newStatus);
    }
  }, [tasks, updateTaskStatus]);

  // 🎯 CRUD HANDLERS
  const handleCreateTask = useCallback(async (taskData) => {
    try {
      console.log('📝 Creando nueva tarea:', taskData);

      const response = await taskManagementService.createTask({
        ...taskData,
        project_id: projectId
      });

      console.log('✅ Tarea creada exitosamente:', response);

      // Recargar tareas para mostrar la nueva
      await loadTasks();

      setShowCreateModal(false);
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      alert('Error al crear la tarea: ' + error.message);
    }
  }, [projectId, loadTasks]);

  const handleUpdateTask = useCallback(async (taskId, updates) => {
    try {
      console.log('✏️ Actualizando tarea:', { taskId, updates });

      const response = await taskManagementService.updateTask(taskId, updates);

      console.log('✅ Tarea actualizada exitosamente:', response);

      // Actualizar estado local
      setTasks(prev => prev.map(task =>
        task.id === taskId ? { ...task, ...updates } : task
      ));

      setEditingTask(null);
    } catch (error) {
      console.error('❌ Error actualizando tarea:', error);
      alert('Error al actualizar la tarea: ' + error.message);
    }
  }, []);

  const handleDeleteTask = useCallback(async (task) => {
    if (!window.confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
      return;
    }

    try {
      console.log('🗑️ Eliminando tarea:', task.id);

      await taskManagementService.deleteTask(task.id);

      console.log('✅ Tarea eliminada exitosamente');

      // Actualizar estado local
      setTasks(prev => prev.filter(t => t.id !== task.id));
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error);
      alert('Error al eliminar la tarea: ' + error.message);
    }
  }, []);

  const handleAddTaskToColumn = useCallback((columnId) => {
    setEditingTask({ status: columnId });
    setShowCreateModal(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setShowCreateModal(true);
  }, []);

  const handleViewTask = useCallback((task) => {
    setViewingTask(task);
  }, []);

  // Efectos
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  // CSS para mostrar acciones en hover
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .task-card:hover .task-actions {
        opacity: 1 !important;
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  if (loading) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: theme.gradients.dark,
        color: 'white'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '3px solid #3b82f6',
            borderTop: '3px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ color: theme.colors.neutral[300] }}>
            Cargando tareas del proyecto...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      background: theme.gradients.dark,
      fontFamily: 'Inter, system-ui, sans-serif',
      color: 'white'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '20px 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '10px',
              background: theme.gradients.glass,
              borderRadius: '10px',
              border: '1px solid rgba(255,255,255,0.1)'
            }}>
              <Target style={{ width: '24px', height: '24px', color: '#3b82f6' }} />
            </div>
            <div>
              <h2 style={{
                margin: 0,
                fontSize: '24px',
                fontWeight: '700',
                background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                Gestión de Tareas
              </h2>
              <p style={{
                margin: '4px 0 0 0',
                fontSize: '14px',
                color: 'rgba(255,255,255,0.7)'
              }}>
                Proyecto: <strong style={{ color: 'white' }}>{projectName}</strong> (ID: {projectId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              background: 'rgba(255,255,255,0.1)',
              color: 'rgba(255,255,255,0.7)',
              borderRadius: '8px',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.2)';
              e.target.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.target.style.background = 'rgba(255,255,255,0.1)';
              e.target.style.color = 'rgba(255,255,255,0.7)';
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(6, 1fr)',
          gap: '24px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: 'white' }}>
              {stats.total}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              Total
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#3b82f6' }}>
              {stats.todo}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              Por Hacer
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#f59e0b' }}>
              {stats.inProgress}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              En Progreso
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#8b5cf6' }}>
              {stats.review}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              En Revisión
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#22c55e' }}>
              {stats.done}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              Completadas
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '28px', fontWeight: '700', color: '#ef4444' }}>
              {stats.overdue}
            </div>
            <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
              Atrasadas
            </div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={{
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
            <Search style={{
              position: 'absolute',
              left: '12px',
              width: '16px',
              height: '16px',
              color: 'rgba(255,255,255,0.5)'
            }} />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                paddingLeft: '40px',
                paddingRight: '12px',
                paddingTop: '8px',
                paddingBottom: '8px',
                border: '1px solid rgba(255,255,255,0.2)',
                borderRadius: '8px',
                fontSize: '14px',
                width: '300px',
                background: 'rgba(255,255,255,0.1)',
                color: 'white',
                outline: 'none'
              }}
            />
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 16px',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              background: 'linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)',
              color: 'white',
              transition: 'all 0.2s'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-1px)';
              e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = 'none';
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div style={{
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          color: '#fca5a5',
          padding: '12px 24px',
          fontSize: '14px'
        }}>
          ⚠️ Error: {error} (Mostrando datos de ejemplo)
        </div>
      )}

      {/* Kanban Board */}
      <div style={{
        flex: 1,
        padding: '24px',
        overflow: 'auto'
      }}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '24px',
            height: '100%'
          }}>
            {TASK_COLUMNS.map(column => (
              <DroppableColumn key={column.id} id={column.id}>
                <TaskColumn
                  column={column}
                  tasks={tasksByColumn[column.id] || []}
                  onAddTask={handleAddTaskToColumn}
                  onEditTask={handleEditTask}
                  onViewTask={handleViewTask}
                  onDeleteTask={handleDeleteTask}
                />
              </DroppableColumn>
            ))}
          </div>

          <DragOverlay>
            {draggedTask ? (
              <div style={{
                opacity: 0.8,
                transform: 'rotate(5deg)',
                cursor: 'grabbing'
              }}>
                <TaskCard
                  task={draggedTask}
                  onEdit={() => {}}
                  onView={() => {}}
                  onDelete={() => {}}
                />
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Create/Edit Modal - PLACEHOLDER */}
      {showCreateModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: theme.colors.neutral[800] }}>
                {editingTask?.id ? 'Editar Tarea' : 'Nueva Tarea'}
              </h3>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTask(null);
                }}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: theme.colors.neutral[500]
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ color: theme.colors.neutral[600] }}>
              📝 Formulario de tarea en desarrollo...
              <br />
              Por ahora el CRUD funciona con datos mock.
              <br />
              <br />
              <strong>Estado de la tarea:</strong> {editingTask?.status || 'todo'}
              <br />
              <strong>Proyecto ID:</strong> {projectId}
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  setEditingTask(null);
                }}
                style={{
                  padding: '8px 16px',
                  border: `1px solid ${theme.colors.neutral[300]}`,
                  background: 'white',
                  color: theme.colors.neutral[700],
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={() => {
                  // Crear/editar lógica aquí
                  console.log('💾 Guardando tarea...');
                  setShowCreateModal(false);
                  setEditingTask(null);
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: theme.colors.primary[500],
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                {editingTask?.id ? 'Actualizar' : 'Crear'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Task View Modal */}
      {viewingTask && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflow: 'auto'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: 0, color: theme.colors.neutral[800] }}>
                Detalles de la Tarea
              </h3>
              <button
                onClick={() => setViewingTask(null)}
                style={{
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  color: theme.colors.neutral[500]
                }}
              >
                <X style={{ width: '20px', height: '20px' }} />
              </button>
            </div>

            <div style={{ color: theme.colors.neutral[700] }}>
              <h4 style={{ color: theme.colors.neutral[800] }}>{viewingTask.title}</h4>
              {viewingTask.description && (
                <p style={{ marginBottom: '16px' }}>{viewingTask.description}</p>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <strong>Estado:</strong> {viewingTask.status}
                </div>
                <div>
                  <strong>Prioridad:</strong> {viewingTask.priority}
                </div>
                <div>
                  <strong>Asignado a:</strong> {viewingTask.assignee?.name || 'Sin asignar'}
                </div>
                <div>
                  <strong>Fecha límite:</strong> {
                    viewingTask.due_date
                      ? new Date(viewingTask.due_date).toLocaleDateString('es-ES')
                      : 'Sin fecha'
                  }
                </div>
                {viewingTask.story_points && (
                  <div>
                    <strong>Story Points:</strong> {viewingTask.story_points}
                  </div>
                )}
                {viewingTask.progress !== undefined && (
                  <div>
                    <strong>Progreso:</strong> {viewingTask.progress}%
                  </div>
                )}
              </div>
            </div>

            <div style={{
              display: 'flex',
              gap: '12px',
              marginTop: '20px',
              justifyContent: 'flex-end'
            }}>
              <button
                onClick={() => {
                  setViewingTask(null);
                  handleEditTask(viewingTask);
                }}
                style={{
                  padding: '8px 16px',
                  border: 'none',
                  background: theme.colors.primary[500],
                  color: 'white',
                  borderRadius: '6px',
                  cursor: 'pointer'
                }}
              >
                Editar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementFinal;