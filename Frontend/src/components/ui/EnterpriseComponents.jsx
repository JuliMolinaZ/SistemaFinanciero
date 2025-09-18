// 🏗️ COMPONENTES ENTERPRISE - SISTEMA UNIFICADO
// ===============================================

import React from 'react';
import { TrendingUp, TrendingDown, Minus, ArrowRight, MoreVertical, Eye, Edit, Plus, Users, BarChart3 } from 'lucide-react';
import './enterprise-system.css';

// 🏷️ BADGE SEMÁNTICO ENTERPRISE
export function Badge({ variant = 'neutral', children, className = '', ...props }) {
  return (
    <span 
      className={`enterprise-badge enterprise-badge--${variant} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}

// 📊 PROGRESS BAR ACCESIBLE
export function Progress({ 
  value, 
  max = 100, 
  label, 
  variant = 'primary',
  showLabel = true,
  className = '',
  ...props 
}) {
  const percentage = Math.round((value / max) * 100);
  
  return (
    <div className={`enterprise-progress-container ${className}`} {...props}>
      {showLabel && (
        <div className="enterprise-flex-between enterprise-mb-2">
          <span className="enterprise-body">{label}</span>
          <span className="enterprise-body" style={{ fontWeight: 600, fontVariantNumeric: 'tabular-nums' }}>
            {percentage}%
          </span>
        </div>
      )}
      <div 
        className="enterprise-progress"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label}
      >
        <div 
          className={`enterprise-progress-bar enterprise-progress-bar--${variant}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

// 🔘 SISTEMA DE BOTONES ENTERPRISE
export function Button({ 
  variant = 'primary', 
  size = 'md',
  icon: Icon,
  children,
  className = '',
  disabled = false,
  ...props 
}) {
  const sizeClass = size === 'sm' ? 'enterprise-button--sm' : 'enterprise-button--md';
  
  return (
    <button 
      className={`enterprise-button enterprise-button--${variant} ${sizeClass} ${className}`}
      disabled={disabled}
      {...props}
    >
      {Icon && <Icon className="enterprise-button-icon" />}
      {children}
    </button>
  );
}

// 🔗 LINK BUTTON ENTERPRISE
export function LinkButton({ 
  icon: Icon,
  children,
  className = '',
  ...props 
}) {
  return (
    <button 
      className={`enterprise-link-button ${className}`}
      {...props}
    >
      {children}
      {Icon && <Icon className="enterprise-link-icon" />}
    </button>
  );
}

// 📋 PROJECT CARD ENTERPRISE
export function ProjectCard({ 
  project, 
  index = 0, 
  onView, 
  onEdit,
  className = '',
  ...props 
}) {
  const getStatusVariant = (status) => {
    switch (status) {
      case 'active': return 'success';
      case 'planning': return 'neutral';
      case 'completed': return 'primary';
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

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      case 'low': return 'success';
      default: return 'neutral';
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

  return (
    <div
      className={`enterprise-project-card ${className}`}
      onClick={() => onView && onView(project)}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onView && onView(project);
        }
      }}
      {...props}
    >
      {/* Header */}
      <div className="enterprise-flex-between enterprise-mb-3">
        <div style={{ flex: 1, marginRight: '12px' }}>
          <h3 className="enterprise-project-name">
            {project.name || project.nombre}
          </h3>
          {(project.description || project.descripcion) && (
            <p className="enterprise-project-description">
              {project.description || project.descripcion}
            </p>
          )}
        </div>
        <button
          className="enterprise-icon-button"
          onClick={(e) => e.stopPropagation()}
          aria-label="Más opciones"
        >
          <MoreVertical className="enterprise-button-icon" />
        </button>
      </div>

      {/* Badges */}
      <div className="enterprise-flex enterprise-flex-gap-2 enterprise-mb-4" style={{ flexWrap: 'wrap' }}>
        <Badge variant={getStatusVariant(project.status)}>
          {getStatusLabel(project.status)}
        </Badge>
        <Badge variant={getPriorityVariant(project.priority)}>
          Prioridad {getPriorityLabel(project.priority)}
        </Badge>
      </div>

      {/* Progreso */}
      {project.progress !== undefined && (
        <div className="enterprise-mb-4">
          <Progress
            value={project.progress}
            max={100}
            label="Progreso del proyecto"
            variant={project.progress >= 80 ? 'success' : project.progress >= 50 ? 'primary' : 'warning'}
          />
        </div>
      )}

      {/* Acciones */}
      <div className="enterprise-flex enterprise-flex-gap-2" style={{ justifyContent: 'flex-end' }}>
        <Button
          variant="ghost"
          size="sm"
          icon={Eye}
          onClick={(e) => {
            e.stopPropagation();
            onView && onView(project);
          }}
        >
          Ver
        </Button>
        <Button
          variant="outline"
          size="sm"
          icon={Edit}
          onClick={(e) => {
            e.stopPropagation();
            onEdit && onEdit(project);
          }}
        >
          Editar
        </Button>
      </div>
    </div>
  );
}

// 📊 PANEL LATERAL ENTERPRISE
export function SidePanel({ metrics, className = '', ...props }) {
  return (
    <div className={`enterprise-side-panel ${className}`} {...props}>
      {/* Acciones rápidas enterprise */}
      <div className="enterprise-action-panel enterprise-mb-6">
        <h3 className="enterprise-action-title">
          Acciones Rápidas
        </h3>
        
        <div className="enterprise-button-group">
          <button
            className="enterprise-button enterprise-button--primary"
            onClick={() => console.log('New project')}
          >
            <Plus className="enterprise-button-icon" />
            Nuevo Proyecto
          </button>
          
          <button
            className="enterprise-button enterprise-button--outline"
            onClick={() => console.log('Manage teams')}
          >
            <Users className="enterprise-button-icon" />
            Gestionar Equipos
          </button>
          
          <button
            className="enterprise-button enterprise-button--ghost"
            onClick={() => console.log('View reports')}
          >
            <BarChart3 className="enterprise-button-icon" />
            Ver Reportes
          </button>
        </div>
      </div>

      {/* Progreso general enterprise */}
      <div className="enterprise-action-panel">
        <h3 className="enterprise-action-title">
          Progreso General
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <Progress
            value={metrics?.projectCompletionRate || 0}
            label="Proyectos Completados"
            variant={metrics?.projectCompletionRate >= 80 ? 'success' : 'primary'}
          />
          
          <Progress
            value={metrics?.taskCompletionRate || 0}
            label="Tareas Completadas"
            variant={metrics?.taskCompletionRate >= 70 ? 'success' : 'warning'}
          />
          
          <Progress
            value={Math.min((metrics?.activeSprints || 0) * 25, 100)}
            label="Sprints Activos"
            variant="primary"
          />
        </div>
      </div>
    </div>
  );
}
