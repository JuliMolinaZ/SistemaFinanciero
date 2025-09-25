// Componente DroppableZone para @dnd-kit
const DroppableZone = ({ id, children, status, taskList, onEdit, onDelete, users, getStatusLabel, getColumnStyle }) => {
  const columnStyle = getColumnStyle(status);
  
  const { isOver, setNodeRef } = useDroppable({
    id: status,
  });
  
  return (
    <div 
      key={status} 
      className="kanban-column"
      ref={setNodeRef}
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        maxHeight: '100%',
        backgroundColor: columnStyle.bodyBg,
        borderRadius: '8px',
        border: `1px solid ${columnStyle.borderColor}`,
        boxShadow: isOver ? '0 4px 12px rgba(0, 0, 0, 0.15)' : '0 1px 3px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden',
        transition: 'all 0.2s ease',
        opacity: isOver ? 0.8 : 1,
        transform: isOver ? 'scale(1.02)' : 'scale(1)'
      }}
    >
      <div 
        style={{
          backgroundColor: columnStyle.headerBg,
          padding: '16px 20px',
          borderBottom: `1px solid ${columnStyle.borderColor}`
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontSize: '20px' }}>{columnStyle.icon}</span>
          <div>
            <h3 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: columnStyle.headerColor,
              margin: '0 0 4px 0'
            }}>
              {getStatusLabel(status)}
            </h3>
            <span style={{
              fontSize: '12px',
              color: 'rgba(255,255,255,0.8)',
              fontWeight: '500'
            }}>
              {Array.isArray(taskList) ? taskList.length : 0} tareas
            </span>
          </div>
        </div>
      </div>
      
      <div
        style={{
          flex: 1,
          padding: '16px',
          backgroundColor: isOver ? '#f3f4f6' : 'transparent',
          borderRadius: '0 0 8px 8px',
          height: '100%',
          overflowY: 'auto',
          transition: 'all 0.2s ease',
          minHeight: '200px'
        }}
      >
        <div style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '12px',
          minHeight: '100%'
        }}>
          {children}
        </div>
      </div>
    </div>
  );
};

// Componente SortableTaskCard para @dnd-kit
const SortableTaskCard = ({ task, onEdit, onDelete, users }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: task.id,
    data: {
      type: 'task',
      task: task
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        users={users}
      />
    </div>
  );
};

import React, { useState, useEffect, useCallback } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
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
import { taskManagementService } from '../../../services/taskManagementService';
import { useNotifications } from '../../../hooks/useNotifications';
import TaskCard from './TaskCard';
import TaskForm from './TaskForm';
import TaskFilters from './TaskFilters';
import { 
  PlusIcon, 
  FunnelIcon, 
  Bars3Icon,
  XMarkIcon 
} from '@heroicons/react/24/outline';

