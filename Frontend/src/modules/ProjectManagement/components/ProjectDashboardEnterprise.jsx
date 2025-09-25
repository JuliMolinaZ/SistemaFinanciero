// 📊 PROJECT DASHBOARD ENTERPRISE - DISEÑO COMPLETO WCAG AA
// ============================================================

import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Eye,
  Search,
  Filter,
  Download,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Building,
  Users,
  Settings,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  BarChart3,
  CheckCircle2,
  Clock,
  Target,
  Calendar
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './ProjectDashboardEnterprise.css';

// 🎯 KPI CARD COMPONENT
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

// 🔍 TOOLBAR INTEGRADO
const SearchToolbar = ({ 
  searchValue, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onClearFilters,
  onExport 
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  
  return (
    <div className="enterprise-toolbar">
      <div className="enterprise-toolbar-grid">
        {/* Search Input */}
        <div className="enterprise-search">
          <Search className="enterprise-search-icon" />
          <input
            type="text"
            placeholder="Buscar cliente, proyecto o estado..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="enterprise-search-input"
          />
          {searchValue && (
            <button
              onClick={() => onSearchChange('')}
              className="enterprise-search-clear"
            >
              <X />
            </button>
          )}
        </div>

        {/* Filters Button */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className="enterprise-button"
          >
            <Filter />
            Filtros
            {Object.values(filters).some(v => v) && (
              <div style={{
                width: '0.5rem',
                height: '0.5rem',
                background: 'var(--enterprise-warning)',
                borderRadius: '50%'
              }} />
            )}
          </button>
          
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  marginTop: '0.5rem',
                  width: '20rem',
                  padding: '1rem',
                  background: 'var(--enterprise-surface)',
                  border: '1px solid var(--enterprise-border)',
                  borderRadius: 'var(--enterprise-radius-lg)',
                  boxShadow: 'var(--enterprise-shadow-lg)',
                  zIndex: 10
                }}
              >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: 'var(--enterprise-text-secondary)', 
                      marginBottom: '0.5rem' 
                    }}>
                      Estado
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'var(--enterprise-surface-2)',
                        border: '1px solid var(--enterprise-border)',
                        borderRadius: 'var(--enterprise-radius)',
                        fontSize: '0.875rem',
                        color: 'var(--enterprise-text-primary)'
                      }}
                    >
                      <option value="">Todos</option>
                      <option value="active">Activo</option>
                      <option value="planning">Planificación</option>
                      <option value="completed">Completado</option>
                      <option value="on_hold">En Pausa</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ 
                      display: 'block', 
                      fontSize: '0.75rem', 
                      fontWeight: 600, 
                      color: 'var(--enterprise-text-secondary)', 
                      marginBottom: '0.5rem' 
                    }}>
                      Prioridad
                    </label>
                    <select
                      value={filters.priority || ''}
                      onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '0.5rem',
                        background: 'var(--enterprise-surface-2)',
                        border: '1px solid var(--enterprise-border)',
                        borderRadius: 'var(--enterprise-radius)',
                        fontSize: '0.875rem',
                        color: 'var(--enterprise-text-primary)'
                      }}
                    >
                      <option value="">Todas</option>
                      <option value="high">Alta</option>
                      <option value="medium">Media</option>
                      <option value="low">Baja</option>
                      <option value="urgent">Urgente</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                  <button
                    onClick={onClearFilters}
                    className="enterprise-button enterprise-button--ghost"
                  >
                    Limpiar
                  </button>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      fontSize: '0.875rem',
                      background: 'var(--enterprise-primary)',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--enterprise-radius)',
                      cursor: 'pointer'
                    }}
                  >
                    Aplicar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Export Button */}
        <button onClick={onExport} className="enterprise-button enterprise-button--ghost">
          <Download />
          Descargar
        </button>

        {/* Clear Button */}
        <button onClick={onClearFilters} className="enterprise-button enterprise-button--ghost">
          <X />
          Limpiar
        </button>
      </div>
    </div>
  );
};

