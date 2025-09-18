// 📊 DATA TABLE GROUPED - TABLA AGRUPADA POR CLIENTE
// ==================================================

import React, { useState, useMemo, useCallback, useRef } from 'react';
import { Eye, ChevronUp, ChevronDown, Search, X, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotify } from '../../hooks/useNotify.js';
import './datatable-grouped.css';

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
    className={`dtg-icon-btn dtg-icon-btn--${variant} dtg-icon-btn--${size} ${className}`}
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
    className={`dtg-badge dtg-badge--${variant} dtg-badge--${size} ${className}`}
    {...props}
  >
    {children}
  </span>
);

// 📊 PROGRESS BAR
const ProgressBar = ({ value = 0, showLabel = true, variant = 'primary', className = '', ...props }) => (
  <div className={`dtg-progress-container ${className}`} {...props}>
    <div className="dtg-progress-track">
      <div 
        className={`dtg-progress-fill dtg-progress-fill--${variant}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
    {showLabel && (
      <span className="dtg-progress-label tabular-nums">
        {value}%
      </span>
    )}
  </div>
);

// 🏷️ TEAM CHIPS
const TeamChips = ({ members = [] }) => {
  const operationsTeam = members.filter(m => m.team_type === 'operations');
  const itTeam = members.filter(m => m.team_type === 'it');

  if (operationsTeam.length === 0 && itTeam.length === 0) {
    return <span className="dtg-text-muted">Sin equipo</span>;
  }

  return (
    <div className="dtg-team-chips">
      {operationsTeam.length > 0 && (
        <span className="dtg-team-chip dtg-team-chip--ops">
          Ops: {operationsTeam.length}
        </span>
      )}
      {itTeam.length > 0 && (
        <span className="dtg-team-chip dtg-team-chip--it">
          TI: {itTeam.length}
        </span>
      )}
    </div>
  );
};

// 🎯 SINGLE ACTION CELL - SOLO BOTÓN "VER"
const ActionCell = ({ project, onView }) => (
  <div className="dtg-action-cell">
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onView?.(project);
      }}
      aria-label={`Ver proyecto ${project.nombre || project.name}`}
      tooltip="Ver"
      variant="ghost"
      size="sm"
      className="dtg-view-action"
    >
      <Eye className="dtg-icon" />
    </IconButton>
  </div>
);

// 🔍 SEARCH BAR
const SearchBar = ({ value, onChange, placeholder = "Buscar proyectos..." }) => (
  <div className="dtg-search-container">
    <Search className="dtg-search-icon" />
    <input
      type="text"
      className="dtg-search-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button
        className="dtg-search-clear"
        onClick={() => onChange('')}
        aria-label="Limpiar búsqueda"
      >
        <X className="dtg-icon" />
      </button>
    )}
  </div>
);

// 📋 GROUP HEADER COMPONENT
const GroupHeader = ({ group, isCollapsed, onToggle, sortField, sortDirection }) => (
  <tr className="dtg-group-header">
    <td colSpan="8" className="dtg-group-header-cell">
      <div className="dtg-group-content">
        <button
          className="dtg-group-toggle"
          onClick={onToggle}
          aria-expanded={!isCollapsed}
          aria-label={`${isCollapsed ? 'Expandir' : 'Colapsar'} grupo ${group.clientName}`}
        >
          <ChevronRight 
            className={`dtg-group-chevron ${!isCollapsed ? 'dtg-group-chevron--expanded' : ''}`}
          />
          <span className="dtg-group-name">{group.clientName}</span>
        </button>
        <div className="dtg-group-counter">
          {group.count} proyecto{group.count !== 1 ? 's' : ''}
        </div>
      </div>
    </td>
  </tr>
);

// 📊 MAIN DATA TABLE GROUPED COMPONENT
const DataTableGrouped = ({
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
  const [hoveredRow, setHoveredRow] = useState(null);
  const tableRef = useRef(null);

  // 🔄 FILTRADO Y ORDENAMIENTO
  const filteredAndSortedGroups = useMemo(() => {
    let filteredGroups = groups.map(group => {
      let filteredProjects = [...group.projects];

      // Filtro de búsqueda
      if (searchValue) {
        const searchLower = searchValue.toLowerCase();
        filteredProjects = filteredProjects.filter(project => 
          (project.nombre?.toLowerCase().includes(searchLower)) ||
          (project.name?.toLowerCase().includes(searchLower)) ||
          (project.descripcion?.toLowerCase().includes(searchLower)) ||
          (project.description?.toLowerCase().includes(searchLower)) ||
          (group.clientName?.toLowerCase().includes(searchLower))
        );
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
    }).filter(group => group.count > 0); // Solo mostrar grupos con proyectos

    return filteredGroups;
  }, [groups, searchValue, sortField, sortDirection]);

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

  // 🎨 RENDER FUNCTIONS
  const getStatusBadge = (status) => {
    const variants = {
      active: 'success',
      planning: 'warning', 
      completed: 'neutral',
      paused: 'neutral'
    };
    
    const labels = {
      active: 'Activo',
      planning: 'Planificación',
      completed: 'Completado',
      paused: 'Pausado'
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
      medium: 'warning',
      low: 'success'
    };
    
    const labels = {
      high: 'Alta',
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
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  // 📋 COLUMN DEFINITIONS
  const columns = [
    {
      key: 'proyecto',
      label: 'Proyecto',
      sortable: true,
      sortKey: 'nombre',
      render: (project) => (
        <div className="dtg-project-cell">
          <div className="dtg-project-name">
            {project.nombre || project.name || 'Sin nombre'}
          </div>
          <div className="dtg-project-description">
            {project.descripcion || project.description || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      key: 'estado',
      label: 'Estado',
      sortable: true,
      sortKey: 'status',
      render: (project) => getStatusBadge(project.status)
    },
    {
      key: 'prioridad',
      label: 'Prioridad',
      sortable: true,
      sortKey: 'priority',
      render: (project) => getPriorityBadge(project.priority)
    },
    {
      key: 'progreso',
      label: 'Progreso',
      sortable: true,
      sortKey: 'progress',
      render: (project) => (
        <ProgressBar
          value={project.progress || 0}
          variant={project.progress >= 80 ? 'success' : project.progress >= 50 ? 'primary' : 'warning'}
        />
      )
    },
    {
      key: 'equipo',
      label: 'Equipo',
      sortable: false,
      render: (project) => <TeamChips members={project.members || []} />
    },
    {
      key: 'fase',
      label: 'Fase',
      sortable: false,
      render: (project) => (
        <Badge variant="neutral">
          {project.current_phase?.name || project.currentPhase?.name || 'Sin fase'}
        </Badge>
      )
    },
    {
      key: 'fecha_fin',
      label: 'Fecha Fin',
      sortable: true,
      sortKey: 'end_date',
      render: (project) => (
        <span className="dtg-text-secondary tabular-nums">
          {formatDate(project.end_date)}
        </span>
      )
    }
  ];

  // 🎭 LOADING STATE
  if (loading) {
    return (
      <div className={`dtg-container ${className}`} {...props}>
        <SearchBar value={searchValue} onChange={onSearchChange} />
        <div className="dtg-loading">
          <div className="dtg-skeleton-table">
            {/* Header skeleton */}
            <div className="dtg-skeleton-header">
              {columns.map((col, i) => (
                <div key={i} className="dtg-skeleton-cell dtg-skeleton-pulse" />
              ))}
            </div>
            {/* Groups skeleton */}
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="dtg-skeleton-group">
                <div className="dtg-skeleton-group-header dtg-skeleton-pulse" />
                {Array.from({ length: 2 }, (_, j) => (
                  <div key={j} className="dtg-skeleton-row">
                    {columns.map((col, k) => (
                      <div key={k} className="dtg-skeleton-cell dtg-skeleton-pulse" />
                    ))}
                  </div>
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
      <div className={`dtg-container ${className}`} {...props}>
        <SearchBar value={searchValue} onChange={onSearchChange} />
        <div className="dtg-empty-state">
          <div className="dtg-empty-content">
            <div className="dtg-empty-icon">
              <Eye className="dtg-icon" />
            </div>
            <h3 className="dtg-empty-title">{emptyMessage}</h3>
            <p className="dtg-empty-description">{emptyDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dtg-container ${className}`} {...props}>
      {/* 🔍 SEARCH BAR */}
      <SearchBar value={searchValue} onChange={onSearchChange} />

      {/* 📊 TABLE */}
      <div className="dtg-table-wrapper">
        <table className="dtg-table" ref={tableRef}>
          {/* 📋 STICKY HEADER */}
          <thead className="dtg-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`dtg-header-cell ${column.sortable ? 'dtg-header-cell--sortable' : ''}`}
                  onClick={column.sortable ? () => handleSort(column.sortKey || column.key) : undefined}
                >
                  <div className="dtg-header-content">
                    <span className="dtg-header-label">{column.label}</span>
                    {column.sortable && (
                      <div className="dtg-sort-indicator">
                        {sortField === (column.sortKey || column.key) ? (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="dtg-sort-icon dtg-sort-icon--active" /> : 
                            <ChevronDown className="dtg-sort-icon dtg-sort-icon--active" />
                        ) : (
                          <ChevronUp className="dtg-sort-icon" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="dtg-header-cell dtg-header-cell--actions">
                <span className="dtg-header-label">Acciones</span>
              </th>
            </tr>
          </thead>

          {/* 📋 TABLE BODY WITH GROUPS */}
          <tbody className="dtg-body">
            <AnimatePresence>
              {filteredAndSortedGroups.map((group) => (
                <React.Fragment key={group.clientId || 'no-client'}>
                  {/* GROUP HEADER */}
                  <GroupHeader
                    group={group}
                    isCollapsed={collapsedGroups.has(group.clientId)}
                    onToggle={() => handleGroupToggle(group.clientId)}
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                  
                  {/* GROUP PROJECTS */}
                  {!collapsedGroups.has(group.clientId) && (
                    <AnimatePresence>
                      {group.projects.map((project, index) => (
                        <motion.tr
                          key={project.id || index}
                          className={`dtg-row ${hoveredRow === `${group.clientId}-${index}` ? 'dtg-row--hovered' : ''}`}
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ delay: index * 0.02 }}
                          onMouseEnter={() => setHoveredRow(`${group.clientId}-${index}`)}
                          onMouseLeave={() => setHoveredRow(null)}
                        >
                          {columns.map((column) => (
                            <td key={column.key} className="dtg-cell">
                              {column.render ? column.render(project) : project[column.key]}
                            </td>
                          ))}
                          <td className="dtg-cell dtg-cell--actions">
                            <ActionCell project={project} onView={onView} />
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 📊 PAGINATION INFO */}
      <div className="dtg-footer">
        <div className="dtg-pagination-info">
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
        </div>
      </div>
    </div>
  );
};

export default DataTableGrouped;
