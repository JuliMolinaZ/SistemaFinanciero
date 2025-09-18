// 🚀 DEMOSTRACIÓN RÁPIDA DE EFECTOS PREMIUM
// =========================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedCard, UnifiedButton } from './BaseComponents';
import { designTheme, styleUtils } from './theme';

const QuickDemo = ({ title = "Efectos Premium", showTitle = true }) => {
  const [activeEffect, setActiveEffect] = useState(null);

  const effects = [
    { 
      variant: 'glass', 
      effect: 'lift', 
      title: 'Glass Morphism', 
      description: 'Cristal premium con profundidad',
      icon: '💎'
    },
    { 
      variant: 'gradient', 
      effect: 'glow', 
      title: 'Gradient Animado', 
      description: 'Gradiente cinematográfico',
      icon: '🌈'
    },
    { 
      variant: 'holographic', 
      effect: 'lift', 
      title: 'Holográfico', 
      description: 'Efecto futurista',
      icon: '✨'
    },
    { 
      variant: 'neon', 
      effect: 'glow', 
      title: 'Neon Style', 
      description: 'Brillo neón vibrante',
      icon: '⚡'
    }
  ];

  return (
    <div style={{ padding: designTheme.spacing.lg }}>
      {showTitle && (
        <motion.h2
          style={{
            ...designTheme.typography.h2,
            textAlign: 'center',
            marginBottom: designTheme.spacing.xl,
            ...styleUtils.createTextGradient(['#667eea', '#f093fb'])
          }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {title}
        </motion.h2>
      )}

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: designTheme.spacing.lg,
        marginBottom: designTheme.spacing.xl
      }}>
        {effects.map((effect, index) => (
          <motion.div
            key={effect.variant}
            initial={{ opacity: 0, y: 30, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              rotateY: 5
            }}
            onHoverStart={() => setActiveEffect(index)}
            onHoverEnd={() => setActiveEffect(null)}
          >
            <UnifiedCard
              variant={effect.variant}
              effect={effect.effect}
              hover={true}
              style={{ 
                height: '180px', 
                padding: designTheme.spacing.lg,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              {/* Efecto de brillo superior */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '2px',
                background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)',
                opacity: activeEffect === index ? 1 : 0.3,
                transition: 'opacity 0.3s ease'
              }} />

              <motion.div
                style={{ fontSize: '2.5rem', marginBottom: designTheme.spacing.sm }}
                animate={activeEffect === index ? { 
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0]
                } : {}}
                transition={{ duration: 0.5 }}
              >
                {effect.icon}
              </motion.div>

              <motion.h3
                style={{
                  ...designTheme.typography.h4,
                  marginBottom: designTheme.spacing.xs,
                  color: effect.variant === 'neon' ? 'white' : 'inherit',
                  fontWeight: 700
                }}
                animate={activeEffect === index ? { 
                  scale: [1, 1.1, 1]
                } : {}}
                transition={{ duration: 0.3 }}
              >
                {effect.title}
              </motion.h3>

              <p style={{
                ...designTheme.typography.body2,
                color: effect.variant === 'neon' ? 'rgba(255,255,255,0.8)' : 'inherit',
                opacity: 0.8,
                fontSize: '0.9rem'
              }}>
                {effect.description}
              </p>

              {/* Efecto de partículas para gradiente */}
              {effect.variant === 'gradient' && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
                  backgroundSize: '15px 15px',
                  animation: 'particleFloat 20s linear infinite',
                  pointerEvents: 'none',
                  opacity: 0.4
                }} />
              )}
            </UnifiedCard>
          </motion.div>
        ))}
      </div>

      {/* Botones de demostración */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: designTheme.spacing.md,
        justifyContent: 'center',
        marginTop: designTheme.spacing.xl
      }}>
        {['primary', 'neon', 'holographic', 'secondary'].map((variant, index) => (
          <motion.div
            key={variant}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 0.4 + index * 0.1, 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <UnifiedButton
              variant={variant}
              effect="lift"
              size="medium"
              style={{ 
                minWidth: '120px',
                textTransform: 'capitalize',
                fontWeight: 600
              }}
            >
              {variant}
            </UnifiedButton>
          </motion.div>
        ))}
      </div>

      {/* Indicador de estado */}
      <motion.div
        style={{
          textAlign: 'center',
          marginTop: designTheme.spacing.lg,
          padding: designTheme.spacing.md,
          background: 'rgba(102, 126, 234, 0.1)',
          borderRadius: designTheme.borderRadius.md,
          border: '1px solid rgba(102, 126, 234, 0.2)'
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.6 }}
      >
        <motion.p
          style={{
            ...designTheme.typography.body2,
            color: designTheme.colors.semantic.primary[600],
            margin: 0,
            fontWeight: 500
          }}
          animate={{ 
            opacity: [0.6, 1, 0.6]
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          ✨ Sistema de diseño premium activo - Efectos 3D, Glassmorphism y Animaciones Cinematográficas
        </motion.p>
      </motion.div>
    </div>
  );
};

export default QuickDemo;
