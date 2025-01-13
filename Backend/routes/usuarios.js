// routes/usuarios.js
const express = require('express');
const router = express.Router();
const usuarioController = require('../controllers/usuarioController');

// Rutas CRUD para usuarios
router.get('/', usuarioController.getAllUsers);
router.get('/firebase/:firebase_uid', usuarioController.getUserByFirebaseUid); // Obtener usuario por firebase_uid
router.get('/:id', usuarioController.getUserById);
router.post('/', usuarioController.createUser);
router.put('/:id', usuarioController.updateUser);
router.delete('/:id', usuarioController.deleteUser);

// Ruta para actualizar usuario por firebase_uid
router.put('/firebase/:firebase_uid', usuarioController.updateUserByFirebaseUid);

module.exports = router;