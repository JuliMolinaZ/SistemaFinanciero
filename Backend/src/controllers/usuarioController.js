const { PrismaClient } = require('@prisma/client');
const { logDatabaseOperation, logAuth } = require('../middlewares/logger');
const { generateJWT } = require('../middlewares/auth');
const { hashPassword, verifyPassword } = require('../utils/encryption');
const { auditEvent, AUDIT_ACTIONS } = require('../middlewares/audit');
const { verifyFirebaseToken } = require('../config/firebase');

// Inicializar Prisma Client
const prisma = new PrismaClient();

// Cache simple en memoria para optimizar consultas frecuentes
const userCache = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos

// Función para limpiar cache expirado
const cleanExpiredCache = () => {
  const now = Date.now();
  for (const [key, value] of userCache.entries()) {
    if (now - value.timestamp > CACHE_DURATION) {
      userCache.delete(key);
    }
  }
};

// Limpiar cache cada 10 minutos
setInterval(cleanExpiredCache, 10 * 60 * 1000);

// Función para obtener datos del cache
const getCachedData = (key) => {
  const cached = userCache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  return null;
};

// Función para guardar datos en cache
const setCachedData = (key, data) => {
  userCache.set(key, {
    data,
    timestamp: Date.now()
  });
};

// Función para invalidar cache
const invalidateCache = (pattern) => {
  for (const key of userCache.keys()) {
    if (key.includes(pattern)) {
      userCache.delete(key);
    }
  }
};

