// controllers/userRegistrationController.js - Controlador para registro de usuarios por Super Admin
const { PrismaClient } = require('@prisma/client');
const { logDatabaseOperation, logAuth } = require('../middlewares/logger');
const { auditEvent, AUDIT_ACTIONS } = require('../middlewares/audit');
const { verifyFirebaseToken } = require('../config/firebase');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const prisma = new PrismaClient();

// Configuración de multer para subida de archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../uploads/avatars');
    // Crear directorio si no existe
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Generar nombre único para el archivo
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, 'avatar-' + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB máximo
  },
  fileFilter: function (req, file, cb) {
    // Solo permitir imágenes
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos de imagen'), false);
    }
  }
});

// Middleware para manejar errores de multer
const handleMulterError = (error, req, res, next) => {

  if (error instanceof multer.MulterError) {

    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'El archivo es demasiado grande. Máximo 5MB'
      });
    } else if (error.code === 'LIMIT_UNEXPECTED_FILE') {
      return res.status(400).json({
        success: false,
        message: 'Campo de archivo inesperado'
      });
    } else if (error.code === 'LIMIT_FILE_COUNT') {
      return res.status(400).json({
        success: false,
        message: 'Demasiados archivos'
      });
    } else {
      return res.status(400).json({
        success: false,
        message: `Error de archivo: ${error.message}`
      });
    }
  } else if (error.message === 'Solo se permiten archivos de imagen') {
    return res.status(400).json({
      success: false,
      message: 'Solo se permiten archivos de imagen (JPG, PNG, GIF, WebP)'
    });
  }

  next(error);
};

// =====================================================
// REGISTRO DE USUARIO POR SUPER ADMINISTRADOR
// =====================================================

exports.registerUserBySuperAdmin = async (req, res) => {
  const start = Date.now();
  try {

    const { email, role_id } = req.body;
    
    // Validaciones básicas
    if (!email || !role_id) {
      return res.status(400).json({
        success: false,
        message: 'Email y rol son requeridos'
      });
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Formato de email inválido'
      });
    }

    // Verificar que el rol existe
    const roleExists = await prisma.roles.findUnique({
      where: { id: parseInt(role_id) }
    });

    if (!roleExists) {
      return res.status(400).json({
        success: false,
        message: 'El rol especificado no existe'
      });
    }

    // Verificar que el email no esté ya registrado
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'El email ya está registrado en el sistema'
      });
    }

    // Crear el usuario con datos mínimos
    const newUser = await prisma.user.create({
      data: {
        email: email.trim().toLowerCase(),
        role_id: parseInt(role_id),
        role: roleExists.name, // Mantener compatibilidad
        is_active: true,
        is_first_login: true,
        profile_complete: false,
        // NO generar Firebase UID falso - dejar null para que se actualice después
        firebase_uid: null,
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    // Registrar en auditoría (opcional)
    try {
      await auditEvent({
        userId: req.user?.id || null,
        userEmail: req.user?.email || 'system@admin',
        action: AUDIT_ACTIONS.CREATE,
        tableName: 'users',
        recordId: newUser.id,
        details: {
          action: 'Usuario registrado por Super Admin',
          email: newUser.email,
          role: roleExists.name
        }
      });
    } catch (auditError) {

    }

    // Enviar email de invitación automáticamente usando el nuevo servicio
    try {

      // Generar token de acceso temporal
      const accessToken = require('crypto').randomBytes(32).toString('hex');
      const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

      // Guardar token en la base de datos
      await prisma.user.update({
        where: { id: newUser.id },
        data: {
          access_token: accessToken,
          token_expiry: tokenExpiry,
          updated_at: new Date()
        }
      });

      // Usar el nuevo servicio de notificaciones
      const { sendUserInvitationNotification } = require('../services/userNotificationService');
      
      // Obtener información del usuario que invita
      const invitedBy = req.user ? {
        name: req.user.name || 'Administrador',
        email: req.user.email || 'admin@runsolutions-services.com'
      } : {
        name: 'Administrador del Sistema',
        email: 'admin@runsolutions-services.com'
      };

      // Enviar notificación usando el nuevo servicio
      await sendUserInvitationNotification(newUser, invitedBy);

    } catch (emailError) {

    }

    // Log de operación
    logDatabaseOperation('INSERT', 'users', Date.now() - start, true, 'Usuario registrado por Super Admin');

    res.status(201).json({
      success: true,
      data: {
        id: newUser.id,
        email: newUser.email,
        role: newUser.roles?.name || 'Sin rol',
        is_active: newUser.is_active,
        is_first_login: newUser.is_first_login,
        profile_complete: newUser.profile_complete,
        created_at: newUser.created_at
      },
      message: 'Usuario registrado exitosamente. Se ha enviado un email de invitación para completar el perfil.'
    });

  } catch (error) {
    console.error('❌ Error al registrar usuario:', error);
    
    // Log de error
    logDatabaseOperation('INSERT', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al registrar usuario'
    });
  }
};

