// 🎯 COMPONENTES BASE UNIFICADOS - DESIGN SYSTEM
// =============================================

import React, { forwardRef } from 'react';
import {
  Box,
  Card,
  CardContent,
  Button,
  TextField,
  Typography,
  Alert,
  Skeleton,
  Paper,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import { motion } from 'framer-motion';
import { designTheme, styleUtils } from './theme';
import './animations.css';

// 🎨 CONTENEDOR PRINCIPAL UNIFICADO
export const UnifiedContainer = ({ children, variant = 'default', className, ...props }) => {
  const baseStyles = {
    padding: designTheme.spacing.lg,
    borderRadius: designTheme.borderRadius.lg,
    transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
    ...(variant === 'glass' && styleUtils.createGlassStyle('primary')),
    ...(variant === 'dark' && styleUtils.createGlassStyle('dark')),
    ...(variant === 'gradient' && {
      background: designTheme.gradients.primary
    })
  };

  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={baseStyles}
      className={className}
      {...props}
    >
      {children}
    </Box>
  );
};

// 🃏 CARD UNIFICADO CON GLASSMORPHISM MEJORADO
export const UnifiedCard = forwardRef(({
  children,
  variant = 'glass',
  hover = true,
  elevation = 'md',
  effect = 'lift', // lift, 3d, glow, crystal
  className,
  onClick,
  ...props
}, ref) => {
  const baseStyles = {
    borderRadius: designTheme.borderRadius.xl,
    border: variant === 'glass' ? '1px solid rgba(255, 255, 255, 0.2)' : 'none',
    overflow: 'hidden',
    position: 'relative',
    transformStyle: 'preserve-3d',
    transition: `all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)`,
    ...(variant === 'glass' && {
      background: 'rgba(255, 255, 255, 0.1)',
      backdropFilter: 'blur(16px) saturate(180%)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
    }),
    ...(variant === 'crystal' && {
      ...styleUtils.createCrystalEffect()
    }),
    ...(variant === 'solid' && {
      background: designTheme.colors.semantic.neutral[50],
      color: designTheme.colors.semantic.neutral[800],
      boxShadow: designTheme.shadows[elevation],
      border: '1px solid rgba(226, 232, 240, 0.8)'
    }),
    ...(variant === 'gradient' && {
      background: designTheme.gradients.primary,
      color: '#ffffff',
      boxShadow: designTheme.shadows.lg,
      position: 'relative'
    }),
    ...(variant === 'holographic' && {
      ...styleUtils.createHolographicEffect(),
      color: designTheme.colors.neutral.white
    }),
    ...(variant === 'neon' && {
      background: designTheme.colors.semantic.neutral[900],
      border: `2px solid transparent`,
      backgroundImage: `linear-gradient(${designTheme.colors.semantic.neutral[900]}, ${designTheme.colors.semantic.neutral[900]}), ${designTheme.gradients.neon}`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      color: designTheme.colors.neutral.white,
      boxShadow: designTheme.shadows.neon
    }),
    ...(variant === 'dark' && {
      background: designTheme.gradients.dark,
      color: designTheme.colors.neutral.white,
      border: `1px solid ${designTheme.colors.semantic.neutral[700]}`,
      boxShadow: designTheme.shadows[elevation],
      position: 'relative',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
      }
    }),
    ...(hover && {
      '&:hover': {
        ...(effect === 'lift' && {
          transform: 'translateY(-12px) scale(1.03)',
          boxShadow: designTheme.shadows.floating
        }),
        ...(effect === '3d' && {
          transform: 'perspective(1000px) rotateX(8deg) rotateY(8deg) translateZ(25px)',
          boxShadow: designTheme.shadows['3d-raised']
        }),
        ...(effect === 'glow' && {
          transform: 'scale(1.05)',
          boxShadow: designTheme.shadows.glow,
          filter: 'brightness(1.2)'
        }),
        ...(effect === 'crystal' && {
          transform: 'translateY(-8px) scale(1.02)',
          backdropFilter: 'blur(30px) saturate(200%)',
          boxShadow: designTheme.shadows.floating
        })
      }
    }),
    ...(onClick && {
      cursor: 'pointer'
    })
  };

  return (
    <Card
      ref={ref}
      component={motion.div}
      whileHover={{ scale: hover ? 1.02 : 1 }}
      whileTap={{ scale: 0.98 }}
      sx={baseStyles}
      className={className}
      onClick={onClick}
      {...props}
    >
      {children}
    </Card>
  );
});

