// Script de prueba para el sistema de validación
const axios = require('axios');

const BASE_URL = 'http://localhost:8765/api';

// Datos de prueba válidos
const validUser = {
  firebase_uid: 'test_uid_123',
  email: 'test@example.com',
  name: 'Usuario de Prueba',
  role: 'usuario',
  avatar: 'https://example.com/avatar.jpg'
};

const validClient = {
  run_cliente: '12345678-9',
  nombre: 'Cliente de Prueba',
  rfc: 'ABCD123456EF1',
  direccion: 'Calle de Prueba 123, Ciudad'
};

const validProject = {
  nombre: 'Proyecto de Prueba',
  cliente_id: 1,
  monto_sin_iva: 1000.00,
  monto_con_iva: 1160.00,
  estado: 'activo'
};

const validCuentaPagar = {
  concepto: 'Servicio de Prueba',
  monto_neto: 500.00,
  requiere_iva: true,
  categoria: 'Servicios',
  fecha: new Date().toISOString().split('T')[0],
  pagado: false
};

// Datos de prueba inválidos
const invalidUser = {
  firebase_uid: '',
  email: 'invalid-email',
  name: 'A', // Muy corto
  role: 'invalid_role'
};

const invalidClient = {
  run_cliente: '123', // Muy corto
  nombre: '', // Vacío
  rfc: 'ABC', // Muy corto
  direccion: 'Calle' // Muy corto
};

// Función para hacer pruebas
async function runTests() {

  const tests = [
    {
      name: 'Crear usuario válido',
      method: 'POST',
      url: '/usuarios',
      data: validUser,
      expectedStatus: 201
    },
    {
      name: 'Crear usuario inválido',
      method: 'POST',
      url: '/usuarios',
      data: invalidUser,
      expectedStatus: 400
    },
    {
      name: 'Crear cliente válido',
      method: 'POST',
      url: '/clients',
      data: validClient,
      expectedStatus: 201
    },
    {
      name: 'Crear cliente inválido',
      method: 'POST',
      url: '/clients',
      data: invalidClient,
      expectedStatus: 400
    },
    {
      name: 'Crear proyecto válido',
      method: 'POST',
      url: '/projects',
      data: validProject,
      expectedStatus: 201
    },
    {
      name: 'Crear cuenta por pagar válida',
      method: 'POST',
      url: '/cuentas-pagar',
      data: validCuentaPagar,
      expectedStatus: 201
    },
    {
      name: 'Obtener usuario con ID inválido',
      method: 'GET',
      url: '/usuarios/abc',
      expectedStatus: 400
    },
    {
      name: 'Obtener usuario con ID válido',
      method: 'GET',
      url: '/usuarios/1',
      expectedStatus: 200
    }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {

      const response = await axios({
        method: test.method,
        url: `${BASE_URL}${test.url}`,
        data: test.data,
        validateStatus: () => true // No lanzar error por status codes
      });

      if (response.status === test.expectedStatus) {

        passed++;
      } else {

        if (response.data && response.data.errors) {

        }
        failed++;
      }
    } catch (error) {

      failed++;
    }

  }

  if (failed === 0) {

  } else {

  }
}

// Función para probar rate limiting
async function testRateLimiting() {

  try {
    const promises = [];
    for (let i = 0; i < 15; i++) {
      promises.push(
        axios.get(`${BASE_URL}/usuarios`).catch(err => err.response)
      );
    }
    
    const responses = await Promise.all(promises);
    const rateLimited = responses.filter(r => r && r.status === 429);

    if (rateLimited.length > 0) {

    } else {

    }
  } catch (error) {

  }
}

// Función para probar manejo de errores
async function testErrorHandling() {

  const errorTests = [
    {
      name: 'Ruta no encontrada',
      url: '/ruta-inexistente',
      expectedStatus: 404
    },
    {
      name: 'JSON inválido',
      method: 'POST',
      url: '/usuarios',
      headers: { 'Content-Type': 'application/json' },
      data: 'invalid json',
      expectedStatus: 400
    }
  ];

  for (const test of errorTests) {
    try {

      const response = await axios({
        method: test.method || 'GET',
        url: `${BASE_URL}${test.url}`,
        data: test.data,
        headers: test.headers,
        validateStatus: () => true
      });

      if (response.status === test.expectedStatus) {

      } else {

      }
    } catch (error) {

    }
  }
}

// Ejecutar todas las pruebas
async function runAllTests() {

  await runTests();
  await testRateLimiting();
  await testErrorHandling();

}

// Ejecutar si se llama directamente
if (require.main === module) {
  runAllTests().catch(console.error);
}

module.exports = {
  runTests,
  testRateLimiting,
  testErrorHandling,
  runAllTests
}; 