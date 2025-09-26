// hooks/usePermissions.js - Hook para manejar permisos del usuario
import { useState, useEffect, useContext } from 'react';
import { GlobalContext } from '../context/GlobalState';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8765";

export const usePermissions = () => {
  const { currentUser, profileData } = useContext(GlobalContext);
  const [permissions, setPermissions] = useState({}); // Cambiado a objeto
  const [loading, setLoading] = useState(true);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [error, setError] = useState(null);

  // Cargar permisos del usuario actual
  useEffect(() => {
    if (currentUser && profileData) {
      fetchUserPermissions();
    } else {
      setLoading(false);
    }
  }, [currentUser, profileData]);

  const fetchUserPermissions = async () => {
    try {
      setLoading(true);
      
      // Usar el nuevo endpoint que funciona con Firebase UID
      if (profileData && profileData.firebase_uid) {
        // Usar permisos por defecto basados en el rol del usuario
        // El endpoint de role-management no está implementado aún
      }
      
      // Usar permisos por defecto basados en el rol del usuario
      if (profileData && profileData.role) {
        const defaultPermissions = getDefaultPermissionsByRole(profileData.role);
        setPermissions(defaultPermissions);
        setIsSuperAdmin(profileData.role === 'Super Administrador');

      } else {

      }
      
    } catch (error) {
      console.error('Error al cargar permisos del usuario:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Función para obtener permisos por defecto basados en el rol
  const getDefaultPermissionsByRole = (roleName) => {
    const rolePermissions = {
      'Super Administrador': {
        // Acceso completo a todo
        dashboard: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        usuarios: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        roles: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        configuracion: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        // ... otros módulos
      },
      'Contador': {
        // Módulos financieros con acceso completo
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        reportes: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        contabilidad: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        costos_fijos: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        cuentas_por_pagar: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        cuentas_por_cobrar: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        impuestos_imss: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        categorias: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        proveedores: { can_read: true, can_create: true, can_update: true, can_delete: true, can_export: true, can_approve: true },
        realtime_graph: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        // Módulos básicos con acceso limitado
        usuarios: { can_read: true, can_create: false, can_update: true, can_delete: false, can_export: false, can_approve: false },
        clientes: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        proyectos: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        // Módulos restringidos
        roles: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        configuracion: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        permisos: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        auditoria: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false }
      },
      'Gerente': {
        // Acceso amplio pero sin eliminar usuarios
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: true },
        usuarios: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: true },
        roles: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: true },
        configuracion: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: true },
        // ... otros módulos con permisos amplios
      },
      'Admin': {
        // Acceso moderado
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        usuarios: { can_read: true, can_create: false, can_update: true, can_delete: false, can_export: false, can_approve: false },
        // ... otros módulos con permisos moderados
      },
      'Desarrollador': {
        // Acceso técnico
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        proyectos: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        project_management: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        fases: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        assets: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        clientes: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        usuarios: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        // ... otros módulos técnicos
      },
      'Operador': {
        // Acceso operacional similar a Desarrollador pero enfocado en proyectos
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        proyectos: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        project_management: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        fases: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        assets: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        clientes: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        usuarios: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        // Módulos restringidos
        configuracion: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        roles: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        contabilidad: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        cuentas_por_pagar: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        cuentas_por_cobrar: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        costos_fijos: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        impuestos_imss: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        reportes: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        realtime_graph: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        auditoria: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        permisos: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false }
      },
      'usuario': {
        // Acceso básico similar a Desarrollador pero más limitado
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: true, can_approve: false },
        proyectos: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        project_management: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        fases: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        assets: { can_read: true, can_create: true, can_update: true, can_delete: false, can_export: true, can_approve: false },
        clientes: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        categorias: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        proveedores: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        // Módulos restringidos
        usuarios: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        roles: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        configuracion: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        permisos: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        auditoria: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        contabilidad: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        cuentas_por_pagar: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        cuentas_por_cobrar: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        costos_fijos: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        impuestos_imss: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        reportes: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        realtime_graph: { can_read: false, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false }
      },
      'Invitado': {
        // Solo lectura en módulos básicos
        dashboard: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        clientes: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        proyectos: { can_read: true, can_create: false, can_update: false, can_delete: false, can_export: false, can_approve: false },
        // ... otros módulos con solo lectura
      }
    };
    
    return rolePermissions[roleName] || {};
  };

  // Verificar si el usuario tiene un permiso específico
  const hasPermission = (module, action) => {

    if (isSuperAdmin) {

      return true;
    }
    
    // Buscar en la nueva estructura de permisos
    const permission = permissions[module];

    if (!permission) {

      return false;
    }

    let result = false;
    switch (action) {
      case 'read':
        result = permission.can_read;
        break;
      case 'create':
        result = permission.can_create;
        break;
      case 'update':
        result = permission.can_update;
        break;
      case 'delete':
        result = permission.can_delete;
        break;
      case 'export':
        result = permission.can_export;
        break;
      case 'approve':
        result = permission.can_approve;
        break;
      default:
        result = false;
    }

    return result;
  };

  // Verificar si el usuario puede ver un módulo
  const canViewModule = (module) => {
    const result = hasPermission(module, 'read');

    return result;
  };

  // Verificar si el usuario puede crear en un módulo
  const canCreate = (module) => {
    return hasPermission(module, 'create');
  };

  // Verificar si el usuario puede editar en un módulo
  const canEdit = (module) => {
    return hasPermission(module, 'update');
  };

  // Verificar si el usuario puede eliminar en un módulo
  const canDelete = (module) => {
    return hasPermission(module, 'delete');
  };

  // Verificar si el usuario puede exportar de un módulo
  const canExport = (module) => {
    return hasPermission(module, 'export');
  };

  // Verificar si el usuario puede aprobar en un módulo
  const canApprove = (module) => {
    return hasPermission(module, 'approve');
  };

  // Obtener todos los permisos de un módulo específico
  const getModulePermissions = (module) => {
    if (isSuperAdmin) {
      return {
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_export: true,
        can_approve: true
      };
    }

    const permission = permissions[module];
    return permission || {
      can_read: false,
      can_create: false,
      can_update: false,
      can_delete: false,
      can_export: false,
      can_approve: false
    };
  };

  // Verificar si el usuario tiene acceso completo a un módulo
  const hasFullAccess = (module) => {
    if (isSuperAdmin) return true;
    
    const modulePerms = getModulePermissions(module);
    return Object.values(modulePerms).every(perm => perm === true);
  };

  // Verificar si el usuario tiene acceso de solo lectura a un módulo
  const hasReadOnlyAccess = (module) => {
    if (isSuperAdmin) return true;
    
    const modulePerms = getModulePermissions(module);
    return modulePerms.can_read && 
           !modulePerms.can_create && 
           !modulePerms.can_update && 
           !modulePerms.can_delete;
  };

  // Obtener módulos a los que el usuario tiene acceso
  const getAccessibleModules = () => {
    if (isSuperAdmin) {
      // Super Admin tiene acceso a todos los módulos
      return Object.keys(permissions);
    }
    
    return Object.keys(permissions)
      .filter(module => permissions[module].can_read);
  };

  // Obtener módulos donde el usuario puede crear
  const getCreatableModules = () => {
    if (isSuperAdmin) {
      return Object.keys(permissions);
    }
    
    return Object.keys(permissions)
      .filter(module => permissions[module].can_create);
  };

  // Obtener módulos donde el usuario puede editar
  const getEditableModules = () => {
    if (isSuperAdmin) {
      return Object.keys(permissions);
    }
    
    return Object.keys(permissions)
      .filter(module => permissions[module].can_update);
  };

  // Obtener módulos donde el usuario puede eliminar
  const getDeletableModules = () => {
    if (isSuperAdmin) {
      return Object.keys(permissions);
    }
    
    return Object.keys(permissions)
      .filter(module => permissions[module].can_delete);
  };

  // Obtener módulos donde el usuario puede exportar
  const getExportableModules = () => {
    if (isSuperAdmin) {
      return Object.keys(permissions);
    }
    
    return Object.keys(permissions)
      .filter(module => permissions[module].can_export);
  };

  // Obtener módulos donde el usuario puede aprobar
  const getApprovableModules = () => {
    if (isSuperAdmin) {
      return Object.keys(permissions);
    }
    
    return Object.keys(permissions)
      .filter(module => permissions[module].can_approve);
  };

  // Verificar si el usuario puede gestionar roles (Super Admin o Gerente)
  const canManageRoles = () => {
    if (!currentUser) return false;
    
    const userRole = currentUser.role || currentUser.roles?.name;
    return ['Super Administrador', 'Gerente'].includes(userRole);
  };

  // Verificar si el usuario puede gestionar usuarios
  const canManageUsers = () => {
    if (!currentUser) return false;
    
    const userRole = currentUser.role || currentUser.roles?.name;
    return ['Super Administrador', 'Gerente', 'Admin'].includes(userRole);
  };

  // Verificar si el usuario puede ver reportes
  const canViewReports = () => {
    return hasPermission('reportes', 'read');
  };

  // Verificar si el usuario puede ver configuración
  const canViewConfiguration = () => {
    return hasPermission('configuracion', 'read');
  };

  // Verificar si el usuario puede gestionar configuración
  const canManageConfiguration = () => {
    return hasPermission('configuracion', 'update');
  };

  return {
    // Estado
    permissions,
    loading,
    isSuperAdmin,
    error,
    
    // Funciones de verificación básicas
    hasPermission,
    canViewModule,
    canCreate,
    canEdit,
    canDelete,
    canExport,
    canApprove,
    
    // Funciones de verificación de módulos
    getModulePermissions,
    hasFullAccess,
    hasReadOnlyAccess,
    
    // Funciones de listado de módulos
    getAccessibleModules,
    getCreatableModules,
    getEditableModules,
    getDeletableModules,
    getExportableModules,
    getApprovableModules,
    
    // Funciones de verificación de roles especiales
    canManageRoles,
    canManageUsers,
    canViewReports,
    canViewConfiguration,
    canManageConfiguration,
    
    // Función de recarga
    refreshPermissions: fetchUserPermissions
  };
};

export default usePermissions;
