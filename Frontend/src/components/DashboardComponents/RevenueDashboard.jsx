// components/DashboardComponents/RevenueDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Tabs,
  Tab,
  Paper,
  LinearProgress,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ToggleButton,
  ToggleButtonGroup
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assessment,
  Timeline,
  PieChart,
  BarChart,
  Business,
  AccountBalance,
  MonetizationOn
} from '@mui/icons-material';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const GradientCard = styled(Card)(({ theme, gradient = 'primary' }) => {
  const gradients = {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    success: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
    warning: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  };

  return {
    background: gradients[gradient],
    borderRadius: 16,
    color: 'white',
    boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    '&:hover': {
      transform: 'translateY(-4px)',
      boxShadow: '0 12px 48px rgba(0,0,0,0.18)'
    }
  };
});

const MetricCard = ({ title, value, change, icon, color = '#0ea5e9', format = 'currency' }) => {
  const formatValue = (val) => {
    if (format === 'currency') return `$${val?.toLocaleString()}`;
    if (format === 'percentage') return `${val}%`;
    return val?.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ 
        borderRadius: 3, 
        background: 'linear-gradient(145deg, #ffffff 0%, #f8fafc 100%)',
        border: `2px solid ${color}20`,
        transition: 'all 0.3s ease',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: `0 8px 25px ${color}30`
        }
      }}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
              {icon}
            </Avatar>
            {change && (
              <Chip
                label={`${change > 0 ? '+' : ''}${change}%`}
                color={change > 0 ? 'success' : 'error'}
                size="small"
                icon={change > 0 ? <TrendingUp fontSize="small" /> : <TrendingDown fontSize="small" />}
              />
            )}
          </Box>
          <Typography variant="h4" fontWeight="bold" color={color} mb={1}>
            {formatValue(value)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const RevenueChart = ({ data, type = 'area', period = '6months' }) => {
  const chartData = data?.slice(-6) || [];

  const ChartComponent = type === 'bar' ? RechartsBarChart : AreaChart;
  const DataComponent = type === 'bar' ? Bar : Area;

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          📈 Tendencia de Ingresos - {period === '6months' ? 'Últimos 6 meses' : 'Este año'}
        </Typography>
        
        <ResponsiveContainer width="100%" height={350}>
          <ChartComponent data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            
            {type === 'bar' ? (
              <Bar dataKey="revenue" name="Ingresos" fill="#667eea" radius={[4, 4, 0, 0]} />
            ) : (
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#667eea"
                fill="url(#colorRevenue)"
                strokeWidth={3}
                name="Ingresos"
              />
            )}
            
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#667eea" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#667eea" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </ChartComponent>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const RevenueBySource = ({ data }) => {
  const sourceData = [
    { name: 'Proyectos Web', value: 45000, color: '#667eea' },
    { name: 'Aplicaciones Móviles', value: 35000, color: '#764ba2' },
    { name: 'Consultoría', value: 25000, color: '#f093fb' },
    { name: 'Mantenimiento', value: 15000, color: '#11998e' },
    { name: 'Otros Servicios', value: 10000, color: '#f59e0b' }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🎯 Ingresos por Fuente
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={sourceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              {sourceData.map((source, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemAvatar>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: source.color
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={source.name}
                    secondary={`$${source.value.toLocaleString()}`}
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                  <Box sx={{ minWidth: 80 }}>
                    <LinearProgress
                      variant="determinate"
                      value={(source.value / 130000) * 100}
                      sx={{
                        height: 6,
                        borderRadius: 3,
                        backgroundColor: `${source.color}20`,
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: source.color,
                          borderRadius: 3
                        }
                      }}
                    />
                  </Box>
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const TopClients = ({ clients }) => {
  const topClients = [
    { name: 'TechCorp Solutions', revenue: 45000, projects: 3, growth: 15.2 },
    { name: 'Innovation Labs', revenue: 38000, projects: 2, growth: 8.7 },
    { name: 'Digital Dynamics', revenue: 32000, projects: 4, growth: -2.3 },
    { name: 'Future Systems', revenue: 28000, projects: 2, growth: 12.1 },
    { name: 'Smart Business Co.', revenue: 22000, projects: 1, growth: 5.8 }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🏆 Top Clientes por Ingresos
        </Typography>
        
        <List>
          {topClients.map((client, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  mb: 2,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(102, 126, 234, 0.05)',
                  border: '1px solid rgba(102, 126, 234, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(102, 126, 234, 0.08)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    sx={{
                      bgcolor: '#667eea',
                      width: 48,
                      height: 48,
                      fontSize: '1.2rem',
                      fontWeight: 'bold'
                    }}
                  >
                    {index + 1}
                  </Avatar>
                </ListItemAvatar>
                
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {client.name}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="primary">
                        ${client.revenue.toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {client.projects} proyecto{client.projects > 1 ? 's' : ''}
                      </Typography>
                      <Chip
                        label={`${client.growth > 0 ? '+' : ''}${client.growth}%`}
                        size="small"
                        color={client.growth > 0 ? 'success' : 'error'}
                        variant="outlined"
                        sx={{ height: 20 }}
                      />
                    </Box>
                  }
                />
              </ListItem>
            </motion.div>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

const RevenueProjections = ({ data }) => {
  const projectionData = [
    { month: 'Oct 2024', actual: null, projected: 95000, confidence: 85 },
    { month: 'Nov 2024', actual: null, projected: 105000, confidence: 78 },
    { month: 'Dic 2024', actual: null, projected: 120000, confidence: 72 },
    { month: 'Ene 2025', actual: null, projected: 110000, confidence: 68 },
    { month: 'Feb 2025', actual: null, projected: 115000, confidence: 65 },
    { month: 'Mar 2025', actual: null, projected: 125000, confidence: 62 }
  ];

  const historicalData = data?.slice(-6) || [];
  const combinedData = [...historicalData, ...projectionData];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          🔮 Proyecciones de Ingresos
        </Typography>
        
        <ResponsiveContainer width="100%" height={300}>
          <ComposedChart data={combinedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip />
            <Legend />
            
            <Bar dataKey="revenue" name="Ingresos Reales" fill="#667eea" />
            <Line 
              type="monotone" 
              dataKey="projected" 
              stroke="#f59e0b" 
              strokeWidth={3}
              strokeDasharray="5 5"
              name="Proyectado"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const RevenueDashboard = ({ kpis, financialData }) => {
  const [chartType, setChartType] = useState('area');
  const [period, setPeriod] = useState('6months');

  const revenueMetrics = {
    totalRevenue: kpis?.financial?.totalRevenue || 425000,
    monthlyRevenue: 85000,
    averageProject: 15000,
    revenueGrowth: 12.5,
    monthlyGrowth: 8.3,
    projectGrowth: -2.1
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={4}>
        💰 Dashboard de Ingresos
      </Typography>

      {/* Métricas principales */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Ingresos Totales"
            value={revenueMetrics.totalRevenue}
            change={revenueMetrics.revenueGrowth}
            icon={<MonetizationOn />}
            color="#11998e"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Ingresos Mensuales"
            value={revenueMetrics.monthlyRevenue}
            change={revenueMetrics.monthlyGrowth}
            icon={<Timeline />}
            color="#667eea"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <MetricCard
            title="Promedio por Proyecto"
            value={revenueMetrics.averageProject}
            change={revenueMetrics.projectGrowth}
            icon={<Assessment />}
            color="#f59e0b"
          />
        </Grid>
      </Grid>

      {/* Controles de gráfico */}
      <Box sx={{ mb: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
        <ToggleButtonGroup
          value={chartType}
          exclusive
          onChange={(e, value) => value && setChartType(value)}
          size="small"
        >
          <ToggleButton value="area">
            <Timeline fontSize="small" sx={{ mr: 1 }} />
            Área
          </ToggleButton>
          <ToggleButton value="bar">
            <BarChart fontSize="small" sx={{ mr: 1 }} />
            Barras
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          value={period}
          exclusive
          onChange={(e, value) => value && setPeriod(value)}
          size="small"
        >
          <ToggleButton value="6months">6 Meses</ToggleButton>
          <ToggleButton value="year">Año</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Gráfico principal de tendencias */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <RevenueChart 
              data={kpis?.trends?.last6Months} 
              type={chartType} 
              period={period}
            />
          </motion.div>
        </Grid>
      </Grid>

      {/* Análisis detallado */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <RevenueBySource />
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <TopClients />
          </motion.div>
        </Grid>
      </Grid>

      {/* Proyecciones */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <RevenueProjections data={kpis?.trends?.last6Months} />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default RevenueDashboard;