// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import AccessDeniedMessage from './AccessDeniedMessage';

const PrivateRoute = ({ children, allowedRoles, moduleId }) => {
  const { currentUser, profileData, permisos } = useContext(GlobalContext);
  const safePermisos = permisos || [];

  // Si no hay usuario o perfil, redirige al login
  if (!currentUser || !profileData) {
    return <Navigate to="/login" replace />;
  }

  // Normalizamos el rol a minúsculas para evitar problemas
  const userRole = profileData.role.toLowerCase();
  const normalizedAllowedRoles = allowedRoles.map((role) => role.toLowerCase());
  if (!normalizedAllowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  // Juan Carlos siempre tiene acceso a todos los módulos
  if (userRole === 'juan carlos') {
    return children;
  }

  // Para el Administrador, si se proporciona un moduleId se verifica el permiso
  if (moduleId) {
    const permiso = safePermisos.find(p => Number(p.id) === Number(moduleId));
    console.log(`Verificando permiso para módulo con id ${moduleId} (rol: ${userRole}):`, permiso);
    if (!permiso || Number(permiso.acceso_administrador) !== 1) {
      return <AccessDeniedMessage />;
    }
  }

  return children;
};

export default PrivateRoute;