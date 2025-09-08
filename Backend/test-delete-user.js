// test-delete-user.js - Script para probar la eliminación de usuarios

const axios = require('axios');

const testDeleteUser = async () => {
  console.log('🧪 PROBANDO FUNCIONALIDAD DE ELIMINACIÓN DE USUARIOS');
  console.log('====================================================');
  
  try {
    // Test 1: Obtener usuarios pendientes
    console.log('\n🔍 Test 1: Obtener usuarios pendientes');
    try {
      const response1 = await axios.get('http://localhost:8765/api/user-registration/pending-profiles');
      console.log('✅ Test 1 PASÓ - Usuarios pendientes obtenidos');
      console.log('📝 Usuarios encontrados:', response1.data.data?.length || 0);
      
      if (response1.data.data && response1.data.data.length > 0) {
        const firstUser = response1.data.data[0];
        console.log('📝 Primer usuario:', {
          id: firstUser.id,
          email: firstUser.email,
          profile_complete: firstUser.profile_complete,
          is_first_login: firstUser.is_first_login
        });
        
        // Test 2: Intentar eliminar el primer usuario
        console.log('\n🔍 Test 2: Intentar eliminar usuario');
        try {
          const response2 = await axios.delete(`http://localhost:8765/api/user-registration/delete-user/${firstUser.id}`);
          console.log('✅ Test 2 PASÓ - Usuario eliminado exitosamente');
          console.log('📝 Respuesta:', response2.data.message);
          
          // Test 3: Verificar que el usuario fue eliminado
          console.log('\n🔍 Test 3: Verificar eliminación');
          try {
            const response3 = await axios.get('http://localhost:8765/api/user-registration/pending-profiles');
            const remainingUsers = response3.data.data?.length || 0;
            console.log('✅ Test 3 PASÓ - Verificación completada');
            console.log('📝 Usuarios restantes:', remainingUsers);
            
            if (remainingUsers < response1.data.data.length) {
              console.log('🎯 Usuario eliminado correctamente');
            } else {
              console.log('⚠️ Usuario no fue eliminado');
            }
            
          } catch (error3) {
            console.log('❌ Test 3 FALLÓ - Error al verificar:', error3.message);
          }
          
        } catch (error2) {
          if (error2.response?.status === 400) {
            console.log('⚠️ Test 2 - Usuario no puede ser eliminado (perfil completo)');
            console.log('📝 Razón:', error2.response.data.message);
          } else if (error2.response?.status === 404) {
            console.log('⚠️ Test 2 - Usuario no encontrado');
            console.log('📝 Razón:', error2.response.data.message);
          } else {
            console.log('❌ Test 2 FALLÓ - Error al eliminar:', error2.message);
            if (error2.response) {
              console.log('📝 Status:', error2.response.status);
              console.log('📝 Mensaje:', error2.response.data.message);
            }
          }
        }
        
      } else {
        console.log('⚠️ No hay usuarios pendientes para probar eliminación');
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
  
  console.log('\n====================================================');
  console.log('🧪 PRUEBAS COMPLETADAS');
};

// Ejecutar las pruebas
testDeleteUser();
