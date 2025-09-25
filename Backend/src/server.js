#!/usr/bin/env node

// Cargar variables de entorno
require('dotenv').config({ path: './config.env' });

const app = require('./app');
const config = require('./config/app');
const SimpleNotificationWebSocket = require('./websocket/simpleNotificationWebSocket');

// =====================================================
// CONFIGURACIÓN DEL SERVIDOR
// =====================================================

const PORT = config.server.port || 8766; // Usar puerto alternativo si 8765 está ocupado
const HOST = config.server.host;

// =====================================================
// INICIALIZACIÓN DEL SERVIDOR
// =====================================================

async function startServer() {
  try {

    // Iniciar servidor
    const server = app.listen(PORT, HOST, () => {

    });
    
    // Configurar timeout del servidor
    server.timeout = 30000; // 30 segundos
    
    // Inicializar WebSocket simple para notificaciones
    try {
      const notificationWS = new SimpleNotificationWebSocket(server);
      global.notificationWebSocket = notificationWS;

    } catch (wsError) {
      console.error('❌ Error inicializando WebSocket:', wsError);

    }
    
  } catch (error) {
    console.error('❌ Error iniciando el servidor:', error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer(); 