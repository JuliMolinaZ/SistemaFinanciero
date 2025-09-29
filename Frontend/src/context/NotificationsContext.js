// =====================================================
// CONTEXTO DE NOTIFICACIONES DEL SISTEMA
// =====================================================

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { auth } from '../firebase';

// =====================================================
// TIPOS DE ACCIONES
// =====================================================

const NOTIFICATION_ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_NOTIFICATIONS: 'SET_NOTIFICATIONS',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_AS_READ: 'MARK_AS_READ',
  MARK_ALL_AS_READ: 'MARK_ALL_AS_READ',
  DELETE_NOTIFICATION: 'DELETE_NOTIFICATION',
  DELETE_ALL_NOTIFICATIONS: 'DELETE_ALL_NOTIFICATIONS',
  SET_UNREAD_COUNT: 'SET_UNREAD_COUNT',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS'
};

// =====================================================
// ESTADO INICIAL
// =====================================================

const initialState = {
  notifications: [],
  unreadCount: 0,
  loading: false,
  error: null,
  pagination: {
    page: 1,
    limit: 20,
    total: 0,
    pages: 0
  },
  filters: {
    unread_only: false,
    type: null,
    category: null
  },
  lastFetch: null
};

// =====================================================
// REDUCER
// =====================================================

const notificationsReducer = (state, action) => {
  switch (action.type) {
    case NOTIFICATION_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload,
        error: null
      };

    case NOTIFICATION_ACTIONS.SET_NOTIFICATIONS:
      return {
        ...state,
        notifications: action.payload.notifications || [],
        unreadCount: action.payload.unreadCount || 0,
        pagination: action.payload.pagination || state.pagination,
        lastFetch: new Date(),
        loading: false,
        error: null
      };

    case NOTIFICATION_ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [action.payload, ...state.notifications],
        unreadCount: state.unreadCount + 1
      };

    case NOTIFICATION_ACTIONS.MARK_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification =>
          notification.id === action.payload
            ? { ...notification, is_read: true, read_at: new Date().toISOString() }
            : notification
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.MARK_ALL_AS_READ:
      return {
        ...state,
        notifications: state.notifications.map(notification => ({
          ...notification,
          is_read: true,
          read_at: new Date().toISOString()
        })),
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.DELETE_NOTIFICATION:
      return {
        ...state,
        notifications: state.notifications.filter(
          notification => notification.id !== action.payload
        ),
        unreadCount: Math.max(0, state.unreadCount - 1)
      };

    case NOTIFICATION_ACTIONS.DELETE_ALL_NOTIFICATIONS:
      return {
        ...state,
        notifications: [],
        unreadCount: 0
      };

    case NOTIFICATION_ACTIONS.SET_UNREAD_COUNT:
      return {
        ...state,
        unreadCount: action.payload
      };

    case NOTIFICATION_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    case NOTIFICATION_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null
      };

    case NOTIFICATION_ACTIONS.SET_PAGINATION:
      return {
        ...state,
        pagination: { ...state.pagination, ...action.payload }
      };

    case NOTIFICATION_ACTIONS.SET_FILTERS:
      return {
        ...state,
        filters: { ...state.filters, ...action.payload }
      };

    default:
      return state;
  }
};

// =====================================================
// CONTEXTO
// =====================================================

const NotificationsContext = createContext();

// =====================================================
// HOOK PERSONALIZADO
// =====================================================

export const useNotifications = () => {
  const context = useContext(NotificationsContext);
  if (!context) {
    throw new Error('useNotifications debe ser usado dentro de NotificationsProvider');
  }
  return context;
};

// =====================================================
// PROVIDER
// =====================================================

