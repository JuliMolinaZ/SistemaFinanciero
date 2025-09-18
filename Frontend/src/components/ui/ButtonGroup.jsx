// 🎛️ BUTTON GROUP - ACCIONES COMPACTAS PARA TABLA
// ================================================

import React from 'react';
import './button-group.css';

// 🎯 COMPONENTE BUTTON GROUP
const ButtonGroup = ({ 
  children, 
  className = '', 
  spacing = 'sm', // 'xs' | 'sm' | 'md'
  align = 'end', // 'start' | 'center' | 'end'
  ...props 
}) => {
  const baseClasses = 'button-group';
  const spacingClass = `button-group--spacing-${spacing}`;
  const alignClass = `button-group--align-${align}`;
  
  const classes = [
    baseClasses,
    spacingClass,
    alignClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="group" {...props}>
      {children}
    </div>
  );
};

// 🎯 COMPONENTE TABLE BUTTON GROUP (especializado para tablas)
const TableButtonGroup = ({ children, className = '', ...props }) => {
  return (
    <ButtonGroup
      spacing="xs"
      align="end"
      className={`table-button-group ${className}`}
      {...props}
    >
      {children}
    </ButtonGroup>
  );
};

export { ButtonGroup, TableButtonGroup };