// =====================================================
// VERIFICAR TOKEN DE ACCESO
// =====================================================

exports.verifyAccessToken = async (req, res) => {
  try {
    const { token } = req.params;

    // Buscar usuario con el token
    const user = await prisma.user.findFirst({
      where: {
        access_token: token,
        token_expiry: {
          gte: new Date() // Token no expirado
        }
      },
      include: {
        roles: true
      }
    });
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        department: user.department,
        position: user.position,
        hire_date: user.hire_date,
        roles: user.roles,
        firebase_uid: user.firebase_uid,
        profile_complete: user.profile_complete,
        is_first_login: user.is_first_login
      }
    });
    
  } catch (error) {
    console.error('❌ Error verificando token:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// =====================================================
// VERIFICAR USUARIO POR FIREBASE UID O EMAIL
// =====================================================

exports.verifyUserByFirebaseOrEmail = async (req, res) => {
  try {
    const { identifier } = req.params; // Puede ser firebase_uid o email

    // Buscar usuario por firebase_uid o email
    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { firebase_uid: identifier },
          { email: identifier }
        ]
      },
      include: {
        roles: true
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
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        phone: user.phone,
        department: user.department,
        position: user.position,
        hire_date: user.hire_date,
        roles: user.roles,
        firebase_uid: user.firebase_uid,
        profile_complete: user.profile_complete,
        is_first_login: user.is_first_login,
        is_active: user.is_active
      }
    });
    
  } catch (error) {
    console.error('❌ Error verificando usuario:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor'
    });
  }
};

// =====================================================
// COMPLETAR PERFIL DE USUARIO (PRIMERA VEZ)
// =====================================================

