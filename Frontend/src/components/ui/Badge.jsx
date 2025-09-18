// 🏷️ COMPONENTE BADGE - ETIQUETAS SEMÁNTICAS
// ===========================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Badge.css';

const Badge = forwardRef(({
  children,
  variant = 'neutral',
  size = 'md',
  className = '',
  ...props
}, ref) => {
  const baseClasses = `badge badge--${variant} badge--${size}`;
  const classes = `${baseClasses} ${className}`.trim();

  return (
    <motion.span
      ref={ref}
      className={classes}
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.15 }}
      {...props}
    >
      {children}
    </motion.span>
  );
});

Badge.displayName = 'Badge';

export default Badge;
