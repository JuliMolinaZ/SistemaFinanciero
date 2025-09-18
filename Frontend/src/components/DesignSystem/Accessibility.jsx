// ♿ COMPONENTES DE ACCESIBILIDAD WCAG AA
// ======================================

import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip,
  useTheme,
  alpha
} from '@mui/material';
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Visibility as VisibleIcon,
  VisibilityOff as HiddenIcon,
  VolumeUp as VolumeOnIcon,
  VolumeOff as VolumeOffIcon,
  Contrast as ContrastIcon,
  TextIncrease as TextIncreaseIcon,
  TextDecrease as TextDecreaseIcon
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { designTheme } from './theme';

// 🎯 HOOK PARA ACCESIBILIDAD
export const useAccessibility = () => {
  const [preferences, setPreferences] = useState({
    highContrast: false,
    largeText: false,
    reducedMotion: false,
    screenReader: false
  });

  useEffect(() => {
    // Detectar preferencias del sistema
    const mediaQueries = {
      highContrast: window.matchMedia('(prefers-contrast: high)'),
      reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)')
    };

    setPreferences(prev => ({
      ...prev,
      highContrast: mediaQueries.highContrast.matches,
      reducedMotion: mediaQueries.reducedMotion.matches
    }));

    // Escuchar cambios en las preferencias
    const handleChange = (mediaQuery) => {
      setPreferences(prev => ({
        ...prev,
        [mediaQuery.media.includes('contrast') ? 'highContrast' : 'reducedMotion']: mediaQuery.matches
      }));
    };

    Object.values(mediaQueries).forEach(mq => {
      mq.addEventListener('change', handleChange);
    });

    return () => {
      Object.values(mediaQueries).forEach(mq => {
        mq.removeEventListener('change', handleChange);
      });
    };
  }, []);

  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  return { preferences, togglePreference };
};

// 🎨 PROVEEDOR DE TEMA ACCESIBLE
export const AccessibleThemeProvider = ({ children }) => {
  const { preferences } = useAccessibility();
  
  const accessibleTheme = {
    ...designTheme,
    colors: preferences.highContrast ? {
      ...designTheme.colors,
      primary: {
        ...designTheme.colors.primary,
        400: '#0066CC',
        500: '#004499',
        600: '#003366'
      },
      neutral: {
        ...designTheme.colors.neutral,
        700: '#000000',
        600: '#333333',
        500: '#666666'
      }
    } : designTheme.colors,
    typography: preferences.largeText ? {
      ...designTheme.typography,
      body1: { ...designTheme.typography.body1, fontSize: '1.125rem' },
      body2: { ...designTheme.typography.body2, fontSize: '1rem' },
      caption: { ...designTheme.typography.caption, fontSize: '0.875rem' }
    } : designTheme.typography,
    animations: preferences.reducedMotion ? {
      ...designTheme.animations,
      duration: {
        fast: '0ms',
        normal: '0ms',
        slow: '0ms',
        slower: '0ms'
      }
    } : designTheme.animations
  };

  return (
    <Box
      sx={{
        '--accessible-theme': accessibleTheme,
        fontSize: preferences.largeText ? '1.125rem' : '1rem',
        lineHeight: preferences.largeText ? '1.8' : '1.6'
      }}
    >
      {children}
    </Box>
  );
};

