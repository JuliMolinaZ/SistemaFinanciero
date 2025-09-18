// 🎯 PROJECT MANAGEMENT PAGE - ULTRA PROFESIONAL
// ==============================================

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  Box,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Stack,
  Fab,
  Backdrop,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';

import { DataTableGrouped } from '../../components/ui/DataTableGrouped';
import { ProjectDrawer } from '../../components/ui/ProjectDrawer';
import { NotificationProvider } from '../../components/ui/NotificationSystem';
import { useNotify } from '../../hooks/useNotify';
import { projectManagementService, handleApiError } from '../../services/projectManagementService';

// 🎯 MAIN COMPONENT
export function ProjectManagementPage() {
  // 🏗️ Estados principales
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('end_date');
  const [sortOrder, setSortOrder] = useState('asc');

  // 🎨 Estados del drawer
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerLoading, setDrawerLoading] = useState(false);

  const notify = useNotify();

  // 🔄 FETCH PROJECTS
  const fetchProjects = useCallback(async (showLoading = true) => {
    try {
      if (showLoading) setLoading(true);
      setError(null);

      const data = await projectManagementService.getProjects({
        search: searchTerm,
        sortBy,
        sortOrder
      });

      setProjects(data.projects);
      setGroups(data.groups);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
      handleApiError(err, notify);
    } finally {
      if (showLoading) setLoading(false);
    }
  }, [searchTerm, sortBy, sortOrder, notify]);

  // 🔄 FETCH PROJECT BY ID
  const fetchProject = useCallback(async (id) => {
    try {
      setDrawerLoading(true);
      const project = await projectManagementService.getProject(id);
      return project;
    } catch (err) {
      console.error('Error fetching project:', err);
      handleApiError(err, notify);
      throw err;
    } finally {
      setDrawerLoading(false);
    }
  }, [notify]);

  // ✏️ UPDATE PROJECT
  const updateProject = useCallback(async (id, updates) => {
    try {
      const updatedProject = await projectManagementService.updateProject(id, updates);

      // Actualizar proyecto en el estado local
      setProjects(prev =>
        prev.map(project =>
          project.id === id ? { ...project, ...updatedProject } : project
        )
      );

      // Actualizar proyecto seleccionado si coincide
      if (selectedProject?.id === id) {
        setSelectedProject(updatedProject);
      }

      // Refrescar lista para mantener agrupación correcta
      await fetchProjects(false);

      return updatedProject;
    } catch (err) {
      console.error('Error updating project:', err);
      handleApiError(err, notify);
      throw err;
    }
  }, [selectedProject, fetchProjects, notify]);

  // 🗑️ DELETE PROJECT
  const deleteProject = useCallback(async (id) => {
    try {
      await projectManagementService.deleteProject(id);

      // Remover del estado local
      setProjects(prev => prev.filter(project => project.id !== id));

      // Refrescar para actualizar grupos
      await fetchProjects(false);

      return true;
    } catch (err) {
      console.error('Error deleting project:', err);
      handleApiError(err, notify);
      throw err;
    }
  }, [fetchProjects, notify]);

  // 🎯 HANDLERS
  const handleViewProject = useCallback(async (project) => {
    try {
      setSelectedProject(project);
      setDrawerOpen(true);

      // Cargar datos completos del proyecto
      const fullProject = await fetchProject(project.id);
      setSelectedProject(fullProject);
    } catch (err) {
      setDrawerOpen(false);
      setSelectedProject(null);
    }
  }, [fetchProject]);

  const handleCloseDrawer = useCallback(() => {
    setDrawerOpen(false);
    setSelectedProject(null);
  }, []);

  const handleSearchChange = useCallback((event) => {
    setSearchTerm(event.target.value);
  }, []);

  const handleRefresh = useCallback(() => {
    fetchProjects(true);
  }, [fetchProjects]);

  // 🏁 INITIAL LOAD
  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  // 🎨 COLUMNS CONFIGURATION
  const columns = useMemo(() => [
    {
      id: 'nombre',
      label: 'Nombre del Proyecto',
      sortable: true,
      width: '25%'
    },
    {
      id: 'descripcion',
      label: 'Descripción',
      sortable: false,
      width: '30%'
    },
    {
      id: 'status',
      label: 'Estado',
      sortable: true,
      width: '10%'
    },
    {
      id: 'priority',
      label: 'Prioridad',
      sortable: true,
      width: '10%'
    },
    {
      id: 'project_manager',
      label: 'PM',
      sortable: false,
      width: '15%'
    },
    {
      id: 'actions',
      label: 'Acciones',
      sortable: false,
      width: '10%',
      align: 'center'
    }
  ], []);

  // 🎨 RENDER
  return (
    <NotificationProvider position="topRight" maxNotifications={5}>
      <Box sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--background-default)',
        overflow: 'hidden'
      }}>
        {/* 🔝 HEADER */}
        <Box sx={{
          p: 3,
          borderBottom: 'var(--border-subtle)',
          backgroundColor: 'var(--surface-paper)',
          position: 'sticky',
          top: 0,
          zIndex: 10
        }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between">
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}
            >
              Gestión de Proyectos
            </Typography>

            <Stack direction="row" spacing={2} alignItems="center">
              <TextField
                size="small"
                placeholder="Buscar proyectos..."
                value={searchTerm}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{ width: 300 }}
              />

              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                disabled={loading}
              >
                Actualizar
              </Button>

              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  notify.info({
                    title: 'Crear proyecto',
                    description: 'Funcionalidad en desarrollo'
                  });
                }}
              >
                Nuevo Proyecto
              </Button>
            </Stack>
          </Stack>
        </Box>

        {/* 📊 CONTENT */}
        <Box sx={{ flex: 1, overflow: 'hidden' }}>
          {error ? (
            <Box sx={{ p: 3 }}>
              <Alert
                severity="error"
                action={
                  <Button color="inherit" size="small" onClick={handleRefresh}>
                    Reintentar
                  </Button>
                }
              >
                {error}
              </Alert>
            </Box>
          ) : (
            <DataTableGrouped
              columns={columns}
              data={projects}
              groups={groups}
              loading={loading}
              searchTerm={searchTerm}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={(field, order) => {
                setSortBy(field);
                setSortOrder(order);
              }}
              onViewProject={handleViewProject}
              emptyMessage="No se encontraron proyectos"
              groupEmptyMessage="No hay proyectos en este grupo"
            />
          )}
        </Box>

        {/* 🎨 PROJECT DRAWER */}
        <ProjectDrawer
          open={drawerOpen}
          onClose={handleCloseDrawer}
          project={selectedProject}
          onUpdate={updateProject}
          onDelete={deleteProject}
          loading={drawerLoading}
        />

        {/* 🔄 LOADING BACKDROP */}
        <Backdrop
          sx={{
            color: '#fff',
            zIndex: (theme) => theme.zIndex.drawer + 1,
            backgroundColor: 'rgba(0, 0, 0, 0.3)'
          }}
          open={loading && projects.length === 0}
        >
          <Stack alignItems="center" spacing={2}>
            <CircularProgress color="inherit" />
            <Typography variant="h6">
              Cargando proyectos...
            </Typography>
          </Stack>
        </Backdrop>
      </Box>
    </NotificationProvider>
  );
}

export default ProjectManagementPage;