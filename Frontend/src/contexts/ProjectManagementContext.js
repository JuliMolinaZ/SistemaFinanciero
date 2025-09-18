// 🚀 CONTEXT DE GESTIÓN AVANZADA DE ESTADOS - PROJECT MANAGEMENT
import React, { createContext, useContext, useReducer, useCallback, useEffect } from 'react';

// Estado inicial del context
const initialState = {
  // Estados de datos
  projects: [],
  currentProject: null,
  tasks: [],
  sprints: [],
  methodologies: [],
  roles: [],
  analytics: null,

  // Estados de UI
  loading: {
    projects: false,
    currentProject: false,
    tasks: false,
    sprints: false,
    creating: false,
    updating: false,
    deleting: false,
    analytics: false
  },

  // Estados de errores
  errors: {
    projects: null,
    currentProject: null,
    tasks: null,
    sprints: null,
    validation: null,
    network: null
  },

  // Estados de paginación y filtros
  pagination: {
    projects: {
      page: 1,
      limit: 10,
      total: 0,
      totalPages: 0,
      hasNextPage: false,
      hasPrevPage: false
    },
    tasks: {
      page: 1,
      limit: 20,
      total: 0
    }
  },

  // Filtros activos
  filters: {
    projects: {
      status: '',
      priority: '',
      search: '',
      client_id: '',
      manager_id: ''
    },
    tasks: {
      status: '',
      priority: '',
      assignee_id: '',
      sprint_id: ''
    }
  },

  // Estados de vista
  view: {
    currentView: 'dashboard', // dashboard, projects, tasks, sprints, analytics
    sidebarOpen: true,
    modalOpen: false,
    modalType: null, // create, edit, delete, view
    selectedItems: [],
    sortBy: 'created_at',
    sortOrder: 'desc'
  },

  // Cache para optimizar performance
  cache: {
    lastFetch: {},
    expiryTime: 5 * 60 * 1000 // 5 minutos
  }
};

// Tipos de acciones
const ActionTypes = {
  // Acciones de datos
  SET_PROJECTS: 'SET_PROJECTS',
  SET_CURRENT_PROJECT: 'SET_CURRENT_PROJECT',
  SET_TASKS: 'SET_TASKS',
  SET_SPRINTS: 'SET_SPRINTS',
  SET_METHODOLOGIES: 'SET_METHODOLOGIES',
  SET_ROLES: 'SET_ROLES',
  SET_ANALYTICS: 'SET_ANALYTICS',

  // Acciones de CRUD
  ADD_PROJECT: 'ADD_PROJECT',
  UPDATE_PROJECT: 'UPDATE_PROJECT',
  DELETE_PROJECT: 'DELETE_PROJECT',
  ADD_TASK: 'ADD_TASK',
  UPDATE_TASK: 'UPDATE_TASK',
  DELETE_TASK: 'DELETE_TASK',

  // Acciones de loading
  SET_LOADING: 'SET_LOADING',
  CLEAR_LOADING: 'CLEAR_LOADING',

  // Acciones de errores
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  CLEAR_ALL_ERRORS: 'CLEAR_ALL_ERRORS',

  // Acciones de paginación y filtros
  SET_PAGINATION: 'SET_PAGINATION',
  SET_FILTERS: 'SET_FILTERS',
  RESET_FILTERS: 'RESET_FILTERS',

  // Acciones de vista
  SET_VIEW: 'SET_VIEW',
  TOGGLE_SIDEBAR: 'TOGGLE_SIDEBAR',
  SET_MODAL: 'SET_MODAL',
  SET_SELECTED_ITEMS: 'SET_SELECTED_ITEMS',
  SET_SORT: 'SET_SORT',

  // Acciones de cache
  UPDATE_CACHE: 'UPDATE_CACHE',
  CLEAR_CACHE: 'CLEAR_CACHE',

  // Acciones de reset
  RESET_STATE: 'RESET_STATE'
};

