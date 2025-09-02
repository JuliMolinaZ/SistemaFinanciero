import React, { useState } from 'react';
import {
  Container,
  Box,
  Tabs,
  Tab,
  Typography,
  Paper,
  useTheme,
  useMediaQuery,
  Grid
} from '@mui/material';
import { styled } from '@mui/material/styles';
import {
  People,
  AdminPanelSettings,
  PersonAdd,
  Security,
  Dashboard
} from '@mui/icons-material';

// Importar componentes
import UsersList from './UsersList';
import UserRegistrationForm from './UserRegistrationForm';
import RoleManagementForm from './RoleManagementForm';

const StyledContainer = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(6),
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  position: 'relative',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="0.1"%3E%3Ccircle cx="30" cy="30" r="2"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
    opacity: 0.3,
    zIndex: 0
  }
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  background: 'rgba(255, 255, 255, 0.95)',
  backdropFilter: 'blur(20px)',
  borderRadius: 24,
  boxShadow: '0 20px 60px rgba(0,0,0,0.1), 0 8px 25px rgba(0,0,0,0.05)',
  border: '1px solid rgba(255,255,255,0.3)',
  overflow: 'hidden',
  position: 'relative',
  zIndex: 1,
  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 25px 80px rgba(0,0,0,0.15), 0 12px 35px rgba(0,0,0,0.08)'
  }
}));

const StyledTabs = styled(Tabs)(({ theme }) => ({
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: theme.spacing(1),
  borderRadius: '16px 16px 0 0',
  '& .MuiTab-root': {
    minHeight: 72,
    fontSize: '1.1rem',
    fontWeight: 600,
    textTransform: 'none',
    color: 'rgba(255,255,255,0.8)',
    transition: 'all 0.3s ease',
    borderRadius: '12px',
    margin: theme.spacing(0, 1),
    '&:hover': {
      color: 'rgba(255,255,255,0.95)',
      background: 'rgba(255,255,255,0.1)',
      transform: 'translateY(-2px)'
    },
    '&.Mui-selected': {
      color: '#fff',
      fontWeight: 700,
      background: 'rgba(255,255,255,0.2)',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
    }
  },
  '& .MuiTabs-indicator': {
    display: 'none'
  }
}));

const TabPanel = ({ children, value, index, ...other }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`users-tabpanel-${index}`}
    aria-labelledby={`users-tab-${index}`}
    {...other}
  >
    {value === index && (
      <Box sx={{ p: { xs: 2, md: 4 } }}>
        {children}
      </Box>
    )}
  </div>
);

const HeaderSection = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  marginBottom: theme.spacing(6),
  position: 'relative',
  zIndex: 1,
  '& .main-title': {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    fontSize: { xs: '2.5rem', md: '3.5rem' },
    fontWeight: 800,
    marginBottom: theme.spacing(2),
    textShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
    letterSpacing: '-0.02em'
  },
  '& .subtitle': {
    fontSize: { xs: '1.1rem', md: '1.3rem' },
    color: '#64748b',
    fontWeight: 500,
    maxWidth: '800px',
    margin: '0 auto',
    lineHeight: 1.6
  }
}));

const StatsCard = styled(Box)(({ theme, color }) => ({
  background: `linear-gradient(135deg, ${color}15 0%, ${color}25 100%)`,
  border: `2px solid ${color}30`,
  borderRadius: 20,
  padding: theme.spacing(3),
  textAlign: 'center',
  transition: 'all 0.3s ease',
  cursor: 'pointer',
  '&:hover': {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: `0 20px 40px ${color}20`,
    borderColor: `${color}50`
  },
  '& .icon': {
    fontSize: '3rem',
    color: color,
    marginBottom: theme.spacing(2),
    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.1))'
  },
  '& .number': {
    fontSize: '2.5rem',
    fontWeight: 800,
    color: color,
    marginBottom: theme.spacing(1),
    textShadow: '0 2px 4px rgba(0,0,0,0.1)'
  },
  '& .label': {
    fontSize: '1rem',
    fontWeight: 600,
    color: '#64748b',
    textTransform: 'uppercase',
    letterSpacing: '0.5px'
  }
}));

