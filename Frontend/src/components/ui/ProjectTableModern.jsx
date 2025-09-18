// 📊 PROJECT TABLE MODERN - DISEÑO TIPO SAAS PREMIUM
// ==================================================

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { 
  Eye, 
  ChevronUp, 
  ChevronDown, 
  Search, 
  Filter,
  X, 
  ChevronRight,
  Settings,
  Download,
  Calendar,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  Building
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectDashboardKPIs from './ProjectDashboardKPIs';
import ExportManager from './ExportManager';
import ColumnSelector from './ColumnSelector';
import './project-table-modern.css';
import './export-manager.css';
import './column-selector.css';

// 🎯 ICON BUTTON COMPONENT
const IconButton = ({ 
  children, 
  onClick, 
  'aria-label': ariaLabel, 
  tooltip,
  variant = 'ghost',
  size = 'sm',
  disabled = false,
  className = '',
  ...props 
}) => (
  <button
    className={`ptm-icon-btn ptm-icon-btn--${variant} ptm-icon-btn--${size} ${className}`}
    onClick={onClick}
    aria-label={ariaLabel}
    title={tooltip || ariaLabel}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);

// 🏷️ BADGE COMPONENT
const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'sm',
  className = '',
  ...props 
}) => (
  <span
    className={`ptm-badge ptm-badge--${variant} ptm-badge--${size} ${className}`}
    {...props}
  >
    {children}
  </span>
);

// 📊 ENHANCED PROGRESS BAR WITH RISK INDICATOR
const ProgressBar = ({ 
  value = 0, 
  showLabel = true, 
  variant = 'primary', 
  endDate,
  className = '',
  ...props 
}) => {
  // Calculate risk level
  const getRiskLevel = () => {
    if (!endDate) return 'none';
    
    const now = new Date();
    const end = new Date(endDate);
    const daysRemaining = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    
    if (daysRemaining < 0) return 'overdue';
    if (daysRemaining < 7 && value < 90) return 'critical';
    if (daysRemaining < 30 && value < 70) return 'warning';
    
    return 'none';
  };

  const riskLevel = getRiskLevel();
  const progressVariant = riskLevel === 'critical' ? 'danger' : 
                         riskLevel === 'warning' ? 'warning' : 
                         riskLevel === 'overdue' ? 'danger' : variant;

  return (
    <div className={`ptm-progress-container ${className}`} {...props}>
      <div className="ptm-progress-track">
        <div 
          className={`ptm-progress-fill ptm-progress-fill--${progressVariant}`}
          style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
        />
        {riskLevel !== 'none' && (
          <div className="ptm-progress-risk-indicator">
            <AlertTriangle className="ptm-progress-risk-icon" />
          </div>
        )}
      </div>
      {showLabel && (
        <span className="ptm-progress-label tabular-nums">
          {value}%
        </span>
      )}
    </div>
  );
};

// 🏷️ TEAM CHIPS ENHANCED
const TeamChips = ({ members = [] }) => {
  const operationsTeam = members.filter(m => m.team_type === 'operations');
  const itTeam = members.filter(m => m.team_type === 'it');

  if (operationsTeam.length === 0 && itTeam.length === 0) {
    return <span className="ptm-text-muted">Sin equipo</span>;
  }

  return (
    <div className="ptm-team-chips">
      {operationsTeam.length > 0 && (
        <span className="ptm-team-chip ptm-team-chip--ops" title={`Operaciones: ${operationsTeam.map(m => m.user?.name).join(', ')}`}>
          <Users className="ptm-team-chip-icon" />
          {operationsTeam.length}
        </span>
      )}
      {itTeam.length > 0 && (
        <span className="ptm-team-chip ptm-team-chip--it" title={`TI: ${itTeam.map(m => m.user?.name).join(', ')}`}>
          <Settings className="ptm-team-chip-icon" />
          {itTeam.length}
        </span>
      )}
    </div>
  );
};