// Reducer para manejar los cambios de estado
const projectManagementReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_PROJECTS:
      return {
        ...state,
        projects: action.payload.data || [],
        pagination: {
          ...state.pagination,
          projects: {
            ...state.pagination.projects,
            ...action.payload.pagination
          }
        }
      };

    case ActionTypes.SET_CURRENT_PROJECT:
      return {
        ...state,
        currentProject: action.payload
      };

    case ActionTypes.SET_TASKS:
      return {
        ...state,
        tasks: action.payload.data || [],
        pagination: {
          ...state.pagination,
          tasks: {
            ...state.pagination.tasks,
            ...action.payload.pagination
          }
        }
      };

    case ActionTypes.SET_SPRINTS:
      return {
        ...state,
        sprints: action.payload || []
      };

    case ActionTypes.SET_METHODOLOGIES:
      return {
        ...state,
        methodologies: action.payload || []
      };

    case ActionTypes.SET_ROLES:
      return {
        ...state,
        roles: action.payload || []
      };

    case ActionTypes.SET_ANALYTICS:
      return {
        ...state,
        analytics: action.payload
      };

    case ActionTypes.ADD_PROJECT:
      return {
        ...state,
        projects: [action.payload, ...state.projects]
      };

    case ActionTypes.UPDATE_PROJECT:
      return {
        ...state,
        projects: state.projects.map(project =>
          project.id === action.payload.id ? action.payload : project
        ),
        currentProject: state.currentProject?.id === action.payload.id
          ? action.payload
          : state.currentProject
      };

    case ActionTypes.DELETE_PROJECT:
      return {
        ...state,
        projects: state.projects.filter(project => project.id !== action.payload),
        currentProject: state.currentProject?.id === action.payload
          ? null
          : state.currentProject
      };

    case ActionTypes.ADD_TASK:
      return {
        ...state,
        tasks: [action.payload, ...state.tasks]
      };

    case ActionTypes.UPDATE_TASK:
      return {
        ...state,
        tasks: state.tasks.map(task =>
          task.id === action.payload.id ? action.payload : task
        )
      };

    case ActionTypes.DELETE_TASK:
      return {
        ...state,
        tasks: state.tasks.filter(task => task.id !== action.payload)
      };

    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload.key]: action.payload.value
        }
      };

    case ActionTypes.CLEAR_LOADING:
      return {
        ...state,
        loading: {
          ...state.loading,
          [action.payload]: false
        }
      };

    case ActionTypes.SET_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload.key]: action.payload.error
        }
      };

    case ActionTypes.CLEAR_ERROR:
      return {
        ...state,
        errors: {
          ...state.errors,
          [action.payload]: null
        }
      };

    case ActionTypes.CLEAR_ALL_ERRORS:
      return {
        ...state,
        errors: Object.keys(state.errors).reduce((acc, key) => {
          acc[key] = null;
          return acc;
        }, {})
      };

    case ActionTypes.SET_PAGINATION:
      return {
        ...state,
        pagination: {
          ...state.pagination,
          [action.payload.key]: {
            ...state.pagination[action.payload.key],
            ...action.payload.data
          }
        }
      };

    case ActionTypes.SET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload.key]: {
            ...state.filters[action.payload.key],
            ...action.payload.filters
          }
        }
      };

    case ActionTypes.RESET_FILTERS:
      return {
        ...state,
        filters: {
          ...state.filters,
          [action.payload]: initialState.filters[action.payload]
        }
      };

    case ActionTypes.SET_VIEW:
      return {
        ...state,
        view: {
          ...state.view,
          ...action.payload
        }
      };

    case ActionTypes.TOGGLE_SIDEBAR:
      return {
        ...state,
        view: {
          ...state.view,
          sidebarOpen: !state.view.sidebarOpen
        }
      };

    case ActionTypes.SET_MODAL:
      return {
        ...state,
        view: {
          ...state.view,
          modalOpen: action.payload.open,
          modalType: action.payload.type || null
        }
      };

    case ActionTypes.SET_SELECTED_ITEMS:
      return {
        ...state,
        view: {
          ...state.view,
          selectedItems: action.payload
        }
      };

    case ActionTypes.SET_SORT:
      return {
        ...state,
        view: {
          ...state.view,
          sortBy: action.payload.sortBy || state.view.sortBy,
          sortOrder: action.payload.sortOrder || state.view.sortOrder
        }
      };

    case ActionTypes.UPDATE_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          lastFetch: {
            ...state.cache.lastFetch,
            [action.payload.key]: Date.now()
          }
        }
      };

    case ActionTypes.CLEAR_CACHE:
      return {
        ...state,
        cache: {
          ...state.cache,
          lastFetch: {}
        }
      };

    case ActionTypes.RESET_STATE:
      return initialState;

    default:
      return state;
  }
};

// Crear el contexto
const ProjectManagementContext = createContext();

// Custom hook para usar el contexto
export const useProjectManagement = () => {
  const context = useContext(ProjectManagementContext);
  if (!context) {
    throw new Error('useProjectManagement debe ser usado dentro de ProjectManagementProvider');
  }
  return context;
};