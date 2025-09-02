import React from 'react';
import { Chip, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledChip = styled(Chip)(({ theme, variant = 'default', color = '#4ecdc4' }) => {
  const colors = {
    primary: '#4ecdc4',
    secondary: '#96ceb4',
    success: '#27ae60',
    warning: '#f39c12',
    error: '#e74c3c',
    info: '#45b7d1'
  };

  const selectedColor = colors[color] || color;

  return {
    borderRadius: 20,
    fontWeight: 600,
    fontSize: '0.75rem',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    border: '2px solid transparent',
    
    ...(variant === 'default' && {
      backgroundColor: `${selectedColor}20`,
      color: selectedColor,
      borderColor: `${selectedColor}40`,
      
      '&:hover': {
        backgroundColor: `${selectedColor}30`,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${selectedColor}30`,
      }
    }),
    
    ...(variant === 'filled' && {
      backgroundColor: selectedColor,
      color: 'white',
      
      '&:hover': {
        backgroundColor: `${selectedColor}dd`,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${selectedColor}40`,
      }
    }),
    
    ...(variant === 'outlined' && {
      backgroundColor: 'transparent',
      color: selectedColor,
      borderColor: selectedColor,
      
      '&:hover': {
        backgroundColor: `${selectedColor}10`,
        transform: 'translateY(-1px)',
        boxShadow: `0 4px 12px ${selectedColor}20`,
      }
    }),
    
    '& .MuiChip-label': {
      padding: '4px 12px',
    },
    
    '& .MuiChip-icon': {
      color: 'inherit',
      fontSize: '1rem',
    },
    
    '& .MuiChip-deleteIcon': {
      color: 'inherit',
      fontSize: '1rem',
      '&:hover': {
        color: 'inherit',
        opacity: 0.8,
      }
    }
  };
});

const ModernBadge = ({
  label,
  color = 'primary',
  variant = 'default',
  size = 'medium',
  icon,
  onDelete,
  onClick,
  disabled = false,
  ...props
}) => {
  const getSize = () => {
    switch (size) {
      case 'small': return { height: 20, fontSize: '0.65rem' };
      case 'large': return { height: 32, fontSize: '0.85rem' };
      default: return { height: 24, fontSize: '0.75rem' };
    }
  };

  return (
    <motion.div
      whileHover={!disabled ? { scale: 1.05 } : {}}
      whileTap={!disabled ? { scale: 0.95 } : {}}
      style={{ display: 'inline-block' }}
    >
      <StyledChip
        label={label}
        color={color}
        variant={variant}
        icon={icon}
        onDelete={onDelete}
        onClick={onClick}
        disabled={disabled}
        sx={{
          height: getSize().height,
          fontSize: getSize().fontSize,
          opacity: disabled ? 0.6 : 1,
          cursor: disabled ? 'not-allowed' : onClick ? 'pointer' : 'default',
          ...props.sx
        }}
        {...props}
      />
    </motion.div>
  );
};

// Componente para grupos de badges
const ModernBadgeGroup = ({ badges = [], spacing = 1, ...props }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: spacing,
        alignItems: 'center',
        ...props.sx
      }}
      {...props}
    >
      {badges.map((badge, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          <ModernBadge {...badge} />
        </motion.div>
      ))}
    </Box>
  );
};

export { ModernBadgeGroup };
export default ModernBadge; 