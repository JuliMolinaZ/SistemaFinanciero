// src/components/PrivateRoute.js
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const PrivateRoute = ({ children, role, allowedRoles, condition }) => {
  const [isPermissionEnabled, setIsPermissionEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si el módulo está habilitado para el ADMINISTRADOR
    const checkPermission = async () => {
      if (role === 'Administrador' && condition) {
        try {
          const response = await axios.get('http://localhost:5000/api/permisos');
          const permisos = response.data;

          const permiso = permisos.find((p) => p.modulo === condition);
          if (permiso && !permiso.acceso_administrador) {
            setIsPermissionEnabled(false); // Deshabilitar el acceso si el permiso está deshabilitado
          }
        } catch (error) {
          console.error("Error al verificar el permiso:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false); // Finaliza la carga si no es necesario comprobar el permiso
      }
    };

    checkPermission();
  }, [role, condition]);

  // Si estamos cargando los permisos, no renderizamos nada
  if (loading) {
    return <div>Loading...</div>;
  }

  // Si el permiso está deshabilitado, mostramos un mensaje de error
  if (role === 'Administrador' && !isPermissionEnabled) {
    return (
      <div>
        <h2>Acceso no permitido</h2>
        <p>Este módulo no está habilitado para el Administrador en este momento.</p>
      </div>
    );
  }

  // Si el rol está en allowedRoles, y el permiso está habilitado, se renderiza el contenido
  if (allowedRoles.includes(role) && isPermissionEnabled) {
    return children;
  }

  // Si no cumple las condiciones, redirigimos
  return <Navigate to="/" replace />;
};

export default PrivateRoute;

