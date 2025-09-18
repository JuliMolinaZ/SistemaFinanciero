// ✨ MICRO-INTERACCIONES Y ESTADOS DE FEEDBACK
// ============================================

import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  IconButton,
  Tooltip,
  Snackbar,
  Alert,
  Fade,
  Slide,
  Zoom,
  useTheme,
  alpha
} from '@mui/material';
import {
  CheckCircle as CheckIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon,
  Upload as UploadIcon,
  Save as SaveIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as ViewIcon,
  Add as AddIcon
} from '@mui/icons-material';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { designTheme, styleUtils } from './theme';

// 🎯 BOTÓN CON MICRO-INTERACCIONES AVANZADAS
export const InteractiveButton = ({
  children,
  variant = 'primary',
  size = 'medium',
  loading = false,
  success = false,
  error = false,
  disabled = false,
  icon,
  onClick,
  className,
  ...props
}) => {
  const [isPressed, setIsPressed] = useState(false);
  const controls = useAnimation();

  const handleClick = async () => {
    if (disabled || loading) return;
    
    setIsPressed(true);
    await controls.start({
      scale: [1, 0.95, 1],
      transition: { duration: 0.2 }
    });
    setIsPressed(false);
    
    if (onClick) onClick();
  };

  const variants = {
    primary: {
      background: success ? designTheme.gradients.success : 
                 error ? designTheme.gradients.danger : 
                 designTheme.gradients.primary,
      color: designTheme.colors.semantic.primary[900],
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: success ? designTheme.shadows.glowSuccess :
                   error ? designTheme.shadows.glowDanger :
                   designTheme.shadows.glow
      }
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.9)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(2, 132, 199, 0.3)',
      color: designTheme.colors.semantic.primary[400],
      '&:hover': {
        background: 'rgba(2, 132, 199, 0.1)',
        borderColor: designTheme.colors.semantic.primary[400],
        transform: 'translateY(-2px)'
      }
    }
  };

  const sizes = {
    small: { padding: `${designTheme.spacing.sm} ${designTheme.spacing.md}` },
    medium: { padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}` },
    large: { padding: `${designTheme.spacing.lg} ${designTheme.spacing.xl}` }
  };

  const getIcon = () => {
    if (loading) return <RefreshIcon className="animate-spin" />;
    if (success) return <CheckIcon />;
    if (error) return <ErrorIcon />;
    return icon;
  };

  return (
    <motion.button
      animate={controls}
      whileHover={{ scale: disabled ? 1 : 1.05 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      onClick={handleClick}
      disabled={disabled || loading}
      style={{
        ...variants[variant],
        ...sizes[size],
        display: 'flex',
        alignItems: 'center',
        gap: designTheme.spacing.sm,
        borderRadius: designTheme.borderRadius.lg,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        fontWeight: 600,
        fontSize: designTheme.typography.button.fontSize,
        transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.easeOut}`,
        opacity: disabled ? 0.6 : 1,
        position: 'relative',
        overflow: 'hidden',
        ...(loading && {
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: '-100%',
            width: '100%',
            height: '100%',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
            animation: 'shimmer 1.5s infinite'
          }
        })
      }}
      className={className}
      {...props}
    >
      {getIcon()}
      {children}
      
      {/* Efecto de ripple */}
      <motion.div
        initial={{ scale: 0, opacity: 0.5 }}
        animate={isPressed ? { scale: 1, opacity: 0 } : { scale: 0, opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.6)',
          width: '100%',
          height: '100%'
        }}
      />
    </motion.button>
  );
};