// 🔘 BOTÓN ACCESIBLE
export const AccessibleButton = ({
  children,
  onClick,
  disabled = false,
  variant = 'primary',
  size = 'medium',
  ariaLabel,
  ariaDescribedBy,
  className,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const buttonRef = useRef(null);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      if (onClick && !disabled) {
        onClick(event);
      }
    }
  };

  const variants = {
    primary: {
      background: designTheme.gradients.primary,
      color: designTheme.colors.semantic.primary[900],
      '&:hover': {
        background: designTheme.gradients.primary,
        transform: 'translateY(-2px)',
        boxShadow: designTheme.shadows.glow
      },
      '&:focus': {
        outline: 'none',
        boxShadow: designTheme.shadows.focus
      }
    },
    secondary: {
      background: 'rgba(255, 255, 255, 0.9)',
      border: '2px solid rgba(2, 132, 199, 0.3)',
      color: designTheme.colors.semantic.primary[400],
      '&:hover': {
        background: 'rgba(2, 132, 199, 0.1)',
        borderColor: designTheme.colors.semantic.primary[400]
      },
      '&:focus': {
        outline: 'none',
        boxShadow: designTheme.shadows.focus,
        borderColor: designTheme.colors.semantic.primary[400]
      }
    }
  };

  const sizes = {
    small: { padding: `${designTheme.spacing.sm} ${designTheme.spacing.md}` },
    medium: { padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}` },
    large: { padding: `${designTheme.spacing.lg} ${designTheme.spacing.xl}` }
  };

  return (
    <Button
      ref={buttonRef}
      onClick={onClick}
      disabled={disabled}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      sx={{
        ...variants[variant],
        ...sizes[size],
        borderRadius: designTheme.borderRadius.lg,
        fontWeight: 600,
        fontSize: designTheme.typography.button.fontSize,
        transition: 'all 0.2s ease',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        minWidth: '44px', // Tamaño mínimo para accesibilidad táctil
        minHeight: '44px',
        ...(focused && {
          outline: `3px solid ${designTheme.colors.semantic.primary[400]}`,
          outlineOffset: '2px'
        })
      }}
      className={className}
      {...props}
    >
      {children}
    </Button>
  );
};

// 📝 CAMPO DE ENTRADA ACCESIBLE
export const AccessibleInput = ({
  label,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  placeholder,
  type = 'text',
  className,
  ...props
}) => {
  const [focused, setFocused] = useState(false);
  const inputRef = useRef(null);
  const id = `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <Box className={className}>
      <label
        htmlFor={id}
        style={{
          display: 'block',
          marginBottom: designTheme.spacing.sm,
          fontWeight: 600,
          color: designTheme.colors.semantic.neutral[700],
          fontSize: designTheme.typography.body2.fontSize
        }}
      >
        {label}
        {required && (
          <span style={{ color: designTheme.colors.semantic.danger[400], marginLeft: '4px' }}>
            *
          </span>
        )}
      </label>
      
      <input
        ref={inputRef}
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        placeholder={placeholder}
        required={required}
        aria-describedby={error ? `${id}-error` : helperText ? `${id}-helper` : undefined}
        aria-invalid={!!error}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: `${designTheme.spacing.md} ${designTheme.spacing.lg}`,
          border: `2px solid ${error ? designTheme.colors.semantic.danger[400] : 
                                 focused ? designTheme.colors.semantic.primary[400] : 
                                 designTheme.colors.semantic.neutral[300]}`,
          borderRadius: designTheme.borderRadius.lg,
          fontSize: designTheme.typography.body1.fontSize,
          color: designTheme.colors.semantic.neutral[700],
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.2s ease',
          outline: 'none',
          ...(focused && !error && {
            boxShadow: designTheme.shadows.focus
          }),
          ...(error && {
            boxShadow: designTheme.shadows.focusDanger
          }),
          ...(disabled && {
            opacity: 0.6,
            cursor: 'not-allowed'
          })
        }}
        {...props}
      />
      
      {(error || helperText) && (
        <div
          id={error ? `${id}-error` : `${id}-helper`}
          role={error ? 'alert' : 'note'}
          style={{
            marginTop: designTheme.spacing.sm,
            fontSize: designTheme.typography.caption.fontSize,
            fontWeight: 500,
            color: error ? designTheme.colors.semantic.danger[400] : designTheme.colors.semantic.neutral[600]
          }}
        >
          {error || helperText}
        </div>
      )}
    </Box>
  );
};

