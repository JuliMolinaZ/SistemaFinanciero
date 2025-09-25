const express = require('express');
const router = express.Router();
const {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  getProjectMembers,
  removeProjectMember
} = require('../controllers/managementProjectControllerNew');

// ========================================
// RUTAS DE GESTIÓN DE PROYECTOS (PM)
// ========================================

// Obtener estadísticas para el dashboard (debe ir antes de las rutas con parámetros)
router.get('/dashboard-stats', async (req, res) => {
  try {

    // Importar prisma directamente aquí
    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    // Contar proyectos
    const projectsCount = await prisma.project.count();

    // Contar tareas
    const tasksCount = await prisma.task.count();

    // Contar sprints activos
    const sprintsCount = await prisma.sprint.count({
      where: {
        OR: [
          { status: 'active' },
          { status: 'planned' },
          { status: 'in_progress' }
        ]
      }
    });

    await prisma.$disconnect();

    const stats = {
      projects: projectsCount,
      tasks: tasksCount,
      sprints: sprintsCount
    };

    res.json({
      success: true,
      data: stats
    });

  } catch (error) {
    console.error('❌ Error obteniendo estadísticas del dashboard:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// Obtener todos los proyectos de gestión
// TEMPORALMENTE SIN MIDDLEWARE DE AUDITORÍA PARA EVITAR BUCLES INFINITOS
router.get('/', getAllProjects);

// Obtener un proyecto de gestión por ID (debe ir DESPUÉS de rutas específicas)
router.get('/:id', getProjectById);

// Crear un nuevo proyecto de gestión
router.post('/', createProject);

// Actualizar un proyecto de gestión
router.put('/:id', updateProject);

// Eliminar un proyecto de gestión
router.delete('/:id', deleteProject);

// ========================================
// RUTAS DE MIEMBROS DE PROYECTOS
// ========================================

// Obtener miembros de un proyecto
router.get('/:id/members', getProjectMembers);

// Agregar miembro a un proyecto
router.post('/:id/members', addProjectMember);

// Remover miembro de un proyecto
router.delete('/:id/members/:memberId', removeProjectMember);

module.exports = router;
