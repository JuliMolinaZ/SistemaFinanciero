// 📊 DASHBOARD DE PROYECTOS - REDISEÑO PROFESIONAL CON CONTRASTE OPTIMIZADO
// =========================================================================

import React, { useState, useMemo } from 'react';
import ProjectDashboardOverview from './ProjectDashboardOverview';

// 📊 COMPONENTE PRINCIPAL DEL DASHBOARD REDISEÑADO
const ProjectDashboard = ({
  projects = [],
  tasks = [],
  sprints = [],
  onProjectSelect,
  loading = false
}) => {
  return (
    <ProjectDashboardOverview
      projects={projects}
      tasks={tasks}
      sprints={sprints}
      onProjectSelect={onProjectSelect}
      loading={loading}
    />
  );
};

export default ProjectDashboard;