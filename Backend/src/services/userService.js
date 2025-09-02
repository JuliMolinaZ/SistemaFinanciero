const prisma = require('../config/database');
const { hashPassword, verifyPassword } = require('../utils/encryption');
const { generateJWT } = require('../utils/auth');
const { auditEvent, AUDIT_ACTIONS } = require('../middlewares/audit');

class UserService {
  /**
   * Obtener todos los usuarios con paginación
   */
  async getAllUsers(page = 1, limit = 10, search = '') {
    const skip = (page - 1) * limit;
    
    const where = search ? {
      OR: [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } }
      ]
    } : {};
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          avatar: true,
          created_at: true,
          updated_at: true
        },
        orderBy: { created_at: 'desc' }
      }),
      prisma.user.count({ where })
    ]);
    
    return {
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };
  }
  
  /**
   * Obtener usuario por ID
   */
  async getUserById(id) {
    return await prisma.user.findUnique({
      where: { id: parseInt(id) },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        avatar: true,
        created_at: true,
        updated_at: true
      }
    });
  }
  
  /**
   * Crear nuevo usuario
   */
  async createUser(userData, req) {
    const { email, name, password, role = 'user' } = userData;
    
    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });
    
    if (existingUser) {
      throw new Error('El usuario ya existe con este email');
    }
    
    // Hash de la contraseña si se proporciona
    const hashedPassword = password ? await hashPassword(password) : null;
    
    // Crear usuario
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        role
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        created_at: true
      }
    });
    
    // Registrar evento de auditoría
    await auditEvent(req, AUDIT_ACTIONS.CREATE, 'users', user.id, null, user);
    
    return user;
  }
  
  /**
   * Actualizar usuario
   */
  async updateUser(id, updateData, req) {
    const userId = parseInt(id);
    
    // Obtener usuario actual
    const currentUser = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!currentUser) {
      throw new Error('Usuario no encontrado');
    }
    
    // Hash de la contraseña si se proporciona
    let hashedPassword = currentUser.password;
    if (updateData.password) {
      hashedPassword = await hashPassword(updateData.password);
    }
    
    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        ...updateData,
        password: hashedPassword,
        updated_at: new Date()
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        updated_at: true
      }
    });
    
    // Registrar evento de auditoría
    await auditEvent(req, AUDIT_ACTIONS.UPDATE, 'users', userId, currentUser, updatedUser);
    
    return updatedUser;
  }
  
  /**
   * Eliminar usuario
   */
  async deleteUser(id, req) {
    const userId = parseInt(id);
    
    // Obtener usuario antes de eliminar
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });
    
    if (!user) {
      throw new Error('Usuario no encontrado');
    }
    
    // Eliminar usuario
    await prisma.user.delete({
      where: { id: userId }
    });
    
    // Registrar evento de auditoría
    await auditEvent(req, AUDIT_ACTIONS.DELETE, 'users', userId, user, null);
    
    return { message: 'Usuario eliminado exitosamente' };
  }
  
  /**
   * Autenticar usuario
   */
  async authenticateUser(email, password) {
    const user = await prisma.user.findUnique({
      where: { email }
    });
    
    if (!user) {
      throw new Error('Credenciales inválidas');
    }
    
    if (user.password && !(await verifyPassword(password, user.password))) {
      throw new Error('Credenciales inválidas');
    }
    
    // Generar JWT
    const token = generateJWT({
      id: user.id,
      email: user.email,
      role: user.role
    });
    
    return {
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      token
    };
  }
  
  /**
   * Obtener estadísticas de usuarios
   */
  async getUserStats() {
    const [totalUsers, usersByRole] = await Promise.all([
      prisma.user.count(),
      prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true
        }
      })
    ]);
    
    return {
      total: totalUsers,
      byRole: usersByRole.reduce((acc, item) => {
        acc[item.role] = item._count.role;
        return acc;
      }, {})
    };
  }
}

module.exports = new UserService(); 