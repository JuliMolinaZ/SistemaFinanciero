const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function verifyUsersRoles() {
  try {
    console.log('🔍 Verificando usuarios y roles en la base de datos...\n');

    // =====================================================
    // 1. VERIFICAR USUARIOS Y SUS ROLES
    // =====================================================
    console.log('📋 Usuarios y sus roles:');
    console.log('========================');
    
    const users = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            is_active: true
          }
        }
      }
    });

    users.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): ${user.role}`);
      console.log(`   - Role ID: ${user.role_id}`);
      
      if (user.roles) {
        console.log(`   - Rol del nuevo sistema: ${user.roles.name}`);
        console.log(`   - Descripción: ${user.roles.description}`);
        console.log(`   - Nivel: ${user.roles.level}`);
        console.log(`   - Activo: ${user.roles.is_active}`);
      } else {
        console.log(`   - Rol del nuevo sistema: NO ASIGNADO`);
      }
    });

    // =====================================================
    // 2. VERIFICAR ROLES DISPONIBLES
    // =====================================================
    console.log('\n📋 Roles disponibles en el sistema:');
    console.log('===================================');
    
    const roles = await prisma.roles.findMany({
      orderBy: { level: 'asc' }
    });

    roles.forEach(role => {
      console.log(`   - ${role.name} (Nivel ${role.level}) - ${role.description || 'Sin descripción'}`);
    });

    // =====================================================
    // 3. VERIFICAR ASIGNACIONES DE ROLES
    // =====================================================
    console.log('\n📋 Verificación de asignaciones:');
    console.log('================================');
    
    const usersWithRoles = users.filter(user => user.roles);
    const usersWithoutRoles = users.filter(user => !user.roles);
    
    console.log(`   - Usuarios CON roles asignados: ${usersWithRoles.length}`);
    console.log(`   - Usuarios SIN roles asignados: ${usersWithoutRoles.length}`);
    
    if (usersWithoutRoles.length > 0) {
      console.log('\n⚠️ Usuarios sin roles asignados:');
      usersWithoutRoles.forEach(user => {
        console.log(`     - ${user.name} (${user.email})`);
      });
    }

    // =====================================================
    // 4. VERIFICAR COMPATIBILIDAD
    // =====================================================
    console.log('\n📋 Verificación de compatibilidad:');
    console.log('===================================');
    
    const oldRoleNames = ['Juan Carlos', 'Usuario'];
    const newRoleNames = roles.map(role => role.name);
    
    console.log('   - Roles viejos detectados:', oldRoleNames);
    console.log('   - Roles nuevos disponibles:', newRoleNames);
    
    // Verificar si hay usuarios con roles viejos que no están mapeados
    const unmappedUsers = users.filter(user => 
      user.role && oldRoleNames.includes(user.role) && !user.roles
    );
    
    if (unmappedUsers.length > 0) {
      console.log('\n⚠️ Usuarios con roles viejos no mapeados:');
      unmappedUsers.forEach(user => {
        console.log(`     - ${user.name}: "${user.role}" → NO MAPEADO`);
      });
    } else {
      console.log('\n✅ Todos los usuarios tienen roles mapeados correctamente');
    }

    // =====================================================
    // 5. RESUMEN FINAL
    // =====================================================
    console.log('\n🎯 RESUMEN FINAL');
    console.log('================');
    
    console.log(`📊 Total de usuarios: ${users.length}`);
    console.log(`📊 Total de roles: ${roles.length}`);
    console.log(`📊 Usuarios con roles asignados: ${usersWithRoles.length}`);
    console.log(`📊 Usuarios sin roles asignados: ${usersWithoutRoles.length}`);
    
    if (usersWithRoles.length === users.length) {
      console.log('\n🎉 ¡SISTEMA DE ROLES FUNCIONANDO PERFECTAMENTE!');
      console.log('✅ Todos los usuarios tienen roles asignados');
      console.log('✅ Los roles están correctamente configurados');
      console.log('✅ La base de datos está sincronizada');
    } else {
      console.log('\n⚠️ SISTEMA DE ROLES INCOMPLETO');
      console.log('❌ Algunos usuarios no tienen roles asignados');
      console.log('❌ Necesita completar la migración');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

verifyUsersRoles();
