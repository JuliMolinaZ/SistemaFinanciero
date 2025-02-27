// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';
import AccessDeniedMessage from './AccessDeniedMessage';

const PrivateRoute = ({ children, allowedRoles, moduleName }) => {
  const { currentUser, profileData, permisos } = useContext(GlobalContext);

  // Si no hay usuario o perfil, redirige al login
  if (!currentUser || !profileData) {
    return <Navigate to="/login" replace />;
  }

  // Normalizamos el rol del usuario
  const userRole = profileData.role.trim().toLowerCase();

  // Si el usuario es Juan Carlos, se le permite todo sin más validaciones
  if (userRole === 'juan carlos') {
    return children;
  }

  // Mientras los permisos no se hayan cargado, se muestra un mensaje o spinner
  if (permisos.length === 0) {
    return <div>Loading permissions...</div>;
  }

  // Si se especifica moduleName, buscamos el permiso correspondiente de forma insensible a mayúsculas
  if (moduleName) {
    const permiso = permisos.find(
      p => p.modulo.trim().toLowerCase() === moduleName.trim().toLowerCase()
    );
    console.log("moduleName:", moduleName, "permiso encontrado:", permiso);
    if (!permiso || Number(permiso.acceso_administrador) !== 1) {
      return <AccessDeniedMessage />;
    }
  }

  // Verificar allowedRoles (esto es para otros roles distintos de Juan Carlos)
  if (allowedRoles && allowedRoles.length > 0) {
    const normalizedAllowedRoles = allowedRoles.map(role => role.trim().toLowerCase());
    if (!normalizedAllowedRoles.includes(userRole)) {
      return <AccessDeniedMessage />;
    }
  }

  return children;
};

export default PrivateRoute;
