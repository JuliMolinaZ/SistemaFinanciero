// 🎯 TASK MANAGEMENT PRO - SUPER SUBMÓDULO DE GESTIÓN DE TAREAS
// ===============================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable
} from '@dnd-kit/sortable';
import {
  CSS
} from '@dnd-kit/utilities';

// Icons
import {
  X,
  Plus,
  Search,
  Filter,
  Calendar,
  User,
  Clock,
  Flag,
  MoreHorizontal,
  Edit2,
  Trash2,
  Eye,
  CheckCircle,
  Circle,
  AlertCircle,
  Zap,
  Target,
  BarChart3,
  Users,
  Activity,
  TrendingUp,
  FileText,
  Save,
  ArrowRight
} from 'lucide-react';

// Servicios
import { taskManagementService } from '../../../services/taskManagementService';

// Componentes
import TaskFormModal from './TaskFormModal';

// 🎨 CONFIGURACIÓN DE COLUMNAS KANBAN
const TASK_COLUMNS = [
  {
    id: 'todo',
    title: 'Por Hacer',
    color: '#E3F2FD',
    accent: '#2196F3',
    bgGradient: 'linear-gradient(135deg, #E3F2FD 0%, #BBDEFB 100%)',
    icon: Circle,
    description: 'Tareas pendientes de iniciar'
  },
  {
    id: 'in_progress',
    title: 'En Progreso',
    color: '#FFF3E0',
    accent: '#FF9800',
    bgGradient: 'linear-gradient(135deg, #FFF3E0 0%, #FFE0B2 100%)',
    icon: Activity,
    description: 'Tareas actualmente en desarrollo'
  },
  {
    id: 'review',
    title: 'En Revisión',
    color: '#F3E5F5',
    accent: '#9C27B0',
    bgGradient: 'linear-gradient(135deg, #F3E5F5 0%, #E1BEE7 100%)',
    icon: Eye,
    description: 'Tareas esperando aprobación'
  },
  {
    id: 'done',
    title: 'Completado',
    color: '#E8F5E8',
    accent: '#4CAF50',
    bgGradient: 'linear-gradient(135deg, #E8F5E8 0%, #C8E6C9 100%)',
    icon: CheckCircle,
    description: 'Tareas finalizadas'
  }
];

// 🎯 TASK CARD COMPONENT
const TaskCard = ({ task, isDragging, onEdit, onView, onDelete }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: sortableIsDragging
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: sortableIsDragging ? 0.5 : 1
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#FF5722';
      case 'medium': return '#FF9800';
      case 'low': return '#4CAF50';
      default: return '#9E9E9E';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'high': return <Flag className="w-3 h-3" />;
      case 'medium': return <AlertCircle className="w-3 h-3" />;
      case 'low': return <CheckCircle className="w-3 h-3" />;
      default: return <Circle className="w-3 h-3" />;
    }
  };

  const formatDate = (date) => {
    if (!date) return null;
    return new Date(date).toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`
        bg-white rounded-xl shadow-sm border border-gray-100
        hover:shadow-lg hover:border-gray-200
        transition-all duration-200 ease-in-out
        cursor-move group
        ${sortableIsDragging ? 'rotate-3 scale-105' : ''}
      `}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h4 className="text-sm font-semibold text-gray-900 line-clamp-2 leading-snug">
            {task.title}
          </h4>
          <div className="flex items-center gap-1 ml-2">
            <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 rounded-md transition-opacity">
              <MoreHorizontal className="w-3 h-3 text-gray-400" />
            </button>
          </div>
        </div>

        {/* Description */}
        {task.description && (
          <p className="text-xs text-gray-600 mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {/* Priority & Metadata */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {/* Priority */}
            <div
              className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{
                backgroundColor: `${getPriorityColor(task.priority)}15`,
                color: getPriorityColor(task.priority)
              }}
            >
              {getPriorityIcon(task.priority)}
              <span className="capitalize">{task.priority || 'normal'}</span>
            </div>

            {/* Story Points */}
            {task.story_points && (
              <div className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                {task.story_points} pts
              </div>
            )}
          </div>
        </div>

        {/* Assignee & Due Date */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <User className="w-3 h-3" />
            <span>{task.assignee?.name || 'Sin asignar'}</span>
          </div>
          {task.due_date && (
            <div className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              <span>{formatDate(task.due_date)}</span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        {task.progress !== undefined && (
          <div className="mt-3">
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs text-gray-500">Progreso</span>
              <span className="text-xs font-medium text-gray-700">{task.progress}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5">
              <div
                className="bg-blue-500 h-1.5 rounded-full transition-all duration-300"
                style={{ width: `${task.progress}%` }}
              />
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-end gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onView && onView(task);
            }}
            className="p-1.5 hover:bg-blue-50 text-blue-600 rounded-md transition-colors"
          >
            <Eye className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onEdit && onEdit(task);
            }}
            className="p-1.5 hover:bg-green-50 text-green-600 rounded-md transition-colors"
          >
            <Edit2 className="w-3 h-3" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete && onDelete(task);
            }}
            className="p-1.5 hover:bg-red-50 text-red-600 rounded-md transition-colors"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
};

