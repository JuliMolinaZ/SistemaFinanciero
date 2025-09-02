#!/usr/bin/env node

// Cargar variables de entorno
require('dotenv').config({ path: './config.env' });

const app = require('./src/app-fixed');
const config = require('./src/config/app');

// =====================================================
// CONFIGURACIÓN DEL SERVIDOR
// =====================================================

const PORT = config.server.port;
const HOST = config.server.host;

// =====================================================
// INICIALIZACIÓN DEL SERVIDOR
// =====================================================

async function startServer() {
  try {
    console.log('🚀 Iniciando Sistema Financiero API...\n');
    
    // Iniciar servidor
    const server = app.listen(PORT, HOST, () => {
      console.log('\n🎉 ¡Servidor iniciado exitosamente!');
      console.log('📊 Información del servidor:');
      console.log(`   🌐 URL: http://${HOST}:${PORT}`);
      console.log(`   🔧 Entorno: ${config.server.environment}`);
      console.log(`   📅 Fecha: ${new Date().toISOString()}`);
      console.log('\n📋 Endpoints disponibles:');
      console.log(`   🏠 Principal: http://${HOST}:${PORT}/`);
      console.log(`   💚 Salud: http://${HOST}:${PORT}/api/health`);
      console.log(`   ℹ️  Info: http://${HOST}:${PORT}/api/info`);
      console.log('\n⏹️  Para detener el servidor: Ctrl+C\n');
    });
    
    // Configurar timeout del servidor
    server.timeout = 30000; // 30 segundos
    
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer(); 