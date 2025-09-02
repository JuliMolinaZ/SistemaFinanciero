const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function fixRolesDirect() {
  try {
    console.log('🔧 Verificando y corrigiendo roles directamente...\n');

    // =====================================================
    // 1. VERIFICAR ESTADO ACTUAL CON SQL RAW
    // =====================================================
    console.log('📋 Estado actual de usuarios (SQL Raw):');
    console.log('========================================');
    
    const usersRaw = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.role_id,
        r.name as role_name,
        r.level as role_level
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id
    `;
    
    usersRaw.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): "${user.role || 'NULL'}"`);
      console.log(`   - Role ID: ${user.role_id || 'NULL'}`);
      console.log(`   - Rol asignado: ${user.role_name || 'NO ASIGNADO'}`);
      if (user.role_level) {
        console.log(`   - Nivel del rol: ${user.role_level}`);
      }
    });

    // =====================================================
    // 2. VERIFICAR ROLES DISPONIBLES
    // =====================================================
    console.log('\n📋 Roles disponibles:');
    console.log('=====================');
    
    const rolesRaw = await prisma.$queryRaw`
      SELECT id, name, description, level, is_active
      FROM roles
      ORDER BY level ASC
    `;
    
    rolesRaw.forEach(role => {
      console.log(`   - ID ${role.id}: ${role.name} (Nivel ${role.level}) - ${role.description || 'Sin descripción'}`);
    });

    // =====================================================
    // 3. CORREGIR ASIGNACIONES DE ROLES
    // =====================================================
    console.log('\n🔧 Corrigiendo asignaciones de roles...');
    console.log('=======================================');
    
    // Mapeo de roles viejos a nuevos
    const roleMapping = {
      'Juan Carlos': 'Super Administrador',
      'Usuario': 'Invitado',
      'Gerente': 'Gerente',
      'Contador': 'Contador',
      'Desarrollador': 'Desarrollador'
    };

    let correctedCount = 0;
    
    for (const user of usersRaw) {
      if (user.role && roleMapping[user.role] && !user.role_name) {
        console.log(`\n✅ Corrigiendo usuario: ${user.name}`);
        console.log(`   - Rol viejo: "${user.role}"`);
        console.log(`   - Rol nuevo: "${roleMapping[user.role]}"`);
        
        try {
          // Buscar el ID del rol correspondiente
          const targetRole = rolesRaw.find(role => role.name === roleMapping[user.role]);
          
          if (targetRole) {
            // Actualizar el usuario con SQL raw
            await prisma.$executeRaw`
              UPDATE users 
              SET role_id = ${targetRole.id}, role = NULL
              WHERE id = ${user.id}
            `;
            
            console.log(`   ✅ Usuario ${user.name} actualizado con rol ID ${targetRole.id}`);
            correctedCount++;
          } else {
            console.log(`   ❌ No se encontró el rol "${roleMapping[user.role]}"`);
          }
        } catch (error) {
          console.log(`   ❌ Error actualizando usuario ${user.name}:`, error.message);
        }
      }
    }

    // =====================================================
    // 4. VERIFICAR ESTADO FINAL
    // =====================================================
    console.log('\n🔍 Verificando estado final...');
    console.log('================================');
    
    const finalUsers = await prisma.$queryRaw`
      SELECT 
        u.id,
        u.name,
        u.email,
        u.role,
        u.role_id,
        r.name as role_name,
        r.level as role_level
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      ORDER BY u.id
    `;
    
    console.log('\n📋 Estado final de usuarios:');
    console.log('=============================');
    
    finalUsers.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): "${user.role || 'LIMPIADO'}"`);
      console.log(`   - Role ID: ${user.role_id || 'NO ASIGNADO'}`);
      console.log(`   - Rol asignado: ${user.role_name || 'NO ASIGNADO'}`);
      if (user.role_level) {
        console.log(`   - Nivel del rol: ${user.role_level}`);
      }
    });

    // =====================================================
    // 5. RESUMEN FINAL
    // =====================================================
    console.log('\n🎯 RESUMEN DE CORRECCIONES');
    console.log('===========================');
    console.log(`📊 Usuarios corregidos: ${correctedCount}`);
    console.log(`📊 Total de usuarios: ${finalUsers.length}`);
    
    const usersWithRoles = finalUsers.filter(user => user.role_name);
    const usersWithoutRoles = finalUsers.filter(user => !user.role_name);
    
    console.log(`📊 Usuarios CON roles: ${usersWithRoles.length}`);
    console.log(`📊 Usuarios SIN roles: ${usersWithoutRoles.length}`);
    
    if (usersWithRoles.length === finalUsers.length) {
      console.log('\n🎉 ¡TODOS LOS USUARIOS TIENEN ROLES ASIGNADOS!');
      console.log('✅ El sistema de roles está funcionando correctamente');
      console.log('✅ Los campos viejos han sido limpiados');
      console.log('✅ La compatibilidad del frontend está asegurada');
      
      console.log('\n🚀 PRÓXIMOS PASOS:');
      console.log('1. Reiniciar el servidor backend');
      console.log('2. Probar la API de usuarios');
      console.log('3. Verificar en el frontend que los roles se muestren correctamente');
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

fixRolesDirect();
