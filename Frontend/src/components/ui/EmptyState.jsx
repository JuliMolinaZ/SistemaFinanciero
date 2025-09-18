// 📭 COMPONENTE EMPTYSTATE - ESTADOS VACÍOS CON CTA
// ================================================

import React, { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { FileX, Plus, RefreshCw } from 'lucide-react';
import QuickAction from './QuickAction';
import './EmptyState.css';

const EmptyState = forwardRef(({
  icon: Icon = FileX,
  title = 'No hay elementos',
  description = 'No se encontraron elementos para mostrar.',
  actionLabel = 'Crear nuevo',
  actionIcon: ActionIcon = Plus,
  onAction,
  variant = 'default',
  className = '',
  ...props
}, ref) => {
  const getVariantConfig = () => {
    switch (variant) {
      case 'error':
        return {
          iconColor: 'var(--danger)',
          iconBg: 'hsl(0 84% 60% / 0.1)',
          titleColor: 'var(--danger)'
        };
      case 'loading':
        return {
          iconColor: 'var(--primary)',
          iconBg: 'hsl(221 83% 53% / 0.1)',
          titleColor: 'var(--primary)'
        };
      default:
        return {
          iconColor: 'var(--text-tertiary)',
          iconBg: 'var(--surface-2)',
          titleColor: 'var(--text-primary)'
        };
    }
  };

  const config = getVariantConfig();

  return (
    <motion.div
      ref={ref}
      className={`empty-state empty-state--${variant} ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      {...props}
    >
      <div className="empty-state__content">
        <motion.div
          className="empty-state__icon"
          style={{
            backgroundColor: config.iconBg,
            color: config.iconColor
          }}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {variant === 'loading' ? (
            <RefreshCw className="w-8 h-8 animate-spin" />
          ) : (
            <Icon className="w-8 h-8" />
          )}
        </motion.div>

        <motion.div
          className="empty-state__text"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
        >
          <h3 
            className="empty-state__title"
            style={{ color: config.titleColor }}
          >
            {title}
          </h3>
          <p className="empty-state__description">
            {description}
          </p>
        </motion.div>

        {onAction && actionLabel && (
          <motion.div
            className="empty-state__action"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.3 }}
          >
            <QuickAction
              variant="primary"
              icon={ActionIcon}
              onClick={onAction}
            >
              {actionLabel}
            </QuickAction>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

EmptyState.displayName = 'EmptyState';

export default EmptyState;
