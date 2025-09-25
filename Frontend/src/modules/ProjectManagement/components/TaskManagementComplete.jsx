// 🎯 TASK MANAGEMENT COMPLETE - SUPER SUBMÓDULO CON ESTILOS INLINE
// ================================================================

import React, { useState, useEffect, useCallback } from 'react';
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
  Activity
} from 'lucide-react';

// 🎨 ESTILOS BASE
const styles = {
  container: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    backgroundColor: '#f8fafc',
    fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
  },
  header: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '20px 24px'
  },
  headerContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  title: {
    fontSize: '24px',
    fontWeight: '700',
    color: '#1e293b',
    margin: 0
  },
  subtitle: {
    fontSize: '14px',
    color: '#64748b',
    margin: '4px 0 0 0'
  },
  statsBar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 24px'
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(5, 1fr)',
    gap: '24px'
  },
  statItem: {
    textAlign: 'center'
  },
  statNumber: {
    fontSize: '28px',
    fontWeight: '700',
    marginBottom: '4px'
  },
  statLabel: {
    fontSize: '12px',
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  },
  toolbar: {
    backgroundColor: 'white',
    borderBottom: '1px solid #e2e8f0',
    padding: '16px 24px'
  },
  toolbarContent: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px'
  },
  searchBox: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  searchInput: {
    paddingLeft: '40px',
    paddingRight: '12px',
    paddingTop: '8px',
    paddingBottom: '8px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    fontSize: '14px',
    width: '300px',
    outline: 'none'
  },
  searchIcon: {
    position: 'absolute',
    left: '12px',
    color: '#9ca3af',
    width: '16px',
    height: '16px'
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500',
    transition: 'all 0.2s'
  },
  buttonPrimary: {
    backgroundColor: '#3b82f6',
    color: 'white'
  },
  kanbanBoard: {
    flex: 1,
    padding: '24px',
    overflow: 'auto'
  },
  columnsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '24px',
    height: '100%'
  },
  column: {
    backgroundColor: 'white',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column'
  },
  columnHeader: {
    padding: '16px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  columnTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#1e293b'
  },
  columnCount: {
    fontSize: '12px',
    color: '#64748b'
  },
  columnContent: {
    flex: 1,
    padding: '16px',
    gap: '12px',
    display: 'flex',
    flexDirection: 'column',
    minHeight: '400px'
  },
  taskCard: {
    backgroundColor: 'white',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    cursor: 'move',
    transition: 'all 0.2s',
    position: 'relative'
  },
  taskTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#1e293b',
    marginBottom: '8px',
    lineHeight: '1.4'
  },
  taskDescription: {
    fontSize: '12px',
    color: '#64748b',
    marginBottom: '12px',
    lineHeight: '1.4'
  },
  taskMeta: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    fontSize: '11px',
    color: '#64748b'
  },
  priorityBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '2px 8px',
    borderRadius: '12px',
    fontSize: '11px',
    fontWeight: '500'
  },
  emptyState: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '40px',
    color: '#9ca3af',
    textAlign: 'center'
  }
};

