// routes/roles.js - SISTEMA COMPLETO DE ROLES Y PERMISOS
const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');
const { 
  requirePermission, 
  requireModuleAccess, 
  requireRoleLevel 
} = require('../middlewares/permissions');

// =====================================================
// RUTAS PRINCIPALES DE ROLES
// =====================================================

// Obtener todos los roles (solo usuarios con acceso a usuarios)
router.get('/', 
  requireModuleAccess('usuarios'), 
  rolController.getAllRoles
);

// Obtener rol específico por ID
router.get('/:id', 
  requireModuleAccess('usuarios'), 
  rolController.getRoleById
);

// Crear nuevo rol (solo administradores y super usuarios)
router.post('/', 
  requireRoleLevel(2), 
  rolController.createRole
);

// Actualizar rol existente (solo administradores y super usuarios)
router.put('/:id', 
  requireRoleLevel(2), 
  rolController.updateRole
);

// Eliminar rol (solo administradores)
router.delete('/:id', 
  requireRoleLevel(1), 
  rolController.deleteRole
);

// =====================================================
// RUTAS DE PERMISOS
// =====================================================

// Obtener permisos de un rol específico
router.get('/:roleId/permissions', 
  requireModuleAccess('usuarios'), 
  rolController.getRolePermissions
);

// Actualizar permisos de un rol (solo administradores y super usuarios)
router.put('/:roleId/permissions', 
  requireRoleLevel(2), 
  rolController.updateRolePermissions
);

// =====================================================
// RUTAS DE MÓDULOS DEL SISTEMA
// =====================================================

// Obtener todos los módulos del sistema (público para el frontend)
router.get('/modules/list', 
  rolController.getSystemModules
);

// Obtener todos los roles (público para el frontend)
router.get('/public/list', 
  rolController.getAllRoles
);

// =====================================================
// RUTAS DE UTILIDAD
// =====================================================

// Verificar permisos del usuario actual
router.get('/user/permissions', 
  requireModuleAccess('usuarios'), 
  async (req, res) => {
    try {
      const { getUserPermissions } = require('../middlewares/permissions');
      const permissions = await getUserPermissions(req.user.id);
      
      res.json({
        success: true,
        data: permissions,
        user_id: req.user.id
      });
    } catch (error) {
      console.error('Error al obtener permisos del usuario:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener permisos del usuario'
      });
    }
  }
);

// Verificar permiso específico del usuario
router.post('/user/check-permission', 
  requireModuleAccess('usuarios'), 
  async (req, res) => {
    try {
      const { module, action } = req.body;
      const { checkUserPermission } = require('../middlewares/permissions');
      
      if (!module || !action) {
        return res.status(400).json({
          success: false,
          error: 'Módulo y acción son requeridos'
        });
      }

      const hasPermission = await checkUserPermission(req.user.id, module, action);
      
      res.json({
        success: true,
        data: {
          has_permission: hasPermission,
          module,
          action,
          user_id: req.user.id
        }
      });
    } catch (error) {
      console.error('Error al verificar permiso:', error);
      res.status(500).json({
        success: false,
        error: 'Error al verificar permiso'
      });
    }
  }
);

// =====================================================
// RUTAS DE ADMINISTRACIÓN AVANZADA
// =====================================================

// Obtener estadísticas de roles (solo administradores)
router.get('/admin/stats', 
  requireRoleLevel(1), 
  async (req, res) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      const stats = await prisma.$transaction([
        // Total de roles
        prisma.roles.count(),
        // Total de usuarios por rol
        prisma.roles.findMany({
          select: {
            name: true,
            _count: {
              select: { users: true }
            }
          }
        }),
        // Total de permisos asignados
        prisma.role_permissions.count(),
        // Módulos más utilizados
        prisma.role_permissions.groupBy({
          by: ['module'],
          _count: {
            module: true
          },
          orderBy: {
            _count: {
              module: 'desc'
            }
          },
          take: 5
        })
      ]);

      res.json({
        success: true,
        data: {
          total_roles: stats[0],
          users_per_role: stats[1],
          total_permissions: stats[2],
          top_modules: stats[3]
        }
      });
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
      res.status(500).json({
        success: false,
        error: 'Error al obtener estadísticas'
      });
    }
  }
);