exports.getAllUsers = async (req, res) => {
  const start = Date.now();
  try {
    // Verificar cache primero
    const cacheKey = 'all_users';
    const cachedUsers = getCachedData(cacheKey);
    
    if (cachedUsers) {
      logDatabaseOperation('SELECT', 'users', Date.now() - start, true, 'CACHE_HIT');
      return res.json({
        success: true,
        data: cachedUsers,
        total: cachedUsers.length,
        fromCache: true,
        timestamp: new Date().toISOString()
      });
    }

    // Consulta con Prisma usando el NUEVO sistema de roles
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            is_active: true
          }
        }
      }
    });

    // Agregar status basado en updated_at y is_active
    // Y mantener compatibilidad con el frontend existente
    const usersWithStatus = users.map(user => ({
      ...user,
      // Mantener el campo role para compatibilidad con el frontend
      role: user.roles ? user.roles.name : user.role || 'Sin rol',
      // Agregar información del nuevo sistema de roles
      role_info: user.roles ? {
        id: user.roles.id,
        name: user.roles.name,
        description: user.roles.description,
        level: user.roles.level,
        is_active: user.roles.is_active
      } : null,
      status: user.is_active && user.updated_at && new Date(user.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'active' : 'inactive'
    }));

    // Guardar en cache
    setCachedData(cacheKey, usersWithStatus);
    
    logDatabaseOperation('SELECT', 'users', Date.now() - start, true);
    res.json({
      success: true,
      data: usersWithStatus,
      total: usersWithStatus.length,
      fromCache: false,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Error en getAllUsers:', error);
    logDatabaseOperation('SELECT', 'users', Date.now() - start, false, error.message);
    res.status(500).json({
      success: false,
      error: 'Error interno del servidor',
      details: error.message
    });
  }
};

exports.getUserById = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    
    // Verificar cache
    const cacheKey = `user_${id}`;
    const cachedUser = getCachedData(cacheKey);
    
    if (cachedUser) {
      logDatabaseOperation('SELECT', 'users', Date.now() - start, true, 'CACHE_HIT');
      return res.json({
        success: true,
        data: cachedUser,
        fromCache: true
      });
    }

    // Consulta con Prisma usando el NUEVO sistema de roles
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            is_active: true
          }
        }
      }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado' 
      });
    }

    // Agregar status y mantener compatibilidad con el frontend
    const userWithStatus = {
      ...user,
      // Mantener el campo role para compatibilidad con el frontend
      role: user.roles ? user.roles.name : user.role || 'Sin rol',
      // Agregar información del nuevo sistema de roles
      role_info: user.roles ? {
        id: user.roles.id,
        name: user.roles.name,
        description: user.roles.description,
        level: user.roles.level,
        is_active: user.roles.is_active
      } : null,
      status: user.updated_at && new Date(user.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'active' : 'inactive'
    };
    
    // Guardar en cache
    setCachedData(cacheKey, userWithStatus);
    
    logDatabaseOperation('SELECT', 'users', Date.now() - start, true);
    res.json({
      success: true,
      data: userWithStatus,
      fromCache: false
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'users', Date.now() - start, false, error);
    console.error('Error en getUserById:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

exports.getUserByFirebaseUid = async (req, res) => {
  const start = Date.now();
  try {
    const { firebase_uid } = req.params;

    // Verificar cache
    const cacheKey = `user_firebase_${firebase_uid}`;
    const cachedUser = getCachedData(cacheKey);
    
    if (cachedUser) {
      logDatabaseOperation('SELECT', 'users', Date.now() - start, true, 'CACHE_HIT');
      return res.json({
        success: true,
        data: cachedUser,
        fromCache: true
      });
    }

    // Consulta con Prisma usando el NUEVO sistema de roles
    const user = await prisma.user.findUnique({
      where: { firebase_uid },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            is_active: true
          }
        }
      }
    });
    
    if (!user) {

      // Si el usuario no existe, intentar buscar por email en el token Firebase
      const firebaseToken = req.headers['x-firebase-token'];
      if (firebaseToken) {
        try {
          const decodedToken = await verifyFirebaseToken(firebaseToken);
          const email = decodedToken.email;

          // Buscar usuario por email
          const userByEmail = await prisma.user.findFirst({
            where: { email: email.toLowerCase() },
            include: {
              roles: {
                select: {
                  id: true,
                  name: true,
                  description: true,
                  level: true,
                  is_active: true
                }
              }
            }
          });
          
          if (userByEmail) {

            // Actualizar Firebase UID, last_login y is_first_login
            // Solo actualizar last_login si han pasado más de 5 minutos
            const shouldUpdateLogin = !userByEmail.last_login || 
              (userByEmail.last_login && new Date() - new Date(userByEmail.last_login) > 5 * 60 * 1000);
            
            const updateData = {
              firebase_uid: firebase_uid,
              updated_at: new Date()
            };
            
            if (shouldUpdateLogin) {
              updateData.last_login = new Date();
              updateData.is_first_login = false;
            }
            
            const updatedUser = await prisma.user.update({
              where: { id: userByEmail.id },
              data: updateData,
              include: {
                roles: {
                  select: {
                    id: true,
                    name: true,
                    description: true,
                    level: true,
                    is_active: true
                  }
                }
              }
            });

            if (shouldUpdateLogin) {

            } else {

            }

            // Agregar status y mantener compatibilidad con el frontend
            const userWithStatus = {
              ...updatedUser,
              role: updatedUser.roles ? updatedUser.roles.name : updatedUser.role || 'Sin rol',
              role_info: updatedUser.roles ? {
                id: updatedUser.roles.id,
                name: updatedUser.roles.name,
                description: updatedUser.roles.description,
                level: updatedUser.roles.level,
                is_active: updatedUser.roles.is_active
              } : null,
              status: updatedUser.updated_at && new Date(updatedUser.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'active' : 'inactive'
            };
            
            // Guardar en cache
            setCachedData(cacheKey, userWithStatus);
            
            logDatabaseOperation('UPDATE', 'users', Date.now() - start, true, 'Firebase UID actualizado');
            return res.json({
              success: true,
              data: userWithStatus,
              fromCache: false,
              firebase_uid_updated: true
            });
          }
        } catch (firebaseError) {

        }
      }
      
      return res.status(404).json({ 
        success: false,
        message: 'Usuario no encontrado',
        error: 'USER_NOT_FOUND',
        firebase_uid: firebase_uid
      });
    }

    // Verificar si el usuario está activo
    if (!user.is_active) {

      return res.status(403).json({
        success: false,
        message: 'Usuario inactivo',
        error: 'USER_INACTIVE'
      });
    }

    // Actualizar last_login y is_first_login cuando se consulta el usuario
    // Solo actualizar si han pasado más de 5 minutos desde el último login
    // Esto evita actualizar constantemente el last_login
    const shouldUpdateLogin = !user.last_login || 
      (user.last_login && new Date() - new Date(user.last_login) > 5 * 60 * 1000);
    
    let updatedUser = user;
    
    if (shouldUpdateLogin) {
      updatedUser = await prisma.user.update({
        where: { firebase_uid },
        data: {
          last_login: new Date(),
          is_first_login: false
        },
        include: {
          roles: {
            select: {
              id: true,
              name: true,
              description: true,
              level: true,
              is_active: true
            }
          }
        }
      });

    } else {

    }

    // Agregar status y mantener compatibilidad con el frontend
    const userWithStatus = {
      ...updatedUser,
      // Mantener el campo role para compatibilidad con el frontend
      role: updatedUser.roles ? updatedUser.roles.name : updatedUser.role || 'Sin rol',
      // Agregar información del nuevo sistema de roles
      role_info: updatedUser.roles ? {
        id: updatedUser.roles.id,
        name: updatedUser.roles.name,
        description: updatedUser.roles.description,
        level: updatedUser.roles.level,
        is_active: updatedUser.roles.is_active
      } : null,
      status: updatedUser.updated_at && new Date(updatedUser.updated_at) >= new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) ? 'active' : 'inactive'
    };
    
    // Guardar en cache
    setCachedData(cacheKey, userWithStatus);

    logDatabaseOperation('SELECT', 'users', Date.now() - start, true);
    res.json({
      success: true,
      data: userWithStatus,
      fromCache: false
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'users', Date.now() - start, false, error);
    console.error('Error en getUserByFirebaseUid:', error);
    res.status(500).json({ 
      success: false,
      message: 'Error al obtener usuario',
      error: error.message 
    });
  }
};

exports.createUser = async (req, res) => {
  const start = Date.now();
  try {
    const { firebase_uid, email, name, role, avatar, password } = req.body;
    
    // Validación optimizada
    if (!firebase_uid || !email || !name) {
      return res.status(400).json({
        success: false,
        message: 'Datos requeridos faltantes',
        errors: [{
          field: !firebase_uid ? 'firebase_uid' : !email ? 'email' : 'name',
          message: 'Campo requerido'
        }]
      });
    }

    // Verificar si el usuario ya existe con Prisma
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
    const newUser = await prisma.user.create({
      data: {
        firebase_uid,
        email,
        name,
        role: role || 'usuario',
        avatar,
        password: hashedPassword
      },
      select: {
        id: true,
        firebase_uid: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        created_at: true,
        updated_at: true
      }
    });

    // Agregar status
    const userWithStatus = {
      ...newUser,
      status: 'active'
    };

    // Invalidar cache
    invalidateCache('all_users');
    invalidateCache('user_firebase_');

    // Log de auditoría
    await auditEvent(AUDIT_ACTIONS.CREATE, 'users', newUser.id, req.user?.id);

    logDatabaseOperation('INSERT', 'users', Date.now() - start, true);
    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: userWithStatus
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

exports.updateUser = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    // Verificar permisos del usuario que está haciendo la actualización
    const currentUserRole = req.user?.role || req.user?.roles?.name;
    const allowedEditRoles = ['Super Administrador', 'Gerente', 'Administrador'];
    
    if (!allowedEditRoles.includes(currentUserRole)) {
      logAuth('UPDATE_USER', req.user?.id, 'DENIED', 'Rol no autorizado para editar usuarios');
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para editar usuarios',
        requiredRole: 'Super Administrador, Gerente o Administrador'
      });
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: {
          select: { name: true, level: true }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificaciones adicionales de seguridad
    const targetUserRole = existingUser.roles?.name || existingUser.role;
    const targetUserLevel = existingUser.roles?.level || 999;

    // Solo Super Administradores pueden editar otros Super Administradores
    if (targetUserRole === 'Super Administrador' && currentUserRole !== 'Super Administrador') {
      logAuth('UPDATE_USER', req.user?.id, 'DENIED', 'Intento de editar Super Administrador sin permisos');
      return res.status(403).json({
        success: false,
        error: 'Solo Super Administradores pueden editar otros Super Administradores'
      });
    }

    // Usuarios no pueden editar usuarios de nivel superior
    const currentUserLevel = req.user?.roles?.level || 999;
    if (targetUserLevel < currentUserLevel) {
      logAuth('UPDATE_USER', req.user?.id, 'DENIED', 'Intento de editar usuario de nivel superior');
      return res.status(403).json({
        success: false,
        error: 'No puedes editar usuarios de nivel superior'
      });
    }

    // Preparar datos para actualización
    const updateFields = {};
    
    // Campos permitidos para actualización
    const allowedFields = ['name', 'email', 'is_active', 'role_id'];
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        updateFields[field] = updateData[field];
      }
    });

    // Agregar timestamp de actualización
    updateFields.updated_at = new Date();

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: updateFields,
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true,
            is_active: true
          }
        }
      }
    });

    // Preparar respuesta compatible con frontend
    const responseUser = {
      ...updatedUser,
      role: updatedUser.roles?.name || updatedUser.role || 'Sin rol',
      role_info: updatedUser.roles ? {
        id: updatedUser.roles.id,
        name: updatedUser.roles.name,
        description: updatedUser.roles.description,
        level: updatedUser.roles.level,
        is_active: updatedUser.roles.is_active
      } : null
    };

    // Log de auditoría
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, true, `Usuario ${id} actualizado`);
    logAuth('UPDATE_USER', req.user?.id, 'SUCCESS', `Usuario ${id} actualizado por ${currentUserRole}`);

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: responseUser
    });

  } catch (error) {
    console.error('Error al actualizar usuario:', error);
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: 'Error al actualizar usuario',
      details: error.message
    });
  }
};

