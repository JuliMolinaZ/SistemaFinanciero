// components/DashboardComponents/AdvancedMetrics.jsx
import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  LinearProgress,
  CircularProgress,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  AttachMoney,
  AccountBalance,
  Speed,
  Analytics,
  Warning,
  CheckCircle,
  Info
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Styled Components con animaciones avanzadas
const MetricCard = styled(Card)(({ theme, severity = 'info' }) => {
  const colors = {
    success: { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e' },
    warning: { bg: '#fefce8', border: '#eab308', text: '#713f12' },
    error: { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d' },
    info: { bg: '#f8fafc', border: '#64748b', text: '#334155' }
  };

  const color = colors[severity];

  return {
    background: color.bg,
    border: `2px solid ${color.border}`,
    borderRadius: 16,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: `linear-gradient(90deg, ${color.border}, ${color.border}80)`,
      transform: 'scaleX(0)',
      transformOrigin: 'left',
      transition: 'transform 0.3s ease'
    },
    '&:hover': {
      transform: 'translateY(-4px) scale(1.02)',
      boxShadow: `0 12px 40px ${color.border}20`,
      '&::before': {
        transform: 'scaleX(1)'
      }
    }
  };
});

const AnimatedNumber = ({ value, duration = 2000, prefix = '', suffix = '' }) => {
  const [displayValue, setDisplayValue] = React.useState(0);

  React.useEffect(() => {
    let startTime;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = Math.min((currentTime - startTime) / duration, 1);
      
      // Easing function para suavizar la animación
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(value * easeOutCubic);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  const formatNumber = (num) => {
    if (Math.abs(num) >= 1000000) {
      return (num / 1000000).toFixed(1) + 'M';
    }
    if (Math.abs(num) >= 1000) {
      return (num / 1000).toFixed(1) + 'K';
    }
    return num.toFixed(0);
  };

  return (
    <Typography variant="h3" component="span" fontWeight="bold">
      {prefix}{formatNumber(displayValue)}{suffix}
    </Typography>
  );
};

const TrendIndicator = ({ value, type = 'percentage' }) => {
  const isPositive = value > 0;
  const isNegative = value < 0;
  const isNeutral = value === 0;

  const getIcon = () => {
    if (isPositive) return <TrendingUp />;
    if (isNegative) return <TrendingDown />;
    return <TrendingFlat />;
  };

  const getColor = () => {
    if (isPositive) return '#059669';
    if (isNegative) return '#dc2626';
    return '#6b7280';
  };

  const formatValue = () => {
    const absValue = Math.abs(value);
    if (type === 'percentage') {
      return `${absValue.toFixed(1)}%`;
    }
    return absValue.toLocaleString();
  };

  return (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
      <Box sx={{ color: getColor(), display: 'flex', alignItems: 'center' }}>
        {getIcon()}
      </Box>
      <Typography
        variant="body2"
        sx={{
          color: getColor(),
          fontWeight: 600
        }}
      >
        {formatValue()}
      </Typography>
    </Box>
  );
};

const CircularMetric = ({ value, max, label, color = '#0ea5e9' }) => {
  const percentage = (value / max) * 100;

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <Box sx={{ position: 'relative', display: 'inline-flex' }}>
        <CircularProgress
          variant="determinate"
          value={percentage}
          size={80}
          thickness={6}
          sx={{
            color: color,
            '& .MuiCircularProgress-circle': {
              strokeLinecap: 'round',
            },
          }}
        />
        <Box
          sx={{
            top: 0,
            left: 0,
            bottom: 0,
            right: 0,
            position: 'absolute',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Typography
            variant="caption"
            component="div"
            color="text.secondary"
            fontWeight="bold"
          >
            {`${Math.round(percentage)}%`}
          </Typography>
        </Box>
      </Box>
      <Typography variant="body2" color="text.secondary" textAlign="center" mt={1}>
        {label}
      </Typography>
    </Box>
  );
};

const AdvancedMetrics = ({ kpis }) => {
  if (!kpis || !kpis.financial) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" mt={2}>Cargando métricas...</Typography>
      </Box>
    );
  }

  const { financial, operational, trends } = kpis;

  const metrics = [
    {
      id: 'cash-flow',
      title: 'Flujo de Efectivo Neto',
      value: financial.netCashFlow,
      icon: <AttachMoney />,
      severity: financial.netCashFlow >= 0 ? 'success' : 'error',
      trend: trends.growth,
      description: 'Diferencia entre ingresos y gastos',
      prefix: '$',
      action: () => console.log('Navigate to cash flow details')
    },
    {
      id: 'monthly-revenue',
      title: 'Ingresos del Mes',
      value: financial.monthlyRevenue,
      icon: <TrendingUp />,
      severity: financial.monthlyRevenue > 50000 ? 'success' : 'warning',
      trend: trends.growth,
      description: 'Ingresos generados este mes',
      prefix: '$'
    },
    {
      id: 'liquidity-ratio',
      title: 'Índice de Liquidez',
      value: financial.liquidityRatio,
      icon: <Speed />,
      severity: financial.liquidityRatio >= 1.2 ? 'success' : financial.liquidityRatio >= 0.8 ? 'warning' : 'error',
      trend: 0,
      description: 'Capacidad para cubrir obligaciones',
      suffix: 'x'
    },
    {
      id: 'active-projects',
      title: 'Proyectos Activos',
      value: operational.activeProjects,
      icon: <Analytics />,
      severity: operational.activeProjects > 0 ? 'success' : 'warning',
      trend: 0,
      description: 'Proyectos en desarrollo'
    },
    {
      id: 'success-rate',
      title: 'Tasa de Éxito',
      value: operational.projectSuccessRate,
      icon: <CheckCircle />,
      severity: operational.projectSuccessRate >= 80 ? 'success' : operational.projectSuccessRate >= 60 ? 'warning' : 'error',
      trend: 0,
      description: 'Porcentaje de proyectos completados',
      suffix: '%'
    },
    {
      id: 'pending-payments',
      title: 'Pagos Pendientes',
      value: financial.pagosPendientes,
      icon: <Warning />,
      severity: financial.pagosPendientes <= 5 ? 'success' : financial.pagosPendientes <= 10 ? 'warning' : 'error',
      trend: 0,
      description: 'Cuentas por pagar pendientes'
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
        📊 Métricas Avanzadas
      </Typography>

      <Grid container spacing={3}>
        {metrics.map((metric, index) => (
          <Grid item xs={12} sm={6} md={4} key={metric.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <MetricCard severity={metric.severity} onClick={metric.action}>
                <CardContent sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ 
                      p: 1.5, 
                      borderRadius: 2, 
                      bgcolor: 'rgba(0,0,0,0.05)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center'
                    }}>
                      {metric.icon}
                    </Box>
                    {metric.trend !== undefined && metric.trend !== 0 && (
                      <TrendIndicator value={metric.trend} />
                    )}
                  </Box>

                  <Typography variant="h6" gutterBottom fontWeight="600" color="text.primary">
                    {metric.title}
                  </Typography>

                  <Box sx={{ mb: 1 }}>
                    <AnimatedNumber 
                      value={metric.value} 
                      prefix={metric.prefix || ''}
                      suffix={metric.suffix || ''}
                    />
                  </Box>

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {metric.description}
                  </Typography>

                  {metric.id === 'liquidity-ratio' && (
                    <Box sx={{ mt: 2 }}>
                      <LinearProgress
                        variant="determinate"
                        value={Math.min(metric.value * 50, 100)}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          backgroundColor: 'rgba(0,0,0,0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 4,
                            backgroundColor: metric.severity === 'success' ? '#059669' : 
                                           metric.severity === 'warning' ? '#d97706' : '#dc2626'
                          }
                        }}
                      />
                    </Box>
                  )}

                  {metric.id === 'success-rate' && (
                    <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
                      <CircularMetric
                        value={metric.value}
                        max={100}
                        label="Completados"
                        color={metric.severity === 'success' ? '#059669' : 
                               metric.severity === 'warning' ? '#d97706' : '#dc2626'}
                      />
                    </Box>
                  )}

                  {(metric.severity === 'error' || metric.severity === 'warning') && (
                    <Box sx={{ mt: 2 }}>
                      <Chip
                        label={
                          metric.severity === 'error' ? 'Requiere Atención' : 'Monitorear'
                        }
                        size="small"
                        color={metric.severity === 'error' ? 'error' : 'warning'}
                        variant="outlined"
                      />
                    </Box>
                  )}
                </CardContent>
              </MetricCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default AdvancedMetrics;