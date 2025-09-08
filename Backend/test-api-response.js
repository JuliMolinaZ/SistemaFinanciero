const http = require('http');

function testAPI() {
  console.log('🧪 Probando respuesta de la API de usuarios...\n');
  
  const options = {
    hostname: 'localhost',
    port: 8765,
    path: '/api/usuarios',
    method: 'GET'
  };

  const req = http.request(options, (res) => {
    console.log(`📡 Status: ${res.statusCode}`);
    console.log(`📡 Headers: ${JSON.stringify(res.headers, null, 2)}\n`);
    
    let data = '';
    
    res.on('data', (chunk) => {
      data += chunk;
    });
    
    res.on('end', () => {
      try {
        const response = JSON.parse(data);
        console.log('📋 Respuesta completa de la API:');
        console.log(JSON.stringify(response, null, 2));
        
        if (response.success && response.data && response.data.length > 0) {
          console.log('\n🔍 ANÁLISIS DE DATOS:');
          console.log('========================');
          
          const firstUser = response.data[0];
          console.log('Primer usuario:');
          console.log(`  - ID: ${firstUser.id}`);
          console.log(`  - Nombre: ${firstUser.name}`);
          console.log(`  - Email: ${firstUser.email}`);
          console.log(`  - Role (campo viejo): ${firstUser.role}`);
          console.log(`  - Role ID: ${firstUser.role_id}`);
          console.log(`  - Roles (nuevo campo): ${JSON.stringify(firstUser.roles, null, 4)}`);
          
          console.log('\n📊 CAMPOS DISPONIBLES:');
          console.log(Object.keys(firstUser));
          
        } else {
          console.log('❌ No se recibieron datos válidos');
        }
        
      } catch (error) {
        console.log('❌ Error parseando JSON:', error.message);
        console.log('📄 Respuesta raw:', data);
      }
    });
  });

  req.on('error', (error) => {
    console.error('❌ Error en la petición:', error.message);
  });

  req.end();
}

testAPI();
