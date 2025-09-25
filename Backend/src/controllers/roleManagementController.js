// controllers/roleManagementController.js - Controlador para gestión de roles y permisos
const { PrismaClient } = require('@prisma/client');
const { logDatabaseOperation, logAuth } = require('../middlewares/logger');
const { auditEvent, AUDIT_ACTIONS } = require('../middlewares/audit');

const prisma = new PrismaClient();

// =====================================================
// OBTENER TODOS LOS ROLES DEL SISTEMA
// =====================================================

exports.getAllRoles = async (req, res) => {
  try {

    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      include: {
        _count: {
          select: { users: true }
        }
      },
      orderBy: { level: 'asc' }
    });

    res.json({
      success: true,
      data: roles,
      total: roles.length,
      message: 'Roles obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener roles:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener roles del sistema'
    });
  }
};

// =====================================================
// OBTENER ROL POR ID CON PERMISOS
// =====================================================

exports.getRoleById = async (req, res) => {
  try {
    const { id } = req.params;

    const role = await prisma.roles.findUnique({
      where: { id: parseInt(id) },
      include: {
        role_permissions: true,
        _count: {
          select: { users: true }
        }
      }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    res.json({
      success: true,
      data: role,
      message: 'Rol obtenido exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener rol:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener rol'
    });
  }
};

// =====================================================
// CREAR NUEVO ROL
// =====================================================

exports.createRole = async (req, res) => {
  try {
    const { name, description, level } = req.body;

    // Validaciones
    if (!name || !level) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y nivel del rol son requeridos'
      });
    }

    // Verificar que el nombre del rol no exista
    const existingRole = await prisma.roles.findUnique({
      where: { name: name.trim() }
    });

    if (existingRole) {
      return res.status(400).json({
        success: false,
        message: 'Ya existe un rol con ese nombre'
      });
    }

    // Crear el rol
    const newRole = await prisma.roles.create({
      data: {
        name: name.trim(),
        description: description?.trim() || '',
        level: parseInt(level),
        is_active: true,
        created_at: new Date(),
        updated_at: new Date()
      }
    });

    // Registrar en auditoría
    await auditEvent({
      userId: req.user?.id || null,
      userEmail: req.user?.email || 'system@admin',
      action: AUDIT_ACTIONS.CREATE,
      tableName: 'roles',
      recordId: newRole.id,
      details: {
        action: 'Rol creado',
        roleName: newRole.name,
        level: newRole.level
      }
    });

    res.status(201).json({
      success: true,
      data: newRole,
      message: 'Rol creado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al crear rol:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al crear rol'
    });
  }
};

// =====================================================
// ACTUALIZAR ROL
// =====================================================

exports.updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, level, is_active } = req.body;

    // Verificar que el rol existe
    const existingRole = await prisma.roles.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar que el nombre no esté duplicado (si se está cambiando)
    if (name && name !== existingRole.name) {
      const duplicateRole = await prisma.roles.findUnique({
        where: { name: name.trim() }
      });

      if (duplicateRole) {
        return res.status(400).json({
          success: false,
          message: 'Ya existe un rol con ese nombre'
        });
      }
    }

    // Actualizar el rol
    const updatedRole = await prisma.roles.update({
      where: { id: parseInt(id) },
      data: {
        name: name?.trim() || existingRole.name,
        description: description?.trim() || existingRole.description,
        level: level ? parseInt(level) : existingRole.level,
        is_active: is_active !== undefined ? is_active : existingRole.is_active,
        updated_at: new Date()
      }
    });

    // Registrar en auditoría
    await auditEvent({
      userId: req.user?.id || null,
      userEmail: req.user?.email || 'system@admin',
      action: AUDIT_ACTIONS.UPDATE,
      tableName: 'roles',
      recordId: updatedRole.id,
      details: {
        action: 'Rol actualizado',
        roleName: updatedRole.name,
        previousData: existingRole,
        newData: updatedRole
      }
    });

    res.json({
      success: true,
      data: updatedRole,
      message: 'Rol actualizado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al actualizar rol:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al actualizar rol'
    });
  }
};

// =====================================================
// ELIMINAR ROL
// =====================================================

