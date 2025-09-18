// 🚀 CONTROLADOR SIMPLIFICADO DE GESTIÓN DE PROYECTOS
// ===================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 📋 Obtener todos los proyectos - VERSIÓN SIMPLIFICADA
const getAllProjects = async (req, res) => {
  try {
    console.log('🔍 getAllProjects - Versión simplificada iniciando...');
    
    // Obtener proyectos con consulta SQL directa para incluir color del cliente
    const projects = await prisma.$queryRaw`
      SELECT
        p.*,
        JSON_OBJECT(
          'id', c.id,
          'nombre', c.nombre,
          'color', c.color
        ) as client
      FROM projects p
      LEFT JOIN clients c ON p.cliente_id = c.id
      ORDER BY p.created_at DESC
    `;

    // Obtener miembros de cada proyecto
    for (const project of projects) {
      const members = await prisma.projectMember.findMany({
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

    console.log(`✅ Proyectos obtenidos: ${projects.length}`);

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
    console.log('🔍 getProjectById - ID:', id);

    const project = await prisma.project.findUnique({
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

    console.log('✅ Proyecto encontrado:', project.nombre);

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
    console.log('🔍 createProject - Datos recibidos:', req.body);
    
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
      status: 'planning',
      progress: 0
    };

    const project = await prisma.project.create({
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

    console.log('✅ Proyecto creado:', project.nombre);

    // Crear miembros del proyecto si se proporcionaron
    if (members && members.length > 0) {
      const memberData = members.map(member => ({
        project_id: project.id,
        user_id: parseInt(member.user_id),
        role_id: parseInt(member.role_id) || 1,
        team_type: member.team_type || 'operations'
      }));

      await prisma.projectMember.createMany({
        data: memberData
      });

      console.log(`✅ Miembros agregados: ${memberData.length}`);
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

    console.log('🔍 updateProject - ID:', id);
    console.log('🔍 updateProject - Datos del proyecto:', projectData);
    console.log('🔍 updateProject - Color del cliente:', client_color);

    // Si se incluye client_color y cliente_id, actualizar el color del cliente
    if (client_color && projectData.cliente_id) {
      console.log('🎨 Actualizando color del cliente...');
      await prisma.client.update({
        where: { id: parseInt(projectData.cliente_id) },
        data: { color: client_color }
      });
      console.log('✅ Color del cliente actualizado');
    }

    const project = await prisma.project.update({
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

    console.log('✅ Proyecto actualizado:', project.nombre);

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
    console.log('🔍 deleteProject - ID:', id);

    const project = await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    console.log('✅ Proyecto eliminado:', project.nombre);

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
