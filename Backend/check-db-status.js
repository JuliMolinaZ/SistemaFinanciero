const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkDatabaseStatus() {
  try {
    console.log('🔍 Verificando estado de la base de datos...\n');
    
    // Verificar roles
    console.log('📋 ROLES:');
    const roles = await prisma.roles.findMany();
    console.log(`Total de roles: ${roles.length}`);
    roles.forEach(role => {
      console.log(` - ${role.name} (ID: ${role.id}, Nivel: ${role.level}, Activo: ${role.is_active})`);
    });
    
    console.log('\n🔐 PERMISOS:');
    const permissions = await prisma.rolePermissions.findMany();
    console.log(`Total de permisos: ${permissions.length}`);
    
    // Agrupar permisos por rol
    const permissionsByRole = {};
    permissions.forEach(perm => {
      if (!permissionsByRole[perm.role_id]) {
        permissionsByRole[perm.role_id] = [];
      }
      permissionsByRole[perm.role_id].push(perm);
    });
    
    Object.entries(permissionsByRole).forEach(([roleId, perms]) => {
      const role = roles.find(r => r.id === parseInt(roleId));
      console.log(`\n Rol: ${role ? role.name : `ID ${roleId}`}`);
      perms.forEach(perm => {
        console.log(`   - ${perm.module}: ${perm.can_read ? '✅' : '❌'}read ${perm.can_create ? '✅' : '❌'}create ${perm.can_update ? '✅' : '❌'}update ${perm.can_delete ? '✅' : '❌'}delete ${perm.can_export ? '✅' : '❌'}export ${perm.can_approve ? '✅' : '❌'}approve`);
      });
    });
    
    console.log('\n📦 MÓDULOS DEL SISTEMA:');
    const modules = await prisma.systemModules.findMany();
    console.log(`Total de módulos: ${modules.length}`);
    modules.forEach(module => {
      console.log(` - ${module.name} (${module.display_name}) - Ruta: ${module.route}`);
    });
    
    console.log('\n👥 USUARIOS:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        role_id: true,
        roles: {
          select: {
            name: true,
            level: true
          }
        }
      }
    });
    console.log(`Total de usuarios: ${users.length}`);
    users.forEach(user => {
      console.log(` - ${user.name || 'Sin nombre'} (${user.email}) - Rol: ${user.role || 'Sin rol'} - Role ID: ${user.role_id || 'N/A'} - Roles relacionado: ${user.roles?.name || 'N/A'}`);
    });
    
  } catch (error) {
    console.error('❌ Error al verificar base de datos:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabaseStatus();
