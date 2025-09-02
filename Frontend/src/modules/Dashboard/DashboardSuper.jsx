// modules/Dashboard/DashboardSuper.jsx - Dashboard Potenciado al 1000%
import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Switch,
  FormControlLabel,
  Fab,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
  AppBar,
  Toolbar,
  Chip,
  Avatar,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Dashboard,
  Analytics,
  TrendingUp,
  Assessment,
  Speed,
  Refresh,
  Settings,
  Fullscreen,
  FullscreenExit,
  Download,
  Share,
  Print,
  FilterList,
  ViewModule,
  ViewList,
  Notifications,
  NotificationsActive,
  DarkMode,
  LightMode,
  PieChart,
  ShowChart,
  Timeline,
  AccountBalance,
  AttachMoney,
  Business,
  People,
  Assignment
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { styled } from '@mui/material/styles';

// Importar componentes especializados
import AdvancedMetrics from '../../components/DashboardComponents/AdvancedMetrics';
import InteractiveCharts from '../../components/DashboardComponents/InteractiveCharts';
import RealTimeUpdates from '../../components/DashboardComponents/RealTimeUpdates';
import AdvancedFilters from '../../components/DashboardComponents/AdvancedFilters';
import RevenueDashboard from '../../components/DashboardComponents/RevenueDashboard';
import ExpensesDashboard from '../../components/DashboardComponents/ExpensesDashboard';
import ProjectsDashboard from '../../components/DashboardComponents/ProjectsDashboard';
import useDashboardData from '../../hooks/useDashboardData';

// Estilos avanzados con temas personalizados
const DashboardContainer = styled(Box)(({ theme, darkMode, fullscreen }) => ({
  minHeight: fullscreen ? '100vh' : 'calc(100vh - 64px)',
  background: darkMode 
    ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)'
    : 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  padding: theme.spacing(2),
  position: fullscreen ? 'fixed' : 'relative',
  top: fullscreen ? 0 : 'auto',
  left: fullscreen ? 0 : 'auto',
  right: fullscreen ? 0 : 'auto',
  bottom: fullscreen ? 0 : 'auto',
  zIndex: fullscreen ? 9999 : 'auto',
  overflow: 'auto'
}));

const GlassCard = styled(Card)(({ theme, variant = 'default' }) => ({
  background: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(20px)',
  borderRadius: 16,
  border: '1px solid rgba(255, 255, 255, 0.2)',
  boxShadow: '0 8px 32px rgba(31, 38, 135, 0.15)',
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  position: 'relative',
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 2,
    background: variant === 'primary' 
      ? 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
      : variant === 'success'
      ? 'linear-gradient(90deg, #11998e 0%, #38ef7d 100%)'
      : 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)'
  },
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 12px 48px rgba(31, 38, 135, 0.2)'
  }
}));

const AnimatedFab = styled(Fab)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(3),
  right: theme.spacing(3),
  background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
  animation: 'pulse 2s infinite',
  '&:hover': {
    background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
  },
  '@keyframes pulse': {
    '0%': {
      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0.7)'
    },
    '70%': {
      boxShadow: '0 0 0 10px rgba(102, 126, 234, 0)'
    },
    '100%': {
      boxShadow: '0 0 0 0 rgba(102, 126, 234, 0)'
    }
  }
}));

const FloatingActionButtons = ({ onAction }) => {
  const actions = [
    { icon: <Download />, name: 'Exportar', action: 'export' },
    { icon: <Share />, name: 'Compartir', action: 'share' },
    { icon: <Print />, name: 'Imprimir', action: 'print' },
    { icon: <Settings />, name: 'Configurar', action: 'settings' }
  ];

  return (
    <SpeedDial
      ariaLabel="Acciones del Dashboard"
      sx={{ position: 'fixed', bottom: 16, right: 16 }}
      icon={<SpeedDialIcon />}
      FabProps={{
        sx: {
          background: 'linear-gradient(45deg, #667eea 30%, #764ba2 90%)',
          '&:hover': {
            background: 'linear-gradient(45deg, #5a6fd8 30%, #6a4190 90%)',
          }
        }
      }}
    >
      {actions.map((action) => (
        <SpeedDialAction
          key={action.name}
          icon={action.icon}
          tooltipTitle={action.name}
          onClick={() => onAction(action.action)}
          FabProps={{
            sx: { 
              background: 'white',
              '&:hover': { 
                background: '#f8f9fa',
                transform: 'scale(1.1)' 
              }
            }
          }}
        />
      ))}
    </SpeedDial>
  );
};

