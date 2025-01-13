// src/components/Sidebar.js
import React, { useContext } from 'react';
import { NavLink } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import './Sidebar.css';

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, profileData } = useContext(GlobalContext);

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const userRole = profileData.role; // Obtener el rol del usuario

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarCollapsed ? '→' : '←'}
      </button>

      {/* Enlace para Inicio */}
      <NavLink to="/" className="sidebar-link">
        <span role="img" aria-label="inicio">🏠</span>
        {!sidebarCollapsed && ' Inicio'}
      </NavLink>

      {/* Enlace para Usuarios (visible para Admin) */}
      {userRole === 'Administrador' && (
        <NavLink to="/usuarios" className="sidebar-link">
          <span role="img" aria-label="usuarios">👤</span>
          {!sidebarCollapsed && ' Usuarios'}
        </NavLink>
      )}

      {/* Opciones visibles para todos */}
      <NavLink to="/clientes" className="sidebar-link">
        <span role="img" aria-label="clientes">👥</span>
        {!sidebarCollapsed && ' Clientes'}
      </NavLink>
      <NavLink to="/proyectos" className="sidebar-link">
        <span role="img" aria-label="proyectos">📁</span>
        {!sidebarCollapsed && ' Proyectos'}
      </NavLink>
      <NavLink to="/horas-extra" className="sidebar-link">
        <span role="img" aria-label="horas extra">⏱️</span>
        {!sidebarCollapsed && ' Horas Extra'}
      </NavLink>

      {/* Opciones exclusivas para el administrador */}
      {userRole === 'Administrador' && (
        <>
          <NavLink to="/proveedores" className="sidebar-link">
            <span role="img" aria-label="proveedores">🏭</span>
            {!sidebarCollapsed && ' Proveedores'}
          </NavLink>
          <NavLink to="/cuentas-pagar" className="sidebar-link">
            <span role="img" aria-label="cuentas por pagar">💸</span>
            {!sidebarCollapsed && ' Cuentas por Pagar'}
          </NavLink>
          <NavLink to="/cuentas-cobrar" className="sidebar-link">
            <span role="img" aria-label="cuentas por cobrar">💰</span>
            {!sidebarCollapsed && ' Cuentas por Cobrar'}
          </NavLink>
          <NavLink to="/contabilidad" className="sidebar-link">
            <span role="img" aria-label="contabilidad">📊</span>
            {!sidebarCollapsed && ' Contabilidad'}
          </NavLink>
          <NavLink to="/categorias" className="sidebar-link">
            <span role="img" aria-label="categorias">📂</span>
            {!sidebarCollapsed && ' Categorías'}
          </NavLink>
          <NavLink to="/recuperacion" className="sidebar-link">
            <span role="img" aria-label="recuperación monetaria">🔄</span>
            {!sidebarCollapsed && ' Recuperación Monetaria'}
          </NavLink>
        </>
      )}
    </div>
  );
};

export default Sidebar;
