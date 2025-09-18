// 🚨 DEMOSTRACIÓN ULTRA CONTRASTANTE - EFECTOS DRAMÁTICOS
// ========================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedCard, UnifiedButton } from './BaseComponents';
import { designTheme, styleUtils } from './theme';

const UltraContrastDemo = () => {
  const [activeCard, setActiveCard] = useState(null);

  const ultraContrastCards = [
    { 
      variant: 'glass', 
      effect: 'lift', 
      title: 'CYAN NEÓN', 
      description: 'Cristal con borde cyan eléctrico',
      icon: '⚡',
      color: '#00ffff'
    },
    { 
      variant: 'glass', 
      effect: 'glow', 
      title: 'MAGENTA ELECTRICO', 
      description: 'Brillo magenta vibrante',
      icon: '💜',
      color: '#ff00ff'
    },
    { 
      variant: 'glass', 
      effect: '3d', 
      title: 'VERDE MATRIX', 
      description: 'Efecto Matrix verde',
      icon: '🟢',
      color: '#00ff00'
    },
    { 
      variant: 'glass', 
      effect: 'lift', 
      title: 'AMARILLO NEÓN', 
      description: 'Amarillo brillante extremo',
      icon: '💛',
      color: '#ffff00'
    },
    { 
      variant: 'glass', 
      effect: 'glow', 
      title: 'NARANJA CALIENTE', 
      description: 'Naranja eléctrico vibrante',
      icon: '🧡',
      color: '#ff4500'
    },
    { 
      variant: 'glass', 
      effect: '3d', 
      title: 'ROJO INTENSO', 
      description: 'Rojo eléctrico puro',
      icon: '🔴',
      color: '#ff0000'
    }
  ];

  return (
    <div style={{ 
      padding: designTheme.spacing.xl,
      background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Fondo animado con partículas */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: `
          radial-gradient(circle at 20% 50%, rgba(0, 255, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(255, 0, 255, 0.1) 0%, transparent 50%),
          radial-gradient(circle at 40% 80%, rgba(0, 255, 0, 0.1) 0%, transparent 50%)
        `,
        animation: 'gradientShift 8s ease infinite',
        pointerEvents: 'none'
      }} />

      {/* Header ultra contrastante */}
      <motion.div
        initial={{ opacity: 0, y: -100, scale: 0.8 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{
          textAlign: 'center',
          marginBottom: designTheme.spacing.xxxl,
          padding: designTheme.spacing.xxl,
          background: 'linear-gradient(135deg, #000000 0%, #00ffff 25%, #ff00ff 50%, #ffff00 75%, #000000 100%)',
          backgroundSize: '400% 400%',
          animation: 'gradientShift 3s ease infinite',
          borderRadius: designTheme.borderRadius.xl,
          position: 'relative',
          overflow: 'hidden',
          border: '3px solid #ffffff'
        }}
      >
        {/* Efecto de brillo superior */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,1), transparent)',
          animation: 'shimmer 2s ease-in-out infinite'
        }} />

        <motion.h1
          style={{
            fontSize: '4rem',
            fontWeight: 900,
            color: '#ffffff',
            textShadow: '0 0 20px #ffffff, 0 0 40px #00ffff, 0 0 60px #ff00ff',
            marginBottom: designTheme.spacing.md,
            letterSpacing: '0.1em',
            textTransform: 'uppercase'
          }}
          animate={{ 
            textShadow: [
              '0 0 20px #ffffff, 0 0 40px #00ffff, 0 0 60px #ff00ff',
              '0 0 30px #ffffff, 0 0 60px #ff00ff, 0 0 90px #ffff00',
              '0 0 20px #ffffff, 0 0 40px #00ffff, 0 0 60px #ff00ff'
            ]
          }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          🚨 ULTRA CONTRASTE
        </motion.h1>
        
        <motion.p
          style={{
            fontSize: '1.5rem',
            color: '#ffffff',
            textShadow: '0 0 10px #ffffff',
            fontWeight: 600,
            maxWidth: '800px',
            margin: '0 auto'
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          EFECTOS DRAMÁTICOS CON CONTRASTE EXTREMO - NEGRO ABSOLUTO Y COLORES NEÓN VIBRANTES
        </motion.p>
      </motion.div>

      {/* Grid de cards ultra contrastantes */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
        gap: designTheme.spacing.xl,
        marginBottom: designTheme.spacing.xxxl
      }}>
        {ultraContrastCards.map((card, index) => (
          <motion.div
            key={card.title}
            initial={{ opacity: 0, y: 100, rotateY: -30 }}
            animate={{ opacity: 1, y: 0, rotateY: 0 }}
            transition={{ 
              delay: 1 + index * 0.2, 
              duration: 0.8,
              type: "spring",
              stiffness: 100
            }}
            whileHover={{ 
              scale: 1.05,
              rotateY: activeCard === index ? 10 : 0,
              z: 100
            }}
            onHoverStart={() => setActiveCard(index)}
            onHoverEnd={() => setActiveCard(null)}
          >
            <UnifiedCard
              variant="glass"
              effect={card.effect}
              hover={true}
              style={{ 
                height: '250px', 
                padding: designTheme.spacing.xl,
                background: `rgba(0, 0, 0, 0.95)`,
                border: `3px solid ${card.color}`,
                boxShadow: `0 0 30px ${card.color}, inset 0 0 20px ${card.color}`,
                backdropFilter: 'blur(25px) saturate(200%)',
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
                height: '3px',
                background: `linear-gradient(90deg, transparent, ${card.color}, transparent)`,
                opacity: activeCard === index ? 1 : 0.5,
                transition: 'opacity 0.3s ease'
              }} />

              <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100%',
                textAlign: 'center'
              }}>
                <motion.div
                  style={{ 
                    fontSize: '3rem', 
                    marginBottom: designTheme.spacing.md,
                    color: card.color,
                    textShadow: `0 0 20px ${card.color}`
                  }}
                  animate={activeCard === index ? { 
                    scale: [1, 1.3, 1],
                    rotate: [0, 360, 0]
                  } : {}}
                  transition={{ duration: 0.8 }}
                >
                  {card.icon}
                </motion.div>

                <motion.h3
                  style={{
                    fontSize: '1.5rem',
                    fontWeight: 900,
                    color: card.color,
                    marginBottom: designTheme.spacing.sm,
                    textShadow: `0 0 15px ${card.color}`,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em'
                  }}
                  animate={activeCard === index ? { 
                    scale: [1, 1.1, 1],
                    textShadow: [
                      `0 0 15px ${card.color}`,
                      `0 0 25px ${card.color}, 0 0 35px ${card.color}`,
                      `0 0 15px ${card.color}`
                    ]
                  } : {}}
                  transition={{ duration: 0.5 }}
                >
                  {card.title}
                </motion.h3>

                <p style={{
                  fontSize: '1rem',
                  color: '#ffffff',
                  textShadow: '0 0 10px #ffffff',
                  opacity: 0.9,
                  fontWeight: 500
                }}>
                  {card.description}
                </p>

                {/* Efecto de partículas */}
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: `radial-gradient(circle, ${card.color}20 1px, transparent 1px)`,
                  backgroundSize: '20px 20px',
                  animation: 'particleFloat 15s linear infinite',
                  pointerEvents: 'none',
                  opacity: activeCard === index ? 0.6 : 0.3
                }} />
              </div>
            </UnifiedCard>
          </motion.div>
        ))}
      </div>

      {/* Botones ultra contrastantes */}
      <motion.div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: designTheme.spacing.lg,
          justifyContent: 'center',
          marginTop: designTheme.spacing.xxxl
        }}
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 0.8 }}
      >
        {[
          { variant: 'primary', color: '#00ffff', label: 'CYAN NEÓN' },
          { variant: 'secondary', color: '#ff00ff', label: 'MAGENTA' },
          { variant: 'success', color: '#00ff00', label: 'VERDE MATRIX' },
          { variant: 'warning', color: '#ffff00', label: 'AMARILLO' },
          { variant: 'danger', color: '#ff4500', label: 'NARANJA' }
        ].map((button, index) => (
          <motion.div
            key={button.label}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 2.5 + index * 0.1, 
              duration: 0.5,
              type: "spring",
              stiffness: 200
            }}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          >
            <UnifiedButton
              variant="primary"
              effect="glow"
              size="large"
              style={{ 
                minWidth: '180px',
                background: `linear-gradient(135deg, #000000 0%, ${button.color} 50%, #000000 100%)`,
                border: `2px solid ${button.color}`,
                color: button.color,
                textShadow: `0 0 10px ${button.color}`,
                boxShadow: `0 0 20px ${button.color}`,
                fontWeight: 900,
                textTransform: 'uppercase',
                letterSpacing: '0.1em'
              }}
            >
              {button.label}
            </UnifiedButton>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer con efecto de onda */}
      <motion.div
        style={{
          textAlign: 'center',
          padding: designTheme.spacing.xxxl,
          marginTop: designTheme.spacing.xxxl,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 50%, #000000 100%)',
          border: '2px solid #ffffff',
          borderRadius: designTheme.borderRadius.xl,
          position: 'relative',
          overflow: 'hidden'
        }}
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 3, duration: 0.8 }}
      >
        {/* Efecto de onda */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)',
          animation: 'holographicSweep 4s ease-in-out infinite'
        }} />
        
        <motion.h3
          style={{
            fontSize: '2rem',
            color: '#ffffff',
            marginBottom: designTheme.spacing.md,
            textShadow: '0 0 20px #ffffff, 0 0 40px #00ffff',
            fontWeight: 900,
            textTransform: 'uppercase'
          }}
          animate={{ 
            textShadow: [
              '0 0 20px #ffffff, 0 0 40px #00ffff',
              '0 0 30px #ffffff, 0 0 60px #ff00ff',
              '0 0 20px #ffffff, 0 0 40px #00ffff'
            ]
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          ⚡ CONTRASTE EXTREMO ACTIVO ⚡
        </motion.h3>
        
        <motion.p
          style={{
            fontSize: '1.2rem',
            color: '#ffffff',
            maxWidth: '800px',
            margin: '0 auto',
            textShadow: '0 0 10px #ffffff',
            fontWeight: 600
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.5, duration: 0.8 }}
        >
          Sistema visual con contraste extremo - Negro absoluto y colores neón vibrantes para máxima legibilidad y impacto visual.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default UltraContrastDemo;
