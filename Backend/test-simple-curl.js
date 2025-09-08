const http = require('http');

console.log('🧪 Probando API de usuarios...\n');

const options = {
  hostname: 'localhost',
  port: 8765,
  path: '/api/usuarios',
  method: 'GET'
};

const req = http.request(options, (res) => {
  console.log(`📡 Status: ${res.statusCode}`);
  
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    try {
      const response = JSON.parse(data);
      
      if (response.success && response.data && response.data.length > 0) {
        console.log('\n✅ USUARIOS ENCONTRADOS:');
        console.log('========================');
        
        response.data.forEach((user, index) => {
          console.log(`\n👤 Usuario ${index + 1}:`);
          console.log(`   - Nombre: ${user.name}`);
          console.log(`   - Email: ${user.email}`);
          console.log(`   - Role (campo viejo): ${user.role}`);
          console.log(`   - Role ID: ${user.role_id}`);
          
          if (user.role_info) {
            console.log(`   - Rol del nuevo sistema: ${user.role_info.name}`);
            console.log(`   - Descripción: ${user.role_info.description}`);
            console.log(`   - Nivel: ${user.role_info.level}`);
          } else {
            console.log(`   - Rol del nuevo sistema: No disponible`);
          }
        });
        
        console.log('\n🎯 VERIFICACIÓN:');
        console.log('================');
        
        const hasNewRoles = response.data.some(user => user.role_info);
        const hasOldRoles = response.data.some(user => user.role);
        
        if (hasNewRoles) {
          console.log('✅ Los nuevos roles están funcionando');
        } else {
          console.log('❌ Los nuevos roles NO están funcionando');
        }
        
        if (hasOldRoles) {
          console.log('✅ La compatibilidad con roles viejos está funcionando');
        } else {
          console.log('❌ La compatibilidad con roles viejos NO está funcionando');
        }
        
      } else {
        console.log('❌ No se recibieron datos válidos');
        console.log('Respuesta:', response);
      }
      
    } catch (error) {
      console.log('❌ Error parseando JSON:', error.message);
      console.log('📄 Respuesta raw:', data.substring(0, 200) + '...');
    }
  });
});

req.on('error', (error) => {
  console.error('❌ Error en la petición:', error.message);
});

req.end();
