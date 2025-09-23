import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Zap, Rocket, X } from 'lucide-react';

const BrutalFAB = ({ 
  onClick, 
  children = "Crear Proyecto", 
  variant = "primary",
  position = "bottom-right",
  size = "large",
  showLabel = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverBackground: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
      shadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
      hoverShadow: '0 12px 35px rgba(102, 126, 234, 0.6)',
      icon: <Rocket className="w-6 h-6" />
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      hoverBackground: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      shadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
      hoverShadow: '0 12px 35px rgba(16, 185, 129, 0.6)',
      icon: <Sparkles className="w-6 h-6" />
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      hoverBackground: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      shadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
      hoverShadow: '0 12px 35px rgba(245, 158, 11, 0.6)',
      icon: <Zap className="w-6 h-6" />
    }
  };

  const sizes = {
    small: { width: '56px', height: '56px', iconSize: 'w-5 h-5' },
    medium: { width: '64px', height: '64px', iconSize: 'w-6 h-6' },
    large: { width: '72px', height: '72px', iconSize: 'w-7 h-7' }
  };

  const positions = {
    'bottom-right': { bottom: '24px', right: '24px' },
    'bottom-left': { bottom: '24px', left: '24px' },
    'top-right': { top: '24px', right: '24px' },
    'top-left': { top: '24px', left: '24px' }
  };

  const config = variants[variant] || variants.primary;
  const sizeConfig = sizes[size] || sizes.large;
  const positionConfig = positions[position] || positions['bottom-right'];

  return (
    <div
      style={{
        position: 'fixed',
        ...positionConfig,
        zIndex: 1000,
        display: 'flex',
        flexDirection: 'column',
        alignItems: position.includes('right') ? 'flex-end' : 'flex-start',
        gap: '12px'
      }}
    >
      {/* Label */}
      <AnimatePresence>
        {showLabel && (isHovered || isExpanded) && (
          <motion.div
            initial={{ opacity: 0, x: position.includes('right') ? 20 : -20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: position.includes('right') ? 20 : -20, scale: 0.8 }}
            transition={{ duration: 0.2 }}
            style={{
              background: 'rgba(0, 0, 0, 0.9)',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '14px',
              fontWeight: '600',
              whiteSpace: 'nowrap',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              boxShadow: '0 4px 20px rgba(0, 0, 0, 0.3)'
            }}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        className="brutal-fab-button"
        onClick={onClick}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onMouseDown={() => setIsPressed(true)}
        onMouseUp={() => setIsPressed(false)}
        whileHover={{ 
          scale: 1.1,
          rotate: 5
        }}
        whileTap={{ 
          scale: 0.9,
          rotate: 0
        }}
        style={{
          position: 'relative',
          width: sizeConfig.width,
          height: sizeConfig.height,
          background: config.background,
          border: 'none',
          borderRadius: '50%',
          color: 'white',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: isHovered ? config.hoverShadow : config.shadow,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          overflow: 'hidden'
        }}
      >
        {/* Animated background gradient */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: config.hoverBackground,
            opacity: 0
          }}
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Shimmer effect */}
        <AnimatePresence>
          {isHovered && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.4), transparent)',
                transform: 'translateX(-100%)'
              }}
              animate={{
                transform: 'translateX(100%)'
              }}
              transition={{
                duration: 0.8,
                ease: 'easeInOut'
              }}
              initial={{ transform: 'translateX(-100%)' }}
              exit={{ transform: 'translateX(100%)' }}
            />
          )}
        </AnimatePresence>

        {/* Icon with animation */}
        <motion.div
          animate={{
            rotate: isHovered ? 180 : 0,
            scale: isPressed ? 0.8 : 1
          }}
          transition={{ duration: 0.3 }}
          style={{ position: 'relative', zIndex: 1 }}
        >
          {config.icon}
        </motion.div>

        {/* Ripple effect */}
        <AnimatePresence>
          {isPressed && (
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{
                background: 'rgba(255, 255, 255, 0.4)',
                scale: 0
              }}
              animate={{
                scale: 1.5,
                opacity: [1, 0]
              }}
              transition={{
                duration: 0.6,
                ease: 'easeOut'
              }}
              initial={{ scale: 0, opacity: 1 }}
              exit={{ scale: 1.5, opacity: 0 }}
            />
          )}
        </AnimatePresence>

        {/* Glow effect */}
        <motion.div
          className="absolute -inset-2 rounded-full opacity-0"
          style={{
            background: config.background,
            filter: 'blur(12px)',
            zIndex: -1
          }}
          animate={{
            opacity: isHovered ? 0.4 : 0
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Pulse effect */}
        <motion.div
          className="absolute inset-0 rounded-full"
          style={{
            background: config.background,
            opacity: 0.3
          }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0, 0.3]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut'
          }}
        />
      </motion.button>
    </div>
  );
};

export default BrutalFAB;
