// src/modules/CuentasPorPagar/components/LoadingScreen.jsx
import React from 'react';
import { Box, Typography, CircularProgress, LinearProgress } from '@mui/material';

const LoadingScreen = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        backgroundColor: '#1e1e1e', 
        color: '#ffffff',         
        p: 2,
      }}
    >
      {/* Spinner */}
      <CircularProgress
        size={50}
        sx={{
          color: '#1d72b8', 
          mb: 2,
        }}
      />

      {/* Texto de carga */}
      <Typography
        variant="h5"
        sx={{
          fontWeight: 'bold',
          mb: 2,
          color: '#57b3f9', 
        }}
      >
        Cargando...
      </Typography>

      {/* Barra de carga */}
      <Box
        sx={{
          width: '80%',
          height: '10px',
          backgroundColor: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '5px',
          overflow: 'hidden',
        }}
      >
        <LinearProgress
          variant="indeterminate"
          sx={{
            height: '100%',
            borderRadius: '5px',
            backgroundColor: 'transparent',
            '& .MuiLinearProgress-bar': {
              background: 'linear-gradient(90deg, #1d72b8, #57b3f9)', // Degradado azul brillante
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default LoadingScreen;
