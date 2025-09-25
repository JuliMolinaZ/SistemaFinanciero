// 🚀 CONTROLADOR SIMPLIFICADO DE GESTIÓN DE PROYECTOS
// ===================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 📋 Obtener todos los proyectos - VERSIÓN SIMPLIFICADA
const getAllProjects = async (req, res) => {
  try {

    // Obtener proyectos con consulta SQL directa para incluir color del cliente
    const projects = await prisma.$queryRaw`
      SELECT
        p.*,
        JSON_OBJECT(
          'id', c.id,
          'nombre', c.nombre,
          'color', c.color
        ) as client
      FROM management_projects p
      LEFT JOIN clients c ON p.cliente_id = c.id
      ORDER BY p.created_at DESC
    `;

    // Obtener miembros de cada proyecto
    for (const project of projects) {
      const members = await prisma.managementProjectMember.findMany({
        where: { project_id: project.id },
        select: {
          id: true,
          team_type: true,
          user: {
            select: {
              id: true,
              name: true
            }
          }
        }
      });

      project.members = members;

      // Parsear el client JSON
      if (project.client) {
        try {
          project.client = JSON.parse(project.client);
        } catch (e) {
          project.client = null;
        }
      }
    }

    res.json({
      success: true,
      message: 'Proyectos obtenidos exitosamente',
      data: projects,
      count: projects.length
    });

  } catch (error) {
    console.error('❌ Error obteniendo proyectos:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 👁️ Obtener proyecto por ID
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;

    const project = await prisma.managementProject.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: {
          select: {
            id: true,
            nombre: true,
            email: true
          }
        },
        members: {
          select: {
            id: true,
            team_type: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    res.json({
      success: true,
      message: 'Proyecto obtenido exitosamente',
      data: project
    });

  } catch (error) {
    console.error('❌ Error obteniendo proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ➕ Crear proyecto
const createProject = async (req, res) => {
  try {
    // Obtener el usuario actual desde el token de autenticación
    const currentUser = req.user;
    if (!currentUser || !currentUser.firebase_uid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Buscar el usuario en la base de datos para obtener su ID
    const user = await prisma.user.findUnique({
      where: { firebase_uid: currentUser.firebase_uid },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en la base de datos'
      });
    }

    const {
      nombre,
      descripcion,
      cliente_id,
      priority = 'medium',
      start_date,
      end_date,
      project_manager_id,
      members = []
    } = req.body;

    // Validaciones básicas
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del proyecto es obligatorio'
      });
    }

    // Crear el proyecto
    const projectData = {
      nombre: nombre.trim(),
      descripcion: descripcion?.trim() || null,
      cliente_id: cliente_id ? parseInt(cliente_id) : null,
      priority: priority || 'medium',
      start_date: start_date ? new Date(start_date) : null,
      end_date: end_date ? new Date(end_date) : null,
      project_manager_id: project_manager_id ? parseInt(project_manager_id) : null,
      created_by: user.id, // Agregar el ID del usuario que crea el proyecto
      status: 'planning',
      progress: 0
    };

    const project = await prisma.managementProject.create({
      data: projectData,
      include: {
        client: {
          select: {
            id: true,
            nombre: true
          }
        }
      }
    });

    // Crear miembros del proyecto si se proporcionaron
    if (members && members.length > 0) {
      const memberData = members.map(member => ({
        project_id: project.id,
        user_id: parseInt(member.user_id),
        role_id: parseInt(member.role_id) || 1,
        team_type: member.team_type || 'operations'
      }));

      await prisma.managementProjectMember.createMany({
        data: memberData
      });

    }

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: project
    });

  } catch (error) {
    console.error('❌ Error creando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// ✏️ Actualizar proyecto
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { client_color, ...projectData } = req.body;

    // Si se incluye client_color y cliente_id, actualizar el color del cliente
    if (client_color && projectData.cliente_id) {

      await prisma.client.update({
        where: { id: parseInt(projectData.cliente_id) },
        data: { color: client_color }
      });

    }

    const project = await prisma.managementProject.update({
      where: { id: parseInt(id) },
      data: projectData,
      include: {
        client: {
          select: {
            id: true,
            nombre: true,
            color: true
          }
        },
        members: {
          select: {
            id: true,
            team_type: true,
            user: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      data: project
    });

  } catch (error) {
    console.error('❌ Error actualizando proyecto:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

// 🗑️ Eliminar proyecto
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener el usuario actual desde el token de autenticación
    const currentUser = req.user;
    if (!currentUser || !currentUser.firebase_uid) {
      return res.status(401).json({
        success: false,
        message: 'Usuario no autenticado'
      });
    }

    // Buscar el usuario en la base de datos para obtener su ID
    const user = await prisma.user.findUnique({
      where: { firebase_uid: currentUser.firebase_uid },
      select: { id: true, name: true, email: true }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado en la base de datos'
      });
    }

    // Buscar el proyecto para verificar permisos
    const existingProject = await prisma.managementProject.findUnique({
      where: { id: parseInt(id) },
      select: { id: true, nombre: true, created_by: true }
    });

    if (!existingProject) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Validar que solo el creador pueda eliminar el proyecto
    if (existingProject.created_by !== user.id) {
      return res.status(403).json({
        success: false,
        message: 'No tienes permisos para eliminar este proyecto. Solo el creador puede eliminarlo.'
      });
    }

    // Eliminar el proyecto
    const project = await prisma.managementProject.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
      data: project
    });

  } catch (error) {
    console.error('❌ Error eliminando proyecto:', error);
    
    if (error.code === 'P2025') {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};