exports.deleteUser = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    
    // Verificar permisos del usuario que está haciendo la eliminación
    const currentUserRole = req.user?.role || req.user?.roles?.name;
    const allowedDeleteRoles = ['Super Administrador', 'Gerente'];
    
    if (!allowedDeleteRoles.includes(currentUserRole)) {
      logAuth('DELETE_USER', req.user?.id, 'DENIED', 'Rol no autorizado para eliminar usuarios');
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para eliminar usuarios',
        requiredRole: 'Super Administrador o Gerente'
      });
    }

    // Verificar si el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: {
          select: { name: true, level: true }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificaciones adicionales de seguridad
    const targetUserRole = existingUser.roles?.name || existingUser.role;
    const targetUserLevel = existingUser.roles?.level || 999;

    // Solo Super Administradores pueden eliminar otros Super Administradores
    if (targetUserRole === 'Super Administrador' && currentUserRole !== 'Super Administrador') {
      logAuth('DELETE_USER', req.user?.id, 'DENIED', 'Intento de eliminar Super Administrador sin permisos');
      return res.status(403).json({
        success: false,
        error: 'Solo Super Administradores pueden eliminar otros Super Administradores'
      });
    }

    // Usuarios no pueden eliminar usuarios de nivel superior
    const currentUserLevel = req.user?.roles?.level || 999;
    if (targetUserLevel < currentUserLevel) {
      logAuth('DELETE_USER', req.user?.id, 'DENIED', 'Intento de eliminar usuario de nivel superior');
      return res.status(403).json({
        success: false,
        error: 'No puedes eliminar usuarios de nivel superior'
      });
    }

    // No permitir eliminación del propio usuario
    if (parseInt(id) === req.user?.id) {
      logAuth('DELETE_USER', req.user?.id, 'DENIED', 'Intento de eliminarse a sí mismo');
      return res.status(400).json({
        success: false,
        error: 'No puedes eliminarte a ti mismo'
      });
    }

    // Eliminar usuario
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    // Log de auditoría
    logDatabaseOperation('DELETE', 'users', Date.now() - start, true, `Usuario ${id} eliminado`);
    logAuth('DELETE_USER', req.user?.id, 'SUCCESS', `Usuario ${id} eliminado por ${currentUserRole}`);

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });

  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    logDatabaseOperation('DELETE', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: 'Error al eliminar usuario',
      details: error.message
    });
  }
};

