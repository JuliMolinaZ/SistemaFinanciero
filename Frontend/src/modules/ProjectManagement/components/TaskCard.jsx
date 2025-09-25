// 🎯 TASK CARD - TARJETA DE TAREA
// ===============================

import React, { useState, useContext } from 'react';
import { 
  PencilIcon, 
  TrashIcon, 
  UserIcon,
  CalendarIcon,
  FlagIcon,
  EllipsisVerticalIcon
} from '@heroicons/react/24/outline';
import { useConfirm } from '../../../hooks/useConfirm';
import { GlobalContext } from '../../../context/GlobalState';

const TaskCard = ({ task, onEdit, onDelete, users }) => {
  const { confirmDelete } = useConfirm();
  const { profileData } = useContext(GlobalContext);
  const [showMenu, setShowMenu] = useState(false);

  // 🔐 Verificar si el usuario actual puede eliminar esta tarea
  const canDeleteTask = () => {
    // Si no hay información del usuario o de la tarea, no permitir
    if (!profileData || !task) {
      return false;
    }

    // Si la tarea no tiene created_by, no permitir eliminar
    if (!task.created_by) {
      return false;
    }

    // Solo el creador puede eliminar la tarea
    return profileData.id === task.created_by;
  };

  // Obtener información del asignado
  const assignee = users?.find(user => user.id === task.assigned_to);

  // Obtener color de prioridad
  const getPriorityColor = (priority) => {
    const colors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-orange-100 text-orange-800',
      critical: 'bg-red-100 text-red-800'
    };
    return colors[priority] || colors.medium;
  };

  // Obtener etiqueta de prioridad
  const getPriorityLabel = (priority) => {
    const labels = {
      low: 'Baja',
      medium: 'Media',
      high: 'Alta',
      critical: 'Crítica'
    };
    return labels[priority] || priority;
  };

  // Formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  // Manejar eliminación
  const handleDelete = async () => {
    const confirmed = await confirmDelete(
      `¿Estás seguro de que quieres eliminar la tarea "${task.title}"?`,
      'Eliminar tarea'
    );

    if (confirmed) {
      onDelete(task.id);
    }
  };

  return (
    <div className="pm-task-card">
      
      {/* Header */}
      <div className="pm-task-header">
        <h4 className="pm-task-title">
          {task.title}
        </h4>
        
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="pm-task-menu"
          >
            <EllipsisVerticalIcon style={{ width: '14px', height: '14px' }} />
          </button>
          
          {showMenu && (
            <div style={{
              position: 'absolute',
              right: '0',
              top: '100%',
              marginTop: '8px',
              width: '200px',
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.2), 0 8px 16px rgba(0,0,0,0.1)',
              zIndex: 50,
              border: '1px solid rgba(255,255,255,0.3)',
              overflow: 'hidden',
              backdropFilter: 'blur(20px)'
            }}>
              <div style={{ padding: '8px' }}>
                <button
                  onClick={() => {
                    onEdit(task);
                    setShowMenu(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                    padding: '12px 16px',
                    fontSize: '14px',
                    color: '#374151',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.backgroundColor = '#f3f4f6';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.backgroundColor = 'transparent';
                  }}
                >
                  <PencilIcon style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                  ✏️ Editar
                </button>
                {canDeleteTask() && (
                  <button
                    onClick={() => {
                      handleDelete();
                      setShowMenu(false);
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '14px',
                      color: '#dc2626',
                      backgroundColor: 'transparent',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#fef2f2';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = 'transparent';
                    }}
                  >
                    <TrashIcon style={{ width: '16px', height: '16px', marginRight: '12px' }} />
                    🗑️ Eliminar
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Descripción */}
      {task.description && (
        <p className="pm-task-description">
          {task.description}
        </p>
      )}

      {/* Información de la tarea */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', position: 'relative', zIndex: 1 }}>
        {/* Prioridad */}
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <FlagIcon style={{ width: '16px', height: '16px', marginRight: '8px', color: '#9ca3af' }} />
          <span className={`pm-task-priority pm-priority-${task.priority}`}>
            🏷️ {getPriorityLabel(task.priority)}
          </span>
        </div>

        {/* Asignado */}
        {assignee && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <UserIcon style={{ width: '16px', height: '16px', marginRight: '8px', color: '#9ca3af' }} />
            <div style={{ display: 'flex', alignItems: 'center' }}>
              {assignee.avatar ? (
                <img
                  src={assignee.avatar}
                  alt={assignee.name}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '50%',
                    marginRight: '8px',
                    border: '2px solid #e5e7eb'
                  }}
                />
              ) : (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: '#4f46e5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: '8px',
                  border: '2px solid #e5e7eb'
                }}>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: '600',
                    color: 'white'
                  }}>
                    {assignee.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
              )}
              <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
                👤 {assignee.name}
              </span>
            </div>
          </div>
        )}

        {/* Fecha de vencimiento */}
        {task.due_date && (
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <CalendarIcon style={{ width: '16px', height: '16px', marginRight: '8px', color: '#9ca3af' }} />
            <span style={{ fontSize: '12px', color: '#6b7280', fontWeight: '500' }}>
              📅 {formatDate(task.due_date)}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        marginTop: '20px',
        paddingTop: '16px',
        borderTop: '2px solid rgba(229, 231, 235, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'relative',
        zIndex: 1
      }}>
        <span style={{ 
          fontSize: '12px', 
          color: '#9ca3af', 
          fontWeight: '600',
          background: 'rgba(156, 163, 175, 0.1)',
          padding: '4px 8px',
          borderRadius: '8px'
        }}>
          ID: {task.id}
        </span>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            backgroundColor: task.status === 'done' ? '#22c55e' :
                            task.status === 'in_progress' ? '#3b82f6' :
                            task.status === 'review' ? '#eab308' : '#9ca3af',
            boxShadow: `0 0 12px ${task.status === 'done' ? '#22c55e' :
                        task.status === 'in_progress' ? '#3b82f6' :
                        task.status === 'review' ? '#eab308' : '#9ca3af'}40`
          }} />
          <span style={{
            fontSize: '11px',
            color: '#6b7280',
            fontWeight: '600',
            textTransform: 'uppercase',
            letterSpacing: '0.5px'
          }}>
            {task.status === 'done' ? 'Completado' :
             task.status === 'in_progress' ? 'En Progreso' :
             task.status === 'review' ? 'En Revisión' : 'Por Hacer'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
