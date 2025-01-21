import React, { useContext, useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import { GlobalContext } from '../context/GlobalState';
import './Sidebar.css';

const Sidebar = () => {
  const { sidebarCollapsed, setSidebarCollapsed, profileData } = useContext(GlobalContext);
  const [permisos, setPermisos] = useState([]);

  // Función para obtener permisos
  const fetchPermisos = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/permisos');
      setPermisos(response.data);
    } catch (error) {
      console.error('Error al obtener los permisos:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPermisos();  // Cargar los permisos cuando el componente se monta
  }, []);

  const hasPermission = (modulo) => {
    const permiso = permisos.find((p) => p.modulo === modulo);
    return permiso?.acceso_administrador || false; // Verifica si el permiso para el módulo está habilitado
  };

  const toggleSidebar = () => setSidebarCollapsed(!sidebarCollapsed);

  const userRole = profileData.role; // Obtener el rol del usuario
  const isJuanCarlos = userRole === 'Juan Carlos';
  const isAdmin = userRole === 'Administrador';

  return (
    <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {sidebarCollapsed ? '→' : '←'}
      </button>

      <NavLink to="/" className="sidebar-link">
        <span role="img" aria-label="inicio">🏠</span>
        {!sidebarCollapsed && ' Inicio'}
      </NavLink>

      {/* Enlace para Usuarios (visible para Admin y Juan Carlos) */}
      {(isAdmin || isJuanCarlos) && (
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

      {/* Opciones exclusivas para Proyectos */}
      {(isJuanCarlos || (isAdmin && hasPermission('proyectos'))) && (
        <NavLink to="/proyectos" className="sidebar-link">
          <span role="img" aria-label="proyectos">📁</span>
          {!sidebarCollapsed && ' Proyectos'}
        </NavLink>
      )}

      {/* Opciones exclusivas para Cuentas por Cobrar */}
      {(isJuanCarlos || (isAdmin && hasPermission('cuentas_cobrar'))) && (
        <NavLink to="/cuentas-cobrar" className="sidebar-link">
          <span role="img" aria-label="cuentas por cobrar">💰</span>
          {!sidebarCollapsed && ' Cuentas por Cobrar'}
        </NavLink>
      )}

      {/* Opciones exclusivas para Costos Fijos */}
      {isJuanCarlos && (
        <NavLink to="/costos-fijos" className="sidebar-link">
          <span role="img" aria-label="costos fijos">💼</span>
          {!sidebarCollapsed && ' Costos Fijos'}
        </NavLink>
      )}

      {/* Opciones exclusivas para Administrador o Juan Carlos */}
      {(isAdmin || isJuanCarlos) && (
        <>
          <NavLink to="/proveedores" className="sidebar-link">
            <span role="img" aria-label="proveedores">🏭</span>
            {!sidebarCollapsed && ' Proveedores'}
          </NavLink>
          <NavLink to="/cuentas-pagar" className="sidebar-link">
            <span role="img" aria-label="cuentas por pagar">💸</span>
            {!sidebarCollapsed && ' Cuentas por Pagar'}
          </NavLink>
          <NavLink to="/contabilidad" className="sidebar-link">
            <span role="img" aria-label="contabilidad">📊</span>
            {!sidebarCollapsed && ' Contabilidad'}
          </NavLink>
          <NavLink to="/categorias" className="sidebar-link">
            <span role="img" aria-label="categorias">📂</span>
            {!sidebarCollapsed && ' Categorías'}
          </NavLink>

        </>
      )}
        {isJuanCarlos && (
          <NavLink to="/realtime-graph" className="sidebar-link">
            <span role="img" aria-label="gráfico">📈</span>
            {!sidebarCollapsed && ' Gráficos'}
          </NavLink>
        )}
        {isJuanCarlos && (
        <NavLink to="/recuperacion" className="sidebar-link">
          <span role="img" aria-label="MoneyFlow Recovery">🔄</span>
          {!sidebarCollapsed && ' MoneyFlow Recovery'}
        </NavLink>
      )}

      {/* Módulo de permisos exclusivo para Juan Carlos */}
      {isJuanCarlos && (
        <NavLink to="/permisos" className="sidebar-link">
          <span role="img" aria-label="permisos">⚙️</span>
          {!sidebarCollapsed && ' Permisos'}
        </NavLink>
      )}


    </div>
  );
};

export default Sidebar;





