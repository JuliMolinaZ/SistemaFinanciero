// 🚀 PROJECT TABLE ULTRA MODERN - DISEÑO NEXT-LEVEL
// ===================================================

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
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
  Calendar,
  Clock,
  Zap,
  TrendingUp,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  Star,
  Flag,
  CheckSquare,
  Square
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import './ProjectTableUltraModern.css';

// 🎨 ENHANCED KPI CARD WITH GLASSMORPHISM
const EnhancedKPICard = ({ title, icon: Icon, value, delta, rightNote, ariaLabel, gradient = 'primary' }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const TrendIcon = ({ trend }) => {
    switch (trend) {
      case 'up': return <TrendingUp className="kpi-trend-icon" />;
      case 'down': return <TrendingUp className="kpi-trend-icon kpi-trend-icon--down" />;
      default: return <div className="kpi-trend-icon kpi-trend-icon--flat" />;
    }
  };

  return (
    <motion.div 
      className={`ultra-kpi-card ultra-kpi-card--${gradient}`}
      aria-label={ariaLabel || title}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      <div className="ultra-kpi-background" />
      <div className="ultra-kpi-content">
        <div className="ultra-kpi-header">
          <h3 className="ultra-kpi-title">{title}</h3>
          {Icon && (
            <motion.div 
              className="ultra-kpi-icon"
              animate={{ rotate: isHovered ? 12 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Icon />
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className="ultra-kpi-value"
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.2 }}
        >
          {value}
        </motion.div>
        
        <div className="ultra-kpi-footer">
          {delta && (
            <div className={`ultra-kpi-delta ultra-kpi-delta--${delta.trend || 'flat'}`}>
              <TrendIcon trend={delta.trend} />
              <span className="tabular-nums">{delta.pct}</span>
            </div>
          )}
          {rightNote && (
            <div className="ultra-kpi-note">{rightNote}</div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// 🔍 ULTRA MODERN SEARCH WITH AI-LIKE SUGGESTIONS
const UltraSearchToolbar = ({ 
  searchValue, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onClearFilters,
  onExport,
  totalProjects 
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const filterCount = Object.values(filters).filter(v => v).length;

  return (
    <motion.div 
      className="ultra-toolbar"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div className="ultra-toolbar-grid">
        {/* Enhanced Search */}
        <motion.div 
          className={`ultra-search ${searchFocused ? 'ultra-search--focused' : ''}`}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="ultra-search-icon-container">
            <Search className="ultra-search-icon" />
          </div>
          <input
            ref={searchRef}
            type="text"
            placeholder="Buscar en proyectos, clientes, estados..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="ultra-search-input"
          />
          {searchValue && (
            <motion.button
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className="ultra-search-clear"
            >
              <X />
            </motion.button>
          )}
          <div className="ultra-search-glow" />
        </motion.div>

        {/* Advanced Filters */}
        <div className="ultra-toolbar-actions">
          <motion.div 
            className="ultra-filter-container"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 25 }}
          >
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`ultra-button ultra-button--filter ${filtersOpen ? 'ultra-button--active' : ''}`}
            >
              <Filter />
              <span>Filtros</span>
              {filterCount > 0 && (
                <motion.div 
                  className="ultra-filter-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  key={filterCount}
                >
                  {filterCount}
                </motion.div>
              )}
            </button>
            
            <AnimatePresence>
              {filtersOpen && (
                <motion.div
                  className="ultra-filter-panel"
                  initial={{ opacity: 0, y: -20, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -20, scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 300, damping: 25 }}
                >
                  <div className="ultra-filter-panel-header">
                    <h4>Filtros Avanzados</h4>
                    <button onClick={() => setFiltersOpen(false)} className="ultra-filter-close">
                      <X />
                    </button>
                  </div>
                  
                  <div className="ultra-filter-grid">
                    <div className="ultra-filter-group">
                      <label className="ultra-filter-label">
                        <Flag className="ultra-filter-label-icon" />
                        Estado
                      </label>
                      <select
                        value={filters.status || ''}
                        onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                        className="ultra-filter-select"
                      >
                        <option value="">Todos los estados</option>
                        <option value="active">🟢 Activo</option>
                        <option value="planning">🟡 Planificación</option>
                        <option value="completed">✅ Completado</option>
                        <option value="on_hold">⏸️ En Pausa</option>
                      </select>
                    </div>

                    <div className="ultra-filter-group">
                      <label className="ultra-filter-label">
                        <Zap className="ultra-filter-label-icon" />
                        Prioridad
                      </label>
                      <select
                        value={filters.priority || ''}
                        onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
                        className="ultra-filter-select"
                      >
                        <option value="">Todas las prioridades</option>
                        <option value="critical">🔴 Crítica</option>
                        <option value="high">🟠 Alta</option>
                        <option value="medium">🟡 Media</option>
                        <option value="low">🟢 Baja</option>
                      </select>
                    </div>

                    <div className="ultra-filter-group">
                      <label className="ultra-filter-label">
                        <TrendingUp className="ultra-filter-label-icon" />
                        Progreso Mínimo
                      </label>
                      <div className="ultra-range-container">
                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={filters.minProgress || 0}
                          onChange={(e) => onFiltersChange({ ...filters, minProgress: parseInt(e.target.value) })}
                          className="ultra-range-input"
                        />
                        <span className="ultra-range-value">{filters.minProgress || 0}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="ultra-filter-actions">
                    <button
                      onClick={onClearFilters}
                      className="ultra-button ultra-button--ghost ultra-button--danger"
                    >
                      <Trash2 />
                      Limpiar Todo
                    </button>
                    <button
                      onClick={() => setFiltersOpen(false)}
                      className="ultra-button ultra-button--primary"
                    >
                      <CheckSquare />
                      Aplicar Filtros
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Export with options */}
          <motion.button 
            onClick={onExport} 
            className="ultra-button ultra-button--ghost"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Download />
            <span>Exportar</span>
          </motion.button>

          {/* Quick actions */}
          <motion.button 
            onClick={onClearFilters} 
            className="ultra-button ultra-button--ghost"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <X />
            <span>Limpiar</span>
          </motion.button>
        </div>
      </div>

      {/* Search suggestions */}
      {searchValue && (
        <motion.div
          className="ultra-search-suggestions"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <div className="ultra-search-suggestion">
            Buscando en {totalProjects} proyectos...
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

// 📊 ENHANCED PROJECT ROW WITH MICRO-INTERACTIONS
const UltraProjectRow = ({ project, index, onView, onEdit, onDelete, isSelected, onSelect }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const controls = useAnimation();

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'critical': return '#ef4444';
      case 'high': return '#f97316';
      case 'medium': return '#eab308';
      case 'low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#22c55e';
      case 'planning': return '#eab308';
      case 'completed': return '#06b6d4';
      case 'on_hold': return '#f97316';
      default: return '#6b7280';
    }
  };

  const Badge = ({ variant, children, color }) => (
    <motion.span 
      className={`ultra-badge ultra-badge--${variant}`}
      style={{ '--badge-color': color }}
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
    >
      {children}
    </motion.span>
  );

  const ProgressBar = ({ value, variant = 'primary' }) => (
    <div className="ultra-progress">
      <div className="ultra-progress-track">
        <motion.div
          className={`ultra-progress-fill ultra-progress-fill--${variant}`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
          transition={{ duration: 1, ease: "easeOut", delay: index * 0.1 }}
        />
        <div className="ultra-progress-glow" />
      </div>
      <span className="ultra-progress-value tabular-nums">
        {value || 0}%
      </span>
    </div>
  );

  return (
    <motion.div
      className={`ultra-project-row ${isSelected ? 'ultra-project-row--selected' : ''}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.01 }}
    >
      {/* Selection checkbox */}
      <div className="ultra-project-select">
        <motion.button
          className={`ultra-checkbox ${isSelected ? 'ultra-checkbox--checked' : ''}`}
          onClick={() => onSelect(project)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSelected ? <CheckSquare /> : <Square />}
        </motion.button>
      </div>

      {/* Project info with enhanced layout */}
      <div className="ultra-project-main">
        <div className="ultra-project-header">
          <h4 className="ultra-project-name">
            {project.nombre}
            {project.priority === 'critical' && (
              <motion.div 
                className="ultra-priority-indicator"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertTriangle />
              </motion.div>
            )}
          </h4>
          <div className="ultra-project-meta">
            <span className="ultra-project-id">#{project.id}</span>
            {project.client?.nombre && (
              <span className="ultra-project-client">
                <Building className="ultra-meta-icon" />
                {project.client.nombre}
              </span>
            )}
          </div>
        </div>
        <p className="ultra-project-description">
          {project.descripcion}
        </p>
        <div className="ultra-project-tags">
          {project.end_date && (
            <span className="ultra-tag">
              <Calendar className="ultra-tag-icon" />
              {new Date(project.end_date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' })}
            </span>
          )}
          {project.methodology?.name && (
            <span className="ultra-tag">
              <Zap className="ultra-tag-icon" />
              {project.methodology.name}
            </span>
          )}
        </div>
      </div>

      {/* Status with animation */}
      <div className="ultra-project-status">
        <Badge variant="status" color={getStatusColor(project.status)}>
          <div className="ultra-status-indicator" />
          {project.status === 'active' ? 'Activo' :
           project.status === 'completed' ? 'Completado' :
           project.status === 'planning' ? 'Planificación' :
           project.status === 'on_hold' ? 'En Pausa' :
           'Sin estado'}
        </Badge>
      </div>

      {/* Priority with glow effect */}
      <div className="ultra-project-priority">
        <Badge variant="priority" color={getPriorityColor(project.priority)}>
          {project.priority === 'critical' && <AlertTriangle className="ultra-badge-icon" />}
          {project.priority === 'high' && <Flag className="ultra-badge-icon" />}
          {project.priority === 'critical' ? 'Crítica' :
           project.priority === 'high' ? 'Alta' :
           project.priority === 'medium' ? 'Media' :
           project.priority === 'low' ? 'Baja' :
           'Normal'}
        </Badge>
      </div>

      {/* Enhanced progress */}
      <div className="ultra-project-progress">
        <ProgressBar 
          value={project.progress || 0}
          variant={
            (project.progress || 0) >= 80 ? 'success' :
            (project.progress || 0) >= 50 ? 'primary' :
            'warning'
          }
        />
      </div>

      {/* Team with avatars */}
      <div className="ultra-project-team">
        {project.members && project.members.length > 0 ? (
          <div className="ultra-team-stack">
            {project.members.slice(0, 3).map((member, i) => (
              <motion.div
                key={member.id}
                className={`ultra-team-avatar ultra-team-avatar--${member.team_type}`}
                style={{ zIndex: 3 - i }}
                whileHover={{ scale: 1.2, zIndex: 10 }}
                title={member.user?.name}
              >
                {member.user?.name?.charAt(0) || '?'}
              </motion.div>
            ))}
            {project.members.length > 3 && (
              <div className="ultra-team-more">
                +{project.members.length - 3}
              </div>
            )}
          </div>
        ) : (
          <span className="ultra-team-empty">Sin equipo</span>
        )}
      </div>

      {/* Actions with context menu */}
      <div className="ultra-project-actions">
        <motion.button
          onClick={() => onView(project)}
          className="ultra-action-button ultra-action-button--primary"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label={`Ver proyecto ${project.nombre}`}
        >
          <Eye />
        </motion.button>
        
        <div className="ultra-action-menu">
          <motion.button
            onClick={() => setMenuOpen(!menuOpen)}
            className="ultra-action-button ultra-action-button--menu"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MoreHorizontal />
          </motion.button>
          
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                className="ultra-context-menu"
                initial={{ opacity: 0, scale: 0.8, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                <button onClick={() => { onEdit(project); setMenuOpen(false); }} className="ultra-menu-item">
                  <Edit />
                  Editar
                </button>
                <button onClick={() => { onView(project); setMenuOpen(false); }} className="ultra-menu-item">
                  <ExternalLink />
                  Ver Detalles
                </button>
                <button onClick={() => { console.log('Copy', project); setMenuOpen(false); }} className="ultra-menu-item">
                  <Copy />
                  Duplicar
                </button>
                <div className="ultra-menu-divider" />
                <button onClick={() => { onDelete(project); setMenuOpen(false); }} className="ultra-menu-item ultra-menu-item--danger">
                  <Trash2 />
                  Eliminar
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Hover overlay */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="ultra-project-hover-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 🏢 ULTRA CLIENT GROUP WITH GLASSMORPHISM
const UltraClientGroup = ({ 
  group, 
  isCollapsed, 
  onToggle, 
  onView,
  onEdit,
  onDelete,
  sortField,
  sortDirection,
  onSort,
  selectedProjects,
  onSelectProject,
  onSelectAll
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const allSelected = group.projects.every(p => selectedProjects.includes(p.id));
  const someSelected = group.projects.some(p => selectedProjects.includes(p.id));

  const handleSelectAll = () => {
    if (allSelected) {
      // Deseleccionar todos
      group.projects.forEach(p => {
        if (selectedProjects.includes(p.id)) {
          onSelectProject(p);
        }
      });
    } else {
      // Seleccionar todos
      group.projects.forEach(p => {
        if (!selectedProjects.includes(p.id)) {
          onSelectProject(p);
        }
      });
    }
  };

  return (
    <motion.div 
      className="ultra-client-group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Enhanced Group Header */}
      <motion.div
        className={`ultra-group-header ${isCollapsed ? 'ultra-group-header--collapsed' : ''}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.01 }}
      >
        <button
          onClick={onToggle}
          className="ultra-group-toggle"
        >
          <div className="ultra-group-info">
            <div className="ultra-group-icon-container">
              <Building className="ultra-group-icon" />
              <div className="ultra-group-icon-glow" />
            </div>
            <div className="ultra-group-details">
              <h3 className="ultra-group-name">{group.clientName}</h3>
              <p className="ultra-group-subtitle">
                {group.count} proyecto{group.count !== 1 ? 's' : ''} • 
                Promedio {Math.round(group.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / group.count)}%
              </p>
            </div>
          </div>
          
          <div className="ultra-group-stats">
            <div className="ultra-group-progress-ring">
              <svg width="40" height="40" className="ultra-progress-ring">
                <circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="var(--ultra-surface-3)"
                  strokeWidth="3"
                />
                <motion.circle
                  cx="20"
                  cy="20"
                  r="16"
                  fill="none"
                  stroke="var(--ultra-primary)"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 16}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 16 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 16 * (1 - (Math.round(group.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / group.count) / 100))
                  }}
                  transition={{ duration: 1, delay: 0.5 }}
                />
              </svg>
              <span className="ultra-progress-ring-text">
                {Math.round(group.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / group.count)}%
              </span>
            </div>
            
            <motion.div
              className="ultra-group-chevron"
              animate={{ rotate: isCollapsed ? 0 : 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ChevronRight />
            </motion.div>
          </div>
        </button>

        {/* Group actions */}
        <div className="ultra-group-actions">
          <motion.button
            className={`ultra-checkbox ultra-checkbox--group ${
              allSelected ? 'ultra-checkbox--checked' : 
              someSelected ? 'ultra-checkbox--indeterminate' : ''
            }`}
            onClick={handleSelectAll}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {allSelected ? <CheckSquare /> : someSelected ? <Square className="ultra-checkbox-indeterminate" /> : <Square />}
          </motion.button>
        </div>
      </motion.div>

      {/* Projects List with stagger animation */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="ultra-projects-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="ultra-projects-list">
              {group.projects.map((project, projectIndex) => (
                <UltraProjectRow
                  key={project.id}
                  project={project}
                  index={projectIndex}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isSelected={selectedProjects.includes(project.id)}
                  onSelect={onSelectProject}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 🏗️ MAIN ULTRA MODERN COMPONENT
const ProjectTableUltraModern = ({
  projects = [],
  groups = [],
  onView,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('nombre');
  const [sortDirection, setSortDirection] = useState('asc');
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [selectedProjects, setSelectedProjects] = useState([]);
  const [viewMode, setViewMode] = useState('grid'); // grid, list, kanban

  // 📊 Enhanced KPIs
  const enhancedKpis = useMemo(() => {
    const totalProjects = projects.length;
    const activeProjects = projects.filter(p => p.status === 'active').length;
    const criticalProjects = projects.filter(p => p.priority === 'critical').length;
    const averageProgress = totalProjects > 0 ? 
      Math.round(projects.reduce((sum, p) => sum + (p.progress || 0), 0) / totalProjects) : 0;

    return {
      totalProjects,
      activeProjects,
      criticalProjects,
      averageProgress
    };
  }, [projects]);

  // 🔄 Enhanced filtering and sorting
  const filteredGroups = useMemo(() => {
    let filtered = groups.map(group => {
      let filteredProjects = [...group.projects];

      // Search filter
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

      // Advanced filters
      if (filters.status) {
        filteredProjects = filteredProjects.filter(p => p.status === filters.status);
      }
      if (filters.priority) {
        filteredProjects = filteredProjects.filter(p => p.priority === filters.priority);
      }
      if (filters.minProgress) {
        filteredProjects = filteredProjects.filter(p => (p.progress || 0) >= filters.minProgress);
      }

      // Sorting
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

  const handleSelectProject = useCallback((project) => {
    setSelectedProjects(prev => {
      if (prev.includes(project.id)) {
        return prev.filter(id => id !== project.id);
      } else {
        return [...prev, project.id];
      }
    });
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({});
    setSearchValue('');
    setSelectedProjects([]);
  }, []);

  const handleExport = useCallback(() => {
    console.log('Exportar proyectos seleccionados:', selectedProjects);
  }, [selectedProjects]);

  if (loading) {
    return (
      <div className="ultra-dashboard">
        <div className="ultra-loading">
          <motion.div
            className="ultra-loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap />
          </motion.div>
          <p>Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="ultra-dashboard">
      {/* Enhanced Hero */}
      <motion.div 
        className="ultra-hero"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="ultra-hero-content">
          <h1 className="ultra-hero-title">
            Gestión de Proyectos
            <motion.div 
              className="ultra-hero-glow"
              animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </h1>
          <p className="ultra-hero-subtitle">
            Lista avanzada de proyectos con gestión inteligente
          </p>
        </div>
        
        {selectedProjects.length > 0 && (
          <motion.div
            className="ultra-bulk-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="ultra-bulk-count">
              {selectedProjects.length} seleccionado{selectedProjects.length !== 1 ? 's' : ''}
            </span>
            <button className="ultra-bulk-button">
              <Edit />
              Editar
            </button>
            <button className="ultra-bulk-button ultra-bulk-button--danger">
              <Trash2 />
              Eliminar
            </button>
          </motion.div>
        )}
      </motion.div>

      {/* Enhanced KPI Row */}
      <motion.div 
        className="ultra-kpi-grid"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <EnhancedKPICard
          title="Total Proyectos"
          icon={Building}
          value={enhancedKpis.totalProjects}
          delta={{ trend: 'up', pct: '+12%' }}
          rightNote="En gestión"
          gradient="primary"
        />
        <EnhancedKPICard
          title="Proyectos Activos"
          icon={Zap}
          value={enhancedKpis.activeProjects}
          delta={{ trend: 'up', pct: '+8%' }}
          rightNote="En desarrollo"
          gradient="success"
        />
        <EnhancedKPICard
          title="Críticos"
          icon={AlertTriangle}
          value={enhancedKpis.criticalProjects}
          delta={{ trend: enhancedKpis.criticalProjects > 0 ? 'down' : 'up', pct: '±3%' }}
          rightNote="Requieren atención"
          gradient="danger"
        />
        <EnhancedKPICard
          title="Progreso Promedio"
          icon={TrendingUp}
          value={`${enhancedKpis.averageProgress}%`}
          delta={{ trend: enhancedKpis.averageProgress >= 50 ? 'up' : 'down', pct: '+5%' }}
          rightNote="General"
          gradient="warning"
        />
      </motion.div>

      {/* Ultra Search Toolbar */}
      <UltraSearchToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        totalProjects={projects.length}
      />

      {/* Enhanced Table */}
      <motion.div 
        className="ultra-table-container"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="ultra-table">
          {filteredGroups.map((group) => (
            <UltraClientGroup
              key={group.clientId || 'no-client'}
              group={group}
              isCollapsed={collapsedGroups.has(group.clientId)}
              onToggle={() => handleGroupToggle(group.clientId)}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
              selectedProjects={selectedProjects}
              onSelectProject={handleSelectProject}
            />
          ))}
        </div>

        {/* Enhanced Footer */}
        <motion.div 
          className="ultra-table-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="ultra-footer-stats">
            <span className="ultra-footer-text">
              Mostrando{' '}
              <span className="ultra-footer-highlight tabular-nums">
                {filteredGroups.reduce((total, group) => total + group.count, 0)}
              </span>{' '}
              de{' '}
              <span className="ultra-footer-highlight tabular-nums">
                {groups.reduce((total, group) => total + group.count, 0)}
              </span>{' '}
              proyectos en{' '}
              <span className="ultra-footer-highlight tabular-nums">{filteredGroups.length}</span>{' '}
              {filteredGroups.length === 1 ? 'cliente' : 'clientes'}
            </span>
          </div>
          
          {selectedProjects.length > 0 && (
            <motion.div
              className="ultra-footer-selection"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <span className="ultra-selection-count">
                {selectedProjects.length} seleccionado{selectedProjects.length !== 1 ? 's' : ''}
              </span>
              <button 
                onClick={() => setSelectedProjects([])}
                className="ultra-selection-clear"
              >
                <X />
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectTableUltraModern;
