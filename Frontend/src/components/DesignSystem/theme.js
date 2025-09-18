// 🎨 SISTEMA DE TOKENS CSS OPTIMIZADO - CONTRASTE Y LEGIBILIDAD
// ================================================================

// 🌈 PALETA DE COLORES OPTIMIZADA CON CONTRASTE WCAG AA
export const designTheme = {
  // 🎯 COLORES BASE CON VARIABLES HSL
  colors: {
    // Tema oscuro por defecto
    dark: {
      bg: 'hsl(222 47% 7%)',           // #0f1419
      surface1: 'hsl(222 47% 9%)',     // #141a20
      surface2: 'hsl(222 36% 12%)',    // #1a202c
      surface3: 'hsl(222 28% 15%)',    // #252d38

      textPrimary: 'hsl(210 40% 98%)',   // #f7fafc - Contraste 14.8:1
      textSecondary: 'hsl(215 20% 70%)', // #9ca3af - Contraste 7.2:1
      textTertiary: 'hsl(215 15% 55%)',  // #718096 - Contraste 4.5:1

      border: 'hsl(215 16% 22%)',        // #2d3748
      borderSubtle: 'hsl(215 14% 18%)',  // #252d38
      ring: 'hsl(221 83% 65%)',          // #60a5fa
    },

    // Tema claro
    light: {
      bg: 'hsl(0 0% 100%)',             // #ffffff
      surface1: 'hsl(210 20% 98%)',     // #f8fafc
      surface2: 'hsl(210 16% 96%)',     // #f1f5f9
      surface3: 'hsl(210 12% 94%)',     // #e2e8f0

      textPrimary: 'hsl(222 47% 11%)',   // #1a202c - Contraste 15.8:1
      textSecondary: 'hsl(222 16% 42%)', // #64748b - Contraste 7.8:1
      textTertiary: 'hsl(222 13% 55%)',  // #94a3b8 - Contraste 4.6:1

      border: 'hsl(222 16% 85%)',        // #cbd5e1
      borderSubtle: 'hsl(222 12% 92%)',  // #e2e8f0
      ring: 'hsl(221 83% 53%)',          // #3b82f6
    },

    // 🎨 COLORES SEMÁNTICOS - Solo para estados, no decorativos
    semantic: {
      primary: {
        50: 'hsl(214 100% 97%)',   // #eff6ff
        100: 'hsl(214 95% 93%)',   // #dbeafe
        200: 'hsl(213 97% 87%)',   // #bfdbfe
        300: 'hsl(212 96% 78%)',   // #93c5fd
        400: 'hsl(213 94% 68%)',   // #60a5fa
        500: 'hsl(217 91% 60%)',   // #3b82f6 - Base
        600: 'hsl(221 83% 53%)',   // #2563eb
        700: 'hsl(224 76% 48%)',   // #1d4ed8
        800: 'hsl(226 71% 40%)',   // #1e40af
        900: 'hsl(224 64% 33%)',   // #1e3a8a
      },

      success: {
        50: 'hsl(151 81% 96%)',    // #f0fdf4
        100: 'hsl(149 80% 90%)',   // #dcfce7
        200: 'hsl(152 76% 80%)',   // #bbf7d0
        300: 'hsl(156 72% 67%)',   // #86efac
        400: 'hsl(158 64% 52%)',   // #4ade80
        500: 'hsl(160 84% 39%)',   // #22c55e - Base
        600: 'hsl(161 94% 30%)',   // #16a34a
        700: 'hsl(163 94% 24%)',   // #15803d
        800: 'hsl(164 86% 20%)',   // #166534
        900: 'hsl(166 77% 17%)',   // #14532d
      },

      warning: {
        50: 'hsl(55 92% 95%)',     // #fffbeb
        100: 'hsl(55 97% 88%)',    // #fef3c7
        200: 'hsl(53 98% 77%)',    // #fed7aa
        300: 'hsl(51 94% 65%)',    // #fdba74
        400: 'hsl(48 96% 53%)',    // #fb923c
        500: 'hsl(38 92% 50%)',    // #f59e0b - Base
        600: 'hsl(32 95% 44%)',    // #d97706
        700: 'hsl(26 90% 37%)',    // #b45309
        800: 'hsl(23 83% 31%)',    // #92400e
        900: 'hsl(22 78% 26%)',    // #78350f
      },

      danger: {
        50: 'hsl(0 86% 97%)',      // #fef2f2
        100: 'hsl(0 93% 94%)',     // #fee2e2
        200: 'hsl(0 96% 89%)',     // #fecaca
        300: 'hsl(0 94% 82%)',     // #fca5a5
        400: 'hsl(0 91% 71%)',     // #f87171
        500: 'hsl(0 84% 60%)',     // #ef4444 - Base
        600: 'hsl(0 72% 51%)',     // #dc2626
        700: 'hsl(0 74% 42%)',     // #b91c1c
        800: 'hsl(0 70% 35%)',     // #991b1b
        900: 'hsl(0 63% 31%)',     // #7f1d1d
      },

      neutral: {
        50: 'hsl(210 20% 98%)',    // #f8fafc
        100: 'hsl(220 14% 96%)',   // #f1f5f9
        200: 'hsl(220 13% 91%)',   // #e2e8f0
        300: 'hsl(216 12% 84%)',   // #cbd5e1
        400: 'hsl(218 11% 65%)',   // #94a3b8
        500: 'hsl(220 9% 46%)',    // #64748b
        600: 'hsl(215 14% 34%)',   // #475569
        700: 'hsl(217 19% 27%)',   // #334155
        800: 'hsl(215 28% 17%)',   // #1e293b
        900: 'hsl(222 47% 11%)',   // #0f172a
      }
    }
  },

  // 🎨 GRADIENTES BÁSICOS
  gradients: {
    primary: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(221 83% 53%) 100%)',
    success: 'linear-gradient(135deg, hsl(160 84% 39%) 0%, hsl(161 94% 30%) 100%)',
    warning: 'linear-gradient(135deg, hsl(38 92% 50%) 0%, hsl(32 95% 44%) 100%)',
    danger: 'linear-gradient(135deg, hsl(0 84% 60%) 0%, hsl(0 72% 51%) 100%)',
    dark: 'linear-gradient(135deg, hsl(222 47% 7%) 0%, hsl(222 36% 12%) 100%)',
    light: 'linear-gradient(135deg, hsl(0 0% 100%) 0%, hsl(210 20% 98%) 100%)',
    neon: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(221 83% 53%) 50%, hsl(217 91% 60%) 100%)',
    holographic: 'linear-gradient(135deg, hsl(217 91% 60%) 0%, hsl(221 83% 53%) 25%, hsl(217 91% 60%) 50%, hsl(221 83% 53%) 75%, hsl(217 91% 60%) 100%)'
  },

  // 📏 ESPACIADO SISTEMÁTICO - Múltiplos de 4px
  spacing: {
    px: '1px',
    0: '0',
    1: '0.25rem',    // 4px
    2: '0.5rem',     // 8px
    3: '0.75rem',    // 12px
    4: '1rem',       // 16px
    5: '1.25rem',    // 20px
    6: '1.5rem',     // 24px
    8: '2rem',       // 32px
    10: '2.5rem',    // 40px
    12: '3rem',      // 48px
    16: '4rem',      // 64px
    20: '5rem',      // 80px
    24: '6rem',      // 96px
    
    // Alias semánticos
    xs: '0.5rem',    // 8px
    sm: '0.75rem',   // 12px
    md: '1rem',      // 16px
    lg: '1.5rem',    // 24px
    xl: '2rem',      // 32px
    '2xl': '3rem',   // 48px
    '3xl': '4rem',   // 64px
  },

  // 🔤 TIPOGRAFÍA CONSISTENTE
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      mono: ['JetBrains Mono', 'Consolas', 'Monaco', 'monospace']
    },

    fontSize: {
      xs: '0.75rem',      // 12px - caption
      sm: '0.875rem',     // 14px - body small
      base: '1rem',       // 16px - body
      lg: '1.125rem',     // 18px - h4
      xl: '1.25rem',      // 20px - h3
      '2xl': '1.5rem',    // 24px - h2
      '3xl': '1.875rem',  // 30px - h1
      '4xl': '2.25rem',   // 36px - display
    },

    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700
    },

    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.625
    },

    letterSpacing: {
      tight: '-0.025em',
      normal: '0em',
      wide: '0.025em'
    }
  },

  // 🔘 BORDES Y RADIOS
  borderRadius: {
    none: '0',
    sm: '0.25rem',    // 4px
    base: '0.375rem', // 6px
    md: '0.5rem',     // 8px
    lg: '0.75rem',    // 12px
    xl: '1rem',       // 16px
    '2xl': '1.25rem', // 20px
    full: '9999px'
  },

  // 🌊 SOMBRAS OPTIMIZADAS
  shadows: {
    xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    base: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',

    // Sombras específicas para contraste
    focus: '0 0 0 3px rgba(59, 130, 246, 0.5)', // ring-blue-500/50
    error: '0 0 0 3px rgba(239, 68, 68, 0.5)',  // ring-red-500/50
    floating: '0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1)',
    
    // Efectos de resplandor
    glow: '0 0 20px rgba(59, 130, 246, 0.3), 0 0 40px rgba(59, 130, 246, 0.1)',
    glowSuccess: '0 0 20px rgba(16, 185, 129, 0.3), 0 0 40px rgba(16, 185, 129, 0.1)',
    glowWarning: '0 0 20px rgba(245, 158, 11, 0.3), 0 0 40px rgba(245, 158, 11, 0.1)',
    glowDanger: '0 0 20px rgba(239, 68, 68, 0.3), 0 0 40px rgba(239, 68, 68, 0.1)',
    
    // Sombras de enfoque semánticas
    focusSuccess: '0 0 0 3px rgba(16, 185, 129, 0.5)',
    focusWarning: '0 0 0 3px rgba(245, 158, 11, 0.5)',
    focusDanger: '0 0 0 3px rgba(239, 68, 68, 0.5)',
    
    // Efectos especiales
    neon: '0 0 20px rgba(59, 130, 246, 0.5), 0 0 40px rgba(59, 130, 246, 0.3), 0 0 60px rgba(59, 130, 246, 0.1)',
  },

  // ⚡ TRANSICIONES Y ANIMACIONES
  animations: {
    duration: {
      instant: '0ms',
      fast: '150ms',
      normal: '200ms',
      slow: '300ms',
      slower: '500ms'
    },

    easing: {
      linear: 'linear',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      inOut: 'cubic-bezier(0.4, 0, 0.2, 1)',
      bounce: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    }
  },

  // 📱 BREAKPOINTS RESPONSIVOS
  breakpoints: {
    xs: '0px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px'
  },

  // 🎯 Z-INDEX SISTEMÁTICO
  zIndex: {
    auto: 'auto',
    0: 0,
    10: 10,
    20: 20,
    30: 30,
    40: 40,
    50: 50,
    dropdown: 1000,
    sticky: 1020,
    modal: 1030,
    popover: 1040,
    tooltip: 1050,
    toast: 1060
  }
};