export const NotificationsProvider = ({ children }) => {
  const [state, dispatch] = useReducer(notificationsReducer, initialState);

  // =====================================================
  // FUNCIONES DE API
  // =====================================================

  const API_BASE_URL = (process.env.REACT_APP_API_URL || 'http://localhost:8765') + '/api';

  // Función para obtener el usuario actual
  const getCurrentUser = async () => {
    // Esperar a que Firebase se inicialice
    return new Promise((resolve, reject) => {
      const unsubscribe = auth.onAuthStateChanged(async (user) => {
        unsubscribe();
        if (!user) {
          reject(new Error('Usuario no autenticado'));
          return;
        }
        
        try {
          const token = await user.getIdToken();
          
          // Obtener el ID numérico del usuario desde la base de datos
          const response = await fetch(`${API_BASE_URL}/usuarios/firebase/${user.uid}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!response.ok) {
            throw new Error('Error al obtener información del usuario');
          }

          const userData = await response.json();
          resolve({ 
            id: userData.data.id, 
            email: user.email,
            firebase_uid: user.uid 
          });
        } catch (error) {
          console.error('Error al obtener usuario:', error);
          // Fallback: usar el UID de Firebase como string
          resolve({ 
            id: user.uid, 
            email: user.email,
            firebase_uid: user.uid 
          });
        }
      });
    });
  };

  // Función para hacer peticiones HTTP
  const apiRequest = async (url, options = {}) => {
    const user = auth.currentUser;
    if (!user) {
      throw new Error('Usuario no autenticado');
    }

    const token = await user.getIdToken();
    
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
      }
    };

    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...defaultOptions,
      ...options
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }

    return response.json();
  };

  // =====================================================
  // ACCIONES
  // =====================================================

  // Obtener notificaciones
  const fetchNotifications = async (options = {}) => {
    try {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_LOADING, payload: true });
      
      const user = await getCurrentUser();
      const { page = 1, limit = 20, unread_only = false } = options;
      
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        unread_only: unread_only.toString()
      });

      const response = await apiRequest(`/notifications/user/${user.id}?${params}`);

      dispatch({
        type: NOTIFICATION_ACTIONS.SET_NOTIFICATIONS,
        payload: response.data
      });

      return response.data;
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Marcar como leída
  const markAsRead = async (notificationId) => {
    try {
      const user = await getCurrentUser();
      
      await apiRequest(`/notifications/${notificationId}/read`, {
        method: 'PUT',
        body: JSON.stringify({ userId: user.id })
      });

      dispatch({
        type: NOTIFICATION_ACTIONS.MARK_AS_READ,
        payload: notificationId
      });
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Marcar todas como leídas
  const markAllAsRead = async () => {
    try {
      const user = await getCurrentUser();
      
      await apiRequest(`/notifications/user/${user.id}/read-all`, {
        method: 'PUT',
        body: JSON.stringify({ userId: user.id })
      });

      dispatch({ type: NOTIFICATION_ACTIONS.MARK_ALL_AS_READ });
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Eliminar notificación
  const deleteNotification = async (notificationId) => {
    try {
      const user = await getCurrentUser();
      
      await apiRequest(`/notifications/${notificationId}`, {
        method: 'DELETE',
        body: JSON.stringify({ userId: user.id })
      });

      dispatch({
        type: NOTIFICATION_ACTIONS.DELETE_NOTIFICATION,
        payload: notificationId
      });
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Eliminar todas las notificaciones
  const deleteAllNotifications = async () => {
    try {
      const user = await getCurrentUser();
      
      await apiRequest(`/notifications/user/${user.id}/delete-all`, {
        method: 'DELETE',
        body: JSON.stringify({ userId: user.id })
      });

      dispatch({
        type: NOTIFICATION_ACTIONS.DELETE_ALL_NOTIFICATIONS
      });
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Obtener estadísticas
  const getStats = async () => {
    try {
      const user = await getCurrentUser();
      const response = await apiRequest(`/notifications/user/${user.id}/stats`);
      return response.data;
    } catch (error) {
      dispatch({ type: NOTIFICATION_ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Limpiar error
  const clearError = () => {
    dispatch({ type: NOTIFICATION_ACTIONS.CLEAR_ERROR });
  };

  // Establecer filtros
  const setFilters = (filters) => {
    dispatch({ type: NOTIFICATION_ACTIONS.SET_FILTERS, payload: filters });
  };

  // Establecer paginación
  const setPagination = (pagination) => {
    dispatch({ type: NOTIFICATION_ACTIONS.SET_PAGINATION, payload: pagination });
  };

  // =====================================================
  // EFECTOS
  // =====================================================

  // Cargar notificaciones al montar el componente
  useEffect(() => {
    const loadNotifications = async () => {
      try {
        await fetchNotifications();
      } catch (error) {
        console.error('Error al cargar notificaciones:', error);
      }
    };

    loadNotifications();
  }, []);

  // Configurar polling para actualizar notificaciones
  useEffect(() => {
    let isMounted = true;
    
    const interval = setInterval(async () => {
      if (!isMounted) return;
      
      try {
        // Solo actualizar si hay notificaciones no leídas o si no hay notificaciones cargadas
        if (state.unreadCount > 0 || state.notifications.length === 0) {

          await fetchNotifications({ unread_only: false }); // Obtener todas las notificaciones
        }
      } catch (error) {
        console.error('Error al actualizar notificaciones:', error);
      }
    }, 15000); // Actualizar cada 15 segundos con polling

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [state.unreadCount, state.notifications.length]);

  // =====================================================
  // VALOR DEL CONTEXTO
  // =====================================================

  const value = {
    // Estado
    ...state,
    
    // Acciones
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteAllNotifications,
    getStats,
    clearError,
    setFilters,
    setPagination,
    
    // Utilidades
    hasUnreadNotifications: state.unreadCount > 0,
    isLoading: state.loading,
    hasError: !!state.error
  };

  return (
    <NotificationsContext.Provider value={value}>
      {children}
    </NotificationsContext.Provider>
  );
};

export default NotificationsContext;