const DashboardHeader = ({ 
  activeTab, 
  onTabChange, 
  darkMode, 
  onDarkModeToggle, 
  fullscreen, 
  onFullscreenToggle,
  autoRefresh,
  onAutoRefreshToggle,
  onRefresh,
  kpis
}) => {
  const tabs = [
    { id: 0, label: 'Overview', icon: <Dashboard /> },
    { id: 1, label: 'Métricas', icon: <Analytics /> },
    { id: 2, label: 'Gráficos', icon: <ShowChart /> },
    { id: 3, label: 'Tiempo Real', icon: <Speed /> },
    { id: 4, label: 'Ingresos', icon: <AttachMoney /> },
    { id: 5, label: 'Gastos', icon: <AccountBalance /> },
    { id: 6, label: 'Proyectos', icon: <Assignment /> },
    { id: 7, label: 'Reportes', icon: <Assessment /> }
  ];

  return (
    <GlassCard sx={{ mb: 3 }}>
      <CardContent sx={{ p: 2 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Box>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
              🚀 Dashboard Super
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              Gestión Financiera Avanzada • Tiempo Real • IA Integrada
            </Typography>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {kpis?.financial && (
              <Box sx={{ display: 'flex', gap: 1 }}>
                <Chip
                  label={`Flujo: $${kpis.financial.netCashFlow?.toLocaleString() || 0}`}
                  color={kpis.financial.netCashFlow >= 0 ? 'success' : 'error'}
                  variant="outlined"
                />
                <Chip
                  label={`${kpis.operational?.activeProjects || 0} Proyectos`}
                  color="primary"
                  variant="outlined"
                />
              </Box>
            )}
            
            <FormControlLabel
              control={<Switch checked={autoRefresh} onChange={onAutoRefreshToggle} />}
              label="Auto-actualizar"
              sx={{ mx: 1 }}
            />
            
            <Tooltip title={darkMode ? 'Modo Claro' : 'Modo Oscuro'}>
              <IconButton onClick={onDarkModeToggle}>
                {darkMode ? <LightMode /> : <DarkMode />}
              </IconButton>
            </Tooltip>

            <Tooltip title="Refrescar">
              <IconButton onClick={onRefresh}>
                <Refresh />
              </IconButton>
            </Tooltip>

            <Tooltip title={fullscreen ? 'Salir de Pantalla Completa' : 'Pantalla Completa'}>
              <IconButton onClick={onFullscreenToggle}>
                {fullscreen ? <FullscreenExit /> : <Fullscreen />}
              </IconButton>
            </Tooltip>
          </Box>
        </Box>

        <Tabs
          value={activeTab}
          onChange={onTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            '& .MuiTab-root': {
              minHeight: 48,
              textTransform: 'none',
              fontWeight: 600,
              '&.Mui-selected': {
                color: '#667eea'
              }
            },
            '& .MuiTabs-indicator': {
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              height: 3,
              borderRadius: '3px 3px 0 0'
            }
          }}
        >
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              label={tab.label}
              icon={tab.icon}
              iconPosition="start"
              sx={{ minWidth: 120 }}
            />
          ))}
        </Tabs>
      </CardContent>
    </GlassCard>
  );
};

