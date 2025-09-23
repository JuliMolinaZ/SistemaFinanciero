// 📋 LISTA DE PROYECTOS PRO - DISEÑO ULTRA MODERNO
// ================================================

import React, { useState, useCallback, useMemo } from 'react';
import ProjectTableOnly from './ProjectTableOnly';
import ProjectDialogWorking from '../../../components/ui/ProjectDialogWorking';

// 🎯 COMPONENTE PRINCIPAL
const ProjectList = ({
  projects = [],
  groups = [],
  onEdit,
  onDelete,
  onView,
  onExport,
  filters,
  loading = false,
  phases = [],
  ...props
}) => {
  // Log para debugging cuando cambian los props
  console.log('🔄 ProjectList re-renderizado:', {
    projectsCount: projects.length,
    groupsCount: groups.length,
    timestamp: new Date().toLocaleTimeString()
  });
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 📊 Agrupar proyectos por cliente si no vienen agrupados
  const processedGroups = useMemo(() => {
    if (groups && groups.length > 0) {
      return groups;
    }
    
    // Si no hay grupos, crear grupos basados en los proyectos
    const groupsMap = new Map();
    
    projects.forEach(project => {
      const clientId = project.client_id || 'no-client';
      const clientName = project.client?.name || project.clientName || 'Sin Cliente';
      
      if (!groupsMap.has(clientId)) {
        groupsMap.set(clientId, {
          clientId,
          clientName,
          projects: [],
          count: 0
        });
      }
      
      const group = groupsMap.get(clientId);
      group.projects.push(project);
      group.count = group.projects.length;
    });
    
    return Array.from(groupsMap.values());
  }, [projects, groups]);

  // 🎯 HANDLE VIEW PROJECT
  const handleView = useCallback((project) => {
    console.log('👁️ Ver proyecto:', project.nombre || project.name);
    setSelectedProject(project);
    setDrawerOpen(true);
    onView?.(project);
  }, [onView]);

  // 🎯 HANDLE PROJECT UPDATE
  const handleProjectUpdate = useCallback((projectId, updatedProject) => {
    console.log('🔄 Proyecto actualizado en ProjectList:', { projectId, updatedProject });

    // Pasar ambos parámetros al componente padre
    if (onEdit) {
      onEdit(projectId, updatedProject);
    }

    // Update local selected project
    setSelectedProject(updatedProject);
  }, [onEdit]);

  // 🎯 HANDLE PROJECT DELETE
  const handleProjectDelete = useCallback((deletedProject) => {
    console.log('🗑️ Proyecto eliminado:', deletedProject);
    setDrawerOpen(false);
    setSelectedProject(null);
    if (onDelete) {
      onDelete(deletedProject);
    }
  }, [onDelete]);

  return (
    <>
      {/* 📊 PROJECT TABLE ONLY */}
      <ProjectTableOnly
        projects={projects}
        groups={processedGroups}
        onView={handleView}
        onEdit={handleProjectUpdate}
        onDelete={handleProjectDelete}
        loading={loading}
        {...props}
      />

      {/* 🎪 PROJECT DIALOG - MODAL CENTRADO */}
      <ProjectDialogWorking
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProject(null);
        }}
        project={selectedProject}
        onUpdate={handleProjectUpdate}
        onDelete={handleProjectDelete}
        phases={phases}
      />
    </>
  );
};

export default ProjectList;