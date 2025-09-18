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
  alpha
} from '@mui/material';
import './ProjectManagementEnterprise.css';
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

// 🎨 Importar sistema de diseño optimizado
import {
  UnifiedContainer,
  UnifiedCard,
  UnifiedButton,
  UnifiedAlert,
  UnifiedSkeleton
} from '../../components/DesignSystem/BaseComponents';
import { UnifiedSearchInput } from '../../components/DesignSystem/FormComponents';
import UnifiedErrorBoundary, { useErrorHandler } from '../../components/DesignSystem/ErrorBoundary';
import { designTheme, styleUtils } from '../../components/DesignSystem/theme';

// 📊 Importar componentes refactorizados
import ProjectDashboard from './components/ProjectDashboard';
import ProjectList from './components/ProjectList';
import TaskBoard from './components/TaskBoard';
import SprintManagement from './components/SprintManagement';
import ProjectMetrics from './components/ProjectMetrics';

// 🧭 Importar navegación accesible
import { NavTabs } from '../../components/navigation/NavTabs.tsx';
import ContextualFab from '../../components/ui/ContextualFab';
import CreateProjectForm from '../../components/forms/CreateProjectForm';

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

// 🎬 COMPONENTE PRINCIPAL REFACTORIZADO
const ProjectManagementMain = () => {
  const theme = useTheme();
  const { state, updateState, updateLoading, updateFilters } = useProjectManagement();
  const { error, captureError, resetError } = useErrorHandler();
  const notify = useNotify();

  // 📋 PROJECT DRAWER STATE
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

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

  // 🔄 Efecto para cargar datos reales desde la API
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        updateLoading('projects', true);
        
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
            console.log('✅ Fases cargadas:', phasesData.data?.length || 0);
            phases = phasesData.data || [];
          } else {
            console.warn('⚠️ Error cargando fases:', phasesResponse.status);
            phases = [];
          }
        } catch (phasesError) {
          console.warn('⚠️ Error al cargar fases:', phasesError);
          phases = [];
        }
        
        updateState({
          projects: projectData.projects,
          groups: projectData.groups,
          phases,
          tasks: mockData.tasks, // Mantener mock por ahora
          sprints: mockData.sprints // Mantener mock por ahora
        });

        console.log('✅ Datos cargados exitosamente:');
        console.log('   - Proyectos:', projectData.projects.length);
        console.log('   - Grupos:', projectData.groups.length);
        console.log('   - Fases:', phases.length);
        
      } catch (err) {
        console.error('❌ Error en loadInitialData:', err);
        captureError(err, { context: 'loadInitialData' });
        
        // Fallback a datos mock
        updateState({
          projects: mockData.projects,
          groups: [],
          tasks: mockData.tasks,
          sprints: mockData.sprints,
          phases: []
        });
      } finally {
        updateLoading('projects', false);
      }
    };

    loadInitialData();
  }, [updateState, updateLoading, captureError, mockData]);

  // 🚀 Función global para crear proyectos
  useEffect(() => {
    window.createNewProject = () => {
      console.log('🚀 Función global createNewProject ejecutada');
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
            onEdit={(project) => {
              console.log('✏️ Proyecto actualizado:', project.nombre || project.name);
              // Actualizar el proyecto en el estado y los grupos
              const updatedProjects = projects.map(p => 
                p.id === project.id ? { ...p, ...project } : p
              );
              const updatedGroups = groups.map(group => ({
                ...group,
                projects: group.projects.map(p => 
                  p.id === project.id ? { ...p, ...project } : p
                )
              }));
              updateState({ projects: updatedProjects, groups: updatedGroups });
            }}
            onDelete={(project) => {
              console.log('🗑️ Proyecto eliminado:', project.nombre || project.name);
              // Remover el proyecto del estado y los grupos
              const updatedProjects = projects.filter(p => p.id !== project.id);
              const updatedGroups = groups.map(group => ({
                ...group,
                projects: group.projects.filter(p => p.id !== project.id),
                count: group.projects.filter(p => p.id !== project.id).length
              })).filter(group => group.count > 0);
              updateState({ projects: updatedProjects, groups: updatedGroups });
            }}
            onView={(project) => {
              console.log('👁️ Ver proyecto:', project.nombre || project.name);
              setSelectedProject(project);
              setDrawerOpen(true);
            }}
            onExport={(project) => {
              console.log('📊 Exportar reporte:', project.nombre || project.name);
            }}
          />
        );
      case 'Tareas':
        return (
          <TaskBoard
            tasks={tasks}
            projects={projects}
            onTaskUpdate={(task) => console.log('Update task:', task)}
            onTaskCreate={() => updateState({ modalType: 'createTask', modalOpen: true })}
          />
        );
      case 'Sprints':
        return (
          <SprintManagement
            sprints={sprints}
            projects={projects}
            onSprintStart={(sprintId) => console.log('Start sprint:', sprintId)}
            onSprintComplete={(sprintId) => console.log('Complete sprint:', sprintId)}
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
    <ModernToastProvider>
      <NotificationProvider>
        <UnifiedErrorBoundary
        onError={captureError}
        showDetails={process.env.NODE_ENV === 'development'}
      >
        <Box
        className="project-management-enterprise"
        sx={{
          minHeight: '100vh',
          background: designTheme.gradients.dark,
          py: 3
        }}
      >
        <Container maxWidth="xl">
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
                  variant="h2"
                  sx={{
                    ...designTheme.typography.h2,
                    ...styleUtils.createTextGradient([
                      designTheme.colors.semantic.primary[400],
                      designTheme.colors.semantic.primary[600],
                      designTheme.colors.semantic.success[400]
                    ]),
                    mb: 1
                  }}
                >
                  Gestión de Proyectos
                </Typography>
                <Typography
                  variant="body1"
                  sx={{
                    color: designTheme.colors.semantic.neutral[300],
                    ...designTheme.typography.body1
                  }}
                >
                  Panel de control unificado para la gestión completa de proyectos
                </Typography>
              </Box>
            </Box>

            {/* 🧭 Navegación accesible WCAG AA */}
            <Box sx={{ mb: 4 }}>
              <NavTabs current={state.activeTab} onTabChange={handleTabChange} />
            </Box>

            {/* 🎬 Contenido principal con animaciones */}
            <Box sx={{ position: 'relative' }}>
              <AnimatePresence mode="wait">
                <motion.div
                  key={state.activeTab}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    ease: "easeInOut"
                  }}
                >
                  {renderTabContent()}
                </motion.div>
              </AnimatePresence>
            </Box>

            {/* 🚀 FAB CONTEXTUAL - CAMBIA SEGÚN PESTAÑA */}
            <ContextualFab 
              activeTab={state.activeTab}
              onAction={(actionType) => {
                console.log(`🚀 Acción contextual: ${actionType} en pestaña: ${state.activeTab}`);
                
                switch (actionType) {
                  case 'createProject':
                    updateState({ modalType: 'createProject', modalOpen: true });
                    break;
                  case 'createTask':
                    updateState({ modalType: 'createTask', modalOpen: true });
                    break;
                  case 'createSprint':
                    updateState({ modalType: 'createSprint', modalOpen: true });
                    break;
                  case 'exportReport':
                    updateState({ modalType: 'exportReport', modalOpen: true });
                    break;
                  default:
                    console.log('Acción no manejada:', actionType);
                }
              }}
            />

            {/* 📝 Formulario de crear proyecto REAL */}
            {state.modalOpen && state.modalType === 'createProject' && (
              <CreateProjectForm
                onClose={() => updateState({ modalOpen: false, modalType: null })}
                onSuccess={(newProject) => {
                  console.log('✅ Proyecto creado exitosamente:', newProject);
                  // Actualizar la lista de proyectos
                  updateState({ 
                    modalOpen: false, 
                    modalType: null,
                    projects: [...state.projects, newProject]
                  });
                  // Mostrar notificación de éxito
                  notify.success({
                    title: 'Proyecto creado',
                    description: `"${newProject.name}" se guardó correctamente`
                  });
                }}
              />
            )}

            {/* 📝 Modales simples para otras acciones */}
            {state.modalOpen && state.modalType !== 'createProject' && (
            <Box
              sx={{
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
                  backdropFilter: 'blur(4px)'
                }}
                onClick={() => updateState({ modalOpen: false, modalType: null })}
              >
                <Box
                  sx={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '32px',
                    maxWidth: '500px',
                    width: '90%',
                    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)'
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Modal de crear tarea */}
                  {state.modalType === 'createTask' && (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        ✅ Crear Nueva Tarea
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 4, color: 'gray' }}>
                        Funcionalidad de creación de tareas próximamente. El sistema está preparado para gestionar tareas de proyecto.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <UnifiedButton
                          variant="secondary"
                          onClick={() => updateState({ modalOpen: false, modalType: null })}
                        >
                          Cerrar
                        </UnifiedButton>
                        <UnifiedButton
                          variant="primary"
                          onClick={() => {
                            updateState({ modalOpen: false, modalType: null, activeTab: 'Tareas' });
                          }}
                        >
                          Ver Tareas
                        </UnifiedButton>
                      </Box>
                    </>
                  )}

                  {/* Modal de crear sprint */}
                  {state.modalType === 'createSprint' && (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        🏃 Crear Nuevo Sprint
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 4, color: 'gray' }}>
                        Funcionalidad de creación de sprints próximamente. El sistema está preparado para gestión ágil.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <UnifiedButton
                          variant="secondary"
                          onClick={() => updateState({ modalOpen: false, modalType: null })}
                        >
                          Cerrar
                        </UnifiedButton>
                        <UnifiedButton
                          variant="primary"
                          onClick={() => {
                            updateState({ modalOpen: false, modalType: null, activeTab: 'Sprints' });
                          }}
                        >
                          Ver Sprints
                        </UnifiedButton>
                      </Box>
                    </>
                  )}

                  {/* Modal de exportar reporte */}
                  {state.modalType === 'exportReport' && (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        📊 Exportar Reporte - {state.selectedProject?.nombre}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 4, color: 'gray' }}>
                        Funcionalidad de reportes próximamente. El sistema generará reportes completos de analytics.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <UnifiedButton
                          variant="secondary"
                          onClick={() => updateState({ modalOpen: false, modalType: null, selectedProject: null })}
                        >
                          Cerrar
                        </UnifiedButton>
                        <UnifiedButton
                          variant="primary"
                          onClick={() => {
                            updateState({ modalOpen: false, modalType: null, selectedProject: null, activeTab: 'Analytics' });
                          }}
                        >
                          Ver Analytics
                        </UnifiedButton>
                      </Box>
                    </>
                  )}

                  {/* Modal de ver proyecto */}
                  {state.modalType === 'viewProject' && (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        👁️ Ver Proyecto - {state.selectedProject?.nombre}
                      </Typography>
                      <Box sx={{ mb: 4 }}>
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Descripción:</Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'gray' }}>
                          {state.selectedProject?.descripcion || 'Sin descripción'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Cliente:</Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'gray' }}>
                          {state.selectedProject?.client?.nombre || 'Sin cliente'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Estado:</Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'gray' }}>
                          {state.selectedProject?.status === 'active' ? 'Activo' : 
                           state.selectedProject?.status === 'planning' ? 'Planificación' : 
                           state.selectedProject?.status === 'completed' ? 'Completado' : 'Sin estado'}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Progreso:</Typography>
                        <Typography variant="body1" sx={{ mb: 3, color: 'gray' }}>
                          {state.selectedProject?.progress || 0}%
                        </Typography>
                        
                        <Typography variant="body2" sx={{ mb: 1, fontWeight: 600 }}>Equipos:</Typography>
                        <Typography variant="body1" sx={{ color: 'gray' }}>
                          Operaciones: {state.selectedProject?.members?.filter(m => m.team_type === 'operations').length || 0} miembros<br/>
                          TI: {state.selectedProject?.members?.filter(m => m.team_type === 'it').length || 0} miembros
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <UnifiedButton
                          variant="secondary"
                          onClick={() => updateState({ modalOpen: false, modalType: null, selectedProject: null })}
                        >
                          Cerrar
                        </UnifiedButton>
                        <UnifiedButton
                          variant="primary"
                          onClick={() => {
                            updateState({ modalType: 'editProject' });
                          }}
                        >
                          Editar
                        </UnifiedButton>
                      </Box>
                    </>
                  )}

                  {/* Modal de editar proyecto */}
                  {state.modalType === 'editProject' && (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
                        ✏️ Editar Proyecto - {state.selectedProject?.nombre}
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 4, color: 'gray' }}>
                        Funcionalidad de edición próximamente. El sistema permitirá modificar todos los campos del proyecto.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <UnifiedButton
                          variant="secondary"
                          onClick={() => updateState({ modalOpen: false, modalType: null, selectedProject: null })}
                        >
                          Cancelar
                        </UnifiedButton>
                        <UnifiedButton
                          variant="primary"
                          onClick={() => {
                            console.log('💾 Guardando cambios del proyecto:', state.selectedProject?.nombre);
                            updateState({ modalOpen: false, modalType: null, selectedProject: null });
                            notify.success('Cambios guardados correctamente');
                          }}
                        >
                          Guardar Cambios
                        </UnifiedButton>
                      </Box>
                    </>
                  )}

                  {/* Modal de eliminar proyecto */}
                  {state.modalType === 'deleteProject' && (
                    <>
                      <Typography variant="h5" sx={{ mb: 2, fontWeight: 600, color: '#ef4444' }}>
                        🗑️ Eliminar Proyecto
                      </Typography>
                      <Typography variant="body1" sx={{ mb: 4, color: 'gray' }}>
                        ¿Estás seguro de que deseas eliminar el proyecto <strong>"{state.selectedProject?.nombre}"</strong>?
                        <br/><br/>
                        Esta acción no se puede deshacer y se eliminarán todos los datos relacionados.
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                        <UnifiedButton
                          variant="secondary"
                          onClick={() => updateState({ modalOpen: false, modalType: null, selectedProject: null })}
                        >
                          Cancelar
                        </UnifiedButton>
                  <UnifiedButton
                    variant="primary"
                          onClick={() => {
                            console.log('🗑️ Eliminando proyecto:', state.selectedProject?.nombre);
                            // Remover el proyecto de la lista
                            const updatedProjects = state.projects.filter(p => p.id !== state.selectedProject.id);
                            updateState({ 
                              modalOpen: false, 
                              modalType: null, 
                              selectedProject: null,
                              projects: updatedProjects
                            });
                            notify.success('Proyecto eliminado');
                          }}
                          style={{ backgroundColor: '#ef4444' }}
                        >
                          Eliminar
                  </UnifiedButton>
                      </Box>
                    </>
                  )}
                </Box>
            </Box>
            )}
          </UnifiedContainer>
        </Container>
        </Box>
      </UnifiedErrorBoundary>

      {/* 📋 PROJECT DRAWER SIMPLE */}
      <ProjectDrawerSimple
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
      />
      </NotificationProvider>
    </ModernToastProvider>
  );
};

export default ProjectManagementMain;