// 🔘 BOTÓN UNIFICADO CON ESTADOS AVANZADOS Y ACCESIBILIDAD
export const UnifiedButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  disabled = false,
  icon,
  effect = 'lift', // lift, 3d, glow, neon
  className,
  ...props
}) => {
  const variants = {
    primary: {
      background: designTheme.gradients.primary,
      color: '#ffffff',
      fontWeight: 600,
      position: 'relative',
      overflow: 'hidden',
      boxShadow: designTheme.shadows.md,
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.lg,
        filter: 'brightness(1.05)'
      },
      '&:focus': {
        boxShadow: designTheme.shadows.focus,
        outline: 'none'
      },
      '&:active': {
        transform: 'translateY(0px)',
        boxShadow: designTheme.shadows.sm
      }
    },
    secondary: {
      ...styleUtils.createPremiumGlass('glassPremium'),
      color: designTheme.colors.semantic.primary[600],
      fontWeight: 600,
      border: '1px solid rgba(59, 130, 246, 0.3)',
      '&:hover': {
        background: 'rgba(59, 130, 246, 0.1)',
        borderColor: designTheme.colors.semantic.primary[600],
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.lg
      },
      '&:focus': {
        boxShadow: designTheme.shadows.focus,
        outline: 'none'
      }
    },
    neon: {
      background: designTheme.colors.semantic.neutral[900],
      border: `2px solid transparent`,
      backgroundImage: `linear-gradient(${designTheme.colors.semantic.neutral[900]}, ${designTheme.colors.semantic.neutral[900]}), ${designTheme.gradients.neon}`,
      backgroundOrigin: 'border-box',
      backgroundClip: 'content-box, border-box',
      color: '#ffffff',
      fontWeight: 700,
      boxShadow: designTheme.shadows.glow,
      textShadow: '0 0 10px currentColor',
      '&:hover': {
        animation: 'neonPulse 1s ease-in-out infinite alternate',
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.glow,
        textShadow: '0 0 20px currentColor, 0 0 30px currentColor'
      },
      '&:focus': {
        boxShadow: designTheme.shadows.glow,
        outline: 'none'
      }
    },
    holographic: {
      background: designTheme.gradients.holographic,
      backgroundSize: '400% 400%',
      color: '#ffffff',
      fontWeight: 700,
      position: 'relative',
      overflow: 'hidden',
      animation: 'holographicShift 3s ease-in-out infinite',
      '&::before': {
        content: '""',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(45deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)',
        animation: 'holographicSweep 2s ease-in-out infinite'
      },
      '&:hover': {
        transform: 'translateY(-4px) scale(1.05)',
        boxShadow: designTheme.shadows.glow,
        animation: 'holographicShift 1s ease-in-out infinite'
      },
      '&:focus': {
        boxShadow: designTheme.shadows.glow,
        outline: 'none'
      }
    },
    success: {
      background: designTheme.gradients.success,
      color: designTheme.colors.semantic.success[900],
      fontWeight: 600,
      '&:hover': {
        boxShadow: designTheme.shadows.glowSuccess,
        transform: 'translateY(-2px)'
      },
      '&:focus': {
        boxShadow: designTheme.shadows.focusSuccess,
        outline: 'none'
      }
    },
    warning: {
      background: designTheme.gradients.warning,
      color: designTheme.colors.semantic.warning[900],
      fontWeight: 600,
      '&:hover': {
        boxShadow: designTheme.shadows.glowWarning,
        transform: 'translateY(-2px)'
      },
      '&:focus': {
        boxShadow: designTheme.shadows.focusWarning,
        outline: 'none'
      }
    },
    danger: {
      background: designTheme.gradients.danger,
      color: designTheme.colors.semantic.danger[900],
      fontWeight: 600,
      '&:hover': {
        boxShadow: designTheme.shadows.glowDanger,
        transform: 'translateY(-2px)'
      },
      '&:focus': {
        boxShadow: designTheme.shadows.focusDanger,
        outline: 'none'
      }
    }
  };

  const sizes = {
    small: {
      padding: `${designTheme.spacing.sm} ${designTheme.spacing.md}`,
      fontSize: designTheme.typography.fontSize.sm,
      borderRadius: designTheme.borderRadius.md
    },
    medium: {
      padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}`,
      fontSize: designTheme.typography.fontSize.base,
      borderRadius: designTheme.borderRadius.lg
    },
    large: {
      padding: `${designTheme.spacing.lg} ${designTheme.spacing.xl}`,
      fontSize: designTheme.typography.fontSize.lg,
      borderRadius: designTheme.borderRadius.xl
    }
  };

  return (
    <Button
      component={motion.button}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      sx={{
        ...variants[variant],
        ...sizes[size],
        transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
        textTransform: 'none',
        fontWeight: 600,
        border: 'none',
        boxShadow: designTheme.shadows.md,
        position: 'relative',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          transition: 'left 0.5s',
        },
        '&:hover::before': {
          left: '100%',
        },
        ...(disabled && {
          opacity: 0.5,
          cursor: 'not-allowed'
        })
      }}
      disabled={disabled || loading}
      className={className}
      startIcon={icon}
      {...props}
    >
      {loading ? (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            style={{
              width: 16,
              height: 16,
              border: '2px solid transparent',
              borderTop: '2px solid currentColor',
              borderRadius: '50%'
            }}
          />
          Cargando...
        </Box>
      ) : children}
    </Button>
  );
};

// 📝 INPUT UNIFICADO CON VALIDACIÓN VISUAL Y ACCESIBILIDAD
export const UnifiedInput = ({
  label,
  error,
  success,
  helperText,
  variant = 'outlined',
  className,
  ...props
}) => {
  const baseStyles = {
    '& .MuiOutlinedInput-root': {
      borderRadius: designTheme.borderRadius.lg,
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(10px)',
      transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
      '& fieldset': {
        border: `2px solid ${designTheme.colors.semantic.neutral[300]}`,
        transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
      },
      '&:hover fieldset': {
        border: `2px solid ${designTheme.colors.semantic.primary[400]}`,
      },
      '&.Mui-focused fieldset': {
        border: `2px solid ${designTheme.colors.semantic.primary[400]}`,
        boxShadow: designTheme.shadows.focus,
      },
      '& input': {
        padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}`,
        fontSize: designTheme.typography.fontSize.base,
        color: designTheme.colors.semantic.neutral[700],
        '&::placeholder': {
          color: designTheme.colors.semantic.neutral[500],
          opacity: 1
        }
      },
      ...(error && {
        '& fieldset': {
          border: `2px solid ${designTheme.colors.semantic.danger[400]}`,
        },
        '&:hover fieldset': {
          border: `2px solid ${designTheme.colors.semantic.danger[500]}`,
        },
        '&.Mui-focused fieldset': {
          border: `2px solid ${designTheme.colors.semantic.danger[400]}`,
          boxShadow: designTheme.shadows.focusDanger,
        }
      }),
      ...(success && {
        '& fieldset': {
          border: `2px solid ${designTheme.colors.semantic.success[400]}`,
        },
        '&:hover fieldset': {
          border: `2px solid ${designTheme.colors.semantic.success[500]}`,
        },
        '&.Mui-focused fieldset': {
          border: `2px solid ${designTheme.colors.semantic.success[400]}`,
          boxShadow: designTheme.shadows.focusSuccess,
        }
      })
    },
    '& .MuiInputLabel-root': {
      color: designTheme.colors.semantic.neutral[600],
      fontWeight: 500,
      fontSize: designTheme.typography.fontSize.sm,
      '&.Mui-focused': {
        color: designTheme.colors.semantic.primary[400],
        fontWeight: 600,
      },
      ...(error && {
        color: designTheme.colors.semantic.danger[400],
        '&.Mui-focused': {
          color: designTheme.colors.semantic.danger[400],
        }
      }),
      ...(success && {
        color: designTheme.colors.semantic.success[400],
        '&.Mui-focused': {
          color: designTheme.colors.semantic.success[400],
        }
      })
    },
    '& .MuiFormHelperText-root': {
      fontSize: designTheme.typography.fontSize.xs,
      fontWeight: 500,
      marginTop: designTheme.spacing.xs,
      ...(error && {
        color: designTheme.colors.semantic.danger[400]
      }),
      ...(success && {
        color: designTheme.colors.semantic.success[400]
      })
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <TextField
        label={label}
        variant={variant}
        error={!!error}
        helperText={error || helperText}
        sx={baseStyles}
        className={className}
        fullWidth
        {...props}
      />
    </Box>
  );
};

