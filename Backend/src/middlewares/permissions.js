// middlewares/permissions.js - SISTEMA DE VERIFICACIÓN DE PERMISOS
const { PrismaClient } = require('@prisma/client');
const { logDatabaseOperation } = require('./logger');
const { auditEvent, AUDIT_ACTIONS } = require('./audit');

const prisma = new PrismaClient();

// Cache para permisos de usuario
const permissionCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para limpiar cache expirado
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of permissionCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      permissionCache.delete(key);
    }
  }
};

// Limpiar cache cada 10 minutos
setInterval(cleanExpiredCache, 10 * 60 * 1000);

// Función para obtener datos del cache
const getCachedPermission = (key) => {
  const cached = permissionCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Función para guardar datos en cache
const setCachedPermission = (key, data) => {
  permissionCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Función para invalidar cache
const invalidatePermissionCache = (userId) => {
  for (const key of permissionCache.keys()) {
    if (key.includes(`user_${userId}`)) {
      permissionCache.delete(key);
    }
  }
};

// =====================================================
// FUNCIONES PRINCIPALES DE VERIFICACIÓN
// =====================================================

/**
 * Verifica si un usuario tiene un permiso específico
 * @param {number} userId - ID del usuario
 * @param {string} module - Módulo del sistema
 * @param {string} action - Acción a verificar (read, create, update, delete, export, approve)
 * @returns {Promise<boolean>} - True si tiene permiso, False si no
 */
const checkUserPermission = async (userId, module, action) => {
  try {
    // Verificar cache primero
    const cacheKey = `user_${userId}_${module}_${action}`;
    const cachedPermission = getCachedPermission(cacheKey);
    
    if (cachedPermission !== null) {
      return cachedPermission;
    }

    // Consultar base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role_permissions: {
              where: { module }
            }
          }
        }
      }
    });

    if (!user || !user.roles) {
      setCachedPermission(cacheKey, false);
      return false;
    }

    const role = user.roles;
    if (!role.role_permissions || role.role_permissions.length === 0) {
      setCachedPermission(cacheKey, false);
      return false;
    }

    const permission = role.role_permissions[0];
    let hasPermission = false;
    
    switch (action) {
      case 'read':
        hasPermission = permission.can_read;
        break;
      case 'create':
        hasPermission = permission.can_create;
        break;
      case 'update':
        hasPermission = permission.can_update;
        break;
      case 'delete':
        hasPermission = permission.can_delete;
        break;
      case 'export':
        hasPermission = permission.can_export;
        break;
      case 'approve':
        hasPermission = permission.can_approve;
        break;
      default:
        hasPermission = false;
    }

    // Guardar en cache
    setCachedPermission(cacheKey, hasPermission);
    
    return hasPermission;
  } catch (error) {
    console.error('Error al verificar permiso:', error);
    return false;
  }
};

/**
 * Verifica si un usuario tiene acceso a un módulo específico
 * @param {number} userId - ID del usuario
 * @param {string} module - Módulo del sistema
 * @returns {Promise<boolean>} - True si tiene acceso, False si no
 */
const checkUserModuleAccess = async (userId, module) => {
  return await checkUserPermission(userId, module, 'read');
};

/**
 * Obtiene todos los permisos de un usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<Object>} - Objeto con todos los permisos
 */
const getUserPermissions = async (userId) => {
  try {
    // Verificar cache primero
    const cacheKey = `user_${userId}_all_permissions`;
    const cachedPermissions = getCachedPermission(cacheKey);
    
    if (cachedPermissions !== null) {
      return cachedPermissions;
    }

    // Consultar base de datos
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role_permissions: true
          }
        }
      }
    });

    if (!user || !user.roles) {
      const emptyPermissions = {};
      setCachedPermission(cacheKey, emptyPermissions);
      return emptyPermissions;
    }

    const role = user.roles;
    const permissions = {};

    if (role.role_permissions) {
      role.role_permissions.forEach(rp => {
        permissions[rp.module] = {
          can_read: rp.can_read,
          can_create: rp.can_create,
          can_update: rp.can_update,
          can_delete: rp.can_delete,
          can_export: rp.can_export,
          can_approve: rp.can_approve
        };
      });
    }

    // Guardar en cache
    setCachedPermission(cacheKey, permissions);
    
    return permissions;
  } catch (error) {
    console.error('Error al obtener permisos del usuario:', error);
    return {};
  }
};

// =====================================================
// MIDDLEWARES PARA EXPRESS
// =====================================================

/**
 * Middleware para verificar permiso específico
 * @param {string} module - Módulo del sistema
 * @param {string} action - Acción requerida
 * @returns {Function} - Middleware de Express
 */
