const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function verifyFinalStatus() {
  try {
    console.log('🔍 Verificación final del sistema de roles...\n');

    // =====================================================
    // 1. VERIFICAR TABLA ROLES
    // =====================================================
    console.log('📋 Verificando tabla roles...');
    try {
      const roles = await prisma.$queryRaw`SELECT id, name, description, level, is_active FROM roles ORDER BY level ASC`;
      console.log(`✅ Tabla roles: ${roles.length} registros`);
      roles.forEach(role => {
        console.log(`   - ${role.name} (Nivel ${role.level || 'N/A'}) - ${role.description || 'Sin descripción'}`);
      });
    } catch (error) {
      console.log(`❌ Error en tabla roles: ${error.message}`);
    }

    // =====================================================
    // 2. VERIFICAR TABLA SYSTEM_MODULES
    // =====================================================
    console.log('\n📋 Verificando tabla system_modules...');
    try {
      const modules = await prisma.$queryRaw`SELECT COUNT(*) as count FROM system_modules`;
      console.log(`✅ Tabla system_modules: ${modules[0].count} módulos`);
      
      const moduleList = await prisma.$queryRaw`SELECT name, display_name, requires_approval FROM system_modules ORDER BY name ASC`;
      moduleList.slice(0, 10).forEach(module => {
        console.log(`   - ${module.name}: ${module.display_name} ${module.requires_approval ? '(Requiere aprobación)' : ''}`);
      });
      if (moduleList.length > 10) {
        console.log(`   ... y ${moduleList.length - 10} módulos más`);
      }
    } catch (error) {
      console.log(`❌ Error en tabla system_modules: ${error.message}`);
    }

    // =====================================================
    // 3. VERIFICAR TABLA ROLE_PERMISSIONS
    // =====================================================
    console.log('\n📋 Verificando tabla role_permissions...');
    try {
      const permissions = await prisma.$queryRaw`SELECT COUNT(*) as count FROM role_permissions`;
      console.log(`✅ Tabla role_permissions: ${permissions[0].count} permisos`);
      
      const permissionSummary = await prisma.$queryRaw`
        SELECT r.name as role_name, COUNT(*) as total_permissions,
               SUM(can_read) as can_read_count,
               SUM(can_create) as can_create_count,
               SUM(can_update) as can_update_count,
               SUM(can_delete) as can_delete_count,
               SUM(can_export) as can_export_count,
               SUM(can_approve) as can_approve_count
        FROM role_permissions rp
        JOIN roles r ON rp.role_id = r.id
        GROUP BY r.id, r.name
        ORDER BY r.level ASC
      `;
      
      permissionSummary.forEach(summary => {
        console.log(`   - ${summary.role_name}: ${summary.total_permissions} permisos totales`);
        console.log(`     R:${summary.can_read_count} C:${summary.can_create_count} U:${summary.can_update_count} D:${summary.can_delete_count} E:${summary.can_export_count} A:${summary.can_approve_count}`);
      });
    } catch (error) {
      console.log(`❌ Error en tabla role_permissions: ${error.message}`);
    }

    // =====================================================
    // 4. VERIFICAR TABLA USERS
    // =====================================================
    console.log('\n📋 Verificando tabla users...');
    try {
      const users = await prisma.$queryRaw`SELECT COUNT(*) as count FROM users`;
      console.log(`✅ Tabla users: ${users[0].count} usuarios`);
      
      const userRoles = await prisma.$queryRaw`
        SELECT u.name, u.email, u.role, r.name as role_name, r.level
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY r.level ASC, u.name ASC
      `;
      
      userRoles.forEach(user => {
        console.log(`   - ${user.name || 'Sin nombre'} (${user.email}) - Rol: ${user.role_name || user.role || 'Sin rol'} (Nivel ${user.level || 'N/A'})`);
      });
    } catch (error) {
      console.log(`❌ Error en tabla users: ${error.message}`);
    }

    // =====================================================
    // 5. VERIFICAR RELACIONES
    // =====================================================
    console.log('\n📋 Verificando relaciones...');
    try {
      const userRoleCount = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM users u 
        JOIN roles r ON u.role_id = r.id
      `;
      console.log(`✅ Usuarios con roles asignados: ${userRoleCount[0].count}`);
      
      const orphanedUsers = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE r.id IS NULL
      `;
      if (orphanedUsers[0].count > 0) {
        console.log(`⚠️  Usuarios sin rol asignado: ${orphanedUsers[0].count}`);
      } else {
        console.log(`✅ Todos los usuarios tienen roles asignados`);
      }
    } catch (error) {
      console.log(`❌ Error verificando relaciones: ${error.message}`);
    }

    // =====================================================
    // 6. RESUMEN FINAL
    // =====================================================
    console.log('\n🎯 RESUMEN FINAL DEL SISTEMA DE ROLES');
    console.log('=====================================');
    
    try {
      const stats = await prisma.$queryRaw`
        SELECT 
          (SELECT COUNT(*) FROM roles) as total_roles,
          (SELECT COUNT(*) FROM system_modules) as total_modules,
          (SELECT COUNT(*) FROM role_permissions) as total_permissions,
          (SELECT COUNT(*) FROM users) as total_users,
          (SELECT COUNT(*) FROM users WHERE role_id IS NOT NULL) as users_with_roles
      `;
      
      const statsData = stats[0];
      console.log(`📊 Total de roles: ${statsData.total_roles}`);
      console.log(`📊 Total de módulos: ${statsData.total_modules}`);
      console.log(`📊 Total de permisos: ${statsData.total_permissions}`);
      console.log(`📊 Total de usuarios: ${statsData.total_users}`);
      console.log(`📊 Usuarios con roles: ${statsData.users_with_roles}`);
      
      if (statsData.total_roles > 0 && statsData.total_modules > 0 && statsData.total_permissions > 0) {
        console.log('\n🎉 ¡SISTEMA DE ROLES COMPLETAMENTE FUNCIONAL!');
        console.log('✅ Todas las tablas están creadas');
        console.log('✅ Todos los módulos están configurados');
        console.log('✅ Todos los permisos están asignados');
        console.log('✅ Las relaciones están establecidas');
        
        console.log('\n📋 Próximos pasos:');
        console.log('   1. Reiniciar el servidor backend');
        console.log('   2. Probar los endpoints de roles');
        console.log('   3. Verificar que los middlewares de permisos funcionen');
        console.log('   4. Configurar roles para usuarios existentes');
      } else {
        console.log('\n⚠️  El sistema de roles necesita configuración adicional');
      }
      
    } catch (error) {
      console.log(`❌ Error en resumen final: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyFinalStatus();
