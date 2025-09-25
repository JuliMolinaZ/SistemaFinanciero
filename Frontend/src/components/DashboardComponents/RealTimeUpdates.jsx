// components/DashboardComponents/RealTimeUpdates.jsx
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Chip,
  Badge,
  IconButton,
  Collapse,
  Alert,
  AlertTitle,
  Skeleton
} from '@mui/material';
import {
  NotificationsActive,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  Assignment,
  Person,
  Business,
  Warning,
  CheckCircle,
  Error,
  Info,
  ExpandMore,
  ExpandLess,
  Refresh
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

const ActivityCard = styled(Card)(({ theme, priority = 'low' }) => {
  const priorityColors = {
    high: { bg: '#fef2f2', border: '#ef4444', text: '#7f1d1d' },
    medium: { bg: '#fefce8', border: '#eab308', text: '#713f12' },
    low: { bg: '#f0f9ff', border: '#0ea5e9', text: '#0c4a6e' }
  };

  const color = priorityColors[priority];

  return {
    background: color.bg,
    border: `1px solid ${color.border}`,
    borderRadius: 12,
    marginBottom: theme.spacing(1),
    transition: 'all 0.3s ease',
    '&:hover': {
      transform: 'translateX(4px)',
      boxShadow: `0 4px 12px ${color.border}20`
    }
  };
});

const PulsingDot = styled(Box)(({ theme, color = '#10b981' }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: color,
  animation: 'pulse 2s infinite',
  '@keyframes pulse': {
    '0%': {
      boxShadow: `0 0 0 0 ${color}40`
    },
    '70%': {
      boxShadow: `0 0 0 6px ${color}00`
    },
    '100%': {
      boxShadow: `0 0 0 0 ${color}00`
    }
  }
}));

const RealTimeMetric = ({ label, value, change, icon, color = '#0ea5e9' }) => {
  return (
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          p: 2,
          borderRadius: 2,
          backgroundColor: 'rgba(255,255,255,0.8)',
          border: `1px solid ${color}30`,
          mb: 1
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: color, width: 32, height: 32 }}>
            {icon}
          </Avatar>
          <Box>
            <Typography variant="body2" color="text.secondary">
              {label}
            </Typography>
            <Typography variant="h6" fontWeight="bold">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </Typography>
          </Box>
        </Box>
        {change && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PulsingDot color={change > 0 ? '#10b981' : '#ef4444'} />
            <Typography
              variant="body2"
              sx={{
                color: change > 0 ? '#10b981' : '#ef4444',
                fontWeight: 600
              }}
            >
              {change > 0 ? '+' : ''}{change}%
            </Typography>
          </Box>
        )}
      </Box>
    </motion.div>
  );
};

const ActivityFeed = ({ activities, maxItems = 10 }) => {
  const [expanded, setExpanded] = useState(false);
  const displayedActivities = expanded ? activities : activities.slice(0, maxItems);

  const getActivityIcon = (type) => {
    const iconMap = {
      payment: <AttachMoney />,
      project: <Assignment />,
      user: <Person />,
      client: <Business />,
      warning: <Warning />,
      success: <CheckCircle />,
      error: <Error />,
      info: <Info />
    };
    return iconMap[type] || <Info />;
  };

  const getActivityColor = (priority) => {
    const colorMap = {
      high: '#ef4444',
      medium: '#eab308',
      low: '#64748b'
    };
    return colorMap[priority] || '#64748b';
  };

  const formatTimeAgo = (timestamp) => {
    const now = new Date();
    const time = new Date(timestamp);
    const diffInMinutes = Math.floor((now - time) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Ahora';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" fontWeight="bold">
            🔥 Actividad en Tiempo Real
          </Typography>
          <Badge badgeContent={activities.length} color="error">
            <NotificationsActive color="action" />
          </Badge>
        </Box>

        <AnimatePresence>
          {displayedActivities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.1 }}
            >
              <ActivityCard priority={activity.priority}>
                <ListItem sx={{ py: 1.5 }}>
                  <ListItemAvatar>
                    <Avatar
                      sx={{
                        bgcolor: getActivityColor(activity.priority),
                        width: 36,
                        height: 36
                      }}
                    >
                      {getActivityIcon(activity.type)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Typography variant="body2" fontWeight="600">
                        {activity.title}
                      </Typography>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          {activity.description}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Chip
                            label={formatTimeAgo(activity.timestamp)}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.7rem', height: 20 }}
                          />
                          {activity.amount && (
                            <Chip
                              label={`$${activity.amount.toLocaleString()}`}
                              size="small"
                              color="primary"
                              sx={{ fontSize: '0.7rem', height: 20 }}
                            />
                          )}
                        </Box>
                      </Box>
                    }
                  />
                </ListItem>
              </ActivityCard>
            </motion.div>
          ))}
        </AnimatePresence>

        {activities.length > maxItems && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <IconButton onClick={() => setExpanded(!expanded)}>
              {expanded ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};

const AlertsPanel = ({ alerts }) => {
  const [openAlerts, setOpenAlerts] = useState({});

  const toggleAlert = (id) => {
    setOpenAlerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const getSeverityIcon = (severity) => {
    const iconMap = {
      error: <Error />,
      warning: <Warning />,
      info: <Info />,
      success: <CheckCircle />
    };
    return iconMap[severity] || <Info />;
  };

  return (
    <Card sx={{ borderRadius: 2, height: '100%' }}>
      <CardContent sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight="bold" mb={2}>
          ⚠️ Alertas del Sistema
        </Typography>

        {alerts.map((alert, index) => (
          <motion.div
            key={alert.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Alert
              severity={alert.severity}
              icon={getSeverityIcon(alert.severity)}
              sx={{
                mb: 2,
                borderRadius: 2,
                '& .MuiAlert-message': {
                  width: '100%'
                }
              }}
              action={
                alert.details && (
                  <IconButton
                    size="small"
                    onClick={() => toggleAlert(alert.id)}
                  >
                    {openAlerts[alert.id] ? <ExpandLess /> : <ExpandMore />}
                  </IconButton>
                )
              }
            >
              <AlertTitle>{alert.title}</AlertTitle>
              {alert.message}
              
              <Collapse in={openAlerts[alert.id]}>
                <Box sx={{ mt: 2, p: 2, bgcolor: 'rgba(0,0,0,0.04)', borderRadius: 1 }}>
                  <Typography variant="body2">
                    {alert.details}
                  </Typography>
                  {alert.actions && (
                    <Box sx={{ mt: 1 }}>
                      {alert.actions.map((action, idx) => (
                        <Chip
                          key={idx}
                          label={action.label}
                          size="small"
                          clickable
                          onClick={action.onClick}
                          sx={{ mr: 1, mt: 1 }}
                        />
                      ))}
                    </Box>
                  )}
                </Box>
              </Collapse>
            </Alert>
          </motion.div>
        ))}
      </CardContent>
    </Card>
  );
};

const RealTimeUpdates = ({ kpis, onRefresh }) => {
  const [activities, setActivities] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Simular datos de actividades en tiempo real
  useEffect(() => {
    const mockActivities = [
      {
        id: 1,
        type: 'payment',
        title: 'Pago Recibido',
        description: 'Cliente ABC Corp - Proyecto Website',
        amount: 15000,
        priority: 'high',
        timestamp: new Date(Date.now() - 5 * 60000)
      },
      {
        id: 2,
        type: 'project',
        title: 'Proyecto Actualizado',
        description: 'Mobile App - Fase de Testing',
        priority: 'medium',
        timestamp: new Date(Date.now() - 15 * 60000)
      },
      {
        id: 3,
        type: 'user',
        title: 'Nuevo Usuario',
        description: 'María García se unió al equipo',
        priority: 'low',
        timestamp: new Date(Date.now() - 30 * 60000)
      },
      {
        id: 4,
        type: 'warning',
        title: 'Pago Vencido',
        description: 'Factura #1234 - Cliente XYZ Ltd',
        amount: 8500,
        priority: 'high',
        timestamp: new Date(Date.now() - 45 * 60000)
      },
      {
        id: 5,
        type: 'success',
        title: 'Proyecto Completado',
        description: 'E-commerce Platform - Entregado',
        amount: 25000,
        priority: 'medium',
        timestamp: new Date(Date.now() - 60 * 60000)
      }
    ];

    const mockAlerts = [
      {
        id: 1,
        severity: 'warning',
        title: 'Flujo de Efectivo Bajo',
        message: 'El flujo de efectivo ha disminuido un 15% esta semana.',
        details: 'Se recomienda revisar las cuentas por cobrar pendientes y acelerar los pagos de clientes.',
        actions: [
        ]
      },
      {
        id: 2,
        severity: 'error',
        title: 'Pagos Vencidos',
        message: '5 facturas han superado su fecha de vencimiento.',
        details: 'Total adeudado: $47,500. Clientes: ABC Corp ($15,000), XYZ Ltd ($12,500), DEF Inc ($8,000), GHI LLC ($7,000), JKL Co ($5,000).',
        actions: [
        ]
      },
      {
        id: 3,
        severity: 'info',
        title: 'Nuevo Período Fiscal',
        message: 'El nuevo período fiscal comenzará en 15 días.',
        details: 'Prepare los informes de cierre y revise las proyecciones para el próximo período.'
      }
    ];

    setActivities(mockActivities);
    setAlerts(mockAlerts);
    setLoading(false);
  }, []);

  // Métricas en tiempo real
  const realTimeMetrics = kpis ? [
    {
      label: 'Ingresos del Día',
      value: 12500,
      change: 8.5,
      icon: <AttachMoney fontSize="small" />,
      color: '#10b981'
    },
    {
      label: 'Proyectos Activos',
      value: kpis.operational?.activeProjects || 0,
      change: 2,
      icon: <Assignment fontSize="small" />,
      color: '#3b82f6'
    },
    {
      label: 'Pagos Pendientes',
      value: kpis.financial?.pagosPendientes || 0,
      change: -5.2,
      icon: <Warning fontSize="small" />,
      color: '#f59e0b'
    },
    {
      label: 'Nuevos Clientes',
      value: 3,
      change: 12,
      icon: <Person fontSize="small" />,
      color: '#8b5cf6'
    }
  ] : [];

  if (loading) {
    return (
      <Box sx={{ p: 2 }}>
        <Skeleton variant="rectangular" height={200} sx={{ borderRadius: 2, mb: 2 }} />
        <Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 2, height: '100%' }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
        ⚡ Actualizaciones en Tiempo Real
      </Typography>

      {/* Métricas en tiempo real */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="h6" gutterBottom fontWeight="bold" mb={2}>
          📊 Métricas del Día
        </Typography>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {realTimeMetrics.map((metric, index) => (
            <RealTimeMetric key={index} {...metric} />
          ))}
        </motion.div>
      </Box>

      {/* Feed de actividades y alertas */}
      <Box sx={{ display: 'flex', gap: 3, height: 'calc(100% - 300px)' }}>
        <Box sx={{ flex: 1 }}>
          <ActivityFeed activities={activities} />
        </Box>
        <Box sx={{ flex: 1 }}>
          <AlertsPanel alerts={alerts} />
        </Box>
      </Box>
    </Box>
  );
};

export default RealTimeUpdates;