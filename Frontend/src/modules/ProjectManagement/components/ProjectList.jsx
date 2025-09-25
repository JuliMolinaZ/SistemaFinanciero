// 📋 LISTA DE PROYECTOS PRO - DISEÑO ULTRA MODERNO
// ================================================

import React, { useState, useCallback, useMemo } from 'react';
import ProjectTableOnly from './ProjectTableOnly';

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

  // 🎯 HANDLE VIEW PROJECT - Solo pasar la función al componente hijo
  const handleView = useCallback((project) => {
    onView?.(project);
  }, [onView]);

  // 🎯 HANDLE PROJECT UPDATE - Solo pasar la función al componente hijo
  const handleProjectUpdate = useCallback((projectId, updatedProject) => {
    if (onEdit) {
      onEdit(projectId, updatedProject);
    }
  }, [onEdit]);

  // 🎯 HANDLE PROJECT DELETE - Solo pasar la función al componente hijo
  const handleProjectDelete = useCallback((deletedProject) => {
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

    </>
  );
};

export default ProjectList;