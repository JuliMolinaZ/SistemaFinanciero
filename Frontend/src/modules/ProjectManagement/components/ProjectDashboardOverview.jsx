// 📊 PROJECT DASHBOARD OVERVIEW - VISTA GENERAL DE MÉTRICAS
// ==========================================================

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  ArrowRight,
  Building,
  Users,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  Clock,
  Target,
  Calendar,
  Folder,
  Play,
  Pause,
  CheckCircle
} from 'lucide-react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, LineChart, Line } from 'recharts';
import './ProjectDashboardEnterprise.css';

// 🎯 KPI CARD COMPONENT (reutilizado)
const KPICard = ({ title, icon: Icon, value, delta, rightNote, ariaLabel }) => {
  const TrendIcon = ({ trend }) => {
    switch (trend) {
      case 'up': return <TrendingUp />;
      case 'down': return <TrendingDown />;
      default: return <Minus />;
    }
  };

  return (
    <div className="enterprise-kpi-card" aria-label={ariaLabel || title}>
      <div className="enterprise-kpi-header">
        <h3 className="enterprise-kpi-title">{title}</h3>
        {Icon && (
          <div className="enterprise-kpi-icon">
            <Icon />
          </div>
        )}
      </div>
      
      <div className="enterprise-kpi-value">
        {value}
      </div>
      
      <div className="enterprise-kpi-footer">
        {delta && (
          <div className={`enterprise-kpi-delta enterprise-kpi-delta--${delta.trend || 'flat'}`}>
            <TrendIcon trend={delta.trend} />
            <span className="tabular-nums">{delta.pct}</span>
          </div>
        )}
        {rightNote && (
          <div className="enterprise-kpi-note">{rightNote}</div>
        )}
      </div>
    </div>
  );
};

