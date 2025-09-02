import React from 'react';
import { Box, Typography, Paper } from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';

const ChartContainer = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.9)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.2)',
  borderRadius: 16,
  padding: theme.spacing(3),
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)',
  }
}));

const ChartHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(3),
  paddingBottom: theme.spacing(2),
  borderBottom: '1px solid rgba(0,0,0,0.1)',
}));

const ChartTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  color: '#2c3e50',
  fontSize: '1.25rem',
}));

const ChartSubtitle = styled(Typography)(({ theme }) => ({
  color: '#7f8c8d',
  fontSize: '0.875rem',
  marginTop: theme.spacing(0.5),
}));

const PlaceholderChart = styled(Box)(({ theme }) => ({
  height: 300,
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  borderRadius: 12,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#7f8c8d',
  fontSize: '1rem',
  fontWeight: 500,
}));

const ModernChart = ({
  title,
  subtitle,
  data,
  type = 'line',
  height = 300,
  width = '100%',
  options = {},
  actions,
  loading = false,
  error = null,
  ...props
}) => {
  const renderChart = () => {
    if (loading) {
      return (
        <PlaceholderChart>
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            Cargando gráfico...
          </motion.div>
        </PlaceholderChart>
      );
    }

    if (error) {
      return (
        <PlaceholderChart>
          <Box sx={{ textAlign: 'center' }}>
            <Typography color="error" variant="body2">
              Error al cargar el gráfico
            </Typography>
            <Typography variant="caption" color="text.secondary">
              {error}
            </Typography>
          </Box>
        </PlaceholderChart>
      );
    }

    if (!data || data.length === 0) {
      return (
        <PlaceholderChart>
          No hay datos disponibles
        </PlaceholderChart>
      );
    }

    // Aquí se integraría con una librería de gráficos como Chart.js, Recharts, etc.
    // Por ahora mostramos un placeholder
    return (
      <PlaceholderChart>
        <Box sx={{ textAlign: 'center' }}>
          <Typography variant="h6" color="primary" gutterBottom>
            Gráfico {type}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Integrar con librería de gráficos
          </Typography>
          <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
            Datos: {data.length} elementos
          </Typography>
        </Box>
      </PlaceholderChart>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <ChartContainer {...props}>
        {(title || subtitle || actions) && (
          <ChartHeader>
            <Box>
              {title && <ChartTitle>{title}</ChartTitle>}
              {subtitle && <ChartSubtitle>{subtitle}</ChartSubtitle>}
            </Box>
            {actions && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                {actions}
              </Box>
            )}
          </ChartHeader>
        )}
        
        <Box sx={{ height, width }}>
          {renderChart()}
        </Box>
      </ChartContainer>
    </motion.div>
  );
};

export default ModernChart; 