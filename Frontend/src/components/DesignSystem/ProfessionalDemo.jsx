// 🏢 DEMOSTRACIÓN PROFESIONAL - DISEÑO SOFISTICADO
// ================================================

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { UnifiedCard, UnifiedButton } from './BaseComponents';
import { designTheme, styleUtils } from './theme';

const ProfessionalDemo = () => {
  const [activeCard, setActiveCard] = useState(null);

  const professionalCards = [
    { 
      variant: 'glass', 
      effect: 'lift', 
      title: 'Gestión Financiera', 
      description: 'Sistema completo de control financiero',
      icon: '💰',
      color: '#3b82f6',
      category: 'Finance'
    },
    { 
      variant: 'glass', 
      effect: '3d', 
      title: 'Análisis de Datos', 
      description: 'Dashboard con métricas avanzadas',
      icon: '📊',
      color: '#10b981',
      category: 'Analytics'
    },
    { 
      variant: 'glass', 
      effect: 'glow', 
      title: 'Gestión de Proyectos', 
      description: 'Control y seguimiento de proyectos',
      icon: '📋',
      color: '#8b5cf6',
      category: 'Project'
    },
    { 
      variant: 'glass', 
      effect: 'lift', 
      title: 'Reportes Ejecutivos', 
      description: 'Informes detallados y profesionales',
      icon: '📈',
      color: '#f59e0b',
      category: 'Reports'
    },
    { 
      variant: 'glass', 
      effect: '3d', 
      title: 'Gestión de Usuarios', 
      description: 'Administración de permisos y roles',
      icon: '👥',
      color: '#ef4444',
      category: 'Users'
    },
    { 
      variant: 'glass', 
      effect: 'glow', 
      title: 'Configuración', 
      description: 'Panel de configuración avanzado',
      icon: '⚙️',
      color: '#64748b',
      category: 'Settings'
    }
  ];

  const metrics = [
    { title: 'Ingresos Mensuales', value: '$125,847', trend: '+12.5%', color: 'success', icon: '📈' },
    { title: 'Proyectos Activos', value: '47', trend: '+8%', color: 'primary', icon: '📋' },
    { title: 'Usuarios Activos', value: '2,847', trend: '+15%', color: 'warning', icon: '👥' },
    { title: 'Eficiencia', value: '94.2%', trend: '+3.2%', color: 'success', icon: '⚡' }
  ];

  return (
    <div style={{ 
      padding: designTheme.spacing.xl,
      background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
      minHeight: '100vh',
      position: 'relative'
    }}>
      {/* Header profesional */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          textAlign: 'center',
          marginBottom: designTheme.spacing.xxxl,
          padding: designTheme.spacing.xxl,
          background: designTheme.gradients.professional,
          borderRadius: designTheme.borderRadius.xl,
          color: '#ffffff',
          boxShadow: designTheme.shadows.lg
        }}
      >
        <motion.h1
          style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            marginBottom: designTheme.spacing.md,
            letterSpacing: '-0.025em'
          }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
        >
          Sistema de Gestión Financiera
        </motion.h1>
        
        <motion.p
          style={{
            fontSize: '1.125rem',
            opacity: 0.9,
            maxWidth: '600px',
            margin: '0 auto',
            fontWeight: 400
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.9 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          Plataforma profesional para la gestión integral de finanzas empresariales
        </motion.p>
      </motion.div>

      {/* Métricas profesionales */}
      <motion.div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: designTheme.spacing.lg,
          marginBottom: designTheme.spacing.xxxl
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.6 }}
      >
        {metrics.map((metric, index) => (
          <motion.div
            key={metric.title}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + index * 0.1, duration: 0.5 }}
          >
            <UnifiedCard
              variant="glass"
              effect="lift"
              style={{
                padding: designTheme.spacing.lg,
                textAlign: 'center',
                background: 'rgba(255, 255, 255, 0.8)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(16px)',
                boxShadow: designTheme.shadows.md
              }}
            >
              <div style={{ fontSize: '2rem', marginBottom: designTheme.spacing.sm }}>
                {metric.icon}
              </div>
              <h3 style={{
                fontSize: '1.5rem',
                fontWeight: 700,
                color: designTheme.colors.semantic.neutral[800],
                marginBottom: designTheme.spacing.xs
              }}>
                {metric.value}
              </h3>
              <p style={{
                fontSize: '0.875rem',
                color: designTheme.colors.semantic.neutral[600],
                marginBottom: designTheme.spacing.xs,
                fontWeight: 500
              }}>
                {metric.title}
              </p>
              <span style={{
                fontSize: '0.875rem',
                color: designTheme.colors.semantic.success[600],
                fontWeight: 600,
                background: designTheme.colors.semantic.success[50],
                padding: `${designTheme.spacing.xs} ${designTheme.spacing.sm}`,
                borderRadius: designTheme.borderRadius.full
              }}>
                {metric.trend}
              </span>
            </UnifiedCard>
          </motion.div>
        ))}
      </motion.div>

      {/* Grid de módulos profesionales */}
      <motion.div
        style={{ marginBottom: designTheme.spacing.xxxl }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <motion.h2
          style={{
            fontSize: '1.875rem',
            fontWeight: 700,
            color: designTheme.colors.semantic.neutral[800],
            textAlign: 'center',
            marginBottom: designTheme.spacing.xl
          }}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.5 }}
        >
          Módulos del Sistema
        </motion.h2>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: designTheme.spacing.lg
        }}>
          {professionalCards.map((card, index) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                delay: 1.6 + index * 0.1, 
                duration: 0.5
              }}
              whileHover={{ 
                scale: 1.02,
                y: -5
              }}
              onHoverStart={() => setActiveCard(index)}
              onHoverEnd={() => setActiveCard(null)}
            >
              <UnifiedCard
                variant="glass"
                effect={card.effect}
                hover={true}
                style={{ 
                  height: '200px', 
                  padding: designTheme.spacing.lg,
                  background: 'rgba(255, 255, 255, 0.9)',
                  border: `1px solid ${card.color}20`,
                  boxShadow: activeCard === index ? designTheme.shadows.lg : designTheme.shadows.md
                }}
              >
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%'
                }}>
                  <div>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: designTheme.spacing.sm
                    }}>
                      <span style={{
                        fontSize: '2rem',
                        opacity: 0.8
                      }}>
                        {card.icon}
                      </span>
                      <span style={{
                        fontSize: '0.75rem',
                        color: card.color,
                        background: `${card.color}15`,
                        padding: `${designTheme.spacing.xs} ${designTheme.spacing.sm}`,
                        borderRadius: designTheme.borderRadius.full,
                        fontWeight: 600
                      }}>
                        {card.category}
                      </span>
                    </div>
                    
                    <h3 style={{
                      fontSize: '1.25rem',
                      fontWeight: 700,
                      color: designTheme.colors.semantic.neutral[800],
                      marginBottom: designTheme.spacing.xs
                    }}>
                      {card.title}
                    </h3>
                    
                    <p style={{
                      fontSize: '0.875rem',
                      color: designTheme.colors.semantic.neutral[600],
                      lineHeight: 1.5
                    }}>
                      {card.description}
                    </p>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    justifyContent: 'flex-end'
                  }}>
                    <div style={{
                      width: '32px',
                      height: '4px',
                      background: card.color,
                      borderRadius: designTheme.borderRadius.full,
                      opacity: activeCard === index ? 1 : 0.6,
                      transition: 'opacity 0.3s ease'
                    }} />
                  </div>
                </div>
              </UnifiedCard>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Botones de acción profesionales */}
      <motion.div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: designTheme.spacing.md,
          justifyContent: 'center',
          marginTop: designTheme.spacing.xxxl
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2, duration: 0.6 }}
      >
        {[
          { variant: 'primary', label: 'Iniciar Sesión', color: '#3b82f6' },
          { variant: 'secondary', label: 'Ver Demo', color: '#64748b' },
          { variant: 'success', label: 'Crear Cuenta', color: '#10b981' },
          { variant: 'warning', label: 'Contactar', color: '#f59e0b' }
        ].map((button, index) => (
          <motion.div
            key={button.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ 
              delay: 2.4 + index * 0.1, 
              duration: 0.4
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <UnifiedButton
              variant={button.variant}
              effect="lift"
              size="large"
              style={{ 
                minWidth: '140px',
                fontWeight: 600
              }}
            >
              {button.label}
            </UnifiedButton>
          </motion.div>
        ))}
      </motion.div>

      {/* Footer profesional */}
      <motion.div
        style={{
          textAlign: 'center',
          padding: designTheme.spacing.xxl,
          marginTop: designTheme.spacing.xxxl,
          background: 'rgba(255, 255, 255, 0.8)',
          borderRadius: designTheme.borderRadius.xl,
          border: '1px solid rgba(255, 255, 255, 0.2)',
          backdropFilter: 'blur(16px)',
          boxShadow: designTheme.shadows.lg
        }}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.8, duration: 0.6 }}
      >
        <h3 style={{
          fontSize: '1.5rem',
          color: designTheme.colors.semantic.neutral[800],
          marginBottom: designTheme.spacing.md,
          fontWeight: 700
        }}>
          Sistema Profesional de Gestión
        </h3>
        
        <p style={{
          fontSize: '1rem',
          color: designTheme.colors.semantic.neutral[600],
          maxWidth: '600px',
          margin: '0 auto',
          lineHeight: 1.6
        }}>
          Plataforma diseñada para empresas que buscan eficiencia, organización y control total 
          de sus operaciones financieras con una interfaz limpia y profesional.
        </p>
      </motion.div>
    </div>
  );
};

export default ProfessionalDemo;
