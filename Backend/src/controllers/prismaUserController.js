const prisma = require('../../lib/prisma');
const { logDatabaseOperation, logAuth } = require('../middlewares/logger');
const { generateJWT } = require('../middlewares/auth');
const { hashPassword, verifyPassword } = require('../utils/encryption');
const { auditEvent, AUDIT_ACTIONS } = require('../middlewares/audit');

// Obtener todos los usuarios con paginación
exports.getAllUsers = async (req, res) => {
  const start = Date.now();
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    const skip = (page - 1) * limit;

    // Consulta con Prisma (más limpia y type-safe)
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        skip,
        take: limit,
        orderBy: { name: 'asc' },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          avatar: true,
          created_at: true,
          // Excluir password por seguridad
        }
      }),
      prisma.user.count()
    ]);

    const totalPages = Math.ceil(total / limit);

    logDatabaseOperation('SELECT', 'users', Date.now() - start, true);
    
    res.json({
      success: true,
      data: users,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: total,
        pageSize: limit,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1
      }
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'users', Date.now() - start, false, error);
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener usuarios',
      error: error.message 
    });
  }
};

// Obtener usuario por ID
exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        created_at: true,
        updated_at: true
      }
    });

    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

// Crear usuario
exports.createUser = async (req, res) => {
  const start = Date.now();
  try {
    const { firebase_uid, email, name, role, avatar, password } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebase_uid },
          { email }
        ]
      }
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'El usuario ya existe',
        errors: [{
          field: existingUser.firebase_uid === firebase_uid ? 'firebase_uid' : 'email',
          message: 'Ya existe un usuario con estos datos'
        }]
      });
    }

    // Hashear contraseña si se proporciona
    let hashedPassword = null;
    if (password) {
      hashedPassword = await hashPassword(password);
    }

    // Crear usuario con Prisma
    const user = await prisma.user.create({
      data: {
        firebase_uid,
        email,
        name,
        role: role || 'user',
        avatar,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        created_at: true
      }
    });
    
    // Generar JWT si se solicita
    let jwtToken = null;
    if (req.body.generateJWT) {
      const userData = { 
        id: user.id, 
        firebase_uid, 
        email, 
        name, 
        role: user.role 
      };
      jwtToken = generateJWT(userData);
    }
    
    logDatabaseOperation('INSERT', 'users', Date.now() - start, true);
    logAuth('create', user.id, true, req.ip, req.get('User-Agent'));
    
    // Registrar auditoría
    await auditEvent({
      userId: req.user?.userId || req.user?.firebase_uid,
      userEmail: req.user?.email,
      action: AUDIT_ACTIONS.CREATE,
      tableName: 'users',
      recordId: user.id,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent'),
      details: {
        newUserEmail: email,
        newUserRole: user.role
      }
    });
    
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: { 
        ...user,
        jwtToken 
      }
    });
  } catch (error) {
    logDatabaseOperation('INSERT', 'users', Date.now() - start, false, error);
    console.error('Error en createUser:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al crear usuario',
      error: error.message 
    });
  }
};

// Actualizar usuario
exports.updateUser = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    const { email, name, role, avatar, password } = req.body;
    
    // Obtener datos actuales para auditoría
    const oldUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { email: true, name: true, role: true, avatar: true }
    });

    if (!oldUser) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Preparar datos de actualización
    const updateData = {};
    if (email) updateData.email = email;
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (avatar !== undefined) updateData.avatar = avatar;
    
    // Hashear nueva contraseña si se proporciona
    if (password) {
      updateData.password = await hashPassword(password);
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        updated_at: true
      }
    });
    
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, true);
    
    // Registrar auditoría
    await auditEvent({
      userId: req.user?.userId || req.user?.firebase_uid,
      userEmail: req.user?.email,
      action: AUDIT_ACTIONS.UPDATE,
      tableName: 'users',
      recordId: parseInt(id),
      oldData: oldUser,
      newData: updatedUser,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: updatedUser
    });
  } catch (error) {
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, false, error);
    console.error('Error en updateUser:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al actualizar usuario',
      error: error.message 
    });
  }
};

// Eliminar usuario
exports.deleteUser = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    
    // Obtener datos del usuario para auditoría
    const userToDelete = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: { email: true, name: true, role: true }
    });

    if (!userToDelete) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });
    
    logDatabaseOperation('DELETE', 'users', Date.now() - start, true);
    
    // Registrar auditoría
    await auditEvent({
      userId: req.user?.userId || req.user?.firebase_uid,
      userEmail: req.user?.email,
      action: AUDIT_ACTIONS.DELETE,
      tableName: 'users',
      recordId: parseInt(id),
      oldData: userToDelete,
      ipAddress: req.ip,
      userAgent: req.get('User-Agent')
    });
    
    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    logDatabaseOperation('DELETE', 'users', Date.now() - start, false, error);
    console.error('Error en deleteUser:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al eliminar usuario',
      error: error.message 
    });
  }
};

// Obtener estadísticas de usuarios
exports.getUserStats = async (req, res) => {
  try {
    const [totalUsers, usersByRole, recentUsers] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: { role: true }
      }),
      prisma.user.findMany({
        take: 5,
        orderBy: { created_at: 'desc' },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          created_at: true
        }
      })
    ]);

    res.json({
      success: true,
      data: {
        totalUsers,
        usersByRole,
        recentUsers
      }
    });
  } catch (error) {
    console.error('Error en getUserStats:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message 
    });
  }
}; 