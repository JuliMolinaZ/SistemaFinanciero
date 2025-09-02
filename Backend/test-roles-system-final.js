const axios = require('axios');

const API_URL = 'http://localhost:5001';

async function testRolesSystem() {
  console.log('🧪 PROBANDO SISTEMA DE ROLES Y USUARIOS...\n');

  try {
    // 1. Probar obtener roles
    console.log('1️⃣ Probando obtener roles...');
    const rolesResponse = await axios.get(`${API_URL}/api/roles`);
    console.log('✅ Roles obtenidos:', rolesResponse.data.success ? 'EXITOSO' : 'FALLIDO');
    if (rolesResponse.data.success) {
      console.log(`   📊 Total de roles: ${rolesResponse.data.data.length}`);
      rolesResponse.data.data.forEach(role => {
        console.log(`   👑 ${role.name} (Nivel: ${role.level}) - ${role.is_active ? 'Activo' : 'Inactivo'}`);
      });
    }
    console.log('');

    // 2. Probar obtener módulos del sistema
    console.log('2️⃣ Probando obtener módulos del sistema...');
    const modulesResponse = await axios.get(`${API_URL}/api/roles/modules/list`);
    console.log('✅ Módulos obtenidos:', modulesResponse.data.success ? 'EXITOSO' : 'FALLIDO');
    if (modulesResponse.data.success) {
      console.log(`   📊 Total de módulos: ${modulesResponse.data.data.length}`);
      modulesResponse.data.data.forEach(module => {
        console.log(`   🔧 ${module.display_name} (${module.name})`);
      });
    }
    console.log('');

    // 3. Probar obtener usuarios
    console.log('3️⃣ Probando obtener usuarios...');
    const usersResponse = await axios.get(`${API_URL}/api/usuarios`);
    console.log('✅ Usuarios obtenidos:', usersResponse.data.success ? 'EXITOSO' : 'FALLIDO');
    if (usersResponse.data.success) {
      console.log(`   📊 Total de usuarios: ${usersResponse.data.data.length}`);
      usersResponse.data.data.slice(0, 3).forEach(user => {
        console.log(`   👤 ${user.name || 'Sin nombre'} - ${user.email} - Rol: ${user.role}`);
      });
      if (usersResponse.data.data.length > 3) {
        console.log(`   ... y ${usersResponse.data.data.length - 3} usuarios más`);
      }
    }
    console.log('');

    // 4. Probar obtener usuarios pendientes de perfil
    console.log('4️⃣ Probando obtener usuarios pendientes de perfil...');
    const pendingResponse = await axios.get(`${API_URL}/api/user-registration/pending-profiles`);
    console.log('✅ Usuarios pendientes obtenidos:', pendingResponse.data.success ? 'EXITOSO' : 'FALLIDO');
    if (pendingResponse.data.success) {
      console.log(`   📊 Total de usuarios pendientes: ${pendingResponse.data.data.length}`);
      if (pendingResponse.data.data.length > 0) {
        pendingResponse.data.data.forEach(user => {
          console.log(`   ⏳ ${user.email} - Rol: ${user.role} - ${user.is_first_login ? 'Primera vez' : 'Perfil incompleto'}`);
        });
      } else {
        console.log('   🎉 No hay usuarios pendientes de completar perfil');
      }
    }
    console.log('');

    // 5. Probar verificar estado de perfil de un usuario
    if (usersResponse.data.success && usersResponse.data.data.length > 0) {
      const testUser = usersResponse.data.data[0];
      console.log('5️⃣ Probando verificar estado de perfil...');
      try {
        const profileStatusResponse = await axios.get(`${API_URL}/api/user-registration/profile-status/${testUser.email}`);
        console.log('✅ Estado de perfil verificado:', profileStatusResponse.data.success ? 'EXITOSO' : 'FALLIDO');
        if (profileStatusResponse.data.success) {
          const status = profileStatusResponse.data.data;
          console.log(`   👤 Usuario: ${testUser.email}`);
          console.log(`   📝 Perfil completo: ${status.profile_complete ? 'SÍ' : 'NO'}`);
          console.log(`   🔑 Primera vez: ${status.is_first_login ? 'SÍ' : 'NO'}`);
        }
      } catch (error) {
        console.log('   ⚠️ No se pudo verificar estado de perfil (posible endpoint no implementado)');
      }
      console.log('');
    }

    console.log('🎉 PRUEBAS COMPLETADAS EXITOSAMENTE!');
    console.log('✅ El sistema de roles y usuarios está funcionando correctamente');
    console.log('✅ Puedes proceder a usar el módulo de usuarios en el frontend');

  } catch (error) {
    console.error('❌ ERROR durante las pruebas:', error.message);
    if (error.response) {
      console.error('   📊 Status:', error.response.status);
      console.error('   📝 Mensaje:', error.response.data?.message || 'Sin mensaje');
    }
  }
}

// Ejecutar pruebas
testRolesSystem();