exports.completeUserProfile = async (req, res) => {
  const start = Date.now();
  try {

    const { token } = req.params;
    const {
      name,
      password,
      phone,
      phone_country_code,
      department,
      position,
      hire_date,
      birth_date,
      firebase_uid
    } = req.body;
    
    // Manejar la imagen si se subió
    let avatarPath = null;
    if (req.files && req.files.avatar) {
      const avatarFile = req.files.avatar;
      avatarPath = `/uploads/avatars/${avatarFile.filename}`;

    }

    // Validaciones básicas
    if (!name || !password) {
      return res.status(400).json({
        success: false,
        message: 'Nombre y contraseña son requeridos'
      });
    }

    // Verificar que el usuario existe y es su primera vez usando el token
    const existingUser = await prisma.user.findFirst({
      where: {
        access_token: token,
        token_expiry: {
          gte: new Date() // Token no expirado
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Token inválido o expirado'
      });
    }

    if (!existingUser.is_first_login) {
      return res.status(400).json({
        success: false,
        message: 'Este usuario ya completó su perfil anteriormente'
      });
    }

    // Hash de la contraseña
    const bcrypt = require('bcryptjs');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Validar y procesar la fecha de contratación
    let processedHireDate = null;
    if (hire_date && hire_date.trim() !== '') {
      const date = new Date(hire_date);
      if (!isNaN(date.getTime())) {
        processedHireDate = date;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Formato de fecha de contratación inválido'
        });
      }
    }

    // Validar y procesar la fecha de nacimiento
    let processedBirthDate = null;
    if (birth_date && birth_date.trim() !== '') {
      const date = new Date(birth_date);
      if (!isNaN(date.getTime())) {
        // Validar que la edad esté entre 16 y 80 años
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        if (age < 16 || age > 80) {
          return res.status(400).json({
            success: false,
            message: 'La edad debe estar entre 16 y 80 años'
          });
        }
        processedBirthDate = date;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Formato de fecha de nacimiento inválido'
        });
      }
    }

    // Usar el Firebase UID enviado por el frontend si está disponible

    // Verificar si el perfil está completo (todos los campos requeridos)
    const isProfileComplete = name?.trim() &&
                               phone?.trim() &&
                               phone_country_code?.trim() &&
                               department?.trim() &&
                               position?.trim() &&
                               processedBirthDate;

    // Solo actualizar Firebase UID si se proporciona uno real
    let updateData = {
      name: name.trim(),
      password: hashedPassword,
      phone: phone?.trim(),
      phone_country_code: phone_country_code?.trim(),
      department: department?.trim(),
      position: position?.trim(),
      hire_date: processedHireDate,
      birth_date: processedBirthDate,
      avatar: avatarPath,
      is_first_login: false,
      profile_complete: isProfileComplete,
      is_active: true,
      updated_at: new Date()
    };

    // Solo incluir firebase_uid si se proporciona un UID real de Firebase
    if (firebase_uid && !firebase_uid.startsWith('temp_') && !firebase_uid.startsWith('user_')) {
      updateData.firebase_uid = firebase_uid;

    } else {

    }

    // Actualizar el usuario usando el ID del usuario encontrado por token
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: updateData,
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    // Registrar en auditoría
    await auditEvent({
      userId: req.user?.id || null,
      userEmail: req.user?.email || 'system@admin',
      action: AUDIT_ACTIONS.UPDATE,
      tableName: 'users',
      recordId: updatedUser.id,
      details: {
        action: 'Perfil de usuario completado',
        email: updatedUser.email,
        profile_completed: true
      }
    });

    // Log de operación
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, true, 'Perfil de usuario completado');

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        role: updatedUser.roles?.name || 'Sin rol',
        is_active: updatedUser.is_active,
        profile_complete: updatedUser.profile_complete,
        updated_at: updatedUser.updated_at
      },
      message: 'Perfil completado exitosamente. Ya puedes acceder al sistema.'
    });

  } catch (error) {
    console.error('❌ Error al completar perfil:', error);
    
    // Log de error
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al completar perfil'
    });
  }
};

// =====================================================
// VERIFICAR ESTADO DE PERFIL DE USUARIO
// =====================================================

exports.checkUserProfileStatus = async (req, res) => {
  try {
    const { email } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() },
      select: {
        id: true,
        email: true,
        name: true,
        is_first_login: true,
        profile_complete: true,
        is_active: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true
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

    res.json({
      success: true,
      data: {
        id: user.id,
        email: user.email,
        name: user.name,
        is_first_login: user.is_first_login,
        profile_complete: user.profile_complete,
        is_active: user.is_active,
        role: user.roles?.name || 'Sin rol asignado',
        needs_profile_completion: user.is_first_login || !user.profile_complete,
        has_role: !!user.roles
      }
    });

  } catch (error) {
    console.error('❌ Error al verificar estado de perfil:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al verificar estado de perfil'
    });
  }
};

// =====================================================
// LISTAR USUARIOS PENDIENTES DE COMPLETAR PERFIL
// =====================================================

