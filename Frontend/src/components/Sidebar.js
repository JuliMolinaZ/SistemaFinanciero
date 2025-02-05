// src/components/Sidebar.js
import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Divider,
  Toolbar,
  Box,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const drawerWidthOpen = 220;
const drawerWidthClosed = 60;

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, profileData } = useContext(GlobalContext);
  const [permisos, setPermisos] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Obtención de permisos desde la API
  const fetchPermisos = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/permisos`);
      setPermisos(response.data);
    } catch (error) {
      console.error('Error al obtener los permisos:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPermisos();
  }, [API_URL]);

  // Función para verificar permisos
  const hasPermission = (modulo) => {
    const permiso = permisos.find((p) => p.modulo === modulo);
    return permiso?.acceso_administrador || false;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Asegúrate de que el role coincida con el valor real (por ejemplo, 'Juan Carlos')
  const userRole = profileData?.role;
  const isJuanCarlos = userRole === 'Juan Carlos';
  const isAdmin = userRole === 'Administrador';

  // Estilo base para cada ListItem, incluyendo el estado activo
  const listItemSx = {
    color: '#fff',
    my: 0.5,
    borderRadius: 1,
    transition: 'background-color 0.3s, box-shadow 0.3s, margin 0.3s',
    '&:hover': {
      backgroundColor: 'rgba(255,255,255,0.2)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      mx: 0.5,
    },
    '&.active': {
      backgroundColor: 'rgba(255,255,255,0.4)',
      boxShadow: '0 2px 6px rgba(0,0,0,0.3)',
      mx: 0.5,
    },
  };

  // Estilo para el ListItemIcon: sin fondo, tamaño aumentado y sin transparencia
  const listItemIconSx = {
    minWidth: 0,
    mr: sidebarCollapsed ? 0 : 2,
    justifyContent: 'center',
    fontSize: '1.4rem',
    backgroundColor: 'transparent',
    color: 'inherit',
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        top: '72px', // inicia justo debajo del header (72px)
        width: sidebarCollapsed ? drawerWidthClosed : drawerWidthOpen,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          top: '72px',
          width: sidebarCollapsed ? drawerWidthClosed : drawerWidthOpen,
          boxSizing: 'border-box',
          background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
          color: '#fff',
          borderRight: 'none',
          transition: 'width 0.3s ease',
        },
      }}
    >
      {/* Header del Sidebar: botón para colapsar */}
      <Toolbar
        sx={{
          display: 'flex',
          justifyContent: sidebarCollapsed ? 'center' : 'flex-end',
          alignItems: 'center',
          px: 1,
          height: 60,
        }}
      >
        <IconButton onClick={toggleSidebar} sx={{ color: '#fff' }}>
          {sidebarCollapsed ? <ChevronRight /> : <ChevronLeft />}
        </IconButton>
      </Toolbar>
      <Divider sx={{ borderColor: 'rgba(255,255,255,0.3)' }} />
      <Box
        sx={{
          flex: 1,
          py: 1,
          overflowY: 'auto',
          scrollbarWidth: 'none', // Firefox
          '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari y Opera
        }}
      >
        <List>
          {/* Inicio */}
          <ListItem button component={NavLink} to="/" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="inicio">🏠</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Inicio" />}
          </ListItem>

          {(isAdmin || isJuanCarlos) && (
            <ListItem button component={NavLink} to="/usuarios" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="usuarios">👤</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Usuarios" />}
            </ListItem>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('costos_fijos'))) && (
            <ListItem button component={NavLink} to="/costos-fijos" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="costos fijos">💼</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Costos Fijos" />}
            </ListItem>
          )}

          <ListItem button component={NavLink} to="/clientes" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="clientes">👥</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Clientes" />}
          </ListItem>

          {(isJuanCarlos || (isAdmin && hasPermission('proyectos'))) && (
            <ListItem button component={NavLink} to="/proyectos" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="proyectos">📁</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Proyectos" />}
            </ListItem>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('cuentas_cobrar'))) && (
            <ListItem button component={NavLink} to="/cuentas-cobrar" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="cuentas por cobrar">💰</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Cuentas por Cobrar" />}
            </ListItem>
          )}

          {(isAdmin || isJuanCarlos) && (
            <>
              <ListItem button component={NavLink} to="/proveedores" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="proveedores">🏭</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Proveedores" />}
              </ListItem>

              <ListItem button component={NavLink} to="/cuentas-pagar" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="cuentas por pagar">💸</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Cuentas por Pagar" />}
              </ListItem>

              <ListItem button component={NavLink} to="/contabilidad" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="movimientos contables">📊</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Movimientos Contables" />}
              </ListItem>

              <ListItem button component={NavLink} to="/categorias" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="categorias">📂</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Categorías" />}
              </ListItem>

              <ListItem button component={NavLink} to="/emitidas" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="facturas emitidas">📝</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Facturas Emitidas" />}
              </ListItem>
            </>
          )}

          {(isAdmin || isJuanCarlos) && (
            <ListItem button component={NavLink} to="/cotizaciones" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="cotizaciones">📄</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Cotizaciones" />}
            </ListItem>
          )}

          {isJuanCarlos && (
            <>
              <ListItem button component={NavLink} to="/realtime-graph" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="gráficos">📈</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Gráficos" />}
              </ListItem>

              <ListItem button component={NavLink} to="/recuperacion" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="moneyflow recovery">🔄</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="MoneyFlow Recovery" />}
              </ListItem>

              <ListItem button component={NavLink} to="/flow-recovery-v2" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="flow recovery v2">💵</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Flow Recovery V2" />}
              </ListItem>

              {/* Módulo Permisos: Solo para el usuario Juan Carlos */}
              <ListItem button component={NavLink} to="/permisos" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="permisos">⚙️</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Permisos" />}
              </ListItem>
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;














