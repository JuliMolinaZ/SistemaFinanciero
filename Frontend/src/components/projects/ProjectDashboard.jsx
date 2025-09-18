// 📊 DASHBOARD DE PROYECTOS REDISEÑADO - PROFESIONAL
// ===================================================

import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import {
  FolderOpen,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Calendar,
  MoreVertical,
  Eye,
  Edit,
  Plus,
  Filter,
  Download
} from 'lucide-react';

// Componentes UI
import StatCard from '../ui/StatCard';
import Badge from '../ui/Badge';
import Progress from '../ui/Progress';
import QuickAction from '../ui/QuickAction';
import EmptyState from '../ui/EmptyState';
import Skeleton, { SkeletonCard } from '../ui/Skeleton';

import './ProjectDashboard.css';

const ProjectDashboard = ({
  projects = [],
  tasks = [],
  sprints = [],
  loading = false,
  onProjectSelect,
  onCreateProject,
  onViewAll,
  className = ''
}) => {
  const [selectedMetric, setSelectedMetric] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // 📊 Cálculo de métricas
  const metrics = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const activeSprints = sprints.filter(s => s.status === 'active').length;

    const projectCompletionRate = totalProjects > 0
      ? Math.round((completedProjects / totalProjects) * 100)
      : 0;

    const taskCompletionRate = totalTasks > 0
      ? Math.round((completedTasks / totalTasks) * 100)
      : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      totalTasks,
      completedTasks,
      activeSprints,
      projectCompletionRate,
      taskCompletionRate
    };
  }, [projects, tasks, sprints]);

  // 📋 Proyectos recientes filtrados
  const recentProjects = useMemo(() => {
    let filtered = projects;
    
    if (filterStatus !== 'all') {
      filtered = projects.filter(p => p.status === filterStatus);
    }
    
    return filtered
      .sort((a, b) => new Date(b.created_at || b.updated_at || Date.now()) - new Date(a.created_at || a.updated_at || Date.now()))
      .slice(0, 6);
  }, [projects, filterStatus]);

  // 🎯 Configuración de métricas
  const metricsConfig = [
    {
      title: 'Proyectos Totales',
      value: metrics.totalProjects,
      icon: FolderOpen,
      trend: 'up',
      deltaPct: 12,
      helpText: `${metrics.activeProjects} activos`
    },
    {
      title: 'Tareas Completadas',
      value: `${metrics.taskCompletionRate}%`,
      icon: CheckCircle,
      trend: metrics.taskCompletionRate >= 70 ? 'up' : metrics.taskCompletionRate >= 40 ? 'flat' : 'down',
      deltaPct: 8,
      helpText: `${metrics.completedTasks}/${metrics.totalTasks} tareas`
    },
    {
      title: 'Sprints Activos',
      value: metrics.activeSprints,
      icon: Clock,
      trend: 'flat',
      deltaPct: 0,
      helpText: 'En desarrollo'
    },
    {
      title: 'Tasa de Éxito',
      value: `${metrics.projectCompletionRate}%`,
      icon: TrendingUp,
      trend: metrics.projectCompletionRate >= 80 ? 'up' : metrics.projectCompletionRate >= 50 ? 'flat' : 'down',
      deltaPct: 15,
      helpText: 'Proyectos completados'
    }
  ];

  const getStatusConfig = (status) => {
    switch (status) {
      case 'active':
        return { variant: 'success', label: 'Activo' };
      case 'planning':
        return { variant: 'warning', label: 'Planificación' };
      case 'on_hold':
        return { variant: 'neutral', label: 'En Espera' };
      case 'completed':
        return { variant: 'primary', label: 'Completado' };
      default:
        return { variant: 'neutral', label: status };
    }
  };

  const getPriorityConfig = (priority) => {
    switch (priority) {
      case 'high':
        return { variant: 'danger', label: 'Alta' };
      case 'medium':
        return { variant: 'warning', label: 'Media' };
      case 'low':
        return { variant: 'success', label: 'Baja' };
      default:
        return { variant: 'neutral', label: priority };
    }
  };

  if (loading) {
    return (
      <div className={`project-dashboard ${className}`}>
        {/* Skeleton para métricas */}
        <div className="project-dashboard__metrics">
          {Array.from({ length: 4 }).map((_, index) => (
            <SkeletonCard key={index} />
          ))}
        </div>
        
        {/* Skeleton para contenido */}
        <div className="project-dashboard__content">
          <div className="project-dashboard__main">
            <SkeletonCard />
          </div>
          <div className="project-dashboard__sidebar">
            <SkeletonCard />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`project-dashboard ${className}`}>
      {/* 🎯 Métricas principales */}
      <div className="project-dashboard__metrics">
        {metricsConfig.map((metric, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
          >
            <StatCard
              {...metric}
              onClick={() => setSelectedMetric(metric)}
            />
          </motion.div>
        ))}
      </div>

      {/* 📊 Contenido principal */}
      <div className="project-dashboard__content">
        {/* 📋 Proyectos recientes */}
        <div className="project-dashboard__main">
          <motion.div
            className="project-dashboard__section"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="project-dashboard__section-header">
              <h2 className="project-dashboard__section-title">
                Proyectos Recientes
              </h2>
              
              <div className="project-dashboard__section-actions">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="project-dashboard__filter"
                  aria-label="Filtrar por estado"
                >
                  <option value="all">Todos</option>
                  <option value="active">Activos</option>
                  <option value="planning">Planificación</option>
                  <option value="on_hold">En Espera</option>
                  <option value="completed">Completados</option>
                </select>
                
                <QuickAction
                  variant="secondary"
                  size="sm"
                  icon={Download}
                  onClick={() => console.log('Export')}
                  aria-label="Exportar proyectos"
                />
                
                <QuickAction
                  variant="primary"
                  size="sm"
                  icon={Plus}
                  onClick={onCreateProject}
                >
                  Nuevo Proyecto
                </QuickAction>
              </div>
            </div>

            <div className="project-dashboard__projects">
              {recentProjects.length > 0 ? (
                recentProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                    className="project-dashboard__project-card"
                  >
                    <div className="project-dashboard__project-header">
                      <div className="project-dashboard__project-info">
                        <h3 className="project-dashboard__project-title">
                          {project.name || project.nombre}
                        </h3>
                        <p className="project-dashboard__project-description">
                          {project.description || project.descripcion || 'Sin descripción'}
                        </p>
                      </div>
                      
                      <div className="project-dashboard__project-actions">
                        <QuickAction
                          variant="ghost"
                          size="sm"
                          icon={MoreVertical}
                          aria-label="Más opciones"
                        />
                      </div>
                    </div>

                    <div className="project-dashboard__project-badges">
                      <Badge
                        variant={getStatusConfig(project.status).variant}
                        size="sm"
                      >
                        {getStatusConfig(project.status).label}
                      </Badge>
                      <Badge
                        variant={getPriorityConfig(project.priority).variant}
                        size="sm"
                      >
                        {getPriorityConfig(project.priority).label}
                      </Badge>
                    </div>

                    {project.progress !== undefined && (
                      <div className="project-dashboard__project-progress">
                        <Progress
                          value={project.progress}
                          variant="primary"
                          showLabel={true}
                          label="Progreso del proyecto"
                        />
                      </div>
                    )}

                    <div className="project-dashboard__project-footer">
                      <div className="project-dashboard__project-meta">
                        {project.deadline && (
                          <div className="project-dashboard__project-deadline">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(project.deadline).toLocaleDateString()}</span>
                          </div>
                        )}
                        {project.team_size && (
                          <div className="project-dashboard__project-team">
                            <Users className="w-4 h-4" />
                            <span>{project.team_size} miembros</span>
                          </div>
                        )}
                      </div>
                      
                      <div className="project-dashboard__project-buttons">
                        <QuickAction
                          variant="ghost"
                          size="sm"
                          icon={Eye}
                          onClick={() => onProjectSelect?.(project)}
                          aria-label="Ver proyecto"
                        />
                        <QuickAction
                          variant="ghost"
                          size="sm"
                          icon={Edit}
                          onClick={() => console.log('Edit', project)}
                          aria-label="Editar proyecto"
                        />
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <EmptyState
                  icon={FolderOpen}
                  title="No hay proyectos"
                  description="No se encontraron proyectos para mostrar. Crea tu primer proyecto para comenzar."
                  actionLabel="Crear Proyecto"
                  actionIcon={Plus}
                  onAction={onCreateProject}
                />
              )}
            </div>
          </motion.div>
        </div>

        {/* 🎯 Panel lateral */}
        <div className="project-dashboard__sidebar">
          <motion.div
            className="project-dashboard__section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            <h3 className="project-dashboard__section-title">
              Acciones Rápidas
            </h3>
            
            <div className="project-dashboard__quick-actions">
              <QuickAction
                variant="secondary"
                icon={Plus}
                onClick={onCreateProject}
                className="project-dashboard__quick-action"
              >
                Nuevo Proyecto
              </QuickAction>
              
              <QuickAction
                variant="secondary"
                icon={Users}
                onClick={() => console.log('Manage Teams')}
                className="project-dashboard__quick-action"
              >
                Gestionar Equipos
              </QuickAction>
              
              <QuickAction
                variant="secondary"
                icon={TrendingUp}
                onClick={() => console.log('View Reports')}
                className="project-dashboard__quick-action"
              >
                Ver Reportes
              </QuickAction>
              
              <QuickAction
                variant="secondary"
                icon={Filter}
                onClick={() => console.log('Advanced Filters')}
                className="project-dashboard__quick-action"
              >
                Filtros Avanzados
              </QuickAction>
            </div>
          </motion.div>

          <motion.div
            className="project-dashboard__section"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.5 }}
          >
            <h3 className="project-dashboard__section-title">
              Resumen de Actividad
            </h3>
            
            <div className="project-dashboard__activity">
              <div className="project-dashboard__activity-item">
                <div className="project-dashboard__activity-icon success">
                  <CheckCircle className="w-4 h-4" />
                </div>
                <div className="project-dashboard__activity-content">
                  <div className="project-dashboard__activity-title">
                    Proyecto completado
                  </div>
                  <div className="project-dashboard__activity-description">
                    Sistema E-commerce finalizado
                  </div>
                </div>
              </div>
              
              <div className="project-dashboard__activity-item">
                <div className="project-dashboard__activity-icon primary">
                  <FolderOpen className="w-4 h-4" />
                </div>
                <div className="project-dashboard__activity-content">
                  <div className="project-dashboard__activity-title">
                    Nueva tarea asignada
                  </div>
                  <div className="project-dashboard__activity-description">
                    Implementar autenticación
                  </div>
                </div>
              </div>
              
              <div className="project-dashboard__activity-item">
                <div className="project-dashboard__activity-icon warning">
                  <Clock className="w-4 h-4" />
                </div>
                <div className="project-dashboard__activity-content">
                  <div className="project-dashboard__activity-title">
                    Sprint iniciado
                  </div>
                  <div className="project-dashboard__activity-description">
                    Sprint 3 - Dashboard Analytics
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
