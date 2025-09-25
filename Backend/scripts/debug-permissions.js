// scripts/debug-permissions.js - Script de debug para ver nombres exactos de roles
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugRoles() {
  try {

    // 1. OBTENER TODOS LOS ROLES
    const roles = await prisma.roles.findMany({
      where: { is_active: true },
      orderBy: { level: 'asc' }
    });

    for (const role of roles) {

      // Verificar si hay permisos para este rol
      const permissions = await prisma.rolePermissions.findMany({
        where: { role_id: role.id }
      });

    }

    // 2. VERIFICAR MÓDULOS DISPONIBLES
    const modules = await prisma.systemModules.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    for (const module of modules) {

    }

    // 3. VERIFICAR PERMISOS EXISTENTES
    const allPermissions = await prisma.rolePermissions.findMany({
      include: {
        roles: true
      }
    });

    for (const permission of allPermissions) {

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

      process.exit(0);
    })
    .catch((error) => {
      console.error('\n❌ Error en debug:', error);
      process.exit(1);
    });
}

module.exports = { debugRoles };
