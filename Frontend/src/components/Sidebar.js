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
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  useEffect(() => {
    const fetchPermisos = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/permisos`);
        setPermisos(response.data);
        console.log('Permisos obtenidos:', response.data);
      } catch (error) {
        console.error('Error al obtener los permisos:', error.response?.data || error.message);
      }
    };
    fetchPermisos();
  }, [API_URL]);

  // Verifica si el permiso existe y tiene acceso_administrador === 1
  const hasPermission = (modulo) => {
    const permiso = permisos.find((p) => p.modulo === modulo);
    return permiso?.acceso_administrador === 1;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  // Normalizamos el rol para evitar diferencias en mayúsculas/minúsculas
  const userRole = profileData?.role || '';
  const normalizedRole = userRole.trim().toLowerCase();
  const isJuanCarlos = normalizedRole === 'juan carlos';
  const isAdmin = normalizedRole === 'administrador';

  console.log('Perfil del usuario:', profileData);
  console.log('Rol normalizado:', normalizedRole);

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
          // Establecemos la altura para ocupar el espacio restante de la pantalla
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

      {/* Contenedor scrollable para la lista */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
        <List>
          {/* Items comunes */}
          <ListItemButton component={LinkBehavior} to="/" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="inicio">🏠</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Inicio" />}
          </ListItemButton>

          {(isAdmin || isJuanCarlos) && (
            <ListItemButton component={LinkBehavior} to="/usuarios" sx={listItemSx}>
              <ListItemIcon sx={listItemIconSx}>
                <span role="img" aria-label="usuarios">👤</span>
              </ListItemIcon>
              {!sidebarCollapsed && <ListItemText primary="Usuarios" />}
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

          <ListItemButton component={LinkBehavior} to="/clientes" sx={listItemSx}>
            <ListItemIcon sx={listItemIconSx}>
              <span role="img" aria-label="clientes">👥</span>
            </ListItemIcon>
            {!sidebarCollapsed && <ListItemText primary="Clientes" />}
          </ListItemButton>

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

          {(isAdmin || isJuanCarlos) && (
            <>
              <ListItemButton component={LinkBehavior} to="/proveedores" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="proveedores">🏭</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Proveedores" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/cuentas-pagar" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="cuentas por pagar">💸</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Cuentas por Pagar" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/contabilidad" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="movimientos contables">📊</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Movimientos Contables" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/categorias" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="categorias">📂</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Categorías" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/emitidas" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="facturas emitidas">📝</span>
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

          {isJuanCarlos && (
            <>
              <ListItemButton component={LinkBehavior} to="/realtime-graph" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="gráficos">📈</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Gráficos" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/flow-recovery-v2" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="flow recovery v2">💵</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Flow Recovery V2" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/recuperacion" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="moneyflow recovery">🔄</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="MoneyFlow Recovery" />}
              </ListItemButton>

              <ListItemButton component={LinkBehavior} to="/permisos" sx={listItemSx}>
                <ListItemIcon sx={listItemIconSx}>
                  <span role="img" aria-label="permisos">⚙️</span>
                </ListItemIcon>
                {!sidebarCollapsed && <ListItemText primary="Permisos" />}
              </ListItemButton>
              
            </>
          )}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;