import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { X } from 'lucide-react';

const SimpleModal = ({ open, onClose, title, children }) => {
  if (!open) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999
      }}
    >
      <Box
        sx={{
          backgroundColor: 'white',
          borderRadius: 2,
          padding: 3,
          width: '90%',
          maxWidth: 600,
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            mb: 2
          }}
        >
          <Typography variant="h5" component="h2">
            {title}
          </Typography>
          <Button
            onClick={onClose}
            sx={{
              minWidth: 'auto',
              p: 1
            }}
          >
            <X size={20} />
          </Button>
        </Box>

        {/* Content */}
        {children}

        {/* Footer */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            gap: 2,
            mt: 3
          }}
        >
          <Button
            variant="outlined"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              console.log('✅ Acción confirmada');
              onClose();
            }}
          >
            Confirmar
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default SimpleModal;
