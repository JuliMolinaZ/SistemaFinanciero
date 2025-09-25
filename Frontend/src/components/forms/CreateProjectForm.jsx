// 📝 FORMULARIO DE CREAR PROYECTO - ENTERPRISE
// ============================================

import React, { useState, useEffect } from 'react';
import { X, Save, Loader2 } from 'lucide-react';
import { Button } from '../ui/EnterpriseComponents';
import projectManagementService from '../../services/projectManagementService';
import '../ui/enterprise-system.css';

export default function CreateProjectForm({ open = true, onClose, onSuccess, className = '', ...props }) {
  const [formData, setFormData] = useState({
    nombre: '',
    descripcion: '',
    cliente_id: '',
    priority: 'medium',
    start_date: '',
    end_date: '',
    project_manager_id: '',
    operations_team: [],
    it_team: []
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedOperationsUsers, setSelectedOperationsUsers] = useState([]);
  const [selectedItUsers, setSelectedItUsers] = useState([]);

  // Cargar datos reales desde la API
  useEffect(() => {
    const loadFormData = async () => {
      try {

        // Obtener clientes reales
        const clientsResponse = await fetch('http://localhost:8765/api/clients', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (clientsResponse.ok) {
          const clientsData = await clientsResponse.json();

          setClients(clientsData.data || []);
        } else {
          console.error('❌ Error al obtener clientes:', clientsResponse.status);
        }

        // Obtener usuarios reales
        const usersResponse = await fetch('http://localhost:8765/api/usuarios', {
          method: 'GET',
          credentials: 'include'
        });
        
        if (usersResponse.ok) {
          const usersData = await usersResponse.json();

          setUsers(usersData.data || []);
        } else {
          console.error('❌ Error al obtener usuarios:', usersResponse.status);
        }

      } catch (error) {
        console.error('❌ Error cargando datos del formulario:', error);
        setErrors({ general: 'Error al cargar datos del formulario' });
      }
    };

    loadFormData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: null
      }));
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

    // Prevenir múltiples submits
    if (loading) {

      return;
    }
    
    if (!validateForm()) {

      return;
    }

    setLoading(true);
    setErrors({}); // Limpiar errores previos
    
    try {
      const projectData = {
        ...formData,
        cliente_id: formData.cliente_id ? parseInt(formData.cliente_id) : null,
        project_manager_id: formData.project_manager_id ? parseInt(formData.project_manager_id) : null,
        members: [
          // Equipo de operaciones
          ...selectedOperationsUsers.map(user => ({
            user_id: user.id,
            role_id: 1, // Role por defecto
            team_type: 'operations'
          })),
          // Equipo de TI
          ...selectedItUsers.map(user => ({
            user_id: user.id,
            role_id: 1, // Role por defecto
            team_type: 'it'
          }))
        ]
      };

      const result = await projectManagementService.createProject(projectData);

      // Llamar a onSuccess con los datos del proyecto creado
      onSuccess?.(result.data || result);
      
      // Cerrar el modal
      onClose?.();
    } catch (error) {
      console.error('❌ Error creando proyecto:', error);
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al crear el proyecto';
      
      if (error.message) {
        errorMessage = error.message;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      
      setErrors({ general: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  // No renderizar si no está abierto
  if (!open) {

    return null;
  }

  return (
    <div className={`enterprise-modal-overlay ${className}`} {...props}>
      <div className="enterprise-modal-content">
        {/* Header */}
        <div className="enterprise-modal-header">
          <h2 className="enterprise-modal-title">🚀 Crear Nuevo Proyecto</h2>
          <button
            className="enterprise-icon-button"
            onClick={onClose}
            aria-label="Cerrar modal"
          >
            <X className="enterprise-button-icon" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="enterprise-modal-body">
          {errors.general && (
            <div className="enterprise-error-message">
              {errors.general}
            </div>
          )}

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
              placeholder="Ej: Sistema de Gestión"
              required
            />
            {errors.nombre && (
              <span className="enterprise-form-error">{errors.nombre}</span>
            )}
          </div>

          {/* Descripción */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Descripción
            </label>
            <textarea
              name="descripcion"
              value={formData.descripcion}
              onChange={handleChange}
              className="enterprise-form-textarea"
              placeholder="Describe el proyecto..."
              rows={3}
            />
          </div>

          {/* Cliente */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Cliente
            </label>
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

          {/* Prioridad */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Prioridad
            </label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="enterprise-form-select"
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </select>
          </div>

          {/* Fechas */}
          <div className="enterprise-form-row">
            <div className="enterprise-form-field">
              <label className="enterprise-form-label">
                📅 Fecha de Inicio
              </label>
              <input
                type="date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="enterprise-form-input"
                title="Seleccionar fecha de inicio"
                style={{
                  background: 'white',
                  color: '#1f2937',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              />
            </div>
            <div className="enterprise-form-field">
              <label className="enterprise-form-label">
                📅 Fecha de Fin
              </label>
              <input
                type="date"
                name="end_date"
                value={formData.end_date}
                onChange={handleChange}
                className={`enterprise-form-input ${errors.end_date ? 'enterprise-form-input--error' : ''}`}
                title="Seleccionar fecha de fin"
                style={{
                  background: 'white',
                  color: '#1f2937',
                  border: '2px solid #d1d5db',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  fontSize: '14px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  width: '100%'
                }}
              />
              {errors.end_date && (
                <span className="enterprise-form-error">{errors.end_date}</span>
              )}
            </div>
          </div>

          {/* Gerente del proyecto */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Gerente del Proyecto
            </label>
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

          {/* Equipo de Operaciones */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Equipo de Operaciones
            </label>
            <div className="enterprise-team-selector">
              <select
                className="enterprise-form-select"
                onChange={(e) => {
                  const userId = parseInt(e.target.value);
                  if (userId && !selectedOperationsUsers.find(u => u.id === userId)) {
                    const user = users.find(u => u.id === userId);
                    if (user) {
                      setSelectedOperationsUsers(prev => [...prev, user]);
                    }
                  }
                  e.target.value = '';
                }}
              >
                <option value="">Agregar miembro de operaciones...</option>
                {users
                  .filter(user => !selectedOperationsUsers.find(u => u.id === user.id))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
              
              {/* Lista de usuarios seleccionados */}
              {selectedOperationsUsers.length > 0 && (
                <div className="enterprise-team-list">
                  {selectedOperationsUsers.map(user => (
                    <div key={user.id} className="enterprise-team-member">
                      <span className="enterprise-team-member-name">{user.name}</span>
                      <button
                        type="button"
                        className="enterprise-team-remove"
                        onClick={() => {
                          setSelectedOperationsUsers(prev => prev.filter(u => u.id !== user.id));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Equipo de TI */}
          <div className="enterprise-form-field">
            <label className="enterprise-form-label">
              Equipo de TI
            </label>
            <div className="enterprise-team-selector">
              <select
                className="enterprise-form-select"
                onChange={(e) => {
                  const userId = parseInt(e.target.value);
                  if (userId && !selectedItUsers.find(u => u.id === userId)) {
                    const user = users.find(u => u.id === userId);
                    if (user) {
                      setSelectedItUsers(prev => [...prev, user]);
                    }
                  }
                  e.target.value = '';
                }}
              >
                <option value="">Agregar miembro de TI...</option>
                {users
                  .filter(user => !selectedItUsers.find(u => u.id === user.id))
                  .map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))}
              </select>
              
              {/* Lista de usuarios seleccionados */}
              {selectedItUsers.length > 0 && (
                <div className="enterprise-team-list">
                  {selectedItUsers.map(user => (
                    <div key={user.id} className="enterprise-team-member">
                      <span className="enterprise-team-member-name">{user.name}</span>
                      <button
                        type="button"
                        className="enterprise-team-remove"
                        onClick={() => {
                          setSelectedItUsers(prev => prev.filter(u => u.id !== user.id));
                        }}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Footer dentro del formulario */}
          <div className="enterprise-modal-footer">
            <Button
              variant="ghost"
              onClick={onClose}
              disabled={loading}
              type="button"
            >
              Cancelar
            </Button>
            <Button
              variant="primary"
              icon={loading ? Loader2 : Save}
              type="submit"
              disabled={loading}
            >
              {loading ? 'Creando...' : 'Crear Proyecto'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
