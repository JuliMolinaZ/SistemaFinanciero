// 🎪 PROJECT DIALOG WORKING - MODAL CENTRADO AL VIEWPORT (FIXED)
// ===============================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Edit2,
  Save,
  Search,
  Plus,
  Users,
  Settings,
  UserPlus
} from 'lucide-react';
import { ProjectDialog, ProjectDialogHeader, ProjectDialogContent } from './ProjectDialog';
import { useNotifications } from '../../hooks/useNotifications';
import ConfirmDialog from './ConfirmDialog';
import './project-dialog.css';

// 🎯 SIMPLE BUTTON COMPONENT
const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon: Icon,
  onClick,
  className = ''
}) => {
  const baseClasses = 'pd-button';
  const variantClasses = {
    primary: 'pd-button--primary',
    secondary: 'pd-button--secondary',
    ghost: 'pd-button--ghost',
    danger: 'pd-button--danger'
  };
  const sizeClasses = {
    sm: 'pd-button--sm',
    md: 'pd-button--md',
    lg: 'pd-button--lg'
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
    >
      {loading ? (
        <div className="pd-button-loading">Cargando...</div>
      ) : (
        <>
          {Icon && <Icon className="pd-button-icon" />}
          {children}
        </>
      )}
    </button>
  );
};

// 📊 MAIN PROJECT DIALOG WORKING COMPONENT
const ProjectDialogWorking = ({
  open,
  onClose,
  project,
  onUpdate,
  onCreate,
  onDelete,
  phases = [],
  initialEditMode = false
}) => {
  const [isEditing, setIsEditing] = useState(initialEditMode);
  const [saving, setSaving] = useState(false);
  const [editData, setEditData] = useState({});

  const { notify, confirm } = useNotifications();

  // 🛡️ Early return if no project when modal is open
  if (!project && open) {
    return null;
  }

  // 🛡️ Default project data to prevent null errors
  const safeProject = project || {
    id: null,
    nombre: '',
    descripcion: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    client: null,
    cliente_id: null,
    current_phase_id: null,
    members: []
  };

  // Initialize edit data when project changes
  useEffect(() => {
    if (safeProject && safeProject.id) {
      setEditData({
        nombre: safeProject.nombre || '',
        descripcion: safeProject.descripcion || '',
        status: safeProject.status || 'planning',
        priority: safeProject.priority || 'medium',
        progress: safeProject.progress || 0,
        start_date: safeProject.start_date || '',
        end_date: safeProject.end_date || '',
        cliente_id: safeProject.cliente_id || '',
        current_phase_id: safeProject.current_phase_id || '',
        client_color: safeProject.client?.color || '#3B82F6'
      });
    }
  }, [safeProject]);

  // Handle edit mode toggle
  const handleEditToggle = () => {
    if (isEditing) {
      // Cancel editing - reset data
      setEditData({
        nombre: safeProject.nombre || '',
        descripcion: safeProject.descripcion || '',
        status: safeProject.status || 'planning',
        priority: safeProject.priority || 'medium',
        progress: safeProject.progress || 0,
        start_date: safeProject.start_date || '',
        end_date: safeProject.end_date || '',
        cliente_id: safeProject.cliente_id || '',
        current_phase_id: safeProject.current_phase_id || '',
        client_color: safeProject.client?.color || '#3B82F6'
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL || 'http://localhost:8765'}/api/projects-working/projects/${safeProject.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(editData)
      });

      const data = await response.json();
      
      if (data.success) {
        setIsEditing(false);
        onUpdate?.(data.data);
        notify.success({
          title: 'Proyecto actualizado',
          description: 'Los cambios se guardaron correctamente'
        });
      } else {
        console.error('❌ Error al guardar:', data.message);
        notify.error({
          title: 'Error al guardar',
          description: data.message || 'No se pudieron guardar los cambios'
        });
      }
    } catch (error) {
      console.error('Error saving project:', error);
      notify.error({
        title: 'Error de conexión',
        description: 'No se pudo conectar con el servidor'
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      {/* Main Project Dialog */}
      <ProjectDialog open={open} onClose={onClose}>
        <ProjectDialogHeader onClose={onClose}>
          <div className="pd-dialog-title">
            <h2>{safeProject.nombre || 'Proyecto'}</h2>
            <div className="pd-dialog-actions">
              <Button
                variant="ghost"
                size="sm"
                icon={isEditing ? X : Edit2}
                onClick={handleEditToggle}
              >
                {isEditing ? 'Cancelar' : 'Editar'}
              </Button>
              {isEditing && (
                <Button
                  variant="primary"
                  size="sm"
                  icon={Save}
                  loading={saving}
                  onClick={handleSave}
                >
                  Guardar
                </Button>
              )}
            </div>
          </div>
        </ProjectDialogHeader>
        <ProjectDialogContent>
          <div className="pd-content">
            {isEditing ? (
              <div className="pd-form">
                <h3>Información del Proyecto</h3>
                <div className="pd-form-group">
                  <label>Nombre del proyecto</label>
                  <input
                    type="text"
                    value={editData.nombre || ''}
                    onChange={(e) => setEditData({ ...editData, nombre: e.target.value })}
                    placeholder="Nombre del proyecto"
                  />
                </div>
                <div className="pd-form-group">
                  <label>Descripción</label>
                  <textarea
                    value={editData.descripcion || ''}
                    onChange={(e) => setEditData({ ...editData, descripcion: e.target.value })}
                    placeholder="Descripción del proyecto"
                    rows={4}
                  />
                </div>
                <div className="pd-form-row">
                  <div className="pd-form-group">
                    <label>Estado</label>
                    <select
                      value={editData.status || 'planning'}
                      onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                    >
                      <option value="planning">Planeación</option>
                      <option value="in_progress">En Progreso</option>
                      <option value="on_hold">En Pausa</option>
                      <option value="completed">Completado</option>
                      <option value="cancelled">Cancelado</option>
                    </select>
                  </div>
                  <div className="pd-form-group">
                    <label>Prioridad</label>
                    <select
                      value={editData.priority || 'medium'}
                      onChange={(e) => setEditData({ ...editData, priority: e.target.value })}
                    >
                      <option value="low">Baja</option>
                      <option value="medium">Media</option>
                      <option value="high">Alta</option>
                      <option value="critical">Crítica</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="pd-view">
                <h3>{safeProject.nombre}</h3>
                <p>{safeProject.descripcion}</p>
                <div className="pd-status-badges">
                  <span className={`pd-status-badge pd-status-${safeProject.status}`}>
                    {safeProject.status}
                  </span>
                  <span className={`pd-priority-badge pd-priority-${safeProject.priority}`}>
                    {safeProject.priority}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ProjectDialogContent>
      </ProjectDialog>

      {/* 🎭 Confirm Dialog */}
      {confirm.confirmState.open && (
        <ConfirmDialog
          open={confirm.confirmState.open}
          onClose={confirm.handleCancel}
          onConfirm={confirm.handleConfirm}
          {...confirm.confirmState.config}
        />
      )}
    </>
  );
};

export default ProjectDialogWorking;
