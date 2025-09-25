// 🎨 MODAL DE PROYECTO CON DISEÑO DEL FORMULARIO DE TAREAS
// =========================================================

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Save, 
  Edit, 
  Eye, 
  Trash2, 
  Calendar, 
  User, 
  Building, 
  Target,
  Users,
  Clock,
  AlertCircle,
  CheckCircle,
  DollarSign,
  UserPlus,
  UserMinus,
  ChevronDown,
  ChevronUp,
  Plus,
  Minus,
  UserCheck
} from 'lucide-react';

// 🎯 COMPONENTE PRINCIPAL DEL MODAL
const ProjectFormModal = ({ 
  isOpen, 
  onClose, 
  project, 
  mode = 'view', // 'view' | 'edit'
  onSave,
  onDelete 
}) => {
  const [formData, setFormData] = useState({
    // Información básica
    nombre: '',
    descripcion: '',
    status: 'planning',
    priority: 'medium',
    progress: 0,
    
    // Cliente y metodología
    cliente_id: '',
    methodology_id: '',
    project_manager_id: '',
    current_phase_id: '',
    
    // Fechas y presupuesto
    start_date: '',
    end_date: '',
    budget: 0,
    
    // Equipo de trabajo
    members: [],
    
    // Configuración
    terms_conditions: '',
    client_color: '#3B82F6'
  });

  // Estados adicionales
  const [clients, setClients] = useState([]);
  const [users, setUsers] = useState([]);
  const [methodologies, setMethodologies] = useState([]);
  const [phases, setPhases] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [showUserSelector, setShowUserSelector] = useState(false);

  const [errors, setErrors] = useState({});
  const [isEditing, setIsEditing] = useState(true); // Siempre permitir edición
  const [saving, setSaving] = useState(false);

  // Inicializar datos del formulario cuando se abre el modal
  useEffect(() => {
    if (project && isOpen) {
      setFormData({
        // Campos básicos (existen en la base de datos)
        nombre: project.nombre || '',
        descripcion: project.descripcion || '',
        status: project.status || 'planning',
        priority: project.priority || 'medium',
        progress: project.progress || 0,
        
        // Campos de relación (existen en la base de datos)
        cliente_id: project.cliente_id || '',
        methodology_id: project.methodology_id || '',
        project_manager_id: project.project_manager_id || '',
        current_phase_id: project.current_phase_id || '',
        
        // Campos de fechas (existen en la base de datos)
        start_date: project.start_date ? new Date(project.start_date).toISOString().split('T')[0] : '',
        end_date: project.end_date ? new Date(project.end_date).toISOString().split('T')[0] : '',
        
        // Campos financieros (existen en la base de datos)
        budget: project.budget || 0,
        
        // Miembros del proyecto (existen en la base de datos)
        members: project.members || [],
        
        // Campos adicionales (pueden no existir, usar valores por defecto)
        terms_conditions: project.terms_conditions || '',
        client_color: (typeof project.client === 'object' && project.client?.color) || '#3B82F6'
      });
      
      }
  }, [project, isOpen]);

  // Cargar datos adicionales cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      loadAdditionalData();
    }
  }, [isOpen]);

  // Actualizar usuarios disponibles cuando cambian los usuarios o miembros
  useEffect(() => {
    if (users.length > 0) {
      // Extraer IDs de usuarios que ya están en el proyecto
      const memberUserIds = formData.members.map((member, index) => {
        const userId = member.user_id || member.id || member.user?.id;
        return userId;
      }).filter(Boolean); // Filtrar valores undefined/null
      
      // Filtrar usuarios que NO están en el proyecto
      const available = users.filter(user => {
        const isNotMember = !memberUserIds.includes(user.id);
        return isNotMember;
      });
      
      setAvailableUsers(available);
    } else {
      setAvailableUsers([]);
    }
  }, [users, formData.members]);

  const loadAdditionalData = async () => {
    try {
      // Cargar datos reales desde el backend
      const [clientsResponse, usersResponse, phasesResponse] = await Promise.all([
        fetch('http://localhost:8765/api/clients', {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8765/api/usuarios', {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json()).catch(() => ({ data: [] })),
        fetch('http://localhost:8765/api/phases', {
          method: 'GET',
          credentials: 'include'
        }).then(res => res.json()).catch(() => ({ data: [] }))
      ]);

      // Procesar clientes
      const clientsData = clientsResponse.data || clientsResponse || [];
      setClients(clientsData.map(client => ({
        id: client.id,
        name: client.nombre || client.name,
        color: client.color || '#3B82F6'
      })));

      // Procesar usuarios
      const usersData = usersResponse.data || usersResponse || [];
      const formattedUsers = usersData.map(user => {
        // Extraer nombre del email si name es null
        let displayName = user.name || user.nombre;
        if (!displayName && user.email) {
          // Extraer nombre del email (antes del @)
          displayName = user.email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
        }
        
        return {
          id: user.id,
          name: displayName || `Usuario ${user.id}`,
          email: user.email,
          role: user.role || user.position || 'Usuario'
        };
      });
      
      setUsers(formattedUsers);

      // Procesar fases
      const phasesData = phasesResponse.data || phasesResponse || [];
      setPhases(phasesData.map(phase => ({
        id: phase.id,
        name: phase.name || phase.nombre,
        description: phase.description || phase.descripcion
      })));

      // Metodologías hardcodeadas por ahora
      setMethodologies([
        { id: 1, name: 'Kanban' },
        { id: 2, name: 'Scrum' },
        { id: 3, name: 'Waterfall' }
      ]);
      
    } catch (error) {
      console.error('Error cargando datos adicionales:', error);
      // En caso de error, usar datos mínimos para evitar que el modal se rompa
      setClients([]);
      setUsers([]);
      setMethodologies([]);
      setPhases([]);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Limpiar error del campo cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre del proyecto es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Funciones para gestionar usuarios del proyecto
  const addUserToProject = async (user) => {
    if (!project?.id) {
      // Si es creación de proyecto, agregar localmente
      const newMember = {
        id: user.id,
        user_id: user.id,
        user: {
          id: user.id,
          name: user.name,
          email: user.email
        },
        role: {
          name: user.role || 'Miembro'
        },
        team_type: user.role === 'Desarrollador' ? 'development' : 'operations'
      };

      setFormData(prev => ({
        ...prev,
        members: [...prev.members, newMember]
      }));
      return;
    }

    // Si es edición de proyecto, usar API real
    try {
      const response = await fetch(`http://localhost:8765/api/management-projects/${project.id}/members`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({
          user_id: user.id,
          team_type: user.role === 'Desarrollador' ? 'development' : 'operations',
          role_id: 1 // Rol por defecto
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error agregando miembro');
      }

      const result = await response.json();

      // Actualizar formData con los miembros actualizados
      setFormData(prev => ({
        ...prev,
        members: result.data.members || []
      }));

      console.log('✅ Miembro agregado exitosamente:', user.name);

    } catch (error) {
      console.error('❌ Error agregando miembro:', error);
      alert(`Error agregando miembro: ${error.message}`);
    }
  };

  const removeUserFromProject = async (userId) => {
    if (!project?.id) {
      // Si es creación de proyecto, remover localmente
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter(m => (m.user_id || m.id) !== userId)
      }));
      return;
    }

    // Si es edición de proyecto, usar API real
    try {
      // Encontrar el member ID desde el user_id
      const member = formData.members.find(m => (m.user_id || m.id) === userId);
      if (!member) {
        throw new Error('Miembro no encontrado');
      }

      const response = await fetch(`http://localhost:8765/api/management-projects/${project.id}/members/${member.id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Error eliminando miembro');
      }

      // Actualizar formData removiendo el miembro
      setFormData(prev => ({
        ...prev,
        members: prev.members.filter(m => (m.user_id || m.id) !== userId)
      }));

      console.log('✅ Miembro removido exitosamente');

    } catch (error) {
      console.error('❌ Error removiendo miembro:', error);
      alert(`Error removiendo miembro: ${error.message}`);
    }
  };

  // Función auxiliar para crear campos de formulario
  const createFormField = (label, field, type = 'text', options = null, icon = Target) => (
    <div style={{ marginBottom: '16px' }}>
      <label style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#ffffff',
        marginBottom: '8px',
        textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
      }}>
        {icon && React.createElement(icon, { width: '16px', height: '16px', color: '#3b82f6' })}
        {label}
      </label>
      {type === 'select' ? (
        <select
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: `2px solid ${errors[field] ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors[field] ? '#ef4444' : 'rgba(255, 255, 255, 0.15)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        >
          <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Seleccionar...</option>
          {options?.map(option => (
            <option key={option.id || option.value} value={option.id || option.value} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
              {String(option.name || option.label)}
            </option>
          ))}
        </select>
      ) : type === 'textarea' ? (
        <textarea
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`${label.toLowerCase()}...`}
          rows={3}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: `2px solid ${errors[field] ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
            resize: 'vertical',
            minHeight: '80px'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors[field] ? '#ef4444' : 'rgba(255, 255, 255, 0.15)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        />
      ) : (
        <input
          type={type}
          value={formData[field]}
          onChange={(e) => handleInputChange(field, e.target.value)}
          placeholder={`${label.toLowerCase()}...`}
          style={{
            width: '100%',
            padding: '14px 16px',
            border: `2px solid ${errors[field] ? '#ef4444' : 'rgba(255, 255, 255, 0.15)'}`,
            borderRadius: '10px',
            backgroundColor: 'rgba(255, 255, 255, 0.1)',
            color: '#ffffff',
            fontSize: '15px',
            outline: 'none',
            transition: 'all 0.3s ease',
            backdropFilter: 'blur(10px)',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}
          onFocus={(e) => {
            e.target.style.borderColor = '#3b82f6';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
            e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
          }}
          onBlur={(e) => {
            e.target.style.borderColor = errors[field] ? '#ef4444' : 'rgba(255, 255, 255, 0.15)';
            e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            e.target.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
          }}
        />
      )}
      {errors[field] && (
        <div style={{
          marginTop: '8px',
          padding: '10px 12px',
          backgroundColor: 'rgba(239, 68, 68, 0.15)',
          border: '1px solid rgba(239, 68, 68, 0.3)',
          borderRadius: '8px',
          color: '#fca5a5',
          fontSize: '13px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          backdropFilter: 'blur(10px)'
        }}>
          <AlertCircle style={{ width: '14px', height: '14px' }} />
          {errors[field]}
        </div>
      )}
    </div>
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSaving(true);
    try {
      await onSave(formData);
      setIsEditing(false);
      } catch (error) {
      console.error('❌ Error guardando proyecto:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
      try {
        await onDelete(project.id);
        onClose();
      } catch (error) {
        console.error('Error eliminando proyecto:', error);
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'active': return '#3b82f6';
      case 'planning': return '#f59e0b';
      case 'on_hold': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
          
          .project-modal label {
            color: #1f2937 !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            background-color: rgba(255, 255, 255, 0.9) !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            display: inline-block !important;
            margin-bottom: 8px !important;
          }
        `}
      </style>
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        backdropFilter: 'blur(8px)'
      }}>
        <div className="project-modal" style={{
          backgroundColor: '#1f2937',
          borderRadius: '16px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
          width: '100%',
          maxWidth: '800px',
          margin: '0 16px',
          maxHeight: '90vh',
          overflowY: 'auto',
          border: '1px solid rgba(255, 255, 255, 0.1)'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '24px',
            borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                padding: '12px',
                backgroundColor: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                borderRadius: '12px',
                border: '1px solid rgba(59, 130, 246, 0.3)'
              }}>
                <Target style={{ width: '20px', height: '20px' }} />
              </div>
              <div>
                <h2 style={{
                  fontSize: '24px',
                  fontWeight: '700',
                  color: '#ffffff',
                  margin: '0 0 4px 0'
                }}>
                  {isEditing ? '✏️ Editar Proyecto' : '👁️ Ver Proyecto'}
                </h2>
                <p style={{
                  fontSize: '14px',
                  color: 'rgba(255, 255, 255, 0.8)',
                  margin: 0
                }}>
                  {isEditing ? 'Modifica los detalles del proyecto' : 'Información detallada del proyecto'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              style={{
                padding: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: 'none',
                borderRadius: '12px',
                color: 'white',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.transform = 'rotate(90deg)';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.transform = 'rotate(0deg)';
              }}
            >
              <X style={{ width: '20px', height: '20px' }} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* INFORMACIÓN BÁSICA - CAMPOS ESENCIALES */}
            <div style={{
              padding: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                <Target style={{ width: '22px', height: '22px', color: '#3b82f6' }} />
                Información del Proyecto
              </h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {createFormField('Nombre del Proyecto *', 'nombre', 'text', null, Target)}
                {createFormField('Descripción', 'descripcion', 'textarea', null, Edit)}
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                  {createFormField('Estado', 'status', 'select', [
                    { id: 'planning', name: 'Planeación' },
                    { id: 'active', name: 'En Progreso' },
                    { id: 'on_hold', name: 'En Pausa' },
                    { id: 'completed', name: 'Completado' },
                    { id: 'cancelled', name: 'Cancelado' }
                  ], Clock)}
                  
                  {createFormField('Prioridad', 'priority', 'select', [
                    { id: 'low', name: 'Baja' },
                    { id: 'medium', name: 'Media' },
                    { id: 'high', name: 'Alta' },
                    { id: 'critical', name: 'Crítica' }
                  ], AlertCircle)}
                </div>
              </div>
            </div>

            {/* CLIENTE Y FECHAS - CAMPOS IMPORTANTES */}
            <div style={{
              padding: '24px',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              backdropFilter: 'blur(20px)',
              boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
            }}>
              <h3 style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 20px 0',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
              }}>
                <Building style={{ width: '22px', height: '22px', color: '#10b981' }} />
                Detalles del Proyecto
              </h3>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                {/* Cliente - Solo lectura (ya asignado) */}
                <div style={{ marginBottom: '16px' }}>
                  <label style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#ffffff',
                    marginBottom: '8px',
                    textShadow: '0 1px 2px rgba(0, 0, 0, 0.3)'
                  }}>
                    <Building style={{ width: '16px', height: '16px', color: '#3b82f6' }} />
                    Cliente (Asignado)
                  </label>
                  <div style={{
                    width: '100%',
                    padding: '14px 16px',
                    border: '2px solid rgba(255, 255, 255, 0.15)',
                    borderRadius: '10px',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    color: '#ffffff',
                    fontSize: '15px',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    opacity: 0.7
                  }}>
                    {(() => {
                      // Intentar encontrar el cliente por ID
                      let client = clients.find(c => c.id === formData.cliente_id);
                      
                      // Si no se encuentra, intentar por cliente_id como string
                      if (!client) {
                        client = clients.find(c => c.id === String(formData.cliente_id));
                      }
                      
                      // Si aún no se encuentra, usar el nombre del cliente del proyecto
                      if (!client && project?.client) {
                        if (typeof project.client === 'object') {
                          return project.client.nombre || project.client.name || 'Cliente del proyecto';
                        } else {
                          return project.client;
                        }
                      }
                      
                      return client?.name || client?.nombre || 'Cliente no seleccionado';
                    })()}
                  </div>
                </div>
                
                {createFormField('Gerente de Proyecto', 'project_manager_id', 'select', users, User)}
                {createFormField('Fecha de Inicio', 'start_date', 'date', null, Calendar)}
                {createFormField('Fecha de Fin', 'end_date', 'date', null, Calendar)}
              </div>
            </div>

            {/* EQUIPO DE TRABAJO - DISEÑO MODERNO Y ELEGANTE */}
            <div style={{
              padding: '28px',
              background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
              borderRadius: '20px',
              border: '1px solid rgba(139, 92, 246, 0.2)',
              backdropFilter: 'blur(25px)',
              boxShadow: '0 12px 40px rgba(139, 92, 246, 0.15), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
            }}>
              {/* Header con gradiente */}
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '24px',
                paddingBottom: '16px',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #3b82f6 100%)',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(139, 92, 246, 0.3)'
                  }}>
                    <Users style={{ width: '20px', height: '20px', color: '#ffffff' }} />
                  </div>
                  <div>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#ffffff',
                      margin: '0',
                      textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)'
                    }}>
                      Equipo de Trabajo
                    </h3>
                    <p style={{
                      fontSize: '14px',
                      color: 'rgba(255, 255, 255, 0.7)',
                      margin: '2px 0 0 0'
                    }}>
                      {formData.members.length} {formData.members.length === 1 ? 'miembro' : 'miembros'}
                    </p>
                  </div>
                </div>
                
                {isEditing && (
                  <button
                    type="button"
                    onClick={() => setShowUserSelector(!showUserSelector)}
                    style={{
                      padding: '10px 16px',
                      background: showUserSelector 
                        ? 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      borderRadius: '10px',
                      color: '#ffffff',
                      fontSize: '13px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      boxShadow: showUserSelector 
                        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                        : '0 4px 12px rgba(16, 185, 129, 0.3)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = showUserSelector 
                        ? '0 6px 16px rgba(239, 68, 68, 0.4)'
                        : '0 6px 16px rgba(16, 185, 129, 0.4)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = showUserSelector 
                        ? '0 4px 12px rgba(239, 68, 68, 0.3)'
                        : '0 4px 12px rgba(16, 185, 129, 0.3)';
                    }}
                  >
                    {showUserSelector ? (
                      <>
                        <UserMinus style={{ width: '16px', height: '16px' }} />
                        Ocultar
                      </>
                    ) : (
                      <>
                        <UserPlus style={{ width: '16px', height: '16px' }} />
                        Agregar
                      </>
                    )}
                  </button>
                )}
              </div>
              
              {/* Grid de miembros actuales */}
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                gap: '16px',
                marginBottom: '20px'
              }}>
                {formData.members.map((member, index) => (
                  <div key={member.id || member.user_id} style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    borderRadius: '16px',
                    padding: '20px',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    backdropFilter: 'blur(10px)',
                    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
                  }}>
                    {/* Indicador de posición */}
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      right: '12px',
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.5)'
                    }} />
                    
                    {/* Avatar con gradiente */}
                    <div style={{
                      width: '50px',
                      height: '50px',
                      background: `linear-gradient(135deg, ${['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444'][index % 5]} 0%, ${['#7c3aed', '#2563eb', '#059669', '#d97706', '#dc2626'][index % 5]} 100%)`,
                      borderRadius: '16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontSize: '18px',
                      fontWeight: '700',
                      marginBottom: '16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)'
                    }}>
                      {String(member.user?.name || member.name || '').charAt(0).toUpperCase()}
                    </div>
                    
                    {/* Información del miembro */}
                    <div style={{ marginBottom: '16px' }}>
                      <h4 style={{
                        color: '#ffffff',
                        fontWeight: '600',
                        fontSize: '16px',
                        margin: '0 0 4px 0',
                        lineHeight: '1.2'
                      }}>
                        {String(member.user?.name || member.name || 'Sin nombre')}
                      </h4>
                      <p style={{
                        color: 'rgba(255, 255, 255, 0.7)',
                        fontSize: '13px',
                        margin: '0 0 8px 0',
                        fontWeight: '500'
                      }}>
                        {String(member.user?.email || 'Sin email')}
                      </p>
                      <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                        borderRadius: '20px',
                        border: '1px solid rgba(139, 92, 246, 0.3)'
                      }}>
                        <span style={{
                          color: '#8b5cf6',
                          fontSize: '12px',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          letterSpacing: '0.5px'
                        }}>
                          {String(member.role?.name || member.role || 'Miembro')}
                        </span>
                      </div>
                    </div>
                    
                    {/* Botón de eliminar */}
                    {isEditing && (
                      <button
                        type="button"
                        onClick={() => removeUserFromProject(member.user_id || member.id)}
                        style={{
                          position: 'absolute',
                          bottom: '16px',
                          right: '16px',
                          width: '32px',
                          height: '32px',
                          background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                          border: 'none',
                          borderRadius: '8px',
                          color: '#ffffff',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          boxShadow: '0 2px 8px rgba(239, 68, 68, 0.3)'
                        }}
                        onMouseOver={(e) => {
                          e.target.style.transform = 'scale(1.1)';
                          e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.4)';
                        }}
                        onMouseOut={(e) => {
                          e.target.style.transform = 'scale(1)';
                          e.target.style.boxShadow = '0 2px 8px rgba(239, 68, 68, 0.3)';
                        }}
                      >
                        <UserMinus style={{ width: '14px', height: '14px' }} />
                      </button>
                    )}
                  </div>
                ))}
                
                {/* Estado vacío */}
                {formData.members.length === 0 && (
                  <div style={{
                    gridColumn: '1 / -1',
                    padding: '40px 20px',
                    textAlign: 'center',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%)',
                    borderRadius: '16px',
                    border: '2px dashed rgba(255, 255, 255, 0.2)',
                    backdropFilter: 'blur(10px)'
                  }}>
                    <Users style={{ 
                      width: '48px', 
                      height: '48px', 
                      color: 'rgba(255, 255, 255, 0.3)',
                      marginBottom: '16px'
                    }} />
                    <h4 style={{
                      color: 'rgba(255, 255, 255, 0.6)',
                      fontSize: '16px',
                      fontWeight: '600',
                      margin: '0 0 8px 0'
                    }}>
                      No hay miembros asignados
                    </h4>
                    <p style={{
                      color: 'rgba(255, 255, 255, 0.4)',
                      fontSize: '14px',
                      margin: '0'
                    }}>
                      Agrega usuarios al proyecto para comenzar
                    </p>
                  </div>
                )}
              </div>
              
              {/* Selector de usuarios disponibles */}
              {isEditing && showUserSelector && (
                <div style={{
                  background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                  borderRadius: '16px',
                  border: '1px solid rgba(16, 185, 129, 0.2)',
                  padding: '20px',
                  backdropFilter: 'blur(10px)'
                }}>
                  <h4 style={{
                    color: '#ffffff',
                    fontSize: '16px',
                    fontWeight: '600',
                    margin: '0 0 16px 0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}>
                    <Plus style={{ width: '18px', height: '18px', color: '#10b981' }} />
                    Usuarios Disponibles
                  </h4>
                  
                  {availableUsers.length > 0 ? (
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                      gap: '12px',
                      maxHeight: '300px',
                      overflowY: 'auto',
                      paddingRight: '8px'
                    }}>
                      {availableUsers.map((user, index) => (
                        <div key={user.id} style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
                          borderRadius: '12px',
                          padding: '16px',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px'
                        }}
                        onClick={() => addUserToProject(user)}
                        onMouseOver={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(16, 185, 129, 0.2) 0%, rgba(16, 185, 129, 0.1) 100%)';
                          e.currentTarget.style.borderColor = 'rgba(16, 185, 129, 0.3)';
                          e.currentTarget.style.transform = 'translateY(-1px)';
                        }}
                        onMouseOut={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)';
                          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                          e.currentTarget.style.transform = 'translateY(0)';
                        }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            background: `linear-gradient(135deg, #10b981 0%, #059669 100%)`,
                            borderRadius: '10px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#ffffff',
                            fontSize: '14px',
                            fontWeight: '600',
                            flexShrink: 0
                          }}>
                            {String(user.name || '').charAt(0).toUpperCase()}
                          </div>
                          <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{
                              color: '#ffffff',
                              fontWeight: '600',
                              fontSize: '14px',
                              marginBottom: '2px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {String(user.name || '')}
                            </div>
                            <div style={{
                              color: 'rgba(255, 255, 255, 0.6)',
                              fontSize: '12px',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis'
                            }}>
                              {String(user.email || '')}
                            </div>
                          </div>
                          <div style={{
                            padding: '4px 8px',
                            background: 'rgba(16, 185, 129, 0.2)',
                            borderRadius: '6px',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            flexShrink: 0
                          }}>
                            <span style={{
                              color: '#10b981',
                              fontSize: '11px',
                              fontWeight: '600'
                            }}>
                              {String(user.role || 'Usuario')}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div style={{
                      padding: '20px',
                      textAlign: 'center',
                      color: 'rgba(255, 255, 255, 0.5)',
                      background: 'rgba(255, 255, 255, 0.05)',
                      borderRadius: '12px',
                      border: '1px dashed rgba(255, 255, 255, 0.2)'
                    }}>
                      <UserCheck style={{ 
                        width: '32px', 
                        height: '32px', 
                        color: 'rgba(255, 255, 255, 0.3)',
                        marginBottom: '8px'
                      }} />
                      <p style={{ margin: '0', fontSize: '14px' }}>
                        Todos los usuarios ya están asignados al proyecto
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Información adicional en modo vista */}
            {!isEditing && project && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
                padding: '20px',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: '12px',
                border: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                {/* Estado */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: `${getStatusColor(formData.status)}20`,
                    color: getStatusColor(formData.status),
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {formData.status}
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Estado</p>
                </div>

                {/* Prioridad */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: `${getPriorityColor(formData.priority)}20`,
                    color: getPriorityColor(formData.priority),
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                  }}>
                    {formData.priority}
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Prioridad</p>
                </div>

                {/* Progreso */}
                <div style={{ textAlign: 'center' }}>
                  <div style={{
                    padding: '8px 12px',
                    backgroundColor: 'rgba(59, 130, 246, 0.2)',
                    color: '#3b82f6',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: '600'
                  }}>
                    {formData.progress}%
                  </div>
                  <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Progreso</p>
                </div>

                {/* Presupuesto */}
                {formData.budget > 0 && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{
                      padding: '8px 12px',
                      backgroundColor: 'rgba(34, 197, 94, 0.2)',
                      color: '#22c55e',
                      borderRadius: '20px',
                      fontSize: '12px',
                      fontWeight: '600'
                    }}>
                      ${formData.budget.toLocaleString()}
                    </div>
                    <p style={{ margin: '8px 0 0 0', color: 'rgba(255, 255, 255, 0.7)', fontSize: '14px' }}>Presupuesto</p>
                  </div>
                )}
              </div>
            )}

            {/* Botones de acción */}
            <div style={{
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              paddingTop: '20px',
              borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              {isEditing ? (
                <>
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(107, 114, 128, 0.2)',
                      border: '1px solid rgba(107, 114, 128, 0.3)',
                      borderRadius: '12px',
                      color: '#ffffff',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(107, 114, 128, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      opacity: saving ? 0.5 : 1,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      if (!saving) {
                        e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                        e.target.style.transform = 'translateY(-2px)';
                      }
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    {saving ? (
                      <>
                        <div style={{
                          width: '16px',
                          height: '16px',
                          border: '2px solid rgba(59, 130, 246, 0.3)',
                          borderTop: '2px solid #3b82f6',
                          borderRadius: '50%',
                          animation: 'spin 1s linear infinite'
                        }} />
                        Guardando...
                      </>
                    ) : (
                      <>
                        <Save style={{ width: '16px', height: '16px' }} />
                        Guardar
                      </>
                    )}
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onDelete && handleDelete()}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(239, 68, 68, 0.2)',
                      border: '1px solid rgba(239, 68, 68, 0.3)',
                      borderRadius: '12px',
                      color: '#ef4444',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <Trash2 style={{ width: '16px', height: '16px' }} />
                    Eliminar
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: 'rgba(59, 130, 246, 0.2)',
                      border: '1px solid rgba(59, 130, 246, 0.3)',
                      borderRadius: '12px',
                      color: '#3b82f6',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.3)';
                      e.target.style.transform = 'translateY(-2px)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'rgba(59, 130, 246, 0.2)';
                      e.target.style.transform = 'translateY(0)';
                    }}
                  >
                    <Edit style={{ width: '16px', height: '16px' }} />
                    Editar
                  </button>
                </>
              )}
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default ProjectFormModal;