const requirePermission = (module, action) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const hasPermission = await checkUserPermission(userId, module, action);
      
      if (!hasPermission) {
        // Log de auditoría por acceso denegado
        await auditEvent(
          AUDIT_ACTIONS.ACCESS_DENIED, 
          module, 
          null, 
          userId, 
          {
            action,
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
          }
        );

        return res.status(403).json({
          success: false,
          error: 'Acceso denegado',
          details: `No tienes permiso para ${action} en el módulo ${module}`
        });
      }

      // Log de auditoría por acceso exitoso
      await auditEvent(
        AUDIT_ACTIONS.ACCESS_GRANTED, 
        module, 
        null, 
        userId, 
        {
          action,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        }
      );

      next();
    } catch (error) {
      console.error('Error en middleware de permisos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar acceso al módulo
 * @param {string} module - Módulo del sistema
 * @returns {Function} - Middleware de Express
 */
const requireModuleAccess = (module) => {
  return requirePermission(module, 'read');
};

/**
 * Middleware para verificar múltiples permisos
 * @param {Array} permissions - Array de objetos {module, action}
 * @returns {Function} - Middleware de Express
 */
const requireMultiplePermissions = (permissions) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      // Verificar todos los permisos requeridos
      for (const perm of permissions) {
        const hasPermission = await checkUserPermission(userId, perm.module, perm.action);
        
        if (!hasPermission) {
          // Log de auditoría por acceso denegado
          await auditEvent(
            AUDIT_ACTIONS.ACCESS_DENIED, 
            perm.module, 
            null, 
            userId, 
            {
              action: perm.action,
              ip_address: req.ip,
              user_agent: req.get('User-Agent')
            }
          );

          return res.status(403).json({
            success: false,
            error: 'Acceso denegado',
            details: `No tienes permiso para ${perm.action} en el módulo ${perm.module}`
          });
        }
      }

      // Log de auditoría por acceso exitoso
      await auditEvent(
        AUDIT_ACTIONS.ACCESS_GRANTED, 
        'multiple_modules', 
        null, 
        userId, 
        {
          permissions,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        }
      );

      next();
    } catch (error) {
      console.error('Error en middleware de múltiples permisos:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar rol específico
 * @param {string} roleName - Nombre del rol requerido
 * @returns {Function} - Middleware de Express
 */
const requireRole = (roleName) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: true
        }
      });

      if (!user || !user.roles || user.roles.name !== roleName) {
        // Log de auditoría por acceso denegado
        await auditEvent(
          AUDIT_ACTIONS.ACCESS_DENIED, 
          'role_check', 
          null, 
          userId, 
          {
            required_role: roleName,
            current_role: user?.roles?.name || 'none',
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
          }
        );

        return res.status(403).json({
          success: false,
          error: 'Acceso denegado',
          details: `Se requiere el rol: ${roleName}`
        });
      }

      // Log de auditoría por acceso exitoso
      await auditEvent(
        AUDIT_ACTIONS.ACCESS_GRANTED, 
        'role_check', 
        null, 
        userId, 
        {
          role: roleName,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        }
      );

      next();
    } catch (error) {
      console.error('Error en middleware de rol:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
};

/**
 * Middleware para verificar nivel mínimo de rol
 * @param {number} minLevel - Nivel mínimo requerido
 * @returns {Function} - Middleware de Express
 */
const requireRoleLevel = (minLevel) => {
  return async (req, res, next) => {
    try {
      const userId = req.user?.id;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          error: 'Usuario no autenticado'
        });
      }

      const user = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          roles: true
        }
      });

      if (!user || !user.roles || user.roles.level > minLevel) {
        // Log de auditoría por acceso denegado
        await auditEvent(
          AUDIT_ACTIONS.ACCESS_DENIED, 
          'level_check', 
          null, 
          userId, 
          {
            required_level: minLevel,
            current_level: user?.roles?.level || 999,
            ip_address: req.ip,
            user_agent: req.get('User-Agent')
          }
        );

        return res.status(403).json({
          success: false,
          error: 'Acceso denegado',
          details: `Se requiere nivel de rol: ${minLevel} o superior`
        });
      }

      // Log de auditoría por acceso exitoso
      await auditEvent(
        AUDIT_ACTIONS.ACCESS_GRANTED, 
        'level_check', 
        null, 
        userId, 
        {
          level: user.roles.level,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        }
      );

      next();
    } catch (error) {
      console.error('Error en middleware de nivel de rol:', error);
      res.status(500).json({
        success: false,
        error: 'Error interno del servidor'
      });
    }
  };
};

// =====================================================
// FUNCIONES DE UTILIDAD
// =====================================================

/**
 * Verifica si un usuario es administrador
 * @param {number} userId - ID del usuario
 * @returns {Promise<boolean>} - True si es administrador
 */
const isAdmin = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    });

    return user?.roles?.name === 'Administrador';
  } catch (error) {
    console.error('Error al verificar si es administrador:', error);
    return false;
  }
};

/**
 * Verifica si un usuario tiene permisos de super usuario
 * @param {number} userId - ID del usuario
 * @returns {Promise<boolean>} - True si es super usuario
 */
const isSuperUser = async (userId) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    });

    return user?.roles?.level <= 2; // Nivel 1 o 2
  } catch (error) {
    console.error('Error al verificar si es super usuario:', error);
    return false;
  }
};

// =====================================================
// EXPORTACIÓN
// =====================================================

module.exports = {
  // Funciones de verificación
  checkUserPermission,
  checkUserModuleAccess,
  getUserPermissions,
  
  // Middlewares
  requirePermission,
  requireModuleAccess,
  requireMultiplePermissions,
  requireRole,
  requireRoleLevel,
  
  // Funciones de utilidad
  isAdmin,
  isSuperUser,
  
  // Funciones de cache
  invalidatePermissionCache
};
