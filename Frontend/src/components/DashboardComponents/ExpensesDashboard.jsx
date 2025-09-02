// components/DashboardComponents/ExpensesDashboard.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  LinearProgress,
  Paper,
  Alert,
  AlertTitle,
  ToggleButton,
  ToggleButtonGroup,
  IconButton,
  Tooltip
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AccountBalance,
  CreditCard,
  ShoppingCart,
  Business,
  Build,
  Group,
  Warning,
  CheckCircle,
  Error,
  Timeline,
  PieChart,
  BarChart
} from '@mui/icons-material';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  BarChart as RechartsBarChart,
  Bar,
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ComposedChart,
  TreemapChart,
  Treemap
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const ExpenseCard = styled(Card)(({ theme, severity = 'normal' }) => {
  const severityColors = {
    normal: { bg: '#f8fafc', border: '#e2e8f0', accent: '#64748b' },
    warning: { bg: '#fefce8', border: '#eab308', accent: '#ca8a04' },
    critical: { bg: '#fef2f2', border: '#ef4444', accent: '#dc2626' },
    success: { bg: '#f0fdf4', border: '#22c55e', accent: '#16a34a' }
  };

  const colors = severityColors[severity];

  return {
    background: colors.bg,
    border: `2px solid ${colors.border}`,
    borderRadius: 16,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: `0 8px 25px ${colors.accent}30`
    },
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      height: 4,
      background: colors.accent,
      borderRadius: '14px 14px 0 0'
    }
  };
});