// 🏗️ DROPPABLE COLUMN COMPONENT
const TaskColumn = ({ column, tasks, isOver, onAddTask, onEditTask, onViewTask, onDeleteTask }) => {
  const Icon = column.icon;

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div
        className="flex items-center justify-between p-4 rounded-t-xl border-b border-gray-100"
        style={{ background: column.bgGradient }}
      >
        <div className="flex items-center gap-2">
          <div
            className="p-2 rounded-lg shadow-sm"
            style={{ backgroundColor: column.accent, color: 'white' }}
          >
            <Icon className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 text-sm">{column.title}</h3>
            <p className="text-xs text-gray-600">{tasks.length} tareas</p>
          </div>
        </div>
        <button
          onClick={() => onAddTask && onAddTask(column.id)}
          className="p-1.5 hover:bg-white hover:bg-opacity-50 rounded-lg transition-colors"
          style={{ color: column.accent }}
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Column Content */}
      <div
        className={`
          flex-1 p-4 space-y-3 min-h-96 rounded-b-xl
          transition-all duration-200
          ${isOver ? 'bg-blue-50 border-2 border-blue-200 border-dashed' : 'bg-gray-50'}
        `}
      >
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
          <div className="flex flex-col items-center justify-center py-12 text-gray-400">
            <Icon className="w-8 h-8 mb-2" />
            <p className="text-sm">{column.description}</p>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 MAIN TASK MANAGEMENT COMPONENT
