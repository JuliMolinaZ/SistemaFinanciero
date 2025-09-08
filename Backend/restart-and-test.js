const { spawn } = require('child_process');
const axios = require('axios');

const BASE_URL = 'http://localhost:8765/api';

async function testAPI() {
  console.log('🧪 Probando API después de reinicio...\n');

  try {
    // Esperar un momento para que el servidor se inicie completamente
    await new Promise(resolve => setTimeout(resolve, 3000));

    // 1. Probar endpoint de salud
    console.log('1️⃣ Probando GET /health...');
    const healthResponse = await axios.get('http://localhost:8765/health');
    console.log('✅ Salud del sistema:', healthResponse.data);

    // 2. Probar endpoint de usuarios
    console.log('\n2️⃣ Probando GET /api/users...');
    const usersResponse = await axios.get(`${BASE_URL}/users`);
    console.log('✅ Respuesta exitosa:', {
      status: usersResponse.status,
      success: usersResponse.data.success,
      total: usersResponse.data.total,
      dataLength: usersResponse.data.data ? usersResponse.data.data.length : 0
    });

    if (usersResponse.data.data && usersResponse.data.data.length > 0) {
      console.log('📋 Primer usuario:', {
        id: usersResponse.data.data[0].id,
        name: usersResponse.data.data[0].name,
        email: usersResponse.data.data[0].email,
        role: usersResponse.data.data[0].role
      });
    }

    console.log('\n🎉 ¡API funcionando correctamente!');

  } catch (error) {
    console.error('❌ Error en la prueba:', {
      message: error.message,
      status: error.response?.status,
      data: error.response?.data
    });

    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 El servidor no está corriendo. Verifica que esté iniciado.');
    }
  }
}

// Función para reiniciar el servidor
function restartServer() {
  console.log('🔄 Reiniciando servidor...\n');
  
  // Detener el servidor actual (si está corriendo)
  const killProcess = spawn('pkill', ['-f', 'node src/server.js']);
  
  killProcess.on('close', () => {
    console.log('⏹️ Servidor anterior detenido');
    
    // Iniciar el servidor nuevamente
    const server = spawn('npm', ['start'], {
      stdio: 'inherit',
      shell: true
    });
    
    // Esperar un momento y probar la API
    setTimeout(() => {
      testAPI();
    }, 5000);
  });
}

// Ejecutar el reinicio
restartServer(); 