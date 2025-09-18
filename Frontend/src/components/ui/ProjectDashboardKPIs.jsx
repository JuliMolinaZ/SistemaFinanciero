// 📊 PROJECT DASHBOARD KPIs - MÉTRICAS SUPERIORES
// ===============================================

import React, { useMemo } from 'react';
import { 
  TrendingUp, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  BarChart3,
  Calendar,
  Target,
  Users
} from 'lucide-react';
import { motion } from 'framer-motion';
import './project-dashboard-kpis.css';

// 📊 KPI CARD COMPONENT
const KPICard = ({ 
  title, 
  value, 
  subtitle, 
  icon: Icon, 
  trend, 
  color = 'primary',
  className = '',
  ...props 
}) => (
  <motion.div
    className={`kpi-card kpi-card--${color} ${className}`}
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    {...props}
  >
    <div className="kpi-card-header">
      <div className="kpi-card-icon">
        <Icon className="kpi-icon" />
      </div>
      {trend && (
        <div className={`kpi-trend kpi-trend--${trend.direction}`}>
          <TrendingUp className="kpi-trend-icon" />
          <span className="kpi-trend-value">{trend.value}</span>
        </div>
      )}
    </div>
    
    <div className="kpi-card-content">
      <div className="kpi-value">{value}</div>
      <div className="kpi-title">{title}</div>
      {subtitle && <div className="kpi-subtitle">{subtitle}</div>}
    </div>
  </motion.div>
);

// 📈 MINI DONUT CHART COMPONENT
const MiniDonutChart = ({ data, size = 60, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  
  let accumulatedPercentage = 0;
  
  return (
    <div className="mini-donut-chart" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="mini-donut-svg">
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--kpi-surface-3)"
          strokeWidth={strokeWidth}
        />
        
        {/* Data segments */}
        {data.map((segment, index) => {
          const percentage = segment.value / data.reduce((sum, item) => sum + item.value, 0);
          const strokeDasharray = `${percentage * circumference} ${circumference}`;
          const strokeDashoffset = -accumulatedPercentage * circumference;
          
          accumulatedPercentage += percentage;
          
          return (
            <circle
              key={index}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={segment.color}
              strokeWidth={strokeWidth}
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="mini-donut-segment"
              style={{ 
                transform: 'rotate(-90deg)',
                transformOrigin: `${size / 2}px ${size / 2}px`
              }}
            />
          );
        })}
      </svg>
      
      {/* Center text */}
      <div className="mini-donut-center">
        <span className="mini-donut-total">
          {data.reduce((sum, item) => sum + item.value, 0)}
        </span>
      </div>
    </div>
  );
};