const TaskManagementPro = ({ projectId, projectName, onClose }) => {
  // Estados principales
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [draggedTask, setDraggedTask] = useState(null);
  const [editingTask, setEditingTask] = useState(null);
  const [viewingTask, setViewingTask] = useState(null);

  // Estados de estadísticas
  const [projectStats, setProjectStats] = useState({
    total: 0,
    completed: 0,
    inProgress: 0,
    pending: 0,
    overdue: 0
  });

  console.log('🎯 TaskManagementPro renderizado con:', { projectId, projectName });

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

  // Cargar tareas del proyecto
  const loadTasks = useCallback(async () => {
    if (!projectId) return;

    try {
      setLoading(true);
      console.log('🔄 Cargando tareas para proyecto:', projectId);

      // Simular datos mientras implementamos la API
      const mockTasks = [
        {
          id: 1,
          title: 'Implementar autenticación de usuarios',
          description: 'Desarrollar sistema completo de login/logout con JWT',
          status: 'in_progress',
          priority: 'high',
          assignee: { name: 'Juan Pérez' },
          due_date: '2024-12-30',
          progress: 75,
          story_points: 8,
          created_at: '2024-12-15'
        },
        {
          id: 2,
          title: 'Diseñar interfaz de dashboard',
          description: 'Crear wireframes y mockups para el dashboard principal',
          status: 'todo',
          priority: 'medium',
          assignee: { name: 'María García' },
          due_date: '2024-12-28',
          progress: 0,
          story_points: 5,
          created_at: '2024-12-14'
        },
        {
          id: 3,
          title: 'Configurar CI/CD pipeline',
          description: 'Setup de GitHub Actions para deployment automático',
          status: 'done',
          priority: 'high',
          assignee: { name: 'Carlos López' },
          due_date: '2024-12-25',
          progress: 100,
          story_points: 13,
          created_at: '2024-12-10'
        },
        {
          id: 4,
          title: 'Escribir documentación técnica',
          description: 'Documentar APIs y guías de desarrollo',
          status: 'review',
          priority: 'low',
          assignee: { name: 'Ana Martín' },
          due_date: '2025-01-05',
          progress: 90,
          story_points: 3,
          created_at: '2024-12-12'
        }
      ];

      setTasks(mockTasks);
      calculateStats(mockTasks);

    } catch (error) {
      console.error('❌ Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Calcular estadísticas
  const calculateStats = useCallback((taskList) => {
    const stats = {
      total: taskList.length,
      completed: taskList.filter(t => t.status === 'done').length,
      inProgress: taskList.filter(t => t.status === 'in_progress').length,
      pending: taskList.filter(t => t.status === 'todo').length,
      overdue: taskList.filter(t => {
        return t.due_date && new Date(t.due_date) < new Date() && t.status !== 'done';
      }).length
    };
    setProjectStats(stats);
  }, []);

  // Filtrar tareas
  const filteredTasks = useMemo(() => {
    let filtered = tasks;

    // Filtro por búsqueda
    if (searchTerm) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filtro por categoría
    if (selectedFilter !== 'all') {
      switch (selectedFilter) {
        case 'priority':
          filtered = filtered.filter(task => task.priority === 'high');
          break;
        case 'assigned':
          filtered = filtered.filter(task => task.assignee);
          break;
        case 'overdue':
          filtered = filtered.filter(task => {
            return task.due_date && new Date(task.due_date) < new Date() && task.status !== 'done';
          });
          break;
      }
    }

    return filtered;
  }, [tasks, searchTerm, selectedFilter]);

  // Organizar tareas por columnas
  const tasksByColumn = useMemo(() => {
    const columns = {};
    TASK_COLUMNS.forEach(column => {
      columns[column.id] = filteredTasks.filter(task => task.status === column.id);
    });
    return columns;
  }, [filteredTasks]);

  // Handle drag and drop
  const handleDragStart = (event) => {
    const { active } = event;
    const task = tasks.find(t => t.id === active.id);
    setDraggedTask(task);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    // Solo actualizar si el status cambió
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      console.log('🔄 Actualizando tarea:', { taskId, newStatus });

      const updatedTasks = tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );

      setTasks(updatedTasks);
      calculateStats(updatedTasks);

      // Aquí iría la llamada a la API
      // taskManagementService.updateTask(taskId, { status: newStatus });
    }
  };

  // Funciones CRUD
  const handleCreateTask = useCallback((status = 'todo') => {
    setEditingTask(null);
    setShowCreateForm(true);
  }, []);

  const handleEditTask = useCallback((task) => {
    setEditingTask(task);
    setShowCreateForm(true);
  }, []);

  const handleViewTask = useCallback((task) => {
    setViewingTask(task);
  }, []);

  const handleDeleteTask = useCallback(async (task) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar la tarea "${task.title}"?`)) {
      try {
        console.log('🗑️ Eliminando tarea:', task.id);

        // Actualizar lista local
        const updatedTasks = tasks.filter(t => t.id !== task.id);
        setTasks(updatedTasks);
        calculateStats(updatedTasks);

        // En producción: await taskManagementService.deleteTask(task.id);

      } catch (error) {
        console.error('❌ Error eliminando tarea:', error);
        // Recargar en caso de error
        loadTasks();
      }
    }
  }, [tasks, calculateStats, loadTasks]);

  const handleSaveTask = useCallback(async (taskData) => {
    try {
      console.log('💾 Guardando tarea:', taskData);

      if (editingTask) {
        // Actualizar tarea existente
        const updatedTasks = tasks.map(t => t.id === editingTask.id ? taskData : t);
        setTasks(updatedTasks);
        calculateStats(updatedTasks);

        // En producción: await taskManagementService.updateTask(editingTask.id, taskData);

      } else {
        // Crear nueva tarea
        const newTask = {
          ...taskData,
          id: Date.now(), // En producción será generado por el backend
          created_at: new Date().toISOString(),
          progress: 0
        };

        const updatedTasks = [...tasks, newTask];
        setTasks(updatedTasks);
        calculateStats(updatedTasks);

        // En producción: await taskManagementService.createTask(taskData);
      }

      setShowCreateForm(false);
      setEditingTask(null);

    } catch (error) {
      console.error('❌ Error guardando tarea:', error);
    }
  }, [editingTask, tasks, calculateStats]);

  const handleAddTaskToColumn = useCallback((columnId) => {
    setEditingTask({ status: columnId });
    setShowCreateForm(true);
  }, []);

  // Efectos
  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  if (loading) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando tareas del proyecto...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f9fafb',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 24px'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                <Target className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  🎯 SUPER SUBMÓDULO DE TAREAS PRO 🎯
                </h2>
                <p className="text-sm text-gray-600">
                  Proyecto: <span className="font-medium">{projectName}</span> (ID: {projectId})
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Stats Dashboard */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="grid grid-cols-5 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-900">{projectStats.total}</div>
            <div className="text-sm text-gray-600">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{projectStats.pending}</div>
            <div className="text-sm text-gray-600">Pendientes</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-600">{projectStats.inProgress}</div>
            <div className="text-sm text-gray-600">En Progreso</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{projectStats.completed}</div>
            <div className="text-sm text-gray-600">Completadas</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{projectStats.overdue}</div>
            <div className="text-sm text-gray-600">Atrasadas</div>
          </div>
        </div>
      </div>

      {/* Filters & Search */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Buscar tareas..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Filters */}
            <select
              value={selectedFilter}
              onChange={(e) => setSelectedFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">Todas las tareas</option>
              <option value="priority">Alta prioridad</option>
              <option value="assigned">Asignadas</option>
              <option value="overdue">Atrasadas</option>
            </select>
          </div>

          <button
            onClick={handleCreateTask}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div className="flex-1 p-6 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-4 gap-6 h-full">
            {TASK_COLUMNS.map(column => (
              <div
                key={column.id}
                className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden"
              >
                <TaskColumn
                  column={column}
                  tasks={tasksByColumn[column.id] || []}
                  isOver={false}
                  onAddTask={handleAddTaskToColumn}
                  onEditTask={handleEditTask}
                  onViewTask={handleViewTask}
                  onDeleteTask={handleDeleteTask}
                />
              </div>
            ))}
          </div>

          <DragOverlay>
            {draggedTask ? <TaskCard task={draggedTask} isDragging /> : null}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task Form Modal */}
      <TaskFormModal
        isOpen={showCreateForm}
        onClose={() => {
          setShowCreateForm(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        task={editingTask}
        projectId={projectId}
      />

      {/* Task View Modal */}
      {viewingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-900">Detalles de la Tarea</h2>
              <button
                onClick={() => setViewingTask(null)}
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{viewingTask.title}</h3>
                  {viewingTask.description && (
                    <p className="text-gray-600 mt-2">{viewingTask.description}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm font-medium text-gray-500">Estado:</span>
                    <p className="text-gray-900 capitalize">{viewingTask.status.replace('_', ' ')}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Prioridad:</span>
                    <p className="text-gray-900 capitalize">{viewingTask.priority}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Asignado a:</span>
                    <p className="text-gray-900">{viewingTask.assignee?.name || 'Sin asignar'}</p>
                  </div>
                  <div>
                    <span className="text-sm font-medium text-gray-500">Fecha límite:</span>
                    <p className="text-gray-900">
                      {viewingTask.due_date ? new Date(viewingTask.due_date).toLocaleDateString('es-ES') : 'Sin fecha'}
                    </p>
                  </div>
                  {viewingTask.story_points && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Story Points:</span>
                      <p className="text-gray-900">{viewingTask.story_points}</p>
                    </div>
                  )}
                  {viewingTask.progress !== undefined && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Progreso:</span>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${viewingTask.progress}%` }}
                          />
                        </div>
                        <span className="text-sm text-gray-600">{viewingTask.progress}%</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => {
                      setViewingTask(null);
                      handleEditTask(viewingTask);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Edit2 className="w-4 h-4" />
                    Editar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskManagementPro;