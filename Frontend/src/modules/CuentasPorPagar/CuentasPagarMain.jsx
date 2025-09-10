import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import {
  Container,
  Paper,
  Tabs,
  Tab,
  Box,
  Typography,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  IconButton,
  Tooltip,
  Fade,
  Button,
  Alert,
  Skeleton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider
} from '@mui/material';
import {
  AccountBalance,
  Add,
  Payment,
  TrendingUp,
  Assignment,
  Star,
  Diamond,
  Rocket,
  CheckCircle,
  Warning,
  Info,
  ErrorOutline,
  Refresh,
  Dashboard,
  Analytics,
  Receipt,
  CalendarToday,
  FileDownload
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Importar componentes
import CuentasPagarForm from './CuentasPagarForm';
import CuentasPagarRegistrationForm from './CuentasPagarRegistrationForm';
import CuentasPagarDashboard from './CuentasPagarDashboard';
import CuentasPagarList from './components/CuentasPagarList';

// ========================================
// COMPONENTES ESTILIZADOS MODERNOS
// ========================================

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `
      radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.2) 0%, transparent 50%),
      url("data:image/svg+xml,%3Csvg width="100" height="100" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.08"%3E%3Cpath d="M50 50c0-27.614-22.386-50-50-50v100c27.614 0 50-22.386 50-50z"/%3E%3Cpath d="M50 50c0 27.614 22.386 50 50 50V0c-27.614 0-50 22.386-50 50z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")
    `,
    pointerEvents: 'none',
    animation: 'float 20s ease-in-out infinite'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: 'radial-gradient(circle, rgba(255,255,255,0.1) 1px, transparent 1px)',
    backgroundSize: '50px 50px',
    animation: 'drift 30s linear infinite',
    pointerEvents: 'none'
  },
  '@keyframes float': {
    '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
    '50%': { transform: 'translateY(-20px) rotate(180deg)' }
  },
  '@keyframes drift': {
    '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
    '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
  }
}));

const StyledCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.95)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  transition: 'all 0.3s ease',
  overflow: 'hidden',
  position: 'relative',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 40px rgba(0,0,0,0.15)'
  }
}));

const StatCard = styled(Card)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}20, ${color}10)`,
  border: `2px solid ${color}40`,
  borderRadius: 20,
  padding: theme.spacing(4),
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  backdropFilter: 'blur(10px)',
  boxShadow: `0 8px 32px ${color}25`,
  '&:hover': {
    transform: 'translateY(-12px) scale(1.02)',
    boxShadow: `0 25px 50px ${color}30`,
    borderColor: `${color}60`,
    '& .stat-icon': {
      transform: 'scale(1.1) rotate(5deg)',
      filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
    },
    '& .stat-number': {
      transform: 'scale(1.05)',
      textShadow: `0 2px 4px ${color}40`
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: '-50%',
    left: '-50%',
    width: '200%',
    height: '200%',
    background: `conic-gradient(from 0deg, transparent, ${color}15, transparent)`,
    animation: 'rotate 4s linear infinite',
    pointerEvents: 'none'
  },
  '&::after': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(135deg, ${color}08, transparent 70%)`,
    pointerEvents: 'none'
  },
  '& .stat-icon': {
    color: color,
    fontSize: '3.5rem',
    marginBottom: theme.spacing(2),
    transition: 'all 0.3s ease',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.1))',
    position: 'relative',
    zIndex: 2
  },
  '& .stat-number': {
    fontSize: '3rem',
    fontWeight: 800,
    color: color,
    marginBottom: theme.spacing(1),
    textShadow: `0 1px 2px ${color}30`,
    transition: 'all 0.3s ease',
    position: 'relative',
    zIndex: 2
  },
  '& .stat-label': {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: '#2c3e50',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    lineHeight: 1.2,
    position: 'relative',
    zIndex: 2
  },
  '& .stat-change': {
    fontSize: '0.9rem',
    fontWeight: 600,
    marginTop: theme.spacing(1),
    position: 'relative',
    zIndex: 2
  },
  '@keyframes rotate': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  }
}));

const ActivityCard = styled(Card)(({ theme }) => ({
  background: 'rgba(255,255,255,0.98)',
  backdropFilter: 'blur(20px)',
  border: '1px solid rgba(255,255,255,0.3)',
  borderRadius: 16,
  boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
  height: '100%'
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: 'rgba(255,255,255,0.1)',
  borderRadius: 16,
  padding: theme.spacing(0.5),
  marginBottom: theme.spacing(3),
  '& .MuiTabs-indicator': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    height: 4,
    borderRadius: 2
  },
  '& .MuiTab-root': {
    textTransform: 'none',
    fontWeight: 600,
    fontSize: '1rem',
    minHeight: 60,
    borderRadius: 12,
    margin: theme.spacing(0, 0.5),
    color: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    '&.Mui-selected': {
      color: '#fff',
      background: 'rgba(255,255,255,0.2)'
    },
    '&:hover': {
      background: 'rgba(255,255,255,0.1)'
    }
  }
}));

const QuickActionButton = styled(Button)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}, ${color}dd)`,
  color: '#fff',
  borderRadius: 16,
  padding: theme.spacing(2.5, 4),
  fontWeight: 800,
  fontSize: '1.1rem',
  textTransform: 'none',
  boxShadow: `0 12px 30px ${color}40`,
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  backdropFilter: 'blur(10px)',
  border: `2px solid ${color}30`,
  '&:hover': {
    transform: 'translateY(-6px) scale(1.05)',
    boxShadow: `0 20px 40px ${color}50`,
    '&::before': {
      opacity: 1,
      transform: 'scale(1)'
    }
  },
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: `linear-gradient(45deg, transparent, rgba(255,255,255,0.2), transparent)`,
    transform: 'scale(0)',
    opacity: 0,
    transition: 'all 0.3s ease'
  },
  '& .MuiButton-startIcon': {
    fontSize: '1.3rem',
    filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))'
  }
}));

// Función helper para calcular tiempo transcurrido
const getTimeAgo = (dateString) => {
  const now = new Date();
  const date = new Date(dateString);
  const diffInMs = now - date;
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
  
  if (diffInMinutes < 60) {
    return diffInMinutes <= 1 ? 'hace 1 min' : `hace ${diffInMinutes} min`;
  } else if (diffInHours < 24) {
    return diffInHours === 1 ? 'hace 1 hora' : `hace ${diffInHours} horas`;
  } else {
    return diffInDays === 1 ? 'hace 1 día' : `hace ${diffInDays} días`;
  }
};

const CuentasPagarMain = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [cuentas, setCuentas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Configuración de tabs simplificada
  const tabs = [
    {
      label: 'Dashboard',
      icon: <Dashboard />,
      component: null, // Se renderiza en el main
      description: 'Resumen general de cuentas por pagar',
      color: '#667eea'
    },
    {
      label: 'Lista de Cuentas',
      icon: <AccountBalance />,
      component: <CuentasPagarList />,
      description: 'Gestiona y visualiza todas las cuentas',
      color: '#e74c3c'
    },
    {
      label: 'Registro de Cuentas',
      icon: <Add />,
      component: <CuentasPagarRegistrationForm />,
      description: 'Registra nuevas cuentas por pagar',
      color: '#27ae60'
    }
  ];

  // Cargar datos del dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener datos reales de cuentas por pagar
      const [cuentasResponse, proveedoresResponse] = await Promise.allSettled([
        axios.get('/api/cuentas-pagar'),
        axios.get('/api/proveedores')
      ]);

      // Calcular estadísticas reales basadas en los datos de la API
      let realStats = {
        totalCuentas: 0,
        cuentasPagadas: 0,
        cuentasPendientes: 0,
        totalProveedores: 0,
        montoTotal: 0,
        montoPagado: 0,
        montoPendiente: 0,
        cuentasVencidas: 0,
        systemHealth: 'excellent'
      };

      let realActivity = [];

      // Procesar datos de cuentas si la llamada fue exitosa
      if (cuentasResponse.status === 'fulfilled' && cuentasResponse.value.data) {
        const cuentasData = cuentasResponse.value.data;
        setCuentas(cuentasData);
        
        realStats.totalCuentas = cuentasData.length;
        realStats.cuentasPagadas = cuentasData.filter(c => c.pagado).length;
        realStats.cuentasPendientes = cuentasData.filter(c => !c.pagado).length;
        
        // Calcular montos
        realStats.montoTotal = cuentasData.reduce((acc, c) => acc + parseFloat(c.monto_con_iva || 0), 0);
        realStats.montoPagado = cuentasData
          .filter(c => c.pagado)
          .reduce((acc, c) => acc + parseFloat(c.monto_con_iva || 0), 0);
        realStats.montoPendiente = cuentasData
          .filter(c => !c.pagado)
          .reduce((acc, c) => acc + parseFloat(c.monto_con_iva || 0), 0);
        
        // Calcular cuentas vencidas (fecha pasada y no pagadas)
        const hoy = new Date();
        realStats.cuentasVencidas = cuentasData.filter(c => 
          !c.pagado && new Date(c.fecha) < hoy
        ).length;
        
        // Generar actividad real más detallada y útil
        const proveedores = proveedoresResponse.status === 'fulfilled' 
          ? (Array.isArray(proveedoresResponse.value.data?.data) ? proveedoresResponse.value.data.data : proveedoresResponse.value.data)
          : [];
        
        const activities = [];
        const now = new Date();
        
        // Función para calcular tiempo relativo más preciso
        const getTimeAgo = (date) => {
          const diffTime = Math.abs(now - new Date(date));
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          
          if (diffDays === 0) return 'Hoy';
          if (diffDays === 1) return 'Ayer';
          if (diffDays < 7) return `hace ${diffDays} días`;
          if (diffDays < 30) return `hace ${Math.floor(diffDays / 7)} semana${Math.floor(diffDays / 7) > 1 ? 's' : ''}`;
          if (diffDays < 365) return `hace ${Math.floor(diffDays / 30)} mes${Math.floor(diffDays / 30) > 1 ? 'es' : ''}`;
          return `hace ${Math.floor(diffDays / 365)} año${Math.floor(diffDays / 365) > 1 ? 's' : ''}`;
        };
        
        // Actividades de cuentas creadas recientemente
        const cuentasCreadas = cuentasData
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 3);
          
        cuentasCreadas.forEach(cuenta => {
          const proveedor = proveedores.find(p => p.id === cuenta.proveedor_id);
          const nombreProveedor = proveedor ? proveedor.nombre : 'Sin proveedor asignado';
          const iniciales = nombreProveedor.substring(0, 2).toUpperCase();
          const diasVencida = Math.ceil((now - new Date(cuenta.fecha)) / (1000 * 60 * 60 * 24));
          
          activities.push({
            id: `created-${cuenta.id}`,
            type: 'cuenta_creada',
            proveedor: nombreProveedor,
            action: `Nueva cuenta: ${cuenta.concepto || 'Sin concepto'}`,
            details: `Categoría: ${cuenta.categoria || 'Sin categoría'}${diasVencida > 0 ? ` • Vencida hace ${diasVencida} días` : ''}`,
            time: getTimeAgo(cuenta.created_at),
            avatar: iniciales,
            color: diasVencida > 0 ? '#e74c3c' : '#3498db',
            monto: parseFloat(cuenta.monto_con_iva || 0),
            status: cuenta.pagado ? 'Pagada' : 'Pendiente'
          });
        });
        
        // Actividades de pagos recientes
        const cuentasPagadas = cuentasData
          .filter(c => c.pagado)
          .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
          .slice(0, 2);
          
        cuentasPagadas.forEach(cuenta => {
          const proveedor = proveedores.find(p => p.id === cuenta.proveedor_id);
          const nombreProveedor = proveedor ? proveedor.nombre : 'Sin proveedor asignado';
          const iniciales = nombreProveedor.substring(0, 2).toUpperCase();
          
          activities.push({
            id: `paid-${cuenta.id}`,
            type: 'pago_completado',
            proveedor: nombreProveedor,
            action: `Pago completado: ${cuenta.concepto || 'Sin concepto'}`,
            details: `Proveedor: ${nombreProveedor}`,
            time: getTimeAgo(cuenta.updated_at),
            avatar: iniciales,
            color: '#27ae60',
            monto: parseFloat(cuenta.monto_con_iva || 0),
            status: 'Pagada'
          });
        });
        
        // Actividades de cuentas pendientes críticas
        const cuentasPendientes = cuentasData
          .filter(c => !c.pagado)
          .sort((a, b) => new Date(a.fecha) - new Date(b.fecha))
          .slice(0, 2);
          
        cuentasPendientes.forEach(cuenta => {
          const proveedor = proveedores.find(p => p.id === cuenta.proveedor_id);
          const nombreProveedor = proveedor ? proveedor.nombre : 'Sin proveedor asignado';
          const iniciales = nombreProveedor.substring(0, 2).toUpperCase();
          const diasVencida = Math.ceil((now - new Date(cuenta.fecha)) / (1000 * 60 * 60 * 24));
          
          activities.push({
            id: `pending-${cuenta.id}`,
            type: 'cuenta_pendiente',
            proveedor: nombreProveedor,
            action: `Cuenta pendiente: ${cuenta.concepto || 'Sin concepto'}`,
            details: diasVencida > 0 ? `⚠️ Vencida hace ${diasVencida} días` : 'Por vencer',
            time: getTimeAgo(cuenta.fecha),
            avatar: iniciales,
            color: diasVencida > 0 ? '#e74c3c' : '#f39c12',
            monto: parseFloat(cuenta.monto_con_iva || 0),
            status: 'Pendiente'
          });
        });
        
        // Ordenar por fecha de creación/actualización y tomar las más recientes
        realActivity = activities
          .sort((a, b) => {
            const aDate = a.type === 'cuenta_creada' ? 
              cuentasData.find(c => c.id === parseInt(a.id.split('-')[1]))?.created_at :
              cuentasData.find(c => c.id === parseInt(a.id.split('-')[1]))?.updated_at || cuentasData.find(c => c.id === parseInt(a.id.split('-')[1]))?.fecha;
            const bDate = b.type === 'cuenta_creada' ? 
              cuentasData.find(c => c.id === parseInt(b.id.split('-')[1]))?.created_at :
              cuentasData.find(c => c.id === parseInt(b.id.split('-')[1]))?.updated_at || cuentasData.find(c => c.id === parseInt(b.id.split('-')[1]))?.fecha;
            
            return new Date(bDate) - new Date(aDate);
          })
          .slice(0, 6);
      }

      // Procesar datos de proveedores si la llamada fue exitosa
      if (proveedoresResponse.status === 'fulfilled' && proveedoresResponse.value.data) {
        const proveedores = Array.isArray(proveedoresResponse.value.data?.data) ? proveedoresResponse.value.data.data : proveedoresResponse.value.data;
        realStats.totalProveedores = Array.isArray(proveedores) ? proveedores.length : 0;
      }

      console.log('📊 Estadísticas reales calculadas:', realStats);
      console.log('📋 Actividad reciente real:', realActivity);

      setStats(realStats);
      setRecentActivity(realActivity);
      
    } catch (error) {
      console.error('Error cargando datos del dashboard:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  const handleRefresh = useCallback(() => {
    setRefreshing(true);
    fetchDashboardData();
  }, [fetchDashboardData]);

  useEffect(() => {
    fetchDashboardData();
    
    // Exponer función de recarga globalmente
    window.refreshCuentasPagar = fetchDashboardData;
    
    // Limpiar función al desmontar
    return () => {
      delete window.refreshCuentasPagar;
    };
  }, [fetchDashboardData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new_cuenta':
        setActiveTab(2);
        break;
      case 'view_cuentas':
        setActiveTab(1);
        break;
      default:
        break;
    }
  };

  const renderDashboard = () => (
    <Grid container spacing={4}>
      {/* Estadísticas principales */}
      <Grid item xs={12}>
        <Typography variant="h4" sx={{ 
          color: '#2c3e50', 
          fontWeight: 700, 
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          gap: 2
        }}>
          <Analytics sx={{ fontSize: '2rem', color: '#e74c3c' }} />
          Estadísticas del Sistema
        </Typography>
      </Grid>

      {/* Cards de estadísticas */}
      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard color="#e74c3c">
            <AccountBalance className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.totalCuentas}
            </Typography>
            <Typography className="stat-label">Total Cuentas</Typography>
            <Typography className="stat-change" sx={{ color: '#27ae60' }}>
              {stats.cuentasPendientes} pendientes
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard color="#27ae60">
            <CheckCircle className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.cuentasPagadas}
            </Typography>
            <Typography className="stat-label">Cuentas Pagadas</Typography>
            <Typography className="stat-change" sx={{ color: '#27ae60' }}>
              ↗ Excelente estado
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard color="#f39c12">
            <Warning className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.cuentasPendientes}
            </Typography>
            <Typography className="stat-label">Cuentas Pendientes</Typography>
            <Typography className="stat-change" sx={{ color: '#e74c3c' }}>
              {stats.montoPendiente ? `$${stats.montoPendiente.toLocaleString()}` : '$0'}
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>

      <Grid item xs={12} sm={6} md={3}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard color="#9b59b6">
            <Assignment className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.totalProveedores}
            </Typography>
            <Typography className="stat-label">Proveedores</Typography>
            <Typography className="stat-change" sx={{ color: '#9b59b6' }}>
              Activos
            </Typography>
          </StatCard>
        </motion.div>
      </Grid>

      {/* Alertas de cuentas vencidas */}
      <Grid item xs={12}>
        <StyledCard>
          <CardContent>
            <Typography variant="h5" sx={{ 
              color: '#2c3e50', 
              fontWeight: 700, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Warning sx={{ fontSize: '1.5rem', color: '#e74c3c' }} />
              Alertas de Vencimiento
            </Typography>
            
            {/* Cuentas vencidas (rojo) */}
            {cuentas.filter(cuenta => {
              if (cuenta.pagado) return false;
              const hoy = new Date();
              const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
              const diffTime = fechaVencimiento - hoy;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays < 0;
            }).length > 0 && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  🚨 Cuentas Vencidas ({cuentas.filter(cuenta => {
                    if (cuenta.pagado) return false;
                    const hoy = new Date();
                    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
                    const diffTime = fechaVencimiento - hoy;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays < 0;
                  }).length})
                </Typography>
                <Typography variant="body2">
                  Tienes cuentas que ya vencieron y requieren atención inmediata.
                </Typography>
              </Alert>
            )}

            {/* Cuentas que vencen hoy (naranja) */}
            {cuentas.filter(cuenta => {
              if (cuenta.pagado) return false;
              const hoy = new Date();
              const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
              const diffTime = fechaVencimiento - hoy;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays === 0;
            }).length > 0 && (
              <Alert 
                severity="warning" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  ⚠️ Vencen Hoy ({cuentas.filter(cuenta => {
                    if (cuenta.pagado) return false;
                    const hoy = new Date();
                    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
                    const diffTime = fechaVencimiento - hoy;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays === 0;
                  }).length})
                </Typography>
                <Typography variant="body2">
                  Cuentas que vencen hoy y necesitan pago inmediato.
                </Typography>
              </Alert>
            )}

            {/* Cuentas que vencen mañana (amarillo) */}
            {cuentas.filter(cuenta => {
              if (cuenta.pagado) return false;
              const hoy = new Date();
              const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
              const diffTime = fechaVencimiento - hoy;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays === 1;
            }).length > 0 && (
              <Alert 
                severity="info" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  backgroundColor: '#fff3cd',
                  borderColor: '#f39c12',
                  color: '#856404',
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem',
                    color: '#f39c12'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  ⏰ Vencen Mañana ({cuentas.filter(cuenta => {
                    if (cuenta.pagado) return false;
                    const hoy = new Date();
                    const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
                    const diffTime = fechaVencimiento - hoy;
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    return diffDays === 1;
                  }).length})
                </Typography>
                <Typography variant="body2">
                  Cuentas que vencen mañana, prepárate para el pago.
                </Typography>
              </Alert>
            )}

            {/* Sin alertas */}
            {cuentas.filter(cuenta => {
              if (cuenta.pagado) return false;
              const hoy = new Date();
              const fechaVencimiento = new Date(cuenta.fecha_vencimiento || cuenta.fecha);
              const diffTime = fechaVencimiento - hoy;
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays < 0 || diffDays === 0 || diffDays === 1;
            }).length === 0 && (
              <Alert 
                severity="success" 
                sx={{ 
                  mb: 2, 
                  borderRadius: 2,
                  '& .MuiAlert-icon': {
                    fontSize: '1.5rem'
                  }
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                  ✅ Sin Alertas de Vencimiento
                </Typography>
                <Typography variant="body2">
                  No tienes cuentas vencidas, que vencen hoy o mañana. ¡Excelente gestión!
                </Typography>
              </Alert>
            )}
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Acciones rápidas */}
      <Grid item xs={12}>
        <StyledCard>
          <CardContent>
            <Typography variant="h5" sx={{ 
              color: '#2c3e50', 
              fontWeight: 700, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Rocket sx={{ fontSize: '1.5rem', color: '#e74c3c' }} />
              Acciones Rápidas
            </Typography>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  fullWidth
                  color="#e74c3c"
                  startIcon={<Add />}
                  onClick={() => handleQuickAction('new_cuenta')}
                >
                  Nueva Cuenta
                </QuickActionButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  fullWidth
                  color="#667eea"
                  startIcon={<AccountBalance />}
                  onClick={() => handleQuickAction('view_cuentas')}
                >
                  Ver Cuentas
                </QuickActionButton>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <QuickActionButton
                  fullWidth
                  color="#27ae60"
                  startIcon={<FileDownload />}
                  onClick={() => handleQuickAction('export')}
                >
                  Exportar
                </QuickActionButton>
              </Grid>
            </Grid>
          </CardContent>
        </StyledCard>
      </Grid>

      {/* Actividad reciente */}
      <Grid item xs={12} md={6}>
        <ActivityCard>
          <CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h5" sx={{ 
                color: '#2c3e50', 
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                gap: 2
              }}>
                <TrendingUp sx={{ fontSize: '1.5rem', color: '#e74c3c' }} />
                Actividad Reciente
              </Typography>
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{ color: '#e74c3c' }}
              >
                <Refresh sx={{ 
                  animation: refreshing ? 'spin 1s linear infinite' : 'none',
                  '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                  }
                }} />
              </IconButton>
            </Box>
            
            {loading ? (
              Array.from({ length: 4 }).map((_, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                    <Skeleton variant="circular" width={48} height={48} />
                    <Box sx={{ flex: 1 }}>
                      <Skeleton variant="text" width="80%" height={24} />
                      <Skeleton variant="text" width="60%" height={20} />
                    </Box>
                  </Box>
                  <Divider sx={{ mt: 2 }} />
                </Box>
              ))
            ) : (
              <List>
                {recentActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <ListItem sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ 
                          background: activity.color,
                          fontWeight: 700,
                          fontSize: '0.9rem'
                        }}>
                          {activity.avatar}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                              {activity.proveedor}
                            </Typography>
                            <Chip
                              size="small"
                              label={activity.status}
                              sx={{
                                backgroundColor: activity.status === 'Pagada' ? '#d4edda' : '#fff3cd',
                                color: activity.status === 'Pagada' ? '#155724' : '#856404',
                                fontWeight: 600,
                                fontSize: '0.7rem',
                                height: 20
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Box component="div">
                            <Box component="div" sx={{ color: '#2c3e50', fontSize: '0.875rem', fontWeight: 500, mb: 0.5 }}>
                              {activity.action}
                            </Box>
                            <Box component="div" sx={{ color: '#7f8c8d', fontSize: '0.8rem', mb: 0.5 }}>
                              {activity.details}
                            </Box>
                            <Box component="div" sx={{ color: '#bdc3c7', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 1 }}>
                              <span>{activity.time}</span>
                              <span>•</span>
                              <span style={{ fontWeight: 600, color: '#2c3e50' }}>
                                ${activity.monto.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                              </span>
                            </Box>
                          </Box>
                        }
                      />
                      <Chip
                        size="small"
                        label={activity.type.replace('_', ' ')}
                        sx={{
                          background: `${activity.color}20`,
                          color: activity.color,
                          fontWeight: 600,
                          textTransform: 'capitalize'
                        }}
                      />
                    </ListItem>
                    {index < recentActivity.length - 1 && <Divider />}
                  </motion.div>
                ))}
              </List>
            )}
          </CardContent>
        </ActivityCard>
      </Grid>

      {/* Estado del sistema */}
      <Grid item xs={12} md={6}>
        <ActivityCard>
          <CardContent>
            <Typography variant="h5" sx={{ 
              color: '#2c3e50', 
              fontWeight: 700, 
              mb: 3,
              display: 'flex',
              alignItems: 'center',
              gap: 2
            }}>
              <Payment sx={{ fontSize: '1.5rem', color: '#e74c3c' }} />
              Estado del Sistema
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Salud del Sistema
                </Typography>
                <Chip 
                  label="Excelente" 
                  color="success" 
                  size="small"
                  sx={{ fontWeight: 600 }}
                />
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={95} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #27ae60, #2ecc71)'
                  }
                }} 
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                <Typography variant="body1" sx={{ fontWeight: 600 }}>
                  Cuentas Pagadas
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                  {stats.cuentasPagadas}/{stats.totalCuentas}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={stats.totalCuentas > 0 ? (stats.cuentasPagadas / stats.totalCuentas) * 100 : 0} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #e74c3c, #c0392b)'
                  }
                }} 
              />
            </Box>

            <Alert 
              severity="info" 
              sx={{ 
                mt: 2,
                borderRadius: 2,
                '& .MuiAlert-icon': {
                  color: '#e74c3c'
                }
              }}
            >
              Sistema funcionando óptimamente. Todas las cuentas están siendo gestionadas correctamente.
            </Alert>
          </CardContent>
        </ActivityCard>
      </Grid>
    </Grid>
  );

  return (
    <StyledContainer maxWidth="xl">
      {/* Header ultra mejorado */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Box sx={{ 
          mb: 6, 
          textAlign: 'center',
          position: 'relative',
          zIndex: 2
        }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 900,
              color: '#fff',
              textAlign: 'center',
              mb: 3,
              textShadow: '0 4px 8px rgba(0,0,0,0.4)',
              background: 'linear-gradient(135deg, #fff 0%, #f0f0f0 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              letterSpacing: '-0.02em',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3
            }}
          >
            <Diamond sx={{ fontSize: '3.5rem', filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))' }} />
            💳 Cuentas por Pagar
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.95)',
              textAlign: 'center',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              fontWeight: 500,
              maxWidth: '600px',
              margin: '0 auto',
              lineHeight: 1.6
            }}
          >
            🚀 Gestiona y controla tus cuentas por pagar de manera eficiente y profesional
          </Typography>
          
          {/* Elementos decorativos */}
          <Box sx={{
            position: 'absolute',
            top: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '100px',
            height: '4px',
            background: 'linear-gradient(90deg, transparent, #fff, transparent)',
            borderRadius: '2px',
            opacity: 0.6
          }} />
          
          <Box sx={{
            position: 'absolute',
            bottom: '-20px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '60px',
            height: '2px',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
            borderRadius: '1px',
            opacity: 0.8
          }} />
        </Box>
      </motion.div>

      {/* Tabs de navegación ultra mejoradas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <Box sx={{ 
          borderBottom: '2px solid rgba(0,0,0,0.05)',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05), rgba(118, 75, 162, 0.05))',
          position: 'relative',
          '&::before': {
            content: '""',
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: '2px',
            background: 'linear-gradient(90deg, transparent, #667eea, #764ba2, transparent)',
            opacity: 0.6
          }
        }}>
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            variant={isMobile ? 'scrollable' : 'standard'}
            scrollButtons="auto"
            allowScrollButtonsMobile
            centered={!isMobile}
            sx={{
              '& .MuiTab-root': {
                minHeight: 72,
                fontSize: '1.1rem',
                fontWeight: 700,
                textTransform: 'none',
                borderRadius: '12px 12px 0 0',
                margin: '0 4px',
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                position: 'relative',
                '&:hover': {
                  background: 'rgba(102, 126, 234, 0.1)',
                  transform: 'translateY(-2px)'
                },
                '&.Mui-selected': {
                  color: '#e74c3c',
                  background: 'rgba(231, 76, 60, 0.1)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: 'linear-gradient(90deg, #e74c3c, #c0392b)',
                    borderRadius: '0 0 2px 2px'
                  }
                }
              },
              '& .MuiTabs-indicator': {
                display: 'none'
              }
            }}
          >
            {tabs.map((tab, index) => (
              <motion.div
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tab
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                      <Box sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.3rem',
                          filter: activeTab === index ? 'drop-shadow(0 2px 4px rgba(231, 76, 60, 0.3))' : 'none'
                        }
                      }}>
                        {tab.icon}
                      </Box>
                      <Box sx={{ textAlign: 'left' }}>
                        <Typography variant="body1" fontWeight={700} sx={{ 
                          color: activeTab === index ? '#e74c3c' : '#2c3e50'
                        }}>
                          {tab.label}
                        </Typography>
                        <Typography variant="caption" sx={{ 
                          opacity: 0.8,
                          color: activeTab === index ? '#e74c3c' : '#7f8c8d'
                        }}>
                          {tab.description}
                        </Typography>
                      </Box>
                    </Box>
                  }
                />
              </motion.div>
            ))}
          </StyledTabs>
        </Box>
      </motion.div>

      {/* Contenido de las tabs */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <StyledCard sx={{ minHeight: '70vh' }}>
          <CardContent sx={{ p: { xs: 2, md: 4 } }}>
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 0 ? renderDashboard() : tabs[activeTab].component}
              </motion.div>
            </AnimatePresence>
          </CardContent>
        </StyledCard>
      </motion.div>
    </StyledContainer>
  );
};

export default CuentasPagarMain;
