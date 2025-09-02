// controllers/rolController.js - SISTEMA COMPLETO DE ROLES Y PERMISOS
const { PrismaClient } = require('@prisma/client');
const { logDatabaseOperation } = require('../middlewares/logger');
const { auditEvent, AUDIT_ACTIONS } = require('../middlewares/audit');

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Cache para roles y permisos
const roleCache = new Map();
const CACHE_DURATION = 10 * 60 * 1000; // 10 minutos

// Función para limpiar cache expirado
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of roleCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      roleCache.delete(key);
    }
  }
};

// Limpiar cache cada 15 minutos
setInterval(cleanExpiredCache, 15 * 60 * 1000);

// Función para obtener datos del cache
const getCachedData = (key) => {
  const cached = roleCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Función para guardar datos en cache
const setCachedData = (key, data) => {
  roleCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Función para invalidar cache
const invalidateCache = (pattern) => {
  for (const key of roleCache.keys()) {
    if (key.includes(pattern)) {
      roleCache.delete(key);
    }
  }
};

// =====================================================
// CONTROLADOR PRINCIPAL DE ROLES
// =====================================================

exports.getAllRoles = async (req, res) => {
  const start = Date.now();
  try {
    // Verificar cache primero
    const cacheKey = 'all_roles_with_permissions';
    const cachedRoles = getCachedData(cacheKey);
    
    if (cachedRoles) {
      logDatabaseOperation('SELECT', 'roles', Date.now() - start, true, 'CACHE_HIT');
      return res.json({
        success: true,
        data: cachedRoles,
        total: cachedRoles.length,
        fromCache: true,
        timestamp: new Date().toISOString()
      });
    }

    // Consulta con Prisma incluyendo permisos
    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      include: {
        role_permissions: true,
        _count: {
          select: {
            users: true
          }
        }
      },
      orderBy: { level: 'asc' }
    });

    // Formatear respuesta
    const formattedRoles = roles.map(role => ({
      id: role.id,
      name: role.name,
      description: role.description,
      level: role.level,
      is_active: role.is_active,
      created_at: role.created_at,
      updated_at: role.updated_at,
      user_count: role._count.users,
      permissions: role.role_permissions.map(rp => ({
        module: rp.module,
        can_read: rp.can_read,
        can_create: rp.can_create,
        can_update: rp.can_update,
        can_delete: rp.can_delete,
        can_export: rp.can_export,
        can_approve: rp.can_approve
      }))
    }));

    // Guardar en cache
    setCachedData(cacheKey, formattedRoles);
    
    logDatabaseOperation('SELECT', 'roles', Date.now() - start, true);
    res.json({
      success: true,
      data: formattedRoles,
      total: formattedRoles.length,
      fromCache: false
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'roles', Date.now() - start, false, error);
    console.error('Error al obtener roles:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener roles',
      details: error.message 
    });
  }
};

exports.getRoleById = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    
    const role = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
      include: {
        role_permissions: true,
        users: {
          select: {
            id: true,
            name: true,
            email: true,
            is_active: true
          }
        },
        _count: {
          select: {
            users: true
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado'
      });
    }

    // Formatear respuesta
    const formattedRole = {
      id: role.id,
      name: role.name,
      description: role.description,
      level: role.level,
      is_active: role.is_active,
      created_at: role.created_at,
      updated_at: role.updated_at,
      user_count: role._count.users,
      permissions: role.role_permissions.map(rp => ({
        module: rp.module,
        can_read: rp.can_read,
        can_create: rp.can_create,
        can_update: rp.can_update,
        can_delete: rp.can_delete,
        can_export: rp.can_export,
        can_approve: rp.can_approve
      })),
      users: role.users
    };

    logDatabaseOperation('SELECT', 'roles', Date.now() - start, true);
    res.json({
      success: true,
      data: formattedRole
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'roles', Date.now() - start, false, error);
    console.error('Error al obtener rol:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener rol',
      details: error.message 
    });
  }
};

