// Backend/src/routes/permissions.js
// =====================================================
// RUTAS PARA CONFIGURAR PERMISOS
// =====================================================

const express = require('express');
const router = express.Router();
const {
  configureDevOperatorPermissions,
  getRolePermissions
} = require('../controllers/permissionsController');

// POST /api/permissions/configure-dev-operator - Configurar permisos para DESARROLLADOR y OPERADOR
router.post('/configure-dev-operator', configureDevOperatorPermissions);

// GET /api/permissions/role/:roleName - Obtener permisos de un rol específico
router.get('/role/:roleName', getRolePermissions);

module.exports = router;