// 📊 MÉTRICA UNIFICADA CON ANIMACIONES MEJORADAS
export const UnifiedMetric = ({
  title,
  value,
  change,
  trend = 'neutral',
  icon,
  variant = 'glass',
  className
}) => {
  const trendColors = {
    up: designTheme.colors.semantic.success[400],
    down: designTheme.colors.semantic.danger[400],
    neutral: designTheme.colors.semantic.neutral[500]
  };

  const trendIcons = {
    up: '↗️',
    down: '↘️',
    neutral: '→'
  };

  return (
    <UnifiedCard 
      variant={variant} 
      className={className}
      hover={true}
    >
      <CardContent sx={{ 
        p: designTheme.spacing.lg,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Efecto de brillo sutil */}
        <Box sx={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '60px',
          height: '60px',
          background: 'linear-gradient(135deg, rgba(2, 132, 199, 0.1) 0%, transparent 100%)',
          borderRadius: '50%',
          pointerEvents: 'none'
        }} />
        
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 2,
          position: 'relative',
          zIndex: 1
        }}>
          <Typography 
            variant="body2" 
            sx={{ 
              color: designTheme.colors.semantic.neutral[600],
              fontWeight: 500,
              fontSize: designTheme.typography.fontSize.xs,
              textTransform: 'uppercase',
              letterSpacing: '0.05em'
            }}
          >
            {title}
          </Typography>
          {icon && (
            <Box sx={{
              color: designTheme.colors.semantic.primary[400],
              display: 'flex',
              alignItems: 'center',
              padding: designTheme.spacing.xs,
              borderRadius: designTheme.borderRadius.md,
              background: 'rgba(2, 132, 199, 0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              {icon}
            </Box>
          )}
        </Box>

        <Typography
          variant="h2"
          sx={{
            ...designTheme.typography.h2,
            background: `linear-gradient(135deg, ${designTheme.colors.semantic.primary[400]} 0%, ${designTheme.colors.semantic.primary[600]} 100%)`,
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            mb: 1,
            position: 'relative',
            zIndex: 1
          }}
        >
          {value}
        </Typography>

        {change && (
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1,
            position: 'relative',
            zIndex: 1
          }}>
            <Typography
              variant="body2"
              sx={{
                color: trendColors[trend],
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                gap: 0.5
              }}
            >
              {trendIcons[trend]} {change}
            </Typography>
            <Typography 
              variant="caption" 
              sx={{ 
                color: designTheme.colors.semantic.neutral[500],
                fontSize: designTheme.typography.caption.fontSize
              }}
            >
              vs. período anterior
            </Typography>
          </Box>
        )}
      </CardContent>
    </UnifiedCard>
  );
};