const OverviewPanel = ({ kpis }) => {
  const overviewStats = [
    {
      title: 'Resumen Financiero',
      items: [
        { label: 'Ingresos del Mes', value: `$${kpis?.financial?.monthlyRevenue?.toLocaleString() || 0}`, color: '#10b981' },
        { label: 'Flujo Neto', value: `$${kpis?.financial?.netCashFlow?.toLocaleString() || 0}`, color: '#3b82f6' },
        { label: 'Por Cobrar', value: `$${kpis?.financial?.totalCobrar?.toLocaleString() || 0}`, color: '#f59e0b' },
        { label: 'Por Pagar', value: `$${kpis?.financial?.totalPagar?.toLocaleString() || 0}`, color: '#ef4444' }
      ]
    },
    {
      title: 'Operaciones',
      items: [
        { label: 'Proyectos Activos', value: kpis?.operational?.activeProjects || 0, color: '#8b5cf6' },
        { label: 'Clientes Totales', value: kpis?.operational?.totalClients || 0, color: '#06b6d4' },
        { label: 'Tasa de Éxito', value: `${kpis?.operational?.projectSuccessRate?.toFixed(1) || 0}%`, color: '#10b981' },
        { label: 'Usuarios Activos', value: kpis?.operational?.totalUsers || 0, color: '#f97316' }
      ]
    }
  ];

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom fontWeight="bold" mb={3}>
        📈 Resumen Ejecutivo
      </Typography>
      
      <Grid container spacing={3}>
        {overviewStats.map((section, index) => (
          <Grid item xs={12} md={6} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <GlassCard>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" fontWeight="bold" mb={2}>
                    {section.title}
                  </Typography>
                  <Grid container spacing={2}>
                    {section.items.map((item, itemIndex) => (
                      <Grid item xs={6} key={itemIndex}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: `${item.color}10`,
                            border: `1px solid ${item.color}30`,
                            textAlign: 'center',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: `0 8px 16px ${item.color}20`
                            }
                          }}
                        >
                          <Typography variant="h4" fontWeight="bold" sx={{ color: item.color, mb: 1 }}>
                            {item.value}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.label}
                          </Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </CardContent>
              </GlassCard>
            </motion.div>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

const DashboardSuper = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  // Estados del dashboard
  const [activeTab, setActiveTab] = useState(0);
  const [darkMode, setDarkMode] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Hook de datos
  const { 
    loading, 
    error, 
    kpis, 
    financialData, 
    operationalData, 
    refreshData,
    refreshing 
  } = useDashboardData();

  // Auto-refresh cada 30 segundos si está habilitado
  useEffect(() => {
    if (!autoRefresh) return;
    
    const interval = setInterval(() => {
      refreshData();
    }, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh, refreshData]);

  // Handlers
  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleAction = (action) => {
    switch (action) {
      case 'export':
        console.log('Exportar dashboard');
        break;
      case 'share':
        console.log('Compartir dashboard');
        break;
      case 'print':
        window.print();
        break;
      case 'settings':
        setSidebarOpen(true);
        break;
      default:
        console.log(`Acción: ${action}`);
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 0:
        return <OverviewPanel kpis={kpis} />;
      case 1:
        return <AdvancedMetrics kpis={kpis} />;
      case 2:
        return <InteractiveCharts kpis={kpis} financialData={financialData} />;
      case 3:
        return <RealTimeUpdates kpis={kpis} onRefresh={refreshData} />;
      case 4:
        return <RevenueDashboard kpis={kpis} financialData={financialData} />;
      case 5:
        return <ExpensesDashboard kpis={kpis} financialData={financialData} />;
      case 6:
        return <ProjectsDashboard kpis={kpis} projectsData={kpis?.operational} />;
      case 7:
        return (
          <Box sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h5">📊 Reportes Avanzados</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mt: 2 }}>
              Próximamente: Reportes personalizables con IA
            </Typography>
          </Box>
        );
      default:
        return <OverviewPanel kpis={kpis} />;
    }
  };

  if (loading) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        >
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'white', color: '#667eea' }}>
            <Dashboard sx={{ fontSize: 40 }} />
          </Avatar>
        </motion.div>
      </Box>
    );
  }

  return (
    <DashboardContainer darkMode={darkMode} fullscreen={fullscreen}>
      {/* Header del Dashboard */}
      <DashboardHeader
        activeTab={activeTab}
        onTabChange={handleTabChange}
        darkMode={darkMode}
        onDarkModeToggle={() => setDarkMode(!darkMode)}
        fullscreen={fullscreen}
        onFullscreenToggle={() => setFullscreen(!fullscreen)}
        autoRefresh={autoRefresh}
        onAutoRefreshToggle={() => setAutoRefresh(!autoRefresh)}
        onRefresh={refreshData}
        kpis={kpis}
      />

      {/* Contenido del Dashboard */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderTabContent()}
        </motion.div>
      </AnimatePresence>

      {/* Botones de Acción Flotantes */}
      <FloatingActionButtons onAction={handleAction} />

      {/* Sidebar de Configuración */}
      <Drawer
        anchor="right"
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        PaperProps={{
          sx: {
            width: 300,
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(20px)'
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" gutterBottom>
            ⚙️ Configuración
          </Typography>
          <Divider sx={{ mb: 2 }} />
          
          <List>
            <ListItem>
              <ListItemIcon><Notifications /></ListItemIcon>
              <ListItemText primary="Notificaciones" />
            </ListItem>
            <ListItem>
              <ListItemIcon><FilterList /></ListItemIcon>
              <ListItemText primary="Filtros Avanzados" />
            </ListItem>
            <ListItem>
              <ListItemIcon><ViewModule /></ListItemIcon>
              <ListItemText primary="Personalizar Vista" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Indicador de Estado */}
      {refreshing && (
        <Box sx={{ 
          position: 'fixed', 
          top: 80, 
          right: 20, 
          zIndex: 1000 
        }}>
          <Chip 
            icon={<Refresh sx={{ animation: 'spin 1s linear infinite' }} />}
            label="Actualizando..."
            color="primary"
            variant="outlined"
            sx={{ 
              background: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)'
            }}
          />
        </Box>
      )}
    </DashboardContainer>
  );
};

export default DashboardSuper;