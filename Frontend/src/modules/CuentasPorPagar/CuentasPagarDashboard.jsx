import React from 'react';
import { Box, Typography } from '@mui/material';

const CuentasPagarDashboard = () => {
  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, color: '#2c3e50' }}>
        Dashboard de Cuentas por Pagar
      </Typography>
      <Typography variant="body1" sx={{ color: '#7f8c8d' }}>
        Este es el dashboard principal del módulo de cuentas por pagar.
        Aquí se mostrarán gráficos, métricas y resúmenes importantes.
      </Typography>
    </Box>
  );
};

export default CuentasPagarDashboard;
