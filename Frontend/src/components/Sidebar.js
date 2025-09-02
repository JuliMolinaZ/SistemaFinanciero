// src/components/Sidebar.js
import React, { useContext, useEffect, useState, forwardRef } from 'react';
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
  Tooltip,
  Chip,
  Typography,
} from '@mui/material';
import {
  ChevronLeft,
  ChevronRight,
  Home as HomeIcon,
  People as PeopleIcon,
  Business as BusinessIcon,
  AccountBalance as AccountBalanceIcon,
  Receipt as ReceiptIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  TrendingUp as TrendingUpIcon,
  AccountCircle as AccountCircleIcon,
  Category as CategoryIcon,
  Description as DescriptionIcon,
  LocalOffer as LocalOfferIcon,
  Security as SecurityIcon,
  Refresh as RefreshIcon,

  AttachMoney as AttachMoneyIcon,
  Work as WorkIcon,
  Analytics,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

const drawerWidthOpen = 280;
const drawerWidthClosed = 70;

// Componente para evitar props innecesarias en NavLink
const LinkBehavior = forwardRef((props, ref) => {
  const { button, ...other } = props;
  return <NavLink ref={ref} {...other} />;
});

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, profileData } = useContext(GlobalContext);
  const [activeModule, setActiveModule] = useState('');
  
  // Crear un objeto currentUser compatible con usePermissions
  const currentUser = profileData ? {
    uid: profileData.firebase_uid,
    email: profileData.email,
    role: profileData.role
  } : null;
  
  const { canViewModule, loading: permissionsLoading } = usePermissions();

  // Detectar módulo activo basado en la URL
  useEffect(() => {
    const path = window.location.pathname;
    setActiveModule(path);
  }, []);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Normalizamos el rol y determinamos si es Super Administrador
  const userRole = profileData?.role || '';
  const normalizedRole = userRole.trim().toLowerCase();
  const isSuperAdmin = normalizedRole === 'super administrador';
  
  // Debug logging
  console.log('🔍 Sidebar Debug:');
  console.log('  profileData:', profileData);
  console.log('  userRole:', userRole);
  console.log('  normalizedRole:', normalizedRole);
  console.log('  isSuperAdmin:', isSuperAdmin);
  console.log('  currentUser:', currentUser);
  
  // Función que retorna true para cualquier módulo si el usuario es Super Administrador
  const hasPermission = (modulo) => {
    // Super Administrador tiene acceso a TODOS los módulos
    if (isSuperAdmin) return true;
    
    // Para otros roles, usar el nuevo sistema de permisos
    return canViewModule(modulo);
  };

  // Configuración de módulos con iconos modernos
  const menuItems = [
    {
      path: '/dashboard-ultra',
      name: '🚀 Dashboard Ultra',
      icon: <Analytics />,
      permission: 'dashboard',
    },
    {
      path: '/usuarios',
      name: 'Usuarios',
      icon: <AccountCircleIcon />,
      permission: 'usuarios',
    },
    {
      path: '/clientes',
      name: 'Clientes',
      icon: <PeopleIcon />,
      permission: 'clientes',
    },
    {
      path: '/proyectos',
      name: 'Proyectos',
      icon: <WorkIcon />,
      permission: 'proyectos',
    },
    {
      path: '/cuentas-cobrar',
      name: 'Cuentas por Cobrar',
      icon: <AttachMoneyIcon />,
      permission: 'cuentas_por_cobrar',
    },
    {
      path: '/costos-fijos',
      name: 'Costos Fijos',
      icon: <ReceiptIcon />,
      permission: 'costos_fijos',
    },
    {
      path: '/cuentas-pagar',
      name: 'Cuentas por Pagar',
      icon: <AccountBalanceIcon />,
      permission: 'cuentas_por_pagar',
    },
    {
      path: '/impuestos-imss',
      name: 'Impuestos e IMSS',
      icon: <ReceiptIcon />,
      permission: 'impuestos_imss',
    },
    {
      path: '/proveedores',
      name: 'Proveedores',
      icon: <BusinessIcon />,
      permission: 'proveedores',
    },
    {
      path: '/contabilidad',
      name: 'Contabilidad',
      icon: <AssessmentIcon />,
      permission: 'contabilidad',
    },
    {
      path: '/categorias',
      name: 'Categorías',
      icon: <CategoryIcon />,
      permission: 'categorias',
    },
    {
      path: '/emitidas',
      name: 'Facturas Emitidas',
      icon: <DescriptionIcon />,
      permission: 'emitidas',
    },
    {
      path: '/cotizaciones',
      name: 'Cotizaciones',
      icon: <LocalOfferIcon />,
      permission: 'cotizaciones',
    },
    {
      path: '/flow-recovery-v2',
      name: 'Flow Recovery V2',
      icon: <RefreshIcon />,
      permission: 'flow_recovery_v2',
    },
    {
      path: '/money-flow-recovery',
      name: 'MoneyFlow Recovery',
      icon: <AttachMoneyIcon />,
      permission: 'moneyflow_recovery',
    },

    {
      path: '/horas-extra',
      name: 'Horas Extra',
      icon: <WorkIcon />,
      permission: 'horas_extra',
    },
  ];

  const shouldShowItem = (item) => {
    // Si no hay permisos configurados, mostrar solo para Super Admin
    if (!item.permission) {
      return isSuperAdmin;
    }
    
    // Verificar permisos usando el nuevo sistema
    return hasPermission(item.permission);
  };

  const filteredMenuItems = menuItems.filter(shouldShowItem);

  return (
    <motion.div
      initial={{ x: -drawerWidthOpen, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <Drawer
        variant="permanent"
        sx={{
          top: '80px',
          width: sidebarCollapsed ? drawerWidthClosed : drawerWidthOpen,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            top: '80px',
            height: 'calc(100vh - 80px)',
            width: sidebarCollapsed ? drawerWidthClosed : drawerWidthOpen,
            boxSizing: 'border-box',
            background: 'rgba(26, 26, 46, 0.9)',
            backdropFilter: 'blur(20px)',
            borderRight: '1px solid rgba(255, 255, 255, 0.1)',
            transition: 'width 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          },
        }}
      >
        {/* Header del Sidebar */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Toolbar
            sx={{
              display: 'flex',
              justifyContent: sidebarCollapsed ? 'center' : 'space-between',
              alignItems: 'center',
              px: sidebarCollapsed ? 1 : 2,
              py: 1,
              minHeight: 60,
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.4 }}
              >
                <Typography
                  variant="subtitle2"
                  sx={{
                    color: 'rgba(255, 255, 255, 0.7)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  Navegación
                </Typography>
              </motion.div>
            )}
            
            <motion.div
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Tooltip title={sidebarCollapsed ? "Expandir" : "Contraer"} arrow>
                <IconButton
                  onClick={toggleSidebar}
                  sx={{
                    color: 'rgba(255, 255, 255, 0.8)',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    '&:hover': {
                      background: 'rgba(255, 255, 255, 0.2)',
                      color: 'white',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
                </IconButton>
              </Tooltip>
            </motion.div>
          </Toolbar>
        </motion.div>

        {/* Lista de módulos */}
        <Box sx={{ flexGrow: 1, overflowY: 'auto', py: 1 }}>
          {permissionsLoading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                Cargando permisos...
              </Typography>
            </Box>
          ) : (
            <>
              {/* Debug info - solo en desarrollo */}
              {process.env.NODE_ENV === 'development' && (
                <Box sx={{ p: 1, mb: 1 }}>
                  <Typography variant="caption" sx={{ color: 'rgba(255, 255, 255, 0.5)', fontSize: '0.7rem' }}>
                    Rol: {userRole} | Módulos: {filteredMenuItems.length}
                  </Typography>
                </Box>
              )}
              
              <List sx={{ px: 1 }}>
                <AnimatePresence>
                  {filteredMenuItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  exit={{ x: -50, opacity: 0 }}
                >
                  <ListItemButton
                    component={LinkBehavior}
                    to={item.path}
                    sx={{
                      color: 'rgba(255, 255, 255, 0.8)',
                      my: 0.5,
                      borderRadius: 2,
                      background: activeModule === item.path 
                        ? 'linear-gradient(135deg, rgba(79, 172, 254, 0.2) 0%, rgba(0, 242, 254, 0.2) 100%)'
                        : 'transparent',
                      border: activeModule === item.path 
                        ? '1px solid rgba(79, 172, 254, 0.3)'
                        : '1px solid transparent',
                      backdropFilter: activeModule === item.path ? 'blur(10px)' : 'none',
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: '-100%',
                        width: '100%',
                        height: '100%',
                        background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)',
                        transition: 'left 0.5s ease',
                      },
                      '&:hover': {
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(255, 255, 255, 0.3)',
                        transform: 'translateX(5px)',
                        '&::before': {
                          left: '100%',
                        },
                      },
                      '&.active': {
                        background: 'linear-gradient(135deg, rgba(79, 172, 254, 0.3) 0%, rgba(0, 242, 254, 0.3) 100%)',
                        border: '1px solid rgba(79, 172, 254, 0.5)',
                        boxShadow: '0 4px 15px rgba(79, 172, 254, 0.3)',
                      },
                    }}
                    onClick={() => setActiveModule(item.path)}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: sidebarCollapsed ? 0 : 40,
                        mr: sidebarCollapsed ? 0 : 2,
                        justifyContent: 'center',
                        color: activeModule === item.path 
                          ? '#4facfe'
                          : 'rgba(255, 255, 255, 0.7)',
                        fontSize: '1.4rem',
                        transition: 'all 0.3s ease',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    
                    {!sidebarCollapsed && (
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        style={{ flex: 1 }}
                      >
                        <ListItemText
                          primary={
                            <Typography
                              sx={{
                                fontWeight: activeModule === item.path ? 600 : 500,
                                fontSize: '0.9rem',
                                color: activeModule === item.path 
                                  ? 'white'
                                  : 'rgba(255, 255, 255, 0.8)',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {item.name}
                            </Typography>
                          }
                        />
                      </motion.div>
                    )}
                  </ListItemButton>
                </motion.div>
              ))}
            </AnimatePresence>
          </List>
            </>
          )}
        </Box>

        {/* Footer del Sidebar */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.1)', my: 1 }} />
          
          <Box sx={{ p: 2, textAlign: 'center' }}>
            {!sidebarCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.8 }}
              >
                <Chip
                  label="v2.0.0"
                  size="small"
                  sx={{
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                    color: 'white',
                    fontWeight: 600,
                    fontSize: '0.7rem',
                    mb: 1,
                  }}
                />
                <Typography
                  variant="caption"
                  sx={{
                    display: 'block',
                    color: 'rgba(255, 255, 255, 0.5)',
                    fontSize: '0.7rem',
                    fontWeight: 500,
                  }}
                >
                  SIGMA System
                </Typography>
              </motion.div>
            )}
          </Box>
        </motion.div>
      </Drawer>
    </motion.div>
  );
};

export default Sidebar;
