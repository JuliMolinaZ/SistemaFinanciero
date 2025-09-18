// 💀 COMPONENTE SKELETON - ESTADOS DE CARGA
// ========================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import './Skeleton.css';

const Skeleton = forwardRef(({
  width,
  height,
  variant = 'text',
  animation = 'pulse',
  className = '',
  ...props
}, ref) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'rectangular':
        return {
          borderRadius: 'var(--radius-lg)',
          width: width || '100%',
          height: height || '200px'
        };
      case 'circular':
        return {
          borderRadius: '50%',
          width: width || height || '40px',
          height: height || width || '40px'
        };
      case 'text':
        return {
          borderRadius: 'var(--radius-sm)',
          width: width || '100%',
          height: height || '1em'
        };
      default:
        return {
          borderRadius: 'var(--radius-sm)',
          width: width || '100%',
          height: height || '1em'
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <motion.div
      ref={ref}
      className={`skeleton skeleton--${variant} skeleton--${animation} ${className}`}
      style={styles}
      initial={{ opacity: 0.6 }}
      animate={{ opacity: 0.8 }}
      transition={{ duration: 0.5, repeat: Infinity, repeatType: 'reverse' }}
      {...props}
    />
  );
});

Skeleton.displayName = 'Skeleton';

// 🎯 COMPONENTES COMPUESTOS DE SKELETON
export const SkeletonCard = ({ className = '', ...props }) => (
  <div className={`skeleton-card ${className}`} {...props}>
    <Skeleton variant="rectangular" height="120px" />
    <div className="skeleton-card__content">
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
      <Skeleton variant="text" width="80%" />
    </div>
  </div>
);

export const SkeletonTable = ({ rows = 5, columns = 4, className = '', ...props }) => (
  <div className={`skeleton-table ${className}`} {...props}>
    <div className="skeleton-table__header">
      {Array.from({ length: columns }).map((_, index) => (
        <Skeleton key={index} variant="text" height="20px" />
      ))}
    </div>
    <div className="skeleton-table__body">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="skeleton-table__row">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <Skeleton key={colIndex} variant="text" height="16px" />
          ))}
        </div>
      ))}
    </div>
  </div>
);

export const SkeletonList = ({ items = 5, className = '', ...props }) => (
  <div className={`skeleton-list ${className}`} {...props}>
    {Array.from({ length: items }).map((_, index) => (
      <div key={index} className="skeleton-list__item">
        <Skeleton variant="circular" width="40px" height="40px" />
        <div className="skeleton-list__content">
          <Skeleton variant="text" width="70%" />
          <Skeleton variant="text" width="50%" />
        </div>
      </div>
    ))}
  </div>
);

export default Skeleton;
