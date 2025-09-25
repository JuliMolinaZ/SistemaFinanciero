// 🎨 COMPONENTES DE BOTONES CON ESTILO DEL FORMULARIO DE TAREAS
// ===============================================================

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Edit as EditIcon, 
  Eye as ViewIcon, 
  Trash2 as DeleteIcon,
  MoreHorizontal as MoreIcon,
  Download as ExportIcon,
  Copy as CopyIcon
} from 'lucide-react';

// 🎯 BOTÓN PRINCIPAL DE EDICIÓN
export const TaskFormEditButton = ({ 
  onClick, 
  title = "Editar", 
  disabled = false,
  size = "medium" 
}) => {
  const sizeStyles = {
    small: { padding: '8px', iconSize: '16px', fontSize: '12px' },
    medium: { padding: '12px', iconSize: '20px', fontSize: '14px' },
    large: { padding: '16px', iconSize: '24px', fontSize: '16px' }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="task-form-edit-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: currentSize.padding,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        border: '1px solid rgba(59, 130, 246, 0.3)',
        borderRadius: '12px',
        color: '#3b82f6',
        fontSize: currentSize.fontSize,
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: '0 4px 12px rgba(59, 130, 246, 0.15)'
      }}
      whileHover={!disabled ? { 
        scale: 1.05, 
        backgroundColor: 'rgba(59, 130, 246, 0.3)',
        boxShadow: '0 6px 20px rgba(59, 130, 246, 0.25)'
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={title}
    >
      <EditIcon size={currentSize.iconSize} />
      {title}
    </motion.button>
  );
};

// 👁️ BOTÓN DE VISTA
export const TaskFormViewButton = ({ 
  onClick, 
  title = "Ver", 
  disabled = false,
  size = "medium" 
}) => {
  const sizeStyles = {
    small: { padding: '8px', iconSize: '16px', fontSize: '12px' },
    medium: { padding: '12px', iconSize: '20px', fontSize: '14px' },
    large: { padding: '16px', iconSize: '24px', fontSize: '16px' }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="task-form-view-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: currentSize.padding,
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        borderRadius: '12px',
        color: '#10b981',
        fontSize: currentSize.fontSize,
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: '0 4px 12px rgba(16, 185, 129, 0.15)'
      }}
      whileHover={!disabled ? { 
        scale: 1.05, 
        backgroundColor: 'rgba(16, 185, 129, 0.3)',
        boxShadow: '0 6px 20px rgba(16, 185, 129, 0.25)'
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={title}
    >
      <ViewIcon size={currentSize.iconSize} />
      {title}
    </motion.button>
  );
};

// 🗑️ BOTÓN DE ELIMINACIÓN
export const TaskFormDeleteButton = ({ 
  onClick, 
  title = "Eliminar", 
  disabled = false,
  size = "medium" 
}) => {
  const sizeStyles = {
    small: { padding: '8px', iconSize: '16px', fontSize: '12px' },
    medium: { padding: '12px', iconSize: '20px', fontSize: '14px' },
    large: { padding: '16px', iconSize: '24px', fontSize: '16px' }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="task-form-delete-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: currentSize.padding,
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        border: '1px solid rgba(239, 68, 68, 0.3)',
        borderRadius: '12px',
        color: '#ef4444',
        fontSize: currentSize.fontSize,
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: '0 4px 12px rgba(239, 68, 68, 0.15)'
      }}
      whileHover={!disabled ? { 
        scale: 1.05, 
        backgroundColor: 'rgba(239, 68, 68, 0.3)',
        boxShadow: '0 6px 20px rgba(239, 68, 68, 0.25)'
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={title}
    >
      <DeleteIcon size={currentSize.iconSize} />
      {title}
    </motion.button>
  );
};

// 📤 BOTÓN DE EXPORTAR
export const TaskFormExportButton = ({ 
  onClick, 
  title = "Exportar", 
  disabled = false,
  size = "medium" 
}) => {
  const sizeStyles = {
    small: { padding: '8px', iconSize: '16px', fontSize: '12px' },
    medium: { padding: '12px', iconSize: '20px', fontSize: '14px' },
    large: { padding: '16px', iconSize: '24px', fontSize: '16px' }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="task-form-export-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: currentSize.padding,
        backgroundColor: 'rgba(245, 158, 11, 0.2)',
        border: '1px solid rgba(245, 158, 11, 0.3)',
        borderRadius: '12px',
        color: '#f59e0b',
        fontSize: currentSize.fontSize,
        fontWeight: '600',
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        opacity: disabled ? 0.5 : 1,
        boxShadow: '0 4px 12px rgba(245, 158, 11, 0.15)'
      }}
      whileHover={!disabled ? { 
        scale: 1.05, 
        backgroundColor: 'rgba(245, 158, 11, 0.3)',
        boxShadow: '0 6px 20px rgba(245, 158, 11, 0.25)'
      } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      title={title}
    >
      <ExportIcon size={currentSize.iconSize} />
      {title}
    </motion.button>
  );
};

// 📋 CONJUNTO DE BOTONES DE ACCIONES
export const TaskFormActionButtons = ({ 
  onEdit, 
  onView, 
  onDelete, 
  onExport,
  showLabels = true,
  size = "medium",
  disabled = {}
}) => {
  return (
    <div style={{
      display: 'flex',
      gap: '8px',
      alignItems: 'center',
      flexWrap: 'wrap'
    }}>
      {onView && (
        <TaskFormViewButton 
          onClick={onView} 
          title={showLabels ? "Ver" : ""}
          size={size}
          disabled={disabled.view}
        />
      )}
      
      {onEdit && (
        <TaskFormEditButton 
          onClick={onEdit} 
          title={showLabels ? "Editar" : ""}
          size={size}
          disabled={disabled.edit}
        />
      )}
      
      {onExport && (
        <TaskFormExportButton 
          onClick={onExport} 
          title={showLabels ? "Exportar" : ""}
          size={size}
          disabled={disabled.export}
        />
      )}
      
      {onDelete && (
        <TaskFormDeleteButton 
          onClick={onDelete} 
          title={showLabels ? "Eliminar" : ""}
          size={size}
          disabled={disabled.delete}
        />
      )}
    </div>
  );
};

// 🎯 BOTÓN DE MÁS ACCIONES (MENÚ DESPLEGABLE)
export const TaskFormMoreButton = ({ 
  children, 
  title = "Más acciones",
  size = "medium" 
}) => {
  const sizeStyles = {
    small: { padding: '8px', iconSize: '16px' },
    medium: { padding: '12px', iconSize: '20px' },
    large: { padding: '16px', iconSize: '24px' }
  };

  const currentSize = sizeStyles[size];

  return (
    <motion.button
      className="task-form-more-button"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: currentSize.padding,
        backgroundColor: 'rgba(107, 114, 128, 0.2)',
        border: '1px solid rgba(107, 114, 128, 0.3)',
        borderRadius: '12px',
        color: '#6b7280',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 12px rgba(107, 114, 128, 0.15)',
        minWidth: '44px'
      }}
      whileHover={{ 
        scale: 1.05, 
        backgroundColor: 'rgba(107, 114, 128, 0.3)',
        boxShadow: '0 6px 20px rgba(107, 114, 128, 0.25)'
      }}
      whileTap={{ scale: 0.95 }}
      title={title}
    >
      <MoreIcon size={currentSize.iconSize} />
      {children}
    </motion.button>
  );
};

export default {
  TaskFormEditButton,
  TaskFormViewButton,
  TaskFormDeleteButton,
  TaskFormExportButton,
  TaskFormActionButtons,
  TaskFormMoreButton
};
