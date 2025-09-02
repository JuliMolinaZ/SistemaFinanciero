const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkMigrationStatus() {
  try {
    console.log('🔍 Verificando estado de la migración del sistema de roles...\n');
    
    // Verificar tabla roles
    try {
      const roles = await prisma.roles.findMany();
      console.log(`✅ Tabla roles: ${roles.length} registros`);
      roles.forEach(role => {
        console.log(`   - ${role.name} (ID: ${role.id})`);
      });
    } catch (error) {
      console.log(`❌ Tabla roles: ${error.message}`);
    }
    
    // Verificar tabla role_permissions
    try {
      const permissions = await prisma.role_permissions.findMany();
      console.log(`✅ Tabla role_permissions: ${permissions.length} registros`);
    } catch (error) {
      console.log(`❌ Tabla role_permissions: ${error.message}`);
    }
    
    // Verificar tabla system_modules
    try {
      const modules = await prisma.system_modules.findMany();
      console.log(`✅ Tabla system_modules: ${modules.length} registros`);
    } catch (error) {
      console.log(`❌ Tabla system_modules: ${error.message}`);
    }
    
    // Verificar tabla users
    try {
      const users = await prisma.users.findMany({
        include: {
          roles: true
        }
      });
      console.log(`✅ Tabla users: ${users.length} registros`);
      
      users.forEach(user => {
        const roleName = user.roles ? user.roles.name : 'Sin rol';
        console.log(`   - ${user.name} (${user.email}) -> Rol: ${roleName}`);
      });
    } catch (error) {
      console.log(`❌ Tabla users: ${error.message}`);
    }
    
    // Verificar estructura de la tabla roles
    try {
      const roleSample = await prisma.roles.findFirst();
      if (roleSample) {
        console.log('\n📋 Estructura de la tabla roles:');
        console.log(`   - id: ${roleSample.id}`);
        console.log(`   - name: ${roleSample.name}`);
        console.log(`   - description: ${roleSample.description || 'NO EXISTE'}`);
        console.log(`   - level: ${roleSample.level || 'NO EXISTE'}`);
        console.log(`   - is_active: ${roleSample.is_active || 'NO EXISTE'}`);
        console.log(`   - created_at: ${roleSample.created_at || 'NO EXISTE'}`);
        console.log(`   - updated_at: ${roleSample.updated_at || 'NO EXISTE'}`);
      }
    } catch (error) {
      console.log(`❌ Error verificando estructura de roles: ${error.message}`);
    }
    
  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkMigrationStatus();