// Sincronizar permisos con módulos del sistema (solo administradores)
router.post('/admin/sync-permissions', 
  requireRoleLevel(1), 
  async (req, res) => {
    try {
      const { PrismaClient } = require('@prisma/client');
      const prisma = new PrismaClient();

      // Obtener todos los módulos activos
      const modules = await prisma.system_modules.findMany({
        where: { is_active: true }
      });

      // Obtener todos los roles activos
      const roles = await prisma.roles.findMany({
        where: { is_active: true }
      });

      let created = 0;
      let updated = 0;

      // Sincronizar permisos para cada rol
      for (const role of roles) {
        for (const module of modules) {
          // Verificar si ya existe el permiso
          const existingPermission = await prisma.role_permissions.findFirst({
            where: {
              role_id: role.id,
              module: module.name
            }
          });

          if (!existingPermission) {
            // Crear permiso por defecto basado en el nivel del rol
            let defaultPermissions = {
              can_read: false,
              can_create: false,
              can_update: false,
              can_delete: false,
              can_export: false,
              can_approve: false
            };

            // Asignar permisos por defecto según el nivel del rol
            switch (role.level) {
              case 1: // Administrador
                defaultPermissions = {
                  can_read: true,
                  can_create: true,
                  can_update: true,
                  can_delete: true,
                  can_export: true,
                  can_approve: true
                };
                break;
              case 2: // Super Usuario
                defaultPermissions = {
                  can_read: true,
                  can_create: true,
                  can_update: true,
                  can_delete: module.name !== 'proyectos',
                  can_export: true,
                  can_approve: module.name !== 'usuarios' && module.name !== 'permisos'
                };
                break;
              case 3: // Desarrollador
                defaultPermissions = {
                  can_read: !['usuarios', 'permisos', 'contabilidad', 'costos_fijos'].includes(module.name),
                  can_create: !['usuarios', 'permisos', 'contabilidad', 'costos_fijos'].includes(module.name),
                  can_update: !['usuarios', 'permisos', 'contabilidad', 'costos_fijos'].includes(module.name),
                  can_delete: !['usuarios', 'permisos', 'contabilidad', 'costos_fijos', 'proyectos'].includes(module.name),
                  can_export: !['usuarios', 'permisos', 'contabilidad', 'costos_fijos'].includes(module.name),
                  can_approve: false
                };
                break;
              default: // Usuarios básicos
                defaultPermissions = {
                  can_read: !['usuarios', 'permisos', 'auditoria', 'contabilidad', 'costos_fijos'].includes(module.name),
                  can_create: !['usuarios', 'permisos', 'auditoria', 'contabilidad', 'costos_fijos', 'proyectos', 'cotizaciones'].includes(module.name),
                  can_update: !['usuarios', 'permisos', 'auditoria', 'contabilidad', 'costos_fijos', 'proyectos', 'cotizaciones'].includes(module.name),
                  can_delete: false,
                  can_export: !['usuarios', 'permisos', 'auditoria', 'contabilidad', 'costos_fijos'].includes(module.name),
                  can_approve: false
                };
            }

            await prisma.role_permissions.create({
              data: {
                role_id: role.id,
                module: module.name,
                ...defaultPermissions
              }
            });
            created++;
          }
        }
      }

      res.json({
        success: true,
        message: 'Permisos sincronizados exitosamente',
        data: {
          permissions_created: created,
          permissions_updated: updated,
          total_modules: modules.length,
          total_roles: roles.length
        }
      });
    } catch (error) {
      console.error('Error al sincronizar permisos:', error);
      res.status(500).json({
        success: false,
        error: 'Error al sincronizar permisos',
        details: error.message
      });
    }
  }
);

module.exports = router;