exports.getPendingProfileUsers = async (req, res) => {
  try {
    // Obtener TODOS los usuarios activos primero
    const allUsers = await prisma.user.findMany({
      where: {
        is_active: true
      },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        is_first_login: true,
        profile_complete: true,
        phone: true,
        department: true,
        position: true,
        firebase_uid: true,
        roles: {
          select: {
            id: true,
            name: true,
            description: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    // Filtrar usuarios que realmente necesiten completar perfil
    // Usar la misma lógica que el frontend para determinar perfil completo
    const pendingUsers = allUsers.filter(user => {
      // Determinar si el perfil está completo usando la misma lógica del frontend
      const hasName = user.name && user.name.trim() !== '';
      const hasEmail = user.email && user.email.trim() !== '';
      const hasPhone = user.phone && user.phone.trim() !== '';
      
      // Un perfil se considera completo si tiene al menos nombre, email y teléfono
      const isProfileComplete = hasName && hasEmail && hasPhone;
      
      // Solo mostrar usuarios que NO tienen perfil completo
      return !isProfileComplete;
    });

    res.json({
      success: true,
      data: pendingUsers,
      total: pendingUsers.length,
      message: 'Usuarios pendientes de completar perfil obtenidos exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al obtener usuarios pendientes:', error);
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener usuarios pendientes'
    });
  }
};

// =====================================================
// ELIMINAR USUARIO INVITADO
// =====================================================

exports.deleteInvitedUser = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    
    // Verificar que el usuario existe y es un usuario invitado
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: {
          select: {
            name: true
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

    // Permitir eliminar cualquier usuario (con confirmación del Super Admin)
    // Solo verificar que no sea el último Super Admin
    if (user.roles?.name === 'Super Administrador') {
      const superAdminCount = await prisma.user.count({
        where: {
          roles: {
            name: 'Super Administrador'
          }
        }
      });
      
      if (superAdminCount <= 1) {
        return res.status(400).json({
          success: false,
          message: 'No se puede eliminar el último Super Administrador del sistema'
        });
      }
    }

    // Eliminar el usuario
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    // Registrar en auditoría (opcional)
    try {
      await auditEvent({
        userId: req.user?.id || null,
        userEmail: req.user?.email || 'system@admin',
        action: AUDIT_ACTIONS.DELETE,
        tableName: 'users',
        recordId: user.id,
        details: {
          action: 'Usuario invitado eliminado',
          email: user.email,
          role: user.roles?.name || 'Sin rol'
        }
      });
    } catch (auditError) {

    }

    // Log de operación
    logDatabaseOperation('DELETE', 'users', Date.now() - start, true, 'Usuario invitado eliminado');

    res.json({
      success: true,
      message: 'Usuario invitado eliminado exitosamente',
      data: {
        email: user.email,
        role: user.roles?.name || 'Sin rol'
      }
    });

  } catch (error) {
    console.error('❌ Error al eliminar usuario invitado:', error);
    
    // Log de error
    logDatabaseOperation('DELETE', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al eliminar usuario invitado'
    });
  }
};

// =====================================================
// ENVIAR EMAIL DE INVITACIÓN
// =====================================================

exports.sendInvitationEmail = async (req, res) => {
  const start = Date.now();
  try {
    const { userId } = req.params;
    
    // Obtener información del usuario
    const user = await prisma.user.findUnique({
      where: { id: parseInt(userId) },
      include: {
        roles: {
          select: {
            name: true,
            description: true
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

    // Generar token de acceso temporal
    const accessToken = require('crypto').randomBytes(32).toString('hex');
    const tokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 horas

    // Guardar token en la base de datos
    await prisma.user.update({
      where: { id: user.id },
      data: {
        access_token: accessToken,
        token_expiry: tokenExpiry,
        updated_at: new Date()
      }
    });

    // Configurar email de invitación
    const emailData = {
      to: user.email,
      subject: '🎉 ¡Bienvenido a RunSolutions! Tu cuenta está lista',
      html: `
        <!DOCTYPE html>
        <html lang="es">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bienvenido a RunSolutions</title>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 25px; margin: 20px 0; font-weight: bold; }
            .info-box { background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #667eea; }
            .role-badge { display: inline-block; background: #f39c12; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: bold; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 14px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚀 ¡Bienvenido a RunSolutions!</h1>
              <p>Sistema Integral de Gestión y Manejo Administrativo</p>
            </div>
            
            <div class="content">
              <h2>¡Tu cuenta ha sido creada exitosamente!</h2>
              
              <div class="info-box">
                <h3>📧 Información de tu cuenta:</h3>
                <p><strong>Email:</strong> ${user.email}</p>
                <p><strong>Rol asignado:</strong> <span class="role-badge">${user.roles?.name || 'Sin rol'}</span></p>
                <p><strong>Descripción del rol:</strong> ${user.roles?.description || 'Sin descripción'}</p>
              </div>
              
              <h3>🔐 Cómo acceder a tu cuenta:</h3>
              <ol>
                <li><strong>Haz clic en el botón de acceso</strong> que aparece más abajo</li>
                <li><strong>Completa tu perfil</strong> con tu información personal</li>
                <li><strong>Establece tu contraseña</strong> para futuros accesos</li>
                <li><strong>¡Listo!</strong> Ya puedes usar el sistema</li>
              </ol>
              
              <div style="text-align: center;">
                <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/complete-profile/${accessToken}" class="button">
                  🚀 Completar Mi Perfil y Acceder
                </a>
              </div>
              
              <div class="info-box">
                <h3>⚠️ Importante:</h3>
                <ul>
                  <li>Este enlace es válido por <strong>24 horas</strong></li>
                  <li>Si no puedes acceder, contacta al administrador</li>
                  <li>Tu contraseña será solicitada en el primer acceso</li>
                </ul>
              </div>
              
              <div class="footer">
                <p>Este es un email automático del sistema RunSolutions</p>
                <p>Si tienes dudas, contacta a tu administrador</p>
              </div>
            </div>
          </div>
        </body>
        </html>
      `
    };

    // Enviar email (simulado por ahora)

    // TODO: Integrar con servicio de email real (SendGrid, AWS SES, etc.)
    // await sendEmail(emailData);

    res.json({
      success: true,
      message: 'Email de invitación enviado exitosamente',
      data: {
        email: user.email,
        accessToken,
        tokenExpiry,
        accessLink: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/complete-profile/${accessToken}`
      }
    });

  } catch (error) {
    console.error('❌ Error al enviar email de invitación:', error);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al enviar email de invitación'
    });
  }
};

// =====================================================
// OBTENER TODOS LOS USUARIOS
// =====================================================

exports.getAllUsers = async (req, res) => {
  const start = Date.now();
  try {

    // Obtener todos los usuarios con información de roles
    const users = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Transformar los datos para el frontend
    const transformedUsers = users.map(user => ({
      ...user,
      status: user.is_active ? 'active' : 'inactive', // Convertir is_active a status
      role: user.roles?.name || 'Sin rol' // Asegurar que role esté disponible
    }));

    // Log de operación
    logDatabaseOperation('GET', 'all_users', Date.now() - start, true, `${transformedUsers.length} usuarios obtenidos`);
    
    res.json({
      success: true,
      message: 'Usuarios obtenidos exitosamente',
      data: transformedUsers
    });
    
  } catch (error) {
    console.error('❌ Error al obtener usuarios:', error);
    
    // Log de error
    logDatabaseOperation('GET', 'all_users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al obtener usuarios'
    });
  }
};

// =====================================================
// ACTUALIZAR USUARIO
// =====================================================

exports.updateUser = async (req, res) => {
  const start = Date.now();
  try {
    const { id } = req.params;
    const updateData = req.body;

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) },
      include: {
        roles: {
          select: {
            name: true
          }
        }
      }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Transformar el campo status a is_active si está presente
    const transformedUpdateData = { ...updateData };
    if ('status' in transformedUpdateData) {
      transformedUpdateData.is_active = transformedUpdateData.status === 'active';
      delete transformedUpdateData.status; // Eliminar el campo status ya que no existe en la BD
    }

    // Validar y limpiar campos de fecha
    if ('hire_date' in transformedUpdateData) {
      const hireDate = transformedUpdateData.hire_date;
      if (hireDate && hireDate.trim() !== '') {
        // Validar que sea una fecha válida
        const date = new Date(hireDate);
        if (isNaN(date.getTime())) {
          return res.status(400).json({
            success: false,
            message: 'Formato de fecha de contratación inválido'
          });
        }
        transformedUpdateData.hire_date = date;
      } else {
        // Si está vacío, establecer como null
        transformedUpdateData.hire_date = null;
      }
    }

    // Actualizar el usuario
    const updatedUser = await prisma.user.update({
      where: { id: parseInt(id) },
      data: transformedUpdateData,
      include: {
        roles: {
          select: {
            name: true,
            description: true
          }
        }
      }
    });

    // Transformar la respuesta para el frontend
    const transformedUser = {
      ...updatedUser,
      status: updatedUser.is_active ? 'active' : 'inactive',
      role: updatedUser.roles?.name || 'Sin rol'
    };

    // Registrar en auditoría
    try {
      await auditEvent({
        userId: req.user?.id || null,
        userEmail: req.user?.email || 'system@admin',
        action: AUDIT_ACTIONS.UPDATE,
        tableName: 'users',
        recordId: updatedUser.id,
        details: {
          action: 'Usuario actualizado',
          email: updatedUser.email,
          changes: updateData
        }
      });
    } catch (auditError) {

    }

    // Log de operación
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, true, 'Usuario actualizado');

    res.json({
      success: true,
      message: 'Usuario actualizado exitosamente',
      data: transformedUser
    });

  } catch (error) {
    console.error('❌ Error al actualizar usuario:', error);
    
    // Log de error
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al actualizar usuario'
    });
  }
};

// =====================================================
// DESCARGAR INFORME DE USUARIOS
// =====================================================

exports.downloadUsersReport = async (req, res) => {
  const start = Date.now();
  try {

    // Obtener todos los usuarios con información de roles
    const users = await prisma.user.findMany({
      include: {
        roles: {
          select: {
            name: true,
            description: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    // Generar CSV
    let csvContent = 'ID,Email,Nombre,Apellido,Rol,Estado del Perfil,Fecha de Registro,Último Acceso\n';
    
    users.forEach(user => {
      const row = [
        user.id,
        user.email || '',
        user.name || '',
        user.last_name || '',
        user.roles?.name || 'Sin rol',
        user.profile_complete ? 'Completado' : 'Pendiente',
        user.created_at ? new Date(user.created_at).toLocaleDateString('es-ES') : '',
        user.last_login ? new Date(user.last_login).toLocaleDateString('es-ES') : ''
      ].map(field => `"${field}"`).join(',');
      
      csvContent += row + '\n';
    });

    // Configurar headers para descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename="informe_usuarios_${new Date().toISOString().split('T')[0]}.csv"`);

    // Log de operación
    logDatabaseOperation('GET', 'users_report', Date.now() - start, true, `Informe descargado con ${users.length} usuarios`);
    
    res.send(csvContent);
    
  } catch (error) {
    console.error('❌ Error al generar informe de usuarios:', error);
    
    // Log de error
    logDatabaseOperation('GET', 'users_report', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al generar informe de usuarios'
    });
  }
};

// =====================================================
// ACTUALIZAR FIREBASE UID DEL USUARIO
// =====================================================

exports.updateUserFirebaseUID = async (req, res) => {
  const start = Date.now();
  try {

    const { email } = req.params;
    const { firebase_uid } = req.body;
    
    // Validaciones básicas
    if (!firebase_uid) {
      return res.status(400).json({
        success: false,
        message: 'Firebase UID es requerido'
      });
    }

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email es requerido'
      });
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.trim().toLowerCase() }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que el Firebase UID no esté ya en uso por otro usuario
    const userWithSameFirebaseUID = await prisma.user.findFirst({
      where: {
        firebase_uid: firebase_uid,
        id: { not: existingUser.id } // Excluir el usuario actual
      }
    });

    if (userWithSameFirebaseUID) {
      return res.status(400).json({
        success: false,
        message: 'Este Firebase UID ya está en uso por otro usuario'
      });
    }

    // Actualizar el Firebase UID del usuario
    const updatedUser = await prisma.user.update({
      where: { id: existingUser.id },
      data: {
        firebase_uid: firebase_uid,
        updated_at: new Date()
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    // Registrar en auditoría
    try {
      await auditEvent({
        userId: req.user?.id || null,
        userEmail: req.user?.email || 'system@admin',
        action: AUDIT_ACTIONS.UPDATE,
        tableName: 'users',
        recordId: updatedUser.id,
        details: {
          action: 'Firebase UID actualizado',
          email: updatedUser.email,
          old_firebase_uid: existingUser.firebase_uid,
          new_firebase_uid: firebase_uid
        }
      });
    } catch (auditError) {

    }

    // Log de operación
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, true, 'Firebase UID actualizado');

    res.json({
      success: true,
      data: {
        id: updatedUser.id,
        email: updatedUser.email,
        firebase_uid: updatedUser.firebase_uid,
        role: updatedUser.roles?.name || 'Sin rol',
        updated_at: updatedUser.updated_at
      },
      message: 'Firebase UID actualizado exitosamente'
    });

  } catch (error) {
    console.error('❌ Error al actualizar Firebase UID:', error);
    
    // Log de error
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, false, error.message);
    
    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al actualizar Firebase UID'
    });
  }
};

// =====================================================
// CREAR USUARIO DESDE FIREBASE AUTH
// =====================================================

exports.createUserFromFirebase = async (req, res) => {
  const start = Date.now();
  try {

    const { firebase_uid, email, name, role, avatar } = req.body;
    
    // Validaciones básicas
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

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { firebase_uid },
          { email: email.trim().toLowerCase() }
        ]
      }
    });

    if (existingUser) {
      // Si existe pero no tiene firebase_uid, actualizarlo
      if (existingUser.email === email.trim().toLowerCase() && !existingUser.firebase_uid) {

        const updatedUser = await prisma.user.update({
          where: { id: existingUser.id },
          data: {
            firebase_uid: firebase_uid,
            name: name || existingUser.name,
            avatar: avatar || existingUser.avatar,
            updated_at: new Date()
          },
          include: {
            roles: {
              select: {
                id: true,
                name: true,
                description: true,
                level: true
              }
            }
          }
        });

        return res.status(200).json({
          success: true,
          message: 'Usuario actualizado exitosamente',
          data: {
            id: updatedUser.id,
            firebase_uid: updatedUser.firebase_uid,
            email: updatedUser.email,
            name: updatedUser.name,
            role: updatedUser.role,
            avatar: updatedUser.avatar,
            profile_complete: updatedUser.profile_complete || false,
            roles: updatedUser.roles
          }
        });
      }

      return res.status(409).json({
        success: false,
        message: 'El usuario ya existe',
        errors: [{
          field: existingUser.firebase_uid === firebase_uid ? 'firebase_uid' : 'email',
          message: 'Ya existe un usuario con estos datos'
        }]
      });
    }

    // Buscar rol por defecto si no se especifica
    let roleToAssign = role || 'Desarrollador'; // Cambiar a Desarrollador para que tenga acceso a Gestión de Proyectos
    const roleExists = await prisma.role.findFirst({
      where: { name: roleToAssign }
    });

    if (!roleExists) {
      // Usar rol por defecto si no existe el especificado
      const defaultRole = await prisma.role.findFirst({
        where: { name: 'Desarrollador' }
      });
      roleToAssign = defaultRole ? 'Desarrollador' : 'usuario';
    }

    // Crear nuevo usuario
    const newUser = await prisma.user.create({
      data: {
        firebase_uid: firebase_uid,
        email: email.trim().toLowerCase(),
        name: name,
        role: roleToAssign,
        avatar: avatar || '',
        is_active: true,
        is_first_login: true,
        profile_complete: false,
        created_at: new Date(),
        updated_at: new Date()
      },
      include: {
        roles: {
          select: {
            id: true,
            name: true,
            description: true,
            level: true
          }
        }
      }
    });

    // Registrar en auditoría
    try {
      await auditEvent({
        userId: firebase_uid,
        userEmail: email,
        action: AUDIT_ACTIONS.CREATE,
        tableName: 'users',
        recordId: newUser.id,
        details: {
          action: 'Usuario creado desde Firebase Auth',
          email: newUser.email,
          role: newUser.role
        }
      });
    } catch (auditError) {

    }

    logDatabaseOperation('INSERT', 'users', Date.now() - start, true);
    logAuth('create_firebase', newUser.id, true, req.ip, req.get('User-Agent'));

    res.status(201).json({
      success: true,
      message: 'Usuario creado exitosamente',
      data: {
        id: newUser.id,
        firebase_uid: newUser.firebase_uid,
        email: newUser.email,
        name: newUser.name,
        role: newUser.role,
        avatar: newUser.avatar,
        profile_complete: newUser.profile_complete,
        roles: newUser.roles
      }
    });

  } catch (error) {
    console.error('❌ Error creando usuario desde Firebase:', error);
    logDatabaseOperation('INSERT', 'users', Date.now() - start, false);
    logAuth('create_firebase', null, false, req.ip, req.get('User-Agent'));

    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
    });
  }
};