exports.createRole = async (req, res) => {
  const start = Date.now();
  try {
    const { name, description, level, permissions } = req.body;
    
    // Validación
    if (!name || !description || !level) {
      return res.status(400).json({
        success: false,
        error: 'Nombre, descripción y nivel son requeridos'
      });
    }

    if (level < 1 || level > 10) {
      return res.status(400).json({
        success: false,
        error: 'El nivel debe estar entre 1 y 10'
      });
    }

    // Verificar si el rol ya existe
    const existingRole = await prisma.roles.findFirst({
      where: { name: { equals: name, mode: 'insensitive' } }
    });

    if (existingRole) {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un rol con ese nombre'
      });
    }

    // Crear rol con transacción
    const result = await prisma.$transaction(async (tx) => {
      // Crear el rol
      const newRole = await tx.roles.create({
        data: {
          name,
          description,
          level: parseInt(level),
          is_active: true
        }
      });

      // Si se proporcionan permisos, crearlos
      if (permissions && Array.isArray(permissions)) {
        for (const perm of permissions) {
          await tx.role_permissions.create({
            data: {
              role_id: newRole.id,
              module: perm.module,
              can_read: perm.can_read || false,
              can_create: perm.can_create || false,
              can_update: perm.can_update || false,
              can_delete: perm.can_delete || false,
              can_export: perm.can_export || false,
              can_approve: perm.can_approve || false
            }
          });
        }
      }

      return newRole;
    });

    // Invalidar cache
    invalidateCache('all_roles');
    invalidateCache('role_');

    // Log de auditoría
    await auditEvent(AUDIT_ACTIONS.CREATE, 'roles', result.id, req.user?.id);

    logDatabaseOperation('INSERT', 'roles', Date.now() - start, true);
    res.status(201).json({
      success: true,
      message: 'Rol creado exitosamente',
      data: result
    });
  } catch (error) {
    logDatabaseOperation('INSERT', 'roles', Date.now() - start, false, error);
    console.error('Error al crear rol:', error);
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un rol con ese nombre'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error al crear rol',
      details: error.message 
    });
  }
};

exports.updateRole = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar si el rol existe
    const existingRole = await prisma.roles.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado'
      });
    }

    // Validar nivel si se está actualizando
    if (updateData.level && (updateData.level < 1 || updateData.level > 10)) {
      return res.status(400).json({
        success: false,
        error: 'El nivel debe estar entre 1 y 10'
      });
    }

    // Actualizar rol con transacción
    const result = await prisma.$transaction(async (tx) => {
      // Actualizar datos básicos del rol
      const updatedRole = await tx.roles.update({
        where: { id: parseInt(id) },
        data: {
          name: updateData.name,
          description: updateData.description,
          level: updateData.level ? parseInt(updateData.level) : undefined,
          is_active: updateData.is_active
        }
      });

      // Si se proporcionan permisos, actualizarlos
      if (updateData.permissions && Array.isArray(updateData.permissions)) {
        // Eliminar permisos existentes
        await tx.role_permissions.deleteMany({
          where: { role_id: parseInt(id) }
        });

        // Crear nuevos permisos
        for (const perm of updateData.permissions) {
          await tx.role_permissions.create({
            data: {
              role_id: parseInt(id),
              module: perm.module,
              can_read: perm.can_read || false,
              can_create: perm.can_create || false,
              can_update: perm.can_update || false,
              can_delete: perm.can_delete || false,
              can_export: perm.can_export || false,
              can_approve: perm.can_approve || false
            }
          });
        }
      }

      return updatedRole;
    });

    // Invalidar cache
    invalidateCache('all_roles');
    invalidateCache(`role_${id}`);

    // Log de auditoría
    await auditEvent(AUDIT_ACTIONS.UPDATE, 'roles', parseInt(id), req.user?.id);

    logDatabaseOperation('UPDATE', 'roles', Date.now() - start, true);
    res.json({
      success: true,
      message: 'Rol actualizado exitosamente',
      data: result
    });
  } catch (error) {
    logDatabaseOperation('UPDATE', 'roles', Date.now() - start, false, error);
    console.error('Error al actualizar rol:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado'
      });
    }
    
    if (error.code === 'P2002') {
      return res.status(409).json({
        success: false,
        error: 'Ya existe un rol con ese nombre'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar rol',
      details: error.message 
    });
  }
};

