// 🚀 SERVICIO DE TAREAS DE GESTIÓN - ULTRA MODERNO
// ==================================================

const API_BASE_URL = process.env.REACT_APP_API_URL
  ? `${process.env.REACT_APP_API_URL}/api`
  : 'http://localhost:8765/api';

// 🔧 Utilidad para manejar respuestas de la API
const handleApiResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ message: 'Error desconocido' }));
    throw new Error(errorData.message || `Error ${response.status}`);
  }
  return response.json();
};

// 🔧 Utilidad para hacer peticiones con configuración estándar
const makeRequest = (url, options = {}) => {
  return fetch(`${API_BASE_URL}${url}`, {
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
};

class ManagementTaskService {
  // 📋 OPERACIONES CRUD BÁSICAS

  /**
   * Obtener todas las tareas de un proyecto
   */
  async getTasksByProject(projectId, filters = {}) {

    const queryParams = new URLSearchParams();

    // Agregar filtros si existen
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.priority) queryParams.append('priority', filters.priority);
    if (filters.assigned_to) queryParams.append('assigned_to', filters.assigned_to);
    if (filters.sprint_id) queryParams.append('sprint_id', filters.sprint_id);
    if (filters.search) queryParams.append('search', filters.search);

    const queryString = queryParams.toString();
    const url = `/management-projects/${projectId}/tasks${queryString ? `?${queryString}` : ''}`;

    try {
      const response = await makeRequest(url);
      const data = await handleApiResponse(response);

      return data.data;
    } catch (error) {
      console.error('❌ Error obteniendo tareas:', error);
      throw error;
    }
  }

  /**
   * Obtener una tarea específica
   */
  async getTaskById(taskId) {

    try {
      const response = await makeRequest(`/management-tasks/${taskId}`);
      const data = await handleApiResponse(response);

      return data.data;
    } catch (error) {
      console.error('❌ Error obteniendo tarea:', error);
      throw error;
    }
  }

  /**
   * Crear nueva tarea
   */
  async createTask(taskData) {

    try {
      const response = await makeRequest('/management-tasks', {
        method: 'POST',
        body: JSON.stringify(taskData)
      });

      const data = await handleApiResponse(response);

      return data.data;
    } catch (error) {
      console.error('❌ Error creando tarea:', error);
      throw error;
    }
  }

  /**
   * Actualizar tarea completa
   */
  async updateTask(taskId, updates) {

    try {
      const response = await makeRequest(`/management-tasks/${taskId}`, {
        method: 'PUT',
        body: JSON.stringify(updates)
      });

      const data = await handleApiResponse(response);

      return data.data;
    } catch (error) {
      console.error('❌ Error actualizando tarea:', error);
      throw error;
    }
  }

  /**
   * Actualizar solo el estado de una tarea (para drag & drop)
   */
  async updateTaskStatus(taskId, status, position = null) {

    try {
      const response = await makeRequest(`/management-tasks/${taskId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status, position })
      });

      const data = await handleApiResponse(response);

      return data.data;
    } catch (error) {
      console.error('❌ Error actualizando estado:', error);
      throw error;
    }
  }

  /**
   * Eliminar tarea
   */
  async deleteTask(taskId) {

    try {
      const response = await makeRequest(`/management-tasks/${taskId}`, {
        method: 'DELETE'
      });

      const data = await handleApiResponse(response);

      return data;
    } catch (error) {
      console.error('❌ Error eliminando tarea:', error);
      throw error;
    }
  }

  // 📊 OPERACIONES DE ESTADÍSTICAS Y ANÁLISIS

  /**
   * Obtener estadísticas de tareas del proyecto
   */
  async getProjectTaskStats(projectId) {

    try {
      const response = await makeRequest(`/management-projects/${projectId}/tasks/stats`);
      const data = await handleApiResponse(response);

      return data.data;
    } catch (error) {
      console.error('❌ Error obteniendo estadísticas:', error);
      throw error;
    }
  }

  // 🎯 OPERACIONES ÚTILES PARA EL FRONTEND

  /**
   * Mover tarea entre columnas (drag & drop)
   */
  async moveTask(taskId, fromStatus, toStatus, position = null) {

    try {
      // Usar updateTaskStatus para el movimiento
      const updatedTask = await this.updateTaskStatus(taskId, toStatus, position);

      return {
        success: true,
        task: updatedTask,
        message: `Tarea movida a ${toStatus}`
      };
    } catch (error) {
      console.error('❌ Error moviendo tarea:', error);
      throw error;
    }
  }

  /**
   * Obtener tareas organizadas para el board Kanban
   */
  async getTaskBoard(projectId, filters = {}) {

    try {
      const result = await this.getTasksByProject(projectId, filters);

      // El backend ya retorna el board organizado
      return {
        tasks: result.tasks || [],
        board: result.board || {
          todo: [],
          in_progress: [],
          done: [],
          blocked: []
        },
        stats: result.stats || {
          total: 0,
          todo: 0,
          in_progress: 0,
          done: 0,
          blocked: 0
        }
      };
    } catch (error) {
      console.error('❌ Error obteniendo board:', error);
      throw error;
    }
  }

  /**
   * Buscar tareas con filtros avanzados
   */
  async searchTasks(projectId, searchConfig = {}) {
    const {
      search = '',
      status = '',
      priority = '',
      assigned_to = '',
      sprint_id = '',
      due_date_from = '',
      due_date_to = ''
    } = searchConfig;

    try {
      const filters = {};
      if (search) filters.search = search;
      if (status) filters.status = status;
      if (priority) filters.priority = priority;
      if (assigned_to) filters.assigned_to = assigned_to;
      if (sprint_id) filters.sprint_id = sprint_id;

      const result = await this.getTasksByProject(projectId, filters);

      // Filtrar por fechas en el frontend si es necesario
      let filteredTasks = result.tasks || [];

      if (due_date_from || due_date_to) {
        filteredTasks = filteredTasks.filter(task => {
          if (!task.due_date) return false;

          const taskDate = new Date(task.due_date);
          const fromDate = due_date_from ? new Date(due_date_from) : null;
          const toDate = due_date_to ? new Date(due_date_to) : null;

          if (fromDate && taskDate < fromDate) return false;
          if (toDate && taskDate > toDate) return false;

          return true;
        });
      }

      return {
        tasks: filteredTasks,
        total: filteredTasks.length
      };
    } catch (error) {
      console.error('❌ Error en búsqueda avanzada:', error);
      throw error;
    }
  }

  // 🎨 UTILIDADES PARA UI

  /**
   * Obtener opciones de estado para select/dropdown
   */
  getStatusOptions() {
    return [
      { value: 'todo', label: 'Por Hacer', color: '#6B7280', icon: '📋' },
      { value: 'in_progress', label: 'En Progreso', color: '#3B82F6', icon: '⚡' },
      { value: 'done', label: 'Completado', color: '#10B981', icon: '✅' },
      { value: 'blocked', label: 'Bloqueado', color: '#EF4444', icon: '🚫' }
    ];
  }

  /**
   * Obtener opciones de prioridad para select/dropdown
   */
  getPriorityOptions() {
    return [
      { value: 'low', label: 'Baja', color: '#10B981', icon: '🟢' },
      { value: 'medium', label: 'Media', color: '#F59E0B', icon: '🟡' },
      { value: 'high', label: 'Alta', color: '#EF4444', icon: '🔴' },
      { value: 'urgent', label: 'Urgente', color: '#7C2D12', icon: '🔥' }
    ];
  }

  /**
   * Formatear fecha para mostrar en UI
   */
  formatDate(date) {
    if (!date) return null;

    const d = new Date(date);
    return d.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }

  /**
   * Calcular días restantes hasta fecha límite
   */
  getDaysUntilDue(dueDate) {
    if (!dueDate) return null;

    const today = new Date();
    const due = new Date(dueDate);
    const diffTime = due - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return {
      days: diffDays,
      isOverdue: diffDays < 0,
      isDueSoon: diffDays >= 0 && diffDays <= 3,
      status: diffDays < 0 ? 'overdue' : diffDays <= 3 ? 'due-soon' : 'normal'
    };
  }
}

// Crear instancia única del servicio
const managementTaskService = new ManagementTaskService();

export { managementTaskService };
export default managementTaskService;