// =====================================================
// ACTUALIZAR PERFIL DE USUARIO (DESDE MI PERFIL)
// =====================================================

exports.updateUserProfile = async (req, res) => {
  const start = Date.now();
  try {

    const { id } = req.params;
    const {
      name,
      phone,
      phone_country_code,
      department,
      position,
      hire_date,
      birth_date,
      avatar
    } = req.body;

    // Verificar que el usuario existe
    const existingUser = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingUser) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Validaciones
    if (!name || name.trim().length < 2) {
      return res.status(400).json({
        success: false,
        message: 'El nombre debe tener al menos 2 caracteres'
      });
    }

    // Validar fecha de nacimiento si se proporciona
    let processedBirthDate = existingUser.birth_date;
    if (birth_date && birth_date.trim() !== '') {
      const date = new Date(birth_date);
      if (!isNaN(date.getTime())) {
        const today = new Date();
        const age = today.getFullYear() - date.getFullYear();
        if (age < 16 || age > 80) {
          return res.status(400).json({
            success: false,
            message: 'La edad debe estar entre 16 y 80 años'
          });
        }
        processedBirthDate = date;
      }
    }

    // Validar fecha de contratación si se proporciona
    let processedHireDate = existingUser.hire_date;
    if (hire_date && hire_date.trim() !== '') {
      const date = new Date(hire_date);
      if (!isNaN(date.getTime())) {
        processedHireDate = date;
      }
    }

    // Manejar la imagen si se subió
    let avatarPath = existingUser.avatar;

    if (req.file) {
      // Si se subió un nuevo archivo, usar su ruta
      avatarPath = `/uploads/avatars/${req.file.filename}`;

    } else if (avatar) {
      // Si se envió una URL existente, mantenerla
      avatarPath = avatar;

    } else {

    }

    // Preparar datos de actualización
    const updateData = {
      name: name.trim(),
      phone: phone?.trim() || null,
      phone_country_code: phone_country_code?.trim() || null,
      department: department?.trim() || null,
      position: position?.trim() || null,
      hire_date: processedHireDate,
      birth_date: processedBirthDate,
      avatar: avatarPath,
      updated_at: new Date()
    };

    // Verificar si el perfil está completo (todos los campos requeridos)
    const isProfileComplete = !!(updateData.name &&
                               updateData.phone &&
                               updateData.phone_country_code &&
                               updateData.department &&
                               updateData.position &&
                               updateData.birth_date);

    updateData.profile_complete = Boolean(isProfileComplete);

    // Construir URL completa del avatar
    const baseUrl = process.env.NODE_ENV === 'production' 
      ? 'https://sigma.runsolutions-services.com' 
      : `http://localhost:${process.env.PORT || 8765}`;
    const fullAvatarUrl = updatedUser.avatar ? `${baseUrl}${updatedUser.avatar}` : null;

    const responseData = {
      success: true,
      data: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        phone_country_code: updatedUser.phone_country_code,
        department: updatedUser.department,
        position: updatedUser.position,
        hire_date: updatedUser.hire_date,
        birth_date: updatedUser.birth_date,
        avatar: fullAvatarUrl,
        profile_complete: updatedUser.profile_complete,
        role: updatedUser.roles?.name || existingUser.role,
        updated_at: updatedUser.updated_at
      },
      message: 'Perfil actualizado exitosamente'
    };

    res.json(responseData);

  } catch (error) {
    console.error('❌ Error al actualizar perfil:', error);
    console.error('❌ Error stack:', error.stack);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });

    // Log de error
    logDatabaseOperation('UPDATE', 'users', Date.now() - start, false, error.message);

    res.status(500).json({
      success: false,
      error: error.message,
      message: 'Error al actualizar perfil',
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
};

// Exportar middleware de multer para uso en rutas
module.exports = {
  ...exports,
  upload,
  handleMulterError
};