// 🎯 CONFIGURACIÓN DE COLUMNAS
const TASK_COLUMNS = [
  {
    id: 'todo',
    title: 'Por Hacer',
    color: '#3b82f6',
    bgColor: '#eff6ff',
    icon: Circle
  },
  {
    id: 'in_progress',
    title: 'En Progreso',
    color: '#f59e0b',
    bgColor: '#fff7ed',
    icon: Activity
  },
  {
    id: 'review',
    title: 'En Revisión',
    color: '#8b5cf6',
    bgColor: '#f3e8ff',
    icon: Eye
  },
  {
    id: 'done',
    title: 'Completado',
    color: '#10b981',
    bgColor: '#ecfdf5',
    icon: CheckCircle
  }
];

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
    opacity: isDragging ? 0.5 : 1,
    ...styles.taskCard
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getPriorityBg = (priority) => {
    switch (priority) {
      case 'high': return '#fef2f2';
      case 'medium': return '#fff7ed';
      case 'low': return '#ecfdf5';
      default: return '#f3f4f6';
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onMouseEnter={(e) => {
        e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        e.target.style.transform = 'translateY(-2px)';
      }}
      onMouseLeave={(e) => {
        e.target.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)';
        e.target.style.transform = 'translateY(0)';
      }}
    >
      <div style={styles.taskTitle}>
        {task.title}
      </div>

      {task.description && (
        <div style={styles.taskDescription}>
          {task.description}
        </div>
      )}

      <div style={{
        ...styles.priorityBadge,
        backgroundColor: getPriorityBg(task.priority),
        color: getPriorityColor(task.priority),
        marginBottom: '8px'
      }}>
        <Flag style={{ width: '10px', height: '10px' }} />
        {task.priority || 'normal'}
      </div>

      <div style={styles.taskMeta}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User style={{ width: '12px', height: '12px' }} />
          {task.assignee?.name || 'Sin asignar'}
        </div>
        {task.due_date && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Calendar style={{ width: '12px', height: '12px' }} />
            {new Date(task.due_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
          </div>
        )}
      </div>

      {/* Actions */}
      <div style={{
        position: 'absolute',
        top: '8px',
        right: '8px',
        display: 'flex',
        gap: '4px',
        opacity: 0,
        transition: 'opacity 0.2s'
      }}
      onMouseEnter={(e) => { e.target.style.opacity = 1; }}
      >
        <button
          onClick={(e) => { e.stopPropagation(); onView && onView(task); }}
          style={{
            padding: '4px',
            border: 'none',
            borderRadius: '4px',
            backgroundColor: '#eff6ff',
            color: '#3b82f6',
            cursor: 'pointer'
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
            backgroundColor: '#ecfdf5',
            color: '#10b981',
            cursor: 'pointer'
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
            backgroundColor: '#fef2f2',
            color: '#ef4444',
            cursor: 'pointer'
          }}
        >
          <Trash2 style={{ width: '12px', height: '12px' }} />
        </button>
      </div>
    </div>
  );
};

// 🏗️ COLUMN COMPONENT
const TaskColumn = ({ column, tasks, onAddTask, onEditTask, onViewTask, onDeleteTask }) => {
  const Icon = column.icon;

  return (
    <div style={styles.column}>
      <div style={{
        ...styles.columnHeader,
        background: `linear-gradient(135deg, ${column.bgColor} 0%, white 100%)`
      }}>
        <div>
          <div style={{
            ...styles.columnTitle,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <Icon style={{ width: '16px', height: '16px', color: column.color }} />
            {column.title}
          </div>
          <div style={styles.columnCount}>
            {tasks.length} tareas
          </div>
        </div>
        <button
          onClick={() => onAddTask && onAddTask(column.id)}
          style={{
            ...styles.button,
            backgroundColor: column.bgColor,
            color: column.color,
            padding: '6px'
          }}
        >
          <Plus style={{ width: '14px', height: '14px' }} />
        </button>
      </div>

      <div style={styles.columnContent}>
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
          <div style={styles.emptyState}>
            <Icon style={{ width: '32px', height: '32px', marginBottom: '8px' }} />
            <div>No hay tareas</div>
          </div>
        )}
      </div>
    </div>
  );
};

