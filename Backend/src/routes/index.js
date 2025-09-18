const express = require('express');
const router = express.Router();

// Importar todas las rutas
const projectManagementRoutes = require('./projectManagement');
const userRoutes = require('./users');
const clientRoutes = require('./clients');

// Configurar rutas
router.use('/project-management', projectManagementRoutes);
router.use('/usuarios', userRoutes);
router.use('/clientes', clientRoutes);

// Ruta de salud del sistema
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Sistema funcionando correctamente',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

module.exports = router;