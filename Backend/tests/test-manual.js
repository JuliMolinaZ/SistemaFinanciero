const axios = require('axios');

async function testValidation() {
  console.log('🧪 Probando Sistema de Validación Manualmente...\n');

  const baseURL = 'http://localhost:8765/api';

  // Test 1: Usuario inválido
  console.log('📋 Test 1: Crear usuario con datos inválidos');
  try {
    const response = await axios.post(`${baseURL}/usuarios`, {
      firebase_uid: '',
      email: 'invalid-email',
      name: 'A',
      role: 'invalid_role'
    }, {
      validateStatus: () => true
    });

    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 2: Usuario válido
  console.log('📋 Test 2: Crear usuario con datos válidos');
  try {
    const response = await axios.post(`${baseURL}/usuarios`, {
      firebase_uid: 'test_uid_' + Date.now(),
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      role: 'usuario'
    }, {
      validateStatus: () => true
    });

    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 3: Cliente inválido
  console.log('📋 Test 3: Crear cliente con datos inválidos');
  try {
    const response = await axios.post(`${baseURL}/clients`, {
      run_cliente: '123',
      nombre: '',
      rfc: 'ABC',
      direccion: 'Calle'
    }, {
      validateStatus: () => true
    });

    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n' + '='.repeat(50) + '\n');

  // Test 4: ID inválido
  console.log('📋 Test 4: Obtener usuario con ID inválido');
  try {
    const response = await axios.get(`${baseURL}/usuarios/abc`, {
      validateStatus: () => true
    });

    console.log(`Status: ${response.status}`);
    if (response.data) {
      console.log('Respuesta:', JSON.stringify(response.data, null, 2));
    }
  } catch (error) {
    console.log('Error:', error.message);
  }

  console.log('\n🎉 Pruebas manuales completadas');
}

// Ejecutar las pruebas
testValidation().catch(console.error); 