const ExpenseMetric = ({ title, value, budget, category, icon, color = '#ef4444' }) => {
  const percentage = budget > 0 ? (value / budget) * 100 : 0;
  const isOverBudget = percentage > 100;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <ExpenseCard severity={isOverBudget ? 'critical' : percentage > 80 ? 'warning' : 'normal'}>
        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
            <Avatar sx={{ bgcolor: color, width: 48, height: 48 }}>
              {icon}
            </Avatar>
            <Box sx={{ textAlign: 'right' }}>
              <Typography variant="h5" fontWeight="bold" color={color}>
                ${value?.toLocaleString()}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                de ${budget?.toLocaleString()}
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="h6" fontWeight="600" mb={2}>
            {title}
          </Typography>
          
          <Box sx={{ mb: 1 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Progreso del Presupuesto
              </Typography>
              <Typography variant="body2" fontWeight="bold" color={isOverBudget ? '#ef4444' : color}>
                {percentage.toFixed(1)}%
              </Typography>
            </Box>
            <LinearProgress
              variant="determinate"
              value={Math.min(percentage, 100)}
              sx={{
                height: 8,
                borderRadius: 4,
                backgroundColor: `${color}20`,
                '& .MuiLinearProgress-bar': {
                  backgroundColor: isOverBudget ? '#ef4444' : color,
                  borderRadius: 4
                }
              }}
            />
            {isOverBudget && (
              <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                Presupuesto excedido por ${(value - budget).toLocaleString()}
              </Typography>
            )}
          </Box>
        </CardContent>
      </ExpenseCard>
    </motion.div>
  );
};

const ExpenseTrend = ({ data, type = 'area' }) => {
  const chartData = data?.slice(-6) || [
    { month: 'May', expenses: 82000, budget: 85000 },
    { month: 'Jun', expenses: 78000, budget: 85000 },
    { month: 'Jul', expenses: 85000, budget: 85000 },
    { month: 'Ago', expenses: 92000, budget: 85000 },
    { month: 'Sep', expenses: 88000, budget: 85000 },
    { month: 'Oct', expenses: 95000, budget: 85000 }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          📈 Tendencia de Gastos vs Presupuesto
        </Typography>
        
        <ResponsiveContainer width="100%" height={350}>
          <ComposedChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <RechartsTooltip 
              contentStyle={{
                backgroundColor: 'rgba(255,255,255,0.95)',
                border: 'none',
                borderRadius: 8,
                boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
              }}
            />
            <Legend />
            
            <Bar dataKey="budget" name="Presupuesto" fill="#94a3b8" opacity={0.7} />
            <Area
              type="monotone"
              dataKey="expenses"
              stroke="#ef4444"
              fill="url(#colorExpenses)"
              strokeWidth={3}
              name="Gastos Reales"
            />
            
            <defs>
              <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </ComposedChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

const ExpenseBreakdown = ({ data }) => {
  const expenseData = [
    { category: 'Operaciones', amount: 35000, budget: 40000, color: '#ef4444' },
    { category: 'Marketing', amount: 18000, budget: 20000, color: '#f59e0b' },
    { category: 'Tecnología', amount: 25000, budget: 22000, color: '#3b82f6' },
    { category: 'RRHH', amount: 42000, budget: 45000, color: '#10b981' },
    { category: 'Administración', amount: 15000, budget: 18000, color: '#8b5cf6' },
    { category: 'Viajes', amount: 8000, budget: 10000, color: '#f97316' }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          📊 Desglose de Gastos por Categoría
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <ResponsiveContainer width="100%" height={250}>
              <RechartsPieChart>
                <Pie
                  data={expenseData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="amount"
                >
                  {expenseData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip />
              </RechartsPieChart>
            </ResponsiveContainer>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <List>
              {expenseData.map((category, index) => (
                <ListItem key={index} sx={{ px: 0, py: 1 }}>
                  <ListItemAvatar>
                    <Box
                      sx={{
                        width: 16,
                        height: 16,
                        borderRadius: '50%',
                        backgroundColor: category.color
                      }}
                    />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Typography variant="body2" fontWeight="600">
                          {category.category}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ${category.amount.toLocaleString()} / ${category.budget.toLocaleString()}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <LinearProgress
                        variant="determinate"
                        value={(category.amount / category.budget) * 100}
                        sx={{
                          mt: 1,
                          height: 4,
                          borderRadius: 2,
                          backgroundColor: `${category.color}20`,
                          '& .MuiLinearProgress-bar': {
                            backgroundColor: category.color
                          }
                        }}
                      />
                    }
                  />
                </ListItem>
              ))}
            </List>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );
};

const ExpenseAlerts = ({ alerts = [] }) => {
  const mockAlerts = [
    {
      id: 1,
      type: 'budget_exceeded',
      category: 'Tecnología',
      severity: 'error',
      message: 'Presupuesto de Tecnología excedido en $3,000',
      amount: 25000,
      budget: 22000
    },
    {
      id: 2,
      type: 'budget_warning',
      category: 'RRHH',
      severity: 'warning',
      message: 'RRHH está al 93% del presupuesto mensual',
      amount: 42000,
      budget: 45000
    },
    {
      id: 3,
      type: 'unusual_expense',
      category: 'Operaciones',
      severity: 'warning',
      message: 'Gasto inusual detectado en Operaciones',
      amount: 8500
    }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          ⚠️ Alertas de Gastos
        </Typography>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {mockAlerts.map((alert, index) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Alert 
                severity={alert.severity}
                sx={{ 
                  borderRadius: 2,
                  '& .MuiAlert-message': { width: '100%' }
                }}
                icon={alert.severity === 'error' ? <Error /> : <Warning />}
              >
                <AlertTitle sx={{ fontWeight: 'bold' }}>
                  {alert.category}
                </AlertTitle>
                <Typography variant="body2" mb={1}>
                  {alert.message}
                </Typography>
                {alert.budget && (
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                    <Chip 
                      label={`Gastado: $${alert.amount.toLocaleString()}`}
                      size="small"
                      color={alert.severity === 'error' ? 'error' : 'warning'}
                      variant="outlined"
                    />
                    <Chip 
                      label={`Presupuesto: $${alert.budget.toLocaleString()}`}
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                )}
              </Alert>
            </motion.div>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
};

const TopExpenses = ({ expenses = [] }) => {
  const mockExpenses = [
    { description: 'Licencias de Software', amount: 12000, category: 'Tecnología', date: '2024-10-01' },
    { description: 'Salarios del Equipo', amount: 38000, category: 'RRHH', date: '2024-10-01' },
    { description: 'Campañas Publicitarias', amount: 8500, category: 'Marketing', date: '2024-10-02' },
    { description: 'Servicios de Hosting', amount: 3200, category: 'Tecnología', date: '2024-10-03' },
    { description: 'Suministros de Oficina', amount: 1800, category: 'Administración', date: '2024-10-03' },
    { description: 'Capacitación del Personal', amount: 4500, category: 'RRHH', date: '2024-10-04' }
  ];

  return (
    <Card sx={{ borderRadius: 3, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={3}>
          💸 Principales Gastos del Mes
        </Typography>
        
        <List>
          {mockExpenses.map((expense, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <ListItem
                sx={{
                  mb: 1,
                  p: 2,
                  borderRadius: 2,
                  backgroundColor: 'rgba(239, 68, 68, 0.04)',
                  border: '1px solid rgba(239, 68, 68, 0.1)',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(239, 68, 68, 0.08)',
                    transform: 'translateX(4px)'
                  }
                }}
              >
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Typography variant="body1" fontWeight="bold">
                        {expense.description}
                      </Typography>
                      <Typography variant="h6" fontWeight="bold" color="error">
                        -${expense.amount.toLocaleString()}
                      </Typography>
                    </Box>
                  }
                  secondary={
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
                      <Chip 
                        label={expense.category}
                        size="small"
                        variant="outlined"
                        sx={{ height: 20 }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {new Date(expense.date).toLocaleDateString()}
                      </Typography>
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

const ExpensesDashboard = ({ kpis, financialData }) => {
  const [chartType, setChartType] = useState('area');

  const expenseMetrics = {
    totalExpenses: 143000,
    totalBudget: 160000,
    categories: {
      operations: { spent: 35000, budget: 40000 },
      marketing: { spent: 18000, budget: 20000 },
      technology: { spent: 25000, budget: 22000 },
      hr: { spent: 42000, budget: 45000 },
      admin: { spent: 15000, budget: 18000 },
      travel: { spent: 8000, budget: 10000 }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold" mb={4}>
        💳 Dashboard de Gastos
      </Typography>

      {/* Métricas de gastos por categoría */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6} md={4}>
          <ExpenseMetric
            title="Operaciones"
            value={expenseMetrics.categories.operations.spent}
            budget={expenseMetrics.categories.operations.budget}
            icon={<Business />}
            color="#ef4444"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ExpenseMetric
            title="Marketing"
            value={expenseMetrics.categories.marketing.spent}
            budget={expenseMetrics.categories.marketing.budget}
            icon={<ShoppingCart />}
            color="#f59e0b"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ExpenseMetric
            title="Tecnología"
            value={expenseMetrics.categories.technology.spent}
            budget={expenseMetrics.categories.technology.budget}
            icon={<Build />}
            color="#3b82f6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ExpenseMetric
            title="Recursos Humanos"
            value={expenseMetrics.categories.hr.spent}
            budget={expenseMetrics.categories.hr.budget}
            icon={<Group />}
            color="#10b981"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ExpenseMetric
            title="Administración"
            value={expenseMetrics.categories.admin.spent}
            budget={expenseMetrics.categories.admin.budget}
            icon={<AccountBalance />}
            color="#8b5cf6"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={4}>
          <ExpenseMetric
            title="Viajes"
            value={expenseMetrics.categories.travel.spent}
            budget={expenseMetrics.categories.travel.budget}
            icon={<CreditCard />}
            color="#f97316"
          />
        </Grid>
      </Grid>

      {/* Gráfico de tendencias */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <ExpenseTrend type={chartType} />
          </motion.div>
        </Grid>
      </Grid>

      {/* Desglose y análisis */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} lg={8}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <ExpenseBreakdown />
          </motion.div>
        </Grid>
        <Grid item xs={12} lg={4}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <ExpenseAlerts />
          </motion.div>
        </Grid>
      </Grid>

      {/* Principales gastos */}
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <TopExpenses />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ExpensesDashboard;