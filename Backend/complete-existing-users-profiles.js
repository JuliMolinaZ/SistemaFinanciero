const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function completeExistingUsersProfiles() {
  try {
    console.log('🔧 Completando perfiles de usuarios existentes...\n');

    // Datos para completar perfiles
    const profileData = {
      'j.oviedo@runsolutions-services.com': {
        phone: '+56 9 1234 5678',
        department: 'Dirección General',
        position: 'CEO / Directora General',
        hire_date: '2025-01-13'
      },
      'jc.yanez@runsolutions-services.com': {
        phone: '+56 9 2345 6789',
        department: 'Dirección General',
        position: 'Director Ejecutivo',
        hire_date: '2025-01-21'
      },
      'j.molina@runsolutions-services.com': {
        phone: '+56 9 3456 7890',
        department: 'Dirección General',
        position: 'Super Administrador del Sistema',
        hire_date: '2025-03-05'
      },
      'test@example.com': {
        phone: '+56 9 4567 8901',
        department: 'Sistema',
        position: 'Usuario de Prueba',
        hire_date: '2025-07-29'
      }
    };

    console.log('📋 Datos de perfil a asignar:\n');
    Object.entries(profileData).forEach(([email, data]) => {
      console.log(`   📧 ${email}:`);
      console.log(`      📱 Teléfono: ${data.phone}`);
      console.log(`      🏢 Departamento: ${data.department}`);
      console.log(`      👔 Posición: ${data.position}`);
      console.log(`      📅 Fecha contratación: ${data.hire_date}`);
      console.log('');
    });

    // Completar perfiles uno por uno
    for (const [email, data] of Object.entries(profileData)) {
      try {
        console.log(`🔧 Completando perfil de: ${email}`);
        
        const updatedUser = await prisma.user.update({
          where: { email: email },
          data: {
            phone: data.phone,
            department: data.department,
            position: data.position,
            hire_date: new Date(data.hire_date),
            is_first_login: false,
            profile_complete: true,
            updated_at: new Date()
          }
        });

        console.log(`   ✅ Perfil completado exitosamente`);
        console.log(`   📱 Teléfono: ${updatedUser.phone}`);
        console.log(`   🏢 Departamento: ${updatedUser.department}`);
        console.log(`   👔 Posición: ${updatedUser.position}`);
        console.log(`   📅 Fecha contratación: ${updatedUser.hire_date}`);
        console.log(`   🔓 Primer login: ${updatedUser.is_first_login ? 'Sí' : 'No'}`);
        console.log(`   ✅ Perfil completo: ${updatedUser.profile_complete ? 'Sí' : 'No'}`);
        console.log('   ---');

      } catch (updateError) {
        console.error(`   ❌ Error al completar perfil de ${email}:`, updateError.message);
      }
    }

    // Verificar estado final
    console.log('\n🔍 Verificando estado final de usuarios...\n');

    const allUsers = await prisma.user.findMany({
      where: { is_active: true },
      select: {
        email: true,
        name: true,
        phone: true,
        department: true,
        position: true,
        hire_date: true,
        is_first_login: true,
        profile_complete: true,
        roles: {
          select: {
            name: true
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });

    console.log('📊 Estado final de usuarios:\n');
    allUsers.forEach(user => {
      console.log(`👤 ${user.email}`);
      console.log(`   Nombre: ${user.name || 'No definido'}`);
      console.log(`   Rol: ${user.roles?.name || 'Sin rol'}`);
      console.log(`   📱 Teléfono: ${user.phone || 'No definido'}`);
      console.log(`   🏢 Departamento: ${user.department || 'No definido'}`);
      console.log(`   👔 Posición: ${user.position || 'No definido'}`);
      console.log(`   📅 Fecha contratación: ${user.hire_date || 'No definida'}`);
      console.log(`   🔓 Primer login: ${user.is_first_login ? 'Sí' : 'No'}`);
      console.log(`   ✅ Perfil completo: ${user.profile_complete ? 'Sí' : 'No'}`);
      
      if (user.phone && user.department && user.position && user.hire_date) {
        console.log(`   🎉 PERFIL COMPLETO ✅`);
      } else {
        console.log(`   ⚠️  PERFIL INCOMPLETO ❌`);
      }
      console.log('   ---');
    });

    // Verificar usuarios que aún aparecerían como "pendientes"
    const stillPendingUsers = await prisma.user.findMany({
      where: {
        AND: [
          { is_active: true },
          {
            OR: [
              { is_first_login: true },
              { name: null },
              { name: '' },
              { phone: null },
              { phone: '' },
              { department: null },
              { department: '' },
              { position: null },
              { position: '' }
            ]
          }
        ]
      },
      select: {
        email: true,
        name: true,
        roles: {
          select: {
            name: true
          }
        }
      }
    });

    console.log(`\n📋 Usuarios que aún aparecerían como "pendientes": ${stillPendingUsers.length}`);
    
    if (stillPendingUsers.length === 0) {
      console.log('🎉 ¡Todos los usuarios tienen perfiles completos!');
    } else {
      console.log('⚠️  Usuarios que aún necesitan completar perfil:');
      stillPendingUsers.forEach(user => {
        console.log(`   • ${user.email} - Rol: ${user.roles?.name || 'Sin rol'} - Nombre: ${user.name || 'No definido'}`);
      });
    }

    console.log('\n🎉 Proceso de completar perfiles finalizado exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
completeExistingUsersProfiles();
