// 🎯 TASK FORM MODAL - FORMULARIO DE CREACIÓN/EDICIÓN DE TAREAS
// ================================================================

import React, { useState, useEffect } from 'react';
import {
  X,
  Save,
  Calendar,
  User,
  Flag,
  FileText,
  Clock,
  Target,
  Tag,
  AlertCircle
} from 'lucide-react';

const TaskFormModal = ({ isOpen, onClose, onSave, task = null, projectId, users = [], currentUser = null }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'todo',
    priority: 'medium',
    assignee_id: '',
    due_date: '',
    estimated_hours: '',
    story_points: '',
    tags: ''
  });

  const [errors, setErrors] = useState({});
  const [loading, setSaving] = useState(false);

  // Usar usuarios reales desde props, con fallback
  const availableUsers = users.length > 0 ? users : [
    { id: 1, name: 'Juan Pérez', email: 'juan@empresa.com' },
    { id: 2, name: 'María García', email: 'maria@empresa.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@empresa.com' },
    { id: 4, name: 'Ana Martín', email: 'ana@empresa.com' }
  ];

  useEffect(() => {
    if (task) {
      // Buscar el usuario asignado en la lista de usuarios disponibles
      let assigneeId = '';
      if (task.assigned_to) {
        assigneeId = task.assigned_to;
      } else if (task.assignee?.id) {
        assigneeId = task.assignee.id;
      } else if (task.assignee && typeof task.assignee === 'number') {
        assigneeId = task.assignee;
      }

      setFormData({
        title: task.title || '',
        description: task.description || '',
        status: task.status || 'todo',
        priority: task.priority || 'medium',
        assignee_id: String(assigneeId), // Convertir a string para el select
        due_date: task.due_date ? task.due_date.split('T')[0] : '',
        estimated_hours: task.estimated_hours || '',
        story_points: task.story_points || '',
        tags: task.tags?.join(', ') || ''
      });
    } else {

      setFormData({
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        assignee_id: '',
        due_date: '',
        estimated_hours: '',
        story_points: '',
        tags: ''
      });
    }
    setErrors({});
  }, [task, isOpen]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'El título es requerido';
    }

    if (formData.estimated_hours && (isNaN(formData.estimated_hours) || formData.estimated_hours < 0)) {
      newErrors.estimated_hours = 'Debe ser un número válido';
    }

    if (formData.story_points && (isNaN(formData.story_points) || formData.story_points < 0)) {
      newErrors.story_points = 'Debe ser un número válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setSaving(true);
    try {
      const taskData = {
        ...formData,
        project_id: projectId,
        assigned_to: formData.assignee_id ? parseInt(formData.assignee_id) : null, // Usar assigned_to como campo principal
        assignee_id: formData.assignee_id ? parseInt(formData.assignee_id) : null, // Mantener para compatibilidad
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : null,
        story_points: formData.story_points ? parseInt(formData.story_points) : null,
        tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(Boolean) : []
      };

      if (task) {
        await onSave({ ...task, ...taskData });
      } else {
        await onSave({
          id: Date.now(), // En producción será generado por el backend
          ...taskData,
          created_at: new Date().toISOString(),
          progress: 0
        });
      }

      onClose();
    } catch (error) {
      console.error('Error saving task:', error);
      setErrors({ submit: 'Error al guardar la tarea' });
    } finally {
      setSaving(false);
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
          
          /* Forzar visibilidad de labels en el modal */
          .task-modal label {
            color: #1f2937 !important;
            font-weight: 700 !important;
            font-size: 14px !important;
            background-color: rgba(255, 255, 255, 0.9) !important;
            padding: 4px 8px !important;
            border-radius: 6px !important;
            display: inline-block !important;
            margin-bottom: 8px !important;
          }
          
          /* Estilos para inputs de fecha en modo oscuro */
          input[type="date"]::-webkit-calendar-picker-indicator {
            filter: invert(1);
            cursor: pointer;
          }
          
          input[type="date"]::-webkit-datetime-edit-text {
            color: #ffffff;
          }
          
          input[type="date"]::-webkit-datetime-edit-month-field {
            color: #ffffff;
          }
          
          input[type="date"]::-webkit-datetime-edit-day-field {
            color: #ffffff;
          }
          
          input[type="date"]::-webkit-datetime-edit-year-field {
            color: #ffffff;
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
      <div className="task-modal" style={{
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
              <FileText style={{ width: '20px', height: '20px' }} />
            </div>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#ffffff',
                margin: '0 0 4px 0'
              }}>
                {task ? '✏️ Editar Tarea' : '✨ Crear Nueva Tarea'}
              </h2>
              <p style={{
                fontSize: '14px',
                color: 'rgba(255, 255, 255, 0.8)',
                margin: 0
              }}>
                {task ? 'Modifica los detalles de la tarea' : 'Completa los datos para crear una nueva tarea'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              backgroundColor: 'transparent',
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            onMouseOver={(e) => {
              e.target.style.color = '#ffffff';
              e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
            }}
            onMouseOut={(e) => {
              e.target.style.color = 'rgba(255, 255, 255, 0.6)';
              e.target.style.backgroundColor = 'transparent';
            }}
          >
            <X style={{ width: '20px', height: '20px' }} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Title */}
          <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                width: 'fit-content'
              }}>
                <Target style={{ width: '16px', height: '16px' }} />
                Título *
              </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => handleChange('title', e.target.value)}
              placeholder="Nueva tarea"
              style={{
                width: '100%',
                padding: '12px 16px',
                border: `2px solid ${errors.title ? '#ef4444' : 'rgba(255, 255, 255, 0.2)'}`,
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.title ? '#ef4444' : 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            {errors.title && (
              <p style={{
                marginTop: '8px',
                fontSize: '14px',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <AlertCircle style={{ width: '16px', height: '16px' }} />
                {errors.title}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                width: 'fit-content'
              }}>
                <FileText style={{ width: '16px', height: '16px' }} />
                Descripción
              </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleChange('description', e.target.value)}
              rows={4}
              placeholder="Detalla los requerimientos y criterios de aceptación..."
              style={{
                width: '100%',
                padding: '12px 16px',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                color: '#ffffff',
                fontSize: '16px',
                outline: 'none',
                transition: 'all 0.2s ease',
                backdropFilter: 'blur(10px)',
                resize: 'none',
                fontFamily: 'inherit'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#3b82f6';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                e.target.style.boxShadow = 'none';
              }}
            />
            <p style={{
              marginTop: '8px',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.6)',
              textAlign: 'right'
            }}>
              {formData.description.length}/1000 caracteres
            </p>
          </div>

          {/* Two Column Layout */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px'
          }}>
            {/* Status */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                width: 'fit-content'
              }}>
                <Target style={{ width: '16px', height: '16px' }} />
                Estado
              </label>
              <select
                value={formData.status}
                onChange={(e) => handleChange('status', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="todo" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>📋 Por Hacer</option>
                <option value="in_progress" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>🚀 En Progreso</option>
                <option value="review" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>👀 En Revisión</option>
                <option value="done" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>✅ Completado</option>
              </select>
            </div>

            {/* Priority */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                width: 'fit-content'
              }}>
                <Flag style={{ width: '16px', height: '16px' }} />
                Prioridad
              </label>
              <select
                value={formData.priority}
                onChange={(e) => handleChange('priority', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="low" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>🟢 Baja</option>
                <option value="medium" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>🟡 Media</option>
                <option value="high" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>🔴 Alta</option>
              </select>
            </div>

            {/* Assignee */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                width: 'fit-content'
              }}>
                <User style={{ width: '16px', height: '16px' }} />
                Asignado a
              </label>
              <select
                value={formData.assignee_id}
                onChange={(e) => handleChange('assignee_id', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <option value="" style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>Sin asignar</option>
                {availableUsers.map(user => (
                  <option key={user.id} value={user.id} style={{ backgroundColor: '#1f2937', color: '#ffffff' }}>
                    {user.name} {user.email ? `(${user.email})` : ''}
                  </option>
                ))}
              </select>
            </div>

            {/* Due Date */}
            <div>
              <label style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: '700',
                color: '#1f2937',
                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                padding: '4px 8px',
                borderRadius: '6px',
                marginBottom: '8px',
                width: 'fit-content'
              }}>
                <Calendar style={{ width: '16px', height: '16px' }} />
                Fecha de vencimiento
              </label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => handleChange('due_date', e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid rgba(255, 255, 255, 0.2)',
                  borderRadius: '12px',
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                  color: '#ffffff',
                  fontSize: '16px',
                  outline: 'none',
                  transition: 'all 0.2s ease',
                  backdropFilter: 'blur(10px)',
                  cursor: 'pointer'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.15)';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.boxShadow = 'none';
                }}
              />
            </div>
          </div>

          {/* Error Message */}
          {errors.submit && (
            <div style={{
              padding: '16px',
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              borderRadius: '12px'
            }}>
              <p style={{
                fontSize: '14px',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                margin: 0
              }}>
                <AlertCircle style={{ width: '16px', height: '16px' }} />
                {errors.submit}
              </p>
            </div>
          )}

          {/* Actions */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '12px',
            paddingTop: '24px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              style={{
                padding: '12px 24px',
                color: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
                border: '2px solid rgba(255, 255, 255, 0.2)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.5 : 1
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                }
              }}
            >
              <X style={{ width: '16px', height: '16px' }} />
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: '12px 24px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontSize: '16px',
                fontWeight: '600',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                opacity: loading ? 0.5 : 1,
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)'
              }}
              onMouseOver={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#2563eb';
                  e.target.style.borderColor = '#2563eb';
                  e.target.style.transform = 'translateY(-1px)';
                  e.target.style.boxShadow = '0 6px 16px rgba(59, 130, 246, 0.4)';
                }
              }}
              onMouseOut={(e) => {
                if (!loading) {
                  e.target.style.backgroundColor = '#3b82f6';
                  e.target.style.borderColor = '#3b82f6';
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.3)';
                }
              }}
            >
              {loading ? (
                <div style={{
                  width: '16px',
                  height: '16px',
                  border: '2px solid #ffffff',
                  borderTop: '2px solid transparent',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }} />
              ) : (
                <Save style={{ width: '16px', height: '16px' }} />
              )}
              {task ? 'Actualizar' : 'Crear'} Tarea
            </button>
          </div>
        </form>
      </div>
    </div>
    </>
  );
};

export default TaskFormModal;