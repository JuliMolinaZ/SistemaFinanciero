const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function testSimpleRoles() {
  try {
    console.log('🧪 Probando sistema de roles de manera simple...\n');

    // =====================================================
    // 1. PROBAR CONSULTA DE ROLES
    // =====================================================
    console.log('📋 Probando consulta de roles...');
    
    try {
      const roles = await prisma.roles.findMany({
        include: {
          _count: {
            select: { users: true }
          }
        }
      });
      console.log(`✅ Roles encontrados: ${roles.length}`);
      roles.forEach(role => {
        console.log(`   - ${role.name} (Nivel ${role.level || 'N/A'}) - ${role._count.users} usuarios`);
      });
    } catch (error) {
      console.log(`❌ Error consultando roles: ${error.message}`);
      return;
    }

    // =====================================================
    // 2. PROBAR CONSULTA DE USUARIOS
    // =====================================================
    console.log('\n📋 Probando consulta de usuarios...');
    
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          role_id: true
        }
      });
      console.log(`✅ Usuarios encontrados: ${users.length}`);
      users.forEach(user => {
        console.log(`   - ${user.name || 'Sin nombre'} (${user.email}) - Rol: ${user.role || 'Sin rol'} - Role ID: ${user.role_id || 'N/A'}`);
      });
    } catch (error) {
      console.log(`❌ Error consultando usuarios: ${error.message}`);
      return;
    }

    // =====================================================
    // 3. PROBAR CONSULTA DE MÓDULOS
    // =====================================================
    console.log('\n📋 Probando consulta de módulos...');
    
    try {
      const modules = await prisma.systemModules.findMany({
        select: {
          id: true,
          name: true,
          display_name: true
        }
      });
      console.log(`✅ Módulos encontrados: ${modules.length}`);
      modules.slice(0, 5).forEach(module => {
        console.log(`   - ${module.name}: ${module.display_name}`);
      });
      if (modules.length > 5) {
        console.log(`   ... y ${modules.length - 5} módulos más`);
      }
    } catch (error) {
      console.log(`❌ Error consultando módulos: ${error.message}`);
      return;
    }

    // =====================================================
    // 4. PROBAR CONSULTA DE PERMISOS
    // =====================================================
    console.log('\n📋 Probando consulta de permisos...');
    
    try {
      const permissions = await prisma.rolePermissions.findMany({
        select: {
          id: true,
          role_id: true,
          module: true,
          can_read: true,
          can_create: true
        },
        take: 10
      });
      console.log(`✅ Permisos encontrados: ${permissions.length} (mostrando primeros 10)`);
      permissions.forEach(perm => {
        console.log(`   - Rol ID ${perm.role_id} en módulo ${perm.module}: R:${perm.can_read ? '✅' : '❌'} C:${perm.can_create ? '✅' : '❌'}`);
      });
    } catch (error) {
      console.log(`❌ Error consultando permisos: ${error.message}`);
      return;
    }

    // =====================================================
    // 5. RESUMEN FINAL
    // =====================================================
    console.log('\n🎯 RESUMEN DE PRUEBAS');
    console.log('=====================');
    
    try {
      const stats = await prisma.$queryRaw`
        SELECT 
          (SELECT COUNT(*) FROM roles) as total_roles,
          (SELECT COUNT(*) FROM system_modules) as total_modules,
          (SELECT COUNT(*) FROM role_permissions) as total_permissions,
          (SELECT COUNT(*) FROM users) as total_users
      `;
      
      const statsData = stats[0];
      
      console.log('📊 Estadísticas del sistema:');
      console.log(`   - Roles: ${statsData.total_roles}`);
      console.log(`   - Módulos: ${statsData.total_modules}`);
      console.log(`   - Permisos: ${statsData.total_permissions}`);
      console.log(`   - Usuarios: ${statsData.total_users}`);
      
      console.log('\n🎉 ¡SISTEMA DE ROLES FUNCIONANDO CORRECTAMENTE!');
      console.log('✅ Todas las consultas básicas funcionan');
      console.log('✅ El esquema de Prisma está correcto');
      console.log('✅ Las tablas están accesibles');
      
    } catch (error) {
      console.log(`❌ Error en resumen final: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testSimpleRoles();
