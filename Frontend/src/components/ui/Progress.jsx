// 📊 COMPONENTE PROGRESS - BARRAS DE PROGRESO ACCESIBLES
// =====================================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Progress.css';

const Progress = forwardRef(({
  value = 0,
  max = 100,
  size = 'md',
  variant = 'primary',
  showLabel = false,
  label,
  className = '',
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const progressId = React.useId();
  const labelId = `${progressId}-label`;
  
  const classes = `progress progress--${size} progress--${variant} ${className}`.trim();
  
  const progressLabel = label || `${Math.round(percentage)}% completado`;

  return (
    <div className={classes} ref={ref} {...props}>
      {(showLabel || label) && (
        <div className="progress__header">
          <span 
            id={labelId}
            className="progress__label"
          >
            {progressLabel}
          </span>
          <span className="progress__percentage">
            {Math.round(percentage)}%
          </span>
        </div>
      )}
      
      <div 
        className="progress__track"
        role="progressbar"
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={max}
        aria-label={ariaLabel || progressLabel}
        aria-labelledby={showLabel ? labelId : undefined}
      >
        <motion.div
          className="progress__bar"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            delay: 0.2 
          }}
        />
      </div>
      
      {/* Screen reader only text */}
      <span className="sr-only">
        Progreso: {Math.round(percentage)}% completado
      </span>
    </div>
  );
});

Progress.displayName = 'Progress';

export default Progress;
