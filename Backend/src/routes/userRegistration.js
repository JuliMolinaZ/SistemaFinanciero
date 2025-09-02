// routes/userRegistration.js - Rutas para registro de usuarios por Super Admin
const express = require('express');
const router = express.Router();
const userRegistrationController = require('../controllers/userRegistrationController');

console.log('🚀 Cargando rutas de registro de usuarios...');
console.log('📋 Controlador cargado:', Object.keys(userRegistrationController));

// =====================================================
// RUTAS PARA SUPER ADMINISTRADOR
// =====================================================

// Registrar nuevo usuario (solo Super Admin)
router.post('/register', userRegistrationController.registerUserBySuperAdmin);

// Listar usuarios pendientes de completar perfil
router.get('/pending-profiles', userRegistrationController.getPendingProfileUsers);

// Obtener todos los usuarios
router.get('/all-users', userRegistrationController.getAllUsers);

// =====================================================
// RUTAS PARA USUARIOS
// =====================================================

// Verificar token de acceso
router.get('/verify-token/:token', userRegistrationController.verifyAccessToken);

// Verificar estado de perfil de usuario
router.get('/profile-status/:email', userRegistrationController.checkUserProfileStatus);

// Completar perfil de usuario (primera vez)
router.post('/complete-profile', userRegistrationController.upload.single('avatar'), userRegistrationController.completeUserProfile);

// Actualizar Firebase UID del usuario (cuando se registra en Firebase)
router.put('/update-firebase-uid/:email', userRegistrationController.updateUserFirebaseUID);

// =====================================================
// RUTAS PARA ADMINISTRACIÓN
// =====================================================

// Eliminar usuario invitado
router.delete('/delete-user/:id', userRegistrationController.deleteInvitedUser);

// Enviar email de invitación
router.post('/send-invitation/:userId', userRegistrationController.sendInvitationEmail);

// Actualizar usuario
router.put('/update-user/:id', userRegistrationController.updateUser);

// Descargar informe de usuarios
router.get('/download/report', userRegistrationController.downloadUsersReport);

module.exports = router;
