// Script para probar la API de proveedores
const axios = require('axios');

async function testProveedoresAPI() {
  try {

    // Probar endpoint local
    const localResponse = await axios.get('http://localhost:8765/api/proveedores');

    } catch (statsError) {

    }

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

      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error en la ejecución del script:', error);
      process.exit(1);
    });
}

module.exports = { testProveedoresAPI };
