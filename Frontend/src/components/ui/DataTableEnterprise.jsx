// 📊 DATA TABLE ENTERPRISE - DISEÑO SOBRIO Y FUTURISTA
// =====================================================

import React, { useState, useMemo } from 'react';
import {
  Search,
  ChevronUp,
  ChevronDown,
  Plus,
  ChevronDown as DropdownIcon
} from 'lucide-react';
import RowActions from './RowActions';
import { Badge, Button, Progress } from './EnterpriseComponents';
import { useNotify } from '../../hooks/useNotify.js';
import './enterprise-system.css';

// 🔄 COMPONENTE DE CAMBIO RÁPIDO DE FASE
const PhaseQuickChange = ({ project }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phases, setPhases] = useState([]);
  const notify = useNotify();

  const currentPhase = project.current_phase;

  // Cargar fases del proyecto cuando se abre el dropdown
  const loadPhases = async () => {
    if (phases.length > 0) return; // Ya cargadas

    try {
      const response = await fetch(`/api/projects/${project.id}/phases`);
      const data = await response.json();

      if (data.success) {
        setPhases(data.data.phases || []);
      }
    } catch (error) {
      console.error('Error loading phases:', error);
    }
  };

  // Cambiar fase del proyecto
  const changePhase = async (phaseId) => {
    if (phaseId === currentPhase?.id) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/projects/${project.id}/current-phase`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phaseId })
      });

      const data = await response.json();

      if (data.success) {
        // Actualizar la fase actual localmente (optimistic update)
        project.current_phase = data.data.current_phase;
        setIsOpen(false);

        // Mostrar notificación de éxito
        notify.success({
          title: 'Fase actualizada',
          description: `Fase cambiada a "${data.data.current_phase.name}"`
        });
      } else {
        notify.error({
          title: 'Error al cambiar fase',
          description: data.message || 'No se pudo actualizar la fase'
        });
      }
    } catch (error) {
      console.error('Error updating phase:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = () => {
    if (!isOpen) {
      loadPhases();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="enterprise-phase-dropdown">
      <button
        className={`enterprise-phase-trigger ${isOpen ? 'enterprise-phase-trigger--open' : ''}`}
        onClick={handleToggle}
        disabled={loading}
      >
        <Badge variant="soft" className="enterprise-phase-badge">
          {currentPhase?.name || 'Sin fase'}
        </Badge>
        <DropdownIcon className="enterprise-phase-icon" />
      </button>

      {isOpen && (
        <div className="enterprise-phase-menu">
          {phases.map((phase) => (
            <button
              key={phase.id}
              className={`enterprise-phase-option ${
                phase.id === currentPhase?.id ? 'enterprise-phase-option--active' : ''
              }`}
              onClick={() => changePhase(phase.id)}
              disabled={loading || phase.id === currentPhase?.id}
            >
              <span className="enterprise-phase-position">{phase.position + 1}</span>
              <span className="enterprise-phase-name">{phase.name}</span>
              {phase.id === currentPhase?.id && (
                <span className="enterprise-phase-current">✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      {loading && (
        <div className="enterprise-phase-loading">
          <div className="enterprise-spinner"></div>
        </div>
      )}
    </div>
  );
};

// 🔍 TOOLBAR DE FILTROS ENTERPRISE
export function FilterToolbar({ 
  searchValue, 
  onSearchChange,
  statusFilter,
  onStatusChange,
  priorityFilter,
  onPriorityChange,
  onClear,
  className = '',
  ...props 
}) {
  return (
    <section 
      className={`enterprise-filter-toolbar ${className}`}
      {...props}
    >
      <div className="enterprise-filter-grid">
        {/* Search */}
        <div className="enterprise-search-container">
          <Search className="enterprise-search-icon" />
          <input
            type="text"
            placeholder="Buscar proyectos..."
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            className="enterprise-search-input"
          />
        </div>

        {/* Estado */}
        <select
          value={statusFilter}
          onChange={(e) => onStatusChange(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">Todos</option>
          <option value="active">Activo</option>
          <option value="planning">Planificación</option>
          <option value="completed">Completado</option>
        </select>

        {/* Prioridad */}
        <select
          value={priorityFilter}
          onChange={(e) => onPriorityChange(e.target.value)}
          className="enterprise-select"
        >
          <option value="all">Todas</option>
          <option value="high">Alta</option>
          <option value="medium">Media</option>
          <option value="low">Baja</option>
        </select>

        {/* Acciones */}
        <div className="enterprise-filter-actions">
          <Button variant="ghost" size="sm" onClick={onClear}>
            Limpiar
          </Button>
        </div>
      </div>
    </section>
  );
}

// 🎯 ICON BUTTON ENTERPRISE
export function IconButton({ 
  icon: Icon, 
  tooltip, 
  variant = 'ghost',
  onClick,
  className = '',
  ...props 
}) {
  return (
    <button
      className={`enterprise-icon-btn enterprise-icon-btn--${variant} ${className}`}
      onClick={onClick}
      title={tooltip}
      aria-label={tooltip}
      {...props}
    >
      <Icon className="enterprise-icon-btn-icon" />
    </button>
  );
}

// 📊 DATA TABLE ENTERPRISE
export function DataTableEnterprise({
  data = [],
  columns = [],
  onSort,
  sortField,
  sortDirection,
  className = '',
  ...props
}) {
  const [hoveredRow, setHoveredRow] = useState(null);
  const notify = useNotify();

  return (
    <div className={`enterprise-table-container ${className}`} {...props}>
      <div className="enterprise-table-wrapper">
        <table className="enterprise-table">
          {/* Header sticky */}
          <thead className="enterprise-table-header">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={`enterprise-table-th ${column.sortable ? 'enterprise-table-th--sortable' : ''}`}
                  onClick={column.sortable ? () => onSort(column.key) : undefined}
                >
                  <div className="enterprise-table-th-content">
                    {column.label}
                    {column.sortable && (
                      <div className="enterprise-sort-icon">
                        {sortField === column.key ? (
                          sortDirection === 'asc' ? 
                            <ChevronUp className="w-4 h-4" /> : 
                            <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronUp className="w-4 h-4 opacity-30" />
                        )}
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>

          {/* Body */}
          <tbody className="enterprise-table-body">
            {data.map((row, index) => (
              <tr
                key={row.id || index}
                className={`enterprise-table-row ${hoveredRow === index ? 'enterprise-table-row--hovered' : ''}`}
                onMouseEnter={() => setHoveredRow(index)}
                onMouseLeave={() => setHoveredRow(null)}
              >
                {columns.map((column) => (
                  <td key={column.key} className="enterprise-table-td">
                    {column.render ? column.render(row, index) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// 📋 PROJECT LIST ENTERPRISE
export function ProjectListEnterprise({ 
  projects = [],
  onView,
  onEdit,
  onDelete,
  onExport,
  className = '',
  ...props 
}) {
  const [searchValue, setSearchValue] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Filtros y ordenamiento con agrupación por cliente
  const { filteredProjects, groupedByClient } = useMemo(() => {
    let filtered = [...projects];

    // Búsqueda
    if (searchValue) {
      filtered = filtered.filter(project =>
        project.name?.toLowerCase().includes(searchValue.toLowerCase()) ||
        project.nombre?.toLowerCase().includes(searchValue.toLowerCase()) ||
        project.description?.toLowerCase().includes(searchValue.toLowerCase()) ||
        project.descripcion?.toLowerCase().includes(searchValue.toLowerCase()) ||
        project.client?.nombre?.toLowerCase().includes(searchValue.toLowerCase())
      );
    }

    // Filtros
    if (statusFilter !== 'all') {
      filtered = filtered.filter(project => project.status === statusFilter);
    }

    if (priorityFilter !== 'all') {
      filtered = filtered.filter(project => project.priority === priorityFilter);
    }

    // Ordenamiento
    filtered.sort((a, b) => {
      let aValue = a[sortField] || '';
      let bValue = b[sortField] || '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortDirection === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    // Agrupar por cliente para mejor organización
    const grouped = filtered.reduce((acc, project) => {
      const clientName = project.client?.nombre || 'Sin Cliente';
      if (!acc[clientName]) {
        acc[clientName] = [];
      }
      acc[clientName].push(project);
      return acc;
    }, {});

    return { filteredProjects: filtered, groupedByClient: grouped };
  }, [projects, searchValue, statusFilter, priorityFilter, sortField, sortDirection]);

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const handleClear = () => {
    setSearchValue('');
    setStatusFilter('all');
    setPriorityFilter('all');
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'planning': return 'neutral';
      case 'completed': return 'neutral';
      default: return 'neutral';
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'neutral';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'active': return 'Activo';
      case 'planning': return 'Planificación';
      case 'completed': return 'Completado';
      default: return 'Desconocido';
    }
  };

  const getPriorityLabel = (priority) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Media';
      case 'low': return 'Baja';
      default: return 'Normal';
    }
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('es-ES', { 
      day: '2-digit', 
      month: '2-digit', 
      year: '2-digit' 
    });
  };

  const columns = [
    {
      key: 'name',
      label: 'Proyecto',
      sortable: true,
      render: (project) => (
        <div>
          <div className="enterprise-project-name">
            {project.name || project.nombre}
          </div>
          <div className="enterprise-project-description">
            {project.description || project.descripcion || 'Sin descripción'}
          </div>
        </div>
      )
    },
    {
      key: 'client',
      label: 'Cliente',
      sortable: false,
      render: (project) => (
        <span className="enterprise-table-muted">
          {project.client?.nombre || 'Sin cliente'}
        </span>
      )
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: true,
      render: (project) => (
        <Badge variant={getStatusVariant(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
      )
    },
    {
      key: 'priority',
      label: 'Prioridad',
      sortable: true,
      render: (project) => (
        <Badge variant={getPriorityVariant(project.priority)}>
          {getPriorityLabel(project.priority)}
        </Badge>
      )
    },
    {
      key: 'progress',
      label: 'Progreso',
      sortable: true,
      render: (project) => (
        <div className="enterprise-progress-cell">
          <Progress 
            value={project.progress || 0} 
            showLabel={false}
            variant={project.progress >= 80 ? 'success' : project.progress >= 50 ? 'primary' : 'warning'}
          />
          <span className="enterprise-progress-percentage">
            {project.progress || 0}%
          </span>
        </div>
      )
    },
    {
      key: 'team',
      label: 'Equipos',
      sortable: false,
      render: (project) => {
        const operationsTeam = project.members?.filter(m => m.team_type === 'operations') || [];
        const itTeam = project.members?.filter(m => m.team_type === 'it') || [];
        
        return (
          <div className="enterprise-teams-cell">
            {operationsTeam.length > 0 && (
              <div className="enterprise-team-badge enterprise-team-badge--operations">
                Ops: {operationsTeam.length}
              </div>
            )}
            {itTeam.length > 0 && (
              <div className="enterprise-team-badge enterprise-team-badge--it">
                TI: {itTeam.length}
              </div>
            )}
            {operationsTeam.length === 0 && itTeam.length === 0 && (
              <span className="enterprise-table-muted">Sin equipo</span>
            )}
          </div>
        );
      }
    },
    {
      key: 'phase',
      label: 'Fase',
      sortable: false,
      render: (project) => <PhaseQuickChange project={project} />
    },
    {
      key: 'end_date',
      label: 'Fecha Fin',
      sortable: true,
      render: (project) => {
        if (!project.end_date) {
          return <span className="enterprise-table-muted">N/A</span>;
        }

        try {
          const date = new Date(project.end_date);
          return (
            <span className="enterprise-table-text">
              {date.toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </span>
          );
        } catch (error) {
          return <span className="enterprise-table-muted">N/A</span>;
        }
      }
    },
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (project) => (
        <RowActions
          project={project}
          onUpdate={() => {
            // Callback para refrescar la tabla
            console.log('🔄 Refrescando tabla después de actualizar proyecto');
            // Aquí podrías llamar a una función para recargar los datos
          }}
        />
      )
    }
  ];

  if (filteredProjects.length === 0) {
    return (
      <div className="enterprise-empty-state">
        <div className="enterprise-empty-content">
          <Plus className="enterprise-empty-icon" />
          <h3 className="enterprise-empty-title">No hay proyectos</h3>
          <p className="enterprise-empty-description">
            {searchValue || statusFilter !== 'all' || priorityFilter !== 'all' 
              ? 'No se encontraron proyectos con los filtros aplicados'
              : 'Aún no tienes proyectos creados. ¡Crea tu primer proyecto para comenzar!'
            }
          </p>
          <Button 
            variant="primary" 
            icon={Plus} 
            onClick={() => {
              console.log('🚀 Creando proyecto desde empty state');
              // Llamar a función global para crear proyecto
              if (window.createNewProject) {
                window.createNewProject();
              } else {
                notify.info({
                  title: 'Próximamente',
                  description: 'La funcionalidad de crear proyecto estará disponible pronto'
                });
              }
            }}
          >
            Crear Primer Proyecto
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className={className} {...props}>
      {/* Toolbar de filtros */}
      <FilterToolbar
        searchValue={searchValue}
        onSearchChange={setSearchValue}
        statusFilter={statusFilter}
        onStatusChange={setStatusFilter}
        priorityFilter={priorityFilter}
        onPriorityChange={setPriorityFilter}
        onClear={handleClear}
        className="enterprise-mb-6"
      />

      {/* Data table agrupada por cliente */}
      <div className="enterprise-table-container">
        <div className="enterprise-table-wrapper">
          <table className="enterprise-table">
            {/* Header sticky */}
            <thead className="enterprise-table-header">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className={`enterprise-table-th ${column.sortable ? 'enterprise-table-th--sortable' : ''}`}
                    onClick={column.sortable ? () => handleSort(column.key) : undefined}
                  >
                    <div className="enterprise-table-th-content">
                      {column.label}
                      {column.sortable && (
                        <div className="enterprise-sort-icon">
                          {sortField === column.key ? (
                            sortDirection === 'asc' ? 
                              <ChevronUp className="w-4 h-4" /> : 
                              <ChevronDown className="w-4 h-4" />
                          ) : (
                            <ChevronUp className="w-4 h-4 opacity-30" />
                          )}
                        </div>
                      )}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>

            {/* Body agrupado por cliente */}
            <tbody className="enterprise-table-body">
              {Object.entries(groupedByClient).map(([clientName, clientProjects]) => (
                <React.Fragment key={clientName}>
                  {/* Header del cliente */}
                  <tr className="enterprise-client-header">
                    <td colSpan={columns.length} className="enterprise-client-header-cell">
                      <div className="enterprise-client-info">
                        <h3 className="enterprise-client-name">{clientName}</h3>
                        <span className="enterprise-client-count">
                          {clientProjects.length} proyecto{clientProjects.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                    </td>
                  </tr>
                  
                  {/* Proyectos del cliente */}
                  {clientProjects.map((project, index) => (
                    <tr
                      key={project.id}
                      className="enterprise-table-row enterprise-project-row"
                    >
                      {columns.map((column) => (
                        <td key={column.key} className="enterprise-table-td">
                          {column.render ? column.render(project, index) : project[column.key]}
                        </td>
                      ))}
                    </tr>
                  ))}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Paginación */}
      <div className="enterprise-pagination">
        <span className="enterprise-pagination-info">
          Mostrando {filteredProjects.length} de {projects.length} proyectos
        </span>
      </div>
    </div>
  );
}
