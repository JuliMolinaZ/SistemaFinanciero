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
} from '@mui/material';
import { GlobalContext } from '../context/GlobalState';
import { auth } from '../firebase';

const Header = () => {
  const { profileData, setCurrentUser, setProfileComplete, setProfileData } =
    useContext(GlobalContext);
  const [anchorEl, setAnchorEl] = useState(null);
  const [logo, setLogo] = useState('SigmaBlack.jpeg');
  const navigate = useNavigate();

  // Alterna el logo (y favicon) cada 2 horas
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
    <AppBar
      position="fixed"
      sx={{
        background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
        boxShadow: '0 4px 10px rgba(0,0,0,0.8)',
        zIndex: 1100,
        height: 72,
        display: 'flex',
        justifyContent: 'center',
        borderBottom: '1px solid rgb(0, 0, 0)',
      }}
    >
      <Toolbar sx={{ display: 'flex', justifyContent: 'space-between', minHeight: 72, px: 2 }}>
        {/* Izquierda: Logo y Título */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <Box
            component="img"
            src={logo}
            alt="Logo"
            sx={{
              width: 48,
              height: 48,
              objectFit: 'contain',
              mr: 1,
              transition: 'transform 0.3s ease',
              '&:hover': { transform: 'scale(1.05)' },
            }}
          />
          <Typography
            variant="h4"
            sx={{
              fontWeight: 'bold',
              letterSpacing: 2,
              color: '#fff',
              textShadow: '0 0 10px rgba(0,229,255,0.8)',
              fontSize: { xs: '1.5rem', sm: '2rem' },
              transition: 'text-shadow 0.3s ease',
              '&:hover': { textShadow: '0 0 20px rgba(0,229,255,1)' },
            }}
          >
            SIGMA
          </Typography>
        </Box>

        {/* Derecha: Perfil (Avatar y nombre) */}
        {profileData && (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              cursor: 'pointer',
              p: 1,
              borderRadius: 1,
              transition: 'background-color 0.3s ease, transform 0.3s ease',
              '&:hover': { backgroundColor: 'rgba(255,255,255,0.18)', transform: 'scale(1.02)' },
            }}
            onClick={handleMenuOpen}
          >
            <Avatar
              src={profileData.avatar || 'default-avatar.png'}
              alt="Avatar"
              sx={{
                width: 48,
                height: 48,
                border: '2px solid white',
                mr: 1,
              }}
            />
            <Typography
              variant="h6"
              sx={{
                display: { xs: 'none', sm: 'block' },
                color: 'white',
                fontWeight: 'medium',
              }}
            >
              {profileData.name}
            </Typography>
          </Box>
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
              backgroundColor: '#ffffff',
              color: '#333',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              borderRadius: 1,
              mt: 1,
              minWidth: 180,
            },
          }}
        >
          <MenuItem
            onClick={() => {
              navigate('/mi-perfil');
              handleMenuClose();
            }}
          >
            Mi perfil
          </MenuItem>
          <MenuItem onClick={handleLogout}>Salir</MenuItem>
          <MenuItem onClick={() => { /* Acción Soporte */ }}>
            Soporte
          </MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
};

export default Header;


