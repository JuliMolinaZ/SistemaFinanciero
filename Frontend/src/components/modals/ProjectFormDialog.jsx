// ✏️ PROJECT FORM DIALOG - MODAL DE FORMULARIO REUTILIZABLE
// ==========================================================

import React, { useState, useEffect } from 'react';
import { X, Plus, Edit } from 'lucide-react';
import { Button } from '../ui/Button';
import ManagePhasesDialogSimple from './ManagePhasesDialogSimple';
import '../ui/enterprise-system.css';

// 🎯 COMPONENTE PRINCIPAL
const ProjectFormDialog = ({ 
  mode = 'create', // 'create' | 'edit'
  open, 
  onOpenChange, 
  initialValues = {}, 
  onSubmit, 
  submitLabel,
  loading = false 
}) => {
  // Estados del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cliente_id: '',
    priority: 'medium',
    start_date: '',
    end_date: '',
    project_manager_id: '',
  });

  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOperationsUsers, setSelectedOperationsUsers] = useState([]);
  const [selectedItUsers, setSelectedItUsers] = useState([]);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [showPhaseManager, setShowPhaseManager] = useState(false);

  // Efecto simple para cargar datos cuando se abre el modal
  useEffect(() => {
    if (open) {
      setIsLoading(true);

      // Función simple para cargar datos
      const loadData = async () => {
        try {
          // Cargar clientes y usuarios en paralelo
          const [clientsRes, usersRes] = await Promise.all([
            fetch('http://localhost:8765/api/clients', {
              method: 'GET',
              credentials: 'include'
            }),
            fetch('http://localhost:8765/api/usuarios', {
              method: 'GET',
              credentials: 'include'
            })
          ]);

          // Procesar clientes
          if (clientsRes.ok) {
            const clientsData = await clientsRes.json();
            setClients(clientsData.data || []);
          } else {
            setClients([]);
          }

          // Procesar usuarios
          if (usersRes.ok) {
            const usersData = await usersRes.json();
            setUsers(usersData.data || []);
          } else {
            setUsers([]);
          }

          // Si es modo edición, precargar valores
          if (mode === 'edit' && initialValues) {
            setFormData({
              nombre: initialValues.nombre || initialValues.name || '',
              descripcion: initialValues.descripcion || initialValues.description || '',
              cliente_id: initialValues.cliente_id || initialValues.client?.id || '',
              priority: initialValues.priority || 'medium',
              start_date: initialValues.start_date ? initialValues.start_date.split('T')[0] : '',
              end_date: initialValues.end_date ? initialValues.end_date.split('T')[0] : '',
              project_manager_id: initialValues.project_manager_id || '',
            });

            // Precargar equipos
            const operations = initialValues.members?.filter(m => m.team_type === 'operations') || [];
            const it = initialValues.members?.filter(m => m.team_type === 'it') || [];

            setSelectedOperationsUsers(operations.map(m => ({ id: m.user_id, name: m.user?.name })));
            setSelectedItUsers(it.map(m => ({ id: m.user_id, name: m.user?.name })));
          }

          } catch (error) {
          console.error('❌ Error:', error);
          setClients([]);
          setUsers([]);
        } finally {
          setIsLoading(false);
        }
      };

      loadData();
    } else {
      // Reset cuando se cierre
      setFormData({
        nombre: '',
        descripcion: '',
        cliente_id: '',
        priority: 'medium',
        start_date: '',
        end_date: '',
        project_manager_id: '',
      });
      setSelectedOperationsUsers([]);
      setSelectedItUsers([]);
      setErrors({});
    }
  }, [open]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es requerido';
    }

    if (formData.start_date && formData.end_date) {
      if (new Date(formData.start_date) >= new Date(formData.end_date)) {
        newErrors.end_date = 'La fecha de fin debe ser posterior a la fecha de inicio';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const projectData = {
      ...formData,
      cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
      project_manager_id: formData.project_manager_id ? parseInt(formData.project_manager_id) : null,
      members: [
        ...selectedOperationsUsers.map(user => ({
          user_id: user.id,
          role_id: 1,
          team_type: 'operations'
        })),
        ...selectedItUsers.map(user => ({
          user_id: user.id,
          role_id: 1,
          team_type: 'it'
        }))
      ]
    };

    if (onSubmit) {
      await onSubmit(projectData);
    }
  };

  if (!open) return null;

  const isEdit = mode === 'edit';
  const title = isEdit ? 'Editar Proyecto' : 'Crear Nuevo Proyecto';
  const icon = isEdit ? Edit : Plus;

  return (
    <div className="enterprise-modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="enterprise-modal-content enterprise-modal-content--large" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="enterprise-modal-header">
          <div className="enterprise-modal-header-content">
            {React.createElement(icon, { className: "enterprise-modal-icon", size: 24 })}
            <h2 className="enterprise-modal-title">{title}</h2>
          </div>
          <button
            className="enterprise-icon-button"
            onClick={() => onOpenChange(false)}
            aria-label="Cerrar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body con formulario */}
        <form onSubmit={handleSubmit} className="enterprise-modal-body">
          {isLoading ? (
            <div className="enterprise-form-loading">
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '16px',
                minHeight: '200px',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  border: '2px solid #e5e7eb',
                  borderTop: '2px solid #3b82f6',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                <span>Cargando datos del formulario...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Nombre del proyecto */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              className={`enterprise-form-input ${errors.nombre ? 'enterprise-form-input--error' : ''}`}
              placeholder="Ej. Sistema de Gestión"
              required
            />
            {errors.nombre && (
              <span className="enterprise-form-error">{errors.nombre}</span>
            )}
          </div>

          {/* Descripción */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">Descripción</label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="enterprise-form-textarea"
              placeholder="Describe el proyecto..."
              rows="3"
            />
          </div>

          {/* Fila: Cliente y Prioridad */}
          <div className="enterprise-form-row">
            <div className="enterprise-form-field">
              <label className="enterprise-form-label">Cliente</label>
              <select
                name="cliente_id"
                value={formData.cliente_id}
                onChange={handleChange}
                className="enterprise-form-select"
              >
                <option value="">Seleccionar cliente...</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>
                    {client.nombre}
                  </option>
                ))}
              </select>
            </div>

            <div className="enterprise-form-field">
              <label className="enterprise-form-label">Prioridad</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
                className="enterprise-form-select"
              >
                <option value="low">Baja</option>
                <option value="medium">Media</option>
                <option value="high">Alta</option>
                <option value="critical">Crítica</option>
              </select>
            </div>
          </div>

          {/* Fila: Fechas */}
          <div className="enterprise-form-row">
            <div className="enterprise-form-field">
              <label className="enterprise-form-label">Fecha de Inicio</label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="enterprise-form-input"
              />
            </div>

            <div className="enterprise-form-field">
              <label className="enterprise-form-label">Fecha de Fin</label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`enterprise-form-input ${errors.end_date ? 'enterprise-form-input--error' : ''}`}
              />
              {errors.end_date && (
                <span className="enterprise-form-error">{errors.end_date}</span>
              )}
            </div>
          </div>

          {/* Gerente del proyecto */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">Gerente del Proyecto</label>
            <select
              name="project_manager_id"
              value={formData.project_manager_id}
              onChange={handleChange}
              className="enterprise-form-select"
            >
              <option value="">Seleccionar gerente...</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>
                  {user.name}
                </option>
              ))}
            </select>
          </div>

          {/* Equipos - Simplificado para el modal */}
          <div className="enterprise-form-section">
            <h3 className="enterprise-form-section-title">Equipos de Trabajo</h3>
            <p className="enterprise-form-section-description">
              {isEdit ? 'Los equipos se pueden modificar desde la vista detallada.' : 'Los equipos se pueden asignar después de crear el proyecto.'}
            </p>
          </div>

          {/* Fases - Solo para proyectos existentes */}
          {isEdit && (
            <div className="enterprise-form-section">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 className="enterprise-form-section-title" style={{ margin: 0 }}>Fases del Proyecto</h3>
                <button
                  type="button"
                  onClick={() => setShowPhaseManager(true)}
                  className="enterprise-button enterprise-button--outline enterprise-button--sm"
                  style={{ fontSize: '12px', padding: '4px 12px' }}
                >
                  📋 Gestionar Fases
                </button>
              </div>
              <p className="enterprise-form-section-description">
                Las fases ayudan a organizar el progreso del proyecto en etapas claras.
              </p>
            </div>
          )}
              </>
            )}
        </form>

        {/* Footer */}
        <div className="enterprise-modal-footer">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={loading || isLoading}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            loading={loading}
            disabled={isLoading}
          >
            {submitLabel || (isEdit ? 'Guardar Cambios' : 'Crear Proyecto')}
          </Button>
        </div>
      </div>

      {/* Modal de gestión de fases */}
      {showPhaseManager && (
        <ManagePhasesDialogSimple
          isOpen={showPhaseManager}
          onClose={() => setShowPhaseManager(false)}
          projectId={initialValues?.id}
          projectName={initialValues?.nombre || initialValues?.name || 'Proyecto'}
          onPhasesUpdated={() => {

            setShowPhaseManager(false);
          }}
        />
      )}
    </div>
  );
};

export default ProjectFormDialog;
