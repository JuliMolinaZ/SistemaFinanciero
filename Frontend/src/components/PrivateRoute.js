// src/components/PrivateRoute.js
import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const PrivateRoute = ({ children, allowedRoles, condition }) => {
  const { currentUser, profileData, permisos } = useContext(GlobalContext);
  const safePermisos = permisos || [];

  if (!currentUser || !profileData) {
    return <Navigate to="/login" replace />;
  }

  const userRole = profileData.role;

  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  if (condition) {
    // Para el Administrador, se quiere que ciertos módulos siempre sean accesibles
    // y que otros se muestren según el permiso
    const alwaysAccessibleModules = [
      'usuarios',
      'clientes',
      'proveedores',
      'contabilidad',
      'categorias',
      'emitidas',
      'cotizaciones'
    ];
    // Si el módulo requiere verificación y NO está en la lista de módulos "siempre accesibles"
    if (userRole === 'Administrador' && !alwaysAccessibleModules.includes(condition.toLowerCase())) {
      const permiso = safePermisos.find(
        (p) => p.modulo.toLowerCase() === condition.toLowerCase()
      );
      if (!permiso || !permiso.acceso_administrador) {
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

