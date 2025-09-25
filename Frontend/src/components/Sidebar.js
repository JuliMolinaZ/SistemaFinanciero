// src/components/Sidebar.js
import React, { useContext, useEffect, useState, forwardRef } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';
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
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

const drawerWidthOpen = 220;
const drawerWidthClosed = 60;

// Componente para evitar props innecesarias en NavLink
const LinkBehavior = forwardRef((props, ref) => {
  const { button, ...other } = props;
  return <NavLink ref={ref} {...other} />;
});

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, profileData } = useContext(GlobalContext);
  const [permisos, setPermisos] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8765';

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/permisos`);
        setPermisos(response.data);

      } catch (error) {
        console.error('Error al obtener los permisos:', error.response?.data || error.message);
      }
    };
    fetchPermisos();
  }, [API_URL]);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Normalizamos el rol y determinamos si es Juan Carlos o Administrador
  const userRole = profileData?.role || '';
  const normalizedRole = userRole.trim().toLowerCase();
  const isJuanCarlos = normalizedRole === 'juan carlos';
  const isAdmin = normalizedRole === 'administrador';

  // Función que retorna true para cualquier módulo si el usuario es Juan Carlos.
  // Para otros, se evalúa según el permiso (acceso_administrador === 1)
  const hasPermission = (modulo) => {
    if (isJuanCarlos) return true;
    const permiso = permisos.find(
      p => p.modulo.trim().toLowerCase() === modulo.trim().toLowerCase()
    );
    return permiso ? Number(permiso.acceso_administrador) === 1 : false;
  };

  // Estilos para los items del menú
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
        top: '72px',
        width: sidebarCollapsed ? drawerWidthClosed : drawerWidthOpen,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          top: '72px',
          height: 'calc(100vh - 72px)',
          width: sidebarCollapsed ? drawerWidthClosed : drawerWidthOpen,
          boxSizing: 'border-box',
          background: 'linear-gradient(90deg, #ff6b6b, #f94d9a)',
          color: '#fff',
          borderRight: 'none',
          transition: 'width 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
        },
      }}
    >
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
          flexGrow: 1,
          overflowY: 'auto',
          scrollbarWidth: 'thin',
          scrollbarColor: '#c2185b linear-gradient(90deg, #ff6b6b, #f94d9a)',
          '&::-webkit-scrollbar': {
            width: '8px !important',
          },
          '&::-webkit-scrollbar-track': {
            background: 'linear-gradient(90deg, #ff6b6b, #f94d9a) !important',
          },
          '&::-webkit-scrollbar-thumb': {
            backgroundColor: '#c2185b !important',
            borderRadius: '4px !important',
          },
          '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: '#ad1457 !important',
          },
        }}
      >
        <List>
          {/* Módulos fijos */}
          <ListItemButton component={LinkBehavior} to="/dashboard-ultra" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="dashboard">📊</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Dashboard" />}
          </ListItemButton>

          {/* Enlace a página Home original */}
          <ListItemButton component={LinkBehavior} to="/" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="inicio">🏠</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Inicio" />}
          </ListItemButton>

          {/* Botón de Usuarios: visible para ambos */}
          {(isAdmin || isJuanCarlos) && (
            <ListItemButton component={LinkBehavior} to="/usuarios" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="usuarios">👤</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Usuarios" />}
            </ListItemButton>
          )}

          {/* Cliente siempre visible */}
          <ListItemButton component={LinkBehavior} to="/clientes" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="clientes">👥</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Clientes" />}
          </ListItemButton>

          {/* Módulos controlados por permiso */}
          {(isJuanCarlos || (isAdmin && hasPermission('proyectos'))) && (
            <ListItemButton component={LinkBehavior} to="/proyectos" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="proyectos">📁</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Proyectos" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('cuentas_cobrar'))) && (
            <ListItemButton component={LinkBehavior} to="/cuentas-cobrar" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="cuentas por cobrar">💰</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Cuentas por Cobrar" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('costos_fijos'))) && (
            <ListItemButton component={LinkBehavior} to="/costos-fijos" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="costos fijos">💼</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Costos Fijos" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('cuentas_pagar'))) && (
            <ListItemButton component={LinkBehavior} to="/cuentas-pagar" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="cuentas por pagar">💸</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Cuentas por Pagar" />}
            </ListItemButton>
          )}

          {(isAdmin || isJuanCarlos) && (
            <>
              <ListItemButton component={LinkBehavior} to="/proveedores" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="proveedores">🏭</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Proveedores" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/contabilidad" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="contabilidad">📊</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Contabilidad" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/categorias" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="categorias">📂</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Categorías" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/emitidas" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="emitidas">📝</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Facturas Emitidas" />}
              </ListItemButton>
            </>
          )}

          {(isAdmin || isJuanCarlos) && (
            <ListItemButton component={LinkBehavior} to="/cotizaciones" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="cotizaciones">📄</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Cotizaciones" />}
            </ListItemButton>
          )}

          {/* Módulo de Requisiciones */}
          {(isJuanCarlos || (isAdmin && hasPermission('requisiciones'))) && (
            <ListItemButton component={LinkBehavior} to="/requisiciones" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="requisiciones">📋</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Requisiciones" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('realtime_graph'))) && (
            <ListItemButton component={LinkBehavior} to="/realtime-graph" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="realtime graph">📈</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Gráficos" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('flow_recovery_v2'))) && (
            <ListItemButton component={LinkBehavior} to="/flow-recovery-v2" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="flow recovery v2">💵</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Flow Recovery V2" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('recuperacion'))) && (
            <ListItemButton component={LinkBehavior} to="/recuperacion" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="recuperacion">🔄</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="MoneyFlow Recovery" />}
            </ListItemButton>
          )}

          {(isJuanCarlos || (isAdmin && hasPermission('permisos'))) && (
            <ListItemButton component={LinkBehavior} to="/permisos" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="permisos">⚙️</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Permisos" />}
            </ListItemButton>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
