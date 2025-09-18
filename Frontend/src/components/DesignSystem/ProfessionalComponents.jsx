// 🏗️ COMPONENTES BASE PROFESIONALES - CONTRASTE Y ACCESIBILIDAD
// ==============================================================

import React, { forwardRef } from 'react';
import { Box, Typography, useTheme } from '@mui/material';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Remove as MinusIcon,
  FolderOpen as FolderOpenIcon,
  Add as PlusIcon
} from '@mui/icons-material';
import { designTheme, styleUtils } from './theme';

// 📊 COMPONENTE STATCARD - MÉTRICAS UNIFORMES
export const StatCard = forwardRef(({
  title,
  value,
  deltaPct,
  deltaTrend = 'neutral',
  helpText,
  icon: Icon,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const getDeltaColor = () => {
    switch (deltaTrend) {
      case 'up': return designTheme.colors.semantic.success[500];
      case 'down': return designTheme.colors.semantic.danger[500];
      default: return designTheme.colors.semantic.neutral[500];
    }
  };

  const getDeltaIcon = () => {
    switch (deltaTrend) {
      case 'up': return <TrendingUpIcon sx={{ fontSize: 16 }} />;
      case 'down': return <TrendingDownIcon sx={{ fontSize: 16 }} />;
      default: return <MinusIcon sx={{ fontSize: 16 }} />;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className={className}
      {...props}
    >
      <Box
        sx={{
          backgroundColor: 'var(--surface-1)',
          border: '1px solid var(--border-subtle)',
          borderRadius: designTheme.borderRadius.xl,
          padding: designTheme.spacing[6],
          boxShadow: designTheme.shadows.sm,
          transition: 'all var(--transition-normal)',
          '&:hover': {
            boxShadow: designTheme.shadows.lg,
            borderColor: 'var(--border)'
          }
        }}
      >
        {/* Header con ícono y título */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            mb: 3
          }}
        >
          <Typography
            variant="caption"
            sx={{
              fontSize: designTheme.typography.fontSize.sm,
              fontWeight: designTheme.typography.fontWeight.medium,
              color: 'var(--text-secondary)',
              textTransform: 'none',
              letterSpacing: '0.025em'
            }}
          >
            {title}
          </Typography>

          {Icon && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 40,
                height: 40,
                borderRadius: designTheme.borderRadius.lg,
                backgroundColor: 'var(--surface-2)',
                color: 'var(--text-tertiary)'
              }}
            >
              <Icon sx={{ fontSize: 20 }} />
            </Box>
          )}
        </Box>

        {/* Valor principal */}
        <Typography
          variant="h2"
          sx={{
            fontSize: designTheme.typography.fontSize['3xl'],
            fontWeight: designTheme.typography.fontWeight.bold,
            lineHeight: designTheme.typography.lineHeight.tight,
            color: 'var(--text-primary)',
            mb: 2
          }}
        >
          {value}
        </Typography>

        {/* Delta y texto de ayuda */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: 1
          }}
        >
          {deltaPct !== undefined && (
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 0.5,
                px: 1.5,
                py: 0.5,
                borderRadius: designTheme.borderRadius.full,
                backgroundColor: `${getDeltaColor()}15`,
                color: getDeltaColor()
              }}
            >
              {getDeltaIcon()}
              <Typography
                variant="caption"
                sx={{
                  fontSize: designTheme.typography.fontSize.sm,
                  fontWeight: designTheme.typography.fontWeight.semibold
                }}
              >
                {Math.abs(deltaPct)}%
              </Typography>
            </Box>
          )}

          {helpText && (
            <Typography
              variant="caption"
              sx={{
                fontSize: designTheme.typography.fontSize.sm,
                color: 'var(--text-tertiary)'
              }}
            >
              {helpText}
            </Typography>
          )}
        </Box>
      </Box>
    </motion.div>
  );
});

StatCard.displayName = 'StatCard';

