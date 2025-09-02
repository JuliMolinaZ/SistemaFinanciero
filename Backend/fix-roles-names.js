const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function fixRolesNames() {
  try {
    console.log('🔧 Corrigiendo nombres de roles del sistema...\n');
    
    // PASO 1: Actualizar el rol "Juan Carlos" a "Gerente"
    console.log('📝 PASO 1: Cambiando "Juan Carlos" a "Gerente"...');
    
    try {
      await prisma.$executeRawUnsafe(`
        UPDATE roles SET 
          name = 'Gerente',
          description = 'Gerente del sistema con permisos administrativos',
          level = 2,
          is_active = TRUE
        WHERE name = 'Juan Carlos'
      `);
      console.log('✅ Rol "Juan Carlos" cambiado a "Gerente"');
    } catch (error) {
      console.log(`⚠️  Error cambiando rol: ${error.message}`);
    }
    
    // PASO 2: Verificar que todos los roles tengan los nombres correctos
    console.log('\n📝 PASO 2: Verificando nombres de roles...');
    
    const roleUpdates = [
      { 
        currentName: 'Administrador', 
        newName: 'Super Administrador', 
        description: 'Super Administrador del sistema con todos los permisos',
        level: 1 
      },
      { 
        currentName: 'Gerente', 
        newName: 'Gerente', 
        description: 'Gerente del sistema con permisos administrativos',
        level: 2 
      },
      { 
        currentName: 'Desarrollador', 
        newName: 'Desarrollador', 
        description: 'Desarrollador del sistema con permisos técnicos',
        level: 3 
      },
      { 
        currentName: 'Contador', 
        newName: 'Contador', 
        description: 'Contador del sistema con permisos de lectura y reportes',
        level: 4 
      },
      { 
        currentName: 'Operador', 
        newName: 'Invitado', 
        description: 'Usuario invitado con permisos básicos de lectura',
        level: 5 
      }
    ];
    
    for (const roleUpdate of roleUpdates) {
      try {
        await prisma.$executeRawUnsafe(`
          UPDATE roles SET 
            name = '${roleUpdate.newName}',
            description = '${roleUpdate.description}',
            level = ${roleUpdate.level},
            is_active = TRUE
          WHERE name = '${roleUpdate.currentName}'
        `);
        console.log(`✅ Rol "${roleUpdate.currentName}" actualizado a "${roleUpdate.newName}"`);
      } catch (error) {
        console.log(`⚠️  Error actualizando rol ${roleUpdate.currentName}: ${error.message}`);
      }
    }
    
    // PASO 3: Asignar roles correctos a usuarios
    console.log('\n📝 PASO 3: Asignando roles correctos a usuarios...');
    
    try {
      // Obtener usuarios y roles actualizados
      const users = await prisma.$queryRaw`SELECT id, name, email FROM users`;
      const roles = await prisma.$queryRaw`SELECT id, name, level FROM roles`;
      
      console.log(`👥 Usuarios encontrados: ${users.length}`);
      console.log(`🎭 Roles disponibles: ${roles.length}`);
      
      for (const user of users) {
        let roleId = null;
        
        if (user.email === 'j.molina@runsolutions-services.com') {
          // Julian Molina = Super Administrador (Nivel 1)
          const superAdminRole = roles.find(r => r.name === 'Super Administrador');
          roleId = superAdminRole ? superAdminRole.id : null;
          console.log(`👑 Asignando rol Super Administrador a ${user.name}`);
        } else if (user.email === 'jc.yanez@runsolutions-services.com') {
          // Juan Carlos = Gerente (Nivel 2)
          const gerenteRole = roles.find(r => r.name === 'Gerente');
          roleId = gerenteRole ? gerenteRole.id : null;
          console.log(`👔 Asignando rol Gerente a ${user.name}`);
        } else if (user.email === 'j.oviedo@runsolutions-services.com') {
          // Jessica = Gerente (Nivel 2) - Cambiado de Administradora a Gerente
          const gerenteRole = roles.find(r => r.name === 'Gerente');
          roleId = gerenteRole ? gerenteRole.id : null;
          console.log(`👩‍💼 Asignando rol Gerente a ${user.name}`);
        } else {
          // Usuario de prueba = Invitado (Nivel 5)
          const invitadoRole = roles.find(r => r.name === 'Invitado');
          roleId = invitadoRole ? invitadoRole.id : null;
          console.log(`👤 Asignando rol Invitado a ${user.name}`);
        }
        
        if (roleId) {
          await prisma.$executeRawUnsafe(`
            UPDATE users SET role_id = ${roleId}, is_active = TRUE WHERE id = ${user.id}
          `);
          console.log(`✅ Rol asignado a ${user.name}`);
        }
      }
    } catch (error) {
      console.log(`⚠️  Error asignando roles: ${error.message}`);
    }
    
    // PASO 4: Verificación final
    console.log('\n🔍 Verificación final de roles...');
    
    try {
      const roles = await prisma.$queryRaw`SELECT * FROM roles ORDER BY level ASC`;
      console.log(`✅ Tabla roles: ${roles.length} registros`);
      roles.forEach(role => {
        console.log(`   - ${role.name} (Nivel ${role.level}): ${role.description}`);
      });
      
      const users = await prisma.$queryRaw`
        SELECT u.name, u.email, r.name as role_name, r.level 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY r.level ASC
      `;
      console.log(`\n✅ Tabla users: ${users.length} registros`);
      users.forEach(user => {
        const roleName = user.role_name || 'Sin rol';
        console.log(`   - ${user.name} (${user.email}) -> Rol: ${roleName} (Nivel ${user.level || 'N/A'})`);
      });
      
      console.log('\n🎯 RESUMEN FINAL DE ROLES ASIGNADOS:');
      console.log('👑 Julian Molina -> Super Administrador (Nivel 1)');
      console.log('👔 Juan Carlos -> Gerente (Nivel 2)');
      console.log('👩‍💼 Jessica -> Gerente (Nivel 2)');
      console.log('👤 Usuario de Prueba -> Invitado (Nivel 5)');
      
    } catch (error) {
      console.log(`⚠️  Error en verificación final: ${error.message}`);
    }
    
    console.log('\n🎉 Corrección de nombres de roles completada exitosamente');
    
  } catch (error) {
    console.error('❌ Error durante la corrección:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixRolesNames();
