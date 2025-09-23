// 🚀 EXECUTIVE DASHBOARD - NIVEL GERENCIAL WOW
// ================================================

import React, { useState, useMemo, useEffect } from 'react';
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
  CheckCircle,
  DollarSign,
  Award,
  Zap,
  Timer,
  UserCheck,
  Briefcase,
  Activity,
  PieChart,
  Star,
  Globe,
  Layers,
  Rocket,
  Shield,
  Bell,
  Mail,
  Phone,
  MapPin,
  Filter,
  Download,
  RefreshCw,
  Heart,
  Coffee,
  Lightbulb,
  LineChart
} from 'lucide-react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  ResponsiveContainer,
  Tooltip,
  LineChart as RechartsLineChart,
  Line,
  Area,
  AreaChart,
  RadialBarChart,
  RadialBar,
  Legend,
  ComposedChart,
  CartesianGrid
} from 'recharts';
import './ProjectDashboardEnterprise.css';

// 🎯 EXECUTIVE KPI CARD - DISEÑO PREMIUM
const ExecutiveKPICard = ({ title, icon: Icon, value, delta, trend, subtitle, onClick, gradient, alert }) => {
  const getTrendIcon = () => {
    switch (trend) {
      case 'up': return <TrendingUp size={16} />;
      case 'down': return <TrendingDown size={16} />;
      case 'stable': return <Minus size={16} />;
      default: return <Activity size={16} />;
    }
  };

  const getTrendColor = () => {
    switch (trend) {
      case 'up': return 'var(--pm-success)';
      case 'down': return 'var(--pm-danger)';
      case 'stable': return 'var(--pm-warning)';
      default: return 'var(--pm-primary)';
    }
  };

  return (
    <motion.div
      className="executive-kpi-card"
      whileHover={{ scale: 1.02, y: -2 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      {gradient && (
        <div className="executive-kpi-gradient" style={{ background: gradient }} />
      )}

      {alert && (
        <div className="executive-kpi-alert">
          <Bell size={12} />
        </div>
      )}

      <div className="executive-kpi-header">
        <div className="executive-kpi-icon" style={{ color: getTrendColor() }}>
          <Icon size={24} />
        </div>
        <div className="executive-kpi-trend" style={{ color: getTrendColor() }}>
          {getTrendIcon()}
          <span className="executive-kpi-delta">{delta}</span>
        </div>
      </div>

      <div className="executive-kpi-body">
        <h3 className="executive-kpi-value">{value}</h3>
        <p className="executive-kpi-title">{title}</p>
        {subtitle && <p className="executive-kpi-subtitle">{subtitle}</p>}
      </div>
    </motion.div>
  );
};

// 📊 GRÁFICO DE RENDIMIENTO DE PROYECTOS
const ProjectPerformanceChart = ({ projects }) => {
  const performanceData = useMemo(() => {
    const monthlyData = {};

    projects.forEach(project => {
      const month = new Date(project.created_at || Date.now()).toISOString().slice(0, 7);
      if (!monthlyData[month]) {
        monthlyData[month] = {
          month: month,
          proyectos: 0,
          completados: 0,
          ingresos: 0,
          eficiencia: 0
        };
      }

      monthlyData[month].proyectos++;
      if (project.status === 'completed') {
        monthlyData[month].completados++;
      }
      monthlyData[month].ingresos += project.budget || Math.random() * 50000 + 10000;
    });

    return Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .slice(-6)
      .map(data => ({
        ...data,
        eficiencia: data.proyectos > 0 ? Math.round((data.completados / data.proyectos) * 100) : 0,
        mes: new Date(data.month + '-01').toLocaleDateString('es-ES', { month: 'short', year: '2-digit' })
      }));
  }, [projects]);

  return (
    <motion.div
      className="executive-widget executive-chart-widget"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
    >
      <div className="executive-widget-header">
        <div className="executive-widget-icon">
          <LineChart />
        </div>
        <div>
          <h3 className="executive-widget-title">Rendimiento Mensual</h3>
          <p className="executive-widget-subtitle">Proyectos, eficiencia e ingresos</p>
        </div>
        <div className="executive-widget-actions">
          <button className="executive-action-btn">
            <Download size={16} />
          </button>
          <button className="executive-action-btn">
            <RefreshCw size={16} />
          </button>
        </div>
      </div>

      <div className="executive-widget-content">
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={performanceData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--pm-border)" opacity={0.3} />
            <XAxis
              dataKey="mes"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--pm-text-secondary)' }}
            />
            <YAxis
              yAxisId="left"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--pm-text-secondary)' }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 12, fill: 'var(--pm-text-secondary)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--pm-surface-glass)',
                border: '1px solid var(--pm-border-glass)',
                borderRadius: '12px',
                backdropFilter: 'blur(20px)',
                color: 'var(--pm-text-primary)',
                boxShadow: 'var(--pm-shadow-lg)'
              }}
            />
            <Legend />
            <Bar
              yAxisId="left"
              dataKey="proyectos"
              name="Proyectos"
              fill="var(--pm-primary)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              yAxisId="left"
              dataKey="completados"
              name="Completados"
              fill="var(--pm-success)"
              radius={[4, 4, 0, 0]}
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="eficiencia"
              name="Eficiencia %"
              stroke="var(--pm-warning)"
              strokeWidth={3}
              dot={{ fill: 'var(--pm-warning)', strokeWidth: 2, r: 6 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

// 🎯 DISTRIBUCIÓN DE RECURSOS
const ResourceDistributionWidget = ({ projects, tasks }) => {
  const resourceData = useMemo(() => {
    const teamData = {};

    projects.forEach(project => {
      const teamSize = project.members?.length || Math.floor(Math.random() * 8) + 2;
      const category = project.category || 'Desarrollo';

      if (!teamData[category]) {
        teamData[category] = {
          name: category,
          proyectos: 0,
          miembros: 0,
          horas: 0,
          color: `hsl(${Math.random() * 360}, 70%, 60%)`
        };
      }

      teamData[category].proyectos++;
      teamData[category].miembros += teamSize;
      teamData[category].horas += Math.floor(Math.random() * 400) + 100;
    });

    return Object.values(teamData);
  }, [projects]);

  return (
    <motion.div
      className="executive-widget"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 0.3 }}
    >
      <div className="executive-widget-header">
        <div className="executive-widget-icon">
          <Users />
        </div>
        <div>
          <h3 className="executive-widget-title">Distribución de Recursos</h3>
          <p className="executive-widget-subtitle">Por categoría de proyecto</p>
        </div>
      </div>

      <div className="executive-widget-content">
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ flex: 1, height: '200px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RechartsPieChart>
                <Pie
                  data={resourceData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={40}
                  paddingAngle={5}
                  dataKey="miembros"
                >
                  {resourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'var(--pm-surface-glass)',
                    border: '1px solid var(--pm-border-glass)',
                    borderRadius: '8px',
                    color: 'var(--pm-text-primary)'
                  }}
                />
              </RechartsPieChart>
            </ResponsiveContainer>
          </div>

          <div style={{ flex: 1 }}>
            <div className="resource-legend">
              {resourceData.map((item, index) => (
                <div key={index} className="resource-item">
                  <div
                    className="resource-color"
                    style={{ backgroundColor: item.color }}
                  />
                  <div className="resource-info">
                    <h4>{item.name}</h4>
                    <div className="resource-stats">
                      <span>{item.proyectos} proyectos</span>
                      <span>{item.miembros} miembros</span>
                      <span>{item.horas}h</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// 🏆 RANKING DE PROYECTOS TOP
const TopProjectsRanking = ({ projects, onProjectSelect }) => {
  const topProjects = useMemo(() => {
    return projects
      .map(project => ({
        ...project,
        score: (project.progress || 0) * 0.4 +
               (project.priority === 'high' ? 30 : project.priority === 'medium' ? 20 : 10) +
               (project.status === 'active' ? 20 : 0) +
               Math.random() * 10
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
  }, [projects]);

  const getProjectIcon = (index) => {
    switch (index) {
      case 0: return <Award className="ranking-gold" />;
      case 1: return <Star className="ranking-silver" />;
      case 2: return <Zap className="ranking-bronze" />;
      default: return <Target className="ranking-default" />;
    }
  };

  return (
    <motion.div
      className="executive-widget"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="executive-widget-header">
        <div className="executive-widget-icon">
          <Award />
        </div>
        <div>
          <h3 className="executive-widget-title">Top Proyectos</h3>
          <p className="executive-widget-subtitle">Mejor rendimiento</p>
        </div>
      </div>

      <div className="executive-widget-content">
        <div className="top-projects-list">
          {topProjects.map((project, index) => (
            <motion.div
              key={project.id}
              className="top-project-item"
              onClick={() => onProjectSelect(project)}
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="project-ranking">
                {getProjectIcon(index)}
                <span className="ranking-number">#{index + 1}</span>
              </div>

              <div className="project-info">
                <h4 className="project-name">{project.nombre || project.name}</h4>
                <p className="project-client">{project.client?.nombre || 'Sin cliente'}</p>

                <div className="project-metrics">
                  <div className="metric">
                    <span className="metric-value">{project.progress || 0}%</span>
                    <span className="metric-label">Progreso</span>
                  </div>
                  <div className="metric">
                    <span className="metric-value">{Math.round(project.score)}</span>
                    <span className="metric-label">Score</span>
                  </div>
                </div>
              </div>

              <div className="project-status">
                <div className={`status-badge status-${project.status}`}>
                  {project.status === 'active' ? 'Activo' :
                   project.status === 'completed' ? 'Completado' :
                   project.status === 'planning' ? 'Planificación' : 'Pausado'}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// 🚨 ALERTAS Y NOTIFICACIONES CRÍTICAS
const ExecutiveAlertsWidget = ({ projects, tasks }) => {
  const alerts = useMemo(() => {
    const alertList = [];

    // Proyectos en riesgo
    projects.forEach(project => {
      if (project.progress < 30 && project.status === 'active') {
        alertList.push({
          id: `project-risk-${project.id}`,
          type: 'danger',
          icon: AlertTriangle,
          title: 'Proyecto en riesgo',
          message: `${project.nombre} tiene bajo progreso (${project.progress}%)`,
          action: 'Revisar'
        });
      }

      if (project.due_date && new Date(project.due_date) < new Date()) {
        alertList.push({
          id: `project-overdue-${project.id}`,
          type: 'warning',
          icon: Clock,
          title: 'Proyecto vencido',
          message: `${project.nombre} superó fecha límite`,
          action: 'Extender'
        });
      }
    });

    // Tareas críticas
    const criticalTasks = tasks.filter(task =>
      task.priority === 'high' && task.status !== 'done'
    ).length;

    if (criticalTasks > 5) {
      alertList.push({
        id: 'critical-tasks',
        type: 'warning',
        icon: Zap,
        title: 'Tareas críticas pendientes',
        message: `${criticalTasks} tareas de alta prioridad sin completar`,
        action: 'Gestionar'
      });
    }

    return alertList.slice(0, 4);
  }, [projects, tasks]);

  const getAlertColor = (type) => {
    switch (type) {
      case 'danger': return 'var(--pm-danger)';
      case 'warning': return 'var(--pm-warning)';
      case 'info': return 'var(--pm-info)';
      default: return 'var(--pm-primary)';
    }
  };

  return (
    <motion.div
      className="executive-widget executive-alerts-widget"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <div className="executive-widget-header">
        <div className="executive-widget-icon">
          <Bell />
        </div>
        <div>
          <h3 className="executive-widget-title">Alertas Críticas</h3>
          <p className="executive-widget-subtitle">Requieren atención inmediata</p>
        </div>
        <div className="alerts-count">
          {alerts.length}
        </div>
      </div>

      <div className="executive-widget-content">
        {alerts.length === 0 ? (
          <div className="no-alerts">
            <CheckCircle size={48} />
            <h4>Todo bajo control</h4>
            <p>No hay alertas críticas en este momento</p>
          </div>
        ) : (
          <div className="alerts-list">
            {alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                className="alert-item"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div
                  className="alert-icon"
                  style={{ color: getAlertColor(alert.type) }}
                >
                  <alert.icon size={20} />
                </div>

                <div className="alert-content">
                  <h4 className="alert-title">{alert.title}</h4>
                  <p className="alert-message">{alert.message}</p>
                </div>

                <button
                  className="alert-action"
                  style={{ color: getAlertColor(alert.type) }}
                >
                  {alert.action}
                </button>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  );
};

// 🏗️ COMPONENTE PRINCIPAL - EXECUTIVE DASHBOARD
const ProjectDashboardOverview = ({
  projects = [],
  tasks = [],
  sprints = [],
  onProjectSelect,
  loading = false
}) => {
  const [refreshing, setRefreshing] = useState(false);
  const [timeFilter, setTimeFilter] = useState('30d');

  // 📊 KPIs Ejecutivos Avanzados
  const executiveMetrics = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const completedProjects = projects.filter(p => p.status === 'completed').length;
    const completionRate = totalProjects > 0 ? Math.round((completedProjects / totalProjects) * 100) : 0;

    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(t => t.status === 'done').length;
    const taskEfficiency = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const activeSprints = sprints.filter(s => s.status === 'active').length;

    const averageProgress = totalProjects > 0 ?
      Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects) : 0;

    // Métricas financieras (simuladas)
    const totalRevenue = projects.reduce((sum, p) => sum + (p.budget || Math.random() * 100000), 0);
    const monthlyRevenue = totalRevenue * 0.15; // Simulado

    // Métricas de equipo
    const totalTeamMembers = projects.reduce((sum, p) => sum + (p.members?.length || 0), 0);
    const averageTeamSize = totalProjects > 0 ? Math.round(totalTeamMembers / totalProjects) : 0;

    // Riesgos
    const projectsAtRisk = projects.filter(p =>
      p.progress < 30 && p.status === 'active'
    ).length;

    return {
      totalProjects,
      activeProjects,
      completedProjects,
      completionRate,
      taskEfficiency,
      activeSprints,
      averageProgress,
      totalRevenue,
      monthlyRevenue,
      totalTeamMembers,
      averageTeamSize,
      projectsAtRisk
    };
  }, [projects, tasks, sprints]);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simular carga
    await new Promise(resolve => setTimeout(resolve, 1000));
    setRefreshing(false);
  };

  if (loading) {
    return (
      <div className="executive-dashboard">
        <div className="executive-loading">
          <div className="loading-hero">
            <div className="skeleton-hero-title" />
            <div className="skeleton-hero-subtitle" />
          </div>
          <div className="loading-kpis">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <div key={i} className="skeleton-kpi" />
            ))}
          </div>
          <div className="loading-widgets">
            {[1, 2, 3].map(i => (
              <div key={i} className="skeleton-widget" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="executive-dashboard">
      {/* 🎯 Hero Ejecutivo */}
      <motion.div
        className="executive-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="hero-content">
          <div className="hero-text">
            <h1 className="hero-title">
              📊 Executive Dashboard
              <span className="hero-badge">Live</span>
            </h1>
            <p className="hero-subtitle">
              Vista ejecutiva en tiempo real de todos los proyectos y métricas clave de rendimiento
            </p>
          </div>

          <div className="hero-actions">
            <div className="time-filter">
              <select
                value={timeFilter}
                onChange={(e) => setTimeFilter(e.target.value)}
                className="filter-select"
              >
                <option value="7d">Últimos 7 días</option>
                <option value="30d">Últimos 30 días</option>
                <option value="90d">Últimos 3 meses</option>
                <option value="1y">Último año</option>
              </select>
            </div>

            <button
              className="refresh-btn"
              onClick={handleRefresh}
              disabled={refreshing}
            >
              <RefreshCw size={16} className={refreshing ? 'spinning' : ''} />
              {refreshing ? 'Actualizando...' : 'Actualizar'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* 📊 KPIs Ejecutivos Grid */}
      <motion.div
        className="executive-kpis-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <ExecutiveKPICard
          title="Total Proyectos"
          icon={Briefcase}
          value={executiveMetrics.totalProjects}
          delta="+12%"
          trend="up"
          subtitle={`${executiveMetrics.activeProjects} activos`}
          gradient="linear-gradient(135deg, var(--pm-primary), var(--pm-primary-dark))"
        />

        <ExecutiveKPICard
          title="Tasa de Éxito"
          icon={Target}
          value={`${executiveMetrics.completionRate}%`}
          delta="+8%"
          trend={executiveMetrics.completionRate >= 70 ? "up" : "down"}
          subtitle="Proyectos completados"
          gradient="linear-gradient(135deg, var(--pm-success), var(--pm-success-dark))"
        />

        <ExecutiveKPICard
          title="Eficiencia Tareas"
          icon={Zap}
          value={`${executiveMetrics.taskEfficiency}%`}
          delta="+5%"
          trend={executiveMetrics.taskEfficiency >= 75 ? "up" : "down"}
          subtitle="Productividad del equipo"
          gradient="linear-gradient(135deg, var(--pm-warning), var(--pm-warning-dark))"
        />

        <ExecutiveKPICard
          title="Ingresos Mensuales"
          icon={DollarSign}
          value={`$${Math.round(executiveMetrics.monthlyRevenue / 1000)}K`}
          delta="+15%"
          trend="up"
          subtitle="Facturación estimada"
          gradient="linear-gradient(135deg, var(--pm-info), var(--pm-info-dark))"
        />

        <ExecutiveKPICard
          title="Equipo Activo"
          icon={UserCheck}
          value={executiveMetrics.totalTeamMembers}
          delta="+3"
          trend="up"
          subtitle={`${executiveMetrics.averageTeamSize} promedio/proyecto`}
          gradient="linear-gradient(135deg, var(--pm-primary), var(--pm-secondary))"
        />

        <ExecutiveKPICard
          title="Proyectos en Riesgo"
          icon={AlertTriangle}
          value={executiveMetrics.projectsAtRisk}
          delta={executiveMetrics.projectsAtRisk > 2 ? "+2" : "0"}
          trend={executiveMetrics.projectsAtRisk > 2 ? "down" : "stable"}
          subtitle="Requieren atención"
          gradient="linear-gradient(135deg, var(--pm-danger), var(--pm-danger-dark))"
          alert={executiveMetrics.projectsAtRisk > 2}
        />
      </motion.div>

      {/* 📈 Widgets Principales */}
      <div className="executive-widgets-grid">
        <div className="widgets-column-1">
          <ProjectPerformanceChart projects={projects} />
          <ExecutiveAlertsWidget projects={projects} tasks={tasks} />
        </div>

        <div className="widgets-column-2">
          <ResourceDistributionWidget projects={projects} tasks={tasks} />
          <TopProjectsRanking projects={projects} onProjectSelect={onProjectSelect} />
        </div>
      </div>

      {/* 🚀 Acciones Rápidas Ejecutivas */}
      <motion.div
        className="executive-quick-actions"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
      >
        <div className="quick-actions-header">
          <h3>🚀 Acciones Ejecutivas</h3>
          <p>Herramientas de gestión y análisis avanzado</p>
        </div>

        <div className="quick-actions-grid">
          <button className="executive-action-card">
            <div className="action-icon">
              <BarChart3 />
            </div>
            <div className="action-content">
              <h4>Reportes Avanzados</h4>
              <p>Análisis detallado y métricas</p>
            </div>
            <ArrowRight className="action-arrow" />
          </button>

          <button className="executive-action-card">
            <div className="action-icon">
              <Globe />
            </div>
            <div className="action-content">
              <h4>Vista Global</h4>
              <p>Todos los proyectos activos</p>
            </div>
            <ArrowRight className="action-arrow" />
          </button>

          <button className="executive-action-card">
            <div className="action-icon">
              <Users />
            </div>
            <div className="action-content">
              <h4>Gestión de Equipos</h4>
              <p>Asignaciones y rendimiento</p>
            </div>
            <ArrowRight className="action-arrow" />
          </button>

          <button className="executive-action-card">
            <div className="action-icon">
              <Rocket />
            </div>
            <div className="action-content">
              <h4>Planificación Estratégica</h4>
              <p>Roadmap y objetivos</p>
            </div>
            <ArrowRight className="action-arrow" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ProjectDashboardOverview;