// 📊 DASHBOARD DE PROYECTOS - REDISEÑO PROFESIONAL CON CONTRASTE OPTIMIZADO
// =========================================================================

import React, { useState, useMemo, useContext } from 'react';
import ProjectDashboardOverview from './ProjectDashboardOverview';
import MyTasksDashboard from '../../../components/dashboard/MyTasksDashboard';
import { GlobalContext } from '../../../context/GlobalState';

// 📊 COMPONENTE PRINCIPAL DEL DASHBOARD REDISEÑADO
const ProjectDashboard = ({
  projects = [],
  tasks = [],
  sprints = [],
  onProjectSelect,
  loading = false,
  userRole = 'administrador'
}) => {
  const { profileData } = useContext(GlobalContext);

  // Para desarrolladores y operadores, mostrar solo dashboard de tareas
  if (userRole?.toLowerCase() === 'desarrollador' || userRole?.toLowerCase() === 'operador') {
    return <MyTasksDashboard />;
  }

  // Para otros roles, mostrar dashboard ejecutivo con opción de tareas
  return (
    <div>
      {/* Dashboard Ejecutivo Principal */}
      <ProjectDashboardOverview
        projects={projects}
        tasks={tasks}
        sprints={sprints}
        onProjectSelect={onProjectSelect}
        loading={loading}
      />

      {/* Sección de Tareas Personales para todos los roles */}
      <div style={{ marginTop: '2rem' }}>
        <MyTasksDashboard />
      </div>
    </div>
  );
};

export default ProjectDashboard;