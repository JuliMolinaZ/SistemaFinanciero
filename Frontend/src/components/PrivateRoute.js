// src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const PrivateRoute = ({ children, allowedRoles, condition }) => {
  const { currentUser, profileData, permisos } = useContext(GlobalContext);
  // Usamos un array vacío si permisos es undefined
  const safePermisos = permisos || [];

  console.log("PrivateRoute -> currentUser:", currentUser);
  console.log("PrivateRoute -> profileData:", profileData);
  console.log("PrivateRoute -> safePermisos:", safePermisos);
  console.log("PrivateRoute -> allowedRoles:", allowedRoles);
  console.log("PrivateRoute -> condition:", condition);

  if (!currentUser || !profileData) {
    console.warn("No hay usuario o perfil, redirigiendo a /login");
    return <Navigate to="/login" replace />;
  }

  // Usar el rol del perfil obtenido del backend
  const userRole = profileData.role;

  if (!allowedRoles.includes(userRole)) {
    console.warn(`El rol ${userRole} no está permitido. Roles permitidos: ${allowedRoles}`);
    return <Navigate to="/" replace />;
  }

  if (condition) {
    // Convertimos ambas cadenas a minúsculas para evitar problemas de mayúsculas/minúsculas
    const permiso = safePermisos.find(
      (p) => p.modulo.toLowerCase() === condition.toLowerCase()
    );
    console.log("Permiso encontrado para condición:", permiso);

    // Si el usuario es Administrador, se requiere que el permiso indique acceso administrativo
    if (userRole === 'Administrador') {
      if (!permiso || !permiso.acceso_administrador) {
        console.warn("Acceso no permitido para Administrador en módulo", condition);
        return (
          <div>
            <h2>Acceso no permitido</h2>
            <p>Este módulo no está habilitado para el Administrador en este momento.</p>
          </div>
        );
      }
    }
  }

  return children;
};

export default PrivateRoute;

