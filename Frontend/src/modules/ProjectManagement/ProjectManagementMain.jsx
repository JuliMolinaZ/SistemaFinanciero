// 🚀 MÓDULO DE GESTIÓN DE PROYECTOS - REFACTORIZADO CON DISEÑO UNIFICADO
// =====================================================================

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { GlobalContext } from '../../context/GlobalState';
import {
  Box,
  Container,
  Typography,
  Grid,
  Tabs,
  Tab,
  Badge,
  Tooltip,
  Stack,
  useTheme,
  alpha,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import './ProjectManagementUnified.css';
import {
  Dashboard as DashboardIcon,
  Assignment as AssignmentIcon,
  Group as GroupIcon,
  Schedule as ScheduleIcon,
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon,
  Timeline as TimelineIcon,
  Speed as SpeedIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// 📋 DRAWER COMPONENT
// import ProjectDrawer from '../../components/ui/ProjectDrawer';
import ProjectDrawerSimple from '../../components/ui/ProjectDrawerSimple';

// 🔔 Importar sistema de notificaciones
import { useNotify, notifyResult, notifyOperations } from '../../hooks/useNotify.js';
import { NotificationProvider } from '../../components/ui/NotificationSystem';
import { ModernToastProvider } from '../../components/ui/ModernToast';

// 🔐 Importar sistema de permisos
import { usePermissions } from '../../hooks/usePermissions';

// 🎨 Importar sistema de diseño optimizado
import {
  UnifiedContainer,
  UnifiedCard,
  UnifiedButton,
  UnifiedAlert,
  UnifiedSkeleton
} from '../../components/DesignSystem/BaseComponents';
import { UnifiedSearchInput, UnifiedSelect } from '../../components/DesignSystem/FormComponents';
import UnifiedErrorBoundary, { useErrorHandler } from '../../components/DesignSystem/ErrorBoundary';
import { designTheme, styleUtils } from '../../components/DesignSystem/theme';

// 📊 Importar componentes refactorizados
import ProjectDashboard from './components/ProjectDashboard';
import ProjectList from './components/ProjectList';
import TaskBoard from './components/TaskBoard';
import TaskManagementUnified from './components/TaskManagementUnified';
import SprintManagement from './components/SprintManagement';
import ProjectMetrics from './components/ProjectMetrics';

// 🧭 Importar navegación accesible
import { NavTabs } from '../../components/navigation/NavTabs.tsx';
import ContextualFab from '../../components/ui/ContextualFab';
import CreateProjectForm from '../../components/forms/CreateProjectForm';
import ProjectFormDialog from '../../components/modals/ProjectFormDialog';
import BrutalFAB from '../../components/ui/BrutalFAB';
import BrutalCreateButton from '../../components/ui/BrutalCreateButton';
import UltraBrutalButton from '../../components/ui/UltraBrutalButton';
import ContextualBrutalButton from '../../components/ui/ContextualBrutalButton';
import SimpleModal from '../../components/ui/SimpleModal';

// 🎯 HOOK PERSONALIZADO PARA GESTIÓN DE ESTADOS
const useProjectManagement = () => {
  const [state, setState] = useState({
    // Estados de vista
    activeTab: 'Dashboard',
    loading: {
      projects: false,
      tasks: false,
      analytics: false
    },

    // Estados de datos
    projects: [],
    groups: [],
    tasks: [],
    sprints: [],
    phases: [],
    analytics: null,

    // Estados de filtros
    filters: {
      search: '',
      status: '',
      priority: '',
      dateRange: null
    },

    // Estados de UI
    notifications: [],
    selectedProject: null,
    modalOpen: false,
    modalType: null,

    // Estados de error
    errors: {}
  });

  const updateState = useCallback((updates) => {
    setState(prev => ({
      ...prev,
      ...updates
    }));
  }, []);

  const updateLoading = useCallback((key, value) => {
    setState(prev => ({
      ...prev,
      loading: {
        ...prev.loading,
        [key]: value
      }
    }));
  }, []);

  const updateFilters = useCallback((newFilters) => {
    setState(prev => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...newFilters
      }
    }));
  }, []);

  return {
    state,
    updateState,
    updateLoading,
    updateFilters
  };
};

// 🎭 Componentes antiguos eliminados - ahora se usa NavTabs

