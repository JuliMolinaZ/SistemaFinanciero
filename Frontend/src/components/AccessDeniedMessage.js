// src/components/AccessDeniedMessage.js
import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';

const AccessDeniedMessage = () => {
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      sx={{ backgroundColor: '#f4f6f8', padding: 2 }}
    >
      <Card sx={{ maxWidth: 400, borderRadius: 2, boxShadow: 3 }}>
        <CardContent>
          <Typography variant="h5" component="h2" align="center" gutterBottom>
            Acceso no permitido
          </Typography>
          <Typography variant="body1" align="center">
            Este módulo no está habilitado para el Administrador en este momento.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AccessDeniedMessage;