// 🏷️ COMPONENTE BADGE SEMÁNTICO
export const Badge = forwardRef(({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: `${designTheme.colors.semantic.primary[500]}15`,
        color: designTheme.colors.semantic.primary[700],
        border: `1px solid ${designTheme.colors.semantic.primary[200]}`
      },
      success: {
        backgroundColor: `${designTheme.colors.semantic.success[500]}15`,
        color: designTheme.colors.semantic.success[700],
        border: `1px solid ${designTheme.colors.semantic.success[200]}`
      },
      warning: {
        backgroundColor: `${designTheme.colors.semantic.warning[500]}15`,
        color: designTheme.colors.semantic.warning[700],
        border: `1px solid ${designTheme.colors.semantic.warning[200]}`
      },
      danger: {
        backgroundColor: `${designTheme.colors.semantic.danger[500]}15`,
        color: designTheme.colors.semantic.danger[700],
        border: `1px solid ${designTheme.colors.semantic.danger[200]}`
      },
      neutral: {
        backgroundColor: 'var(--surface-2)',
        color: 'var(--text-secondary)',
        border: '1px solid var(--border-subtle)'
      }
    };
    return variants[variant] || variants.neutral;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${designTheme.spacing[1]} ${designTheme.spacing[2]}`,
        fontSize: designTheme.typography.fontSize.xs,
        minHeight: '20px'
      },
      md: {
        padding: `${designTheme.spacing[1]} ${designTheme.spacing[3]}`,
        fontSize: designTheme.typography.fontSize.sm,
        minHeight: '24px'
      },
      lg: {
        padding: `${designTheme.spacing[2]} ${designTheme.spacing[4]}`,
        fontSize: designTheme.typography.fontSize.base,
        minHeight: '32px'
      }
    };
    return sizes[size] || sizes.md;
  };

  return (
    <Box
      ref={ref}
      component="span"
      className={className}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: designTheme.borderRadius.full,
        fontWeight: designTheme.typography.fontWeight.medium,
        lineHeight: 1,
        transition: 'all var(--transition-fast)',
        userSelect: 'none',
        ...getVariantStyles(),
        ...getSizeStyles()
      }}
      {...props}
    >
      {children}
    </Box>
  );
});

Badge.displayName = 'Badge';

// 📊 COMPONENTE PROGRESS ACCESIBLE
export const Progress = forwardRef(({
  value = 0,
  max = 100,
  showLabel = false,
  label,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const getVariantColor = () => {
    const variants = {
      primary: designTheme.colors.semantic.primary[500],
      success: designTheme.colors.semantic.success[500],
      warning: designTheme.colors.semantic.warning[500],
      danger: designTheme.colors.semantic.danger[500]
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: { height: '4px' },
      md: { height: '8px' },
      lg: { height: '12px' }
    };
    return sizes[size] || sizes.md;
  };

  return (
    <Box ref={ref} className={className} {...props}>
      {(showLabel || label) && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 1
          }}
        >
          {label && (
            <Typography
              variant="caption"
              sx={{
                fontSize: designTheme.typography.fontSize.sm,
                fontWeight: designTheme.typography.fontWeight.medium,
                color: 'var(--text-secondary)'
              }}
            >
              {label}
            </Typography>
          )}
          {showLabel && (
            <Typography
              variant="caption"
              sx={{
                fontSize: designTheme.typography.fontSize.sm,
                fontWeight: designTheme.typography.fontWeight.semibold,
                color: 'var(--text-primary)'
              }}
            >
              {Math.round(percentage)}%
            </Typography>
          )}
        </Box>
      )}

      <Box
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={label || `Progreso: ${Math.round(percentage)}% completado`}
        sx={{
          width: '100%',
          backgroundColor: 'var(--surface-2)',
          borderRadius: designTheme.borderRadius.full,
          overflow: 'hidden',
          ...getSizeStyles()
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          style={{
            height: '100%',
            backgroundColor: getVariantColor(),
            borderRadius: 'inherit'
          }}
        />
      </Box>
    </Box>
  );
});

Progress.displayName = 'Progress';

// ⚡ COMPONENTE QUICKACTION
export const QuickAction = forwardRef(({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const getVariantStyles = () => {
    const variants = {
      primary: {
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        border: 'none',
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--primary-hover)',
          transform: 'translateY(-2px)',
          boxShadow: designTheme.shadows.lg
        }
      },
      secondary: {
        backgroundColor: 'var(--surface-2)',
        color: 'var(--text-primary)',
        border: '1px solid var(--border)',
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--surface-3)',
          borderColor: 'var(--primary)'
        }
      },
      ghost: {
        backgroundColor: 'transparent',
        color: 'var(--text-secondary)',
        border: '1px solid transparent',
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--surface-1)',
          color: 'var(--text-primary)',
          borderColor: 'var(--border-subtle)'
        }
      }
    };
    return variants[variant] || variants.primary;
  };

  const getSizeStyles = () => {
    const sizes = {
      sm: {
        padding: `${designTheme.spacing[2]} ${designTheme.spacing[3]}`,
        fontSize: designTheme.typography.fontSize.sm,
        minHeight: '36px',
        gap: designTheme.spacing[1]
      },
      md: {
        padding: `${designTheme.spacing[3]} ${designTheme.spacing[4]}`,
        fontSize: designTheme.typography.fontSize.base,
        minHeight: '44px',
        gap: designTheme.spacing[2]
      },
      lg: {
        padding: `${designTheme.spacing[4]} ${designTheme.spacing[6]}`,
        fontSize: designTheme.typography.fontSize.lg,
        minHeight: '52px',
        gap: designTheme.spacing[2]
      }
    };
    return sizes[size] || sizes.md;
  };

  return (
    <motion.button
      ref={ref}
      className={className}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: designTheme.typography.fontFamily.sans.join(', '),
        fontWeight: designTheme.typography.fontWeight.medium,
        borderRadius: designTheme.borderRadius.lg,
        cursor: disabled ? 'not-allowed' : 'pointer',
        transition: 'all var(--transition-fast)',
        textDecoration: 'none',
        outline: 'none',
        ...getVariantStyles(),
        ...getSizeStyles(),
        '&:focus-visible': {
          boxShadow: designTheme.shadows.focus
        },
        '&:disabled': {
          opacity: 0.5,
          cursor: 'not-allowed'
        }
      }}
      {...props}
    >
      {Icon && <Icon sx={{ fontSize: 20 }} />}
      {children}
    </motion.button>
  );
});

QuickAction.displayName = 'QuickAction';

// 📭 COMPONENTE EMPTYSTATE CON CTA
export const EmptyState = forwardRef(({
  icon: Icon = FolderOpenIcon,
  title = 'No hay contenido',
  description,
  actionLabel,
  actionIcon: ActionIcon = PlusIcon,
  onAction,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={className}
      {...props}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: designTheme.spacing[12],
          borderRadius: designTheme.borderRadius.xl,
          backgroundColor: 'var(--surface-1)',
          border: '2px dashed var(--border)',
          minHeight: '300px'
        }}
      >
        {/* Ícono */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 80,
              height: 80,
              borderRadius: '50%',
              backgroundColor: 'var(--surface-2)',
              color: 'var(--text-tertiary)',
              mb: 4
            }}
          >
            <Icon sx={{ fontSize: 40 }} />
          </Box>
        </motion.div>

        {/* Título */}
        <Typography
          variant="h4"
          sx={{
            fontSize: designTheme.typography.fontSize.xl,
            fontWeight: designTheme.typography.fontWeight.semibold,
            color: 'var(--text-primary)',
            mb: 2
          }}
        >
          {title}
        </Typography>

        {/* Descripción */}
        {description && (
          <Typography
            variant="body1"
            sx={{
              fontSize: designTheme.typography.fontSize.base,
              color: 'var(--text-secondary)',
              maxWidth: '400px',
              lineHeight: designTheme.typography.lineHeight.relaxed,
              mb: 4
            }}
          >
            {description}
          </Typography>
        )}

        {/* Acción */}
        {actionLabel && onAction && (
          <QuickAction
            variant="primary"
            icon={ActionIcon}
            onClick={onAction}
            size="lg"
          >
            {actionLabel}
          </QuickAction>
        )}
      </Box>
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';

// 💀 COMPONENTE SKELETON
export const Skeleton = forwardRef(({
  variant = 'rectangular',
  width,
  height,
  className = '',
  ...props
}, ref) => {
  const getVariantStyles = () => {
    const variants = {
      text: {
        height: '1em',
        borderRadius: designTheme.borderRadius.sm
      },
      rectangular: {
        borderRadius: designTheme.borderRadius.md
      },
      circular: {
        borderRadius: '50%'
      }
    };
    return variants[variant] || variants.rectangular;
  };

  return (
    <Box
      ref={ref}
      className={className}
      sx={{
        backgroundColor: 'var(--surface-2)',
        background: `linear-gradient(90deg,
          var(--surface-2) 25%,
          var(--surface-3) 50%,
          var(--surface-2) 75%
        )`,
        backgroundSize: '200% 100%',
        animation: 'shimmer 1.5s ease-in-out infinite',
        width: width || '100%',
        height: height || '1rem',
        '@keyframes shimmer': {
          '0%': {
            backgroundPosition: '200% 0'
          },
          '100%': {
            backgroundPosition: '-200% 0'
          }
        },
        ...getVariantStyles()
      }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';