// 🚨 ALERTA UNIFICADA CON ANIMACIONES
export const UnifiedAlert = ({
  severity = 'info',
  title,
  children,
  onClose,
  className
}) => {
  const severityStyles = {
    info: {
      backgroundColor: alpha(designTheme.colors.semantic.primary[400], 0.1),
      border: `1px solid ${designTheme.colors.semantic.primary[400]}`,
      color: designTheme.colors.semantic.primary[700]
    },
    success: {
      backgroundColor: alpha(designTheme.colors.semantic.success[400], 0.1),
      border: `1px solid ${designTheme.colors.semantic.success[400]}`,
      color: designTheme.colors.semantic.success[700]
    },
    warning: {
      backgroundColor: alpha(designTheme.colors.semantic.warning[400], 0.1),
      border: `1px solid ${designTheme.colors.semantic.warning[400]}`,
      color: designTheme.colors.semantic.warning[700]
    },
    error: {
      backgroundColor: alpha(designTheme.colors.semantic.danger[400], 0.1),
      border: `1px solid ${designTheme.colors.semantic.danger[400]}`,
      color: designTheme.colors.semantic.danger[700]
    }
  };

  return (
    <Fade in={true}>
      <Alert
        severity={severity}
        onClose={onClose}
        sx={{
          ...severityStyles[severity],
          borderRadius: designTheme.borderRadius.lg,
          ...styleUtils.createGlassStyle('secondary', 0.9),
          backdropFilter: 'blur(10px)',
          '& .MuiAlert-message': {
            padding: 0
          }
        }}
        className={className}
      >
        {title && (
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
            {title}
          </Typography>
        )}
        {children}
      </Alert>
    </Fade>
  );
};

// 💀 SKELETON UNIFICADO CON ANIMACIONES
export const UnifiedSkeleton = ({
  variant = 'rectangular',
  width = '100%',
  height = 60,
  animation = 'wave',
  className
}) => {
  return (
    <Skeleton
      variant={variant}
      width={width}
      height={height}
      animation={animation}
      sx={{
        borderRadius: designTheme.borderRadius.lg,
        transform: 'scale(1)',
        '&::after': {
          background: `linear-gradient(90deg, transparent, ${alpha(designTheme.colors.semantic.primary[400], 0.2)}, transparent)`
        }
      }}
      className={className}
    />
  );
};

