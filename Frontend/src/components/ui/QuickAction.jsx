// ⚡ COMPONENTE QUICKACTION - BOTONES DE ACCIÓN RÁPIDA
// ===================================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './QuickAction.css';

const QuickAction = forwardRef(({
  children,
  icon: Icon,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = '',
  onClick,
  ...props
}, ref) => {
  const classes = `quick-action quick-action--${variant} quick-action--${size} ${
    disabled ? 'quick-action--disabled' : ''
  } ${loading ? 'quick-action--loading' : ''} ${className}`.trim();

  return (
    <motion.button
      ref={ref}
      className={classes}
      onClick={onClick}
      disabled={disabled || loading}
      whileHover={!disabled && !loading ? { y: -2 } : undefined}
      whileTap={!disabled && !loading ? { y: 0 } : undefined}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {loading ? (
        <div className="quick-action__spinner" />
      ) : (
        <>
          {Icon && (
            <div className="quick-action__icon">
              <Icon className="w-5 h-5" />
            </div>
          )}
          <span className="quick-action__content">{children}</span>
        </>
      )}
    </motion.button>
  );
});

QuickAction.displayName = 'QuickAction';

export default QuickAction;
