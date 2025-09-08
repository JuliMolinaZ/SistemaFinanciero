#!/usr/bin/env node

const axios = require('axios');

console.log('🧪 PRUEBA SIMPLE DE CONEXIÓN');
console.log('=============================');

const testClients = async () => {
  try {
    console.log('📍 Probando endpoint: http://localhost:8765/api/clients');
    
    const response = await axios.get('http://localhost:8765/api/clients');
    
    console.log('✅ Status:', response.status);
    console.log('📊 Estructura de respuesta:', {
      success: response.data.success,
      hasData: !!response.data.data,
      dataLength: response.data.data ? response.data.data.length : 'N/A',
      total: response.data.total
    });
    
    if (response.data.data && response.data.data.length > 0) {
      console.log('🎯 Primer cliente:', {
        id: response.data.data[0].id,
        nombre: response.data.data[0].nombre,
        run_cliente: response.data.data[0].run_cliente
      });
    }
    
    console.log('🎉 ¡Endpoint funcionando correctamente!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Data:', error.response.data);
    }
  }
};

testClients(); 