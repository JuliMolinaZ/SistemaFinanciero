import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Zap, Rocket } from 'lucide-react';

const BrutalCreateButton = ({ onClick, children = "Crear Proyecto", variant = "primary" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverBackground: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
      shadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
      hoverShadow: '0 15px 35px rgba(102, 126, 234, 0.6)',
      icon: <Rocket className="w-5 h-5" />
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      hoverBackground: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      shadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
      hoverShadow: '0 15px 35px rgba(16, 185, 129, 0.6)',
      icon: <Sparkles className="w-5 h-5" />
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      hoverBackground: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      shadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
      hoverShadow: '0 15px 35px rgba(245, 158, 11, 0.6)',
      icon: <Zap className="w-5 h-5" />
    }
  };

  const config = variants[variant] || variants.primary;

  return (
    <motion.button
      className="brutal-create-button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ 
        scale: 1.05,
        y: -2
      }}
      whileTap={{ 
        scale: 0.95,
        y: 0
      }}
      style={{
        position: 'relative',
        background: config.background,
        border: 'none',
        borderRadius: '16px',
        padding: '16px 32px',
        color: 'white',
        fontSize: '16px',
        fontWeight: '700',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        boxShadow: isHovered ? config.hoverShadow : config.shadow,
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        overflow: 'hidden',
        minWidth: '200px',
        justifyContent: 'center',
        textTransform: 'none',
        letterSpacing: '0.5px'
      }}
    >
      {/* Animated background gradient */}
      <motion.div
        className="absolute inset-0"
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
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
              transform: 'translateX(-100%)'
            }}
            animate={{
              transform: 'translateX(100%)'
            }}
            transition={{
              duration: 0.6,
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
          scale: isPressed ? 0.9 : 1
        }}
        transition={{ duration: 0.3 }}
      >
        {config.icon}
      </motion.div>

      {/* Text */}
      <motion.span
        style={{
          position: 'relative',
          zIndex: 1
        }}
        animate={{
          x: isPressed ? 2 : 0
        }}
        transition={{ duration: 0.1 }}
      >
        {children}
      </motion.span>

      {/* Ripple effect */}
      <AnimatePresence>
        {isPressed && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'rgba(255, 255, 255, 0.3)',
              scale: 0
            }}
            animate={{
              scale: 1,
              opacity: [1, 0]
            }}
            transition={{
              duration: 0.4,
              ease: 'easeOut'
            }}
            initial={{ scale: 0, opacity: 1 }}
            exit={{ scale: 1, opacity: 0 }}
          />
        )}
      </AnimatePresence>

      {/* Glow effect */}
      <motion.div
        className="absolute -inset-1 rounded-2xl opacity-0"
        style={{
          background: config.background,
          filter: 'blur(8px)',
          zIndex: -1
        }}
        animate={{
          opacity: isHovered ? 0.3 : 0
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default BrutalCreateButton;
