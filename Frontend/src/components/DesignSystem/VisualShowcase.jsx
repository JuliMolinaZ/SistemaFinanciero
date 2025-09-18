// 🎨 SHOWCASE VISUAL PREMIUM - DEMOSTRACIÓN DE EFECTOS
// ====================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  UnifiedCard, 
  UnifiedButton, 
  UnifiedContainer,
  UnifiedMetric,
  UnifiedBadge
} from './BaseComponents';
import { designTheme, styleUtils } from './theme';

const VisualShowcase = () => {
  const [activeCard, setActiveCard] = useState(null);

  const cardVariants = [
    { variant: 'glass', effect: 'lift', title: 'Glass Morphism', description: 'Efecto cristal premium' },
    { variant: 'crystal', effect: '3d', title: 'Crystal Effect', description: 'Efecto cristal 3D' },
    { variant: 'gradient', effect: 'glow', title: 'Gradient Glow', description: 'Gradiente animado' },
    { variant: 'holographic', effect: 'lift', title: 'Holographic', description: 'Efecto holográfico' },
    { variant: 'neon', effect: 'glow', title: 'Neon Style', description: 'Estilo neón' },
    { variant: 'dark', effect: '3d', title: 'Dark Premium', description: 'Tema oscuro premium' }
  ];

  const buttonVariants = [
    { variant: 'primary', effect: 'lift', label: 'Primary Lift' },
    { variant: 'secondary', effect: 'glow', label: 'Glass Button' },
    { variant: 'neon', effect: 'neon', label: 'Neon Button' },
    { variant: 'holographic', effect: 'glow', label: 'Holographic' },
    { variant: 'success', effect: 'lift', label: 'Success' },
    { variant: 'warning', effect: 'glow', label: 'Warning' },
    { variant: 'danger', effect: 'lift', label: 'Danger' }
  ];

  const metrics = [
    { title: 'Total Projects', value: '127', trend: '+12%', color: 'primary', icon: '📊' },
    { title: 'Active Users', value: '2,847', trend: '+8%', color: 'success', icon: '👥' },
    { title: 'Revenue', value: '$45.2K', trend: '+23%', color: 'warning', icon: '💰' },
    { title: 'Tasks Done', value: '1,423', trend: '+15%', color: 'info', icon: '✅' }
  ];

  return (
    <UnifiedContainer variant="showcase">
      {/* Header con gradiente animado */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          textAlign: 'center',
          marginBottom: designTheme.spacing.xxxl,
          padding: designTheme.spacing.xl,
          background: designTheme.gradients.cosmic,
          backgroundSize: '400% 400%',
          animation: 'gradientShift 8s ease infinite',
          borderRadius: designTheme.borderRadius.xl,
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        {/* Efecto de partículas */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '30px 30px',
          animation: 'particleFloat 25s linear infinite',
          pointerEvents: 'none'
        }} />
        
        <motion.h1
          style={{
            ...designTheme.typography.h1,
            ...styleUtils.createTextGradient(['#ffffff', '#f093fb', '#f5576c']),
            marginBottom: designTheme.spacing.md,
            fontSize: '3.5rem',
            fontWeight: 900,
            textShadow: '0 4px 20px rgba(0,0,0,0.3)'
          }}
          animate={{ 
            scale: [1, 1.02, 1],
            rotateY: [0, 2, 0]
          }}
          transition={{ 
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          🎨 SISTEMA VISUAL PREMIUM
        </motion.h1>
        
        <motion.p
          style={{
            ...designTheme.typography.body1,
            color: 'rgba(255,255,255,0.9)',
            fontSize: '1.25rem',
            maxWidth: '600px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          Experiencia visual de clase mundial con efectos 3D, glassmorphism, neón y animaciones cinematográficas
        </motion.p>
      </motion.div>

      {/* Grid de métricas */}
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: designTheme.spacing.lg,
          marginBottom: designTheme.spacing.xxxl
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.8 }}
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 + index * 0.1, duration: 0.6 }}
            whileHover={{ scale: 1.05, rotateY: 5 }}
          >
            <UnifiedMetric
              title={metric.title}
              value={metric.value}
              trend={metric.trend}
              icon={metric.icon}
              variant="glass"
              effect="lift"
            />
          </motion.div>
        ))}
      </motion.div>

      {/* Showcase de Cards */}
      <motion.div
        style={{ marginBottom: designTheme.spacing.xxxl }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.8 }}
      >
        <motion.h2
          style={{
            ...designTheme.typography.h2,
            textAlign: 'center',
            marginBottom: designTheme.spacing.xl,
            ...styleUtils.createTextGradient(['#667eea', '#764ba2'])
          }}
          whileHover={{ scale: 1.05 }}
        >
          🃏 EFECTOS DE TARJETAS PREMIUM
        </motion.h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: designTheme.spacing.xl
        }}>
          {cardVariants.map((card, index) => (
            <motion.div
              key={card.variant}
              initial={{ opacity: 0, y: 50, rotateY: -15 }}
              animate={{ opacity: 1, y: 0, rotateY: 0 }}
              transition={{ 
                delay: 1 + index * 0.1, 
                duration: 0.8,
                type: "spring",
                stiffness: 100
              }}
              whileHover={{ 
                scale: 1.02,
                rotateY: activeCard === index ? 10 : 0,
                z: 50
              }}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <UnifiedCard
                variant={card.variant}
                effect={card.effect}
                hover={true}
                style={{ height: '200px', padding: designTheme.spacing.lg }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  alignItems: 'center',
                  height: '100%',
                  textAlign: 'center'
                }}>
                  <motion.h3
                    style={{
                      ...designTheme.typography.h3,
                      marginBottom: designTheme.spacing.md,
                      color: card.variant === 'dark' || card.variant === 'neon' ? 'white' : 'inherit'
                    }}
                    animate={activeCard === index ? { 
                      scale: [1, 1.1, 1],
                      rotateZ: [0, 5, -5, 0]
                    } : {}}
                    transition={{ duration: 0.5 }}
                  >
                    {card.title}
                  </motion.h3>
                  <p style={{
                    ...designTheme.typography.body2,
                    color: card.variant === 'dark' || card.variant === 'neon' ? 'rgba(255,255,255,0.8)' : 'inherit',
                    opacity: 0.8
                  }}>
                    {card.description}
                  </p>
                  <UnifiedBadge 
                    variant={card.variant === 'neon' ? 'neon' : 'primary'}
                    size="sm"
                    style={{ marginTop: designTheme.spacing.sm }}
                  >
                    {card.effect.toUpperCase()}
                  </UnifiedBadge>
                </div>
              </UnifiedCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Showcase de Botones */}
      <motion.div
        style={{ marginBottom: designTheme.spacing.xxxl }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
      >
        <motion.h2
          style={{
            ...designTheme.typography.h2,
            textAlign: 'center',
            marginBottom: designTheme.spacing.xl,
            ...styleUtils.createTextGradient(['#f093fb', '#f5576c'])
          }}
          whileHover={{ scale: 1.05 }}
        >
          🔘 BOTONES PREMIUM
        </motion.h2>
        
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: designTheme.spacing.lg,
          justifyContent: 'center',
          padding: designTheme.spacing.xl
        }}>
          {buttonVariants.map((button, index) => (
            <motion.div
              key={button.variant}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ 
                delay: 1.6 + index * 0.1, 
                duration: 0.5,
                type: "spring",
                stiffness: 200
              }}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <UnifiedButton
                variant={button.variant}
                effect={button.effect}
                size="large"
                style={{ minWidth: '150px' }}
              >
                {button.label}
              </UnifiedButton>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Footer con efecto de onda */}
      <motion.div
        style={{
          textAlign: 'center',
          padding: designTheme.spacing.xxxl,
          background: designTheme.gradients.dark,
          borderRadius: designTheme.borderRadius.xl,
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.8, duration: 0.8 }}
      >
        {/* Efecto de onda */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)',
          animation: 'holographicSweep 4s ease-in-out infinite'
        }} />
        
        <motion.h3
          style={{
            ...designTheme.typography.h3,
            color: 'white',
            marginBottom: designTheme.spacing.md,
            ...styleUtils.createTextGradient(['#ffffff', '#00d4ff'])
          }}
          animate={{ 
            textShadow: [
              '0 0 10px rgba(0,212,255,0.5)',
              '0 0 20px rgba(0,212,255,0.8)',
              '0 0 10px rgba(0,212,255,0.5)'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          ✨ EXPERIENCIA VISUAL CINEMATOGRÁFICA
        </motion.h3>
        
        <motion.p
          style={{
            ...designTheme.typography.body1,
            color: 'rgba(255,255,255,0.8)',
            maxWidth: '600px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2, duration: 0.8 }}
        >
          Sistema de diseño premium con efectos 3D, glassmorphism avanzado, animaciones cinematográficas 
          y micro-interacciones que elevan la experiencia de usuario a un nivel excepcional.
        </motion.p>
      </motion.div>
    </UnifiedContainer>
  );
};

export default VisualShowcase;
