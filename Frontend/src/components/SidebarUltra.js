// src/components/SidebarUltra.js - Sidebar ultra moderno con minimización completa
import React, { useContext, useState, useEffect } from 'react';
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
  Box,
  Typography,
  CircularProgress,
  Alert,
  Avatar,
  Chip,
  Fade,
  Tooltip,
  Fab,
  Badge,
  Zoom,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { 
  ChevronLeft, 
  ChevronRight,
  Dashboard,
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
  Diamond,
  Menu as MenuIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';

// Componente de botón flotante ultra moderno
const FloatingMenuButton = ({ onClick, isOpen }) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0, opacity: 0 }}
      transition={{ duration: 0.3, type: "spring", stiffness: 260, damping: 20 }}
      style={{
        position: 'fixed',
        top: 100, // Cambiado de 20 a 100 para evitar superposición con el header
        left: 20,
        zIndex: 1200, // Reducido de 1300 a 1200 para estar debajo del header
      }}
    >
      <Fab
        onClick={onClick}
        sx={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          width: 60,
          height: 60,
          boxShadow: '0 8px 32px rgba(102, 126, 234, 0.4)',
          '&:hover': {
            background: 'linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)',
            transform: 'scale(1.1)',
            boxShadow: '0 12px 40px rgba(102, 126, 234, 0.6)',
          },
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <CloseIcon /> : <MenuIcon />}
        </motion.div>
      </Fab>
    </motion.div>
  );
};

// Componente de sidebar minimizado (solo iconos)
const MinimizedSidebar = ({ modules, onModuleClick, user, permissions }) => {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 80,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 80,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          position: 'relative',
        },
      }}
    >
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 80, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          paddingTop: 20,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {/* Logo minimizado */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, duration: 0.3 }}
        style={{ marginBottom: 30 }}
      >
        <Box
          sx={{
            width: 50,
            height: 50,
            borderRadius: '15px',
            background: 'rgba(255,255,255,0.2)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <Diamond sx={{ color: 'white', fontSize: 28 }} />
        </Box>
      </motion.div>

      {/* Módulos minimizados */}
      <Box sx={{ flex: 1, width: '100%', px: 1 }}>
        {modules.map((module, index) => {
          const canView = permissions?.canViewModule?.(module.id) ?? true;
          if (!canView) return null;

          return (
            <motion.div
              key={module.id}
              initial={{ x: -50, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
            >
              <Tooltip title={module.name} placement="right" arrow>
                <IconButton
                  component={NavLink}
                  to={module.route}
                  sx={{
                    width: 50,
                    height: 50,
                    mb: 1,
                    borderRadius: '15px',
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'scale(1.1)',
                    },
                    '&.active': {
                      background: 'rgba(255,255,255,0.3)',
                      boxShadow: '0 4px 20px rgba(255,255,255,0.3)',
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  {module.icon}
                </IconButton>
              </Tooltip>
            </motion.div>
          );
        })}
      </Box>

      {/* Usuario minimizado */}
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.3 }}
        style={{ marginBottom: 20 }}
      >
        <Tooltip title={user?.name || 'Usuario'} placement="right" arrow>
          <Avatar
            src={user?.avatar}
            sx={{
              width: 50,
              height: 50,
              border: '2px solid rgba(255,255,255,0.3)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
        </Tooltip>
      </motion.div>
      </motion.div>
    </Drawer>
  );
};

// Componente de sidebar expandido
const ExpandedSidebar = ({ modules, onModuleClick, user, permissions, onMinimize }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 280,
          boxSizing: 'border-box',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          position: 'relative',
        },
      }}
    >
      <motion.div
        initial={{ width: 0, opacity: 0 }}
        animate={{ width: 280, opacity: 1 }}
        exit={{ width: 0, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
      {/* Header expandido */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.3 }}
        style={{
          padding: '20px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          position: 'relative',
        }}
      >
        {/* Botón de minimizar */}
        <IconButton
          onClick={onMinimize}
          sx={{
            position: 'absolute',
            top: 15,
            right: 15,
            color: 'white',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            '&:hover': {
              background: 'rgba(255,255,255,0.2)',
            },
          }}
        >
          <ChevronLeft />
        </IconButton>

        {/* Logo y título */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, pr: 5 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '15px',
              background: 'rgba(255,255,255,0.2)',
              backdropFilter: 'blur(20px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '1px solid rgba(255,255,255,0.3)',
            }}
          >
            <Diamond sx={{ color: 'white', fontSize: 28 }} />
          </Box>
          <Box>
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 700,
                fontSize: '1.2rem',
              }}
            >
              SIGMA
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.75rem',
              }}
            >
              Sistema Integral
            </Typography>
          </Box>
        </Box>
      </motion.div>

      {/* Módulos expandidos */}
      <Box sx={{ flex: 1, overflow: 'auto', py: 2 }}>
        <List sx={{ px: 2 }}>
          {modules.map((module, index) => {
            const canView = permissions?.canViewModule?.(module.id) ?? true;
            if (!canView) return null;

            return (
              <motion.div
                key={module.id}
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.3 }}
              >
                <ListItemButton
                  component={NavLink}
                  to={module.route}
                  onClick={() => onModuleClick(module.id)}
                  sx={{
                    borderRadius: '15px',
                    mb: 1,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    color: 'white',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      transform: 'translateX(5px)',
                    },
                    '&.active': {
                      background: 'rgba(255,255,255,0.3)',
                      boxShadow: '0 4px 20px rgba(255,255,255,0.3)',
                      '& .MuiListItemIcon-root': {
                        color: 'white',
                      },
                      '& .MuiListItemText-primary': {
                        fontWeight: 600,
                      },
                    },
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: 'rgba(255,255,255,0.9)',
                      minWidth: 40,
                    }}
                  >
                    {module.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={module.name}
                    sx={{
                      '& .MuiListItemText-primary': {
                        fontSize: '0.95rem',
                        fontWeight: 500,
                      },
                    }}
                  />
                </ListItemButton>
              </motion.div>
            );
          })}
        </List>
      </Box>

      {/* Usuario expandido */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.3 }}
        style={{
          padding: '20px',
          borderTop: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 2,
            p: 2,
            borderRadius: '15px',
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
          }}
        >
          <Avatar
            src={user?.avatar}
            sx={{
              width: 45,
              height: 45,
              border: '2px solid rgba(255,255,255,0.3)',
            }}
          >
            {user?.name?.charAt(0) || 'U'}
          </Avatar>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="subtitle2"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '0.9rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
              {user?.name || 'Usuario'}
            </Typography>
            <Typography
              variant="caption"
              sx={{
                color: 'rgba(255,255,255,0.8)',
                fontSize: '0.75rem',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
                display: 'block',
              }}
            >
              {user?.email || 'usuario@ejemplo.com'}
            </Typography>
            {user?.role && (
              <Chip
                label={user.role}
                size="small"
                sx={{
                  mt: 0.5,
                  background: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  fontSize: '0.7rem',
                  height: 20,
                }}
              />
            )}
          </Box>
        </Box>
      </motion.div>
      </motion.div>
    </Drawer>
  );
};

