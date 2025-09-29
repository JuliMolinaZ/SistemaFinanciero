import React, { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Calendar, Users, Building, Flag, Clock, Edit, Plus } from 'lucide-react';
import ProjectTeamManager from '../../../components/ui/ProjectTeamManager';
// import { useBodyScrollLock } from '../../../hooks/useBodyScrollLock';
import '../../../styles/EditProjectModal.css';

const ProjectFormModal = ({
  isOpen,
  onClose,
  project,
  mode = 'edit',
  onSave,
  onDelete
}) => {
  const isCreateMode = !project || mode === 'create';
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cliente_id: '',
    status: 'planning',
    priority: 'medium',
    start_date: '',
    end_date: '',
    current_phase_id: ''
  });
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [phases, setPhases] = useState([]);

  const dialogRef = useRef(null);
  const firstFocusableRef = useRef(null);

  // useBodyScrollLock(isOpen);

  useEffect(() => {
    if (isOpen) {
      if (project) {
        // Edit mode - populate with project data
        setFormData({
          nombre: project.nombre || '',
          descripcion: project.descripcion || '',
          cliente_id: project.cliente_id || '',
          status: project.status || 'planning',
          priority: project.priority || 'medium',
          start_date: project.start_date ? project.start_date.split('T')[0] : '',
          end_date: project.end_date ? project.end_date.split('T')[0] : '',
          current_phase_id: project.current_phase_id || ''
        });
        setSelectedUsers(project.members || []);
      } else {
        // Create mode - reset to defaults
        setFormData({
          nombre: '',
          descripcion: '',
          cliente_id: '',
          status: 'planning',
          priority: 'medium',
          start_date: '',
          end_date: '',
          current_phase_id: ''
        });
        setSelectedUsers([]);
      }
    }
  }, [project, isOpen]);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => firstFocusableRef.current?.focus(), 100);
      loadAdditionalData();
    }
  }, [isOpen]);

  const loadAdditionalData = async () => {
    try {
      const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';

      const [clientsResponse, usersResponse, phasesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/clients`, {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE_URL}/api/usuarios`, {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch(`${API_BASE_URL}/api/phases`, {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json()).catch(() => ({ data: [] }))
      ]);

      setClients(clientsResponse.data || []);
      setUsers(usersResponse.data || []);
      setPhases(phasesResponse.data || []);
      
      // Debug: ver estructura de usuarios
      // console.log('Usuarios cargados:', usersResponse.data);
    } catch (error) {
      console.error('Error cargando datos:', error);
    }
  };

  const handleKeyDown = useCallback((e) => {
    if (!isOpen) return;
    if (e.key === 'Escape') onClose();

    if (e.key === 'Tab') {
      const focusableElements = dialogRef.current?.querySelectorAll(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );

      if (focusableElements?.length) {
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    }
  }, [isOpen, onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);
    try {
      if (isCreateMode) {
        // Create mode - use POST API
        const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';
        const response = await fetch(`${API_BASE_URL}/api/projects-working/projects`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify({ ...formData, members: selectedUsers })
        });

        const data = await response.json();
        if (data.success) {
          onSave?.(data.data);
          onClose();
        } else {
          console.error('Error creating project:', data.message);
        }
      } else {
        // Edit mode - use existing onSave callback
        await onSave({ ...formData, members: selectedUsers });
        onClose();
      }
    } catch (error) {
      console.error('Error saving project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUserToggle = (user) => {
    setSelectedUsers(prev => {
      const exists = prev.find(u => u.id === user.id);
      return exists
        ? prev.filter(u => u.id !== user.id)
        : [...prev, user];
    });
  };

  if (!isOpen) return null;

  const statusOptions = [
    { value: 'planning', label: 'Planeación' },
    { value: 'in_progress', label: 'En Progreso' },
    { value: 'on_hold', label: 'En Pausa' },
    { value: 'completed', label: 'Completado' },
    { value: 'cancelled', label: 'Cancelado' }
  ];

  const priorityOptions = [
    { value: 'low', label: 'Baja' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
    { value: 'critical', label: 'Crítica' }
  ];

  const modalPrefix = isCreateMode ? 'create' : 'edit';

  return (
    <div
      className={`${modalPrefix}-modal-overlay`}
      onClick={handleBackdropClick}
      data-testid="modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className={`${modalPrefix}-modal-dialog`} ref={dialogRef} data-testid="modal-dialog">
        <header className={`${modalPrefix}-modal-header`} data-testid="modal-header">
          <div className={`${modalPrefix}-modal-title`}>
            <h2 id="modal-title">
              {isCreateMode ? <Plus size={24} /> : <Edit size={24} />}
              {isCreateMode ? 'Crear Proyecto' : 'Editar Proyecto'}
            </h2>
            <button
              ref={firstFocusableRef}
              className={`${modalPrefix}-modal-close`}
              onClick={onClose}
              type="button"
              aria-label="Cerrar modal"
            >
              <X size={24} />
            </button>
          </div>
        </header>

        <div className={`${modalPrefix}-modal-content`} data-testid="modal-content">
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-section">
                <h3 className="form-section-title">
                  <Building size={20} />
                  Información del Proyecto
                </h3>

                <div className="form-group">
                  <label className="form-label" htmlFor="project-name">
                    Nombre del Proyecto
                  </label>
                  <input
                    id="project-name"
                    type="text"
                    className="form-input"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="project-description">
                    Descripción
                  </label>
                  <textarea
                    id="project-description"
                    className="form-input form-textarea"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    rows={4}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="project-client">
                    Cliente
                  </label>
                  <select
                    id="project-client"
                    className="form-input form-select"
                    value={formData.cliente_id}
                    onChange={(e) => setFormData(prev => ({ ...prev, cliente_id: e.target.value }))}
                  >
                    <option value="">Seleccionar cliente</option>
                    {clients.map(client => (
                      <option key={client.id} value={client.id}>
                        {client.nombre}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="start-date">
                      <Calendar size={16} />
                      Fecha Inicio
                    </label>
                    <input
                      id="start-date"
                      type="date"
                      className="form-input"
                      value={formData.start_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, start_date: e.target.value }))}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="end-date">
                      <Calendar size={16} />
                      Fecha Fin
                    </label>
                    <input
                      id="end-date"
                      type="date"
                      className="form-input"
                      value={formData.end_date}
                      onChange={(e) => setFormData(prev => ({ ...prev, end_date: e.target.value }))}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="form-section-title">
                  <Flag size={20} />
                  Estado y Configuración
                </h3>

                <div className="form-row">
                  <div className="form-group">
                    <label className="form-label" htmlFor="project-status">
                      <Clock size={16} />
                      Estado
                    </label>
                    <select
                      id="project-status"
                      className="form-input form-select"
                      value={formData.status}
                      onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                    >
                      {statusOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="project-priority">
                      <Flag size={16} />
                      Prioridad
                    </label>
                    <select
                      id="project-priority"
                      className="form-input form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                    >
                      {priorityOptions.map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {phases.length > 0 && (
                  <div className="form-group">
                    <label className="form-label" htmlFor="current-phase">
                      Fase Actual
                    </label>
                    <select
                      id="current-phase"
                      className="form-input form-select"
                      value={formData.current_phase_id}
                      onChange={(e) => setFormData(prev => ({ ...prev, current_phase_id: e.target.value }))}
                    >
                      <option value="">Sin fase asignada</option>
                      {phases.map(phase => (
                        <option key={phase.id} value={phase.id}>
                          {phase.nombre}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="form-group">
                  <label className="form-label">
                    <Users size={16} />
                    Equipo de Trabajo
                  </label>
                  <ProjectTeamManager
                    users={users}
                    selectedUsers={selectedUsers}
                    onUserToggle={handleUserToggle}
                    maxHeight="300px"
                  />
                </div>
              </div>
            </div>
          </form>
        </div>

        <footer className={`${modalPrefix}-modal-footer`} data-testid="modal-footer">
          <div className={`${modalPrefix}-modal-actions`}>
            <button
              type="button"
              className={`${modalPrefix}-modal-btn ${modalPrefix}-modal-btn--secondary`}
              onClick={onClose}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={`${modalPrefix}-modal-btn ${modalPrefix}-modal-btn--primary ${loading ? `${modalPrefix}-modal-btn--loading` : ''}`}
              onClick={handleSubmit}
              disabled={loading}
            >
              <Save size={18} />
              {loading ? (isCreateMode ? 'Creando...' : 'Guardando...') : (isCreateMode ? 'Crear Proyecto' : 'Guardar Cambios')}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default ProjectFormModal;