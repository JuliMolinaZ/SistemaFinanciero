const express = require('express');
const router = express.Router();
const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getUserStats
} = require('../controllers/prismaUserController');

// ========================================
// RUTAS DE USUARIOS
// ========================================

// Obtener todos los usuarios
router.get('/', getAllUsers);

// Obtener usuario por ID
router.get('/:id', getUserById);

// Crear nuevo usuario
router.post('/', createUser);

// Actualizar usuario
router.put('/:id', updateUser);

// Eliminar usuario
router.delete('/:id', deleteUser);

// Obtener estadísticas de usuarios
router.get('/stats/overview', getUserStats);

module.exports = router;