// 📊 MAIN DASHBOARD COMPONENT
const ProjectDashboardKPIs = ({ projects = [], groups = [] }) => {
  // 📈 CALCULATE KPIs
  const kpis = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const averageProgress = totalProjects > 0 ? 
      Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects) : 0;
    
    // Priority distribution
    const priorityDistribution = {
      high: projects.filter(p => p.priority === 'high' || p.priority === 'urgent').length,
      medium: projects.filter(p => p.priority === 'medium').length,
      low: projects.filter(p => p.priority === 'low').length
    };

    // Projects at risk (low progress with near end date)
    const now = new Date();
    const atRiskProjects = projects.filter(p => {
      if (!p.end_date || p.status === 'completed') return false;
      const endDate = new Date(p.end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      const expectedProgress = Math.max(0, Math.min(100, 100 - (daysRemaining / 365) * 100));
      return daysRemaining > 0 && daysRemaining < 30 && (p.progress || 0) < expectedProgress;
    }).length;

    // Upcoming deadlines (next 7 days)
    const upcomingDeadlines = projects.filter(p => {
      if (!p.end_date || p.status === 'completed') return false;
      const endDate = new Date(p.end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysRemaining >= 0 && daysRemaining <= 7;
    }).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      averageProgress,
      priorityDistribution,
      atRiskProjects,
      upcomingDeadlines,
      clientCount: groups.length
    };
  }, [projects, groups]);

  // 📊 PRIORITY CHART DATA
  const priorityChartData = [
    { label: 'Alta', value: kpis.priorityDistribution.high, color: 'var(--kpi-danger)' },
    { label: 'Media', value: kpis.priorityDistribution.medium, color: 'var(--kpi-warning)' },
    { label: 'Baja', value: kpis.priorityDistribution.low, color: 'var(--kpi-success)' }
  ].filter(item => item.value > 0);

  return (
    <div className="kpi-dashboard">
      {/* 📊 MAIN KPIs ROW */}
      <div className="kpi-grid">
        <KPICard
          title="Proyectos Activos"
          value={kpis.activeProjects}
          subtitle={`de ${kpis.totalProjects} totales`}
          icon={Target}
          color="primary"
          trend={{ direction: 'up', value: '+12%' }}
        />
        
        <KPICard
          title="Progreso Promedio"
          value={`${kpis.averageProgress}%`}
          subtitle="En todos los proyectos"
          icon={BarChart3}
          color="success"
          trend={{ direction: 'up', value: '+5%' }}
        />
        
        <KPICard
          title="Próximos Vencimientos"
          value={kpis.upcomingDeadlines}
          subtitle="En los próximos 7 días"
          icon={Calendar}
          color={kpis.upcomingDeadlines > 0 ? 'warning' : 'neutral'}
        />
        
        <KPICard
          title="En Riesgo"
          value={kpis.atRiskProjects}
          subtitle="Progreso bajo vs fecha"
          icon={AlertTriangle}
          color={kpis.atRiskProjects > 0 ? 'danger' : 'success'}
        />
      </div>

      {/* 📈 SECONDARY KPIs ROW */}
      <div className="kpi-secondary-grid">
        <div className="kpi-secondary-card">
          <div className="kpi-secondary-header">
            <Users className="kpi-secondary-icon" />
            <span className="kpi-secondary-title">Distribución por Cliente</span>
          </div>
          <div className="kpi-secondary-content">
            <div className="kpi-client-list">
              {groups.slice(0, 3).map((group) => (
                <div key={group.clientId || 'no-client'} className="kpi-client-item">
                  <span className="kpi-client-name">{group.clientName}</span>
                  <span className="kpi-client-count">{group.count}</span>
                </div>
              ))}
              {groups.length > 3 && (
                <div className="kpi-client-item kpi-client-more">
                  <span className="kpi-client-name">+{groups.length - 3} más</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="kpi-secondary-card">
          <div className="kpi-secondary-header">
            <CheckCircle className="kpi-secondary-icon" />
            <span className="kpi-secondary-title">Por Prioridad</span>
          </div>
          <div className="kpi-secondary-content">
            <div className="kpi-priority-chart">
              <MiniDonutChart data={priorityChartData} size={50} strokeWidth={4} />
              <div className="kpi-priority-legend">
                {priorityChartData.map((item) => (
                  <div key={item.label} className="kpi-priority-item">
                    <div 
                      className="kpi-priority-dot" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="kpi-priority-label">{item.label}</span>
                    <span className="kpi-priority-value">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="kpi-secondary-card">
          <div className="kpi-secondary-header">
            <Clock className="kpi-secondary-icon" />
            <span className="kpi-secondary-title">Estado General</span>
          </div>
          <div className="kpi-secondary-content">
            <div className="kpi-status-bars">
              <div className="kpi-status-bar">
                <span className="kpi-status-label">Completados</span>
                <div className="kpi-status-track">
                  <div 
                    className="kpi-status-fill kpi-status-fill--success"
                    style={{ 
                      width: `${kpis.totalProjects > 0 ? (kpis.completedProjects / kpis.totalProjects) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="kpi-status-value">{kpis.completedProjects}</span>
              </div>
              
              <div className="kpi-status-bar">
                <span className="kpi-status-label">Activos</span>
                <div className="kpi-status-track">
                  <div 
                    className="kpi-status-fill kpi-status-fill--primary"
                    style={{ 
                      width: `${kpis.totalProjects > 0 ? (kpis.activeProjects / kpis.totalProjects) * 100 : 0}%` 
                    }}
                  />
                </div>
                <span className="kpi-status-value">{kpis.activeProjects}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboardKPIs;