// 📊 WIDGET DISTRIBUCIÓN POR CLIENTE
const ClientDistributionWidget = ({ groups }) => {
  const sortedGroups = groups
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return (
    <div className="enterprise-widget">
      <div className="enterprise-widget-header">
        <Building className="enterprise-widget-icon" />
        <h3 className="enterprise-widget-title">Distribución por Cliente</h3>
      </div>
      <div className="enterprise-widget-content">
        {sortedGroups.map((group) => (
          <div key={group.clientId || 'no-client'} className="enterprise-client-item">
            <span className="enterprise-client-name">
              {group.clientName}
            </span>
            <span className="enterprise-client-count">
              {group.count}
            </span>
          </div>
        ))}
        {groups.length === 0 && (
          <div style={{ textAlign: 'center', color: 'var(--enterprise-text-secondary)', fontSize: '0.875rem', padding: '1rem 0' }}>
            No hay datos disponibles
          </div>
        )}
      </div>
    </div>
  );
};

// 📊 WIDGET PRIORIDAD (DONUT CHART)
const PriorityWidget = ({ projects }) => {
  const priorityData = useMemo(() => {
    const counts = {
      high: projects.filter(p => p.priority === 'high' || p.priority === 'urgent').length,
      medium: projects.filter(p => p.priority === 'medium').length,
      low: projects.filter(p => p.priority === 'low').length
    };
    
    return [
      { name: 'Alta', value: counts.high, color: 'var(--enterprise-danger)' },
      { name: 'Media', value: counts.medium, color: 'var(--enterprise-warning)' },
      { name: 'Baja', value: counts.low, color: 'var(--enterprise-success)' }
    ].filter(item => item.value > 0);
  }, [projects]);

  const total = priorityData.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="enterprise-widget">
      <div className="enterprise-widget-header">
        <AlertTriangle className="enterprise-widget-icon" />
        <h3 className="enterprise-widget-title">Por Prioridad</h3>
      </div>
      <div className="enterprise-widget-content">
        <div className="enterprise-priority-chart">
          <div style={{ width: '96px', height: '96px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={priorityData}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {priorityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [
                    `${value} (${Math.round((value / total) * 100)}%)`,
                    name
                  ]}
                  contentStyle={{
                    backgroundColor: 'var(--enterprise-surface)',
                    border: '1px solid var(--enterprise-border)',
                    borderRadius: '8px',
                    color: 'var(--enterprise-text-primary)'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="enterprise-priority-legend">
            {priorityData.map((item) => (
              <div key={item.name} className="enterprise-priority-item">
                <div className="enterprise-priority-dot" style={{ backgroundColor: item.color }} />
                <span className="enterprise-priority-label">{item.name}</span>
                <div style={{ textAlign: 'right' }}>
                  <span className="enterprise-priority-value">{item.value}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--enterprise-text-secondary)', marginLeft: '0.25rem' }}>
                    ({Math.round((item.value / total) * 100)}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// 📊 WIDGET ESTADO GENERAL (BARRAS HORIZONTALES)
const StatusWidget = ({ projects }) => {
  const statusData = useMemo(() => {
    const completed = projects.filter(p => p.status === 'completed').length;
    const active = projects.filter(p => p.status === 'active').length;
    const atRisk = projects.filter(p => {
      if (!p.end_date || p.status === 'completed') return false;
      const now = new Date();
      const endDate = new Date(p.end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysRemaining > 0 && daysRemaining < 30 && (p.progress || 0) < 70;
    }).length;

    return [
      { name: 'Completados', value: completed, color: 'var(--enterprise-success)', total: projects.length },
      { name: 'Activos', value: active, color: 'var(--enterprise-primary)', total: projects.length },
      { name: 'En riesgo', value: atRisk, color: 'var(--enterprise-warning)', total: projects.length }
    ];
  }, [projects]);

  return (
    <div className="enterprise-widget">
      <div className="enterprise-widget-header">
        <CheckCircle2 className="enterprise-widget-icon" />
        <h3 className="enterprise-widget-title">Estado General</h3>
      </div>
      <div className="enterprise-widget-content">
        <div className="enterprise-status-bars">
          {statusData.map((item) => (
            <div key={item.name} className="enterprise-status-bar">
              <div className="enterprise-status-bar-header">
                <span className="enterprise-status-label">{item.name}</span>
                <span className="enterprise-status-value">{item.value}</span>
              </div>
              <div className="enterprise-status-track">
                <div
                  className={`enterprise-status-fill enterprise-status-fill--${
                    item.name === 'Completados' ? 'success' :
                    item.name === 'Activos' ? 'primary' : 'warning'
                  }`}
                  style={{
                    width: `${item.total > 0 ? (item.value / item.total) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// 📋 TABLA AGRUPADA POR CLIENTE
const GroupedProjectTable = ({ groups, onView, sortField, sortDirection, onSort }) => {
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());

  const toggleGroup = useCallback((groupId) => {
    setCollapsedGroups(prev => {
      const newSet = new Set(prev);
      if (newSet.has(groupId)) {
        newSet.delete(groupId);
      } else {
        newSet.add(groupId);
      }
      return newSet;
    });
  }, []);

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className={`enterprise-sort-button ${sortField === field ? 'enterprise-sort-button--active' : ''}`}
    >
      {children}
      {sortField === field && (
        sortDirection === 'asc' ? 
          <ChevronUp /> : 
          <ChevronDown />
      )}
    </button>
  );

  const Badge = ({ variant, children }) => (
    <span className={`enterprise-badge enterprise-badge--${variant}`}>
      {children}
    </span>
  );

  const ProgressBar = ({ value, variant = 'primary' }) => (
    <div className="enterprise-progress">
      <div className="enterprise-progress-track">
        <div
          className={`enterprise-progress-fill enterprise-progress-fill--${variant}`}
          style={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
        />
      </div>
      <span className="enterprise-progress-value">
        {value || 0}%
      </span>
    </div>
  );

  return (
    <div className="enterprise-table">
      {/* Table Header */}
      <div className="enterprise-table-header">
        <SortButton field="nombre">Proyecto</SortButton>
        <div>Estado</div>
        <div>Prioridad</div>
        <SortButton field="progress">Progreso</SortButton>
        <div>Equipo</div>
        <SortButton field="end_date">Fecha Fin</SortButton>
        <div style={{ textAlign: 'center' }}>Acción</div>
      </div>

      {/* Groups */}
      <div>
        {groups.map((group) => (
          <div key={group.clientId || 'no-client'} className="enterprise-group">
            {/* Group Header */}
            <button
              onClick={() => toggleGroup(group.clientId)}
              className="enterprise-group-header"
            >
              <div className="enterprise-group-info">
                <Building className="enterprise-group-icon" />
                <div>
                  <h3 className="enterprise-group-name">{group.clientName}</h3>
                  <p className="enterprise-group-subtitle">
                    {group.count} proyecto{group.count !== 1 ? 's' : ''}
                  </p>
                </div>
              </div>
              <div className="enterprise-group-stats">
                <div className="enterprise-group-stat">
                  <div className="enterprise-group-stat-value">
                    {Math.round(group.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / group.count)}%
                  </div>
                  <div className="enterprise-group-stat-label">Promedio</div>
                </div>
                <ChevronRight 
                  className={`enterprise-group-chevron ${
                    !collapsedGroups.has(group.clientId) ? 'enterprise-group-chevron--expanded' : ''
                  }`}
                />
              </div>
            </button>

            {/* Projects List */}
            <AnimatePresence>
              {!collapsedGroups.has(group.clientId) && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{ overflow: 'hidden' }}
                >
                  {group.projects.map((project, index) => (
                    <div
                      key={project.id}
                      className="enterprise-project-row"
                    >
                      {/* Project Name */}
                      <div className="enterprise-project-main">
                        <h4>{project.nombre}</h4>
                        <p>{project.descripcion}</p>
                      </div>

                      {/* Status */}
                      <div>
                        <Badge variant={
                          project.status === 'completed' ? 'success' :
                          project.status === 'active' ? 'success' :
                          project.status === 'planning' ? 'warning' :
                          'default'
                        }>
                          {project.status === 'active' ? 'Activo' :
                           project.status === 'completed' ? 'Completado' :
                           project.status === 'planning' ? 'Planificación' :
                           project.status === 'on_hold' ? 'En Pausa' :
                           'Sin estado'}
                        </Badge>
                      </div>

                      {/* Priority */}
                      <div>
                        <Badge variant={
                          project.priority === 'high' || project.priority === 'urgent' ? 'danger' :
                          project.priority === 'medium' ? 'warning' :
                          project.priority === 'low' ? 'success' :
                          'default'
                        }>
                          {project.priority === 'high' ? 'Alta' :
                           project.priority === 'urgent' ? 'Urgente' :
                           project.priority === 'medium' ? 'Media' :
                           project.priority === 'low' ? 'Baja' :
                           'Normal'}
                        </Badge>
                      </div>

                      {/* Progress */}
                      <div>
                        <ProgressBar 
                          value={project.progress || 0}
                          variant={
                            (project.progress || 0) >= 80 ? 'success' :
                            (project.progress || 0) >= 50 ? 'primary' :
                            'warning'
                          }
                        />
                      </div>

                      {/* Team */}
                      <div>
                        {project.members && project.members.length > 0 ? (
                          <div className="enterprise-team-chips">
                            {project.members.filter(m => m.team_type === 'operations').length > 0 && (
                              <span className="enterprise-team-chip enterprise-team-chip--ops">
                                <Users />
                                {project.members.filter(m => m.team_type === 'operations').length}
                              </span>
                            )}
                            {project.members.filter(m => m.team_type === 'it').length > 0 && (
                              <span className="enterprise-team-chip enterprise-team-chip--it">
                                <Settings />
                                {project.members.filter(m => m.team_type === 'it').length}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="enterprise-date">Sin equipo</span>
                        )}
                      </div>

                      {/* End Date */}
                      <div>
                        <span className="enterprise-date">
                          {project.end_date ? 
                            new Date(project.end_date).toLocaleDateString('es-ES', {
                              month: 'short',
                              day: 'numeric',
                              year: '2-digit'
                            }) : 
                            'N/A'
                          }
                        </span>
                      </div>

                      {/* Action */}
                      <div style={{ textAlign: 'center' }}>
                        <button
                          onClick={() => onView(project)}
                          className="enterprise-action-button"
                          aria-label={`Ver proyecto ${project.nombre}`}
                        >
                          <Eye />
                        </button>
                      </div>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
};

// 🏗️ COMPONENTE PRINCIPAL
const ProjectDashboardEnterprise = ({
  projects = [],
  groups = [],
  onView,
  loading = false
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');

  // 📊 KPIs calculados
  const kpis = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const averageProgress = totalProjects > 0 ? 
      Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects) : 0;
    
    const now = new Date();
    const upcomingDeadlines = projects.filter(p => {
      if (!p.end_date || p.status === 'completed') return false;
      const endDate = new Date(p.end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysRemaining >= 0 && daysRemaining <= 7;
    }).length;

    const atRisk = projects.filter(p => {
      if (!p.end_date || p.status === 'completed') return false;
      const endDate = new Date(p.end_date);
      const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysRemaining > 0 && daysRemaining < 30 && (p.progress || 0) < 70;
    }).length;

    return {
      totalProjects,
      activeProjects,
      averageProgress,
      upcomingDeadlines,
      atRisk
    };
  }, [projects]);

  // 🔄 Filtrado y ordenamiento
  const filteredGroups = useMemo(() => {
    let filtered = groups.map(group => {
      let filteredProjects = [...group.projects];

      // Filtro de búsqueda
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          (project.nombre?.toLowerCase().includes(searchLower)) ||
          (project.descripcion?.toLowerCase().includes(searchLower)) ||
          (group.clientName?.toLowerCase().includes(searchLower)) ||
          (project.status?.toLowerCase().includes(searchLower))
        );
      }

      // Filtros avanzados
      if (filters.status) {
        filteredProjects = filteredProjects.filter(p => p.status === filters.status);
      }
      if (filters.priority) {
        filteredProjects = filteredProjects.filter(p => p.priority === filters.priority);
      }

      // Ordenamiento
      filteredProjects.sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
      });

      return {
        ...group,
        projects: filteredProjects,
        count: filteredProjects.length
      };
    }).filter(group => group.count > 0);

    return filtered;
  }, [groups, searchValue, filters, sortField, sortDirection]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchValue('');
  }, []);

  const handleExport = useCallback(() => {

  }, []);

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
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {[1, 2, 3].map(i => (
              <div key={i} style={{ height: '16rem', background: 'var(--enterprise-surface-2)', borderRadius: 'var(--enterprise-radius-2xl)' }} />
            ))}
          </div>
          <div style={{ height: '24rem', background: 'var(--enterprise-surface-2)', borderRadius: 'var(--enterprise-radius-2xl)' }} />
        </div>
      </div>
    );
  }

  return (
    <div className="enterprise-dashboard">
      {/* 🎯 Hero compacto */}
      <div className="enterprise-hero">
        <h1>Dashboard de Proyectos</h1>
        <p>Gestión y seguimiento de proyectos empresariales</p>
      </div>

      {/* 📊 KPI Cards - Fila 1 */}
      <div className="enterprise-kpi-grid">
        <KPICard
          title="Proyectos Activos"
          icon={Target}
          value={kpis.activeProjects}
          delta={{ trend: 'up', pct: '12%' }}
          rightNote={`${kpis.totalProjects} totales`}
          ariaLabel={`Proyectos activos: ${kpis.activeProjects} de ${kpis.totalProjects} totales`}
        />
        <KPICard
          title="Progreso Promedio"
          icon={BarChart3}
          value={`${kpis.averageProgress}%`}
          delta={{ trend: kpis.averageProgress >= 70 ? 'up' : 'down', pct: '8%' }}
          rightNote="En desarrollo"
          ariaLabel={`Progreso promedio: ${kpis.averageProgress}%`}
        />
        <KPICard
          title="Próximos Vencimientos"
          icon={Calendar}
          value={kpis.upcomingDeadlines}
          delta={{ trend: 'flat', pct: '0%' }}
          rightNote="próx. 7 días"
          ariaLabel={`Próximos vencimientos: ${kpis.upcomingDeadlines} en los próximos 7 días`}
        />
        <KPICard
          title="En Riesgo"
          icon={AlertTriangle}
          value={kpis.atRisk}
          delta={{ trend: kpis.atRisk > 0 ? 'down' : 'up', pct: '3%' }}
          rightNote="Progreso bajo"
          ariaLabel={`Proyectos en riesgo: ${kpis.atRisk}`}
        />
      </div>

      {/* 📈 Widgets - Fila 2 */}
      <div className="enterprise-widgets-grid">
        <ClientDistributionWidget groups={groups} />
        <PriorityWidget projects={projects} />
        <StatusWidget projects={projects} />
      </div>

      {/* 🔍 Toolbar - Fila 3 */}
      <SearchToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
      />

      {/* 📋 Tabla agrupada - Fila 4 */}
      <GroupedProjectTable
        groups={filteredGroups}
        onView={onView}
        sortField={sortField}
        sortDirection={sortDirection}
        onSort={handleSort}
      />
    </div>
  );
};

export default ProjectDashboardEnterprise;