import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, FolderPlus, CheckSquare, Play, BarChart3, Rocket } from 'lucide-react';

const ContextualBrutalButton = ({ 
  activeTab,
  onClick, 
  variant = "primary",
  size = "large"
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  // Configuración contextual según el tab activo
  const getContextualConfig = (tab) => {
    switch (tab) {
      case 'Dashboard':
        return null; // No mostrar botón en dashboard
      case 'Proyectos':
        return {
          text: 'Nuevo Proyecto',
          icon: <FolderPlus className="w-6 h-6" />,
          variant: 'primary'
        };
      case 'Tareas':
        return {
          text: 'Nueva Tarea',
          icon: <CheckSquare className="w-6 h-6" />,
          variant: 'success'
        };
      case 'Sprints':
        return {
          text: 'Nuevo Sprint',
          icon: <Play className="w-6 h-6" />,
          variant: 'warning'
        };
      case 'Analytics':
        return {
          text: 'Generar Reporte',
          icon: <BarChart3 className="w-6 h-6" />,
          variant: 'primary'
        };
      default:
        return {
          text: 'Crear',
          icon: <Plus className="w-6 h-6" />,
          variant: 'primary'
        };
    }
  };

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverBackground: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
      shadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      hoverShadow: '0 12px 35px rgba(102, 126, 234, 0.5)'
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      hoverBackground: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      shadow: '0 8px 25px rgba(16, 185, 129, 0.3)',
      hoverShadow: '0 12px 35px rgba(16, 185, 129, 0.5)'
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      hoverBackground: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      shadow: '0 8px 25px rgba(245, 158, 11, 0.3)',
      hoverShadow: '0 12px 35px rgba(245, 158, 11, 0.5)'
    }
  };

  const sizes = {
    small: { padding: '12px 24px', fontSize: '14px' },
    medium: { padding: '16px 32px', fontSize: '16px' },
    large: { padding: '20px 40px', fontSize: '18px' }
  };

  const contextualConfig = getContextualConfig(activeTab);
  
  // No renderizar si no hay configuración (ej: Dashboard)
  if (!contextualConfig) {
    return null;
  }
  
  const config = variants[contextualConfig.variant] || variants.primary;
  const sizeConfig = sizes[size] || sizes.large;

  return (
    <motion.button
      className="contextual-brutal-button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ 
        scale: 1.02,
        y: -2
      }}
      whileTap={{ 
        scale: 0.98,
        y: 0
      }}
      style={{
        position: 'relative',
        background: config.background,
        border: 'none',
        borderRadius: '16px',
        padding: sizeConfig.padding,
        color: 'white',
        fontSize: sizeConfig.fontSize,
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: isHovered ? config.hoverShadow : config.shadow,
        transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        minWidth: '180px',
        justifyContent: 'center',
        textTransform: 'none',
        letterSpacing: '0.5px'
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: config.hoverBackground,
          opacity: 0
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.2 }}
      />

      {/* Icon with subtle animation */}
      <motion.div
        animate={{
          rotate: isHovered ? 5 : 0,
          scale: isPressed ? 0.9 : 1
        }}
        transition={{ duration: 0.2 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {contextualConfig.icon}
      </motion.div>

      {/* Text */}
      <motion.span
        style={{
          position: 'relative',
          zIndex: 2
        }}
        animate={{
          x: isPressed ? 1 : 0
        }}
        transition={{ duration: 0.1 }}
      >
        {contextualConfig.text}
      </motion.span>

      {/* Subtle ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.2)',
              scale: 0
            }}
            animate={{
              scale: 1.2,
              opacity: [1, 0]
            }}
            transition={{
              duration: 0.3,
              ease: 'easeOut'
            }}
            initial={{ scale: 0, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default ContextualBrutalButton;
