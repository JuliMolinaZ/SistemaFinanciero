// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import { usePermissions } from '../hooks/usePermissions';
import AccessDeniedMessage from './AccessDeniedMessage';

const PrivateRoute = ({ children, allowedRoles, moduleName }) => {
  const { currentUser, profileData, profileComplete, updateUserProfile } = useContext(GlobalContext);
  const { canViewModule, loading: permissionsLoading, isSuperAdmin } = usePermissions();

  // Si no hay usuario o perfil, redirige al formulario de autenticación
  if (!currentUser || !profileData) {

    return <Navigate to="/" replace />;
  }

  // Verificar si el perfil está completo antes de permitir acceso a project-management
  if (moduleName === 'project_management' && !profileComplete) {
    // Verificar si el perfil realmente está incompleto
    const isActuallyIncomplete = !(profileData.name &&
                                 profileData.phone &&
                                 profileData.phone_country_code &&
                                 profileData.department &&
                                 profileData.position &&
                                 profileData.birth_date);
    
    if (isActuallyIncomplete) {
      // Redirigir a mi-perfil solo si realmente está incompleto
      return <Navigate to="/mi-perfil" replace />;
    }
  }

  // Normalizamos el rol del usuario
  const userRole = profileData.role?.trim().toLowerCase() || '';

  // Si el usuario es Super Administrador, se le permite todo sin más validaciones
  if (isSuperAdmin || userRole === 'super administrador') {

    return children;
  }

  // Mientras los permisos no se hayan cargado, se muestra un mensaje de carga
  if (permissionsLoading) {

    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        Cargando permisos...
      </div>
    );
  }

  // PRIORIDAD 1: Si se especifica moduleName, verificamos el permiso usando el nuevo sistema
  if (moduleName) {

    // Convertir nombres de módulos de App.js a nombres de la base de datos
    // App.js usa guiones bajos, pero necesitamos mapear a los nombres de la BD
    const moduleMapping = {
      // Módulos con nombres exactos
      'dashboard': 'dashboard',
      'usuarios': 'usuarios',
      'clientes': 'clientes',
      'proyectos': 'proyectos',
      'proveedores': 'proveedores',
      'contabilidad': 'contabilidad',
      'categorias': 'categorias',
      'emitidas': 'emitidas',
      'cotizaciones': 'cotizaciones',
      'recuperacion': 'recuperacion',
      'usuarios': 'usuarios',
      'permisos': 'permisos',
      'reportes': 'reportes',
      'auditoria': 'auditoria',
      'assets': 'assets',
      'configuracion': 'configuracion',
      'roles': 'roles',
      'fases': 'fases',
      'realtime_graph': 'realtime_graph',
      
      // Módulos con guiones bajos (como los usa App.js)
      'cuentas_pagar': 'cuentas_por_pagar',
      'cuentas_cobrar': 'cuentas_por_cobrar',
      'costos_fijos': 'costos_fijos',
      'impuestos_imss': 'impuestos_imss',
      'flow_recovery_v2': 'flow_recovery_v2',
      'moneyflow_recovery': 'moneyflow_recovery',
      'complementos_pago': 'complementos_pago',
      'project_costs': 'project_costs',
      'horas_extra': 'horas_extra',
      
      // Módulos con guiones medios (como los usa el sidebar)
      'cuentas-pagar': 'cuentas_por_pagar',
      'cuentas-cobrar': 'cuentas_por_cobrar',
      'costos-fijos': 'costos_fijos',
      'impuestos-imss': 'impuestos_imss',
      'flow-recovery-v2': 'flow_recovery_v2',
      'money-flow-recovery': 'moneyflow_recovery',
      'complementos-pago': 'complementos_pago',
      'project-costs': 'project_costs',
      'horas-extra': 'horas_extra'
    };

    // Obtener el nombre del módulo en la base de datos
    const dbModuleName = moduleMapping[moduleName] || moduleName;

    // Verificar si el usuario puede ver este módulo usando el nuevo sistema
    if (canViewModule(dbModuleName)) {

      return children;
    } else {

      // PRIORIDAD 2: Si no hay permisos, verificar allowedRoles como fallback
      if (allowedRoles && allowedRoles.length > 0) {
        const normalizedAllowedRoles = allowedRoles.map(role => role.trim().toLowerCase());
        if (normalizedAllowedRoles.includes(userRole)) {

          return children;
        } else {

          return <AccessDeniedMessage />;
        }
      } else {

        return <AccessDeniedMessage />;
      }
    }
  }

  // Si no hay moduleName, verificar solo allowedRoles
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map(role => role.trim().toLowerCase());
    if (!normalizedAllowedRoles.includes(userRole)) {

      return <AccessDeniedMessage />;
    }
  }

  return children;
};

export default PrivateRoute;
