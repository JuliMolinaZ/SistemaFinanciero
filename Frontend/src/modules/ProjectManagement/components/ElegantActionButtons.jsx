// 🎨 BOTONES DE ACCIONES ELEGANTES Y MINIMALISTAS
// ================================================

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Edit as EditIcon, 
  Eye as ViewIcon, 
  Trash2 as DeleteIcon,
  MoreHorizontal as MoreIcon,
  Copy as CopyIcon,
  ExternalLink as ExportIcon,
  Clock as HistoryIcon
} from 'lucide-react';

// 🎯 BOTÓN INDIVIDUAL ULTRA ELEGANTE
const ElegantActionButton = ({ 
  icon: Icon, 
  onClick, 
  title, 
  variant = "default",
  size = "small",
  disabled = false 
}) => {
  const sizeStyles = {
    small: { 
      width: '28px', 
      height: '28px', 
      iconSize: '12px',
      borderRadius: '6px'
    },
    medium: { 
      width: '32px', 
      height: '32px', 
      iconSize: '14px',
      borderRadius: '8px'
    }
  };

  const variantStyles = {
    default: {
      backgroundColor: 'rgba(55, 65, 81, 0.6)',
      border: '1px solid rgba(75, 85, 99, 0.3)',
      color: '#d1d5db',
      hoverBg: 'rgba(55, 65, 81, 0.8)',
      hoverColor: '#f9fafb',
      hoverShadow: '0 2px 8px rgba(0, 0, 0, 0.3)'
    },
    view: {
      backgroundColor: 'rgba(59, 130, 246, 0.15)',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      color: '#60a5fa',
      hoverBg: 'rgba(59, 130, 246, 0.25)',
      hoverColor: '#93c5fd',
      hoverShadow: '0 2px 8px rgba(59, 130, 246, 0.2)'
    },
    edit: {
      backgroundColor: 'rgba(16, 185, 129, 0.15)',
      border: '1px solid rgba(16, 185, 129, 0.3)',
      color: '#34d399',
      hoverBg: 'rgba(16, 185, 129, 0.25)',
      hoverColor: '#6ee7b7',
      hoverShadow: '0 2px 8px rgba(16, 185, 129, 0.2)'
    },
    delete: {
      backgroundColor: 'rgba(239, 68, 68, 0.15)',
      border: '1px solid rgba(239, 68, 68, 0.3)',
      color: '#f87171',
      hoverBg: 'rgba(239, 68, 68, 0.25)',
      hoverColor: '#fca5a5',
      hoverShadow: '0 2px 8px rgba(239, 68, 68, 0.2)'
    }
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      className="elegant-action-button"
      style={{
        width: currentSize.width,
        height: currentSize.height,
        borderRadius: currentSize.borderRadius,
        backgroundColor: currentVariant.backgroundColor,
        border: currentVariant.border,
        color: currentVariant.color,
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.4 : 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.15s cubic-bezier(0.4, 0, 0.2, 1)',
        backdropFilter: 'blur(12px)',
        boxShadow: '0 1px 2px rgba(0, 0, 0, 0.04)',
        position: 'relative',
        overflow: 'hidden'
      }}
      whileHover={!disabled ? { 
        backgroundColor: currentVariant.hoverBg,
        color: currentVariant.hoverColor,
        boxShadow: currentVariant.hoverShadow,
        scale: 1.08,
        y: -1
      } : {}}
      whileTap={!disabled ? { scale: 0.96, y: 0 } : {}}
      title={title}
    >
      <Icon size={currentSize.iconSize} />
    </motion.button>
  );
};

// 📋 CONJUNTO DE BOTONES ELEGANTES Y MINIMALISTAS
export const ElegantActionButtons = ({ 
  onView, 
  onEdit, 
  onDelete,
  onCopy,
  onExport,
  onHistory,
  size = "small",
  disabled = {},
  showMoreMenu = true
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  const primaryActions = [];
  
  // Agregar acciones primarias
  if (onView) primaryActions.push({ icon: ViewIcon, onClick: onView, title: "Ver detalles", variant: "view" });
  if (onEdit) primaryActions.push({ icon: EditIcon, onClick: onEdit, title: "Editar", variant: "edit" });
  
  // Si hay más de 2 acciones primarias, mover algunas al menú
  const shouldShowMoreMenu = showMoreMenu && (onDelete || onCopy || onExport || onHistory || primaryActions.length > 2);
  
  const visibleActions = shouldShowMoreMenu ? primaryActions.slice(0, 2) : primaryActions;
  const menuActions = shouldShowMoreMenu ? [
    ...primaryActions.slice(2),
    ...(onDelete ? [{ icon: DeleteIcon, onClick: onDelete, title: "Eliminar", variant: "delete" }] : []),
    ...(onCopy ? [{ icon: CopyIcon, onClick: onCopy, title: "Duplicar", variant: "default" }] : []),
    ...(onExport ? [{ icon: ExportIcon, onClick: onExport, title: "Exportar", variant: "default" }] : []),
    ...(onHistory ? [{ icon: HistoryIcon, onClick: onHistory, title: "Ver historial", variant: "default" }] : [])
  ] : [];

  return (
    <div 
      className="elegant-actions-container"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '3px',
        padding: '4px',
        backgroundColor: 'rgba(31, 41, 55, 0.8)',
        backdropFilter: 'blur(20px)',
        borderRadius: '8px',
        border: '1px solid rgba(75, 85, 99, 0.3)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
        opacity: 1, // TEMPORALMENTE VISIBLE PARA VERIFICAR
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative'
      }}
    >
      {/* Botones principales */}
      {visibleActions.map((action, index) => (
        <ElegantActionButton
          key={index}
          icon={action.icon}
          onClick={action.onClick}
          title={action.title}
          variant={action.variant}
          size={size}
          disabled={disabled[action.variant]}
        />
      ))}

      {/* Menú de más acciones */}
      {shouldShowMoreMenu && (
        <div style={{ position: 'relative' }}>
          <ElegantActionButton
            icon={MoreIcon}
            onClick={() => setMenuOpen(!menuOpen)}
            title="Más acciones"
            variant="default"
            size={size}
          />
          
          <AnimatePresence>
            {menuOpen && (
              <motion.div
                style={{
                  position: 'absolute',
                  top: '100%',
                  right: 0,
                  marginTop: '4px',
                  backgroundColor: 'rgba(31, 41, 55, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(75, 85, 99, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                  padding: '8px',
                  minWidth: '160px',
                  zIndex: 1000
                }}
                initial={{ opacity: 0, scale: 0.9, y: -10 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: -10 }}
                transition={{ type: "spring", stiffness: 400, damping: 25 }}
              >
                {menuActions.map((action, index) => (
                  <motion.button
                    key={index}
                    onClick={() => {
                      action.onClick();
                      setMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      borderRadius: '8px',
                      border: 'none',
                      backgroundColor: 'transparent',
                      color: action.variant === 'delete' ? '#f87171' : '#d1d5db',
                      fontSize: '14px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      transition: 'background-color 0.2s ease'
                    }}
                    whileHover={{ backgroundColor: 'rgba(75, 85, 99, 0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <action.icon size="16px" />
                    {action.title}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default ElegantActionButtons;