exports.deleteRole = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    
    // Verificar si el rol existe
    const existingRole = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
      include: {
        _count: {
          select: { users: true }
        }
      }
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado'
      });
    }

    // Verificar si hay usuarios usando este rol
    if (existingRole._count.users > 0) {
      return res.status(400).json({
        success: false,
        error: `No se puede eliminar el rol. Hay ${existingRole._count.users} usuario(s) asignado(s) a este rol.`,
        userCount: existingRole._count.users
      });
    }

    // Eliminar rol con transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar permisos del rol
      await tx.role_permissions.deleteMany({
        where: { role_id: parseInt(id) }
      });

      // Eliminar configuraciones del rol
      await tx.role_config.deleteMany({
        where: { role_id: parseInt(id) }
      });

      // Eliminar el rol
      await tx.roles.delete({
        where: { id: parseInt(id) }
      });
    });

    // Invalidar cache
    invalidateCache('all_roles');
    invalidateCache(`role_${id}`);

    // Log de auditoría
    await auditEvent(AUDIT_ACTIONS.DELETE, 'roles', parseInt(id), req.user?.id);

    logDatabaseOperation('DELETE', 'roles', Date.now() - start, true);
    res.json({
      success: true,
      message: 'Rol eliminado exitosamente'
    });
  } catch (error) {
    logDatabaseOperation('DELETE', 'roles', Date.now() - start, false, error);
    console.error('Error al eliminar rol:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        error: 'Rol no encontrado'
      });
    }
    
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar rol',
      details: error.message 
    });
  }
};

// =====================================================
// CONTROLADOR DE PERMISOS
// =====================================================

exports.getRolePermissions = async (req, res) => {
  const start = Date.now();
  try {
    const { roleId } = req.params;
    
    const permissions = await prisma.role_permissions.findMany({
      where: { role_id: parseInt(roleId) },
      include: {
        system_modules: true
      },
      orderBy: { module: 'asc' }
    });

    logDatabaseOperation('SELECT', 'role_permissions', Date.now() - start, true);
    res.json({
      success: true,
      data: permissions,
      total: permissions.length
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'role_permissions', Date.now() - start, false, error);
    console.error('Error al obtener permisos del rol:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener permisos del rol',
      details: error.message 
    });
  }
};

exports.updateRolePermissions = async (req, res) => {
  const start = Date.now();
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;
    
    if (!permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        success: false,
        error: 'Los permisos son requeridos y deben ser un array'
      });
    }

    // Actualizar permisos con transacción
    await prisma.$transaction(async (tx) => {
      // Eliminar permisos existentes
      await tx.role_permissions.deleteMany({
        where: { role_id: parseInt(roleId) }
      });

      // Crear nuevos permisos
      for (const perm of permissions) {
        await tx.role_permissions.create({
          data: {
            role_id: parseInt(roleId),
            module: perm.module,
            can_read: perm.can_read || false,
            can_create: perm.can_create || false,
            can_update: perm.can_update || false,
            can_delete: perm.can_delete || false,
            can_export: perm.can_export || false,
            can_approve: perm.can_approve || false
          }
        });
      }
    });

    // Invalidar cache
    invalidateCache('all_roles');
    invalidateCache(`role_${roleId}`);

    // Log de auditoría
    await auditEvent(AUDIT_ACTIONS.UPDATE, 'role_permissions', parseInt(roleId), req.user?.id);

    logDatabaseOperation('UPDATE', 'role_permissions', Date.now() - start, true);
    res.json({
      success: true,
      message: 'Permisos del rol actualizados exitosamente'
    });
  } catch (error) {
    logDatabaseOperation('UPDATE', 'role_permissions', Date.now() - start, false, error);
    console.error('Error al actualizar permisos del rol:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al actualizar permisos del rol',
      details: error.message 
    });
  }
};

// =====================================================
// CONTROLADOR DE MÓDULOS DEL SISTEMA
// =====================================================

exports.getSystemModules = async (req, res) => {
  const start = Date.now();
  try {
    const modules = await prisma.system_modules.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    logDatabaseOperation('SELECT', 'system_modules', Date.now() - start, true);
    res.json({
      success: true,
      data: modules,
      total: modules.length
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'system_modules', Date.now() - start, false, error);
    console.error('Error al obtener módulos del sistema:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener módulos del sistema',
      details: error.message 
    });
  }
};

// =====================================================
// UTILIDADES
// =====================================================

exports.checkUserPermission = async (userId, module, action) => {
  try {
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
      return false;
    }

    const role = user.roles;
    if (!role.role_permissions || role.role_permissions.length === 0) {
      return false;
    }

    const permission = role.role_permissions[0];
    
    switch (action) {
      case 'read':
        return permission.can_read;
      case 'create':
        return permission.can_create;
      case 'update':
        return permission.can_update;
      case 'delete':
        return permission.can_delete;
      case 'export':
        return permission.can_export;
      case 'approve':
        return permission.can_approve;
      default:
        return false;
    }
  } catch (error) {
    console.error('Error al verificar permiso:', error);
    return false;
  }
};

// Función para cerrar la conexión de Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});