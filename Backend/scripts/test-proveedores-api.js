// Script para probar la API de proveedores
const axios = require('axios');

async function testProveedoresAPI() {
  try {
    console.log('🧪 Probando API de proveedores...');
    
    // Probar endpoint local
    const localResponse = await axios.get('http://localhost:5001/api/proveedores');
    console.log('✅ Respuesta local exitosa');
    console.log('📊 Tipo de respuesta:', typeof localResponse.data);
    console.log('📊 Es array:', Array.isArray(localResponse.data));
    console.log('📊 Longitud:', localResponse.data ? localResponse.data.length : 'undefined');
    console.log('📊 Primer elemento:', localResponse.data && localResponse.data[0] ? localResponse.data[0] : 'N/A');
    
    if (localResponse.data && typeof localResponse.data === 'object') {
      console.log('🔍 Claves del objeto:', Object.keys(localResponse.data));
    }
    
    // Probar con diferentes headers
    console.log('\n🧪 Probando con diferentes headers...');
    
    const responseWithHeaders = await axios.get('http://localhost:5001/api/proveedores', {
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    console.log('✅ Respuesta con headers exitosa');
    console.log('📊 Tipo de respuesta:', typeof responseWithHeaders.data);
    console.log('📊 Es array:', Array.isArray(responseWithHeaders.data));
    
    // Probar endpoint de estadísticas
    console.log('\n🧪 Probando endpoint de estadísticas...');
    
    try {
      const statsResponse = await axios.get('http://localhost:5001/api/proveedores/stats');
      console.log('✅ Estadísticas exitosas');
      console.log('📊 Datos:', statsResponse.data);
    } catch (statsError) {
      console.log('❌ Estadísticas no disponibles:', statsError.message);
    }
    
    console.log('\n🎉 Pruebas completadas');
    
  } catch (error) {
    console.error('❌ Error durante la prueba:', error.message);
    
    if (error.response) {
      console.error('📊 Status:', error.response.status);
      console.error('📊 Headers:', error.response.headers);
      console.error('📊 Data:', error.response.data);
    }
  }
}

// Ejecutar el script
if (require.main === module) {
  testProveedoresAPI()
    .then(() => {
      console.log('✅ Script ejecutado exitosamente');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { testProveedoresAPI };
