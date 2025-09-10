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
  People,
  PersonAdd,
  AdminPanelSettings,
  Security,
  Group,
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
  Analytics
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { motion, AnimatePresence } from 'framer-motion';

// Importar componentes
import UsersList from './UsersList';
import UserRegistrationForm from './UserRegistrationForm';
import RoleManagementForm from './RoleManagementForm';

// ========================================
// COMPONENTES ESTILIZADOS MODERNOS
// ========================================

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.05"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    pointerEvents: 'none'
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
  background: `linear-gradient(135deg, ${color}15, ${color}05)`,
  border: `2px solid ${color}30`,
  borderRadius: 20,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
  cursor: 'pointer',
  position: 'relative',
  overflow: 'hidden',
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 50px ${color}25`,
    borderColor: color,
    '& .stat-icon': {
      transform: 'scale(1.3) rotate(10deg)',
    },
    '& .stat-number': {
      transform: 'scale(1.1)',
    }
  },
  '& .stat-icon': {
    color: color,
    fontSize: '3rem',
    marginBottom: theme.spacing(2),
    transition: 'all 0.4s ease',
    filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.1))'
  },
  '& .stat-number': {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: color,
    marginBottom: theme.spacing(1),
    textShadow: '0 2px 8px rgba(0,0,0,0.1)',
    transition: 'all 0.3s ease'
  },
  '& .stat-label': {
    fontSize: '0.9rem',
    fontWeight: 600,
    color: '#555',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    lineHeight: 1.2
  },
  '& .stat-change': {
    fontSize: '0.8rem',
    fontWeight: 600,
    marginTop: theme.spacing(1),
    padding: theme.spacing(0.5, 1),
    borderRadius: 12,
    background: 'rgba(255,255,255,0.8)'
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
  padding: theme.spacing(2, 3),
  fontWeight: 700,
  fontSize: '1rem',
  textTransform: 'none',
  boxShadow: `0 8px 25px ${color}40`,
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: `0 12px 35px ${color}50`
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

const UsersManagementMain = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [stats, setStats] = useState({});
  const [recentActivity, setRecentActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Configuración de tabs mejorada
  const tabs = [
    {
      label: 'Dashboard',
      icon: <Dashboard />,
      component: null, // Se renderiza en el main
      description: 'Resumen general del sistema de usuarios',
      color: '#667eea'
    },
    {
      label: 'Lista de Usuarios',
      icon: <People />,
      component: <UsersList />,
      description: 'Gestiona y visualiza todos los usuarios',
      color: '#667eea'
    },
    {
      label: 'Registro',
      icon: <PersonAdd />,
      component: <UserRegistrationForm />,
      description: 'Registra nuevos usuarios del sistema',
      color: '#27ae60'
    },
    {
      label: 'Gestión de Roles',
      icon: <AdminPanelSettings />,
      component: <RoleManagementForm />,
      description: 'Administra roles y permisos',
      color: '#f39c12'
    }
  ];

  // Cargar datos del dashboard
  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Obtener datos reales de usuarios y roles
      const [usersResponse, rolesResponse] = await Promise.allSettled([
        axios.get('/api/user-registration/all-users'),
        axios.get('/api/roles/public/list')
      ]);

      // Calcular estadísticas reales basadas en los datos de la API
      let realStats = {
        totalUsers: 0,
        activeUsers: 0,
        pendingUsers: 0,
        totalRoles: 0,
        adminUsers: 0,
        newUsersThisMonth: 0,
        userGrowth: '+0%',
        systemHealth: 'excellent'
      };

      let realActivity = [];

      // Procesar datos de usuarios si la llamada fue exitosa
      if (usersResponse.status === 'fulfilled' && usersResponse.value.data.success) {
        const users = usersResponse.value.data.data;
        
        realStats.totalUsers = users.length;
        realStats.activeUsers = users.filter(u => u.is_active).length;
        realStats.pendingUsers = users.filter(u => !u.profile_complete).length;
        realStats.adminUsers = users.filter(u => u.role && u.role.toLowerCase().includes('admin')).length;
        
        // Calcular usuarios nuevos este mes
        const thisMonth = new Date();
        thisMonth.setDate(1);
        realStats.newUsersThisMonth = users.filter(u => new Date(u.created_at) >= thisMonth).length;
        
        // Generar actividad real basada en los usuarios más recientes
        const recentUsers = users
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 4);
          
        realActivity = recentUsers.map((user, index) => {
          const timeAgo = getTimeAgo(user.created_at);
          const initials = user.name ? 
            user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 
            user.email.substring(0, 2).toUpperCase();
            
          return {
            id: user.id,
            type: user.profile_complete ? 'profile_completed' : 'user_created',
            user: user.name || user.email.split('@')[0],
            action: user.profile_complete ? 'Perfil completado' : 'Usuario registrado en SIGMA',
            time: timeAgo,
            avatar: initials,
            color: user.profile_complete ? '#27ae60' : '#667eea'
          };
        });
      }

      // Procesar datos de roles si la llamada fue exitosa
      if (rolesResponse.status === 'fulfilled' && rolesResponse.value.data.success) {
        const roles = rolesResponse.value.data.data;
        realStats.totalRoles = roles.length;
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
  }, [fetchDashboardData]);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleQuickAction = (action) => {
    switch (action) {
      case 'new_user':
        setActiveTab(2);
        break;
      case 'manage_roles':
        setActiveTab(3);
        break;
      case 'view_users':
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
          <Analytics sx={{ fontSize: '2rem', color: '#667eea' }} />
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
          <StatCard color="#667eea">
            <People className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.totalUsers}
            </Typography>
            <Typography className="stat-label">Total Usuarios</Typography>
            <Typography className="stat-change" sx={{ color: '#27ae60' }}>
              {stats.userGrowth} este mes
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
              {loading ? <Skeleton width={60} /> : stats.activeUsers}
            </Typography>
            <Typography className="stat-label">Usuarios Activos</Typography>
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
            <AdminPanelSettings className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.adminUsers}
            </Typography>
            <Typography className="stat-label">Administradores</Typography>
            <Typography className="stat-change" sx={{ color: '#667eea' }}>
              {stats.totalRoles} roles totales
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
          <StatCard color="#e74c3c">
            <Warning className="stat-icon" />
            <Typography className="stat-number">
              {loading ? <Skeleton width={60} /> : stats.pendingUsers}
            </Typography>
            <Typography className="stat-label">Usuarios Pendientes</Typography>
            <Typography className="stat-change" sx={{ color: '#e74c3c' }}>
              Requieren atención
        </Typography>
          </StatCard>
        </motion.div>
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
              <Rocket sx={{ fontSize: '1.5rem', color: '#667eea' }} />
              Acciones Rápidas
            </Typography>
        <Grid container spacing={3}>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionButton
                  fullWidth
                  color="#27ae60"
                  startIcon={<PersonAdd />}
                  onClick={() => handleQuickAction('new_user')}
                >
                  Registrar Usuario
                </QuickActionButton>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionButton
                  fullWidth
                  color="#f39c12"
                  startIcon={<AdminPanelSettings />}
                  onClick={() => handleQuickAction('manage_roles')}
                >
                  Gestionar Roles
                </QuickActionButton>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <QuickActionButton
                  fullWidth
                  color="#667eea"
                  startIcon={<People />}
                  onClick={() => handleQuickAction('view_users')}
                >
                  Ver Todos los Usuarios
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
                <TrendingUp sx={{ fontSize: '1.5rem', color: '#667eea' }} />
                Actividad Reciente
              </Typography>
              <IconButton 
                onClick={handleRefresh} 
                disabled={refreshing}
                sx={{ color: '#667eea' }}
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
                          <Typography variant="body1" sx={{ fontWeight: 600, color: '#2c3e50' }}>
                            {activity.user}
                          </Typography>
                        }
                        secondary={
                          <Box>
                            <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                              {activity.action}
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#bdc3c7' }}>
                              {activity.time}
                            </Typography>
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
              <Security sx={{ fontSize: '1.5rem', color: '#667eea' }} />
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
                  Usuarios Activos
                </Typography>
                <Typography variant="body2" sx={{ color: '#7f8c8d' }}>
                  {stats.activeUsers}/{stats.totalUsers}
                </Typography>
              </Box>
              <LinearProgress 
                variant="determinate" 
                value={(stats.activeUsers / stats.totalUsers) * 100} 
                sx={{ 
                  height: 8, 
                  borderRadius: 4,
                  backgroundColor: '#e0e0e0',
                  '& .MuiLinearProgress-bar': {
                    background: 'linear-gradient(135deg, #667eea, #764ba2)'
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
                  color: '#667eea'
                }
              }}
            >
              Sistema funcionando óptimamente. Todos los servicios están operativos.
            </Alert>
          </CardContent>
        </ActivityCard>
      </Grid>
    </Grid>
  );

  return (
    <StyledContainer maxWidth="xl">
      {/* Header mejorado */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: '#ffffff',
              mb: 2,
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 3
            }}
          >
            <Diamond sx={{ fontSize: '3rem' }} />
            Módulo de Usuarios
          </Typography>
          <Typography
            variant="h5"
            sx={{
              color: 'rgba(255,255,255,0.9)',
              fontWeight: 400,
              opacity: 0.9,
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.4
            }}
          >
            Gestión integral de usuarios, roles y permisos en el Sistema SIGMA
          </Typography>
        </Box>
      </motion.div>

      {/* Tabs de navegación mejoradas */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
          variant={isMobile ? 'scrollable' : 'standard'}
          scrollButtons="auto"
          allowScrollButtonsMobile
          centered={!isMobile}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, py: 1 }}>
                    {tab.icon}
                  <Box sx={{ textAlign: 'left' }}>
                    <Typography variant="body1" fontWeight={700}>
                      {tab.label}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                      {tab.description}
                    </Typography>
                  </Box>
                  </Box>
                }
              />
            ))}
          </StyledTabs>
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

export default UsersManagementMain;