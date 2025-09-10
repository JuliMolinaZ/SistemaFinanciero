// server-clean.js - Servidor limpio y funcional
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

console.log('🚀 Iniciando servidor limpio...');

// CORS más básico y permisivo
app.use(cors({
  origin: true,
  credentials: true,
  optionsSuccessStatus: 200
}));

app.use(bodyParser.json());
app.use(express.json());

// Health check
app.get('/api/health', (req, res) => {
  console.log('✅ Health check llamado');
  res.json({ 
    status: 'ok', 
    message: 'Servidor funcionando correctamente',
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 8765
  });
});

// Test endpoint
app.get('/test', (req, res) => {
  console.log('✅ Test endpoint llamado');
  res.json({ message: 'Test endpoint works!' });
});

// Importar y configurar rutas principales
try {
  const flowRecoveryV2Routes = require('./src/routes/flowRecoveryV2');
  app.use('/api/flowRecoveryV2', flowRecoveryV2Routes);
  console.log('✅ flowRecoveryV2 routes loaded');
} catch (error) {
  console.log('⚠️ flowRecoveryV2 routes not loaded:', error.message);
}

try {
  const authRoutes = require('./src/routes/auth');
  app.use('/api/auth', authRoutes);
  console.log('✅ auth routes loaded');
} catch (error) {
  console.log('⚠️ auth routes not loaded:', error.message);
}

try {
  const usuariosRoutes = require('./src/routes/usuarios');
  app.use('/api/usuarios', usuariosRoutes);
  console.log('✅ usuarios routes loaded');
} catch (error) {
  console.log('⚠️ usuarios routes not loaded:', error.message);
}

// Middleware de logging
app.use((req, res, next) => {
  console.log(`📍 ${req.method} ${req.path} - Origin: ${req.headers.origin || 'No origin'}`);
  next();
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('🚨 ERROR:', err.message);
  console.error('Stack:', err.stack);
  res.status(500).json({ error: 'Error en el servidor' });
});

const PORT = process.env.PORT || 8765;
app.listen(PORT, () => {
  console.log(`🎯 Servidor limpio corriendo en puerto ${PORT}`);
});