// 📊 WIDGET RESUMEN DE ACTIVIDAD
const ActivitySummaryWidget = ({ projects, tasks, sprints }) => {
  const activityData = useMemo(() => {
    const projectsActive = projects.filter(p => p.status === 'active').length;
    const tasksCompleted = tasks.filter(t => t.status === 'done').length;
    const sprintsActive = sprints.filter(s => s.status === 'active').length;
    
    return [
      { name: 'Proyectos Activos', value: projectsActive, color: 'var(--enterprise-primary)', icon: Folder },
      { name: 'Tareas Completadas', value: tasksCompleted, color: 'var(--enterprise-success)', icon: CheckCircle },
      { name: 'Sprints Activos', value: sprintsActive, color: 'var(--enterprise-warning)', icon: Play }
    ];
  }, [projects, tasks, sprints]);

  return (
    <div className="enterprise-widget">
      <div className="enterprise-widget-header">
        <BarChart3 className="enterprise-widget-icon" />
        <h3 className="enterprise-widget-title">Resumen de Actividad</h3>
      </div>
      <div className="enterprise-widget-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activityData.map((item) => {
            const IconComponent = item.icon;
            return (
              <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '2rem',
                  height: '2rem',
                  background: `${item.color}20`,
                  borderRadius: 'var(--enterprise-radius)',
                  color: item.color
                }}>
                  <IconComponent style={{ width: '1rem', height: '1rem' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.875rem', color: 'var(--enterprise-text-primary)', fontWeight: 500 }}>
                    {item.name}
                  </div>
                </div>
                <div style={{ 
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  color: 'var(--enterprise-text-primary)',
                  fontVariantNumeric: 'tabular-nums'
                }}>
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// 📈 WIDGET PROGRESO GENERAL
const ProgressOverviewWidget = ({ projects }) => {
  const progressData = useMemo(() => {
    const ranges = [
      { name: '0-25%', min: 0, max: 25, color: 'var(--enterprise-danger)' },
      { name: '26-50%', min: 26, max: 50, color: 'var(--enterprise-warning)' },
      { name: '51-75%', min: 51, max: 75, color: 'var(--enterprise-primary)' },
      { name: '76-100%', min: 76, max: 100, color: 'var(--enterprise-success)' }
    ];

    return ranges.map(range => ({
      ...range,
      value: projects.filter(p => {
        const progress = p.progress || 0;
        return progress >= range.min && progress <= range.max;
      }).length
    }));
  }, [projects]);

  const maxValue = Math.max(...progressData.map(d => d.value));

  return (
    <div className="enterprise-widget">
      <div className="enterprise-widget-header">
        <Target className="enterprise-widget-icon" />
        <h3 className="enterprise-widget-title">Progreso General</h3>
      </div>
      <div className="enterprise-widget-content">
        <div style={{ height: '180px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={progressData} margin={{ top: 5, right: 5, left: 5, bottom: 5 }}>
              <XAxis 
                dataKey="name" 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--enterprise-text-secondary)' }}
              />
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12, fill: 'var(--enterprise-text-secondary)' }}
                domain={[0, maxValue + 1]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--enterprise-surface)',
                  border: '1px solid var(--enterprise-border)',
                  borderRadius: '8px',
                  color: 'var(--enterprise-text-primary)'
                }}
              />
              <Bar 
                dataKey="value" 
                radius={[4, 4, 0, 0]}
                fill={(entry) => entry.color}
              >
                {progressData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

// 📋 WIDGET PROYECTOS RECIENTES
const RecentProjectsWidget = ({ projects, onProjectSelect }) => {
  const recentProjects = useMemo(() => {
    return projects
      .sort((a, b) => new Date(b.updated_at || b.created_at || Date.now()) - new Date(a.updated_at || a.created_at || Date.now()))
      .slice(0, 5);
  }, [projects]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return <CheckCircle style={{ color: 'var(--enterprise-success)' }} />;
      case 'active': return <Play style={{ color: 'var(--enterprise-primary)' }} />;
      case 'on_hold': return <Pause style={{ color: 'var(--enterprise-warning)' }} />;
      default: return <Clock style={{ color: 'var(--enterprise-text-secondary)' }} />;
    }
  };

  return (
    <div className="enterprise-widget">
      <div className="enterprise-widget-header">
        <Folder className="enterprise-widget-icon" />
        <h3 className="enterprise-widget-title">Proyectos Recientes</h3>
        <button 
          style={{ 
            marginLeft: 'auto',
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            background: 'none',
            border: 'none',
            color: 'var(--enterprise-primary)',
            fontSize: '0.875rem',
            cursor: 'pointer'
          }}
        >
          Ver todos <ArrowRight style={{ width: '0.875rem', height: '0.875rem' }} />
        </button>
      </div>
      <div className="enterprise-widget-content">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {recentProjects.map((project) => (
            <div 
              key={project.id} 
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'var(--enterprise-surface-2)',
                borderRadius: 'var(--enterprise-radius)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onClick={() => onProjectSelect(project)}
              onMouseEnter={(e) => e.target.style.background = 'var(--enterprise-surface-3)'}
              onMouseLeave={(e) => e.target.style.background = 'var(--enterprise-surface-2)'}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getStatusIcon(project.status)}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ 
                  fontSize: '0.875rem', 
                  fontWeight: 500, 
                  color: 'var(--enterprise-text-primary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {project.nombre}
                </div>
                <div style={{ 
                  fontSize: '0.75rem', 
                  color: 'var(--enterprise-text-secondary)',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
                }}>
                  {project.client?.name || project.clientName || 'Sin cliente'}
                </div>
              </div>
              <div style={{ 
                fontSize: '0.875rem', 
                fontWeight: 600, 
                color: 'var(--enterprise-text-primary)',
                fontVariantNumeric: 'tabular-nums'
              }}>
                {project.progress || 0}%
              </div>
            </div>
          ))}
          {recentProjects.length === 0 && (
            <div style={{ 
              textAlign: 'center', 
              color: 'var(--enterprise-text-secondary)', 
              fontSize: '0.875rem', 
              padding: '2rem 0' 
            }}>
              No hay proyectos recientes
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 🏗️ COMPONENTE PRINCIPAL - DASHBOARD OVERVIEW
const ProjectDashboardOverview = ({
  projects = [],
  tasks = [],
  sprints = [],
  onProjectSelect,
  loading = false
}) => {
  // 📊 KPIs calculados
  const kpis = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const taskCompletionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
    
    const activeSprints = sprints.filter(s => s.status === 'active').length;
    
    const averageProgress = totalProjects > 0 ? 
      Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects) : 0;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      taskCompletionRate,
      activeSprints,
      averageProgress
    };
  }, [projects, tasks, sprints]);

  if (loading) {
    return (
      <div className="enterprise-dashboard">
        <div className="enterprise-loading">
          <div className="enterprise-hero">
            <div style={{ height: '2rem', width: '33%', background: 'var(--enterprise-surface-2)', borderRadius: 'var(--enterprise-radius)', marginBottom: '0.5rem' }} />
            <div style={{ height: '1rem', width: '50%', background: 'var(--enterprise-surface-2)', borderRadius: 'var(--enterprise-radius)' }} />
          </div>
          <div className="enterprise-loading-grid">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="enterprise-skeleton" />
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {[1, 2].map(i => (
              <div key={i} style={{ height: '20rem', background: 'var(--enterprise-surface-2)', borderRadius: 'var(--enterprise-radius-2xl)' }} />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-dashboard">
      {/* 🎯 Hero compacto */}
      <div className="enterprise-hero">
        <h1>Dashboard General</h1>
        <p>Vista general de métricas y actividad del proyecto</p>
      </div>

      {/* 📊 KPI Cards - Fila 1 */}
      <div className="enterprise-kpi-grid">
        <KPICard
          title="Proyectos Totales"
          icon={Target}
          value={kpis.totalProjects}
          delta={{ trend: 'up', pct: '12%' }}
          rightNote={`${kpis.activeProjects} activos`}
          ariaLabel={`Proyectos totales: ${kpis.totalProjects}, con ${kpis.activeProjects} activos`}
        />
        <KPICard
          title="Tasa de Tareas"
          icon={CheckCircle2}
          value={`${kpis.taskCompletionRate}%`}
          delta={{ trend: kpis.taskCompletionRate >= 70 ? 'up' : 'down', pct: '8%' }}
          rightNote="Completadas"
          ariaLabel={`Tasa de tareas completadas: ${kpis.taskCompletionRate}%`}
        />
        <KPICard
          title="Sprints Activos"
          icon={Clock}
          value={kpis.activeSprints}
          delta={{ trend: 'flat', pct: '0%' }}
          rightNote="En desarrollo"
          ariaLabel={`Sprints activos: ${kpis.activeSprints}`}
        />
        <KPICard
          title="Progreso Promedio"
          icon={BarChart3}
          value={`${kpis.averageProgress}%`}
          delta={{ trend: kpis.averageProgress >= 70 ? 'up' : 'down', pct: '5%' }}
          rightNote="General"
          ariaLabel={`Progreso promedio: ${kpis.averageProgress}%`}
        />
      </div>

      {/* 📈 Widgets principales - Fila 2 */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: '1fr 1fr', 
        gap: '1.5rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateRows: '1fr 1fr', 
          gap: '1.5rem' 
        }}>
          <ActivitySummaryWidget projects={projects} tasks={tasks} sprints={sprints} />
          <ProgressOverviewWidget projects={projects} />
        </div>
        <RecentProjectsWidget projects={projects} onProjectSelect={onProjectSelect} />
      </div>

      {/* 📋 Sección de acceso rápido */}
      <div className="enterprise-widget">
        <div className="enterprise-widget-header">
          <ArrowRight className="enterprise-widget-icon" />
          <h3 className="enterprise-widget-title">Acceso Rápido</h3>
        </div>
        <div className="enterprise-widget-content">
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '1rem' 
          }}>
            <button className="enterprise-button" style={{ justifyContent: 'center', padding: '1rem' }}>
              <Folder />
              Ver Todos los Proyectos
            </button>
            <button className="enterprise-button" style={{ justifyContent: 'center', padding: '1rem' }}>
              <CheckCircle2 />
              Gestionar Tareas
            </button>
            <button className="enterprise-button" style={{ justifyContent: 'center', padding: '1rem' }}>
              <Play />
              Sprints Activos
            </button>
            <button className="enterprise-button" style={{ justifyContent: 'center', padding: '1rem' }}>
              <BarChart3 />
              Reportes y Analytics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardOverview;
