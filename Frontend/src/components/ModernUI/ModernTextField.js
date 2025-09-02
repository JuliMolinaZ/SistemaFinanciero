import React from 'react';
import { TextField, InputAdornment } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const StyledTextField = styled(TextField)(({ theme, variant = 'outlined' }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    backdropFilter: 'blur(10px)',
    border: '2px solid rgba(78, 205, 196, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fontSize: '14px',
    
    '&:hover': {
      borderColor: '#4ecdc4',
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
    },
    
    '&.Mui-focused': {
      borderColor: '#4ecdc4',
      boxShadow: '0 0 0 3px rgba(78, 205, 196, 0.1)',
      backgroundColor: 'rgba(255, 255, 255, 1)',
    },
    
    '&.Mui-error': {
      borderColor: '#e74c3c',
      '&:hover': {
        borderColor: '#c0392b',
      },
      '&.Mui-focused': {
        borderColor: '#e74c3c',
        boxShadow: '0 0 0 3px rgba(231, 76, 60, 0.1)',
      }
    }
  },
  
  '& .MuiInputLabel-root': {
    color: '#7f8c8d',
    fontWeight: 500,
    '&.Mui-focused': {
      color: '#4ecdc4',
    },
    '&.Mui-error': {
      color: '#e74c3c',
    }
  },
  
  '& .MuiInputBase-input': {
    color: '#2c3e50',
    '&::placeholder': {
      color: '#95a5a6',
      opacity: 1,
    }
  },
  
  '& .MuiFormHelperText-root': {
    marginLeft: 0,
    fontSize: '12px',
    '&.Mui-error': {
      color: '#e74c3c',
    }
  }
}));

const ModernTextField = ({
  variant = 'outlined',
  fullWidth = true,
  size = 'medium',
  startIcon,
  endIcon,
  error,
  helperText,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <StyledTextField
        variant={variant}
        fullWidth={fullWidth}
        size={size}
        error={error}
        helperText={helperText}
        InputProps={{
          startAdornment: startIcon ? (
            <InputAdornment position="start">
              {startIcon}
            </InputAdornment>
          ) : undefined,
          endAdornment: endIcon ? (
            <InputAdornment position="end">
              {endIcon}
            </InputAdornment>
          ) : undefined,
        }}
        {...props}
      />
    </motion.div>
  );
};

export default ModernTextField; 