const axios = require('axios');

const PRODUCTION_URL = 'https://sigma.runsolutions-services.com/api';

async function testProductionAPI() {
  console.log('🧪 Probando API de Producción...\n');

  try {
    // 1. Probar endpoint de usuarios
    console.log('1️⃣ Probando GET /usuarios...');
    const usersResponse = await axios.get(`${PRODUCTION_URL}/usuarios`);
    console.log('✅ Usuarios obtenidos:', usersResponse.data.length, 'usuarios');
    
    if (usersResponse.data.length > 0) {
      console.log('📋 Primer usuario:', {
        id: usersResponse.data[0].id,
        name: usersResponse.data[0].name,
        email: usersResponse.data[0].email,
        role: usersResponse.data[0].role
      });
    }

    // 2. Probar endpoint de clientes
    console.log('\n2️⃣ Probando GET /clients...');
    const clientsResponse = await axios.get(`${PRODUCTION_URL}/clients`);
    console.log('✅ Clientes obtenidos:', clientsResponse.data.length, 'clientes');
    
    if (clientsResponse.data.length > 0) {
      console.log('📋 Primer cliente:', {
        id: clientsResponse.data[0].id,
        nombre: clientsResponse.data[0].nombre,
        rfc: clientsResponse.data[0].rfc
      });
    }

    console.log('\n🎉 ¡API de producción funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });
  }
}

testProductionAPI(); 