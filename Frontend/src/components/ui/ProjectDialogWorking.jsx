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
  const [users, setUsers] = useState([]);

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
        project_manager_id: safeProject.project_manager_id || '',
        client_color: safeProject.client?.color || '#3B82F6',
        members: safeProject.members || []
      });
    }
  }, [safeProject]);

  // Load users when modal opens
  useEffect(() => {
    if (open) {
      const loadUsers = async () => {
        try {
          const response = await fetch('http://localhost:8765/api/usuarios', {
            method: 'GET',
            credentials: 'include'
          });

          if (response.ok) {
            const data = await response.json();
            setUsers(data.data || []);
          }
        } catch (error) {
          console.error('Error loading users:', error);
        }
      };

      loadUsers();
    }
  }, [open]);

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
        project_manager_id: safeProject.project_manager_id || '',
        client_color: safeProject.client?.color || '#3B82F6',
        members: safeProject.members || []
      });
    }
    setIsEditing(!isEditing);
  };

  // Handle save changes
  const handleSave = async () => {
    setSaving(true);
    try {
      const response = await fetch(`http://localhost:8765/api/projects-working/projects/${safeProject.id}`, {
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

  // Handle adding a member to the project
  const handleAddMember = (userId) => {
    const user = users.find(u => u.id === parseInt(userId));
    if (user && !editData.members.some(m => m.user_id === user.id || m.id === user.id)) {
      const newMember = {
        user_id: user.id,
        role_id: 1,
        team_type: 'operations',
        user: {
          id: user.id,
          name: user.name
        },
        role: {
          id: 1,
          name: 'Miembro'
        }
      };
      
      setEditData(prev => ({
        ...prev,
        members: [...prev.members, newMember]
      }));
    }
  };

  // Handle removing a member from the project
  const handleRemoveMember = (memberId) => {
    setEditData(prev => ({
      ...prev,
      members: prev.members.filter(m => (m.id || m.user_id) !== memberId)
    }));
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
          <div className="pd-content" style={{
            maxHeight: '70vh',
            overflowY: 'auto',
            padding: '20px'
          }}>
            {isEditing ? (
              <div className="pd-form">
                <h3 style={{ marginBottom: '20px', color: '#fff' }}>Información del Proyecto</h3>
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

                <div className="pd-form-group">
                  <label>Gerente del Proyecto</label>
                  <select
                    value={editData.project_manager_id || ''}
                    onChange={(e) => setEditData({ ...editData, project_manager_id: e.target.value })}
                  >
                    <option value="">Seleccionar gerente...</option>
                    {users.map(user => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginBottom: '20px' }}>
                  <label>Equipo del Proyecto</label>

                  {/* Miembros actuales */}
                  <div style={{
                    marginTop: '8px',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    padding: '12px',
                    maxHeight: '150px',
                    overflowY: 'auto'
                  }}>
                    {editData.members && editData.members.length > 0 ? (
                      editData.members.map((member) => (
                        <div key={member.id || member.user_id} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                          padding: '8px 12px',
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          borderRadius: '6px',
                          marginBottom: '8px'
                        }}>
                          <div>
                            <span style={{
                              color: '#fff',
                              fontWeight: '600',
                              display: 'block',
                              fontSize: '14px'
                            }}>
                              {member.user?.name || member.name || 'Usuario'}
                            </span>
                            <span style={{
                              color: 'rgba(255, 255, 255, 0.7)',
                              fontSize: '12px'
                            }}>
                              {member.role?.name || member.team_type || 'Miembro'}
                            </span>
                          </div>
                          <button
                            type="button"
                            style={{
                              background: 'rgba(239, 68, 68, 0.2)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              borderRadius: '4px',
                              color: '#ef4444',
                              padding: '4px 8px',
                              cursor: 'pointer',
                              fontSize: '14px',
                              fontWeight: 'bold'
                            }}
                            onClick={() => handleRemoveMember(member.id || member.user_id)}
                          >
                            ×
                          </button>
                        </div>
                      ))
                    ) : (
                      <div style={{
                        textAlign: 'center',
                        color: 'rgba(255, 255, 255, 0.5)',
                        padding: '20px',
                        fontStyle: 'italic'
                      }}>
                        No hay miembros asignados
                      </div>
                    )}
                  </div>

                  {/* Agregar nuevo miembro */}
                  <div style={{ marginTop: '12px' }}>
                    <select
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid rgba(255, 255, 255, 0.15)',
                        borderRadius: '8px',
                        backgroundColor: 'rgba(255, 255, 255, 0.1)',
                        color: '#ffffff',
                        fontSize: '14px'
                      }}
                      onChange={(e) => {
                        if (e.target.value) {
                          handleAddMember(e.target.value);
                          e.target.value = '';
                        }
                      }}
                    >
                      <option value="">Agregar miembro del equipo...</option>
                      {users
                        .filter(user => !editData.members?.some(m => m.user_id === user.id || m.id === user.id))
                        .map(user => (
                          <option key={user.id} value={user.id} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                            {user.name}
                          </option>
                        ))}
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