// 🎯 MAIN COMPONENT
const TaskManagementComplete = ({ projectId, projectName, onClose }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [draggedTask, setDraggedTask] = useState(null);

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    todo: 0,
    inProgress: 0,
    review: 0,
    done: 0
  });

  // Sensores para drag and drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 }
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Cargar tareas mock
  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);

      // Mock data
      const mockTasks = [
        {
          id: 1,
          title: 'Implementar autenticación de usuarios',
          description: 'Desarrollar sistema completo de login/logout con JWT',
          status: 'in_progress',
          priority: 'high',
          assignee: { name: 'Juan Pérez' },
          due_date: '2024-12-30'
        },
        {
          id: 2,
          title: 'Diseñar interfaz de dashboard',
          description: 'Crear wireframes y mockups para el dashboard principal',
          status: 'todo',
          priority: 'medium',
          assignee: { name: 'María García' },
          due_date: '2024-12-28'
        },
        {
          id: 3,
          title: 'Configurar CI/CD pipeline',
          description: 'Setup de GitHub Actions para deployment automático',
          status: 'done',
          priority: 'high',
          assignee: { name: 'Carlos López' },
          due_date: '2024-12-25'
        },
        {
          id: 4,
          title: 'Escribir documentación técnica',
          description: 'Documentar APIs y guías de desarrollo',
          status: 'review',
          priority: 'low',
          assignee: { name: 'Ana Martín' },
          due_date: '2025-01-05'
        }
      ];

      setTasks(mockTasks);

      // Calcular stats
      const newStats = {
        total: mockTasks.length,
        todo: mockTasks.filter(t => t.status === 'todo').length,
        inProgress: mockTasks.filter(t => t.status === 'in_progress').length,
        review: mockTasks.filter(t => t.status === 'review').length,
        done: mockTasks.filter(t => t.status === 'done').length
      };
      setStats(newStats);

    } catch (error) {
      console.error('❌ Error cargando tareas:', error);
    } finally {
      setLoading(false);
    }
  }, [projectId]);

  // Filtrar tareas
  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Organizar por columnas
  const tasksByColumn = {};
  TASK_COLUMNS.forEach(column => {
    tasksByColumn[column.id] = filteredTasks.filter(task => task.status === column.id);
  });

  // Drag handlers
  const handleDragStart = (event) => {
    setDraggedTask(tasks.find(t => t.id === event.active.id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setDraggedTask(null);

    if (!over) return;

    const taskId = active.id;
    const newStatus = over.id;

    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      const updatedTasks = tasks.map(t =>
        t.id === taskId ? { ...t, status: newStatus } : t
      );
      setTasks(updatedTasks);
    }
  };

  // CRUD handlers
  const handleAddTask = (status) => {

  };

  const handleEditTask = (task) => {

  };

  const handleViewTask = (task) => {

  };

  const handleDeleteTask = (task) => {
    if (window.confirm(`¿Eliminar "${task.title}"?`)) {
      setTasks(prev => prev.filter(t => t.id !== task.id));
    }
  };

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  if (loading) {
    return (
      <div style={{
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8fafc'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '32px',
            height: '32px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }} />
          <div style={{ color: '#64748b' }}>Cargando tareas del proyecto...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.headerContent}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{
              padding: '8px',
              backgroundColor: '#eff6ff',
              color: '#3b82f6',
              borderRadius: '8px'
            }}>
              <Target style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h2 style={styles.title}>
                🎯 SUPER SUBMÓDULO DE TAREAS PRO
              </h2>
              <p style={styles.subtitle}>
                Proyecto: <strong>{projectName}</strong> (ID: {projectId})
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              padding: '8px',
              border: 'none',
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={styles.statsBar}>
        <div style={styles.statsGrid}>
          <div style={styles.statItem}>
            <div style={{ ...styles.statNumber, color: '#1e293b' }}>{stats.total}</div>
            <div style={styles.statLabel}>Total</div>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statNumber, color: '#3b82f6' }}>{stats.todo}</div>
            <div style={styles.statLabel}>Por Hacer</div>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statNumber, color: '#f59e0b' }}>{stats.inProgress}</div>
            <div style={styles.statLabel}>En Progreso</div>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statNumber, color: '#8b5cf6' }}>{stats.review}</div>
            <div style={styles.statLabel}>En Revisión</div>
          </div>
          <div style={styles.statItem}>
            <div style={{ ...styles.statNumber, color: '#10b981' }}>{stats.done}</div>
            <div style={styles.statLabel}>Completadas</div>
          </div>
        </div>
      </div>

      {/* Toolbar */}
      <div style={styles.toolbar}>
        <div style={styles.toolbarContent}>
          <div style={styles.searchBox}>
            <Search style={styles.searchIcon} />
            <input
              type="text"
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>

          <button
            onClick={() => handleAddTask('todo')}
            style={{
              ...styles.button,
              ...styles.buttonPrimary
            }}
          >
            <Plus style={{ width: '16px', height: '16px' }} />
            Nueva Tarea
          </button>
        </div>
      </div>

      {/* Kanban Board */}
      <div style={styles.kanbanBoard}>
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div style={styles.columnsGrid}>
            {TASK_COLUMNS.map(column => (
              <TaskColumn
                key={column.id}
                column={column}
                tasks={tasksByColumn[column.id] || []}
                onAddTask={handleAddTask}
                onEditTask={handleEditTask}
                onViewTask={handleViewTask}
                onDeleteTask={handleDeleteTask}
              />
            ))}
          </div>

          <DragOverlay>
            {draggedTask ? (
              <TaskCard
                task={draggedTask}
                onEdit={() => {}}
                onView={() => {}}
                onDelete={() => {}}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

export default TaskManagementComplete;