// Nuevo endpoint para estadísticas de usuarios
exports.getUserStats = async (req, res) => {
  const start = Date.now();
  try {
    // Verificar cache
    const cacheKey = 'user_stats';
    const cachedStats = getCachedData(cacheKey);
    
    if (cachedStats) {
      logDatabaseOperation('SELECT', 'users_stats', Date.now() - start, true, 'CACHE_HIT');
      return res.json({
        success: true,
        data: cachedStats,
        fromCache: true
      });
    }

    // Consultas optimizadas para estadísticas con Prisma
    const totalUsers = await prisma.user.count();
    const activeUsers = await prisma.user.count({
      where: {
        updated_at: {
          gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        }
      }
    });
    const roleStats = await prisma.user.groupBy({
      by: ['role'],
      _count: {
        role: true
      }
    });
    const recentUsers = await prisma.user.count({
      where: {
        created_at: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    const stats = {
      total: totalUsers,
      active: activeUsers,
      recent: recentUsers,
      roles: roleStats.map(stat => ({
        role: stat.role,
        count: stat._count.role
      })),
      timestamp: new Date().toISOString()
    };

    // Guardar en cache
    setCachedData(cacheKey, stats);

    logDatabaseOperation('SELECT', 'users_stats', Date.now() - start, true);
    res.json({
      success: true,
      data: stats,
      fromCache: false
    });
  } catch (error) {
    logDatabaseOperation('SELECT', 'users_stats', Date.now() - start, false, error);
    console.error('Error en getUserStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener estadísticas',
      error: error.message
    });
  }
};

// Endpoint para limpiar cache manualmente
exports.clearCache = async (req, res) => {
  try {
    userCache.clear();
    res.json({
      success: true,
      message: 'Cache limpiado exitosamente',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error al limpiar cache:', error);
    res.status(500).json({
      success: false,
      message: 'Error al limpiar cache',
      error: error.message
    });
  }
};

// Función para descargar informe de usuarios (solo para roles autorizados)
exports.downloadUsersReport = async (req, res) => {
  const start = Date.now();
  try {
    // Verificar permisos del usuario
    const userRole = req.user?.role || req.user?.roles?.name;
    const allowedRoles = ['Super Administrador', 'Gerente', 'Administrador'];
    
    if (!allowedRoles.includes(userRole)) {
      logAuth('DOWNLOAD_USERS_REPORT', req.user?.id, 'DENIED', 'Rol no autorizado');
      return res.status(403).json({
        success: false,
        error: 'No tienes permisos para descargar este informe',
        requiredRole: 'Super Administrador, Gerente o Administrador'
      });
    }

    // Obtener todos los usuarios con información de roles
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' },
      include: {
        roles: {
          select: {
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    // Preparar datos para el informe
    const reportData = users.map(user => ({
      ID: user.id,
      Nombre: user.name || 'Sin nombre',
      Email: user.email || 'Sin email',
      Rol: user.roles?.name || user.role || 'Sin rol',
      Nivel_Rol: user.roles?.level || 'N/A',
      Descripción_Rol: user.roles?.description || 'N/A',
      Estado: user.is_active ? 'Activo' : 'Inactivo',
      Último_Login: user.last_login ? new Date(user.last_login).toLocaleString('es-CL') : 'Nunca',
      Intentos_Login: user.login_attempts || 0,
      Bloqueado_Hasta: user.locked_until ? new Date(user.locked_until).toLocaleString('es-CL') : 'No',
      Fecha_Creación: user.created_at ? new Date(user.created_at).toLocaleString('es-CL') : 'N/A',
      Última_Actualización: user.updated_at ? new Date(user.updated_at).toLocaleString('es-CL') : 'N/A'
    }));

    // Generar CSV
    const csvHeaders = Object.keys(reportData[0]).join(',');
    const csvRows = reportData.map(row => 
      Object.values(row).map(value => 
        typeof value === 'string' && value.includes(',') ? `"${value}"` : value
      ).join(',')
    );
    const csvContent = [csvHeaders, ...csvRows].join('\n');

    // Configurar headers para descarga
    const filename = `informe_usuarios_${new Date().toISOString().split('T')[0]}.csv`;
    
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Cache-Control', 'no-cache');

    // Enviar CSV
    res.send(csvContent);

    // Log de auditoría
    logDatabaseOperation('SELECT', 'users', Date.now() - start, true, 'REPORT_DOWNLOAD');
    logAuth('DOWNLOAD_USERS_REPORT', req.user?.id, 'SUCCESS', `Informe descargado: ${users.length} usuarios`);

  } catch (error) {
    console.error('Error al descargar informe de usuarios:', error);
    logDatabaseOperation('SELECT', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: 'Error al generar el informe',
      details: error.message
    });
  }
};

// Función para cerrar la conexión de Prisma
process.on('beforeExit', async () => {
  await prisma.$disconnect();
});
