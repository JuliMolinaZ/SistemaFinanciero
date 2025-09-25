// 📋 PROJECT TABLE PURE - SOLO TABLA ULTRA MODERNA
// =================================================

import React, { useState, useMemo, useCallback, useRef } from 'react';
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
  Calendar,
  Clock,
  Zap,
  Flag,
  CheckSquare,
  Square,
  MoreHorizontal,
  Edit,
  Trash2,
  Copy,
  ExternalLink,
  ArrowUpDown,
  SortAsc,
  SortDesc
} from 'lucide-react';
import './ProjectTablePure.css';
import ElegantActionButtons from './ElegantActionButtons';

// 🔍 ULTRA SEARCH & FILTERS
const UltraSearchFilters = ({ 
  searchValue, 
  onSearchChange, 
  filters, 
  onFiltersChange,
  onClearFilters,
  onExport,
  totalProjects,
  selectedCount 
}) => {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const searchRef = useRef(null);

  const filterCount = Object.values(filters).filter(v => v).length;

  return (
    <motion.div 
      className="pure-search-container"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Search Bar Ultra */}
      <div className="pure-search-section">
        <motion.div 
          className={`pure-search ${searchFocused ? 'pure-search--focused' : ''}`}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 25 }}
        >
          <div className="pure-search-icon-container">
            <Search className="pure-search-icon" />
            <div className="pure-search-icon-pulse" />
          </div>
          <input
            ref={searchRef}
            type="text"
            placeholder={`Buscar en ${totalProjects} proyectos...`}
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            className="pure-search-input"
          />
          {searchValue && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onSearchChange('')}
              className="pure-search-clear"
            >
              <X />
            </motion.button>
          )}
          <div className="pure-search-glow" />
        </motion.div>

        {/* Results indicator */}
        <AnimatePresence>
          {searchValue && (
            <motion.div
              className="pure-search-results"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              Resultados en tiempo real
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Filters & Actions */}
      <div className="pure-actions-section">
        {/* Advanced Filters */}
        <div className="pure-filter-container">
          <motion.button
            onClick={() => setFiltersOpen(!filtersOpen)}
            className={`pure-button pure-button--filter ${filtersOpen ? 'pure-button--active' : ''}`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Filter />
            <span>Filtros</span>
            {filterCount > 0 && (
              <motion.div 
                className="pure-filter-badge"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                key={filterCount}
              >
                {filterCount}
              </motion.div>
            )}
          </motion.button>
          
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                className="pure-filter-panel"
                initial={{ opacity: 0, y: -20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <div className="pure-filter-header">
                  <h4>Filtros Avanzados</h4>
                  <button onClick={() => setFiltersOpen(false)} className="pure-filter-close">
                    <X />
                  </button>
                </div>
                
                <div className="pure-filter-content">
                  <div className="pure-filter-group">
                    <label className="pure-filter-label">
                      <Flag className="pure-filter-icon" />
                      Estado del Proyecto
                    </label>
                    <select
                      value={filters.status || ''}
                      onChange={(e) => onFiltersChange({ ...filters, status: e.target.value })}
                      className="pure-filter-select"
                    >
                      <option value="">🔍 Todos los estados</option>
                      <option value="active">🟢 Activo</option>
                      <option value="planning">🟡 Planificación</option>
                      <option value="completed">✅ Completado</option>
                      <option value="on_hold">⏸️ En Pausa</option>
                    </select>
                  </div>

                  <div className="pure-filter-group">
                    <label className="pure-filter-label">
                      <Zap className="pure-filter-icon" />
                      Nivel de Prioridad
                    </label>
                    <select
                      value={filters.priority || ''}
                      onChange={(e) => onFiltersChange({ ...filters, priority: e.target.value })}
                      className="pure-filter-select"
                    >
                      <option value="">⚡ Todas las prioridades</option>
                      <option value="critical">🔴 Crítica</option>
                      <option value="high">🟠 Alta</option>
                      <option value="medium">🟡 Media</option>
                      <option value="low">🟢 Baja</option>
                    </select>
                  </div>

                  <div className="pure-filter-group">
                    <label className="pure-filter-label">
                      <Clock className="pure-filter-icon" />
                      Progreso Mínimo
                    </label>
                    <div className="pure-range-container">
                      <input
                        type="range"
                        min="0"
                        max="100"
                        step="5"
                        value={filters.minProgress || 0}
                        onChange={(e) => onFiltersChange({ ...filters, minProgress: parseInt(e.target.value) })}
                        className="pure-range-input"
                      />
                      <div className="pure-range-display">
                        <span className="pure-range-value">{filters.minProgress || 0}%</span>
                        <div className="pure-range-track-fill" style={{ width: `${filters.minProgress || 0}%` }} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="pure-filter-footer">
                  <button
                    onClick={onClearFilters}
                    className="pure-button pure-button--ghost pure-button--danger"
                  >
                    <Trash2 />
                    Limpiar Todo
                  </button>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="pure-button pure-button--primary"
                  >
                    <CheckSquare />
                    Aplicar
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Quick Actions */}
        <motion.button 
          onClick={onExport} 
          className="pure-button pure-button--ghost"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Download />
          <span>Exportar</span>
        </motion.button>

        {selectedCount > 0 && (
          <motion.div
            className="pure-bulk-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <span className="pure-bulk-count">{selectedCount} seleccionados</span>
            <button className="pure-bulk-action">
              <Edit />
            </button>
            <button className="pure-bulk-action pure-bulk-action--danger">
              <Trash2 />
            </button>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// 📊 ENHANCED PROJECT ROW - OPTIMIZED FOR 100+ PROJECTS
const PureProjectRow = ({ 
  project, 
  index, 
  onView, 
  onEdit, 
  onDelete, 
  isSelected, 
  onSelect,
  isVirtualized = false 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const getPriorityConfig = (priority) => {
    const configs = {
      critical: { color: '#ef4444', label: 'Crítica', emoji: '🔴' },
      high: { color: '#f97316', label: 'Alta', emoji: '🟠' },
      medium: { color: '#eab308', label: 'Media', emoji: '🟡' },
      low: { color: '#22c55e', label: 'Baja', emoji: '🟢' }
    };
    return configs[priority] || { color: '#6b7280', label: 'Normal', emoji: '⚪' };
  };

  const getStatusConfig = (status) => {
    const configs = {
      active: { color: '#22c55e', label: 'Activo', emoji: '🟢' },
      planning: { color: '#eab308', label: 'Planificación', emoji: '🟡' },
      completed: { color: '#06b6d4', label: 'Completado', emoji: '✅' },
      on_hold: { color: '#f97316', label: 'En Pausa', emoji: '⏸️' }
    };
    return configs[status] || { color: '#6b7280', label: 'Sin estado', emoji: '⚪' };
  };

  const priorityConfig = getPriorityConfig(project.priority);
  const statusConfig = getStatusConfig(project.status);

  const ProgressBar = ({ value }) => (
    <div className="pure-progress-container">
      <div className="pure-progress-track">
        <motion.div
          className={`pure-progress-fill ${
            value >= 80 ? 'pure-progress-fill--success' :
            value >= 50 ? 'pure-progress-fill--primary' :
            value >= 25 ? 'pure-progress-fill--warning' :
            'pure-progress-fill--danger'
          }`}
          initial={{ width: 0 }}
          animate={{ width: `${Math.max(0, Math.min(100, value || 0))}%` }}
          transition={{ duration: 0.8, delay: isVirtualized ? 0 : index * 0.05 }}
        />
        <div className="pure-progress-shimmer" />
      </div>
      <span className="pure-progress-text tabular-nums">
        {value || 0}%
      </span>
    </div>
  );

  // Aplicar color del cliente
  const clientColor = project.client?.color || '#3B82F6';
  const lightClientColor = `${clientColor}15`; // 15 = 8.5% opacity
  const borderClientColor = `${clientColor}40`; // 40 = 25% opacity

  return (
    <motion.div
      className={`pure-project-row ${isSelected ? 'pure-project-row--selected' : ''}`}
      style={{
        '--client-color': clientColor,
        '--client-color-light': lightClientColor,
        '--client-color-border': borderClientColor,
        backgroundColor: lightClientColor,
        borderLeft: `3px solid ${clientColor}`,
      }}
      initial={!isVirtualized ? { opacity: 0, x: -20 } : false}
      animate={!isVirtualized ? { opacity: 1, x: 0 } : false}
      transition={!isVirtualized ? { delay: index * 0.03, duration: 0.3 } : false}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      whileHover={{ scale: 1.005 }}
    >
      {/* Selection */}
      <div className="pure-project-select">
        <motion.button
          className={`pure-checkbox ${isSelected ? 'pure-checkbox--checked' : ''}`}
          onClick={() => onSelect(project)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {isSelected ? <CheckSquare /> : <Square />}
        </motion.button>
      </div>

      {/* Project Info */}
      <div className="pure-project-main">
        <div className="pure-project-header">
          <h4 className="pure-project-name">
            {project.nombre}
            {project.priority === 'critical' && (
              <motion.div 
                className="pure-critical-indicator"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                <AlertTriangle />
              </motion.div>
            )}
          </h4>
          <div className="pure-project-meta">
            <span className="pure-project-id">#{project.id}</span>
            {project.client?.nombre && project.client.nombre !== 'Sin Cliente' && (
              <span className="pure-project-client">
                <Building />
                {project.client.nombre}
              </span>
            )}
          </div>
        </div>
        <p className="pure-project-description">
          {project.descripcion || 'Sin descripción disponible'}
        </p>
        <div className="pure-project-footer">
          {project.end_date && (
            <span className="pure-project-date">
              <Calendar />
              {new Date(project.end_date).toLocaleDateString('es-ES', { 
                month: 'short', 
                day: 'numeric',
                year: '2-digit'
              })}
            </span>
          )}
          {project.created_at && (
            <span className="pure-project-created">
              <Clock />
              Creado {new Date(project.created_at).toLocaleDateString('es-ES', { 
                month: 'short', 
                day: 'numeric' 
              })}
            </span>
          )}
        </div>
      </div>

      {/* Status */}
      <div className="pure-project-status">
        <motion.div 
          className="pure-status-badge"
          style={{ '--badge-color': statusConfig.color }}
          whileHover={{ scale: 1.05 }}
        >
          <div className="pure-status-indicator" />
          <span>{statusConfig.emoji} {statusConfig.label}</span>
        </motion.div>
      </div>

      {/* Priority */}
      <div className="pure-project-priority">
        <motion.div 
          className={`pure-priority-badge ${project.priority === 'critical' ? 'pure-priority-badge--critical' : ''}`}
          style={{ '--badge-color': priorityConfig.color }}
          whileHover={{ scale: 1.05 }}
        >
          {project.priority === 'critical' && <AlertTriangle className="pure-priority-icon" />}
          {project.priority === 'high' && <Flag className="pure-priority-icon" />}
          <span>{priorityConfig.emoji} {priorityConfig.label}</span>
        </motion.div>
      </div>

      {/* Progress */}
      <div className="pure-project-progress">
        <ProgressBar value={project.progress || 0} />
      </div>

      {/* Team Info */}
      <div className="pure-project-team">
        {project.members && project.members.length > 0 ? (
          <div className="pure-team-info">
            <div className="pure-team-count">
              <Users />
              <span>{project.members.length}</span>
            </div>
            <div className="pure-team-types">
              {project.members.filter(m => m.team_type === 'operations').length > 0 && (
                <span className="pure-team-type pure-team-type--ops">
                  Ops: {project.members.filter(m => m.team_type === 'operations').length}
                </span>
              )}
              {project.members.filter(m => m.team_type === 'it').length > 0 && (
                <span className="pure-team-type pure-team-type--it">
                  IT: {project.members.filter(m => m.team_type === 'it').length}
                </span>
              )}
            </div>
          </div>
        ) : (
          <span className="pure-team-empty">
            <Users />
            Sin equipo
          </span>
        )}
      </div>

      {/* Actions - Botones elegantes y minimalistas */}
      <div className="pure-project-actions">
        <ElegantActionButtons
          onView={() => onView(project)}
          onEdit={() => onEdit(project)}
          onDelete={() => onDelete(project)}
          onCopy={() => {/* TODO: Implementar duplicar proyecto */}}
          onExport={() => {/* TODO: Implementar exportar proyecto */}}
          onHistory={() => {/* TODO: Implementar ver historial */}}
          size="small"
          disabled={{
            view: false,
            edit: false,
            delete: false
          }}
        />
      </div>

      {/* Hover Effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="pure-project-hover"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 🏢 CLIENT GROUP OPTIMIZED FOR SCALE
const PureClientGroup = ({ 
  group, 
  isCollapsed, 
  onToggle, 
  onView,
  onEdit,
  onDelete,
  selectedProjects,
  onSelectProject,
  sortField,
  sortDirection,
  onSort
}) => {
  const allSelected = group.projects.every(p => selectedProjects.includes(p.id));
  const someSelected = group.projects.some(p => selectedProjects.includes(p.id));
  const averageProgress = Math.round(group.projects.reduce((sum, p) => sum + (p.progress || 0), 0) / group.count);
  
  // Color del cliente para el grupo
  const clientColor = group.projects[0]?.client?.color || '#3B82F6';
  const lightClientColor = `${clientColor}20`; // 20 = 12.5% opacity

  const handleSelectAll = () => {
    if (allSelected) {
      group.projects.forEach(p => {
        if (selectedProjects.includes(p.id)) {
          onSelectProject(p);
        }
      });
    } else {
      group.projects.forEach(p => {
        if (!selectedProjects.includes(p.id)) {
          onSelectProject(p);
        }
      });
    }
  };

  const SortButton = ({ field, children }) => (
    <button
      onClick={() => onSort(field)}
      className={`pure-sort-button ${sortField === field ? 'pure-sort-button--active' : ''}`}
    >
      {children}
      <div className="pure-sort-icons">
        {sortField === field ? (
          sortDirection === 'asc' ? <SortAsc /> : <SortDesc />
        ) : (
          <ArrowUpDown />
        )}
      </div>
    </button>
  );

  return (
    <motion.div 
      className="pure-client-group"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* Group Header */}
      <div 
        className="pure-group-header"
        style={{
          backgroundColor: lightClientColor,
          borderLeft: `4px solid ${clientColor}`,
          '--client-color': clientColor
        }}
      >
        <button
          onClick={onToggle}
          className="pure-group-toggle"
        >
          <div className="pure-group-info">
            <div className="pure-group-icon-container">
              <Building className="pure-group-icon" />
              <div className="pure-group-glow" />
            </div>
            <div className="pure-group-details">
              <h3 className="pure-group-name">
                <div 
                  className="pure-client-color-dot"
                  style={{ backgroundColor: clientColor }}
                ></div>
                {group.clientName}
              </h3>
              <p className="pure-group-subtitle">
                {group.count} proyecto{group.count !== 1 ? 's' : ''} • {averageProgress}% promedio
              </p>
            </div>
          </div>
          
          <div className="pure-group-stats">
            {/* Mini progress ring */}
            <div className="pure-mini-progress">
              <svg width="32" height="32" className="pure-progress-ring">
                <circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="var(--pure-surface-4)"
                  strokeWidth="2"
                />
                <motion.circle
                  cx="16"
                  cy="16"
                  r="12"
                  fill="none"
                  stroke="var(--pure-primary)"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 12}`}
                  initial={{ strokeDashoffset: 2 * Math.PI * 12 }}
                  animate={{ 
                    strokeDashoffset: 2 * Math.PI * 12 * (1 - (averageProgress / 100))
                  }}
                  transition={{ duration: 1, delay: 0.3 }}
                />
              </svg>
              <span className="pure-progress-ring-text">{averageProgress}%</span>
            </div>
            
            <motion.div
              className="pure-group-chevron"
              animate={{ rotate: isCollapsed ? 0 : 90 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <ChevronRight />
            </motion.div>
          </div>
        </button>

        {/* Group Actions */}
        <div className="pure-group-actions">
          <motion.button
            className={`pure-checkbox pure-checkbox--group ${
              allSelected ? 'pure-checkbox--checked' : 
              someSelected ? 'pure-checkbox--indeterminate' : ''
            }`}
            onClick={handleSelectAll}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            {allSelected ? <CheckSquare /> : someSelected ? <Square className="pure-checkbox-partial" /> : <Square />}
          </motion.button>
        </div>
      </div>

      {/* Table Header - Only show when expanded */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="pure-table-header"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="pure-header-cell pure-header-cell--select">
              <span className="pure-sr-only">Seleccionar</span>
            </div>
            <div className="pure-header-cell pure-header-cell--main">
              <SortButton field="nombre">Proyecto</SortButton>
            </div>
            <div className="pure-header-cell">
              <SortButton field="status">Estado</SortButton>
            </div>
            <div className="pure-header-cell">
              <SortButton field="priority">Prioridad</SortButton>
            </div>
            <div className="pure-header-cell">
              <SortButton field="progress">Progreso</SortButton>
            </div>
            <div className="pure-header-cell">Equipo</div>
            <div className="pure-header-cell pure-header-cell--actions">Acciones</div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Projects List */}
      <AnimatePresence>
        {!isCollapsed && (
          <motion.div
            className="pure-projects-container"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          >
            <div className="pure-projects-list">
              {group.projects.map((project, projectIndex) => (
                <PureProjectRow
                  key={project.id}
                  project={project}
                  index={projectIndex}
                  onView={onView}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  isSelected={selectedProjects.includes(project.id)}
                  onSelect={onSelectProject}
                  isVirtualized={group.projects.length > 20}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

// 🏗️ MAIN PURE TABLE COMPONENT
const ProjectTablePure = ({
  projects = [],
  groups = [],
  onView,
  onEdit,
  onDelete,
  loading = false
}) => {
  // Log para debugging cuando se re-renderiza ProjectTablePure

  const [searchValue, setSearchValue] = useState('');
  const [filters, setFilters] = useState({});
  const [sortField, setSortField] = useState('created_at');
  const [sortDirection, setSortDirection] = useState('desc');
  const [collapsedGroups, setCollapsedGroups] = useState(new Set());
  const [selectedProjects, setSelectedProjects] = useState([]);

  // 🔍 Create a hash of the groups data to force updates when content changes
  const groupsDataHash = useMemo(() => {
    const hash = groups.map(group =>
      `${group.clientId}-${group.projects.map(p => `${p.id}:${p.progress}`).join(',')}`
    ).join('|');

    return hash;
  }, [groups]);

  // 🔄 Enhanced filtering and sorting
  const filteredGroups = useMemo(() => {
    if (!groups || groups.length === 0) return [];
    
    let filtered = [...groups];
    
    // Apply search filter
    if (searchValue) {
      filtered = filtered.filter(group => 
        group.clientName.toLowerCase().includes(searchValue.toLowerCase()) ||
        group.projects.some(project => 
          project.nombre.toLowerCase().includes(searchValue.toLowerCase())
        )
      );
    }
    
    // Apply sorting
    if (sortField) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        if (sortField === 'clientName') {
          aValue = a.clientName;
          bValue = b.clientName;
        } else if (sortField === 'projectCount') {
          aValue = a.projects.length;
          bValue = b.projects.length;
        } else {
          aValue = a[sortField];
          bValue = b[sortField];
        }
        
        if (sortDirection === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
    }
    
    return filtered;
  }, [groups, searchValue, sortField, sortDirection]);

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

  }, [selectedProjects]);

  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

  if (loading) {
    return (
      <div className="pure-dashboard">
        <div className="pure-loading">
          <motion.div
            className="pure-loading-spinner"
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Zap />
          </motion.div>
          <h3>Cargando proyectos...</h3>
          <p>Preparando la vista optimizada</p>
        </div>
      </div>
    );
  }

  if (filteredGroups.length === 0) {
    return (
      <div className="pure-dashboard">
        <UltraSearchFilters
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filters}
          onFiltersChange={setFilters}
          onClearFilters={handleClearFilters}
          onExport={handleExport}
          totalProjects={projects.length}
          selectedCount={selectedProjects.length}
        />
        
        <motion.div 
          className="pure-empty-state"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="pure-empty-icon">
            <Building />
          </div>
          <h3>No se encontraron proyectos</h3>
          <p>
            {searchValue || Object.values(filters).some(v => v) 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Aún no hay proyectos creados'}
          </p>
          {(searchValue || Object.values(filters).some(v => v)) && (
            <button onClick={handleClearFilters} className="pure-button pure-button--primary">
              <X />
              Limpiar Filtros
            </button>
          )}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pure-dashboard">
      {/* Hero Section */}
      <motion.div 
        className="pure-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="pure-hero-content">
          <h1 className="pure-hero-title">
            Gestión de Proyectos
            <div className="pure-hero-glow" />
          </h1>
          <p className="pure-hero-subtitle">
            Vista optimizada para gestión eficiente de {projects.length} proyectos
          </p>
        </div>

        {selectedProjects.length > 0 && (
          <motion.div
            className="pure-bulk-actions"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="pure-bulk-text">
              {selectedProjects.length} proyecto{selectedProjects.length !== 1 ? 's' : ''} seleccionado{selectedProjects.length !== 1 ? 's' : ''}
            </span>
            <div className="pure-bulk-buttons">
              <button className="pure-bulk-button">
                <Edit />
                Editar
              </button>
              <button className="pure-bulk-button">
                <Download />
                Exportar
              </button>
              <button className="pure-bulk-button pure-bulk-button--danger">
                <Trash2 />
                Eliminar
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>

      {/* Search & Filters */}
      <UltraSearchFilters
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        filters={filters}
        onFiltersChange={setFilters}
        onClearFilters={handleClearFilters}
        onExport={handleExport}
        totalProjects={projects.length}
        selectedCount={selectedProjects.length}
      />

      {/* Table Container */}
      <motion.div 
        className="pure-table-container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="pure-table">
          {filteredGroups.map((group) => (
            <PureClientGroup
              key={group.clientId || 'no-client'}
              group={group}
              isCollapsed={collapsedGroups.has(group.clientId)}
              onToggle={() => handleGroupToggle(group.clientId)}
              onView={onView}
              onEdit={onEdit}
              onDelete={onDelete}
              selectedProjects={selectedProjects}
              onSelectProject={handleSelectProject}
              sortField={sortField}
              sortDirection={sortDirection}
              onSort={handleSort}
            />
          ))}
        </div>

        {/* Enhanced Footer */}
        <motion.div 
          className="pure-table-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          <div className="pure-footer-stats">
            <span className="pure-footer-text">
              Mostrando{' '}
              <span className="pure-footer-highlight tabular-nums">
                {filteredGroups.reduce((total, group) => total + group.count, 0)}
              </span>{' '}
              de{' '}
              <span className="pure-footer-highlight tabular-nums">
                {projects.length}
              </span>{' '}
              proyectos
            </span>
            <span className="pure-footer-separator">•</span>
            <span className="pure-footer-text">
              <span className="pure-footer-highlight tabular-nums">{filteredGroups.length}</span>{' '}
              {filteredGroups.length === 1 ? 'cliente' : 'clientes'}
            </span>
          </div>
          
          {selectedProjects.length > 0 && (
            <motion.button
              onClick={() => setSelectedProjects([])}
              className="pure-footer-clear"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <X />
              Deseleccionar Todo
            </motion.button>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProjectTablePure;
