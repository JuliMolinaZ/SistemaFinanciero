const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function quickFixRoles() {
  try {
    console.log('🔧 Corrección rápida de roles...\n');
    
    // Mapeo directo de roles viejos a nuevos
    const roleMapping = {
      'Juan Carlos': 'Super Administrador',
      'Usuario': 'Invitado'
    };
    
    console.log('📋 Mapeo de roles:');
    Object.entries(roleMapping).forEach(([oldRole, newRole]) => {
      console.log(`   "${oldRole}" → "${newRole}"`);
    });
    
    console.log('\n🔧 Aplicando correcciones...');
    
    // Corregir usuarios con rol "Juan Carlos"
    if (roleMapping['Juan Carlos']) {
      const superAdminRole = await prisma.roles.findFirst({
        where: { name: roleMapping['Juan Carlos'] }
      });
      
      if (superAdminRole) {
        const updatedUsers = await prisma.user.updateMany({
          where: { role: 'Juan Carlos' },
          data: { 
            role_id: superAdminRole.id,
            role: null
          }
        });
        console.log(`✅ ${updatedUsers.count} usuarios con rol "Juan Carlos" actualizados a "Super Administrador"`);
      }
    }
    
    // Corregir usuarios con rol "Usuario"
    if (roleMapping['Usuario']) {
      const invitadoRole = await prisma.roles.findFirst({
        where: { name: roleMapping['Usuario'] }
      });
      
      if (invitadoRole) {
        const updatedUsers = await prisma.user.updateMany({
          where: { role: 'Usuario' },
          data: { 
            role_id: invitadoRole.id,
            role: null
          }
        });
        console.log(`✅ ${updatedUsers.count} usuarios con rol "Usuario" actualizados a "Invitado"`);
      }
    }
    
    console.log('\n🔍 Verificando resultado...');
    
    const finalUsers = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            name: true,
            level: true
          }
        }
      }
    });
    
    console.log('\n📋 Estado final:');
    finalUsers.forEach((user, index) => {
      console.log(`\n👤 ${user.name}:`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role ID: ${user.role_id || 'NO ASIGNADO'}`);
      console.log(`   - Rol: ${user.roles ? user.roles.name : 'NO ASIGNADO'}`);
      if (user.roles) {
        console.log(`   - Nivel: ${user.roles.level}`);
      }
    });
    
    const usersWithRoles = finalUsers.filter(user => user.roles);
    console.log(`\n🎯 Total usuarios con roles: ${usersWithRoles.length}/${finalUsers.length}`);
    
    if (usersWithRoles.length === finalUsers.length) {
      console.log('🎉 ¡Todos los usuarios tienen roles asignados!');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

quickFixRoles();
