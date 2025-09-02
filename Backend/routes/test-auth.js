const express = require('express');
const router = express.Router();

// Endpoint para probar errores 401
router.get('/test-401', (req, res) => {
  console.log('🧪 TEST ENDPOINT: Enviando error 401 simulado');
  res.status(401).json({
    success: false,
    message: 'Token JWT expirado',
    errors: [{
      field: 'token',
      message: 'El token ha expirado, inicie sesión nuevamente'
    }]
  });
});

// Endpoint para probar usuario no encontrado
router.get('/test-404', (req, res) => {
  console.log('🧪 TEST ENDPOINT: Enviando error 404 usuario no encontrado');
  res.status(404).json({
    success: false,
    message: 'Usuario no encontrado',
    errors: [{
      field: 'user',
      message: 'El usuario especificado no existe en el sistema'
    }]
  });
});

// Endpoint para probar error de servidor
router.get('/test-500', (req, res) => {
  console.log('🧪 TEST ENDPOINT: Enviando error 500 de servidor');
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    errors: [{
      field: 'server',
      message: 'Error interno en el servidor'
    }]
  });
});

module.exports = router;