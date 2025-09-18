// 👁️ PROJECT VIEW DIALOG - MODAL DE LECTURA
// ==========================================

import React from 'react';
import { X, Eye } from 'lucide-react';
import { Button } from '../ui/Button';
import '../ui/enterprise-system.css';

// 🎯 COMPONENTE PRINCIPAL
const ProjectViewDialog = ({ open, onOpenChange, project }) => {
  if (!open || !project) return null;

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (error) {
      return 'N/A';
    }
  };

  // Formatear estado
  const formatStatus = (status) => {
    const statusMap = {
      'active': 'Activo',
      'planning': 'Planificación',
      'completed': 'Completado',
      'on_hold': 'En pausa',
      'cancelled': 'Cancelado'
    };
    return statusMap[status] || status;
  };

  // Formatear prioridad
  const formatPriority = (priority) => {
    const priorityMap = {
      'low': 'Baja',
      'medium': 'Media',
      'high': 'Alta',
      'critical': 'Crítica'
    };
    return priorityMap[priority] || priority;
  };

  // Contar equipos
  const operationsTeam = project.members?.filter(m => m.team_type === 'operations') || [];
  const itTeam = project.members?.filter(m => m.team_type === 'it') || [];

  return (
    <div className="enterprise-modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="enterprise-modal-content" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="enterprise-modal-header">
          <div className="enterprise-modal-header-content">
            <Eye className="enterprise-modal-icon" size={24} />
            <h2 className="enterprise-modal-title">
              Ver Proyecto
            </h2>
          </div>
          <button
            className="enterprise-icon-button"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="enterprise-modal-body">
          {/* Información básica */}
          <div className="enterprise-view-section">
            <h3 className="enterprise-view-section-title">Información General</h3>
            
            <div className="enterprise-view-field">
              <label className="enterprise-view-label">Nombre del Proyecto</label>
              <p className="enterprise-view-value">{project.nombre || project.name}</p>
            </div>

            <div className="enterprise-view-field">
              <label className="enterprise-view-label">Descripción</label>
              <p className="enterprise-view-value">
                {project.descripcion || project.description || 'Sin descripción'}
              </p>
            </div>

            <div className="enterprise-view-row">
              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Cliente</label>
                <p className="enterprise-view-value">
                  {project.client?.nombre || 'Sin cliente'}
                </p>
              </div>

              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Estado</label>
                <p className="enterprise-view-value">
                  {formatStatus(project.status)}
                </p>
              </div>
            </div>

            <div className="enterprise-view-row">
              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Prioridad</label>
                <p className="enterprise-view-value">
                  {formatPriority(project.priority)}
                </p>
              </div>

              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Progreso</label>
                <p className="enterprise-view-value">
                  {project.progress || 0}%
                </p>
              </div>
            </div>
          </div>

          {/* Fechas */}
          <div className="enterprise-view-section">
            <h3 className="enterprise-view-section-title">Cronograma</h3>
            
            <div className="enterprise-view-row">
              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Fecha de Inicio</label>
                <p className="enterprise-view-value">
                  {formatDate(project.start_date)}
                </p>
              </div>

              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Fecha de Fin</label>
                <p className="enterprise-view-value">
                  {formatDate(project.end_date)}
                </p>
              </div>
            </div>
          </div>

          {/* Equipos */}
          <div className="enterprise-view-section">
            <h3 className="enterprise-view-section-title">Equipos de Trabajo</h3>
            
            <div className="enterprise-view-row">
              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Equipo de Operaciones</label>
                <p className="enterprise-view-value">
                  {operationsTeam.length > 0 ? (
                    <>
                      {operationsTeam.length} miembro{operationsTeam.length !== 1 ? 's' : ''}
                      <br />
                      <span className="enterprise-view-team-list">
                        {operationsTeam.map(member => member.user?.name).join(', ')}
                      </span>
                    </>
                  ) : (
                    'Sin miembros asignados'
                  )}
                </p>
              </div>

              <div className="enterprise-view-field">
                <label className="enterprise-view-label">Equipo de TI</label>
                <p className="enterprise-view-value">
                  {itTeam.length > 0 ? (
                    <>
                      {itTeam.length} miembro{itTeam.length !== 1 ? 's' : ''}
                      <br />
                      <span className="enterprise-view-team-list">
                        {itTeam.map(member => member.user?.name).join(', ')}
                      </span>
                    </>
                  ) : (
                    'Sin miembros asignados'
                  )}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="enterprise-modal-footer">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProjectViewDialog;