// 🎯 BADGE DE ESTADO MEJORADO
export const UnifiedBadge = ({
  children,
  variant = 'primary',
  size = 'medium',
  className
}) => {
  const variants = {
    primary: {
      background: designTheme.gradients.primary,
      color: designTheme.colors.semantic.primary[900],
      fontWeight: 600
    },
    success: {
      background: designTheme.gradients.success,
      color: designTheme.colors.semantic.success[900],
      fontWeight: 600
    },
    warning: {
      background: designTheme.gradients.warning,
      color: designTheme.colors.semantic.warning[900],
      fontWeight: 600
    },
    danger: {
      background: designTheme.gradients.danger,
      color: designTheme.colors.semantic.danger[900],
      fontWeight: 600
    },
    neutral: {
      background: 'rgba(100, 116, 139, 0.1)',
      color: designTheme.colors.semantic.neutral[700],
      border: `1px solid ${designTheme.colors.semantic.neutral[300]}`,
      fontWeight: 500
    }
  };

  const sizes = {
    small: {
      padding: `${designTheme.spacing.xs} ${designTheme.spacing.sm}`,
      fontSize: designTheme.typography.fontSize.xs,
      borderRadius: designTheme.borderRadius.sm
    },
    medium: {
      padding: `${designTheme.spacing.sm} ${designTheme.spacing.md}`,
      fontSize: designTheme.typography.fontSize.sm,
      borderRadius: designTheme.borderRadius.md
    },
    large: {
      padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}`,
      fontSize: designTheme.typography.body1.fontSize,
      borderRadius: designTheme.borderRadius.lg
    }
  };

  return (
    <Box
      component={motion.span}
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      sx={{
        ...variants[variant],
        ...sizes[size],
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: designTheme.shadows.sm,
        transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
        '&:hover': {
          transform: 'scale(1.05)',
          boxShadow: designTheme.shadows.md
        }
      }}
      className={className}
    >
      {children}
    </Box>
  );
};

// 📋 TABLA UNIFICADA MEJORADA
export const UnifiedTable = ({
  data = [],
  columns = [],
  loading = false,
  emptyMessage = "No hay datos disponibles",
  className
}) => {
  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <UnifiedSkeleton variant="rectangular" height={200} />
        <Typography sx={{ mt: 2, color: designTheme.colors.semantic.neutral[600] }}>
          Cargando datos...
        </Typography>
      </Box>
    );
  }

  if (data.length === 0) {
    return (
      <UnifiedCard variant="solid" className={className}>
        <CardContent sx={{ p: 4, textAlign: 'center' }}>
          <Box sx={{ 
            color: designTheme.colors.semantic.neutral[400], 
            mb: 2,
            fontSize: '2rem'
          }}>
            📊
          </Box>
          <Typography 
            variant="h6" 
            sx={{ 
              color: designTheme.colors.semantic.neutral[600], 
              mb: 1,
              fontWeight: 600
            }}
          >
            {emptyMessage}
          </Typography>
          <Typography 
            variant="body2" 
            sx={{ 
              color: designTheme.colors.semantic.neutral[500]
            }}
          >
            Los datos aparecerán aquí cuando estén disponibles
          </Typography>
        </CardContent>
      </UnifiedCard>
    );
  }

  return (
    <UnifiedCard variant="glass" className={className}>
      <Box sx={{ overflow: 'hidden' }}>
        <Box
          component="table"
          sx={{
            width: '100%',
            borderCollapse: 'collapse',
            '& thead': {
              background: designTheme.gradients.primary,
              '& th': {
                color: designTheme.colors.semantic.primary[900],
                fontWeight: 700,
                fontSize: designTheme.typography.fontSize.sm,
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
                padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}`,
                borderBottom: 'none',
                textAlign: 'left'
              }
            },
            '& tbody': {
              '& tr': {
                transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
                '&:hover': {
                  background: 'rgba(2, 132, 199, 0.05)',
                  transform: 'scale(1.01)'
                },
                '&:nth-of-type(even)': {
                  background: 'rgba(0,0,0,0.02)'
                }
              },
              '& td': {
                padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}`,
                borderBottom: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
                fontSize: designTheme.typography.fontSize.sm,
                color: designTheme.colors.semantic.neutral[700]
              }
            }
          }}
        >
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} align={column.align || 'left'}>
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <motion.tr
                key={row.id || index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                {columns.map((column) => (
                  <td key={column.id} align={column.align || 'left'}>
                    {column.render ? column.render(row) : row[column.id]}
                  </td>
                ))}
              </motion.tr>
            ))}
          </tbody>
        </Box>
      </Box>
    </UnifiedCard>
  );
};

export default {
  UnifiedContainer,
  UnifiedCard,
  UnifiedButton,
  UnifiedInput,
  UnifiedMetric,
  UnifiedAlert,
  UnifiedSkeleton,
  UnifiedBadge,
  UnifiedTable
};