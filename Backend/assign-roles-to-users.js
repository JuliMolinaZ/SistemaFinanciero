const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function assignRolesToUsers() {
  try {
    console.log('👥 Asignando roles a usuarios existentes...\n');

    // =====================================================
    // 1. VERIFICAR USUARIOS SIN ROLE_ID
    // =====================================================
    console.log('📋 Verificando usuarios sin role_id...');
    
    const usersWithoutRoleId = await prisma.$queryRaw`
      SELECT id, name, email, role, role_id 
      FROM users 
      WHERE role_id IS NULL OR role_id = 0
    `;
    
    if (usersWithoutRoleId.length === 0) {
      console.log('✅ Todos los usuarios ya tienen role_id asignado');
      return;
    }
    
    console.log(`⚠️  Encontrados ${usersWithoutRoleId.length} usuarios sin role_id:`);
    usersWithoutRoleId.forEach(user => {
      console.log(`   - ${user.name || 'Sin nombre'} (${user.email}) - Rol actual: ${user.role || 'Sin rol'}`);
    });

    // =====================================================
    // 2. MAPEAR ROLES EXISTENTES
    // =====================================================
    console.log('\n📋 Mapeando roles existentes...');
    
    const roleMapping = {
      'Super Administrador': 1,
      'Contador': 4,
      'Desarrollador': 3,
      'Gerente': 5,
      'Invitado': 2,
      'Juan Carlos': 5, // Mapear a Gerente
      'usuario': 2,     // Mapear a Invitado
      'admin': 1,        // Mapear a Super Administrador
      'contador': 4,     // Mapear a Contador
      'desarrollador': 3, // Mapear a Desarrollador
      'gerente': 5,      // Mapear a Gerente
      'invitado': 2      // Mapear a Invitado
    };

    // =====================================================
    // 3. ASIGNAR ROLES
    // =====================================================
    console.log('\n🔑 Asignando roles...');
    
    for (const user of usersWithoutRoleId) {
      try {
        let roleId = null;
        let roleName = null;
        
        // Buscar por nombre exacto del rol
        if (user.role && roleMapping[user.role]) {
          roleId = roleMapping[user.role];
          roleName = user.role;
        } else if (user.role) {
          // Buscar por similitud
          const normalizedRole = user.role.toLowerCase().trim();
          for (const [key, value] of Object.entries(roleMapping)) {
            if (key.toLowerCase().includes(normalizedRole) || normalizedRole.includes(key.toLowerCase())) {
              roleId = value;
              roleName = key;
              break;
            }
          }
        }
        
        // Si no se encontró, asignar rol de Invitado por defecto
        if (!roleId) {
          roleId = 2; // Invitado
          roleName = 'Invitado';
        }
        
        // Actualizar usuario
        await prisma.$executeRaw`
          UPDATE users 
          SET role_id = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `, roleId, user.id;
        
        console.log(`✅ ${user.name || 'Usuario'}: ${user.role || 'Sin rol'} → ${roleName} (ID: ${roleId})`);
        
      } catch (error) {
        console.log(`❌ Error asignando rol a ${user.name || 'usuario'}: ${error.message}`);
      }
    }

    // =====================================================
    // 4. VERIFICACIÓN FINAL
    // =====================================================
    console.log('\n🔍 Verificación final...');
    
    try {
      const finalUserRoles = await prisma.$queryRaw`
        SELECT u.name, u.email, u.role, r.name as role_name, r.level, r.description
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY r.level ASC, u.name ASC
      `;
      
      console.log('📋 Estado final de usuarios y roles:');
      finalUserRoles.forEach(user => {
        console.log(`   - ${user.name || 'Sin nombre'} (${user.email})`);
        console.log(`     Rol: ${user.role_name || user.role || 'Sin rol'} (Nivel ${user.level || 'N/A'})`);
        console.log(`     Descripción: ${user.description || 'Sin descripción'}`);
        console.log('');
      });
      
      const orphanedUsers = await prisma.$queryRaw`
        SELECT COUNT(*) as count 
        FROM users u 
        LEFT JOIN roles r ON u.role_id = r.id
        WHERE r.id IS NULL
      `;
      
      if (orphanedUsers[0].count === 0) {
        console.log('🎉 ¡Todos los usuarios tienen roles asignados correctamente!');
      } else {
        console.log(`⚠️  Aún hay ${orphanedUsers[0].count} usuarios sin roles asignados`);
      }
      
    } catch (error) {
      console.log(`❌ Error en verificación final: ${error.message}`);
    }

  } catch (error) {
    console.error('❌ Error general:', error);
  } finally {
    await prisma.$disconnect();
  }
}

assignRolesToUsers();
