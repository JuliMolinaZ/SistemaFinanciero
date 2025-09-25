const axios = require('axios');

async function testValidation() {

  const baseURL = 'http://localhost:8765/api';

  // Test 1: Usuario inválido

  try {
    const response = await axios.post(`${baseURL}/usuarios`, {
      firebase_uid: '',
      email: 'invalid-email',
      name: 'A',
      role: 'invalid_role'
    }, {
      validateStatus: () => true
    });

    if (response.data) {

  // Test 2: Usuario válido

  try {
    const response = await axios.post(`${baseURL}/usuarios`, {
      firebase_uid: 'test_uid_' + Date.now(),
      email: 'test@example.com',
      name: 'Usuario de Prueba',
      role: 'usuario'
    }, {
      validateStatus: () => true
    });

    if (response.data) {

  // Test 3: Cliente inválido

  try {
    const response = await axios.post(`${baseURL}/clients`, {
      run_cliente: '123',
      nombre: '',
      rfc: 'ABC',
      direccion: 'Calle'
    }, {
      validateStatus: () => true
    });

    if (response.data) {

  // Test 4: ID inválido

  try {
    const response = await axios.get(`${baseURL}/usuarios/abc`, {
      validateStatus: () => true
    });

    if (response.data) {

    }
  } catch (error) {

  }

}

// Ejecutar las pruebas
testValidation().catch(console.error); 