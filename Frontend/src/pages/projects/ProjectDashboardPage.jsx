// 📊 PÁGINA PRINCIPAL DEL DASHBOARD DE PROYECTOS REDISEÑADO
// =========================================================

import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Settings } from 'lucide-react';

// Componentes del sistema de diseño
import AppShell from '../../components/ui/AppShell';
import ProjectDashboard from '../../components/projects/ProjectDashboard';
import QuickAction from '../../components/ui/QuickAction';

// Datos de ejemplo (reemplazar con datos reales de la API)
import { mockProjects, mockTasks, mockSprints } from './mockData';

import './ProjectDashboardPage.css';

const ProjectDashboardPage = () => {
  const [currentTheme, setCurrentTheme] = useState('dark');
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [sprints, setSprints] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // 🎨 Toggle de tema
  const handleThemeToggle = useCallback(() => {
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    setCurrentTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    
    // Persistir en localStorage
    localStorage.setItem('theme', newTheme);
  }, [currentTheme]);

  // 🔍 Manejo de búsqueda
  const handleSearch = useCallback((query) => {
    setSearchQuery(query);
    // Implementar lógica de búsqueda aquí
    console.log('Searching for:', query);
  }, []);

  // 📊 Cargar datos
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      try {
        // Simular carga de datos
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setProjects(mockProjects);
        setTasks(mockTasks);
        setSprints(mockSprints);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // 🎨 Cargar tema guardado
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    setCurrentTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  // 🎯 Handlers de eventos
  const handleProjectSelect = useCallback((project) => {
    console.log('Selected project:', project);
    // Implementar navegación a detalles del proyecto
  }, []);

  const handleCreateProject = useCallback(() => {
    console.log('Create new project');
    // Implementar creación de proyecto
  }, []);

  const handleViewAll = useCallback(() => {
    console.log('View all projects');
    // Implementar navegación a lista completa
  }, []);

  const handleLogout = useCallback(() => {
    console.log('Logout');
    // Implementar logout
  }, []);

  return (
    <AppShell
      sidebar={true}
      topbar={true}
      searchPlaceholder="Buscar proyectos, tareas..."
      onSearch={handleSearch}
      onThemeToggle={handleThemeToggle}
      currentTheme={currentTheme}
      user={{
        name: 'Juan Pérez',
        role: 'Project Manager',
        avatar: null
      }}
      onLogout={handleLogout}
      className="project-dashboard-page"
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="project-dashboard-page__content"
      >
        {/* Header de la página */}
        <div className="project-dashboard-page__header">
          <div className="project-dashboard-page__header-content">
            <div className="project-dashboard-page__breadcrumbs">
              <span className="project-dashboard-page__breadcrumb-item">
                Dashboard
              </span>
              <span className="project-dashboard-page__breadcrumb-separator">
                /
              </span>
              <span className="project-dashboard-page__breadcrumb-item project-dashboard-page__breadcrumb-item--active">
                Proyectos
              </span>
            </div>
            
            <div className="project-dashboard-page__title-section">
              <h1 className="project-dashboard-page__title">
                Gestión de Proyectos
              </h1>
              <p className="project-dashboard-page__subtitle">
                Monitorea el progreso y estado de todos tus proyectos
              </p>
            </div>
          </div>
          
          <div className="project-dashboard-page__header-actions">
            <QuickAction
              variant="secondary"
              size="sm"
              icon={Settings}
              onClick={() => console.log('Settings')}
              aria-label="Configuración del dashboard"
            />
          </div>
        </div>

        {/* Dashboard principal */}
        <ProjectDashboard
          projects={projects}
          tasks={tasks}
          sprints={sprints}
          loading={loading}
          onProjectSelect={handleProjectSelect}
          onCreateProject={handleCreateProject}
          onViewAll={handleViewAll}
          className="project-dashboard-page__dashboard"
        />

        {/* Footer con estadísticas adicionales */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="project-dashboard-page__footer"
        >
          <div className="project-dashboard-page__footer-content">
            <div className="project-dashboard-page__footer-stats">
              <div className="project-dashboard-page__footer-stat">
                <span className="project-dashboard-page__footer-stat-label">
                  Total de Proyectos
                </span>
                <span className="project-dashboard-page__footer-stat-value">
                  {projects.length}
                </span>
              </div>
              
              <div className="project-dashboard-page__footer-stat">
                <span className="project-dashboard-page__footer-stat-label">
                  Tareas Pendientes
                </span>
                <span className="project-dashboard-page__footer-stat-value">
                  {tasks.filter(t => t.status !== 'done').length}
                </span>
              </div>
              
              <div className="project-dashboard-page__footer-stat">
                <span className="project-dashboard-page__footer-stat-label">
                  Sprints Activos
                </span>
                <span className="project-dashboard-page__footer-stat-value">
                  {sprints.filter(s => s.status === 'active').length}
                </span>
              </div>
            </div>
            
            <div className="project-dashboard-page__footer-info">
              <p className="project-dashboard-page__footer-text">
                Última actualización: {new Date().toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AppShell>
  );
};

export default ProjectDashboardPage;
