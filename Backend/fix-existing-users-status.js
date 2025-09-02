const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function fixExistingUsersStatus() {
  try {
    console.log('🔍 Verificando estado de usuarios existentes...\n');

    // Obtener todos los usuarios activos
    const allUsers = await prisma.user.findMany({
      where: { is_active: true },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      },
      orderBy: { created_at: 'asc' }
    });

    console.log(`📊 Total de usuarios activos: ${allUsers.length}\n`);

    // Analizar cada usuario
    for (const user of allUsers) {
      console.log(`👤 Usuario: ${user.email}`);
      console.log(`   Nombre: ${user.name || 'No definido'}`);
      console.log(`   Rol: ${user.roles?.name || 'Sin rol asignado'}`);
      console.log(`   Nivel: ${user.roles?.level || 'N/A'}`);
      console.log(`   Primer login: ${user.is_first_login ? 'Sí' : 'No'}`);
      console.log(`   Perfil completo: ${user.profile_complete ? 'Sí' : 'No'}`);
      console.log(`   Teléfono: ${user.phone || 'No definido'}`);
      console.log(`   Departamento: ${user.department || 'No definido'}`);
      console.log(`   Posición: ${user.position || 'No definido'}`);

      // Determinar si realmente necesita completar perfil
      const needsProfileCompletion = !user.name || !user.phone || !user.department || !user.position;
      
      if (needsProfileCompletion) {
        console.log(`   ⚠️  Necesita completar perfil: SÍ`);
      } else {
        console.log(`   ✅ Perfil completo: SÍ`);
      }

      console.log('   ---');

      // Corregir estado si es necesario
      if (user.roles && !needsProfileCompletion) {
        // Usuario con rol y perfil completo, marcar como no primer login
        if (user.is_first_login) {
          try {
            await prisma.user.update({
              where: { id: user.id },
              data: { 
                is_first_login: false,
                profile_complete: true,
                updated_at: new Date()
              }
            });
            console.log(`   🔧 Corregido: is_first_login = false, profile_complete = true`);
          } catch (updateError) {
            console.error(`   ❌ Error al corregir usuario ${user.email}:`, updateError.message);
          }
        }
      }
    }

    // Verificar usuarios que aparecerían como "pendientes"
    console.log('\n🔍 Verificando usuarios que aparecerían como "pendientes"...\n');

    const pendingUsers = await prisma.user.findMany({
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
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      }
    });

    console.log(`📋 Usuarios que aparecerían como "pendientes": ${pendingUsers.length}\n`);

    if (pendingUsers.length > 0) {
      console.log('📝 Lista de usuarios pendientes:');
      pendingUsers.forEach(user => {
        console.log(`   • ${user.email} - Rol: ${user.roles?.name || 'Sin rol'} - Nombre: ${user.name || 'No definido'}`);
      });
    } else {
      console.log('✅ No hay usuarios pendientes de completar perfil');
    }

    // Resumen final
    console.log('\n📊 RESUMEN FINAL:');
    console.log(`   • Total usuarios activos: ${allUsers.length}`);
    console.log(`   • Usuarios con roles asignados: ${allUsers.filter(u => u.roles).length}`);
    console.log(`   • Usuarios con perfil completo: ${allUsers.filter(u => u.name && u.phone && u.department && u.position).length}`);
    console.log(`   • Usuarios pendientes de perfil: ${pendingUsers.length}`);

    console.log('\n🎉 Verificación completada exitosamente!');

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Ejecutar la función
fixExistingUsersStatus();
