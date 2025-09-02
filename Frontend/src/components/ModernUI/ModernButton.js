import React from 'react';
import { Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledButton = styled(Button)(({ theme, variant = 'contained', size = 'medium' }) => ({
  borderRadius: variant === 'contained' ? 12 : 8,
  textTransform: 'none',
  fontWeight: 600,
  fontSize: '0.9rem',
  padding: size === 'small' ? '8px 16px' : size === 'large' ? '12px 24px' : '10px 20px',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  
  // Variante contained
  ...(variant === 'contained' && {
    background: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%)',
    color: '#fff',
    border: 'none',
    boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
    
    '&:hover': {
      background: 'linear-gradient(135deg, #45b7d1 0%, #4ecdc4 100%)',
      boxShadow: '0 8px 25px rgba(78, 205, 196, 0.4)',
      transform: 'translateY(-2px)',
    },
    
    '&:active': {
      transform: 'translateY(0)',
      boxShadow: '0 4px 15px rgba(78, 205, 196, 0.3)',
    },
    
    '&:disabled': {
      background: 'linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)',
      color: '#7f8c8d',
      boxShadow: 'none',
      transform: 'none',
    }
  }),
  
  // Variante outlined
  ...(variant === 'outlined' && {
    background: 'transparent',
    color: '#4ecdc4',
    border: '2px solid #4ecdc4',
    
    '&:hover': {
      background: 'rgba(78, 205, 196, 0.1)',
      borderColor: '#45b7d1',
      color: '#45b7d1',
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 15px rgba(78, 205, 196, 0.2)',
    },
    
    '&:active': {
      transform: 'translateY(0)',
    },
    
    '&:disabled': {
      borderColor: '#bdc3c7',
      color: '#bdc3c7',
      transform: 'none',
      boxShadow: 'none',
    }
  }),
  
  // Variante text
  ...(variant === 'text' && {
    background: 'transparent',
    color: '#4ecdc4',
    border: 'none',
    padding: size === 'small' ? '6px 12px' : size === 'large' ? '10px 20px' : '8px 16px',
    
    '&:hover': {
      background: 'rgba(78, 205, 196, 0.1)',
      color: '#45b7d1',
      transform: 'translateY(-1px)',
    },
    
    '&:active': {
      transform: 'translateY(0)',
    },
    
    '&:disabled': {
      color: '#bdc3c7',
      transform: 'none',
    }
  }),
  
  // Efecto de brillo
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: '-100%',
    width: '100%',
    height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
    transition: 'left 0.5s',
  },
  
  '&:hover::before': {
    left: '100%',
  },
  
  // Iconos
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
    transition: 'transform 0.3s ease',
  },
  
  '&:hover .MuiButton-startIcon': {
    transform: 'scale(1.1)',
  },
  
  '& .MuiButton-endIcon': {
    marginLeft: theme.spacing(1),
    transition: 'transform 0.3s ease',
  },
  
  '&:hover .MuiButton-endIcon': {
    transform: 'scale(1.1)',
  }
}));

const ModernButton = ({ 
  children, 
  variant = 'contained', 
  size = 'medium',
  onClick,
  disabled = false,
  startIcon,
  endIcon,
  fullWidth = false,
  color = 'primary',
  ...props 
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      style={{ width: fullWidth ? '100%' : 'auto' }}
    >
      <StyledButton
        variant={variant}
        size={size}
        onClick={onClick}
        disabled={disabled}
        startIcon={startIcon}
        endIcon={endIcon}
        fullWidth={fullWidth}
        color={color}
        {...props}
      >
        {children}
      </StyledButton>
    </motion.div>
  );
};

export default ModernButton; 