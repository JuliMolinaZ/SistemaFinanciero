import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Sparkles, Zap, Rocket, Star, Heart } from 'lucide-react';

const UltraBrutalButton = ({ 
  onClick, 
  children = "Crear Proyecto", 
  variant = "primary",
  size = "large",
  showParticles = true,
  showGlow = true
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [particles, setParticles] = useState([]);

  const variants = {
    primary: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      hoverBackground: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
      shadow: '0 10px 25px rgba(102, 126, 234, 0.4)',
      hoverShadow: '0 20px 40px rgba(102, 126, 234, 0.6)',
      icon: <Rocket className="w-6 h-6" />
    },
    success: {
      background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
      hoverBackground: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
      shadow: '0 10px 25px rgba(16, 185, 129, 0.4)',
      hoverShadow: '0 20px 40px rgba(16, 185, 129, 0.6)',
      icon: <Sparkles className="w-6 h-6" />
    },
    warning: {
      background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
      hoverBackground: 'linear-gradient(135deg, #d97706 0%, #b45309 100%)',
      shadow: '0 10px 25px rgba(245, 158, 11, 0.4)',
      hoverShadow: '0 20px 40px rgba(245, 158, 11, 0.6)',
      icon: <Zap className="w-6 h-6" />
    },
    love: {
      background: 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)',
      hoverBackground: 'linear-gradient(135deg, #db2777 0%, #9d174d 100%)',
      shadow: '0 10px 25px rgba(236, 72, 153, 0.4)',
      hoverShadow: '0 20px 40px rgba(236, 72, 153, 0.6)',
      icon: <Heart className="w-6 h-6" />
    }
  };

  const sizes = {
    small: { padding: '12px 24px', fontSize: '14px', iconSize: 'w-4 h-4' },
    medium: { padding: '16px 32px', fontSize: '16px', iconSize: 'w-5 h-5' },
    large: { padding: '20px 40px', fontSize: '18px', iconSize: 'w-6 h-6' }
  };

  const config = variants[variant] || variants.primary;
  const sizeConfig = sizes[size] || sizes.large;

  // Generate particles on hover
  useEffect(() => {
    if (isHovered && showParticles) {
      const newParticles = Array.from({ length: 8 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [isHovered, showParticles]);

  return (
    <motion.button
      className="ultra-brutal-button"
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      whileHover={{ 
        scale: 1.05,
        y: -3
      }}
      whileTap={{ 
        scale: 0.95,
        y: 0
      }}
      style={{
        position: 'relative',
        background: config.background,
        border: 'none',
        borderRadius: '20px',
        padding: sizeConfig.padding,
        color: 'white',
        fontSize: sizeConfig.fontSize,
        fontWeight: '800',
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
        letterSpacing: '0.5px',
        zIndex: 1
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
        transition={{ duration: 0.3 }}
      />

      {/* Shimmer effect */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            className="absolute inset-0 rounded-2xl"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
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

      {/* Particles */}
      <AnimatePresence>
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: '4px',
              height: '4px',
              background: 'rgba(255, 255, 255, 0.8)',
              borderRadius: '50%',
              pointerEvents: 'none'
            }}
            initial={{ 
              scale: 0, 
              opacity: 0,
              x: 0,
              y: 0
            }}
            animate={{ 
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
              x: [0, (Math.random() - 0.5) * 100],
              y: [0, (Math.random() - 0.5) * 100]
            }}
            transition={{
              duration: 1,
              delay: particle.delay,
              ease: 'easeOut'
            }}
            exit={{ scale: 0, opacity: 0 }}
          />
        ))}
      </AnimatePresence>

      {/* Icon with animation */}
      <motion.div
        animate={{
          rotate: isHovered ? 360 : 0,
          scale: isPressed ? 0.8 : 1
        }}
        transition={{ duration: 0.5 }}
        style={{ position: 'relative', zIndex: 2 }}
      >
        {config.icon}
      </motion.div>

      {/* Text */}
      <motion.span
        style={{
          position: 'relative',
          zIndex: 2
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
      {showGlow && (
        <motion.div
          className="absolute -inset-2 rounded-2xl opacity-0"
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
      )}

      {/* Pulse effect */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: config.background,
          opacity: 0.2
        }}
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.2, 0, 0.2]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'easeInOut'
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 rounded-2xl"
        style={{
          background: 'linear-gradient(45deg, transparent, rgba(255,255,255,0.3), transparent)',
          opacity: 0
        }}
        animate={{
          opacity: isHovered ? 1 : 0
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default UltraBrutalButton;
