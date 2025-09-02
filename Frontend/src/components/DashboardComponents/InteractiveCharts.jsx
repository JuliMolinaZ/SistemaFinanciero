// components/DashboardComponents/InteractiveCharts.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  IconButton,
  Tooltip,
  Menu,
  MenuItem,
  Button
} from '@mui/material';
import {
  FullscreenRounded,
  GetAppRounded,
  FilterListRounded,
  RefreshRounded,
  MoreVertRounded
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Treemap,
  Funnel,
  FunnelChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Paleta de colores profesional
const COLORS = {
  primary: ['#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6', '#a855f7', '#d946ef'],
  success: ['#10b981', '#059669', '#047857', '#065f46'],
  warning: ['#f59e0b', '#d97706', '#b45309', '#92400e'],
  error: ['#ef4444', '#dc2626', '#b91c1c', '#991b1b'],
  neutral: ['#64748b', '#475569', '#334155', '#1e293b'],
  gradient: {
    blue: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    green: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    purple: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    orange: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)'
  }
};

const ChartCard = styled(Card)(({ theme }) => ({
  borderRadius: 16,
  boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&:hover': {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)'
  }
}));

const CustomTooltip = ({ active, payload, label, type = 'currency' }) => {
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          backgroundColor: 'rgba(255,255,255,0.95)',
          border: '1px solid #e2e8f0',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <Typography variant="body2" fontWeight="bold" mb={1}>
          {label}
        </Typography>
        {payload.map((entry, index) => (
          <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                backgroundColor: entry.color
              }}
            />
            <Typography variant="body2">
              {entry.name}: {type === 'currency' ? '$' : ''}{entry.value.toLocaleString()}{type === 'percentage' ? '%' : ''}
            </Typography>
          </Box>
        ))}
      </Box>
    );
  }
  return null;
};

