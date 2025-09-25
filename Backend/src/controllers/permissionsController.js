// Backend/src/controllers/permissionsController.js
// =====================================================
// CONTROLADOR PARA CONFIGURAR PERMISOS ESPECÍFICOS
// =====================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * Configurar permisos para DESARROLLADOR y OPERADOR
 * Solo pueden acceder a: Gestión de Proyectos y Mi Perfil
 */
const configureDevOperatorPermissions = async (req, res) => {
  try {

    // Obtener todos los módulos del sistema
    const modules = await prisma.modules.findMany();

    // Obtener los roles DESARROLLADOR y OPERADOR
    const roles = await prisma.roles.findMany({
      where: {
        name: {
          in: ['Desarrollador', 'Operador', 'DESARROLLADOR', 'OPERADOR']
        }
      }
    });

    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron los roles DESARROLLADOR u OPERADOR'
      });
    }

    // Módulos permitidos para DESARROLLADOR y OPERADOR
    const allowedModules = [
      'project_management',  // Gestión de Proyectos
      'mi_perfil',          // Mi Perfil
      'dashboard'           // Dashboard (para navegación básica)
    ];

    const results = [];

    // Configurar permisos para cada rol
    for (const role of roles) {

      for (const module of modules) {
        const isAllowed = allowedModules.includes(module.name);
        
        const permissions = {
          can_read: isAllowed,
          can_create: isAllowed && module.name === 'project_management',
          can_update: isAllowed && (module.name === 'project_management' || module.name === 'mi_perfil'),
          can_delete: false, // Nunca pueden eliminar
          can_export: false,  // Nunca pueden exportar
          can_approve: false  // Nunca pueden aprobar
        };

        // Buscar permiso existente
        const existingPermission = await prisma.permissions.findFirst({
          where: {
            role_id: role.id,
            module_id: module.id
          }
        });

        let result;
        if (existingPermission) {
          // Actualizar permiso existente
          result = await prisma.permissions.update({
            where: { id: existingPermission.id },
            data: permissions
          });

        } else {
          // Crear nuevo permiso
          result = await prisma.permissions.create({
            data: {
              role_id: role.id,
              module_id: module.id,
              ...permissions
            }
          });

        }

        results.push({
          role: role.name,
          module: module.name,
          permissions: permissions,
          action: existingPermission ? 'updated' : 'created'
        });
      }
    }

    res.json({
      success: true,
      message: 'Permisos configurados exitosamente para DESARROLLADOR y OPERADOR',
      data: {
        roles: roles.map(r => r.name),
        allowedModules: allowedModules,
        totalPermissions: results.length,
        summary: {
          'Gestión de Proyectos': 'Acceso completo (crear, leer, actualizar)',
          'Mi Perfil': 'Acceso completo (leer, actualizar)',
          'Dashboard': 'Solo lectura',
          'Otros módulos': 'Sin acceso'
        }
      }
    });

  } catch (error) {
    console.error('❌ Error configurando permisos:', error);
    res.status(500).json({
      success: false,
      message: 'Error configurando permisos',
      error: error.message
    });
  }
};

/**
 * Obtener permisos de un rol específico
 */
const getRolePermissions = async (req, res) => {
  try {
    const { roleName } = req.params;
    
    const role = await prisma.roles.findFirst({
      where: { name: roleName },
      include: {
        permissions: {
          include: {
            modules: true
          }
        }
      }
    });

    if (!role) {
      return res.status(404).json({
        success: false,
        message: `Rol ${roleName} no encontrado`
      });
    }

    res.json({
      success: true,
      data: {
        role: role.name,
        permissions: role.permissions.map(p => ({
          module: p.modules.name,
          can_read: p.can_read,
          can_create: p.can_create,
          can_update: p.can_update,
          can_delete: p.can_delete,
          can_export: p.can_export,
          can_approve: p.can_approve
        }))
      }
    });

  } catch (error) {
    console.error('❌ Error obteniendo permisos:', error);
    res.status(500).json({
      success: false,
      message: 'Error obteniendo permisos',
      error: error.message
    });
  }
};

module.exports = {
  configureDevOperatorPermissions,
  getRolePermissions
};