const TaskManagement = ({ projectId, projectName, onClose, projects = [], onProjectSelect }) => {
  const { notify } = useNotifications();
  
  // Sensores para @dnd-kit
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Estados principales
  const [tasks, setTasks] = useState([]);
  const [tasksByStatus, setTasksByStatus] = useState({
    todo: [],
    in_progress: [],
    review: [],
    done: []
  });
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Estados de UI
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showProjectSelector, setShowProjectSelector] = useState(false);
  const [filters, setFilters] = useState({
    priority: 'all',
    assignee: 'all',
    search: ''
  });

  // Cargar datos iniciales
  useEffect(() => {
    if (projectId) {
      loadTasks();
      loadUsers();
    }
  }, [projectId]);

  // Si no hay projectId, mostrar selector de proyectos
  if (!projectId) {
    return (
      <div style={{ 
        height: '100vh', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif'
      }}>
        {/* Header simple */}
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '16px 24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#ffffff', margin: 0 }}>
                Gestión de Tareas
              </h1>
              <p style={{ color: 'rgba(255, 255, 255, 0.8)', margin: '4px 0 0 0' }}>Selecciona un proyecto para gestionar sus tareas</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setShowTaskForm(true)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ➕ Nueva Tarea
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Selector de proyectos */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px'
        }}>
          <div style={{ maxWidth: '600px', width: '100%' }}>
            {/* Ícono */}
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <span style={{ fontSize: '32px' }}>📋</span>
            </div>
            
            {/* Título */}
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '16px' 
            }}>
              Selecciona un Proyecto
            </h2>
            
            {/* Mensaje */}
            <p style={{ 
              fontSize: '18px', 
              color: 'rgba(255, 255, 255, 0.9)', 
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              Elige el proyecto para el cual quieres gestionar tareas
            </p>
            
            {/* Lista de proyectos */}
            <div style={{
              display: 'grid',
              gap: '12px',
              marginBottom: '32px'
            }}>
              {projects.length > 0 ? projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => onProjectSelect && onProjectSelect(project)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    border: '2px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '20px 24px',
                    textAlign: 'left',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backdropFilter: 'blur(10px)',
                    color: '#ffffff'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.3)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div>
                    <h3 style={{ 
                      fontSize: '16px', 
                      fontWeight: '600', 
                      color: '#ffffff', 
                      margin: '0 0 4px 0' 
                    }}>
                      {project.nombre || project.name}
                    </h3>
                    <p style={{ 
                      fontSize: '14px', 
                      color: 'rgba(255, 255, 255, 0.8)', 
                      margin: 0 
                    }}>
                      {project.descripcion || project.description || 'Sin descripción'}
                    </p>
                  </div>
                  <span style={{ fontSize: '20px', color: 'rgba(255, 255, 255, 0.8)' }}>→</span>
                </button>
              )) : (
                <div style={{
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  border: '2px dashed rgba(255, 255, 255, 0.3)',
                  borderRadius: '12px',
                  padding: '32px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  textAlign: 'center'
                }}>
                  <p style={{ margin: 0, fontSize: '16px' }}>No hay proyectos disponibles</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Cargar tareas
  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await taskManagementService.getTasksByProject(projectId);

      if (response.success) {
        setTasks(response.data);
      } else {
        notify.error({
          title: 'Error',
          description: 'No se pudieron cargar las tareas'
        });
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      notify.error({
        title: 'Error',
        description: 'No se pudieron cargar las tareas'
      });
    } finally {
      setLoading(false);
    }
  };

  // Cargar usuarios
  const loadUsers = async () => {
    try {
      const response = await taskManagementService.getAvailableUsers(projectId);
      
      if (response.success) {
        setUsers(response.data);

      }
    } catch (error) {
      console.error('❌ Error cargando usuarios:', error);
    }
  };

  // Manejar drag & drop con @dnd-kit
  const handleDragEnd = async (event) => {
    const { active, over } = event;

    if (!over) {

      return;
    }

    if (active.id === over.id) {

      return;
    }

    // Obtener información de la tarea activa
    const activeTask = tasks.find(task => task.id === active.id);
    if (!activeTask) {

      return;
    }

    // Determinar el nuevo estado basado en el destino
    // Si over.id es un status válido, usarlo directamente
    const validStatuses = ['todo', 'in_progress', 'review', 'done'];
    let newStatus = over.id;
    
    // Si over.id no es un status válido, buscar en qué columna está
    if (!validStatuses.includes(over.id)) {
      // Buscar en qué columna está el elemento de destino
      for (const [status, taskList] of Object.entries(tasksByStatus)) {
        if (Array.isArray(taskList) && taskList.some(task => task.id === over.id)) {
          newStatus = status;
          break;
        }
      }
    }

    const taskId = parseInt(active.id);

    // Solo proceder si el estado cambió
    if (activeTask.status === newStatus) {

      return;
    }

    try {
      // Actualizar en el backend
      const response = await taskManagementService.updateTask(taskId, { status: newStatus });

      // Actualizar estado local inmediatamente para feedback visual
      const newTasksByStatus = { ...tasksByStatus };
      
      // Remover de la columna origen
      const sourceTasks = Array.from(newTasksByStatus[activeTask.status] || []);
      const taskIndex = sourceTasks.findIndex(task => task.id === taskId);
      if (taskIndex !== -1) {
        const [movedTask] = sourceTasks.splice(taskIndex, 1);
        
        // Actualizar la tarea con el nuevo status
        const updatedTask = { ...movedTask, status: newStatus };
      
      // Agregar a la columna destino
        const destTasks = Array.from(newTasksByStatus[newStatus] || []);
        destTasks.push(updatedTask);
      
      // Actualizar estados
        newTasksByStatus[activeTask.status] = sourceTasks;
        newTasksByStatus[newStatus] = destTasks;

      setTasksByStatus(newTasksByStatus);
        
        // También actualizar el array de tareas principal para mantener sincronización
        const updatedTasks = tasks.map(task => 
          task.id === taskId ? updatedTask : task
        );
        setTasks(updatedTasks);

      notify.success({
        title: 'Tarea actualizada',
        description: `Tarea movida a ${getStatusLabel(newStatus)}`
      });
      }

    } catch (error) {
      console.error('❌ Error actualizando tarea:', error);
      
      // Revertir cambios locales si falla el backend
      await loadTasks();
      
      notify.error({
        title: 'Error',
        description: 'No se pudo actualizar la tarea'
      });
    }
  };

  // Crear nueva tarea
  const handleCreateTask = async (taskData) => {
    try {
      const response = await taskManagementService.createTask({
        ...taskData,
        project_id: projectId
      });

      if (response.success) {
        await loadTasks(); // Recargar tareas
        setShowTaskForm(false);
        notify.success({
          title: 'Tarea creada',
          description: 'La tarea se creó exitosamente'
        });
      }
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      notify.error({
        title: 'Error',
        description: 'No se pudo crear la tarea'
      });
    }
  };

  // Actualizar tarea
  const handleUpdateTask = async (taskId, updates) => {
    try {
      const response = await taskManagementService.updateTask(taskId, updates);

      if (response.success) {
        await loadTasks(); // Recargar tareas
        setEditingTask(null);
        notify.success({
          title: 'Tarea actualizada',
          description: 'La tarea se actualizó exitosamente'
        });
      }
    } catch (error) {
      console.error('❌ Error actualizando tarea:', error);
      notify.error({
        title: 'Error',
        description: 'No se pudo actualizar la tarea'
      });
    }
  };

  // Eliminar tarea
  const handleDeleteTask = async (taskId) => {
    try {
      const response = await taskManagementService.deleteTask(taskId);

      if (response.success) {
        await loadTasks(); // Recargar tareas
        notify.success({
          title: 'Tarea eliminada',
          description: 'La tarea se eliminó exitosamente'
        });
      }
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error);
      notify.error({
        title: 'Error',
        description: 'No se pudo eliminar la tarea'
      });
    }
  };

  // Obtener etiqueta del estado
  const getStatusLabel = (status) => {
    const labels = {
      todo: 'Por hacer',
      in_progress: 'En progreso',
      review: 'En revisión',
      done: 'Completado'
    };
    return labels[status] || status;
  };

  // Obtener color del estado
  const getStatusColor = (status) => {
    const colors = {
      todo: 'bg-gray-100 border-gray-300',
      in_progress: 'bg-blue-100 border-blue-300',
      review: 'bg-yellow-100 border-yellow-300',
      done: 'bg-green-100 border-green-300'
    };
    return colors[status] || 'bg-gray-100 border-gray-300';
  };

  // Filtrar tareas
  const getFilteredTasks = (taskList) => {

    // Asegurar que taskList sea un array
    if (!Array.isArray(taskList)) {

      return [];
    }
    
    // Asegurar que taskList no sea null o undefined
    if (taskList === null || taskList === undefined) {

      return [];
    }
    
    try {
      const filtered = taskList.filter(task => {
        // Asegurar que task sea un objeto válido
        if (!task || typeof task !== 'object') {

          return false;
        }
        
        const matchesPriority = filters.priority === 'all' || task.priority === filters.priority;
        const matchesAssignee = filters.assignee === 'all' || task.assigned_to === parseInt(filters.assignee);
        const matchesSearch = filters.search === '' || 
          (task.title && task.title.toLowerCase().includes(filters.search.toLowerCase())) ||
          (task.description && task.description.toLowerCase().includes(filters.search.toLowerCase()));

        return matchesPriority && matchesAssignee && matchesSearch;
      });

      return filtered;
    } catch (error) {
      console.error('❌ Error en getFilteredTasks:', error);
      return [];
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-600 mb-4">{error}</p>
        <button 
          onClick={loadTasks}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  // Verificar si no hay tareas
  const totalTasks = Object.values(tasksByStatus).reduce((total, taskList) => {
    return total + (Array.isArray(taskList) ? taskList.length : 0);
  }, 0);

  // Verificar si hay tareas en el array principal también
  const hasTasks = totalTasks > 0 || (Array.isArray(tasks) && tasks.length > 0);

  // Mostrar estado vacío solo cuando realmente no hay tareas y no está cargando
  if (!hasTasks && !loading && projectId) {

    return (
      <div style={{ 
        height: '100vh', 
        backgroundColor: '#f3f4f6', 
        display: 'flex', 
        flexDirection: 'column',
        fontFamily: 'system-ui, sans-serif'
      }}>
        {/* Header simple */}
        <div style={{ 
          backgroundColor: 'white', 
          borderBottom: '1px solid #e5e7eb', 
          padding: '16px 24px' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', color: '#111827', margin: 0 }}>
                Gestión de Tareas
              </h1>
              <p style={{ color: '#6b7280', margin: '4px 0 0 0' }}>{projectName}</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <button
                onClick={() => setShowTaskForm(true)}
                style={{
                  backgroundColor: '#2563eb',
                  color: 'white',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ➕ Nueva Tarea
              </button>
              <button
                onClick={onClose}
                style={{
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  color: '#6b7280',
                  cursor: 'pointer',
                  borderRadius: '4px'
                }}
              >
                ✕
              </button>
            </div>
          </div>
        </div>

        {/* Estado vacío */}
        <div style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '40px'
        }}>
          <div>
            {/* Ícono simple */}
            <div style={{
              width: '80px',
              height: '80px',
              backgroundColor: '#dbeafe',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px'
            }}>
              <span style={{ fontSize: '32px' }}>📋</span>
            </div>
            
            {/* Título */}
            <h2 style={{ 
              fontSize: '28px', 
              fontWeight: 'bold', 
              color: '#111827', 
              marginBottom: '16px' 
            }}>
              ¡Comienza tu proyecto!
            </h2>
            
            {/* Mensaje */}
            <p style={{ 
              fontSize: '18px', 
              color: '#6b7280', 
              marginBottom: '32px',
              lineHeight: '1.6'
            }}>
              No hay tareas creadas aún.<br />
              Organiza el trabajo creando tu primera tarea.
            </p>
            
            {/* Botón principal */}
            <button
              onClick={() => setShowTaskForm(true)}
              style={{
                backgroundColor: '#2563eb',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              ➕ Crear Primera Tarea
            </button>
          </div>
        </div>

        {/* Modal selector de proyectos */}
        {showProjectSelector && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}>
            <div style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '24px',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto'
            }}>
              {/* Header del modal */}
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '24px'
              }}>
                <div>
                  <h2 style={{ 
                    fontSize: '20px', 
                    fontWeight: 'bold', 
                    color: '#111827', 
                    margin: 0 
                  }}>
                    Seleccionar Proyecto
                  </h2>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#6b7280', 
                    margin: '4px 0 0 0' 
                  }}>
                    Elige el proyecto para crear la tarea
                  </p>
                </div>
                <button
                  onClick={() => setShowProjectSelector(false)}
                  style={{
                    padding: '8px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    color: '#6b7280',
                    cursor: 'pointer',
                    borderRadius: '4px'
                  }}
                >
                  ✕
                </button>
              </div>

              {/* Lista de proyectos */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {projects.length > 0 ? projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => {
                      onProjectSelect && onProjectSelect(project);
                      setShowProjectSelector(false);
                      setShowTaskForm(true);
                    }}
                    style={{
                      backgroundColor: 'white',
                      border: '2px solid #e5e7eb',
                      borderRadius: '8px',
                      padding: '16px 20px',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.borderColor = '#2563eb';
                      e.target.style.backgroundColor = '#f8fafc';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.borderColor = '#e5e7eb';
                      e.target.style.backgroundColor = 'white';
                    }}
                  >
                    <div>
                      <h3 style={{ 
                        fontSize: '16px', 
                        fontWeight: '600', 
                        color: '#111827', 
                        margin: '0 0 4px 0' 
                      }}>
                        {project.nombre || project.name}
                      </h3>
                      <p style={{ 
                        fontSize: '14px', 
                        color: '#6b7280', 
                        margin: 0 
                      }}>
                        {project.descripcion || project.description || 'Sin descripción'}
                      </p>
                    </div>
                    <span style={{ fontSize: '20px', color: '#6b7280' }}>→</span>
                  </button>
                )) : (
                  <div style={{
                    backgroundColor: 'white',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    padding: '32px',
                    color: '#6b7280',
                    textAlign: 'center'
                  }}>
                    <p style={{ margin: 0 }}>No hay proyectos disponibles</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* MODALES FLOTANTES - Renderizados fuera del contenedor principal */}
        {/* Modal del formulario de tareas */}
        {showTaskForm && (
          <TaskForm
            projectId={projectId}
            users={users}
            onSubmit={handleCreateTask}
            onClose={() => setShowTaskForm(false)}
          />
        )}

        {/* Modal del formulario de edición */}
        {editingTask && (
          <TaskForm
            projectId={projectId}
            users={users}
            task={editingTask}
            onSubmit={(updates) => handleUpdateTask(editingTask.id, updates)}
            onClose={() => setEditingTask(null)}
          />
        )}
      </div>
    );
  }

  return (
    <div 
      className="kanban-board"
      style={{
      height: '100vh',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f8fafc',
      overflow: 'hidden'
      }}
    >
      {/* CSS para animaciones */}
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.7; transform: scale(1.05); }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .kanban-column {
          animation: fadeIn 0.6s ease-out;
        }
        
        .task-card {
          animation: fadeIn 0.4s ease-out;
        }
        
        /* Prevenir selección de texto */
        .kanban-board * {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
        
        /* Prevenir outline en elementos interactivos */
        .kanban-board button:focus,
        .kanban-board div:focus {
          outline: none !important;
        }
        
        /* Mejorar el cursor para drag */
        .task-card {
          cursor: grab;
        }
        
        .task-card:active {
          cursor: grabbing;
        }
        
        /* Responsive design */
        @media (max-width: 1200px) {
          .kanban-grid {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 16px !important;
          }
        }
        
        @media (max-width: 768px) {
          .kanban-grid {
            grid-template-columns: 1fr !important;
            gap: 12px !important;
          }
          
          .kanban-stats {
            flex-direction: column !important;
            gap: 16px !important;
          }
          
          .kanban-stats > div {
            flex-direction: row !important;
            justify-content: space-around !important;
          }
        }
      `}</style>
      {/* Header Profesional */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        padding: '24px 32px',
        borderRadius: '0 0 16px 16px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        marginBottom: '24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: 'white',
              margin: '0 0 8px 0',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              📋 Gestión de Tareas
            </h2>
            <p style={{
              fontSize: '16px',
              color: 'rgba(255,255,255,0.9)',
              margin: '0',
              fontWeight: '500'
            }}>
              📁 {projectName}
            </p>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 20px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                backdropFilter: 'blur(10px)'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <FunnelIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
              🔍 Filtros
            </button>
            
            <button
              onClick={() => setShowTaskForm(true)}
              style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px 24px',
                background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 15px rgba(79, 172, 254, 0.4)'
              }}
              onMouseOver={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(79, 172, 254, 0.6)';
              }}
              onMouseOut={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 15px rgba(79, 172, 254, 0.4)';
              }}
            >
              <PlusIcon style={{ width: '18px', height: '18px', marginRight: '8px' }} />
              ✨ Nueva Tarea
            </button>
            
            <button
              onClick={onClose}
              style={{
                padding: '12px',
                backgroundColor: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.3)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255,255,255,0.2)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              <XMarkIcon style={{ width: '20px', height: '20px' }} />
            </button>
          </div>
        </div>
      </div>

      {/* Filtros */}
      {showFilters && (
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <TaskFilters
            filters={filters}
            onFiltersChange={setFilters}
            users={users}
          />
        </div>
      )}

      {/* Tablero Kanban Limpio */}
      <div style={{ 
        flex: 1, 
        overflow: 'hidden', 
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#f8fafc',
        borderRadius: '12px',
        marginTop: '16px'
      }}>
        {/* Estadísticas simples */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '24px',
          padding: '16px 20px',
          backgroundColor: 'white',
          borderRadius: '8px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#1f2937' }}>
                {totalTasks}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Total Tareas
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#3b82f6' }}>
                {tasksByStatus.in_progress?.length || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                En Progreso
              </div>
            </div>
            <div style={{ width: '1px', height: '32px', backgroundColor: '#e5e7eb' }} />
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '600', color: '#10b981' }}>
                {tasksByStatus.done?.length || 0}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>
                Completadas
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <div style={{
              padding: '8px 16px',
              backgroundColor: '#6366f1',
              borderRadius: '6px',
              color: 'white',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              Tablero Kanban
            </div>
          </div>
        </div>

        <DndContext 
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <div 
            className="kanban-grid"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '20px',
              height: '100%',
              minHeight: 'calc(100vh - 350px)',
              maxHeight: 'calc(100vh - 350px)',
              overflow: 'hidden',
              padding: '8px'
            }}
          >
            {Object.entries(tasksByStatus).map(([status, taskList]) => {

              const getColumnStyle = (status) => {
                const styles = {
                  todo: {
                    headerBg: '#6366f1',
                    headerColor: 'white',
                    bodyBg: '#ffffff',
                    icon: '📋',
                    borderColor: '#e5e7eb',
                    accentColor: '#6366f1'
                  },
                  in_progress: {
                    headerBg: '#3b82f6',
                    headerColor: 'white',
                    bodyBg: '#ffffff',
                    icon: '🚀',
                    borderColor: '#e5e7eb',
                    accentColor: '#3b82f6'
                  },
                  review: {
                    headerBg: '#f59e0b',
                    headerColor: 'white',
                    bodyBg: '#ffffff',
                    icon: '👀',
                    borderColor: '#e5e7eb',
                    accentColor: '#f59e0b'
                  },
                  done: {
                    headerBg: '#10b981',
                    headerColor: 'white',
                    bodyBg: '#ffffff',
                    icon: '✅',
                    borderColor: '#e5e7eb',
                    accentColor: '#10b981'
                  }
                };
                return styles[status] || styles.todo;
              };

              return (
                <DroppableZone
                  key={status}
                  id={status}
                  status={status}
                  taskList={taskList}
                  onEdit={setEditingTask}
                  onDelete={handleDeleteTask}
                  users={users}
                  getStatusLabel={getStatusLabel}
                  getColumnStyle={getColumnStyle}
                >
                  <SortableContext 
                    items={Array.isArray(taskList) ? taskList.map(task => task.id) : []} 
                    strategy={verticalListSortingStrategy}
                  >
                    {(Array.isArray(taskList) && taskList.length > 0) ? taskList.map((task, index) => {
                      return (
                        <SortableTaskCard
                          key={task.id}
                          task={task}
                          onEdit={setEditingTask}
                          onDelete={handleDeleteTask}
                          users={users}
                        />
                      );
                    }) : (
                      /* Estado vacío simple */
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        padding: '40px 20px',
                        color: '#9ca3af',
                        textAlign: 'center',
                        minHeight: '200px'
                      }}>
                        <div style={{
                          fontSize: '48px',
                          marginBottom: '16px',
                          opacity: 0.5
                        }}>
                          {getColumnStyle(status).icon}
                        </div>
                        <h4 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: '#6b7280',
                          margin: '0 0 8px 0'
                        }}>
                          No hay tareas
                        </h4>
                        <p style={{
                          fontSize: '14px',
                          color: '#9ca3af',
                          margin: '0',
                          lineHeight: '1.5'
                        }}>
                          Las tareas aparecerán aquí cuando se creen
                        </p>
                      </div>
                    )}
                  </SortableContext>
                </DroppableZone>
              );

              return (
                <div 
                  key={status} 
                  className="kanban-column"
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: '100%',
                    maxHeight: '100%',
                    backgroundColor: columnStyle.bodyBg,
                    borderRadius: '8px',
                    border: `1px solid ${columnStyle.borderColor}`,
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div 
                    style={{
                      backgroundColor: columnStyle.headerBg,
                      padding: '16px 20px',
                      borderBottom: `1px solid ${columnStyle.borderColor}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span style={{ fontSize: '20px' }}>{columnStyle.icon}</span>
                      <div>
                        <h3 style={{
                          fontSize: '16px',
                          fontWeight: '600',
                          color: columnStyle.headerColor,
                          margin: '0 0 4px 0'
                        }}>
                          {getStatusLabel(status)}
                        </h3>
                        <span style={{
                          fontSize: '12px',
                          color: 'rgba(255,255,255,0.8)',
                          fontWeight: '500'
                        }}>
                          {getFilteredTasks(taskList).length} tareas
                        </span>
                      </div>
                    </div>
                  </div>
                
                </div>
              );
            })}
          </div>
        </DndContext>
      </div>

      {/* MODALES FLOTANTES - Renderizados fuera del contenedor principal */}
      {/* Modal del formulario de tareas */}
      {showTaskForm && (
        <TaskForm
          projectId={projectId}
          users={users}
          onSubmit={handleCreateTask}
          onClose={() => setShowTaskForm(false)}
        />
      )}

      {/* Modal del formulario de edición */}
      {editingTask && (
        <TaskForm
          projectId={projectId}
          users={users}
          task={editingTask}
          onSubmit={(updates) => handleUpdateTask(editingTask.id, updates)}
          onClose={() => setEditingTask(null)}
        />
      )}
    </div>
  );
};

export default TaskManagement;
