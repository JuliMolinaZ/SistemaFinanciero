// test-all-users-endpoint.js - Script para probar el endpoint de todos los usuarios

const axios = require('axios');

const testAllUsersEndpoint = async () => {
  console.log('🧪 PROBANDO ENDPOINT DE TODOS LOS USUARIOS');
  console.log('============================================');
  
  try {
    // Test 1: Obtener todos los usuarios
    console.log('\n🔍 Test 1: Obtener todos los usuarios');
    try {
      const response1 = await axios.get('http://localhost:8765/api/user-registration/all-users');
      console.log('✅ Test 1 PASÓ - Todos los usuarios obtenidos');
      console.log('📝 Usuarios encontrados:', response1.data.data?.length || 0);
      
      if (response1.data.data && response1.data.data.length > 0) {
        const firstUser = response1.data.data[0];
        console.log('📝 Primer usuario:', {
          id: firstUser.id,
          email: firstUser.email,
          name: firstUser.name,
          role: firstUser.roles?.name || 'Sin rol',
          profile_complete: firstUser.profile_complete
        });
        
        // Test 2: Probar actualización de usuario
        console.log('\n🔍 Test 2: Probar actualización de usuario');
        try {
          const updateData = {
            name: `${firstUser.name} (Actualizado)`,
            last_name: 'Apellido Actualizado'
          };
          
          console.log('📝 Datos a actualizar:', updateData);
          
          const response2 = await axios.put(`http://localhost:8765/api/user-registration/update-user/${firstUser.id}`, updateData);
          console.log('✅ Test 2 PASÓ - Usuario actualizado exitosamente');
          console.log('📝 Respuesta:', response2.data.message);
          console.log('📝 Usuario actualizado:', {
            name: response2.data.data.name,
            last_name: response2.data.data.last_name
          });
          
        } catch (error2) {
          console.log('❌ Test 2 FALLÓ - Error al actualizar:', error2.message);
          if (error2.response) {
            console.log('📝 Status:', error2.response.status);
            console.log('📝 Mensaje:', error2.response.data.message);
          }
        }
        
        // Test 3: Probar eliminación de usuario (solo si no es el último Super Admin)
        console.log('\n🔍 Test 3: Probar eliminación de usuario');
        try {
          if (firstUser.roles?.name === 'Super Administrador') {
            console.log('⚠️ Usuario es Super Admin - Verificando si se puede eliminar...');
            
            // Contar Super Admins
            const allUsers = await axios.get('http://localhost:8765/api/user-registration/all-users');
            const superAdminCount = allUsers.data.data.filter(u => u.roles?.name === 'Super Administrador').length;
            
            if (superAdminCount <= 1) {
              console.log('⚠️ No se puede eliminar - Es el último Super Admin');
            } else {
              console.log('✅ Se puede eliminar - Hay otros Super Admins');
            }
          } else {
            console.log('✅ Usuario no es Super Admin - Se puede eliminar');
          }
          
        } catch (error3) {
          console.log('❌ Test 3 FALLÓ - Error al verificar eliminación:', error3.message);
        }
        
      } else {
        console.log('⚠️ No hay usuarios para probar');
      }
      
    } catch (error1) {
      console.log('❌ Test 1 FALLÓ - Error al obtener usuarios:', error1.message);
      if (error1.response) {
        console.log('📝 Status:', error1.response.status);
        console.log('📝 Mensaje:', error1.response.data.message);
      }
    }
    
  } catch (error) {
    console.error('❌ Error general en las pruebas:', error.message);
  }
  
  console.log('\n============================================');
  console.log('🧪 PRUEBAS COMPLETADAS');
};

// Ejecutar las pruebas
testAllUsersEndpoint();