// 🔔 NOTIFICACIÓN TOAST MEJORADA
export const UnifiedToast = ({
  open,
  onClose,
  message,
  severity = 'info',
  title,
  duration = 6000,
  position = { vertical: 'top', horizontal: 'right' },
  className
}) => {
  const icons = {
    success: <CheckIcon />,
    error: <ErrorIcon />,
    warning: <WarningIcon />,
    info: <InfoIcon />
  };

  const colors = {
    success: designTheme.colors.semantic.success[400],
    error: designTheme.colors.semantic.danger[400],
    warning: designTheme.colors.semantic.warning[400],
    info: designTheme.colors.semantic.primary[400]
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      TransitionComponent={Slide}
    >
      <motion.div
        initial={{ opacity: 0, y: -50, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -50, scale: 0.9 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <Alert
          severity={severity}
          onClose={onClose}
          sx={{
            borderRadius: designTheme.borderRadius.lg,
            background: `rgba(255, 255, 255, 0.95)`,
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha(colors[severity], 0.3)}`,
            boxShadow: designTheme.shadows.lg,
            '& .MuiAlert-icon': {
              color: colors[severity],
              fontSize: '1.5rem'
            },
            '& .MuiAlert-message': {
              color: designTheme.colors.semantic.neutral[700],
              fontWeight: 500
            },
            '& .MuiAlert-action': {
              paddingLeft: 0
            }
          }}
          className={className}
        >
          {title && (
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
              {title}
            </Typography>
          )}
          {message}
        </Alert>
      </motion.div>
    </Snackbar>
  );
};

// 📊 PROGRESS BAR ANIMADO
export const AnimatedProgress = ({
  value,
  max = 100,
  color = 'primary',
  size = 'medium',
  showPercentage = true,
  animated = true,
  className
}) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (animated) {
      const timer = setTimeout(() => {
        setDisplayValue(value);
      }, 100);
      return () => clearTimeout(timer);
    } else {
      setDisplayValue(value);
    }
  }, [value, animated]);

  const percentage = (displayValue / max) * 100;
  
  const colors = {
    primary: designTheme.gradients.primary,
    success: designTheme.gradients.success,
    warning: designTheme.gradients.warning,
    danger: designTheme.gradients.danger
  };

  const sizes = {
    small: { height: 4 },
    medium: { height: 8 },
    large: { height: 12 }
  };

  return (
    <Box className={className} sx={{ width: '100%' }}>
      <Box
        sx={{
          width: '100%',
          ...sizes[size],
          backgroundColor: designTheme.colors.semantic.neutral[200],
          borderRadius: designTheme.borderRadius.full,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
          style={{
            height: '100%',
            background: colors[color],
            borderRadius: 'inherit',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Efecto de brillo animado */}
          <motion.div
            animate={{
              x: ['-100%', '100%'],
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatDelay: 1
            }}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
              borderRadius: 'inherit'
            }}
          />
        </motion.div>
      </Box>
      
      {showPercentage && (
        <Typography
          variant="caption"
          sx={{
            color: designTheme.colors.semantic.neutral[600],
            fontWeight: 500,
            mt: 0.5,
            display: 'block'
          }}
        >
          {Math.round(percentage)}% completado
        </Typography>
      )}
    </Box>
  );
};

// 🎯 ACCIÓN RÁPIDA CON TOOLTIP MEJORADO
export const QuickAction = ({
  icon,
  label,
  tooltip,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  loading = false,
  className
}) => {
  const [hovered, setHovered] = useState(false);

  const variants = {
    primary: {
      background: 'rgba(2, 132, 199, 0.1)',
      color: designTheme.colors.semantic.primary[400],
      border: '1px solid rgba(2, 132, 199, 0.2)',
      '&:hover': {
        background: 'rgba(2, 132, 199, 0.2)',
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.md
      }
    },
    success: {
      background: 'rgba(5, 150, 105, 0.1)',
      color: designTheme.colors.semantic.success[400],
      border: '1px solid rgba(5, 150, 105, 0.2)',
      '&:hover': {
        background: 'rgba(5, 150, 105, 0.2)',
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.glowSuccess
      }
    },
    danger: {
      background: 'rgba(220, 38, 38, 0.1)',
      color: designTheme.colors.semantic.danger[400],
      border: '1px solid rgba(220, 38, 38, 0.2)',
      '&:hover': {
        background: 'rgba(220, 38, 38, 0.2)',
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.glowDanger
      }
    }
  };

  const sizes = {
    small: { width: 32, height: 32 },
    medium: { width: 40, height: 40 },
    large: { width: 48, height: 48 }
  };

  return (
    <Tooltip
      title={tooltip || label}
      arrow
      placement="top"
      componentsProps={{
        tooltip: {
          sx: {
            background: 'rgba(15, 23, 42, 0.9)',
            backdropFilter: 'blur(10px)',
            borderRadius: designTheme.borderRadius.md,
            fontSize: designTheme.typography.caption.fontSize,
            fontWeight: 500
          }
        }
      }}
    >
      <motion.div
        whileHover={{ scale: disabled ? 1 : 1.1 }}
        whileTap={{ scale: disabled ? 1 : 0.9 }}
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
      >
        <IconButton
          onClick={onClick}
          disabled={disabled || loading}
          sx={{
            ...variants[variant],
            ...sizes[size],
            borderRadius: designTheme.borderRadius.lg,
            transition: `all ${designTheme.animations.duration.normal} ${designTheme.animations.easing.easeOut}`,
            opacity: disabled ? 0.5 : 1,
            cursor: disabled ? 'not-allowed' : 'pointer',
            position: 'relative',
            overflow: 'hidden'
          }}
          className={className}
        >
          {loading ? (
            <RefreshIcon 
              sx={{ 
                animation: 'spin 1s linear infinite',
                '@keyframes spin': {
                  '0%': { transform: 'rotate(0deg)' },
                  '100%': { transform: 'rotate(360deg)' }
                }
              }} 
            />
          ) : (
            icon
          )}
          
          {/* Efecto de ripple en hover */}
          {hovered && !disabled && (
            <motion.div
              initial={{ scale: 0, opacity: 0.3 }}
              animate={{ scale: 1, opacity: 0 }}
              transition={{ duration: 0.6 }}
              style={{
                position: 'absolute',
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.6)',
                width: '100%',
                height: '100%'
              }}
            />
          )}
        </IconButton>
      </motion.div>
    </Tooltip>
  );
};

// 🔄 ESTADO DE CARGA CON SKELETON MEJORADO
export const LoadingState = ({
  variant = 'skeleton',
  message = 'Cargando...',
  size = 'medium',
  className
}) => {
  const sizes = {
    small: { width: 200, height: 20 },
    medium: { width: 300, height: 40 },
    large: { width: 400, height: 60 }
  };

  if (variant === 'spinner') {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: designTheme.spacing.md,
          p: designTheme.spacing.lg
        }}
        className={className}
      >
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          style={{
            width: size === 'small' ? 24 : size === 'large' ? 48 : 32,
            height: size === 'small' ? 24 : size === 'large' ? 48 : 32,
            border: `3px solid ${designTheme.colors.semantic.neutral[200]}`,
            borderTop: `3px solid ${designTheme.colors.semantic.primary[400]}`,
            borderRadius: '50%'
          }}
        />
        <Typography
          variant="body2"
          sx={{
            color: designTheme.colors.semantic.neutral[600],
            fontWeight: 500
          }}
        >
          {message}
        </Typography>
      </Box>
    );
  }

  return (
    <Box className={className}>
      <motion.div
        animate={{
          background: [
            `linear-gradient(90deg, ${designTheme.colors.semantic.neutral[200]} 0%, ${designTheme.colors.semantic.neutral[100]} 50%, ${designTheme.colors.semantic.neutral[200]} 100%)`,
            `linear-gradient(90deg, ${designTheme.colors.semantic.neutral[100]} 0%, ${designTheme.colors.semantic.neutral[200]} 50%, ${designTheme.colors.semantic.neutral[100]} 100%)`
          ]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          ...sizes[size],
          borderRadius: designTheme.borderRadius.md,
          backgroundSize: '200% 100%'
        }}
      />
    </Box>
  );
};

// 🎯 GRUPO DE ACCIONES RÁPIDAS
export const QuickActionGroup = ({
  actions = [],
  direction = 'horizontal',
  spacing = 'medium',
  className
}) => {
  const spacings = {
    small: designTheme.spacing.sm,
    medium: designTheme.spacing.md,
    large: designTheme.spacing.lg
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: direction === 'vertical' ? 'column' : 'row',
        gap: spacings[spacing],
        alignItems: direction === 'vertical' ? 'stretch' : 'center'
      }}
      className={className}
    >
      {actions.map((action, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <QuickAction {...action} />
        </motion.div>
      ))}
    </Box>
  );
};

export default {
  InteractiveButton,
  UnifiedToast,
  AnimatedProgress,
  QuickAction,
  LoadingState,
  QuickActionGroup
};
