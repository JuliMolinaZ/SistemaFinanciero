// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');
const { validateWithJoi, validateId } = require('../middlewares/validation');
const { userSchemas } = require('../validations/schemas');

// Rutas CRUD para usuarios
router.get('/', usuarioController.getAllUsers);
router.get('/firebase/:firebase_uid', usuarioController.getUserByFirebaseUid); // Obtener usuario por firebase_uid

// Ruta para descargar informe de usuarios (solo roles autorizados)
router.get('/download/report', usuarioController.downloadUsersReport);

// Ruta para obtener usuario por ID (DEBE IR AL FINAL)
router.get('/:id', validateId, usuarioController.getUserById);
router.post('/', validateWithJoi(userSchemas.create), usuarioController.createUser);
router.put('/:id', validateId, validateWithJoi(userSchemas.update), usuarioController.updateUser);
router.delete('/:id', validateId, usuarioController.deleteUser);

// Ruta para actualizar usuario por firebase_uid
// router.put('/firebase/:firebase_uid', validateWithJoi(userSchemas.update), usuarioController.updateUserByFirebaseUid);

module.exports = router;
