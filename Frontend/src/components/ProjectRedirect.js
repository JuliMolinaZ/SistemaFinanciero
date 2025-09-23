// src/components/ProjectRedirect.js
import React, { useContext, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { GlobalContext } from '../context/GlobalState';

const ProjectRedirect = ({ children }) => {
  const { profileData } = useContext(GlobalContext);

  // Si es desarrollador u operador, redirigir al módulo moderno
  if (profileData?.role?.toLowerCase() === 'desarrollador' ||
      profileData?.role?.toLowerCase() === 'operador') {
    console.log('🔄 Redirigiendo desarrollador/operador desde /proyectos a /project-management');
    return <Navigate to="/project-management" replace />;
  }

  // Para otros roles, mostrar el componente normal
  return children;
};

export default ProjectRedirect;