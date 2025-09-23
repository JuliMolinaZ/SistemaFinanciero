// 🎯 TASK MANAGEMENT SERVICE - SERVICIO DE GESTIÓN DE TAREAS
// ==========================================================

// 🌐 API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';
const API_ENDPOINTS = {
  tasks: '/api/management-tasks',
  users: '/api/management-tasks'
};

// 🔧 HTTP Helper Functions
class ApiError extends Error {
  constructor(message, status, response) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.response = response;
  }
}

const createRequest = (method = 'GET', body = null) => {
  const config = {
    method,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  return config;
};

// 🎯 TASK MANAGEMENT SERVICE
export const taskManagementService = {
  // 📋 GET TASKS BY PROJECT
  async getTasksByProject(projectId) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.tasks}/project/${projectId}`;
      console.log('🔍 Fetching tasks from:', url);
      
      const response = await fetch(url, createRequest('GET'));

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
        throw new Error('Error de conexión con el servidor');
      }

      if (!response.ok) {
        console.error('❌ API Error:', response.status, data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Tasks fetched successfully:', data.data?.total || 0, 'tasks');
      return data;

    } catch (error) {
      console.error('❌ Error fetching tasks:', error);
      throw error;
    }
  },

  // 👥 GET ALL SIGMA USERS - Obtener todos los usuarios del sistema
  async getAllSigmaUsers() {
    try {
      const url = `${API_BASE_URL}/api/users`;
      console.log('👥 Fetching all Sigma users from:', url);

      const response = await fetch(url, createRequest('GET'));

      let data;
      try {
        data = await response.json();
      } catch (parseError) {
        console.error('❌ Error parsing JSON:', parseError);
        throw new Error('Error de conexión con el servidor');
      }

      if (!response.ok) {
        console.error('❌ API Error:', response.status, data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      // Procesar usuarios para el formato esperado
      const users = (data.data || data.users || data || []).map(user => ({
        id: user.id,
        name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim(),
        email: user.email,
        avatar: user.avatar || user.profile_picture,
        role: user.role || 'user',
        active: user.active !== false
      })).filter(user => user.active); // Solo usuarios activos

      console.log('✅ Sigma users fetched successfully:', users.length, 'users');
      return { data: users };

    } catch (error) {
      console.error('❌ Error fetching Sigma users:', error);
      // Fallback: devolver users mock
      console.log('🔄 Fallback: usando datos mock de usuarios');
      return {
        data: [
          { id: 1, name: 'Juan Pérez', email: 'juan@example.com', avatar: null, role: 'admin' },
          { id: 2, name: 'María García', email: 'maria@example.com', avatar: null, role: 'user' },
          { id: 3, name: 'Carlos López', email: 'carlos@example.com', avatar: null, role: 'user' },
          { id: 4, name: 'Ana Martín', email: 'ana@example.com', avatar: null, role: 'user' },
          { id: 5, name: 'Luis Rodríguez', email: 'luis@example.com', avatar: null, role: 'manager' },
          { id: 6, name: 'Carmen Fernández', email: 'carmen@example.com', avatar: null, role: 'user' }
        ]
      };
    }
  },

  // 👥 GET USERS BY PROJECT - Usar endpoint de proyectos para obtener miembros
  async getUsersByProject(projectId) {
    try {
      // Primero intentar obtener miembros específicos del proyecto
      const url = `${API_BASE_URL}/api/management-projects/${projectId}/members`;
      console.log('👥 Fetching project members from:', url);

      const response = await fetch(url, createRequest('GET'));

      if (response.ok) {
        const data = await response.json();
        // Procesar los miembros del proyecto para extraer usuarios
        const members = data.data || [];
        const users = members.map(member => ({
          id: member.user?.id || member.id,
          name: member.user?.name || member.name,
          email: member.user?.email || member.email,
          avatar: member.user?.avatar || member.avatar,
          role: member.team_type || 'member'
        }));

        console.log('✅ Project members fetched successfully:', users.length, 'users');
        return { data: users };
      }

      // Si no hay miembros específicos, usar todos los usuarios de Sigma
      console.log('⚠️ No project members found, using all Sigma users');
      return await this.getAllSigmaUsers();

    } catch (error) {
      console.error('❌ Error fetching project users, falling back to all Sigma users:', error);
      // Fallback: obtener todos los usuarios de Sigma
      return await this.getAllSigmaUsers();
    }
  },

  // ✨ CREATE TASK
  async createTask(taskData) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.tasks}`;
      console.log('📝 Creating task:', taskData);
      
      const response = await fetch(url, createRequest('POST', taskData));
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Create error:', response.status, data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Task created successfully:', data.data?.id);
      return data;

    } catch (error) {
      console.error('❌ Error creating task:', error);
      throw error;
    }
  },

  // ✏️ UPDATE TASK
  async updateTask(taskId, updates) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.tasks}/${taskId}`;
      console.log('✏️ Updating task:', taskId, updates);
      
      const response = await fetch(url, createRequest('PUT', updates));
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Update error:', response.status, data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Task updated successfully:', data.data?.id);
      return data;

    } catch (error) {
      console.error('❌ Error updating task:', error);
      throw error;
    }
  },

  // 🗑️ DELETE TASK
  async deleteTask(taskId) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.tasks}/${taskId}`;
      console.log('🗑️ Deleting task:', taskId);
      
      const response = await fetch(url, createRequest('DELETE'));
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Delete error:', response.status, data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Task deleted successfully:', taskId);
      return data;

    } catch (error) {
      console.error('❌ Error deleting task:', error);
      throw error;
    }
  },

  // 👤 GET CURRENT USER
  async getCurrentUser() {
    try {
      const url = `${API_BASE_URL}/api/auth/me`;
      console.log('👤 Fetching current user from:', url);

      const response = await fetch(url, createRequest('GET'));

      if (!response.ok) {
        console.error('❌ Current user error:', response.status);
        return null;
      }

      const data = await response.json();
      const user = data.data || data.user || data;

      if (user) {
        const processedUser = {
          id: user.id,
          name: user.name ||
                `${user.first_name || ''} ${user.last_name || ''}`.trim() ||
                user.username ||
                user.email?.split('@')[0] ||
                'Usuario',
          email: user.email,
          avatar: user.avatar || user.profile_picture,
          username: user.username,
          first_name: user.first_name,
          last_name: user.last_name
        };

        console.log('✅ Current user fetched:', processedUser.name);
        return processedUser;
      }

      return null;

    } catch (error) {
      console.error('❌ Error fetching current user:', error);
      return null;
    }
  },

  // 👥 GET AVAILABLE USERS
  async getAvailableUsers(projectId) {
    try {
      const url = `${API_BASE_URL}${API_ENDPOINTS.users}/project/${projectId}/users`;
      console.log('👥 Fetching available users for project:', projectId);

      const response = await fetch(url, createRequest('GET'));
      const data = await response.json();

      if (!response.ok) {
        console.error('❌ Users error:', response.status, data);
        throw new Error(data.message || `Error ${response.status}: ${response.statusText}`);
      }

      console.log('✅ Users fetched successfully:', data.data?.length || 0, 'users');
      return data;

    } catch (error) {
      console.error('❌ Error fetching users:', error);
      throw error;
    }
  }
};

export default taskManagementService;
