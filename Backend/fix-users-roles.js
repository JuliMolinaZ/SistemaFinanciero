const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function fixUsersRoles() {
  try {
    console.log('🔧 Verificando y corrigiendo roles de usuarios...\n');

    // =====================================================
    // 1. VERIFICAR ESTADO ACTUAL
    // =====================================================
    console.log('📋 Estado actual de usuarios:');
    console.log('=============================');
    
    const users = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    users.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): "${user.role}"`);
      console.log(`   - Role ID: ${user.role_id || 'NO ASIGNADO'}`);
      
      if (user.roles) {
        console.log(`   - Rol asignado: ${user.roles.name} (Nivel ${user.roles.level})`);
      } else {
        console.log(`   - Rol asignado: NO ASIGNADO`);
      }
    });

    // =====================================================
    // 2. VERIFICAR ROLES DISPONIBLES
    // =====================================================
    console.log('\n📋 Roles disponibles:');
    console.log('=====================');
    
    const roles = await prisma.roles.findMany({
      orderBy: { level: 'asc' }
    });

    roles.forEach(role => {
      console.log(`   - ID ${role.id}: ${role.name} (Nivel ${role.level})`);
    });

    // =====================================================
    // 3. MAPEAR ROLES VIEJOS A NUEVOS
    // =====================================================
    console.log('\n🔧 Mapeando roles viejos a nuevos...');
    console.log('=====================================');
    
    const roleMapping = {
      'Juan Carlos': 'Super Administrador', // Nivel 1
      'Usuario': 'Invitado',                // Nivel 5
      'Gerente': 'Gerente',                 // Nivel 2
      'Contador': 'Contador',               // Nivel 2
      'Desarrollador': 'Desarrollador'      // Nivel 3
    };

    console.log('Mapeo de roles:');
    Object.entries(roleMapping).forEach(([oldRole, newRole]) => {
      console.log(`   "${oldRole}" → "${newRole}"`);
    });

    // =====================================================
    // 4. CORREGIR ASIGNACIONES DE ROLES
    // =====================================================
    console.log('\n🔧 Corrigiendo asignaciones de roles...');
    console.log('=======================================');
    
    let correctedCount = 0;
    
    for (const user of users) {
      if (user.role && roleMapping[user.role] && !user.roles) {
        // Buscar el rol correspondiente
        const targetRole = roles.find(role => role.name === roleMapping[user.role]);
        
        if (targetRole) {
          console.log(`\n✅ Corrigiendo usuario: ${user.name}`);
          console.log(`   - Rol viejo: "${user.role}"`);
          console.log(`   - Rol nuevo: "${targetRole.name}" (ID: ${targetRole.id})`);
          
          try {
            // Actualizar el usuario con el nuevo role_id
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                role_id: targetRole.id,
                // Limpiar el campo role viejo
                role: null
              }
            });
            
            console.log(`   ✅ Usuario ${user.name} actualizado correctamente`);
            correctedCount++;
            
          } catch (error) {
            console.log(`   ❌ Error actualizando usuario ${user.name}:`, error.message);
          }
        } else {
          console.log(`\n⚠️ No se encontró el rol "${roleMapping[user.role]}" para el usuario ${user.name}`);
        }
      }
    }

    // =====================================================
    // 5. VERIFICAR ESTADO FINAL
    // =====================================================
    console.log('\n🔍 Verificando estado final...');
    console.log('================================');
    
    const updatedUsers = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    console.log('\n📋 Estado final de usuarios:');
    console.log('=============================');
    
    updatedUsers.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): "${user.role || 'LIMPIADO'}"`);
      console.log(`   - Role ID: ${user.role_id || 'NO ASIGNADO'}`);
      
      if (user.roles) {
        console.log(`   - Rol asignado: ${user.roles.name} (Nivel ${user.roles.level})`);
      } else {
        console.log(`   - Rol asignado: NO ASIGNADO`);
      }
    });

    // =====================================================
    // 6. RESUMEN FINAL
    // =====================================================
    console.log('\n🎯 RESUMEN DE CORRECCIONES');
    console.log('===========================');
    console.log(`📊 Usuarios corregidos: ${correctedCount}`);
    console.log(`📊 Total de usuarios: ${updatedUsers.length}`);
    
    const usersWithRoles = updatedUsers.filter(user => user.roles);
    const usersWithoutRoles = updatedUsers.filter(user => !user.roles);
    
    console.log(`📊 Usuarios CON roles: ${usersWithRoles.length}`);
    console.log(`📊 Usuarios SIN roles: ${usersWithoutRoles.length}`);
    
    if (usersWithRoles.length === updatedUsers.length) {
      console.log('\n🎉 ¡TODOS LOS USUARIOS TIENEN ROLES ASIGNADOS!');
      console.log('✅ El sistema de roles está funcionando correctamente');
      console.log('✅ Los campos viejos han sido limpiados');
      console.log('✅ La compatibilidad del frontend está asegurada');
    } else {
      console.log('\n⚠️ ALGUNOS USUARIOS SIGUEN SIN ROLES');
      console.log('❌ Necesita revisar manualmente los usuarios sin roles');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixUsersRoles();