exports.deleteRole = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar que el rol existe
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
        message: 'Rol no encontrado'
      });
    }

    // Verificar que no haya usuarios usando este rol
    if (existingRole._count.users > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el rol porque ${existingRole._count.users} usuario(s) lo están usando`
      });
    }

    // Verificar que no sea el rol de Super Administrador
    if (existingRole.name === 'Super Administrador') {
      return res.status(400).json({
        success: false,
        message: 'No se puede eliminar el rol de Super Administrador'
      });
    }

    // Eliminar el rol
    await prisma.roles.delete({
      where: { id: parseInt(id) }
    });

    // Registrar en auditoría
    await auditEvent({
      userId: req.user?.id || null,
      userEmail: req.user?.email || 'system@admin',
      action: AUDIT_ACTIONS.DELETE,
      tableName: 'roles',
      recordId: existingRole.id,
      details: {
        action: 'Rol eliminado',
        roleName: existingRole.name
      }
    });

    res.json({
      success: true,
      message: 'Rol eliminado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al eliminar rol:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al eliminar rol'
    });
  }
};

// =====================================================
// OBTENER TODOS LOS MÓDULOS DEL SISTEMA
// =====================================================

exports.getAllModules = async (req, res) => {
  try {

    const modules = await prisma.systemModules.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: modules,
      total: modules.length,
      message: 'Módulos obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener módulos:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener módulos del sistema'
    });
  }
};

// =====================================================
// OBTENER PERMISOS DE UN ROL
// =====================================================

exports.getRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;

    const permissions = await prisma.rolePermissions.findMany({
      where: { role_id: parseInt(roleId) }
    });

    res.json({
      success: true,
      data: permissions,
      total: permissions.length,
      message: 'Permisos del rol obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener permisos del rol:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener permisos del rol'
    });
  }
};

// =====================================================
// ACTUALIZAR PERMISOS DE UN ROL
// =====================================================

exports.updateRolePermissions = async (req, res) => {
  try {
    const { roleId } = req.params;
    const { permissions } = req.body;

    // Verificar que el rol existe
    const existingRole = await prisma.roles.findUnique({
      where: { id: parseInt(roleId) }
    });

    if (!existingRole) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar que no sea el rol de Super Administrador (tiene todos los permisos)
    if (existingRole.name === 'Super Administrador') {
      return res.status(400).json({
        success: false,
        message: 'No se pueden modificar los permisos del Super Administrador'
      });
    }

    // Procesar cada permiso
    const permissionUpdates = [];
    
    for (const permission of permissions) {
      const { module, can_read, can_create, can_update, can_delete, can_export, can_approve } = permission;
      
      // Actualizar o crear el permiso
      const updatedPermission = await prisma.rolePermissions.upsert({
        where: {
          role_id_module: {
            role_id: parseInt(roleId),
            module: module
          }
        },
        update: {
          can_read: can_read || false,
          can_create: can_create || false,
          can_update: can_update || false,
          can_delete: can_delete || false,
          can_export: can_export || false,
          can_approve: can_approve || false,
          updated_at: new Date()
        },
        create: {
          role_id: parseInt(roleId),
          module: module,
          can_read: can_read || false,
          can_create: can_create || false,
          can_update: can_update || false,
          can_delete: can_delete || false,
          can_export: can_export || false,
          can_approve: can_approve || false,
          created_at: new Date(),
          updated_at: new Date()
        }
      });
      
      permissionUpdates.push(updatedPermission);
    }

    // Registrar en auditoría
    await auditEvent({
      userId: req.user?.id || null,
      userEmail: req.user?.email || 'system@admin',
      action: AUDIT_ACTIONS.UPDATE,
      tableName: 'role_permissions',
      recordId: parseInt(roleId),
      details: {
        action: 'Permisos de rol actualizados',
        roleName: existingRole.name,
        permissionsUpdated: permissionUpdates.length
      }
    });

    res.json({
      success: true,
      data: permissionUpdates,
      total: permissionUpdates.length,
      message: 'Permisos del rol actualizados exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al actualizar permisos del rol:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al actualizar permisos del rol'
    });
  }
};

// =====================================================
// OBTENER PERMISOS DEL USUARIO ACTUAL
// =====================================================

exports.getCurrentUserPermissions = async (req, res) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Obtener usuario con su rol y permisos
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

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si es Super Administrador, tiene todos los permisos
    if (user.roles?.name === 'Super Administrador') {
      const allModules = await prisma.systemModules.findMany({
        where: { is_active: true }
      });

      const superAdminPermissions = allModules.map(module => ({
        module: module.name,
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_export: true,
        can_approve: true
      }));

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.roles?.name,
            roleLevel: user.roles?.level
          },
          permissions: superAdminPermissions,
          isSuperAdmin: true
        },
        message: 'Permisos del Super Administrador obtenidos exitosamente'
      });
    }

    // Para otros roles, obtener permisos específicos
    const permissions = user.roles?.role_permissions || [];

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.roles?.name,
          roleLevel: user.roles?.level
        },
        permissions: permissions,
        isSuperAdmin: false
      },
      message: 'Permisos del usuario obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener permisos del usuario:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener permisos del usuario'
    });
  }
};

// =====================================================
// VERIFICAR PERMISO ESPECÍFICO DEL USUARIO
// =====================================================

exports.checkUserPermission = async (req, res) => {
  try {
    const { module, action } = req.query;
    const userId = req.user?.id;

    if (!userId || !module || !action) {
      return res.status(400).json({
        success: false,
        message: 'Usuario, módulo y acción son requeridos'
      });
    }

    // Obtener usuario con su rol
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: true
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si es Super Administrador, tiene todos los permisos
    if (user.roles?.name === 'Super Administrador') {
      return res.json({
        success: true,
        data: {
          hasPermission: true,
          reason: 'Super Administrador'
        },
        message: 'Permiso concedido'
      });
    }

    // Verificar permiso específico
    const permission = await prisma.rolePermissions.findUnique({
      where: {
        role_id_module: {
          role_id: user.role_id,
          module: module
        }
      }
    });

    let hasPermission = false;
    let reason = '';

    if (permission) {
      switch (action) {
        case 'read':
          hasPermission = permission.can_read;
          reason = hasPermission ? 'Permiso de lectura concedido' : 'Sin permiso de lectura';
          break;
        case 'create':
          hasPermission = permission.can_create;
          reason = hasPermission ? 'Permiso de creación concedido' : 'Sin permiso de creación';
          break;
        case 'update':
          hasPermission = permission.can_update;
          reason = hasPermission ? 'Permiso de actualización concedido' : 'Sin permiso de actualización';
          break;
        case 'delete':
          hasPermission = permission.can_delete;
          reason = hasPermission ? 'Permiso de eliminación concedido' : 'Sin permiso de eliminación';
          break;
        case 'export':
          hasPermission = permission.can_export;
          reason = hasPermission ? 'Permiso de exportación concedido' : 'Sin permiso de exportación';
          break;
        case 'approve':
          hasPermission = permission.can_approve;
          reason = hasPermission ? 'Permiso de aprobación concedido' : 'Sin permiso de aprobación';
          break;
        default:
          hasPermission = false;
          reason = 'Acción no reconocida';
      }
    } else {
      reason = 'Sin permisos configurados para este módulo';
    }

    res.json({
      success: true,
      data: {
        hasPermission,
        reason,
        module,
        action,
        userRole: user.roles?.name
      },
      message: hasPermission ? 'Permiso concedido' : 'Permiso denegado'
    });

  } catch (error) {
    console.error('❌ Error al verificar permiso:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al verificar permiso'
    });
  }
};

// =====================================================
// OBTENER PERMISOS POR FIREBASE UID
// =====================================================

exports.getUserPermissionsByFirebaseUID = async (req, res) => {
  try {
    const { firebaseUid } = req.params;

    if (!firebaseUid) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID es requerido'
      });
    }

    // Obtener usuario por Firebase UID con su rol y permisos
    const user = await prisma.user.findUnique({
      where: { firebase_uid: firebaseUid },
      include: {
        roles: {
          include: {
            role_permissions: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Si es Super Administrador, tiene todos los permisos
    if (user.roles?.name === 'Super Administrador') {
      const allModules = await prisma.systemModules.findMany({
        where: { is_active: true }
      });

      const superAdminPermissions = allModules.map(module => ({
        module: module.name,
        can_read: true,
        can_create: true,
        can_update: true,
        can_delete: true,
        can_export: true,
        can_approve: true
      }));

      return res.json({
        success: true,
        data: {
          user: {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.roles?.name,
            roleLevel: user.roles?.level
          },
          permissions: superAdminPermissions,
          isSuperAdmin: true
        },
        message: 'Permisos del Super Administrador obtenidos exitosamente'
      });
    }

    // Para otros roles, obtener permisos específicos
    const permissions = user.roles?.role_permissions || [];
    
    // Convertir permisos a formato esperado por el frontend
    const formattedPermissions = {};
    permissions.forEach(perm => {
      formattedPermissions[perm.module] = {
        can_read: perm.can_read,
        can_create: perm.can_create,
        can_update: perm.can_update,
        can_delete: perm.can_delete,
        can_export: perm.can_export,
        can_approve: perm.can_approve
      };
    });

    res.json({
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.roles?.name,
          roleLevel: user.roles?.level
        },
        permissions: formattedPermissions,
        isSuperAdmin: false
      },
      message: 'Permisos del usuario obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener permisos del usuario por Firebase UID:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener permisos del usuario'
    });
  }
};
