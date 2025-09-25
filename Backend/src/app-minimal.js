const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');

// Crear aplicación Express
const app = express();

// =====================================================
// MIDDLEWARES BÁSICOS
// =====================================================

// Helmet para headers de seguridad
app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginEmbedderPolicy: false
}));

// CORS
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Cache-Control', 'Accept']
}));

// Compresión
app.use(compression());

// Parsing de JSON
app.use(express.json({ limit: '10mb' }));

// Parsing de URL encoded
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// =====================================================
// RUTAS BÁSICAS
// =====================================================

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    message: 'Sistema Financiero API',
    version: '1.0.0',
    environment: 'development',
    timestamp: new Date().toISOString(),
    status: 'running'
  });
});

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development'
  });
});

// Ruta de información
app.get('/info', (req, res) => {
  res.json({
    name: 'Sistema Financiero API',
    description: 'API para gestión financiera y contable',
    version: '1.0.0',
    environment: 'development',
    database: 'MySQL + Prisma',
    features: [
      'Autenticación JWT + Firebase',
      'Gestión de usuarios y roles',
      'Gestión de clientes y proveedores',
      'Gestión de proyectos',
      'Cuentas por pagar y cobrar',
      'Contabilidad',
      'Logs de auditoría',
      'Sistema de seguridad'
    ]
  });
});

// Rutas de la API básicas
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: 'development',
    version: '1.0.0'
  });
});

app.get('/api/info', (req, res) => {
  res.json({
    name: 'Sistema Financiero API',
    description: 'API para gestión financiera y contable',
    version: '1.0.0',
    environment: 'development',
    database: 'MySQL + Prisma'
  });
});

// =====================================================
// RUTAS DE PRUEBA
// =====================================================

// Ruta de prueba de conexión a la base de datos
app.get('/api/test-db', async (req, res) => {
  try {
    const { testConnection } = require('./config/database');

    // Probar la conexión
    const isConnected = await testConnection();
    
    if (isConnected) {
      const { prisma } = require('./config/database');
      
      // Probar una consulta simple
      const userCount = await prisma.user.count();

      // Probar consulta de permisos
      const permisosCount = await prisma.permisos.count();

      // Probar consulta de roles
      const rolesCount = await prisma.roles.count();

      res.json({
        status: 'success',
        message: 'Conexión a la base de datos exitosa',
        data: {
          userCount,
          permisosCount,
          rolesCount,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      res.status(500).json({
        status: 'error',
        message: 'No se pudo conectar a la base de datos'
      });
    }
  } catch (error) {
    console.error('❌ Error en la conexión a la base de datos:', error);
    res.status(500).json({
      status: 'error',
      message: 'Error en la conexión a la base de datos',
      error: {
        message: error.message,
        code: error.code,
        meta: error.meta
      }
    });
  }
});

// Ruta de permisos básica
app.get('/api/permisos', async (req, res) => {
  try {
    const { prisma } = require('./config/database');

    // Probar la conexión
    const { testConnection } = require('./config/database');
    await testConnection();

    const permisos = await prisma.permisos.findMany({
      orderBy: { id: 'asc' }
    });

    res.json({
      success: true,
      data: permisos,
      total: permisos.length
    });
  } catch (error) {
    console.error('Error al obtener permisos:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener permisos', 
      details: error.message,
      code: error.code 
    });
  }
});

// Ruta de usuarios básica - Actualiza last_login cuando se consulta
app.get('/api/usuarios/firebase/:uid', async (req, res) => {
  try {
    const { prisma } = require('./config/database');
    const { uid } = req.params;
    
    // Buscar el usuario
    const usuario = await prisma.user.findUnique({
      where: { firebase_uid: uid }
    });
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    // Actualizar last_login y is_first_login
    const usuarioActualizado = await prisma.user.update({
      where: { firebase_uid: uid },
      data: {
        last_login: new Date(),
        is_first_login: false
      }
    });

    res.json({
      success: true,
      data: usuarioActualizado
    });
  } catch (error) {
    console.error('Error al obtener usuario:', error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

app.post('/api/usuarios', async (req, res) => {
  try {
    const { prisma } = require('./config/database');
    const { firebase_uid, email, name, role, avatar } = req.body;

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { firebase_uid }
    });
    
    if (existingUser) {

      return res.json(existingUser);
    }
    
    const usuario = await prisma.user.create({
      data: {
        firebase_uid,
        email,
        name,
        role: role || 'usuario',
        avatar
      }
    });

    res.status(201).json(usuario);
  } catch (error) {
    console.error('Error al crear usuario:', error);
    res.status(500).json({ 
      error: 'Error al crear usuario', 
      details: error.message,
      code: error.code 
    });
  }
});

// =====================================================
// RUTAS DE USUARIOS
// =====================================================

// Ruta para obtener todos los usuarios (compatibilidad)
app.get('/api/users', async (req, res) => {
  try {
    const { prisma } = require('./config/database');
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message 
    });
  }
});

// Ruta para obtener todos los usuarios (nueva)
app.get('/api/usuarios', async (req, res) => {
  try {
    const { prisma } = require('./config/database');
    const users = await prisma.user.findMany({
      orderBy: { name: 'asc' }
    });

    res.json({
      success: true,
      data: users,
      total: users.length
    });
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al obtener usuarios',
      details: error.message 
    });
  }
});

// Ruta para eliminar usuario (compatibilidad)
app.delete('/api/users/:id', async (req, res) => {
  try {
    const { prisma } = require('./config/database');
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado' 
      });
    }
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar usuario',
      details: error.message 
    });
  }
});

// Ruta para eliminar usuario (nueva)
app.delete('/api/usuarios/:id', async (req, res) => {
  try {
    const { prisma } = require('./config/database');
    const { id } = req.params;
    
    const user = await prisma.user.findUnique({
      where: { id: parseInt(id) }
    });
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        error: 'Usuario no encontrado' 
      });
    }
    
    await prisma.user.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar usuario:', error);
    res.status(500).json({ 
      success: false,
      error: 'Error al eliminar usuario',
      details: error.message 
    });
  }
});

// =====================================================
// MANEJO DE ERRORES
// =====================================================

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Error interno del servidor',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// Manejador de rutas no encontradas
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Ruta no encontrada',
    message: `La ruta ${req.originalUrl} no existe`,
    timestamp: new Date().toISOString()
  });
});

module.exports = app; 