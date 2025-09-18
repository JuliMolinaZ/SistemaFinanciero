// 📋 PROJECT TABLE ONLY - TABLA SIMPLE Y ATRACTIVA
// =================================================

import React, { useState, useMemo, useCallback } from 'react';
import ProjectTablePure from './ProjectTablePure';
import ProjectDialogWorking from '../../../components/ui/ProjectDialogWorking';

// 🔍 TOOLBAR SIMPLE
const SimpleToolbar = ({ 
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
            placeholder="Buscar proyecto, cliente o estado..."
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
          Exportar
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

// 📋 TABLA SIMPLE DE PROYECTOS
const SimpleProjectTable = ({ groups, onView, sortField, sortDirection, onSort }) => {
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

  // Si no hay grupos, mostrar tabla plana
  if (groups.length === 0) {
    return (
      <div className="enterprise-table">
        <div className="enterprise-table-header">
          <SortButton field="nombre">Proyecto</SortButton>
          <div>Cliente</div>
          <div>Estado</div>
          <div>Prioridad</div>
          <SortButton field="progress">Progreso</SortButton>
          <div>Equipo</div>
          <SortButton field="end_date">Fecha Fin</SortButton>
          <div style={{ textAlign: 'center' }}>Acción</div>
        </div>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center', 
          padding: '4rem 2rem',
          color: 'var(--enterprise-text-secondary)' 
        }}>
          No hay proyectos disponibles
        </div>
      </div>
    );
  }

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
                          onClick={(e) => onView(project, e.currentTarget.closest('.enterprise-project-row'))}
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

// 🏗️ COMPONENTE PRINCIPAL - TABLA ULTRA MODERNA
const ProjectTableOnly = ({
  projects = [],
  groups = [],
  onView,
  onEdit,
  onDelete,
  loading = false
}) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState('view'); // 'view' or 'edit'

  const handleView = useCallback((project, rowElement = null) => {
    console.log('👁️ Ver proyecto:', project.nombre || project.name);

    // OPCIONAL: Centrar la fila antes de abrir el modal
    if (rowElement) {
      console.log('📍 Centrando fila antes de abrir modal...');
      rowElement.scrollIntoView({
        block: 'center',
        behavior: 'smooth'
      });

      // Esperar un poco para que termine el scroll antes de abrir
      setTimeout(() => {
        setSelectedProject(project);
        setDrawerMode('view');
        setDrawerOpen(true);
        onView?.(project);
      }, 200);
    } else {
      // Abrir inmediatamente si no hay elemento
      setSelectedProject(project);
      setDrawerMode('view');
      setDrawerOpen(true);
      onView?.(project);
    }
  }, [onView]);

  const handleEdit = useCallback((project) => {
    console.log('✏️ Editar proyecto:', project.nombre || project.name);
    setSelectedProject(project);
    setDrawerMode('edit');
    setDrawerOpen(true);
  }, []);

  const handleDelete = useCallback((project) => {
    console.log('🗑️ Solicitud de eliminar proyecto:', project.nombre || project.name);
    
    // Crear confirmación elegante
    const confirmed = window.confirm(
      `⚠️ ELIMINAR PROYECTO\n\n` +
      `¿Estás seguro de que quieres eliminar el proyecto:\n` +
      `"${project.nombre}"?\n\n` +
      `Esta acción no se puede deshacer.`
    );
    
    if (confirmed) {
      console.log('✅ Confirmado - Eliminando proyecto:', project.nombre);
      onDelete?.(project);
    } else {
      console.log('❌ Cancelado - No se eliminó el proyecto');
    }
  }, [onDelete]);

  return (
    <>
      <ProjectTablePure
        projects={projects}
        groups={groups}
        onView={handleView}
        onEdit={handleEdit}
        onDelete={handleDelete}
        loading={loading}
      />

      {/* PROJECT DIALOG - MODAL CENTRADO */}
      <ProjectDialogWorking
        open={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setSelectedProject(null);
          setDrawerMode('view');
        }}
        project={selectedProject}
        initialEditMode={drawerMode === 'edit'}
        onUpdate={(updatedProject) => {
          console.log('🔄 Proyecto actualizado:', updatedProject);
          onEdit?.(updatedProject);
          setSelectedProject(updatedProject);
          // Mantener el modal abierto para ver los cambios
        }}
        onDelete={(deletedProject) => {
          console.log('🗑️ Proyecto eliminado desde modal:', deletedProject);
          setDrawerOpen(false);
          setSelectedProject(null);
          setDrawerMode('view');
          onDelete?.(deletedProject);
        }}
      />
    </>
  );
};

export default ProjectTableOnly;
