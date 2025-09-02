const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: './config.env' });

const prisma = new PrismaClient();

async function fixRolesWithSQL() {
  try {
    console.log('🚀 INICIANDO CORRECCIÓN DE ROLES...\n');
    console.log('=' * 50);
    
    // =====================================================
    // 1. VERIFICAR CONEXIÓN A LA BASE DE DATOS
    // =====================================================
    console.log('🔌 Verificando conexión a la base de datos...');
    try {
      await prisma.$connect();
      console.log('✅ Conexión a la base de datos establecida');
    } catch (error) {
      console.log('❌ Error conectando a la base de datos:', error.message);
      return;
    }
    
    // =====================================================
    // 2. VERIFICAR ESTADO ACTUAL
    // =====================================================
    console.log('\n📋 Verificando estado actual de usuarios...');
    console.log('===========================================');
    
    let currentState;
    try {
      currentState = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.role_id,
          COALESCE(r.name, 'NO ASIGNADO') as role_name
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.id
      `;
      console.log(`✅ Consulta ejecutada exitosamente. ${currentState.length} usuarios encontrados`);
    } catch (error) {
      console.log('❌ Error consultando usuarios:', error.message);
      return;
    }
    
    // Mostrar estado actual
    currentState.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - ID: ${user.id}`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): "${user.role || 'NULL'}"`);
      console.log(`   - Role ID: ${user.role_id || 'NULL'}`);
      console.log(`   - Rol asignado: ${user.role_name}`);
    });
    
    // =====================================================
    // 3. VERIFICAR ROLES DISPONIBLES
    // =====================================================
    console.log('\n📋 Verificando roles disponibles...');
    console.log('=====================================');
    
    let roles;
    try {
      roles = await prisma.$queryRaw`
        SELECT id, name, description, level, is_active
        FROM roles
        ORDER BY level ASC
      `;
      console.log(`✅ Consulta de roles ejecutada. ${roles.length} roles encontrados`);
    } catch (error) {
      console.log('❌ Error consultando roles:', error.message);
      return;
    }
    
    roles.forEach(role => {
      console.log(`   - ID ${role.id}: ${role.name} (Nivel ${role.level}) - ${role.description || 'Sin descripción'}`);
    });
    
    // =====================================================
    // 4. APLICAR CORRECCIONES
    // =====================================================
    console.log('\n🔧 Aplicando correcciones...');
    console.log('================================');
    
    // Corregir usuarios con rol "Juan Carlos"
    console.log('\n🔄 Corrigiendo usuarios con rol "Juan Carlos"...');
    try {
      const result1 = await prisma.$executeRaw`
        UPDATE users 
        SET role_id = (SELECT id FROM roles WHERE name = 'Super Administrador' LIMIT 1),
            role = NULL
        WHERE role = 'Juan Carlos'
      `;
      console.log(`✅ Usuarios con "Juan Carlos" corregidos: ${result1} filas afectadas`);
    } catch (error) {
      console.log('❌ Error corrigiendo usuarios con "Juan Carlos":', error.message);
    }
    
    // Corregir usuarios con rol "Usuario"
    console.log('\n🔄 Corrigiendo usuarios con rol "Usuario"...');
    try {
      const result2 = await prisma.$executeRaw`
        UPDATE users 
        SET role_id = (SELECT id FROM roles WHERE name = 'Invitado' LIMIT 1),
            role = NULL
        WHERE role = 'Usuario'
      `;
      console.log(`✅ Usuarios con "Usuario" corregidos: ${result2} filas afectadas`);
    } catch (error) {
      console.log('❌ Error corrigiendo usuarios con "Usuario":', error.message);
    }
    
    // =====================================================
    // 5. VERIFICAR ESTADO FINAL
    // =====================================================
    console.log('\n🔍 Verificando estado final...');
    console.log('================================');
    
    let finalState;
    try {
      finalState = await prisma.$queryRaw`
        SELECT 
          u.id,
          u.name,
          u.email,
          u.role,
          u.role_id,
          COALESCE(r.name, 'NO ASIGNADO') as role_name,
          r.level as role_level
        FROM users u
        LEFT JOIN roles r ON u.role_id = r.id
        ORDER BY u.id
      `;
      console.log(`✅ Consulta final ejecutada. ${finalState.length} usuarios encontrados`);
    } catch (error) {
      console.log('❌ Error en consulta final:', error.message);
      return;
    }
    
    // Mostrar estado final
    console.log('\n📋 Estado final de usuarios:');
    console.log('=============================');
    
    finalState.forEach((user, index) => {
      console.log(`\n👤 Usuario ${index + 1}:`);
      console.log(`   - Nombre: ${user.name}`);
      console.log(`   - Email: ${user.email}`);
      console.log(`   - Role (campo viejo): "${user.role || 'LIMPIADO'}"`);
      console.log(`   - Role ID: ${user.role_id || 'NULL'}`);
      console.log(`   - Rol asignado: ${user.role_name}`);
      if (user.role_level) {
        console.log(`   - Nivel del rol: ${user.role_level}`);
      }
    });
    
    // =====================================================
    // 6. ANÁLISIS Y RESUMEN
    // =====================================================
    console.log('\n🎯 ANÁLISIS FINAL');
    console.log('==================');
    
    const usersWithRoles = finalState.filter(user => user.role_name !== 'NO ASIGNADO');
    const usersWithoutRoles = finalState.filter(user => user.role_name === 'NO ASIGNADO');
    
    console.log(`📊 Total de usuarios: ${finalState.length}`);
    console.log(`📊 Usuarios CON roles: ${usersWithRoles.length}`);
    console.log(`📊 Usuarios SIN roles: ${usersWithoutRoles.length}`);
    
    if (usersWithoutRoles.length > 0) {
      console.log('\n⚠️ USUARIOS SIN ROLES ASIGNADOS:');
      usersWithoutRoles.forEach(user => {
        console.log(`   - ${user.name} (${user.email})`);
      });
    }
    
    // =====================================================
    // 7. VERIFICAR CAMBIOS REALIZADOS
    // =====================================================
    console.log('\n🔄 VERIFICANDO CAMBIOS REALIZADOS...');
    console.log('=====================================');
    
    const changesMade = currentState.filter((oldUser, index) => {
      const newUser = finalState[index];
      return oldUser.role !== newUser.role || oldUser.role_id !== newUser.role_id;
    });
    
    if (changesMade.length > 0) {
      console.log(`✅ Se realizaron cambios en ${changesMade.length} usuarios:`);
      changesMade.forEach((oldUser, index) => {
        const newUser = finalState.find(u => u.id === oldUser.id);
        console.log(`   - ${oldUser.name}:`);
        console.log(`     Rol: "${oldUser.role}" → "${newUser.role || 'LIMPIADO'}"`);
        console.log(`     Role ID: ${oldUser.role_id || 'NULL'} → ${newUser.role_id || 'NULL'}`);
      });
    } else {
      console.log('ℹ️ No se realizaron cambios en ningún usuario');
    }
    
    // =====================================================
    // 8. RESULTADO FINAL
    // =====================================================
    console.log('\n🎉 RESULTADO FINAL');
    console.log('==================');
    
    if (usersWithRoles.length === finalState.length) {
      console.log('🎉 ¡TODOS LOS USUARIOS TIENEN ROLES ASIGNADOS!');
      console.log('✅ El sistema de roles está funcionando correctamente');
      console.log('✅ Los campos viejos han sido limpiados');
      console.log('✅ La compatibilidad del frontend está asegurada');
      
      console.log('\n🚀 PRÓXIMOS PASOS:');
      console.log('1. Reiniciar el servidor backend');
      console.log('2. Probar la API de usuarios');
      console.log('3. Verificar en el frontend que los roles se muestren correctamente');
    } else {
      console.log('\n⚠️ SISTEMA INCOMPLETO');
      console.log('❌ Algunos usuarios siguen sin roles asignados');
      console.log('❌ Necesita revisar manualmente los usuarios sin roles');
    }
    
    console.log('\n' + '=' * 50);
    console.log('🏁 PROCESO COMPLETADO');
    
  } catch (error) {
    console.error('\n❌ ERROR FATAL:', error);
    console.error('Stack trace:', error.stack);
  } finally {
    try {
      await prisma.$disconnect();
      console.log('\n✅ Conexión a la base de datos cerrada');
    } catch (error) {
      console.log('\n⚠️ Error cerrando conexión:', error.message);
    }
  }
}

// Ejecutar con manejo de errores adicional
console.log('🚀 Iniciando script de corrección de roles...');
fixRolesWithSQL()
  .then(() => {
    console.log('\n✅ Script ejecutado exitosamente');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error en la ejecución del script:', error);
    process.exit(1);
  });