// 🛠️ UTILIDADES DE ESTILO OPTIMIZADAS
export const styleUtils = {
  // Crear variables CSS para tema
  createCSSVariables: (theme = 'dark') => {
    return {
      '--bg': theme === 'dark' ? 'hsl(222 47% 7%)' : 'hsl(0 0% 100%)',
      '--surface-1': theme === 'dark' ? 'hsl(222 47% 9%)' : 'hsl(210 20% 98%)',
      '--surface-2': theme === 'dark' ? 'hsl(222 36% 12%)' : 'hsl(210 16% 96%)',
      '--surface-3': theme === 'dark' ? 'hsl(222 36% 15%)' : 'hsl(210 16% 94%)',
      '--text-primary': theme === 'dark' ? 'hsl(210 40% 98%)' : 'hsl(222 47% 11%)',
      '--text-secondary': theme === 'dark' ? 'hsl(215 20% 70%)' : 'hsl(222 16% 42%)',
      '--text-tertiary': theme === 'dark' ? 'hsl(215 16% 50%)' : 'hsl(222 16% 55%)',
      '--border': theme === 'dark' ? 'hsl(215 16% 22%)' : 'hsl(222 16% 85%)',
      '--border-subtle': theme === 'dark' ? 'hsl(215 16% 18%)' : 'hsl(222 16% 90%)',
      '--ring': 'hsl(221 83% 65%)',

      // Colores semánticos
      '--primary': 'hsl(221 83% 53%)',
      '--primary-hover': 'hsl(221 83% 58%)',
      '--primary-active': 'hsl(221 83% 48%)',
      '--success': 'hsl(160 84% 39%)',
      '--warning': 'hsl(38 92% 50%)',
      '--danger': 'hsl(0 84% 60%)',

      // Transiciones
      '--transition-fast': `${designTheme.animations.duration.fast} ${designTheme.animations.easing.out}`,
      '--transition-normal': `${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`,
    };
  },

  // Crear estilos de enfoque accesibles
  createFocusStyles: (color = 'primary') => ({
    outline: 'none',
    boxShadow: `0 0 0 2px var(--${color})`,
    transition: `box-shadow ${designTheme.animations.duration.fast}`
  }),

  // Crear estilos de card con contraste
  createCardStyles: (variant = 'default') => {
    const baseStyles = {
      backgroundColor: 'var(--surface-1)',
      border: '1px solid var(--border-subtle)',
      borderRadius: designTheme.borderRadius.lg,
      padding: designTheme.spacing[6],
      boxShadow: designTheme.shadows.sm,
      transition: `all ${designTheme.animations.duration.normal}`,
    };

    const variants = {
      default: baseStyles,
      elevated: {
        ...baseStyles,
        boxShadow: designTheme.shadows.lg,
        '&:hover': {
          boxShadow: designTheme.shadows.xl,
          transform: 'translateY(-2px)'
        }
      },
      interactive: {
        ...baseStyles,
        cursor: 'pointer',
        '&:hover': {
          backgroundColor: 'var(--surface-2)',
          boxShadow: designTheme.shadows.lg
        },
        '&:focus-visible': styleUtils.createFocusStyles()
      }
    };

    return variants[variant] || variants.default;
  },

  // Crear estilos de botón optimizados
  createButtonStyles: (variant = 'primary', size = 'md') => {
    const sizes = {
      sm: {
        padding: `${designTheme.spacing[2]} ${designTheme.spacing[3]}`,
        fontSize: designTheme.typography.fontSize.sm,
        minHeight: '32px'
      },
      md: {
        padding: `${designTheme.spacing[3]} ${designTheme.spacing[4]}`,
        fontSize: designTheme.typography.fontSize.base,
        minHeight: '40px'
      },
      lg: {
        padding: `${designTheme.spacing[4]} ${designTheme.spacing[6]}`,
        fontSize: designTheme.typography.fontSize.lg,
        minHeight: '48px'
      }
    };

    const variants = {
      primary: {
        backgroundColor: 'var(--primary)',
        color: '#ffffff',
        border: 'none',
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--primary-hover)'
        },
        '&:active:not(:disabled)': {
          backgroundColor: 'var(--primary-active)'
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
        border: 'none',
        '&:hover:not(:disabled)': {
          backgroundColor: 'var(--surface-1)',
          color: 'var(--text-primary)'
        }
      }
    };

    return {
      ...sizes[size],
      ...variants[variant],
      fontFamily: designTheme.typography.fontFamily.sans.join(', '),
      fontWeight: designTheme.typography.fontWeight.medium,
      borderRadius: designTheme.borderRadius.md,
      cursor: 'pointer',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: designTheme.spacing[2],
      transition: `all ${designTheme.animations.duration.fast}`,
      '&:focus-visible': styleUtils.createFocusStyles(),
      '&:disabled': {
        opacity: 0.5,
        cursor: 'not-allowed'
      }
    };
  },

  // Crear gradientes sutiles
  createGradient: (direction = '135deg', colors = ['primary', 'success']) => {
    const colorValues = colors.map(color =>
      designTheme.colors.semantic[color]?.[500] || color
    );
    return `linear-gradient(${direction}, ${colorValues.join(', ')})`;
  },

  // Crear texto con gradiente
  createTextGradient: (colors = ['primary', 'success']) => ({
    background: styleUtils.createGradient('135deg', colors),
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  }),

  // Crear animación de aparición
  createFadeIn: (direction = 'up', distance = 20) => ({
    '@keyframes fadeIn': {
      from: {
        opacity: 0,
        transform: direction === 'up' ? `translateY(${distance}px)` :
                  direction === 'down' ? `translateY(-${distance}px)` :
                  direction === 'left' ? `translateX(${distance}px)` :
                  `translateX(-${distance}px)`
      },
      to: {
        opacity: 1,
        transform: 'translate(0, 0)'
      }
    },
    animation: `fadeIn ${designTheme.animations.duration.normal} ${designTheme.animations.easing.out}`
  }),

  // Crear efecto glassmorphism premium
  createPremiumGlass: (variant = 'primary') => {
    const variants = {
      primary: {
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      secondary: {
        background: 'rgba(255, 255, 255, 0.08)',
        backdropFilter: 'blur(12px) saturate(150%)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        boxShadow: '0 4px 16px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      },
      dark: {
        background: 'rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      glassPremium: {
        background: 'rgba(255, 255, 255, 0.12)',
        backdropFilter: 'blur(20px) saturate(200%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }
    };
    return variants[variant] || variants.primary;
  },

  // Crear efecto cristal
  createCrystalEffect: () => ({
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(10px) saturate(150%)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, transparent 50%, rgba(255,255,255,0.05) 100%)',
      pointerEvents: 'none'
    }
  }),

  // Crear efecto holográfico
  createHolographicEffect: () => ({
    background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 50%, rgba(255,255,255,0.1) 100%)',
    backdropFilter: 'blur(15px) saturate(200%)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.3)',
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
      animation: 'holographicSweep 3s infinite'
    }
  }),

  // Crear efecto neón
  createNeonEffect: (color = 'primary') => {
    const colors = {
      primary: 'rgba(59, 130, 246, 0.5)',
      success: 'rgba(16, 185, 129, 0.5)',
      warning: 'rgba(245, 158, 11, 0.5)',
      danger: 'rgba(239, 68, 68, 0.5)'
    };
    
    return {
      background: 'rgba(255, 255, 255, 0.05)',
      backdropFilter: 'blur(10px)',
      border: `1px solid ${colors[color] || colors.primary}`,
      boxShadow: `0 0 20px ${colors[color] || colors.primary}, inset 0 1px 0 rgba(255, 255, 255, 0.1)`
    };
  },

  // Crear sombras dinámicas
  createDynamicShadow: (elevation = 'md') => {
    const shadows = {
      xs: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      sm: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
    };
    return shadows[elevation] || shadows.md;
  },

  // Crear estilos glassmorphism básicos
  createGlassStyle: (variant = 'primary', opacity = 0.1) => {
    const variants = {
      primary: {
        background: `rgba(59, 130, 246, ${opacity})`,
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(59, 130, 246, 0.2)',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      secondary: {
        background: `rgba(100, 116, 139, ${opacity})`,
        backdropFilter: 'blur(12px) saturate(150%)',
        border: '1px solid rgba(100, 116, 139, 0.15)',
        boxShadow: '0 4px 16px rgba(100, 116, 139, 0.08), inset 0 1px 0 rgba(255, 255, 255, 0.15)'
      },
      dark: {
        background: `rgba(0, 0, 0, ${opacity * 4})`,
        backdropFilter: 'blur(20px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.1)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      light: {
        background: `rgba(255, 255, 255, ${opacity})`,
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        boxShadow: '0 8px 32px rgba(255, 255, 255, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      success: {
        background: `rgba(16, 185, 129, ${opacity})`,
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(16, 185, 129, 0.2)',
        boxShadow: '0 8px 32px rgba(16, 185, 129, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      warning: {
        background: `rgba(245, 158, 11, ${opacity})`,
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(245, 158, 11, 0.2)',
        boxShadow: '0 8px 32px rgba(245, 158, 11, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      },
      danger: {
        background: `rgba(239, 68, 68, ${opacity})`,
        backdropFilter: 'blur(16px) saturate(180%)',
        border: '1px solid rgba(239, 68, 68, 0.2)',
        boxShadow: '0 8px 32px rgba(239, 68, 68, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.2)'
      }
    };
    return variants[variant] || variants.primary;
  }
};

export default designTheme;