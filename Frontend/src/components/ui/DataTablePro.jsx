// 📊 DATA TABLE PRO - DISEÑO ULTRA MODERNO CON SINGLE ACTION
// =========================================================

import React, { useState, useMemo, useCallback, useRef, useEffect } from 'react';
import { Eye, ChevronUp, ChevronDown, Search, Filter, X, MoreHorizontal } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNotify } from '../../hooks/useNotify.js';
import './datatable-pro.css';

// 🎯 ICON BUTTON LIMPIO
const IconButton = ({ 
  children, 
  onClick, 
  'aria-label': ariaLabel, 
  tooltip,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  className = '',
  ...props 
}) => (
  <button
    className={`dt-icon-btn dt-icon-btn--${variant} dt-icon-btn--${size} ${className}`}
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
    className={`dt-badge dt-badge--${variant} dt-badge--${size} ${className}`}
    {...props}
  >
    {children}
  </span>
);

// 📊 PROGRESS BAR
const ProgressBar = ({ value = 0, showLabel = true, variant = 'primary', className = '', ...props }) => (
  <div className={`dt-progress-container ${className}`} {...props}>
    <div className="dt-progress-track">
      <div 
        className={`dt-progress-fill dt-progress-fill--${variant}`}
        style={{ width: `${Math.max(0, Math.min(100, value))}%` }}
      />
    </div>
    {showLabel && (
      <span className="dt-progress-label tabular-nums">
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
    return <span className="dt-text-muted">Sin equipo</span>;
  }

  return (
    <div className="dt-team-chips">
      {operationsTeam.length > 0 && (
        <span className="dt-team-chip dt-team-chip--ops">
          Ops: {operationsTeam.length}
        </span>
      )}
      {itTeam.length > 0 && (
        <span className="dt-team-chip dt-team-chip--it">
          TI: {itTeam.length}
        </span>
      )}
    </div>
  );
};

// 🎯 SINGLE ACTION CELL - SOLO BOTÓN "VER"
const ActionCell = ({ project, onView }) => (
  <div className="dt-action-cell">
    <IconButton
      onClick={(e) => {
        e.stopPropagation();
        onView?.(project);
      }}
      aria-label={`Ver proyecto ${project.nombre || project.name}`}
      tooltip="Ver"
      variant="ghost"
      size="sm"
      className="dt-view-action"
    >
      <Eye className="dt-icon" />
    </IconButton>
  </div>
);

// 🔍 SEARCH BAR
const SearchBar = ({ value, onChange, placeholder = "Buscar proyectos..." }) => (
  <div className="dt-search-container">
    <Search className="dt-search-icon" />
    <input
      type="text"
      className="dt-search-input"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
    {value && (
      <button
        className="dt-search-clear"
        onClick={() => onChange('')}
        aria-label="Limpiar búsqueda"
      >
        <X className="dt-icon" />
      </button>
    )}
  </div>
);

// 📊 MAIN DATA TABLE PRO COMPONENT
const DataTablePro = ({
  data = [],
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
  const [hoveredRow, setHoveredRow] = useState(null);
  const tableRef = useRef(null);

  // 🔄 FILTRADO Y ORDENAMIENTO
  const filteredAndSortedData = useMemo(() => {
    let result = [...data];

    // Filtro de búsqueda
    if (searchValue) {
      const searchLower = searchValue.toLowerCase();
      result = result.filter(item => 
        (item.nombre?.toLowerCase().includes(searchLower)) ||
        (item.name?.toLowerCase().includes(searchLower)) ||
        (item.descripcion?.toLowerCase().includes(searchLower)) ||
        (item.description?.toLowerCase().includes(searchLower)) ||
        (item.client?.nombre?.toLowerCase().includes(searchLower))
      );
    }

    // Ordenamiento
    result.sort((a, b) => {
      let aValue = a[sortField];
      let bValue = b[sortField];

      // Manejo especial para campos anidados
      if (sortField === 'client') {
        aValue = a.client?.nombre || '';
        bValue = b.client?.nombre || '';
      }

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

    return result;
  }, [data, searchValue, sortField, sortDirection]);

  // 🎯 HANDLE SORT
  const handleSort = useCallback((field) => {
    if (sortField === field) {
      setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  }, [sortField]);

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
        <div className="dt-project-cell">
          <div className="dt-project-name">
            {project.nombre || project.name || 'Sin nombre'}
          </div>
          <div className="dt-project-description">
            {project.descripcion || project.description || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      key: 'cliente',
      label: 'Cliente',
      sortable: true,
      sortKey: 'client',
      render: (project) => (
        <span className="dt-text-secondary">
          {project.client?.nombre || 'Sin cliente'}
        </span>
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
      key: 'fecha_fin',
      label: 'Fecha Fin',
      sortable: true,
      sortKey: 'end_date',
      render: (project) => (
        <span className="dt-text-secondary tabular-nums">
          {formatDate(project.end_date)}
        </span>
      )
    }
  ];

  // 🎭 LOADING STATE
  if (loading) {
    return (
      <div className={`dt-container ${className}`} {...props}>
        <div className="dt-loading">
          <div className="dt-skeleton-table">
            {/* Header skeleton */}
            <div className="dt-skeleton-header">
              {columns.map((col, i) => (
                <div key={i} className="dt-skeleton-cell dt-skeleton-pulse" />
              ))}
            </div>
            {/* Rows skeleton */}
            {Array.from({ length: 8 }, (_, i) => (
              <div key={i} className="dt-skeleton-row">
                {columns.map((col, j) => (
                  <div key={j} className="dt-skeleton-cell dt-skeleton-pulse" />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // 🎭 EMPTY STATE
  if (filteredAndSortedData.length === 0) {
    return (
      <div className={`dt-container ${className}`} {...props}>
        <div className="dt-empty-state">
          <div className="dt-empty-content">
            <div className="dt-empty-icon">
              <Eye className="dt-icon" />
            </div>
            <h3 className="dt-empty-title">{emptyMessage}</h3>
            <p className="dt-empty-description">{emptyDescription}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`dt-container ${className}`} {...props}>
      {/* 📊 TABLE */}
      <div className="dt-table-wrapper">
        <table className="dt-table" ref={tableRef}>
          {/* 📋 STICKY HEADER */}
          <thead className="dt-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`dt-header-cell ${column.sortable ? 'dt-header-cell--sortable' : ''}`}
                  onClick={column.sortable ? () => handleSort(column.sortKey || column.key) : undefined}
                >
                  <div className="dt-header-content">
                    <span className="dt-header-label">{column.label}</span>
                    {column.sortable && (
                      <div className="dt-sort-indicator">
                        {sortField === (column.sortKey || column.key) ? (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="dt-sort-icon dt-sort-icon--active" /> : 
                            <ChevronDown className="dt-sort-icon dt-sort-icon--active" />
                        ) : (
                          <ChevronUp className="dt-sort-icon" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
              <th className="dt-header-cell dt-header-cell--actions">
                <span className="dt-header-label">Acciones</span>
              </th>
            </tr>
          </thead>

          {/* 📋 TABLE BODY */}
          <tbody className="dt-body">
            <AnimatePresence>
              {filteredAndSortedData.map((project, index) => (
                <motion.tr
                  key={project.id || index}
                  className={`dt-row ${hoveredRow === index ? 'dt-row--hovered' : ''}`}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ delay: index * 0.02 }}
                  onMouseEnter={() => setHoveredRow(index)}
                  onMouseLeave={() => setHoveredRow(null)}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="dt-cell">
                      {column.render ? column.render(project) : project[column.key]}
                    </td>
                  ))}
                  <td className="dt-cell dt-cell--actions">
                    <ActionCell project={project} onView={onView} />
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* 📊 PAGINATION INFO */}
      <div className="dt-footer">
        <div className="dt-pagination-info">
          Mostrando <span className="tabular-nums">{filteredAndSortedData.length}</span> de{' '}
          <span className="tabular-nums">{data.length}</span> proyectos
        </div>
      </div>
    </div>
  );
};

export default DataTablePro;
