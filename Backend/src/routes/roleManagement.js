// routes/roleManagement.js - Rutas para gestión de roles y permisos
const express = require('express');
const router = express.Router();
const roleManagementController = require('../controllers/roleManagementController');

// =====================================================
// RUTAS PARA GESTIÓN DE ROLES
// =====================================================

// Obtener todos los roles del sistema
router.get('/roles', roleManagementController.getAllRoles);

// Obtener rol específico por ID
router.get('/roles/:id', roleManagementController.getRoleById);

// Crear nuevo rol
router.post('/roles', roleManagementController.createRole);

// Actualizar rol existente
router.put('/roles/:id', roleManagementController.updateRole);

// Eliminar rol
router.delete('/roles/:id', roleManagementController.deleteRole);

// =====================================================
// RUTAS PARA GESTIÓN DE PERMISOS
// =====================================================

// Obtener todos los módulos del sistema
router.get('/modules', roleManagementController.getAllModules);

// Obtener permisos de un rol específico
router.get('/roles/:roleId/permissions', roleManagementController.getRolePermissions);

// Actualizar permisos de un rol
router.put('/roles/:roleId/permissions', roleManagementController.updateRolePermissions);

// =====================================================
// RUTAS PARA VERIFICACIÓN DE PERMISOS
// =====================================================

// Obtener permisos del usuario actual (requiere autenticación)
router.get('/user/permissions', roleManagementController.getCurrentUserPermissions);

// Obtener permisos por Firebase UID (para frontend con Firebase Auth)
router.get('/user/firebase/:firebaseUid/permissions', roleManagementController.getUserPermissionsByFirebaseUID);

// Verificar permiso específico del usuario
router.get('/user/check-permission', roleManagementController.checkUserPermission);

module.exports = router;
