const jwt = require('jsonwebtoken');
const { verifyFirebaseToken, verifyFirebaseTokenAlternative } = require('../config/firebase');
const { logAuth } = require('./logger');

// Configuración JWT
const JWT_SECRET = process.env.JWT_SECRET || 'tu_jwt_secret_super_seguro_cambiar_en_produccion';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

// Middleware para verificar JWT
const verifyJWT = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token JWT requerido',
        errors: [{
          field: 'authorization',
          message: 'Header Authorization con Bearer token es requerido'
        }]
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    
    logAuth('jwt_verify', decoded.userId, true, req.ip, req.get('User-Agent'));
    next();
  } catch (error) {
    logAuth('jwt_verify', null, false, req.ip, req.get('User-Agent'));
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token JWT expirado',
        errors: [{
          field: 'token',
          message: 'El token ha expirado, inicie sesión nuevamente'
        }]
      });
    }
    
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Token JWT inválido',
        errors: [{
          field: 'token',
          message: 'El token proporcionado no es válido'
        }]
      });
    }

    return res.status(500).json({
      success: false,
      message: 'Error en verificación de token',
      errors: [{
        field: 'auth',
        message: 'Error interno en autenticación'
      }]
    });
  }
};

// Middleware para verificar Firebase + JWT (híbrido) - Soporta múltiples proyectos Firebase
const verifyAuth = async (req, res, next) => {
  try {
    // Primero intentar con JWT
    const jwtToken = req.headers.authorization?.replace('Bearer ', '');

    if (jwtToken) {
      try {
        const decoded = jwt.verify(jwtToken, JWT_SECRET);
        req.user = decoded;
        req.authType = 'jwt';
        logAuth('jwt_verify', decoded.userId, true, req.ip, req.get('User-Agent'));
        return next();
      } catch (jwtError) {
        // Si JWT falla, continuar con Firebase

      }
    }

    // Verificar Firebase token
    const firebaseToken = req.headers['x-firebase-token'] || req.headers.authorization?.replace('Bearer ', '');

    if (!firebaseToken) {
      return res.status(401).json({
        success: false,
        message: 'Token de autenticación requerido',
        errors: [{
          field: 'authorization',
          message: 'Se requiere token JWT o Firebase'
        }]
      });
    }

    try {
      const decodedToken = await verifyFirebaseToken(firebaseToken);
      req.user = {
        firebase_uid: decodedToken.uid,
        email: decodedToken.email,
        authType: 'firebase',
        firebase_project: decodedToken.aud // Guardar proyecto para referencia
      };
      req.authType = 'firebase';

      logAuth('firebase_verify', decodedToken.uid, true, req.ip, req.get('User-Agent'));
      next();
    } catch (firebaseError) {
      // 🔧 SOLUCIÓN TEMPORAL: Si el error es de audiencia, intentar con configuración alternativa
      if (firebaseError.message && firebaseError.message.includes('audience')) {

        try {
          // Intentar verificar con el proyecto anterior (authenticationrun)
          const altDecodedToken = await verifyFirebaseTokenAlternative(firebaseToken);

          req.user = {
            firebase_uid: altDecodedToken.uid,
            email: altDecodedToken.email,
            authType: 'firebase_legacy',
            firebase_project: altDecodedToken.aud
          };
          req.authType = 'firebase_legacy';

          logAuth('firebase_verify_legacy', altDecodedToken.uid, true, req.ip, req.get('User-Agent'));
          return next();

        } catch (altError) {

          logAuth('firebase_verify', null, false, req.ip, req.get('User-Agent'));
        }
      } else {
        logAuth('firebase_verify', null, false, req.ip, req.get('User-Agent'));
      }

      return res.status(401).json({
        success: false,
        message: 'Token de Firebase inválido',
        errors: [{
          field: 'firebase_token',
          message: 'El token de Firebase no es válido para ningún proyecto configurado'
        }]
      });
    }
  } catch (error) {
    console.error('Error en verificación de autenticación:', error);
    return res.status(500).json({
      success: false,
      message: 'Error en autenticación',
      errors: [{
        field: 'auth',
        message: 'Error interno en verificación de autenticación'
      }]
    });
  }
};

// Middleware para verificar roles específicos
const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Autenticación requerida',
        errors: [{
          field: 'auth',
          message: 'Debe estar autenticado para acceder a este recurso'
        }]
      });
    }

    const userRole = req.user.role || req.user.role;
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Acceso denegado',
        errors: [{
          field: 'permissions',
          message: `No tiene permisos para acceder a este recurso. Roles permitidos: ${allowedRoles.join(', ')}`
        }]
      });
    }

    next();
  };
};

// Función para generar JWT
const generateJWT = (userData) => {
  const payload = {
    userId: userData.id,
    email: userData.email,
    role: userData.role,
    firebase_uid: userData.firebase_uid,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
  };

  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// Función para renovar JWT
const refreshJWT = (req, res) => {
  try {
    const currentUser = req.user;
    
    if (!currentUser) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado',
        errors: [{
          field: 'auth',
          message: 'Debe estar autenticado para renovar el token'
        }]
      });
    }

    const newToken = generateJWT(currentUser);
    
    logAuth('jwt_refresh', currentUser.userId, true, req.ip, req.get('User-Agent'));
    
    res.json({
      success: true,
      message: 'Token renovado exitosamente',
      data: {
        token: newToken,
        expiresIn: JWT_EXPIRES_IN
      }
    });
  } catch (error) {
    console.error('Error renovando JWT:', error);
    res.status(500).json({
      success: false,
      message: 'Error renovando token',
      errors: [{
        field: 'auth',
        message: 'Error interno en renovación de token'
      }]
    });
  }
};

module.exports = {
  verifyJWT,
  verifyAuth,
  requireRole,
  generateJWT,
  refreshJWT,
  JWT_SECRET
}; 