const UsersManagementMain = () => {
  const [activeTab, setActiveTab] = useState(0);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const tabs = [
    {
      label: 'Lista de Usuarios',
      icon: <People />,
      component: <UsersList />,
      description: 'Gestiona usuarios existentes del sistema'
    },
    {
      label: 'Registro de Usuarios',
      icon: <PersonAdd />,
      component: <UserRegistrationForm />,
      description: 'Registra nuevos usuarios con roles específicos'
    },
    {
      label: 'Gestión de Roles',
      icon: <AdminPanelSettings />,
      component: <RoleManagementForm />,
      description: 'Crea y gestiona roles y permisos del sistema'
    }
  ];

  // Mock data para estadísticas (en producción vendría de la API)
  const stats = [
    { icon: <People />, number: '4', label: 'Total Usuarios', color: '#667eea' },
    { icon: <AdminPanelSettings />, number: '2', label: 'Administradores', color: '#f39c12' },
    { icon: <Security />, number: '4', label: 'Usuarios Activos', color: '#27ae60' },
    { icon: <PersonAdd />, number: '3', label: 'Nuevos Este Mes', color: '#e74c3c' }
  ];

  return (
    <StyledContainer maxWidth="xl">
      {/* Header con título principal */}
      <HeaderSection>
        <Typography className="main-title" component="h1">
          👥 Gestión Completa de Usuarios y Roles
        </Typography>
        <Typography className="subtitle">
          Sistema de administración avanzado para Super Administradores. 
          Gestiona usuarios, roles y permisos con una interfaz moderna e intuitiva.
        </Typography>
      </HeaderSection>

      {/* Tarjetas de estadísticas */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          {stats.map((stat, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <StatsCard color={stat.color}>
                <Box className="icon">{stat.icon}</Box>
                <Typography className="number">{stat.number}</Typography>
                <Typography className="label">{stat.label}</Typography>
              </StatsCard>
            </Grid>
          ))}
        </Grid>
      </Box>

      {/* Contenedor principal con pestañas */}
      <StyledPaper elevation={0}>
        {/* Barra de pestañas mejorada */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <StyledTabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="Gestión de usuarios y roles"
            variant={isMobile ? "scrollable" : "fullWidth"}
            scrollButtons={isMobile ? "auto" : false}
          >
            {tabs.map((tab, index) => (
              <Tab
                key={index}
                label={
                  <Box display="flex" alignItems="center" gap={1.5} sx={{ minWidth: 'auto' }}>
                    {tab.icon}
                    <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                      {tab.label}
                    </Box>
                  </Box>
                }
                id={`users-tab-${index}`}
                aria-controls={`users-tabpanel-${index}`}
              />
            ))}
          </StyledTabs>
        </Box>

        {/* Descripción de la pestaña activa */}
        <Box sx={{ 
          p: 3, 
          background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
          borderBottom: '1px solid rgba(0,0,0,0.05)'
        }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Box sx={{ 
              p: 1.5, 
              borderRadius: '12px', 
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white'
            }}>
              {tabs[activeTab].icon}
            </Box>
            <Box>
              <Typography variant="h5" component="h2" fontWeight={700} color="#1e293b">
                {tabs[activeTab].label}
              </Typography>
              <Typography variant="body1" color="#64748b" sx={{ mt: 0.5 }}>
                {tabs[activeTab].description}
              </Typography>
            </Box>
          </Box>
        </Box>

        {/* Contenido de las pestañas */}
        {tabs.map((tab, index) => (
          <TabPanel key={index} value={activeTab} index={index}>
            {tab.component}
          </TabPanel>
        ))}
      </StyledPaper>


    </StyledContainer>
  );
};

export default UsersManagementMain;
