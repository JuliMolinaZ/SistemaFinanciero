// src/components/Sidebar.js

import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';
import './Sidebar.css';

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, profileData } = useContext(GlobalContext);
  const [permisos, setPermisos] = useState([]);

  // Lee la variable de entorno (si no existe, usar "http://localhost:5000")
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

  // Carga de permisos
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

  // Verifica si el permiso para el módulo está habilitado
  const hasPermission = (modulo) => {
    const permiso = permisos.find((p) => p.modulo === modulo);
    return permiso?.acceso_administrador || false;
  };

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const userRole = profileData.role;
  const isJuanCarlos = userRole === 'Juan Carlos';
  const isAdmin = userRole === 'Administrador';

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      {/* HEADER minimalista del sidebar: solo la flecha de toggle */}
      <div className="sidebar-header">
        <button className="sidebar-toggle" onClick={toggleSidebar}>
          {sidebarCollapsed ? '→' : '←'}
        </button>
      </div>

      <nav className="sidebar-nav">
        {/* Inicio */}
        <NavLink to="/" className="sidebar-link">
          <span className="icon" role="img" aria-label="inicio">🏠</span>
          {!sidebarCollapsed && <span>Inicio</span>}
        </NavLink>

        {/* Usuarios */}
        {(isAdmin || isJuanCarlos) && (
          <NavLink to="/usuarios" className="sidebar-link">
            <span className="icon" role="img" aria-label="usuarios">👤</span>
            {!sidebarCollapsed && <span>Usuarios</span>}
          </NavLink>
        )}

        {/* Costos Fijos */}
        {(isJuanCarlos || (isAdmin && hasPermission('costos_fijos'))) && (
          <NavLink to="/costos-fijos" className="sidebar-link">
            <span className="icon" role="img" aria-label="costos fijos">💼</span>
            {!sidebarCollapsed && <span>Costos Fijos</span>}
          </NavLink>
        )}

        {/* Clientes */}
        <NavLink to="/clientes" className="sidebar-link">
          <span className="icon" role="img" aria-label="clientes">👥</span>
          {!sidebarCollapsed && <span>Clientes</span>}
        </NavLink>

        {/* Proyectos */}
        {(isJuanCarlos || (isAdmin && hasPermission('proyectos'))) && (
          <NavLink to="/proyectos" className="sidebar-link">
            <span className="icon" role="img" aria-label="proyectos">📁</span>
            {!sidebarCollapsed && <span>Proyectos</span>}
          </NavLink>
        )}

        {/* Cuentas por Cobrar */}
        {(isJuanCarlos || (isAdmin && hasPermission('cuentas_cobrar'))) && (
          <NavLink to="/cuentas-cobrar" className="sidebar-link">
            <span className="icon" role="img" aria-label="cuentas por cobrar">💰</span>
            {!sidebarCollapsed && <span>Cuentas por Cobrar</span>}
          </NavLink>
        )}

        {/* Exclusivo para Admin o JuanCarlos */}
        {(isAdmin || isJuanCarlos) && (
          <>
            <NavLink to="/proveedores" className="sidebar-link">
              <span className="icon" role="img" aria-label="proveedores">🏭</span>
              {!sidebarCollapsed && <span>Proveedores</span>}
            </NavLink>

            <NavLink to="/cuentas-pagar" className="sidebar-link">
              <span className="icon" role="img" aria-label="cuentas por pagar">💸</span>
              {!sidebarCollapsed && <span>Cuentas por Pagar</span>}
            </NavLink>

            <NavLink to="/contabilidad" className="sidebar-link">
              <span className="icon" role="img" aria-label="Movimientos contables">📊</span>
              {!sidebarCollapsed && <span>Movimientos Contables</span>}
            </NavLink>

            <NavLink to="/categorias" className="sidebar-link">
              <span className="icon" role="img" aria-label="categorias">📂</span>
              {!sidebarCollapsed && <span>Categorías</span>}
            </NavLink>

            <NavLink to="/emitidas" className="sidebar-link">
              <span className="icon" role="img" aria-label="facturas emitidas">📝</span>
              {!sidebarCollapsed && <span>Facturas Emitidas</span>}
            </NavLink>
          </>
        )}

        {/* Exclusivo para Juan Carlos */}
        {isJuanCarlos && (
          <>
            <NavLink to="/realtime-graph" className="sidebar-link">
              <span className="icon" role="img" aria-label="gráficos">📈</span>
              {!sidebarCollapsed && <span>Gráficos</span>}
            </NavLink>

            <NavLink to="/recuperacion" className="sidebar-link">
              <span className="icon" role="img" aria-label="MoneyFlow Recovery">🔄</span>
              {!sidebarCollapsed && <span>MoneyFlow Recovery</span>}
            </NavLink>

            <NavLink to="/permisos" className="sidebar-link">
              <span className="icon" role="img" aria-label="permisos">⚙️</span>
              {!sidebarCollapsed && <span>Permisos</span>}
            </NavLink>
          </>
        )}
      </nav>
    </aside>
  );
};

export default Sidebar;









