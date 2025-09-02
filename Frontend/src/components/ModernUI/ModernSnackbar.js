import React from 'react';
import { Snackbar, Alert, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import WarningIcon from '@mui/icons-material/Warning';
import InfoIcon from '@mui/icons-material/Info';

const StyledAlert = styled(Alert)(({ theme, severity = 'info' }) => {
  const colors = {
    success: '#27ae60',
    error: '#e74c3c',
    warning: '#f39c12',
    info: '#4ecdc4'
  };

  return {
    borderRadius: 12,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    border: `1px solid ${colors[severity]}30`,
    boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
    color: '#2c3e50',
    fontWeight: 500,
    
    '& .MuiAlert-icon': {
      color: colors[severity],
    },
    
    '& .MuiAlert-message': {
      color: '#2c3e50',
    },
    
    '& .MuiAlert-action': {
      '& .MuiIconButton-root': {
        color: '#7f8c8d',
        '&:hover': {
          color: colors[severity],
        }
      }
    }
  };
});

const ModernSnackbar = ({
  open,
  onClose,
  message,
  severity = 'info',
  autoHideDuration = 6000,
  anchorOrigin = { vertical: 'bottom', horizontal: 'right' },
  variant = 'filled',
  action,
  ...props
}) => {
  const getIcon = (severity) => {
    switch (severity) {
      case 'success':
        return <CheckCircleIcon />;
      case 'error':
        return <ErrorIcon />;
      case 'warning':
        return <WarningIcon />;
      case 'info':
      default:
        return <InfoIcon />;
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <Snackbar
          open={open}
          autoHideDuration={autoHideDuration}
          onClose={onClose}
          anchorOrigin={anchorOrigin}
          {...props}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.8 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <StyledAlert
              severity={severity}
              variant={variant}
              onClose={onClose}
              action={action}
              icon={getIcon(severity)}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {message}
              </Box>
            </StyledAlert>
          </motion.div>
        </Snackbar>
      )}
    </AnimatePresence>
  );
};

export default ModernSnackbar; 