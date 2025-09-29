// src/components/Header.js
import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Avatar,
  Menu,
  MenuItem,
  IconButton,
  Badge,
  Chip,
  Tooltip,
  Fade,
} from '@mui/material';
import {
  Notifications as NotificationsIcon,
  Settings as SettingsIcon,
  Logout as LogoutIcon,
  Person as PersonIcon,
  Support as SupportIcon,
  Dashboard as DashboardIcon,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { GlobalContext } from '../context/GlobalState';
import { auth } from '../firebase';
import NotificationsDropdown from './NotificationsDropdown';
import WebSocketConnection from './WebSocketConnection';

const Header = () => {
  const { profileData, setCurrentUser, setProfileComplete, setProfileData } =
    useContext(GlobalContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logo, setLogo] = useState('SigmaBlack.jpeg');
  const navigate = useNavigate();

  // Alterna el logo cada 2 horas
  useEffect(() => {
    const logos = ['SigmaBlack.jpeg', 'SigmaRed.jpeg'];
    let currentIndex = 0;
    const switchLogo = () => {
      currentIndex = (currentIndex + 1) % logos.length;
      setLogo(logos[currentIndex]);
      const faviconElement = document.querySelector("link[rel='icon']");
      if (faviconElement) {
        faviconElement.href = logos[currentIndex];
      }
    };
    const intervalId = setInterval(switchLogo, 7200000);
    return () => clearInterval(intervalId);
  }, []);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      setCurrentUser(null);
      setProfileComplete(false);
      setProfileData(null);
      handleMenuClose();
      navigate('/');
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  return (
    <motion.div
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <AppBar
        position="fixed"
        sx={{
          background: 'rgba(26, 26, 46, 0.95)',
          backdropFilter: 'blur(20px)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          boxShadow: '0 4px 20px rgba(0, 0, 0, 0.25)',
          zIndex: 1100,
          height: 60,
          display: 'flex',
          justifyContent: 'center',
        }}
      >
        <Toolbar sx={{
          display: 'flex',
          justifyContent: 'space-between',
          minHeight: 60,
          px: 3,
          width: '100%',
          maxWidth: '100%'
        }}>
          {/* Izquierda: Logo y Título */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <motion.div
                whileHover={{ 
                  scale: 1.1,
                  rotate: 5,
                  transition: { duration: 0.3 }
                }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  component="img"
                  src={logo}
                  alt="Logo"
                  sx={{
                    width: 44,
                    height: 44,
                    objectFit: 'contain',
                    filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.3))',
                    borderRadius: '10px',
                    border: '2px solid rgba(255,255,255,0.1)',
                  }}
                />
              </motion.div>
              
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 900,
                    letterSpacing: 2,
                    background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                    backgroundSize: '200% 200%',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text',
                    animation: 'gradientShift 3s ease infinite',
                    fontSize: { xs: '1.4rem', sm: '1.8rem' },
                    textShadow: '0 0 20px rgba(79, 172, 254, 0.5)',
                    '@keyframes gradientShift': {
                      '0%, 100%': { backgroundPosition: '0% 50%' },
                      '50%': { backgroundPosition: '100% 50%' },
                    },
                  }}
                >
                  SIGMA
                </Typography>
                <Typography
                  variant="caption"
                  sx={{
                    color: 'rgba(255,255,255,0.7)',
                    fontSize: '0.65rem',
                    letterSpacing: 0.8,
                    fontWeight: 500,
                  }}
                >
                  Sistema Integral de Gestión
                </Typography>
              </Box>
            </Box>
          </motion.div>


          {/* Derecha: Perfil y Notificaciones */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            style={{ display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            {/* Notificaciones */}
            <NotificationsDropdown variant="header" />

            {/* Estado de conexión WebSocket (deshabilitado temporalmente) */}
            {false && process.env.NODE_ENV === 'development' && (
              <WebSocketConnection showStatus={true} />
            )}

            {/* Perfil del usuario */}
            {profileData && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    cursor: 'pointer',
                    p: 1,
                    borderRadius: 2,
                    background: 'rgba(255,255,255,0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.2)',
                      boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                    },
                  }}
                  onClick={handleMenuOpen}
                >
                  <Avatar
                    src={profileData.avatar || 'default-avatar.png'}
                    alt="Avatar"
                    sx={{
                      width: 36,
                      height: 36,
                      border: '2px solid rgba(255,255,255,0.3)',
                      mr: 1.2,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                    }}
                  />
                  <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                    <Typography
                      variant="subtitle2"
                      sx={{
                        color: 'white',
                        fontWeight: 600,
                        fontSize: '0.8rem',
                        lineHeight: 1.2,
                      }}
                    >
                      {profileData.name}
                    </Typography>
                    <Typography
                      variant="caption"
                      sx={{
                        color: 'rgba(255,255,255,0.7)',
                        fontSize: '0.65rem',
                        textTransform: 'uppercase',
                        letterSpacing: 0.5,
                      }}
                    >
                      {profileData.role || 'Usuario'}
                    </Typography>
                  </Box>
                </Box>
              </motion.div>
            )}

            {/* Menú Desplegable */}
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right',
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              PaperProps={{
                sx: {
                  background: 'rgba(26, 26, 46, 0.95)',
                  backdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                  borderRadius: 2,
                  mt: 1,
                  minWidth: 220,
                  overflow: 'hidden',
                },
              }}
              TransitionComponent={Fade}
              transitionDuration={300}
            >
              <MenuItem
                onClick={() => {
                  navigate('/mi-perfil');
                  handleMenuClose();
                }}
                sx={{
                  color: 'rgba(255,255,255,0.9)',
                  '&:hover': {
                    background: 'rgba(255,255,255,0.1)',
                  },
                  py: 1.5,
                }}
              >
                <PersonIcon sx={{ mr: 2, color: '#4facfe' }} />
                Mi Perfil
              </MenuItem>
              
              {/* Solo mostrar Dashboard para roles que no sean desarrollador u operador */}
              {profileData?.role && !['desarrollador', 'operador'].includes(profileData.role.toLowerCase()) && (
                <MenuItem
                  onClick={() => {
                    navigate('/');
                    handleMenuClose();
                  }}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                    py: 1.5,
                  }}
                >
                  <DashboardIcon sx={{ mr: 2, color: '#00d4aa' }} />
                  Dashboard
                </MenuItem>
              )}
              
              {/* Solo mostrar Configuración para roles que no sean desarrollador u operador */}
              {profileData?.role && !['desarrollador', 'operador'].includes(profileData.role.toLowerCase()) && (
                <MenuItem
                  onClick={() => { /* Acción Configuración */ }}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                    py: 1.5,
                  }}
                >
                  <SettingsIcon sx={{ mr: 2, color: '#f093fb' }} />
                  Configuración
                </MenuItem>
              )}
              
              {/* Solo mostrar Soporte para roles que no sean desarrollador u operador */}
              {profileData?.role && !['desarrollador', 'operador'].includes(profileData.role.toLowerCase()) && (
                <MenuItem
                  onClick={() => { /* Acción Soporte */ }}
                  sx={{
                    color: 'rgba(255,255,255,0.9)',
                    '&:hover': {
                      background: 'rgba(255,255,255,0.1)',
                    },
                    py: 1.5,
                  }}
                >
                  <SupportIcon sx={{ mr: 2, color: '#ffa726' }} />
                  Soporte
                </MenuItem>
              )}
              
              <MenuItem
                onClick={handleLogout}
                sx={{
                  color: '#ff6b6b',
                  '&:hover': {
                    background: 'rgba(255,107,107,0.1)',
                  },
                  py: 1.5,
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                }}
              >
                <LogoutIcon sx={{ mr: 2 }} />
                Cerrar Sesión
              </MenuItem>
            </Menu>
          </motion.div>
        </Toolbar>
      </AppBar>
    </motion.div>
  );
};

export default Header;