// 🎛️ PANEL DE ACCESIBILIDAD
export const AccessibilityPanel = ({ open, onClose }) => {
  const { preferences, togglePreference } = useAccessibility();

  const controls = [
    {
      key: 'highContrast',
      label: 'Alto contraste',
      description: 'Mejora el contraste para mejor legibilidad',
      icon: <ContrastIcon />
    },
    {
      key: 'largeText',
      label: 'Texto grande',
      description: 'Aumenta el tamaño de la fuente',
      icon: <TextIncreaseIcon />
    },
    {
      key: 'reducedMotion',
      label: 'Reducir animaciones',
      description: 'Reduce las animaciones para mejor accesibilidad',
      icon: <VolumeOffIcon />
    }
  ];

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: 300 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 300 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            height: '100vh',
            width: '300px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
            boxShadow: designTheme.shadows.xl,
            zIndex: 9999,
            padding: designTheme.spacing.lg,
            overflowY: 'auto'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 600, color: designTheme.colors.semantic.neutral[800] }}>
              Accesibilidad
            </Typography>
            <IconButton onClick={onClose} size="small">
              <HiddenIcon />
            </IconButton>
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {controls.map((control) => (
              <Box
                key={control.key}
                sx={{
                  p: 2,
                  borderRadius: designTheme.borderRadius.lg,
                  border: `1px solid ${designTheme.colors.semantic.neutral[200]}`,
                  background: preferences[control.key] 
                    ? 'rgba(2, 132, 199, 0.1)' 
                    : 'transparent',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    background: 'rgba(2, 132, 199, 0.05)',
                    borderColor: designTheme.colors.semantic.primary[300]
                  }
                }}
                onClick={() => togglePreference(control.key)}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box sx={{ 
                    color: preferences[control.key] 
                      ? designTheme.colors.semantic.primary[400] 
                      : designTheme.colors.semantic.neutral[500]
                  }}>
                    {control.icon}
                  </Box>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {control.label}
                    </Typography>
                    <Typography variant="caption" sx={{ color: designTheme.colors.semantic.neutral[600] }}>
                      {control.description}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      width: 20,
                      height: 20,
                      borderRadius: '50%',
                      border: `2px solid ${preferences[control.key] 
                        ? designTheme.colors.semantic.primary[400] 
                        : designTheme.colors.semantic.neutral[300]}`,
                      background: preferences[control.key] 
                        ? designTheme.colors.semantic.primary[400] 
                        : 'transparent',
                      transition: 'all 0.2s ease'
                    }}
                  />
                </Box>
              </Box>
            ))}
          </Box>

          <Box sx={{ mt: 4, p: 2, background: 'rgba(2, 132, 199, 0.05)', borderRadius: designTheme.borderRadius.lg }}>
            <Typography variant="caption" sx={{ color: designTheme.colors.semantic.neutral[600], fontWeight: 500 }}>
              💡 Tip: Usa Tab para navegar, Enter o Espacio para activar elementos
            </Typography>
          </Box>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// 🎯 SKIP LINK PARA NAVEGACIÓN POR TECLADO
export const SkipLink = ({ href = '#main-content', children = 'Saltar al contenido principal' }) => {
  return (
    <motion.a
      href={href}
      initial={{ opacity: 0, y: -100 }}
      whileFocus={{ opacity: 1, y: 0 }}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        background: designTheme.colors.semantic.primary[400],
        color: designTheme.colors.semantic.primary[900],
        padding: `${designTheme.spacing.sm} ${designTheme.spacing.md}`,
        textDecoration: 'none',
        fontWeight: 600,
        fontSize: designTheme.typography.body2.fontSize,
        borderRadius: `0 0 ${designTheme.borderRadius.md} 0`,
        zIndex: 10000,
        outline: 'none',
        boxShadow: designTheme.shadows.md,
        transform: 'translateY(-100%)',
        opacity: 0,
        transition: 'all 0.2s ease'
      }}
      onFocus={(e) => {
        e.target.style.transform = 'translateY(0)';
        e.target.style.opacity = '1';
      }}
      onBlur={(e) => {
        e.target.style.transform = 'translateY(-100%)';
        e.target.style.opacity = '0';
      }}
    >
      {children}
    </motion.a>
  );
};

// 📢 ANNOUNCER PARA LECTORES DE PANTALLA
export const ScreenReaderAnnouncer = ({ message, priority = 'polite' }) => {
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (message) {
      const id = Date.now();
      setAnnouncements(prev => [...prev, { id, message, priority }]);
      
      // Limpiar después de 5 segundos
      setTimeout(() => {
        setAnnouncements(prev => prev.filter(announcement => announcement.id !== id));
      }, 5000);
    }
  }, [message, priority]);

  return (
    <div
      aria-live={priority}
      aria-atomic="true"
      style={{
        position: 'absolute',
        left: '-10000px',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
    >
      {announcements.map((announcement) => (
        <div key={announcement.id}>
          {announcement.message}
        </div>
      ))}
    </div>
  );
};

export default {
  useAccessibility,
  AccessibleThemeProvider,
  AccessibleButton,
  AccessibleInput,
  AccessibilityPanel,
  SkipLink,
  ScreenReaderAnnouncer
};
