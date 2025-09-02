// components/PermissionGuard.jsx - Componente para proteger rutas y elementos basado en permisos
import React from 'react';
import { usePermissions } from '../hooks/usePermissions';
import { CircularProgress, Alert, Box, Typography } from '@mui/material';
import { Security, Block } from '@mui/icons-material';

const PermissionGuard = ({ 
  children, 
  module, 
  action = 'read', 
  fallback = null, 
  showLoading = true,
  showError = true,
  requiredRole = null,
  customMessage = null
}) => {
  const { 
    hasPermission, 
    canViewModule, 
    loading, 
    error, 
    isSuperAdmin,
    currentUser 
  } = usePermissions();

  // Si está cargando y se debe mostrar el loading
  if (loading && showLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" py={4}>
        <CircularProgress size={40} />
      </Box>
    );
  }

  // Si hay error y se debe mostrar
  if (error && showError) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        Error al cargar permisos: {error}
      </Alert>
    );
  }

  // Verificar si el usuario tiene el rol requerido
  if (requiredRole) {
    const userRole = currentUser?.role || currentUser?.roles?.name;
    if (userRole !== requiredRole && !isSuperAdmin) {
      return fallback || (
        <Box textAlign="center" py={4}>
          <Block sx={{ fontSize: 48, color: 'error.main', mb: 2 }} />
          <Typography variant="h6" color="error" gutterBottom>
            Acceso Denegado
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {customMessage || `Se requiere el rol "${requiredRole}" para acceder a esta funcionalidad.`}
          </Typography>
        </Box>
      );
    }
  }

  // Si es Super Admin, tiene acceso a todo
  if (isSuperAdmin) {
    return children;
  }

  // Verificar permisos específicos
  let hasAccess = false;
  
  if (action === 'view' || action === 'read') {
    hasAccess = canViewModule(module);
  } else {
    hasAccess = hasPermission(module, action);
  }

  // Si tiene acceso, mostrar el contenido
  if (hasAccess) {
    return children;
  }

  // Si no tiene acceso, mostrar fallback o mensaje por defecto
  return fallback || (
    <Box textAlign="center" py={4}>
      <Security sx={{ fontSize: 48, color: 'warning.main', mb: 2 }} />
      <Typography variant="h6" color="warning.main" gutterBottom>
        Acceso Restringido
      </Typography>
      <Typography variant="body2" color="textSecondary">
        {customMessage || `No tienes permisos para ${action} en el módulo "${module}".`}
      </Typography>
    </Box>
  );
};

// Componente para proteger botones de acción
export const ActionButton = ({ 
  children, 
  module, 
  action, 
  disabled = false, 
  onClick, 
  ...props 
}) => {
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  const canPerformAction = isSuperAdmin || hasPermission(module, action);
  
  return (
    <PermissionGuard module={module} action={action} fallback={null}>
      {React.cloneElement(children, {
        ...props,
        disabled: disabled || !canPerformAction,
        onClick: canPerformAction ? onClick : undefined
      })}
    </PermissionGuard>
  );
};

// Componente para proteger elementos del menú
export const MenuItemGuard = ({ 
  children, 
  module, 
  action = 'read', 
  fallback = null 
}) => {
  return (
    <PermissionGuard module={module} action={action} fallback={fallback}>
      {children}
    </PermissionGuard>
  );
};

// Componente para proteger secciones completas
export const SectionGuard = ({ 
  children, 
  module, 
  action = 'read', 
  fallback = null,
  title = null,
  description = null
}) => {
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  const canAccess = isSuperAdmin || hasPermission(module, action);
  
  if (!canAccess) {
    return fallback || (
      <Box textAlign="center" py={4}>
        <Security sx={{ fontSize: 48, color: 'info.main', mb: 2 }} />
        {title && (
          <Typography variant="h6" color="info.main" gutterBottom>
            {title}
          </Typography>
        )}
        {description && (
          <Typography variant="body2" color="textSecondary">
            {description}
          </Typography>
        )}
      </Box>
    );
  }
  
  return children;
};

// Componente para mostrar información de permisos
export const PermissionInfo = ({ module, showDetails = false }) => {
  const { getModulePermissions, isSuperAdmin } = usePermissions();
  
  const permissions = getModulePermissions(module);
  
  if (isSuperAdmin) {
    return (
      <Box>
        <Typography variant="caption" color="success.main">
          Super Administrador - Acceso completo
        </Typography>
      </Box>
    );
  }
  
  if (showDetails) {
    return (
      <Box>
        <Typography variant="caption" color="textSecondary">
          Permisos: {Object.entries(permissions)
            .filter(([key, value]) => key.startsWith('can_'))
            .map(([key, value]) => `${key.replace('can_', '')}: ${value ? 'Sí' : 'No'}`)
            .join(', ')}
        </Typography>
      </Box>
    );
  }
  
  const hasAnyPermission = Object.values(permissions).some(perm => perm);
  
  return (
    <Box>
      <Typography variant="caption" color={hasAnyPermission ? 'success.main' : 'error.main'}>
        {hasAnyPermission ? 'Acceso permitido' : 'Sin acceso'}
      </Typography>
    </Box>
  );
};

// Componente para mostrar estado de permisos
export const PermissionStatus = ({ module, action = 'read' }) => {
  const { hasPermission, isSuperAdmin } = usePermissions();
  
  const canPerform = isSuperAdmin || hasPermission(module, action);
  
  return (
    <Box display="flex" alignItems="center" gap={1}>
      <Security 
        sx={{ 
          fontSize: 16, 
          color: canPerform ? 'success.main' : 'error.main' 
        }} 
      />
      <Typography variant="caption" color={canPerform ? 'success.main' : 'error.main'}>
        {canPerform ? 'Permitido' : 'Denegado'}
      </Typography>
    </Box>
  );
};

export default PermissionGuard;