// 🎬 COMPONENTE INTERNO CON NOTIFICACIONES
const ProjectManagementContent = () => {
  const theme = useTheme();
  const { state, updateState, updateLoading, updateFilters } = useProjectManagement();
  const { error, captureError, resetError } = useErrorHandler();
  const notify = useNotify();
  
  // 🔐 Obtener información del usuario desde el contexto global
  const { profileData } = React.useContext(GlobalContext);

  // 🔑 Hook de permisos
  const { canCreate } = usePermissions();

  // 📋 PROJECT DRAWER STATE
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🎯 TASK MANAGEMENT STATE
  const [showTaskManagement, setShowTaskManagement] = useState(false);
  const [selectedProjectForTasks, setSelectedProjectForTasks] = useState(null);

  // 📊 Mock data mientras conectamos con la API real
  const mockData = useMemo(() => ({
    projects: [
      { 
        id: 1, 
        nombre: 'Sistema E-commerce', 
        name: 'Sistema E-commerce',
        descripcion: 'Desarrollo de plataforma de comercio electrónico.',
        status: 'active', 
        progress: 75, 
        priority: 'high',
        client: { nombre: 'TechCorp SA' },
        end_date: '2024-12-15',
        members: [
          { id: 1, user: { name: 'Juan Pérez' }, team_type: 'operations' },
          { id: 2, user: { name: 'María García' }, team_type: 'operations' },
          { id: 3, user: { name: 'Carlos López' }, team_type: 'it' },
          { id: 4, user: { name: 'Ana Martín' }, team_type: 'it' }
        ]
      },
      { 
        id: 2, 
        nombre: 'App Móvil', 
        name: 'App Móvil',
        descripcion: 'Creación de aplicación móvil para iOS y Android.',
        status: 'planning', 
        progress: 25, 
        priority: 'medium',
        client: { nombre: 'StartupXYZ' },
        end_date: '2024-10-30',
        members: [
          { id: 5, user: { name: 'Pedro Ruiz' }, team_type: 'operations' },
          { id: 6, user: { name: 'Laura Sánchez' }, team_type: 'it' },
          { id: 7, user: { name: 'Miguel Torres' }, team_type: 'it' }
        ]
      },
      { 
        id: 3, 
        nombre: 'Dashboard Analytics', 
        name: 'Dashboard Analytics',
        descripcion: 'Implementación de un panel de control interactivo.',
        status: 'completed', 
        progress: 100, 
        priority: 'low',
        client: null, // Sin cliente para probar "Sin Cliente"
        end_date: null, // Sin fecha para probar "N/A"
        members: [] // Sin equipo para probar "Sin equipo"
      }
    ],
    tasks: [
      { id: 1, title: 'Implementar autenticación', status: 'in_progress', priority: 'high' },
      { id: 2, title: 'Diseñar UI/UX', status: 'todo', priority: 'medium' },
      { id: 3, title: 'Setup CI/CD', status: 'done', priority: 'high' }
    ],
    sprints: [
      { id: 1, name: 'Sprint 1', status: 'active', progress: 60 },
      { id: 2, name: 'Sprint 2', status: 'planning', progress: 0 }
    ]
  }), []);

  // 🎯 Configuración de tabs dinámica - ahora se maneja en NavTabs

  // 🔄 Función para recargar datos desde la API
  const reloadData = useCallback(async (showLoading = true) => {
      try {
      if (showLoading) updateLoading('projects', true);
        
        // Importar el servicio de project management
        const { projectManagementService } = await import('../../services/projectManagementService');
        
        // Cargar proyectos usando el servicio
        const projectData = await projectManagementService.getProjects();
        
        // Cargar fases desde la API
        let phases = [];
        try {
          const phasesResponse = await fetch('http://localhost:8765/api/phases', {
            method: 'GET',
            credentials: 'include'
          });
          
          if (phasesResponse.ok) {
            const phasesData = await phasesResponse.json();

            phases = phasesData.data || [];
          } else {

            phases = [];
          }
        } catch (phasesError) {

          phases = [];
        }
        
        updateState({
          projects: projectData.projects,
          groups: projectData.groups,
          phases,
          tasks: mockData.tasks, // Mantener mock por ahora
          sprints: mockData.sprints // Mantener mock por ahora
        });

      } catch (err) {
      console.error('❌ Error en reloadData:', err);
      captureError(err, { context: 'reloadData' });
        
        // Fallback a datos mock
        updateState({
          projects: mockData.projects,
          groups: [],
          tasks: mockData.tasks,
          sprints: mockData.sprints,
          phases: []
        });
      } finally {
      if (showLoading) updateLoading('projects', false);
      }
  }, [updateState, updateLoading, captureError, mockData]);

  // 🔄 Efecto para cargar datos iniciales
  useEffect(() => {
    reloadData(true);
  }, [reloadData]);

  // 🎯 Efecto para configurar pestaña inicial según rol
  useEffect(() => {
    if (profileData?.role?.toLowerCase() === 'desarrollador' ||
        profileData?.role?.toLowerCase() === 'operador') {
      updateState({ activeTab: 'Dashboard' });
    }
  }, [profileData, updateState]);

  // 🚀 Función global para crear proyectos
  useEffect(() => {
    window.createNewProject = () => {

      updateState({ modalType: 'createProject', modalOpen: true });
    };
    
    return () => {
      delete window.createNewProject;
    };
  }, [updateState]);

  // 🎪 Manejador de cambio de tab
  const handleTabChange = useCallback((tabId) => {
    updateState({ activeTab: tabId });
  }, [updateState]);

  // 🔄 Manejadores de operaciones CRUD con recarga automática
  const handleProjectCreate = useCallback(async (projectData) => {
    try {

      // Importar el servicio
      const { projectManagementService } = await import('../../services/projectManagementService');
      
      // Crear el proyecto
      const result = await projectManagementService.createProject(projectData);

      // Recargar datos para mostrar el nuevo proyecto
      await reloadData(false);
      
      // Mostrar notificación de éxito
      notify.success({
        title: 'Proyecto creado',
        description: `"${projectData.nombre}" se creó exitosamente`
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error creando proyecto:', error);
      notify.error({
        title: 'Error al crear proyecto',
        description: error.message || 'No se pudo crear el proyecto'
      });
      throw error;
    }
  }, [reloadData, notify]);

  const handleProjectUpdate = useCallback(async (projectId, updates) => {
    try {

      // Validar que el ID sea válido
      if (!projectId || projectId === 'undefined' || projectId === null) {
        console.error('❌ ID de proyecto inválido en handleProjectUpdate:', projectId);
        notify.error({
          title: 'Error de validación',
          description: 'ID de proyecto inválido'
        });
        return;
      }
      
      // Importar el servicio
      const { projectManagementService } = await import('../../services/projectManagementService');
      
      // Actualizar el proyecto
      const result = await projectManagementService.updateProject(projectId, updates);

      // Recargar datos para mostrar los cambios
      await reloadData(false);
      
      // Mostrar notificación de éxito
      notify.success({
        title: 'Proyecto actualizado',
        description: `"${updates.nombre || 'Proyecto'}" se actualizó correctamente`
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error actualizando proyecto:', error);
      notify.error({
        title: 'Error al actualizar proyecto',
        description: error.message || 'No se pudo actualizar el proyecto'
      });
      throw error;
    }
  }, [reloadData, notify]);

  const handleProjectDelete = useCallback(async (projectId) => {
    try {

      // Importar el servicio
      const { projectManagementService } = await import('../../services/projectManagementService');
      
      // Eliminar el proyecto
      const result = await projectManagementService.deleteProject(projectId);

      // Recargar datos para reflejar la eliminación
      await reloadData(false);
      
      // Mostrar notificación de éxito
      notify.success({
        title: 'Proyecto eliminado',
        description: 'El proyecto se eliminó correctamente'
      });
      
      return result;
    } catch (error) {
      console.error('❌ Error eliminando proyecto:', error);
      notify.error({
        title: 'Error al eliminar proyecto',
        description: error.message || 'No se pudo eliminar el proyecto'
      });
      throw error;
    }
  }, [reloadData, notify]);

  // 🔍 Búsqueda específica se maneja en cada pestaña

  // 🎭 Renderizado de contenido por tab
  const renderTabContent = () => {
    const { activeTab, loading, projects, groups, tasks, sprints, phases } = state;

    if (error) {
      return (
        <UnifiedAlert
          severity="error"
          title="Error al cargar datos"
          onClose={resetError}
        >
          {error.error?.message || 'Ocurrió un error inesperado'}
        </UnifiedAlert>
      );
    }

    if (loading.projects) {
      return (
        <Grid container spacing={3}>
          {[1, 2, 3, 4].map(i => (
            <Grid item xs={12} md={6} lg={3} key={i}>
              <UnifiedSkeleton height={200} />
            </Grid>
          ))}
        </Grid>
      );
    }

    switch (activeTab) {
      case 'Dashboard':
        return (
          <ProjectDashboard
            projects={projects}
            tasks={tasks}
            sprints={sprints}
            onProjectSelect={(project) => updateState({ selectedProject: project })}
            userRole={profileData?.role}
          />
        );
      case 'Proyectos':
        return (
          <ProjectList
            projects={projects}
            groups={groups}
            phases={phases}
            loading={loading.projects}
            filters={state.filters}
            onEdit={async (projectId, updatesOrProject) => {
              try {
                // Si se pasa un ID y un objeto actualizado (desde onUpdate del modal)
                if (typeof projectId === 'number' && updatesOrProject && typeof updatesOrProject === 'object') {

                  // Actualización optimizada: solo actualizar el proyecto específico en el estado local
                  updateState(prevState => {
                    // Crear nuevas referencias para forzar re-renderizado
                    const updatedProjects = [...prevState.projects].map(p =>
                      p.id === projectId ? { ...p, ...updatesOrProject } : p
                    );

                    const updatedGroups = [...prevState.groups].map(group => ({
                      ...group,
                      projects: [...group.projects].map(p =>
                        p.id === projectId ? { ...p, ...updatesOrProject } : p
                      )
                    }));

                    const updatedProject = updatedProjects.find(p => p.id === projectId);

                    return {
                      ...prevState,
                      projects: updatedProjects,
                      groups: updatedGroups
                    };
                  });

                  // Mostrar notificación de éxito aquí para asegurar que aparezca
                  notify.success({
                    title: 'Proyecto actualizado',
                    description: `${updatesOrProject.nombre || 'Proyecto'} se actualizó correctamente`
                  });

                }
                // Si se pasa solo un proyecto (desde otras acciones)
                else if (typeof projectId === 'object' && projectId.id) {

                  await handleProjectUpdate(projectId.id, projectId);
                }
                else {
                  console.error('❌ Parámetros inválidos en onEdit:', { projectId, updatesOrProject });
                }
              } catch (error) {
                console.error('❌ Error en onEdit:', error);
                // El error ya se maneja en handleProjectUpdate
              }
            }}
            onDelete={async (project) => {
              try {

                await handleProjectDelete(project.id);
              } catch (error) {
                console.error('❌ Error eliminando proyecto:', error);
                // El error ya se maneja en handleProjectDelete
              }
            }}
            onView={(project) => {

              setSelectedProject(project);
              setDrawerOpen(true);
            }}
            onExport={(project) => {

            }}
          />
        );
      case 'Tareas':
        return (
          <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* 📋 Project Selection */}
            <div className="pm-project-selector">
              <FormControl fullWidth>
                <InputLabel>Selecciona un proyecto para gestionar sus tareas</InputLabel>
                <Select
                  value={selectedProjectForTasks?.id || ''}
                  onChange={(e) => {
                    const project = projects.find(p => p.id === e.target.value);
                    setSelectedProjectForTasks(project);
                  }}
                  label="Selecciona un proyecto para gestionar sus tareas"
                >
                  {projects.map((project) => (
                    <MenuItem key={project.id} value={project.id}>
                      {project.nombre || project.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>

            {/* 🎯 Task Management Module */}
            <Box sx={{ flex: 1, overflow: 'hidden' }}>
              <TaskManagementUnified
                projectId={selectedProjectForTasks?.id}
                projectName={selectedProjectForTasks?.nombre || selectedProjectForTasks?.name}
                projects={projects}
                onProjectSelect={setSelectedProjectForTasks}
                onClose={() => setSelectedProjectForTasks(null)}
              />
            </Box>
          </Box>
        );
      case 'Sprints':
        return (
          <SprintManagement
            sprints={sprints}
            projects={projects}
          />
        );
      case 'Analytics':
        return (
          <ProjectMetrics
            projects={projects}
            tasks={tasks}
            sprints={sprints}
            analytics={state.analytics}
          />
        );
      default:
        return null;
    }
  };

  return (
        <Box className="project-management-module">
          <Container maxWidth="xl" sx={{ pt: 3 }}>
            <UnifiedContainer variant="glass">
              {/* 🎯 Header con título y búsqueda */}
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 4,
                  flexWrap: 'wrap',
                  gap: 2
                }}
              >
                <Box>
                  <Typography
                  variant="h3"
                    sx={{
                    fontWeight: 800,
                    color: '#ffffff',
                    fontSize: '2.5rem',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      mb: 1,
                      letterSpacing: '-0.02em'
                    }}
                  >
                    🚀 Gestión de Proyectos
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                    color: 'rgba(255, 255, 255, 0.9)',
                    fontSize: '1.2rem',
                    fontWeight: 500,
                    textShadow: '0 1px 2px rgba(0,0,0,0.2)'
                    }}
                  >
                  📋 Administra proyectos, tareas y equipos de trabajo
                  </Typography>
              </Box>

            {/* 🚀 CONTEXTUAL BRUTAL BUTTON - Solo en módulos específicos con permisos */}
            {state.activeTab !== 'Dashboard' && canCreate('project_management') && (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <ContextualBrutalButton
              activeTab={state.activeTab}
                  onClick={() => {

                    // Lógica contextual según el tab
                    switch (state.activeTab) {
                      case 'Proyectos':
                    updateState({ modalType: 'createProject', modalOpen: true });
                    break;
                      case 'Tareas':
                    // Disparar evento para crear nueva tarea
                    if (selectedProjectForTasks?.id) {
                      // Disparar evento personalizado para que TaskBoardDragDrop lo capture
                      window.dispatchEvent(new CustomEvent('createNewTask', {
                        detail: { projectId: selectedProjectForTasks.id, status: 'todo' }
                      }));

                    } else {
                      notify.warning({
                        title: 'Selecciona un proyecto',
                        description: 'Debes seleccionar un proyecto antes de crear una tarea'
                      });
                    }
                    break;
                      case 'Sprints':
                    updateState({ modalType: 'createSprint', modalOpen: true });
                    break;
                      case 'Analytics':
                    updateState({ modalType: 'exportReport', modalOpen: true });
                    break;
                  default:
                        updateState({ modalType: 'createProject', modalOpen: true });
                    }
                  }}
                  size="large"
                />
              </Box>
            )}
            </Box>

          {/* 🎪 NavTabs */}
          <NavTabs
            current={state.activeTab}
            onTabChange={handleTabChange}
            userRole={profileData?.role}
          />

          {/* 📊 Content */}
          <Box sx={{ mt: 3 }}>
            {renderTabContent()}
          </Box>
        </UnifiedContainer>
      </Container>

      {/* 🎭 MODALES CONTEXTUALES */}
      {state.modalOpen && (
        <>
          {state.modalType === 'createProject' && (
            <ProjectFormDialog
              mode="create"
              open={state.modalOpen}
              onOpenChange={(open) => {
                if (!open) {
                  updateState({ modalOpen: false, modalType: null });
                }
              }}
              onSubmit={async (projectData) => {
                try {
                  // Crear el proyecto usando el servicio
                  const { projectManagementService } = await import('../../services/projectManagementService');
                  const result = await projectManagementService.createProject(projectData);

                  // Recargar datos
                  await reloadData(false);

                  // Mostrar notificación de éxito
                  notify.success({
                    title: 'Proyecto creado',
                    description: `"${projectData.nombre}" se creó exitosamente`
                  });

                  // Cerrar el modal
                  updateState({ modalOpen: false, modalType: null });

                  return result;
                } catch (error) {
                  console.error('❌ Error en onSubmit:', error);
                  notify.error({
                    title: 'Error al crear proyecto',
                    description: error.message || 'No se pudo crear el proyecto'
                  });
                  throw error;
                }
              }}
              submitLabel="Crear Proyecto"
            />
          )}

          {state.modalType === 'createTask' && (
            <SimpleModal
              open={state.modalOpen}
              onClose={() => updateState({ modalOpen: false, modalType: null })}
              title="Nueva Tarea"
            >
              <Typography variant="body2" color="text.secondary">
                Formulario de creación de tareas (por implementar)
                      </Typography>
            </SimpleModal>
          )}
          
                  {state.modalType === 'createSprint' && (
            <SimpleModal
              open={state.modalOpen}
              onClose={() => updateState({ modalOpen: false, modalType: null })}
              title="Nuevo Sprint"
            >
              <Typography variant="body2" color="text.secondary">
                Formulario de creación de sprints (por implementar)
                      </Typography>
            </SimpleModal>
          )}
          
                  {state.modalType === 'exportReport' && (
            <SimpleModal
              open={state.modalOpen}
              onClose={() => updateState({ modalOpen: false, modalType: null })}
              title="Generar Reporte"
            >
              <Typography variant="body2" color="text.secondary">
                Formulario de generación de reportes (por implementar)
                      </Typography>
            </SimpleModal>
          )}
                    </>
                  )}
                </Box>
  );
};

// 🎬 COMPONENTE PRINCIPAL CON PROVIDERS
const ProjectManagementMain = () => {
  return (
    <ModernToastProvider>
      <NotificationProvider position="topRight" maxNotifications={5}>
        <UnifiedErrorBoundary
          onError={(error) => console.error('Error en ProjectManagement:', error)}
          showDetails={process.env.NODE_ENV === 'development'}
        >
          <ProjectManagementContent />
      </UnifiedErrorBoundary>
      </NotificationProvider>
    </ModernToastProvider>
  );
};

export default ProjectManagementMain;
