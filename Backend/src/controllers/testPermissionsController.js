// Backend/src/controllers/testPermissionsController.js
// =====================================================
// CONTROLADOR DE PRUEBA PARA PERMISOS
// =====================================================

const { PrismaClient } = require('@prisma/client');

/**
 * Probar conexión a la base de datos y obtener información básica
 */
const testDatabaseConnection = async (req, res) => {
  try {
    console.log('🧪 Probando conexión a la base de datos...');
    
    const prisma = new PrismaClient();
    
    // Probar conexión básica
    await prisma.$connect();
    console.log('✅ Conexión a la base de datos establecida');
    
    // Obtener información básica
    const roles = await prisma.roles.findMany({
      select: {
        id: true,
        name: true,
        level: true
      }
    });
    
    const modules = await prisma.modules.findMany({
      select: {
        id: true,
        name: true
      }
    });
    
    await prisma.$disconnect();
    
    res.json({
      success: true,
      message: 'Conexión a la base de datos exitosa',
      data: {
        roles: roles,
        modules: modules,
        totalRoles: roles.length,
        totalModules: modules.length
      }
    });

  } catch (error) {
    console.error('❌ Error en prueba de conexión:', error);
    res.status(500).json({
      success: false,
      message: 'Error en prueba de conexión',
      error: error.message
    });
  }
};

/**
 * Configurar permisos básicos para DESARROLLADOR y OPERADOR
 */
const configureDevOperatorPermissionsSimple = async (req, res) => {
  try {
    console.log('🔐 Configurando permisos básicos para DESARROLLADOR y OPERADOR...');
    
    const prisma = new PrismaClient();
    await prisma.$connect();
    
    // Buscar roles DESARROLLADOR y OPERADOR
    const roles = await prisma.roles.findMany({
      where: {
        name: {
          in: ['Desarrollador', 'Operador', 'DESARROLLADOR', 'OPERADOR']
        }
      }
    });
    
    console.log(`👥 Roles encontrados: ${roles.length}`, roles.map(r => r.name));
    
    if (roles.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No se encontraron los roles DESARROLLADOR u OPERADOR'
      });
    }
    
    // Buscar módulos específicos
    const projectManagementModule = await prisma.modules.findFirst({
      where: { name: 'project_management' }
    });
    
    const miPerfilModule = await prisma.modules.findFirst({
      where: { name: 'mi_perfil' }
    });
    
    const dashboardModule = await prisma.modules.findFirst({
      where: { name: 'dashboard' }
    });
    
    console.log('📦 Módulos encontrados:');
    console.log('  - project_management:', projectManagementModule ? '✅' : '❌');
    console.log('  - mi_perfil:', miPerfilModule ? '✅' : '❌');
    console.log('  - dashboard:', dashboardModule ? '✅' : '❌');
    
    const allowedModules = [projectManagementModule, miPerfilModule, dashboardModule].filter(Boolean);
    
    const results = [];
    
    // Configurar permisos para cada rol
    for (const role of roles) {
      console.log(`\n🔧 Configurando permisos para rol: ${role.name}`);
      
      for (const module of allowedModules) {
        const permissions = {
          can_read: true,
          can_create: module.name === 'project_management',
          can_update: module.name === 'project_management' || module.name === 'mi_perfil',
          can_delete: false,
          can_export: false,
          can_approve: false
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
          console.log(`   ✅ Actualizado: ${module.name}`);
        } else {
          // Crear nuevo permiso
          result = await prisma.permissions.create({
            data: {
              role_id: role.id,
              module_id: module.id,
              ...permissions
            }
          });
          console.log(`   ➕ Creado: ${module.name}`);
        }
        
        results.push({
          role: role.name,
          module: module.name,
          permissions: permissions,
          action: existingPermission ? 'updated' : 'created'
        });
      }
    }
    
    await prisma.$disconnect();
    
    console.log('\n🎉 ¡Permisos configurados exitosamente!');
    
    res.json({
      success: true,
      message: 'Permisos configurados exitosamente para DESARROLLADOR y OPERADOR',
      data: {
        roles: roles.map(r => r.name),
        allowedModules: allowedModules.map(m => m.name),
        totalPermissions: results.length,
        results: results
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

module.exports = {
  testDatabaseConnection,
  configureDevOperatorPermissionsSimple
};
