import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: 16,
    background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.3)',
    boxShadow: '0 25px 50px rgba(0,0,0,0.25)',
    maxWidth: '90vw',
    maxHeight: '90vh',
    overflow: 'hidden',
  },
  '& .MuiDialogTitle-root': {
    background: 'linear-gradient(135deg, #4ecdc4 0%, #45b7d1 100%)',
    color: 'white',
    fontWeight: 700,
    padding: '20px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.2)',
  },
  '& .MuiDialogContent-root': {
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.9)',
  },
  '& .MuiDialogActions-root': {
    padding: '16px 24px',
    background: 'rgba(255, 255, 255, 0.8)',
    borderTop: '1px solid rgba(0,0,0,0.1)',
  }
}));

const ModernDialog = ({
  open,
  onClose,
  title,
  children,
  actions,
  maxWidth = 'md',
  fullWidth = true,
  ...props
}) => {
  return (
    <AnimatePresence>
      {open && (
        <StyledDialog
          open={open}
          onClose={onClose}
          maxWidth={maxWidth}
          fullWidth={fullWidth}
          TransitionComponent={motion.div}
          {...props}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {title && (
              <DialogTitle>
                {title}
              </DialogTitle>
            )}
            
            <DialogContent>
              <Box sx={{ mt: title ? 0 : 2 }}>
                {children}
              </Box>
            </DialogContent>
            
            {actions && (
              <DialogActions>
                {actions}
              </DialogActions>
            )}
          </motion.div>
        </StyledDialog>
      )}
    </AnimatePresence>
  );
};

export default ModernDialog; 