// test-invitation-block.js - Script para probar el middleware de bloqueo

const axios = require('axios');

const testInvitationBlock = async () => {
  console.log('🧪 PROBANDO MIDDLEWARE DE BLOQUEO DE USUARIOS INVITADOS');
  console.log('====================================================');
  
  try {
    // Test 1: Llamada normal a /api/usuarios (debería pasar)
    console.log('\n🔍 Test 1: Llamada normal a /api/usuarios');
    try {
      const response1 = await axios.post('http://localhost:5001/api/usuarios', {
        firebase_uid: 'test123',
        email: 'test@example.com',
        name: 'Test User'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/dashboard'
        }
      });
      console.log('✅ Test 1 PASÓ - Llamada normal permitida');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('❌ Test 1 FALLÓ - Llamada normal bloqueada incorrectamente');
      } else {
        console.log('✅ Test 1 PASÓ - Llamada normal falló por otra razón (esperado)');
      }
    }
    
    // Test 2: Llamada desde página de invitación (debería ser bloqueada)
    console.log('\n🔍 Test 2: Llamada desde página de invitación');
    try {
      const response2 = await axios.post('http://localhost:5001/api/usuarios', {
        test: 'data'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/complete-profile/abc123'
        }
      });
      console.log('❌ Test 2 FALLÓ - Llamada de invitación permitida incorrectamente');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Test 2 PASÓ - Llamada de invitación bloqueada correctamente');
        console.log('📝 Mensaje de error:', error.response.data.message);
      } else {
        console.log('❌ Test 2 FALLÓ - Llamada de invitación falló por otra razón');
      }
    }
    
    // Test 3: Llamada con datos de invitación en el body (debería ser bloqueada)
    console.log('\n🔍 Test 3: Llamada con datos de invitación en body');
    try {
      const response3 = await axios.post('http://localhost:5001/api/usuarios', {
        email: 'invited@example.com',
        token: 'abc123',
        is_invited_user: true
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/'
        }
      });
      console.log('❌ Test 3 FALLÓ - Llamada con datos de invitación permitida');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Test 3 PASÓ - Llamada con datos de invitación bloqueada');
        console.log('📝 Mensaje de error:', error.response.data.message);
        console.log('📝 Detalles:', error.response.data.details);
      } else {
        console.log('❌ Test 3 FALLÓ - Llamada con datos de invitación falló por otra razón');
      }
    }
    
    // Test 4: Llamada con header personalizado de invitación (debería ser bloqueada)
    console.log('\n🔍 Test 4: Llamada con header de invitación');
    try {
      const response4 = await axios.post('http://localhost:5001/api/usuarios', {
        test: 'data'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'X-User-Type': 'invited',
          'Referer': 'http://localhost:3000/'
        }
      });
      console.log('❌ Test 4 FALLÓ - Llamada con header de invitación permitida');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Test 4 PASÓ - Llamada con header de invitación bloqueada');
        console.log('📝 Mensaje de error:', error.response.data.message);
        console.log('📝 Detalles:', error.response.data.details);
      } else {
        console.log('❌ Test 4 FALLÓ - Llamada con header de invitación falló por otra razón');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general en las pruebas:', error.message);
  }
  
  console.log('\n====================================================');
  console.log('🧪 PRUEBAS COMPLETADAS');
};

// Ejecutar las pruebas
testInvitationBlock();
