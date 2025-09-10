// server-minimal.js - Servidor ultra minimalista
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

console.log('🔥 Servidor ULTRA MINIMALISTA iniciando...');

// CORS ultra permisivo
app.use(cors({
  origin: true,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Origin', 'X-Requested-With', 'Accept'],
  optionsSuccessStatus: 200
}));

app.use(express.json());

// Middleware de logging ANTES de las rutas
app.use((req, res, next) => {
  console.log(`🔍 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// Endpoints básicos sin dependencias externas
app.get('/api/health', (req, res) => {
  console.log('✅ Health endpoint ejecutado correctamente');
  res.status(200).json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8765,
    cors: 'enabled'
  });
});

app.get('/test', (req, res) => {
  console.log('✅ Test endpoint ejecutado correctamente');
  res.status(200).json({ 
    message: 'Test endpoint funciona perfectamente!',
    headers: req.headers,
    timestamp: new Date().toISOString()
  });
});

// Endpoint de prueba POST
app.post('/api/test', (req, res) => {
  console.log('✅ POST test endpoint ejecutado');
  res.status(200).json({ 
    message: 'POST funciona correctamente',
    body: req.body,
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  console.log(`❌ 404 - Ruta no encontrada: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ 
    error: 'Ruta no encontrada',
    path: req.originalUrl,
    method: req.method
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🚨 ERROR CAPTURADO:');
  console.error('Message:', err.message);
  console.error('Stack:', err.stack);
  console.error('URL:', req.url);
  console.error('Method:', req.method);
  console.error('Headers:', req.headers);
  
  res.status(500).json({ 
    error: 'Error interno del servidor',
    message: err.message,
    url: req.url 
  });
});

const PORT = process.env.PORT || 5555;

const server = app.listen(PORT, () => {
  console.log(`🎯 Servidor ULTRA MINIMALISTA corriendo en puerto ${PORT}`);
  console.log(`📍 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📍 Test endpoint: http://localhost:${PORT}/test`);
});

// Handle server errors
server.on('error', (error) => {
  console.error('🚨 Server error:', error);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('🚨 Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('🚨 Uncaught Exception:', error);
  process.exit(1);
});