// Componente principal
const SidebarUltra = () => {
  const { user, profileComplete, authLoading } = useContext(GlobalContext);
  const { permissions, loading: permissionsLoading } = usePermissions();
  const [isMinimized, setIsMinimized] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // Configuración de módulos
  const modulesConfig = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      route: '/dashboard-ultra',
      icon: <Dashboard />,
    },
    {
      id: 'usuarios',
      name: 'Usuarios',
      route: '/usuarios',
      icon: <People />,
    },
    {
      id: 'clientes',
      name: 'Clientes',
      route: '/clientes',
      icon: <Business />,
    },
    {
      id: 'proyectos',
      name: 'Proyectos',
      route: '/proyectos',
      icon: <Folder />,
    },
    {
      id: 'cuentas-pagar',
      name: 'Cuentas por Pagar',
      route: '/cuentas-pagar',
      icon: <Payment />,
    },
    {
      id: 'cuentas-cobrar',
      name: 'Cuentas por Cobrar',
      route: '/cuentas-cobrar',
      icon: <Receipt />,
    },
    {
      id: 'contabilidad',
      name: 'Contabilidad',
      route: '/contabilidad',
      icon: <AccountBalance />,
    },
    {
      id: 'categorias',
      name: 'Categorías',
      route: '/categorias',
      icon: <Category />,
    },
    {
      id: 'proveedores',
      name: 'Proveedores',
      route: '/proveedores',
      icon: <Group />,
    },
    {
      id: 'emitidas',
      name: 'Facturas Emitidas',
      route: '/emitidas',
      icon: <Description />,
    },
    {
      id: 'cotizaciones',
      name: 'Cotizaciones',
      route: '/cotizaciones',
      icon: <RequestPage />,
    },
    {
      id: 'requisiciones',
      name: 'Requisiciones',
      route: '/requisiciones',
      icon: <Assignment />,
    },
    {
      id: 'recuperacion',
      name: 'Recuperación',
      route: '/recuperacion',
      icon: <TrendingUp />,
    },
    {
      id: 'costos-fijos',
      name: 'Costos Fijos',
      route: '/costos-fijos',
      icon: <AttachMoney />,
    },
    {
      id: 'fases',
      name: 'Fases',
      route: '/fases',
      icon: <Timeline />,
    },
    {
      id: 'flow-recovery-v2',
      name: 'Flow Recovery V2',
      route: '/flow-recovery-v2',
      icon: <AccountTree />,
    },
  ];

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleExpand = () => {
    setIsMinimized(false);
  };

  const handleToggle = () => {
    if (isMinimized) {
      setIsOpen(true);
      setTimeout(() => {
        setIsMinimized(false);
        setIsOpen(false);
      }, 100);
    } else {
      setIsMinimized(true);
    }
  };

  const handleModuleClick = (moduleId) => {
    if (isMobile) {
      setIsMinimized(true);
    }
  };

  // En móvil, siempre mostrar el botón flotante
  if (isMobile) {
    return (
      <>
        <FloatingMenuButton onClick={handleToggle} isOpen={isOpen} />
        <AnimatePresence>
          {isOpen && (
            <Drawer
              anchor="left"
              open={isOpen}
              onClose={() => setIsOpen(false)}
              sx={{
                '& .MuiDrawer-paper': {
                  background: 'transparent',
                  boxShadow: 'none',
                },
              }}
            >
              <ExpandedSidebar
                modules={modulesConfig}
                onModuleClick={handleModuleClick}
                user={user}
                permissions={permissions}
                onMinimize={() => setIsOpen(false)}
              />
            </Drawer>
          )}
        </AnimatePresence>
      </>
    );
  }

  // En desktop, mostrar sidebar normal o minimizado
  return (
    <>
      {isMinimized && <FloatingMenuButton onClick={handleToggle} isOpen={isOpen} />}
      
      <AnimatePresence mode="wait">
        {!isMinimized ? (
          <ExpandedSidebar
            key="expanded"
            modules={modulesConfig}
            onModuleClick={handleModuleClick}
            user={user}
            permissions={permissions}
            onMinimize={handleMinimize}
          />
        ) : (
          <MinimizedSidebar
            key="minimized"
            modules={modulesConfig}
            onModuleClick={handleModuleClick}
            user={user}
            permissions={permissions}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default SidebarUltra;
