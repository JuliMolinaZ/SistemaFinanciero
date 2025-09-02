#!/usr/bin/env node

const express = require('express');
const cors = require('cors');

console.log('🚀 Iniciando servidor de prueba...\n');

const app = express();
const PORT = 5001;

// Middlewares básicos
app.use(cors());
app.use(express.json());

// Ruta de prueba
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema Financiero API - Servidor de Prueba',
    status: 'OK',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString()
  });
});

// Ruta de información
app.get('/info', (req, res) => {
  res.json({
    name: 'Sistema Financiero API',
    description: 'API para gestión financiera y contable',
    version: '1.0.0',
    environment: 'test',
    database: 'MySQL + Prisma',
    features: [
      'Autenticación JWT + Firebase',
      'Gestión de usuarios y roles',
      'Gestión de clientes y proveedores',
      'Gestión de proyectos',
      'Cuentas por pagar y cobrar',
      'Contabilidad',
      'Logs de auditoría',
      'Sistema de seguridad'
    ]
  });
});

// Manejador de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message
  });
});

// Manejador de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`
  });
});

// Iniciar servidor
app.listen(PORT, () => {
  console.log('🎉 ¡Servidor de prueba iniciado exitosamente!');
  console.log(`📊 Información del servidor:`);
  console.log(`   🌐 URL: http://localhost:${PORT}`);
  console.log(`   🔧 Entorno: test`);
  console.log(`   📅 Fecha: ${new Date().toISOString()}`);
  console.log('\n📋 Endpoints disponibles:');
  console.log(`   🏠 Principal: http://localhost:${PORT}/`);
  console.log(`   💚 Salud: http://localhost:${PORT}/health`);
  console.log(`   ℹ️  Info: http://localhost:${PORT}/info`);
  console.log('\n⏹️  Para detener el servidor: Ctrl+C\n');
});

// Manejar señales de terminación
process.on('SIGINT', () => {
  console.log('\n🛑 Deteniendo servidor de prueba...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n🛑 Deteniendo servidor de prueba...');
  process.exit(0);
}); 