// 🔍 ADVANCED SEARCH BAR
const AdvancedSearchBar = ({ value, onChange, placeholder = "Busca por cliente, proyecto o estado..." }) => (
  <div className="ptm-search-container">
    <Search className="ptm-search-icon" />
    <input
      type="text"
      className="ptm-search-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button
        className="ptm-search-clear"
        onClick={() => onChange('')}
        aria-label="Limpiar búsqueda"
      >
        <X className="ptm-icon" />
      </button>
    )}
  </div>
);

// 🎛️ ADVANCED FILTERS PANEL
const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  onClear,
  isOpen,
  onToggle 
}) => (
  <div className="ptm-filters-container">
    <button
      className={`ptm-filters-toggle ${isOpen ? 'ptm-filters-toggle--active' : ''}`}
      onClick={onToggle}
    >
      <Filter className="ptm-icon" />
      <span>Filtros</span>
      {Object.values(filters).some(v => v) && (
        <div className="ptm-filters-indicator" />
      )}
    </button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="ptm-filters-panel"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          <div className="ptm-filters-grid">
            {/* Status Filter */}
            <div className="ptm-filter-group">
              <label className="ptm-filter-label">Estado</label>
              <select
                value={filters.status || ''}
                onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                className="ptm-filter-select"
              >
                <option value="">Todos</option>
                <option value="planning">Planificación</option>
                <option value="active">Activo</option>
                <option value="on_hold">En Pausa</option>
                <option value="completed">Completado</option>
              </select>
            </div>

            {/* Priority Filter */}
            <div className="ptm-filter-group">
              <label className="ptm-filter-label">Prioridad</label>
              <select
                value={filters.priority || ''}
                onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
                className="ptm-filter-select"
              >
                <option value="">Todas</option>
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="urgent">Urgente</option>
              </select>
            </div>

            {/* Progress Range */}
            <div className="ptm-filter-group">
              <label className="ptm-filter-label">Progreso Mínimo</label>
              <input
                type="range"
                min="0"
                max="100"
                value={filters.minProgress || 0}
                onChange={(e) => onFiltersChange({ ...filters, minProgress: parseInt(e.target.value) })}
                className="ptm-filter-range"
              />
              <span className="ptm-filter-range-value">{filters.minProgress || 0}%</span>
            </div>

            {/* Clear Filters */}
            <div className="ptm-filter-actions">
              <button
                className="ptm-filter-clear"
                onClick={onClear}
              >
                <X className="ptm-icon" />
                Limpiar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// 📋 CLIENT GROUP CARD
const ClientGroupCard = ({ 
  group, 
  isCollapsed, 
  onToggle, 
  onView,
  sortField,
  sortDirection,
  onSort,
  columnVisibility
}) => (
  <div className="ptm-client-card">
    {/* Client Header */}
    <div className="ptm-client-header">
      <button
        className="ptm-client-toggle"
        onClick={onToggle}
        aria-expanded={!isCollapsed}
        aria-label={`${isCollapsed ? 'Expandir' : 'Colapsar'} proyectos de ${group.clientName}`}
      >
        <div className="ptm-client-info">
          <Building className="ptm-client-icon" />
          <div>
            <h3 className="ptm-client-name">{group.clientName}</h3>
            <p className="ptm-client-subtitle">
              {group.count} proyecto{group.count !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        
        <div className="ptm-client-stats">
          <div className="ptm-client-stat">
            <span className="ptm-stat-value">
              {Math.round(group.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / group.count)}%
            </span>
            <span className="ptm-stat-label">Promedio</span>
          </div>
          
          <ChevronRight 
            className={`ptm-client-chevron ${!isCollapsed ? 'ptm-client-chevron--expanded' : ''}`}
          />
        </div>
      </button>
    </div>

    {/* Projects List */}
    <AnimatePresence>
      {!isCollapsed && (
        <motion.div
          className="ptm-projects-container"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="ptm-projects-header">
            <div className="ptm-project-col ptm-project-col--name">
              <button
                className={`ptm-sort-btn ${sortField === 'nombre' ? 'ptm-sort-btn--active' : ''}`}
                onClick={() => onSort('nombre')}
              >
                Proyecto
                {sortField === 'nombre' && (
                  sortDirection === 'asc' ? 
                    <ChevronUp className="ptm-sort-icon" /> : 
                    <ChevronDown className="ptm-sort-icon" />
                )}
              </button>
            </div>
            {columnVisibility.status !== false && (
              <div className="ptm-project-col ptm-project-col--status">Estado</div>
            )}
            {columnVisibility.priority !== false && (
              <div className="ptm-project-col ptm-project-col--priority">Prioridad</div>
            )}
            {columnVisibility.progress !== false && (
              <div className="ptm-project-col ptm-project-col--progress">
                <button
                  className={`ptm-sort-btn ${sortField === 'progress' ? 'ptm-sort-btn--active' : ''}`}
                  onClick={() => onSort('progress')}
                >
                  Progreso
                  {sortField === 'progress' && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="ptm-sort-icon" /> : 
                      <ChevronDown className="ptm-sort-icon" />
                  )}
                </button>
              </div>
            )}
            {columnVisibility.team !== false && (
              <div className="ptm-project-col ptm-project-col--team">Equipo</div>
            )}
            {columnVisibility.phase !== false && (
              <div className="ptm-project-col ptm-project-col--phase">Fase</div>
            )}
            {columnVisibility.date !== false && (
              <div className="ptm-project-col ptm-project-col--date">
                <button
                  className={`ptm-sort-btn ${sortField === 'end_date' ? 'ptm-sort-btn--active' : ''}`}
                  onClick={() => onSort('end_date')}
                >
                  Fecha Fin
                  {sortField === 'end_date' && (
                    sortDirection === 'asc' ? 
                      <ChevronUp className="ptm-sort-icon" /> : 
                      <ChevronDown className="ptm-sort-icon" />
                  )}
                </button>
              </div>
            )}
            <div className="ptm-project-col ptm-project-col--actions">Acciones</div>
          </div>

          <div className="ptm-projects-list">
            {group.projects.map((project, index) => (
              <ProjectRow
                key={project.id}
                project={project}
                index={index}
                onView={onView}
                columnVisibility={columnVisibility}
              />
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  </div>
);

// 📋 PROJECT ROW COMPONENT
const ProjectRow = ({ project, index, onView, columnVisibility }) => {
  const [isHovered, setIsHovered] = useState(false);

  // 🎨 GET BADGE VARIANTS
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      planning: 'warning',
      completed: 'neutral',
      on_hold: 'neutral'
    };
    
    const labels = {
      active: 'Activo',
      planning: 'Planificación',
      completed: 'Completado',
      on_hold: 'En Pausa'
    };

    return (
      <Badge variant={variants[status] || 'neutral'}>
        {labels[status] || status || 'Sin estado'}
      </Badge>
    );
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      high: 'danger',
      urgent: 'danger',
      medium: 'warning',
      low: 'success'
    };
    
    const labels = {
      high: 'Alta',
      urgent: 'Urgente',
      medium: 'Media',
      low: 'Baja'
    };

    return (
      <Badge variant={variants[priority] || 'neutral'}>
        {labels[priority] || priority || 'Normal'}
      </Badge>
    );
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    try {
      return new Date(date).toLocaleDateString('es-ES', {
        month: 'short',
        day: 'numeric',
        year: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  // 🚨 RISK CALCULATION
  const getRiskIndicator = () => {
    if (!project.end_date || project.status === 'completed') return null;
    
    const now = new Date();
    const endDate = new Date(project.end_date);
    const daysRemaining = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
    const progress = project.progress || 0;
    
    if (daysRemaining < 0) {
      return { type: 'overdue', message: 'Proyecto vencido' };
    }
    
    if (daysRemaining < 7 && progress < 90) {
      return { type: 'critical', message: `Vence en ${daysRemaining} días` };
    }
    
    if (daysRemaining < 30 && progress < 70) {
      return { type: 'warning', message: `Progreso bajo (${daysRemaining}d restantes)` };
    }
    
    return null;
  };

  const riskIndicator = getRiskIndicator();

  return (
    <motion.div
      className={`ptm-project-row ${isHovered ? 'ptm-project-row--hovered' : ''} ${index % 2 === 1 ? 'ptm-project-row--alternate' : ''}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Project Name & Description */}
      <div className="ptm-project-col ptm-project-col--name">
        <div className="ptm-project-main">
          <h4 className="ptm-project-name">
            {project.nombre}
            {riskIndicator && (
              <div className={`ptm-risk-indicator ptm-risk-indicator--${riskIndicator.type}`} title={riskIndicator.message}>
                <AlertTriangle className="ptm-risk-icon" />
              </div>
            )}
          </h4>
          <p className="ptm-project-description">
            {project.descripcion}
          </p>
        </div>
      </div>

      {/* Status */}
      {columnVisibility.status !== false && (
        <div className="ptm-project-col ptm-project-col--status">
          {getStatusBadge(project.status)}
        </div>
      )}

      {/* Priority */}
      {columnVisibility.priority !== false && (
        <div className="ptm-project-col ptm-project-col--priority">
          {getPriorityBadge(project.priority)}
        </div>
      )}

      {/* Progress */}
      {columnVisibility.progress !== false && (
        <div className="ptm-project-col ptm-project-col--progress">
          <ProgressBar
            value={project.progress || 0}
            endDate={project.end_date}
            variant={project.progress >= 80 ? 'success' : project.progress >= 50 ? 'primary' : 'warning'}
          />
        </div>
      )}

      {/* Team */}
      {columnVisibility.team !== false && (
        <div className="ptm-project-col ptm-project-col--team">
          <TeamChips members={project.members || []} />
        </div>
      )}

      {/* Phase */}
      {columnVisibility.phase !== false && (
        <div className="ptm-project-col ptm-project-col--phase">
          <Badge variant="neutral">
            {project.current_phase?.name || 'Sin fase'}
          </Badge>
        </div>
      )}

      {/* End Date */}
      {columnVisibility.date !== false && (
        <div className="ptm-project-col ptm-project-col--date">
          <span className="ptm-text-secondary tabular-nums">
            {formatDate(project.end_date)}
          </span>
        </div>
      )}

      {/* Actions */}
      <div className="ptm-project-col ptm-project-col--actions">
        <IconButton
          onClick={(e) => {
            e.stopPropagation();
            onView?.(project);
          }}
          aria-label={`Ver proyecto ${project.nombre}`}
          tooltip="Ver detalles"
          variant="ghost"
          size="sm"
          className="ptm-view-action"
        >
          <Eye className="ptm-icon" />
        </IconButton>
      </div>
    </motion.div>
  );
};

// 📊 MAIN PROJECT TABLE MODERN COMPONENT
const ProjectTableModern = ({
  groups = [],
  loading = false,
  onView,
  searchValue = '',
  onSearchChange,
  className = '',
  emptyMessage = 'No hay proyectos disponibles',
  emptyDescription = 'Los proyectos aparecerán aquí una vez que sean creados.',
  ...props
}) => {
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [filters, setFilters] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [columnVisibility, setColumnVisibility] = useState({
    status: true,
    priority: true,
    progress: true,
    team: true,
    phase: true,
    date: true
  });

  // 🔄 FILTRADO Y ORDENAMIENTO
  const filteredAndSortedGroups = useMemo(() => {
    let filteredGroups = groups.map(group => {
      let filteredProjects = [...group.projects];

      // Filtro de búsqueda
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          (project.nombre?.toLowerCase().includes(searchLower)) ||
          (project.descripcion?.toLowerCase().includes(searchLower)) ||
          (group.clientName?.toLowerCase().includes(searchLower)) ||
          (project.status?.toLowerCase().includes(searchLower)) ||
          (project.priority?.toLowerCase().includes(searchLower))
        );
      }

      // Filtros avanzados
      if (filters.status) {
        filteredProjects = filteredProjects.filter(p => p.status === filters.status);
      }
      
      if (filters.priority) {
        filteredProjects = filteredProjects.filter(p => p.priority === filters.priority);
      }
      
      if (filters.minProgress) {
        filteredProjects = filteredProjects.filter(p => (p.progress || 0) >= filters.minProgress);
      }

      // Ordenamiento dentro del grupo
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

    return filteredGroups;
  }, [groups, searchValue, sortField, sortDirection, filters]);

  // 🎯 HANDLE SORT
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  // 🎯 HANDLE GROUP TOGGLE
  const handleGroupToggle = useCallback((groupId) => {
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

  // 🎯 HANDLE FILTERS
  const handleFiltersChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setFiltersOpen(false);
  }, []);

  // Get all projects for KPIs
  const allProjects = useMemo(() => 
    groups.flatMap(group => group.projects), [groups]
  );

  // 🎭 LOADING STATE
  if (loading) {
    return (
      <div className={`ptm-container ${className}`} {...props}>
        <div className="ptm-loading">
          <div className="ptm-skeleton-dashboard">
            <div className="ptm-skeleton-kpi-grid">
              {Array.from({ length: 4 }, (_, i) => (
                <div key={i} className="ptm-skeleton-kpi-card ptm-skeleton-pulse" />
              ))}
            </div>
          </div>
          <div className="ptm-skeleton-table">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="ptm-skeleton-group">
                <div className="ptm-skeleton-group-header ptm-skeleton-pulse" />
                {Array.from({ length: 2 }, (_, j) => (
                  <div key={j} className="ptm-skeleton-row ptm-skeleton-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🎭 EMPTY STATE
  if (filteredAndSortedGroups.length === 0) {
    return (
      <div className={`ptm-container ${className}`} {...props}>
        <ProjectDashboardKPIs projects={allProjects} groups={groups} />
        
        <div className="ptm-controls">
          <AdvancedSearchBar value={searchValue} onChange={onSearchChange} />
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClear={handleClearFilters}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
        </div>
        
        <div className="ptm-empty-state">
          <div className="ptm-empty-content">
            <div className="ptm-empty-icon">
              <Eye className="ptm-icon" />
            </div>
            <h3 className="ptm-empty-title">{emptyMessage}</h3>
            <p className="ptm-empty-description">{emptyDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`ptm-container ${className}`} {...props}>
      {/* 📊 DASHBOARD KPIs */}
      <ProjectDashboardKPIs projects={allProjects} groups={groups} />

      {/* 🔍 CONTROLS */}
      <div className="ptm-controls">
        <AdvancedSearchBar value={searchValue} onChange={onSearchChange} />
        
        <div className="ptm-controls-right">
          <AdvancedFilters
            filters={filters}
            onFiltersChange={handleFiltersChange}
            onClear={handleClearFilters}
            isOpen={filtersOpen}
            onToggle={() => setFiltersOpen(!filtersOpen)}
          />
          
          <ExportManager projects={allProjects} groups={groups} />
          
          <ColumnSelector
            columnVisibility={columnVisibility}
            onVisibilityChange={setColumnVisibility}
          />
        </div>
      </div>

      {/* 📊 PROJECT CARDS BY CLIENT */}
      <div className="ptm-table-container">
        <AnimatePresence>
          {filteredAndSortedGroups.map((group, groupIndex) => (
            <ClientGroupCard
              key={group.clientId || 'no-client'}
              group={group}
              isCollapsed={collapsedGroups.has(group.clientId)}
              onToggle={() => handleGroupToggle(group.clientId)}
              onView={onView}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              columnVisibility={columnVisibility}
            />
          ))}
        </AnimatePresence>
      </div>

      {/* 📊 FOOTER STATS */}
      <div className="ptm-footer">
        <div className="ptm-footer-stats">
          <span className="ptm-footer-text">
            Mostrando{' '}
            <span className="tabular-nums">
              {filteredAndSortedGroups.reduce((total, group) => total + group.count, 0)}
            </span>{' '}
            de{' '}
            <span className="tabular-nums">
              {groups.reduce((total, group) => total + group.count, 0)}
            </span>{' '}
            proyectos en{' '}
            <span className="tabular-nums">{filteredAndSortedGroups.length}</span>{' '}
            {filteredAndSortedGroups.length === 1 ? 'cliente' : 'clientes'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default ProjectTableModern;
