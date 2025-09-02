// test-firebase-profile.js - Script para probar la detección de perfiles sin Firebase

const axios = require('axios');

const testFirebaseProfileDetection = async () => {
  console.log('🧪 PROBANDO DETECCIÓN DE PERFILES SIN FIREBASE');
  console.log('====================================================');
  
  try {
    // Test 1: Llamada normal con firebase_uid (debería pasar)
    console.log('\n🔍 Test 1: Llamada normal con firebase_uid');
    try {
      const response1 = await axios.post('http://localhost:5001/api/usuarios', {
        firebase_uid: 'test123',
        email: 'test@example.com',
        name: 'Test User'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/'
        }
      });
      console.log('✅ Test 1 PASÓ - Llamada con firebase_uid permitida');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('❌ Test 1 FALLÓ - Llamada con firebase_uid bloqueada incorrectamente');
        console.log('📝 Error:', error.response.data.message);
      } else {
        console.log('✅ Test 1 PASÓ - Llamada con firebase_uid falló por otra razón (esperado)');
      }
    }
    
    // Test 2: Llamada SIN firebase_uid pero CON email (debería ser bloqueada)
    console.log('\n🔍 Test 2: Llamada SIN firebase_uid pero CON email');
    try {
      const response2 = await axios.post('http://localhost:5001/api/usuarios', {
        email: 'invited@example.com',
        name: 'Invited User'
        // NO hay firebase_uid
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/'
        }
      });
      console.log('❌ Test 2 FALLÓ - Llamada sin firebase_uid permitida incorrectamente');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Test 2 PASÓ - Llamada sin firebase_uid bloqueada correctamente');
        console.log('📝 Mensaje de error:', error.response.data.message);
        console.log('📝 Detalles:', error.response.data.details);
      } else {
        console.log('❌ Test 2 FALLÓ - Llamada sin firebase_uid falló por otra razón');
      }
    }
    
    // Test 3: Llamada con token de invitación (debería ser bloqueada)
    console.log('\n🔍 Test 3: Llamada con token de invitación');
    try {
      const response3 = await axios.post('http://localhost:5001/api/usuarios', {
        email: 'invited@example.com',
        token: 'abc123',
        name: 'Invited User'
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/'
        }
      });
      console.log('❌ Test 3 FALLÓ - Llamada con token permitida incorrectamente');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Test 3 PASÓ - Llamada con token bloqueada correctamente');
        console.log('📝 Mensaje de error:', error.response.data.message);
        console.log('📝 Detalles:', error.response.data.details);
      } else {
        console.log('❌ Test 3 FALLÓ - Llamada con token falló por otra razón');
      }
    }
    
    // Test 4: Llamada con solo email (debería ser bloqueada)
    console.log('\n🔍 Test 4: Llamada con solo email');
    try {
      const response4 = await axios.post('http://localhost:5001/api/usuarios', {
        email: 'invited@example.com'
        // Solo email, nada más
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Referer': 'http://localhost:3000/'
        }
      });
      console.log('❌ Test 4 FALLÓ - Llamada con solo email permitida');
    } catch (error) {
      if (error.response?.status === 403) {
        console.log('✅ Test 4 PASÓ - Llamada con solo email bloqueada correctamente');
        console.log('📝 Mensaje de error:', error.response.data.message);
        console.log('📝 Detalles:', error.response.data.details);
      } else {
        console.log('❌ Test 4 FALLÓ - Llamada con solo email falló por otra razón');
      }
    }
    
  } catch (error) {
    console.error('❌ Error general en las pruebas:', error.message);
  }
  
  console.log('\n====================================================');
  console.log('🧪 PRUEBAS COMPLETADAS');
};

// Ejecutar las pruebas
testFirebaseProfileDetection();