// Gráfico de Flujo de Efectivo Avanzado
const CashFlowChart = ({ data, period = '6months' }) => {
  const processedData = data.slice(-6).map((item, index) => ({
    ...item,
    netFlow: item.revenue - item.expenses,
    cumulativeFlow: data.slice(0, index + 1).reduce((sum, d) => sum + (d.revenue - d.expenses), 0)
  }));

  return (
    <ChartCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            💰 Flujo de Efectivo
          </Typography>
          <Chip label="Últimos 6 meses" size="small" color="primary" />
        </Box>
        
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={processedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="month" 
              tick={{ fontSize: 12 }}
              stroke="#64748b"
            />
            <YAxis tick={{ fontSize: 12 }} stroke="#64748b" />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            
            <Bar dataKey="revenue" name="Ingresos" fill={COLORS.primary[1]} radius={[4, 4, 0, 0]} />
            <Bar dataKey="expenses" name="Gastos" fill={COLORS.error[0]} radius={[4, 4, 0, 0]} />
            <Line 
              type="monotone" 
              dataKey="cumulativeFlow" 
              stroke={COLORS.success[0]} 
              strokeWidth={3}
              name="Flujo Acumulado"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </ChartCard>
  );
};

// Distribución de Gastos con Treemap
const ExpenseDistribution = ({ data }) => {
  const treemapData = data.map((item, index) => ({
    name: item.category,
    size: item.amount,
    color: COLORS.primary[index % COLORS.primary.length]
  }));

  return (
    <ChartCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          📊 Distribución de Gastos
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <Treemap
            data={treemapData}
            dataKey="size"
            ratio={4/3}
            stroke="#fff"
            strokeWidth={2}
            content={({ payload, x, y, width, height }) => {
              if (payload && width > 50 && height > 30) {
                return (
                  <g>
                    <rect
                      x={x}
                      y={y}
                      width={width}
                      height={height}
                      fill={payload.color}
                      opacity={0.8}
                      rx={4}
                    />
                    <text
                      x={x + width / 2}
                      y={y + height / 2}
                      textAnchor="middle"
                      fill="white"
                      fontSize={12}
                      fontWeight="bold"
                    >
                      {payload.name}
                    </text>
                    <text
                      x={x + width / 2}
                      y={y + height / 2 + 16}
                      textAnchor="middle"
                      fill="white"
                      fontSize={10}
                    >
                      ${payload.size?.toLocaleString()}
                    </text>
                  </g>
                );
              }
              return null;
            }}
          />
        </ResponsiveContainer>
      </CardContent>
    </ChartCard>
  );
};

// Gráfico Radar de Performance
const PerformanceRadar = ({ data }) => {
  const radarData = [
    { subject: 'Liquidez', A: data.liquidity || 0, fullMark: 100 },
    { subject: 'Rentabilidad', A: data.profitability || 0, fullMark: 100 },
    { subject: 'Eficiencia', A: data.efficiency || 0, fullMark: 100 },
    { subject: 'Crecimiento', A: data.growth || 0, fullMark: 100 },
    { subject: 'Estabilidad', A: data.stability || 0, fullMark: 100 },
    { subject: 'Proyectos', A: data.projects || 0, fullMark: 100 }
  ];

  return (
    <ChartCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🎯 Performance General
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={radarData}>
            <PolarGrid gridType="polygon" />
            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
            <PolarRadiusAxis 
              angle={90} 
              domain={[0, 100]} 
              tick={{ fontSize: 10 }}
              tickCount={5}
            />
            <Radar
              name="Performance"
              dataKey="A"
              stroke={COLORS.primary[0]}
              fill={COLORS.primary[0]}
              fillOpacity={0.3}
              strokeWidth={2}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </ChartCard>
  );
};

// Embudo de Conversión de Proyectos
const ProjectFunnel = ({ data }) => {
  const funnelData = [
    { name: 'Leads', value: data.leads || 0, fill: COLORS.primary[0] },
    { name: 'Propuestas', value: data.proposals || 0, fill: COLORS.primary[1] },
    { name: 'Negociación', value: data.negotiations || 0, fill: COLORS.primary[2] },
    { name: 'Cerrados', value: data.closed || 0, fill: COLORS.success[0] }
  ];

  return (
    <ChartCard>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🚀 Embudo de Proyectos
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <FunnelChart>
            <RechartsTooltip content={<CustomTooltip type="number" />} />
            <Funnel
              dataKey="value"
              data={funnelData}
              isAnimationActive
              labelLine={false}
              label={({ name, value }) => `${name}: ${value}`}
            />
          </FunnelChart>
        </ResponsiveContainer>
      </CardContent>
    </ChartCard>
  );
};

// Gráfico de Tendencias Predictivas
const PredictiveTrends = ({ historicalData, predictions }) => {
  const [viewMode, setViewMode] = useState('combined');
  
  const combinedData = [...historicalData, ...predictions.map(p => ({ ...p, isPrediction: true }))];

  return (
    <ChartCard>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h6" fontWeight="bold">
            🔮 Análisis Predictivo
          </Typography>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={(e, newMode) => newMode && setViewMode(newMode)}
            size="small"
          >
            <ToggleButton value="historical">Histórico</ToggleButton>
            <ToggleButton value="combined">Combinado</ToggleButton>
            <ToggleButton value="prediction">Predicción</ToggleButton>
          </ToggleButtonGroup>
        </Box>
        
        <ResponsiveContainer width="100%" height={350}>
          <AreaChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="period" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <RechartsTooltip content={<CustomTooltip />} />
            <Legend />
            
            <Area
              type="monotone"
              dataKey="revenue"
              stackId="1"
              stroke={COLORS.primary[0]}
              fill={COLORS.primary[0]}
              fillOpacity={0.6}
              name="Ingresos"
            />
            <Area
              type="monotone"
              dataKey="predictedRevenue"
              stackId="2"
              stroke={COLORS.warning[0]}
              fill={COLORS.warning[0]}
              fillOpacity={0.4}
              strokeDasharray="5 5"
              name="Ingresos Predichos"
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </ChartCard>
  );
};

const InteractiveCharts = ({ kpis, financialData }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedChart, setSelectedChart] = useState(null);

  if (!kpis || !financialData) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Cargando gráficos...</Typography>
      </Box>
    );
  }

  // Datos de ejemplo para demostración
  const mockExpenseData = [
    { category: 'Operaciones', amount: 45000 },
    { category: 'Marketing', amount: 25000 },
    { category: 'Tecnología', amount: 30000 },
    { category: 'Recursos Humanos', amount: 55000 },
    { category: 'Administración', amount: 20000 }
  ];

  const mockPerformanceData = {
    liquidity: 85,
    profitability: 72,
    efficiency: 68,
    growth: 78,
    stability: 82,
    projects: 75
  };

  const mockFunnelData = {
    leads: 150,
    proposals: 89,
    negotiations: 45,
    closed: 23
  };

  const mockPredictions = [
    { period: 'Oct 2024', predictedRevenue: 85000 },
    { period: 'Nov 2024', predictedRevenue: 92000 },
    { period: 'Dic 2024', predictedRevenue: 105000 }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
        📈 Gráficos Interactivos Avanzados
      </Typography>

      <Grid container spacing={3}>
        {/* Flujo de Efectivo */}
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <CashFlowChart data={kpis.trends.last6Months} />
          </motion.div>
        </Grid>

        {/* Performance Radar */}
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <PerformanceRadar data={mockPerformanceData} />
          </motion.div>
        </Grid>

        {/* Distribución de Gastos */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ExpenseDistribution data={mockExpenseData} />
          </motion.div>
        </Grid>

        {/* Embudo de Proyectos */}
        <Grid item xs={12} md={6}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ProjectFunnel data={mockFunnelData} />
          </motion.div>
        </Grid>

        {/* Análisis Predictivo */}
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <PredictiveTrends 
              historicalData={kpis.trends.last6Months} 
              predictions={mockPredictions} 
            />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default InteractiveCharts;