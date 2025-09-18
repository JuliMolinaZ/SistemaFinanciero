// 🔘 SISTEMA DE BOTONES ENTERPRISE - REUTILIZABLE
// ================================================

import React, { forwardRef } from 'react';
import { Loader2 } from 'lucide-react';
import './button.css';

// 🎯 TIPOS Y VARIANTES
const VARIANTS = {
  primary: 'button-primary',
  outline: 'button-outline', 
  ghost: 'button-ghost',
  destructive: 'button-destructive'
};

const SIZES = {
  default: 'button-size-default',
  sm: 'button-size-sm',
  lg: 'button-size-lg',
  icon: 'button-size-icon',
  table: 'button-size-table'
};

// 🔘 COMPONENTE BUTTON BASE
const Button = forwardRef(({
  className = '',
  variant = 'primary',
  size = 'default',
  disabled = false,
  loading = false,
  children,
  ...props
}, ref) => {
  const baseClasses = 'button-base';
  const variantClass = VARIANTS[variant] || VARIANTS.primary;
  const sizeClass = SIZES[size] || SIZES.default;
  
  const classes = [
    baseClasses,
    variantClass,
    sizeClass,
    disabled && 'button-disabled',
    loading && 'button-loading',
    className
  ].filter(Boolean).join(' ');

  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <Loader2 className="button-spinner" aria-hidden="true" />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

// 🎯 COMPONENTE ICON BUTTON
const IconButton = forwardRef(({
  className = '',
  variant = 'ghost',
  disabled = false,
  loading = false,
  tooltip,
  'aria-label': ariaLabel,
  children,
  ...props
}, ref) => {
  const baseClasses = 'button-base button-size-icon';
  const variantClass = VARIANTS[variant] || VARIANTS.ghost;
  
  const classes = [
    baseClasses,
    variantClass,
    disabled && 'button-disabled',
    loading && 'button-loading',
    className
  ].filter(Boolean).join(' ');

  const button = (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || loading}
      aria-disabled={disabled || loading || undefined}
      aria-busy={loading || undefined}
      aria-label={ariaLabel}
      title={tooltip}
      {...props}
    >
      {loading ? (
        <Loader2 className="button-spinner" aria-hidden="true" />
      ) : (
        children
      )}
    </button>
  );

  // Si hay tooltip, envolver con span para tooltip
  if (tooltip && !loading) {
    return (
      <span className="button-tooltip-wrapper" role="tooltip">
        {button}
        <span className="button-tooltip" role="tooltip">
          {tooltip}
        </span>
      </span>
    );
  }

  return button;
});

IconButton.displayName = 'IconButton';

export { Button, IconButton };
