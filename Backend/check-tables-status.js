const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function checkTablesStatus() {
  try {
    console.log('🔍 Verificando estado de las tablas del sistema de roles...\n');

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
      const rolePermissions = await prisma.role_permissions.findMany();
      console.log(`✅ Tabla role_permissions: ${rolePermissions.length} registros`);
    } catch (error) {
      console.log(`❌ Tabla role_permissions: ${error.message}`);
    }

    // Verificar tabla system_modules
    try {
      const systemModules = await prisma.system_modules.findMany();
      console.log(`✅ Tabla system_modules: ${systemModules.length} registros`);
    } catch (error) {
      console.log(`❌ Tabla system_modules: ${error.message}`);
    }

    // Verificar tabla users
    try {
      const users = await prisma.user.findMany({
        select: { id: true, name: true, email: true, role: true }
      });
      console.log(`✅ Tabla users: ${users.length} registros`);
      users.slice(0, 5).forEach(user => {
        console.log(`   - ${user.name || 'Sin nombre'} (${user.email}) - Rol: ${user.role || 'Sin rol'}`);
      });
      if (users.length > 5) {
        console.log(`   ... y ${users.length - 5} usuarios más`);
      }
    } catch (error) {
      console.log(`❌ Tabla users: ${error.message}`);
    }

    // Verificar estructura de tabla roles
    try {
      const roleStructure = await prisma.$queryRaw`
        DESCRIBE roles
      `;
      console.log('\n📋 Estructura de la tabla roles:');
      roleStructure.forEach(field => {
        console.log(`   - ${field.Field}: ${field.Type} ${field.Null === 'YES' ? 'NULL' : 'NOT NULL'}`);
      });
    } catch (error) {
      console.log(`❌ No se pudo verificar estructura de roles: ${error.message}`);
    }

    console.log('\n🎯 Resumen del estado:');
    console.log('   - Si todas las tablas muestran ✅, el sistema está completo');
    console.log('   - Si alguna tabla muestra ❌, necesita ser creada');
    console.log('   - Si la tabla roles no tiene campos como description, level, etc., necesita ser migrada');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkTablesStatus();
