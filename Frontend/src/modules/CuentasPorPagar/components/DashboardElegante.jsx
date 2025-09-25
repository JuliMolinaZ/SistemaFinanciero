import React, { useMemo } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  useTheme,
  useMediaQuery,
  Chip
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { motion } from 'framer-motion';
import {
  TrendingUp as TrendingUpIcon,
  Assessment as AssessmentIcon
} from '@mui/icons-material';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  PieChart,
  Pie,
  Cell
} from 'recharts';

// Componentes estilizados compactos
const DashboardCard = styled(Card)(({ theme, highlight = false }) => ({
  background: '#ffffff !important',
  border: `3px solid ${highlight ? 'rgba(102, 126, 234, 0.4)' : 'rgba(0, 0, 0, 0.15)'}`,
  borderRadius: 20,
  boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 10px 35px rgba(0,0,0,0.2)',
    borderColor: highlight ? 'rgba(102, 126, 234, 0.6)' : 'rgba(0, 0, 0, 0.25)'
  }
}));

const ChartContainer = styled(Box)(({ theme }) => ({
  background: '#ffffff !important',
  borderRadius: 20,
  padding: theme.spacing(3),
  border: '3px solid rgba(0, 0, 0, 0.15)',
  transition: 'all 0.3s ease',
  boxShadow: '0 6px 25px rgba(0,0,0,0.12)',
  '&:hover': {
    background: '#ffffff !important',
    borderColor: 'rgba(0, 0, 0, 0.25)',
    boxShadow: '0 10px 35px rgba(0,0,0,0.2)'
  }
}));

const DashboardElegante = ({ cuentas = [] }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Calcular métricas básicas
  const metrics = useMemo(() => {
    if (!cuentas.length) return {};

    // Tendencia simple (últimos 4 meses)
    const meses = [];
    const ahora = new Date();
    for (let i = 3; i >= 0; i--) {
      const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
      const mesKey = fecha.toLocaleString('es-MX', { month: 'short' });
      
      const cuentasMes = cuentas.filter(c => {
        const cuentaFecha = new Date(c.fecha || c.fecha_vencimiento);
        return cuentaFecha.getMonth() === fecha.getMonth() && 
               cuentaFecha.getFullYear() === fecha.getFullYear();
      });
      
      const montoMes = cuentasMes.reduce((sum, c) => sum + parseFloat(c.monto_con_iva || c.monto_neto || 0), 0);
      
      meses.push({
        mes: mesKey,
        monto: montoMes
      });
    }

    // Distribución simple por categorías (top 5)
    const categorias = {};
    cuentas.forEach(c => {
      const cat = c.categoria || 'Sin categoría';
      categorias[cat] = (categorias[cat] || 0) + parseFloat(c.monto_con_iva || c.monto_neto || 0);
    });

    const distribucionCategorias = Object.entries(categorias)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([cat, monto]) => ({
        categoria: cat,
        monto: parseFloat(monto.toFixed(2))
      }));

    const result = {
      meses,
      distribucionCategorias
    };

    return result;
  }, [cuentas]);

  // Colores para las gráficas
  const chartColors = ['#667eea', '#764ba2', '#f093fb', '#f5576c', '#4facfe'];

  // Formatear moneda
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN'
    }).format(amount || 0);
  };

  if (!cuentas.length) {
    return (
      <Box sx={{ textAlign: 'center', py: 4 }}>
        <AssessmentIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h6" color="text.secondary">
          No hay datos disponibles para mostrar el dashboard
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2 }}>
      {/* Gráficas Compactas */}
      <Grid container spacing={2}>
        {/* Tendencia Simple */}
        <Grid item xs={12} lg={8}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <DashboardCard>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <TrendingUpIcon sx={{ color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgba(0, 0, 0, 0.8)' }}>
                    Tendencia de Pagos
                  </Typography>
                  <Chip 
                    label="Últimos 4 meses" 
                    size="small" 
                    sx={{ background: 'rgba(102, 126, 234, 0.1)', color: '#667eea' }}
                  />
                </Box>
                
                <ChartContainer>
                  <ResponsiveContainer width="100%" height={200}>
                    <LineChart data={metrics.meses}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.1)" />
                      <XAxis 
                        dataKey="mes" 
                        stroke="#667eea"
                        fontSize={11}
                      />
                      <YAxis 
                        stroke="#667eea"
                        fontSize={11}
                        tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                      />
                      <RechartsTooltip 
                        formatter={(value) => [formatCurrency(value), 'Monto']}
                        labelStyle={{ color: '#667eea' }}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="monto" 
                        stroke="#667eea" 
                        strokeWidth={2}
                        dot={{ fill: '#667eea', strokeWidth: 2, r: 3 }}
                        activeDot={{ r: 4, stroke: '#667eea', strokeWidth: 2 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </DashboardCard>
          </motion.div>
        </Grid>

        {/* Distribución por Categorías Compacta */}
        <Grid item xs={12} lg={4}>
          <motion.div whileHover={{ scale: 1.01 }}>
            <DashboardCard>
              <CardContent sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                  <AssessmentIcon sx={{ color: '#667eea' }} />
                  <Typography variant="h6" sx={{ fontWeight: 700, color: 'rgba(0, 0, 0, 0.8)' }}>
                    Top Categorías
                  </Typography>
                </Box>
                
                <ChartContainer>
                  <ResponsiveContainer width="100%" height={150}>
                    <PieChart>
                      <Pie
                        data={metrics.distribucionCategorias}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="monto"
                      >
                        {metrics.distribucionCategorias.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                        ))}
                      </Pie>
                      <RechartsTooltip 
                        formatter={(value) => [formatCurrency(value), 'Monto']}
                        labelStyle={{ color: '#667eea' }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>

                {/* Lista simple de categorías */}
                <Box sx={{ mt: 1.5 }}>
                  {metrics.distribucionCategorias.map((cat, index) => (
                    <Box key={cat.categoria} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      justifyContent: 'space-between',
                      mb: 0.5,
                      p: 0.5,
                      borderRadius: 1,
                      background: 'rgba(102, 126, 234, 0.05)'
                    }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Box sx={{ 
                          width: 8, 
                          height: 8, 
                          borderRadius: '50%', 
                          background: chartColors[index % chartColors.length] 
                        }} />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                          {cat.categoria}
                        </Typography>
                      </Box>
                      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                        {formatCurrency(cat.monto)}
                      </Typography>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </DashboardCard>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardElegante;
