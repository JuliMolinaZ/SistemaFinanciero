// scripts/debug-permissions.js - Script de debug para ver nombres exactos de roles
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugRoles() {
  try {
    console.log('🔍 Debug de roles y permisos...');
    
    // 1. OBTENER TODOS LOS ROLES
    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      orderBy: { level: 'asc' }
    });

    console.log(`\n📋 ${roles.length} roles encontrados:`);
    
    for (const role of roles) {
      console.log(`  - ID: ${role.id}, Nombre: "${role.name}", Nivel: ${role.level}`);
      
      // Verificar si hay permisos para este rol
      const permissions = await prisma.rolePermissions.findMany({
        where: { role_id: role.id }
      });
      
      console.log(`    Permisos configurados: ${permissions.length}`);
    }

    // 2. VERIFICAR MÓDULOS DISPONIBLES
    const modules = await prisma.systemModules.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    console.log(`\n📦 ${modules.length} módulos disponibles:`);
    
    for (const module of modules) {
      console.log(`  - Nombre: "${module.name}", Display: "${module.display_name}"`);
    }

    // 3. VERIFICAR PERMISOS EXISTENTES
    const allPermissions = await prisma.rolePermissions.findMany({
      include: {
        roles: true
      }
    });

    console.log(`\n🔐 ${allPermissions.length} permisos totales configurados:`);
    
    for (const permission of allPermissions) {
      console.log(`  - Rol: "${permission.roles.name}", Módulo: "${permission.module}"`);
    }

  } catch (error) {
    console.error('❌ Error en debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  debugRoles()
    .then(() => {
      console.log('\n✅ Debug completado');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en debug:', error);
      process.exit(1);
    });
}

module.exports = { debugRoles };
