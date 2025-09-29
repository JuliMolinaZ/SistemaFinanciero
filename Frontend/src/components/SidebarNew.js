// src/components/SidebarNew.js - Sidebar moderno con sistema de permisos actualizado
import React, { useContext, useState, useEffect, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { usePermissions } from '../hooks/usePermissions';
import {
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Toolbar,
  Box,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Fade,
  Tooltip,
  Fab,
  Zoom,
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  Dashboard,
  Home,
  People,
  Business,
  Folder,
  Payment,
  Settings,
  AccountBalance,
  Receipt,
  Assessment,
  Timeline,
  RequestPage,
  Category,
  AttachMoney,
  TrendingUp,
  Assignment,
  Group,
  Security,
  Build,
  Description,
  AccountTree,
  Schedule,
  LocalAtm,
  MonetizationOn,
  Inventory,
  Store,
  ReceiptLong,
  TrendingDown,
  Analytics,
  Speed,
  Flag,
  CheckCircle,
  Warning,
  Info,
  Star,
  Diamond,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidthOpen = 300;
const drawerWidthClosed = 80;

// Componente para evitar props innecesarias en NavLink
const LinkBehavior = forwardRef((props, ref) => {
  const { button, ...other } = props;
  return <NavLink ref={ref} {...other} />;
});

// Configuración de módulos con permisos y categorías
const modulesConfig = [
  {
    category: 'Principal',
    modules: [
      {
        id: 'dashboard',
        name: 'Dashboard',
        route: '/dashboard-ultra',
        icon: <Dashboard />,
        requiredPermission: null,
        requiredRole: ['administrador', 'super administrador', 'gerente', 'pm'],
        description: 'Panel principal con métricas y gráficos',
        color: '#4ecdc4',
        featured: true
      }
    ]
  },
  {
    category: 'Gestión',
    modules: [
      {
        id: 'usuarios',
        name: 'Usuarios',
        route: '/usuarios',
        icon: <People />,
        requiredPermission: 'usuarios',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de usuarios del sistema',
        color: '#ff6b6b'
      },
      {
        id: 'clientes',
        name: 'Clientes',
        route: '/clientes',
        icon: <Business />,
        requiredPermission: 'clientes',
        requiredRole: null,
        description: 'Gestión de clientes',
        color: '#96ceb4'
      },
      {
        id: 'proyectos',
        name: 'Proyectos (Financiero)',
        route: '/proyectos',
        icon: <Folder />,
        requiredPermission: 'proyectos',
        requiredRole: ['administrador', 'super administrador', 'gerente', 'pm'],
        description: 'Gestión financiera de proyectos (solo roles administrativos)',
        color: '#feca57'
      },
      {
        id: 'project_management',
        name: 'Gestión de Proyectos',
        route: '/project-management',
        icon: <Timeline />,
        requiredPermission: 'project_management',
        requiredRole: ['administrador', 'super administrador', 'gerente', 'pm', 'dev', 'desarrollador', 'operador'],
        description: '🚀 Gestión avanzada de proyectos con metodologías ágiles',
        color: '#667eea',
        featured: true
      },
      {
        id: 'proveedores',
        name: 'Proveedores',
        route: '/proveedores',
        icon: <Store />,
        requiredPermission: 'proveedores',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de proveedores',
        color: '#ff9ff3'
      }
    ]
  },
  {
    category: 'Finanzas',
    modules: [
      {
        id: 'cuentas_pagar',
        name: 'Cuentas por Pagar',
        route: '/cuentas-pagar',
        icon: <Payment />,
        requiredPermission: 'cuentas_pagar',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de cuentas por pagar',
        color: '#ff6348'
      },
      {
        id: 'cuentas_cobrar',
        name: 'Cuentas por Cobrar',
        route: '/cuentas-cobrar',
        icon: <Receipt />,
        requiredPermission: 'cuentas_cobrar',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de cuentas por cobrar',
        color: '#2ed573'
      },
      {
        id: 'contabilidad',
        name: 'Contabilidad',
        route: '/contabilidad',
        icon: <AccountBalance />,
        requiredPermission: 'contabilidad',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Módulo de contabilidad',
        color: '#3742fa'
      },
      {
        id: 'costos_fijos',
        name: 'Costos Fijos',
        route: '/costos-fijos',
        icon: <AttachMoney />,
        requiredPermission: 'costos_fijos',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de costos fijos',
        color: '#ffa502'
      }
    ]
  },
  {
    category: 'Operaciones',
    modules: [
      {
        id: 'categorias',
        name: 'Categorías',
        route: '/categorias',
        icon: <Category />,
        requiredPermission: 'categorias',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de categorías',
        color: '#a4b0be'
      },
      {
        id: 'recuperacion',
        name: 'Recuperación',
        route: '/recuperacion',
        icon: <TrendingUp />,
        requiredPermission: 'recuperacion',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Módulo de recuperación',
        color: '#26de81'
      },
      {
        id: 'requisiciones',
        name: 'Requisiciones',
        route: '/requisiciones',
        icon: <RequestPage />,
        requiredPermission: 'requisiciones',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de requisiciones',
        color: '#fd79a8'
      },
      {
        id: 'emitidas',
        name: 'Facturas Emitidas',
        route: '/emitidas',
        icon: <ReceiptLong />,
        requiredPermission: 'emitidas',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Facturas emitidas',
        color: '#fdcb6e'
      },
      {
        id: 'cotizaciones',
        name: 'Cotizaciones',
        route: '/cotizaciones',
        icon: <Description />,
        requiredPermission: 'cotizaciones',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de cotizaciones',
        color: '#6c5ce7'
      }
    ]
  },
  {
    category: 'Sistema',
    modules: [
      {
        id: 'flow_recovery_v2',
        name: 'Flow Recovery V2',
        route: '/flow-recovery-v2',
        icon: <TrendingDown />,
        requiredPermission: 'flow_recovery_v2',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Flow Recovery V2',
        color: '#e17055'
      },
      {
        id: 'horas_extra',
        name: 'Horas Extra',
        route: '/horas-extra',
        icon: <Schedule />,
        requiredPermission: 'horas_extra',
        requiredRole: null,
        description: 'Gestión de horas extra',
        color: '#00b894'
      },
      {
        id: 'fases',
        name: 'Fases',
        route: '/fases',
        icon: <AccountTree />,
        requiredPermission: 'fases',
        requiredRole: ['administrador', 'super administrador'],
        description: 'Gestión de fases de proyectos',
        color: '#74b9ff'
      },
      {
        id: 'mi_perfil',
        name: 'Mi Perfil',
        route: '/mi-perfil',
        icon: <Settings />,
        requiredPermission: null,
        requiredRole: null,
        description: 'Configuración de perfil personal',
        color: '#636e72'
      },
      {
        id: 'permisos',
        name: 'Permisos',
        route: '/permisos',
        icon: <Security />,
        requiredPermission: 'permisos',
        requiredRole: ['super administrador'],
        description: 'Gestión de permisos del sistema',
        color: '#e84393'
      }
    ]
  }
];

const SidebarNew = () => {
  const { sidebarFullyMinimized, setSidebarFullyMinimized, profileData, profileComplete } = useContext(GlobalContext);
  const { 
    permissions, 
    loading: permissionsLoading, 
    error: permissionsError, 
    isSuperAdmin,
    canViewModule,
    hasPermission 
  } = usePermissions();

  // Función única para alternar entre abierto y cerrado (solo 2 estados)
  const toggleSidebar = () => {
    setSidebarFullyMinimized(!sidebarFullyMinimized);
  };

  // Función para verificar si un módulo debe ser visible
  const isModuleVisible = (module) => {
    const userRole = profileData?.role?.toLowerCase();

    // RESTRICCIÓN ESPECÍFICA: Desarrollador y Operador solo pueden ver project_management y mi_perfil
    if (userRole === 'desarrollador' || userRole === 'operador') {
      return module.id === 'project_management' || module.id === 'mi_perfil';
    }

    // Si es Super Admin, puede ver todo
    if (isSuperAdmin) {
      return true;
    }

    // Si el perfil no está completo, solo mostrar "Mi Perfil" Y Gestión de Proyectos para Desarrolladores
    if (!profileComplete && module.id !== 'mi_perfil' && module.id !== 'project_management') {
      return false;
    }

    // Verificar permisos específicos primero
    if (module.requiredPermission && canViewModule) {
      const hasPermission = canViewModule(module.requiredPermission);
      if (hasPermission) {
        return true;
      }
    }

    // Verificar roles específicos
    if (module.requiredRole && profileData?.role) {
      const hasRole = module.requiredRole.some(role =>
        role.toLowerCase() === userRole
      );
      if (hasRole) {
        return true;
      }
    }

    // Si no tiene ni permisos ni roles requeridos, es visible para todos
    if (!module.requiredPermission && !module.requiredRole) {
      return true;
    }

    return false;
  };

  // Filtrar módulos visibles por categoría
  const visibleCategories = modulesConfig.map(category => ({
    ...category,
    modules: category.modules.filter(isModuleVisible)
  })).filter(category => category.modules.length > 0);

  // Estilos simplificados (solo estado abierto)
  const drawerSx = {
    top: '60px',
    width: drawerWidthOpen,
    flexShrink: 0,
    '& .MuiDrawer-paper': {
      top: '60px',
      height: 'calc(100vh - 60px)',
      width: drawerWidthOpen,
      boxSizing: 'border-box',
      background: 'linear-gradient(180deg, rgba(26, 26, 46, 0.95) 0%, rgba(26, 26, 46, 0.85) 100%)',
      backdropFilter: 'blur(20px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      boxShadow: '4px 0 20px rgba(0, 0, 0, 0.3)',
      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      position: 'fixed',
      zIndex: 1200,
    },
  };

  const headerSx = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    px: 2,
    py: 2,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
  };

  const userInfoSx = {
    px: 2,
    py: 2,
    borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
    background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
  };

  const listItemSx = {
    color: '#fff',
    my: 0.5,
    mx: 1,
    borderRadius: 2,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&::before': {
      content: '""',
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
      opacity: 0,
      transition: 'opacity 0.3s ease',
    },
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.1)',
      boxShadow: '0 8px 25px rgba(0,0,0,0.2)',
      transform: 'translateX(8px) scale(1.02)',
      '&::before': {
        opacity: 1,
      },
    },
    '&.active': {
      background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.3) 0%, rgba(118, 75, 162, 0.3) 100%)',
      boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
      transform: 'translateX(8px) scale(1.02)',
      '&::before': {
        opacity: 1,
      },
    },
  };

  const listItemIconSx = {
    minWidth: 0,
    mr: 2,
    justifyContent: 'center',
    fontSize: '1.3rem',
    color: 'inherit',
    transition: 'all 0.3s ease',
  };

  const listItemTextSx = {
    '& .MuiListItemText-primary': {
      fontSize: '0.9rem',
      fontWeight: 600,
      letterSpacing: '0.5px',
    },
  };

  const categoryHeaderSx = {
    px: 2,
    py: 1,
    mt: 2,
    mb: 1,
    color: 'rgba(255,255,255,0.7)',
    fontSize: '0.75rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '1px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  };

  if (permissionsLoading) {
    return (
      <Drawer variant="permanent" sx={drawerSx}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'center', 
          alignItems: 'center',
          height: '100%',
          background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.1) 100%)',
        }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <CircularProgress 
              sx={{ 
                color: '#667eea',
                '& .MuiCircularProgress-circle': {
                  strokeLinecap: 'round',
                }
              }} 
              size={40}
            />
          </motion.div>
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2, 
              color: 'rgba(255,255,255,0.8)', 
              textAlign: 'center',
              fontWeight: 500
            }}
          >
            Cargando permisos...
          </Typography>
        </Box>
      </Drawer>
    );
  }

  if (permissionsError) {
    return (
      <Drawer variant="permanent" sx={drawerSx}>
        <Box sx={{ p: 2, height: '100%', display: 'flex', alignItems: 'center' }}>
          <Alert severity="error" sx={{ width: '100%' }}>
            Error al cargar permisos
          </Alert>
        </Box>
      </Drawer>
    );
  }

  // Si está completamente minimizado, solo mostrar el botón flotante
  if (sidebarFullyMinimized) {
    return (
      <>
        <Zoom in={sidebarFullyMinimized}>
          <Fab
            onClick={toggleSidebar}
            sx={{
              position: 'fixed',
              top: 100, // Cambiado de 20 a 100 para evitar superposición con el header
              left: 20,
              zIndex: 1200, // Reducido de 1300 a 1200 para estar debajo del header
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              width: 50,
              height: 50,
              boxShadow: '0 4px 20px rgba(102, 126, 234, 0.3)',
              '&:hover': {
                background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
                transform: 'scale(1.05)',
                boxShadow: '0 6px 25px rgba(102, 126, 234, 0.4)',
              },
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              // Asegurar que no interfiera con otros elementos
              pointerEvents: 'auto',
            }}
            title="Mostrar sidebar"
          >
            <MenuIcon sx={{ fontSize: '1.2rem' }} />
          </Fab>
        </Zoom>
      </>
    );
  }

  return (
    <>
      <Drawer variant="permanent" sx={drawerSx}>
      {/* Header del Sidebar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <Box sx={headerSx}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Diamond sx={{ color: '#667eea', fontSize: '1.5rem' }} />
          </Box>
          <IconButton 
            onClick={toggleSidebar} 
            sx={{ 
              color: '#fff',
              background: 'rgba(255,255,255,0.1)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)',
              '&:hover': {
                backgroundColor: 'rgba(255,255,255,0.2)',
                transform: 'scale(1.1)',
              },
              transition: 'all 0.3s ease',
            }}
          >
            <CloseIcon />
          </IconButton>
          
        </Box>
      </motion.div>

      {/* Información del usuario */}
      {profileData && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Box sx={userInfoSx}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Avatar
                src={profileData.avatar}
                sx={{
                  width: 40,
                  height: 40,
                  border: '2px solid rgba(255,255,255,0.3)',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
                }}
              >
                {profileData.name?.charAt(0) || 'U'}
              </Avatar>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    color: '#fff', 
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                >
                  {profileData.name || 'Usuario'}
                </Typography>
                <Chip
                  label={profileData.role || 'Sin rol'}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(102, 126, 234, 0.2)',
                    color: '#667eea',
                    fontSize: '0.7rem',
                    height: 20,
                    '& .MuiChip-label': {
                      px: 1,
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </motion.div>
      )}

      {/* Lista de módulos */}
      <Box
        sx={{
          flexGrow: 1,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: 'rgba(255,255,255,0.3) transparent',
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255,255,255,0.3)',
            borderRadius: '3px',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255,255,255,0.5)',
          },
        }}
      >
        <List sx={{ px: 1, py: 2 }}>
          <AnimatePresence>
            {visibleCategories.map((category, categoryIndex) => (
              <motion.div
                key={category.category}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.1 }}
              >
                <Typography sx={categoryHeaderSx}>
                  {category.category}
                </Typography>
                {category.modules.map((module, moduleIndex) => (
                  <motion.div
                    key={module.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ 
                      duration: 0.4, 
                      delay: (categoryIndex * 0.1) + (moduleIndex * 0.05) 
                    }}
                  >
                    <Tooltip
                      title=""
                      placement="right"
                      arrow
                    >
                      <ListItemButton
                        component={LinkBehavior}
                        to={module.route}
                        sx={listItemSx}
                      >
                        <ListItemIcon sx={listItemIconSx}>
                          <Box
                            sx={{
                              color: module.color,
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              width: '100%',
                              height: '100%',
                            }}
                          >
                            {module.icon}
                          </Box>
                        </ListItemIcon>
                        <ListItemText
                          primary={module.name}
                          sx={listItemTextSx}
                        />
                        {module.featured && (
                          <Star sx={{
                            fontSize: '1rem',
                            color: '#ffd700',
                            ml: 1
                          }} />
                        )}
                      </ListItemButton>
                    </Tooltip>
                  </motion.div>
                ))}
              </motion.div>
            ))}
          </AnimatePresence>
        </List>
      </Box>

      {/* Footer del Sidebar */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <Box sx={{ 
            px: 2, 
            py: 2, 
            borderTop: '1px solid rgba(255,255,255,0.1)',
            background: 'linear-gradient(135deg, rgba(102, 126, 234, 0.05) 0%, rgba(118, 75, 162, 0.05) 100%)',
            textAlign: 'center'
          }}>
            <Typography 
              variant="caption" 
              sx={{ 
                color: 'rgba(255,255,255,0.6)', 
                fontSize: '0.7rem',
                fontWeight: 500
              }}
            >
              {visibleCategories.reduce((total, cat) => total + cat.modules.length, 0)} módulos disponibles
            </Typography>
          </Box>
        </motion.div>
      </Drawer>
      
    </>
  );
};

export default SidebarNew;