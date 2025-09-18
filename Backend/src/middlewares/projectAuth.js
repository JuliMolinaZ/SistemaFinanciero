const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Middleware de autenticación para project management
const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '') || req.headers['x-firebase-token'];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token de acceso requerido' 
      });
    }

    // Verificar token (simplificado para demo)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
    
    // Buscar usuario en la base de datos
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      include: {
        roles: true
      }
    });

    if (!user || !user.is_active) {
      return res.status(401).json({ 
        success: false, 
        message: 'Usuario no encontrado o inactivo' 
      });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    return res.status(401).json({ 
      success: false, 
      message: 'Token inválido' 
    });
  }
};

// Middleware para verificar permisos del módulo
const checkModulePermission = (module, permission = 'read') => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({ 
          success: false, 
          message: 'Usuario no autenticado' 
        });
      }

      // Verificar permisos del rol
      const rolePermissions = await prisma.rolePermissions.findFirst({
        where: {
          role_id: req.user.role_id,
          module: module
        }
      });

      if (!rolePermissions) {
        return res.status(403).json({ 
          success: false, 
          message: 'Sin permisos para acceder a este módulo' 
        });
      }

      // Verificar permiso específico
      const hasPermission = rolePermissions[`can_${permission}`];
      
      if (!hasPermission) {
        return res.status(403).json({ 
          success: false, 
          message: `Sin permisos para ${permission} en este módulo` 
        });
      }

      next();
    } catch (error) {
      console.error('Error verificando permisos:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Error interno del servidor' 
      });
    }
  };
};

module.exports = {
  authenticateUser,
  checkModulePermission
};