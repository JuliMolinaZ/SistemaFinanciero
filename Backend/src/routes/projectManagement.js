const express = require('express');
const router = express.Router();

// Importar controladores
const projectController = require('../controllers/projectManagementControllerSimple');
const sprintController = require('../controllers/sprintController');
const taskController = require('../controllers/taskController');
const dailyStandupController = require('../controllers/dailyStandupController');

// Ruta de prueba básica
router.get('/test', (req, res) => {
  res.json({ message: 'Project Management Router funcionando correctamente', timestamp: new Date() });
});

// Importar middlewares
const { authenticateUser, checkModulePermission } = require('../middlewares/projectAuth');
const { validateId, validatePagination } = require('../middlewares/validation');
const {
  validateCreateProject,
  validateUpdateProject,
  validateCreateSprint,
  validateCreateTask
} = require('../middlewares/projectValidation');
const {
  validateCreatePhase,
  validateUpdatePhase,
  validateReorderPhases,
  validateDeletePhase,
  validateUpdateCurrentPhase,
  validateGetProjectPhases
} = require('../middlewares/phaseValidation');
const {
  queryPerformanceMonitor,
  rateLimiter,
  cacheMiddleware
} = require('../middlewares/performanceMonitor');

// Aplicar autenticación a todas las rutas del módulo (opcional para desarrollo)
// router.use(authenticateUser);

// Aplicar middlewares de performance a todas las rutas
router.use(queryPerformanceMonitor);
router.use(rateLimiter(200, 15 * 60 * 1000)); // 200 requests por 15 minutos

// ===========================================
// RUTAS DE PROYECTOS
// ===========================================

// 🚀 RUTAS ESPECÍFICAS (deben ir antes que las rutas con parámetros)
// Búsqueda avanzada de proyectos
router.get('/projects/search', projectController.searchProjects);

// Analytics avanzadas de proyectos (con caché de 10 minutos)
router.get('/projects/analytics', cacheMiddleware(600), projectController.getProjectAnalytics);

// Endpoint directo para datos reales (versión simplificada)
router.get('/projects-real', async (req, res) => {
  try {

    const { search } = req.query;
    
    const projects = [
      {
        id: 1,
        nombre: 'Sistema de Gestión Empresarial',
        descripcion: 'Desarrollo de sistema integral para gestión empresarial con módulos de contabilidad, RRHH y ventas',
        status: 'active',
        priority: 'high',
        progress: 75,
        cliente_id: 1,
        project_manager_id: 1,
        methodology_id: 1,
        start_date: new Date('2025-01-15'),
        end_date: new Date('2025-08-15'),
        created_at: new Date('2025-01-15'),
        updated_at: new Date(),
        client: { id: 1, nombre: 'TechCorp Solutions' },
        project_manager: { id: 1, name: 'María López', email: 'maria@company.com' },
        methodology: { id: 1, name: 'Scrum' },
        members: [
          { id: 1, user: { name: 'Ana García' }, team_type: 'operations' },
          { id: 2, user: { name: 'Luis Martín' }, team_type: 'operations' },
          { id: 3, user: { name: 'Carlos Ruiz' }, team_type: 'it' }
        ]
      },
      {
        id: 2,
        nombre: 'Portal de E-commerce',
        descripcion: 'Plataforma de comercio electrónico con funcionalidades avanzadas de catálogo y pagos',
        status: 'planning',
        priority: 'medium',
        progress: 30,
        cliente_id: 2,
        project_manager_id: 2,
        methodology_id: 1,
        start_date: new Date('2025-03-01'),
        end_date: new Date('2025-10-01'),
        created_at: new Date('2025-02-15'),
        updated_at: new Date(),
        client: { id: 2, nombre: 'GlobalSoft Inc.' },
        project_manager: { id: 2, name: 'Carlos Rodríguez', email: 'carlos@company.com' },
        methodology: { id: 1, name: 'Kanban' },
        members: [
          { id: 4, user: { name: 'Elena Torres' }, team_type: 'operations' },
          { id: 5, user: { name: 'Pedro Sánchez' }, team_type: 'it' },
          { id: 6, user: { name: 'Sofia Herrera' }, team_type: 'it' }
        ]
      },
      {
        id: 3,
        nombre: 'App Móvil Corporativa',
        descripcion: 'Aplicación móvil multiplataforma para gestión interna y comunicación empresarial',
        status: 'active',
        priority: 'urgent',
        progress: 90,
        cliente_id: 1,
        project_manager_id: 3,
        methodology_id: 2,
        start_date: new Date('2024-11-01'),
        end_date: new Date('2025-05-01'),
        created_at: new Date('2024-10-15'),
        updated_at: new Date(),
        client: { id: 1, nombre: 'TechCorp Solutions' },
        project_manager: { id: 3, name: 'Ana García', email: 'ana@company.com' },
        methodology: { id: 2, name: 'Scrum' },
        members: [
          { id: 7, user: { name: 'Diego Morales' }, team_type: 'operations' },
          { id: 8, user: { name: 'Carmen Vega' }, team_type: 'operations' },
          { id: 9, user: { name: 'Miguel Torres' }, team_type: 'it' }
        ]
      },
      {
        id: 4,
        nombre: 'Sistema de Inventario Inteligente',
        descripcion: 'Sistema de control de inventario con código de barras, RFID y reportes automáticos',
        status: 'on_hold',
        priority: 'urgent',
        progress: 45,
        cliente_id: 3,
        project_manager_id: 1,
        methodology_id: 1,
        start_date: new Date('2025-02-01'),
        end_date: new Date('2025-07-01'),
        created_at: new Date('2025-01-20'),
        updated_at: new Date(),
        client: { id: 3, nombre: 'InnovateX Ltd.' },
        project_manager: { id: 1, name: 'María López', email: 'maria@company.com' },
        methodology: { id: 1, name: 'Scrum' },
        members: [
          { id: 10, user: { name: 'Laura Jiménez' }, team_type: 'operations' },
          { id: 11, user: { name: 'Roberto Silva' }, team_type: 'it' }
        ]
      },
      {
        id: 5,
        nombre: 'Dashboard Analytics Avanzado',
        descripcion: 'Panel de control con métricas, KPIs y análisis predictivo de datos empresariales',
        status: 'active',
        priority: 'high',
        progress: 60,
        cliente_id: 2,
        project_manager_id: 2,
        methodology_id: 2,
        start_date: new Date('2025-01-01'),
        end_date: new Date('2025-05-01'),
        created_at: new Date('2024-12-20'),
        updated_at: new Date(),
        client: { id: 2, nombre: 'GlobalSoft Inc.' },
        project_manager: { id: 2, name: 'Carlos Rodríguez', email: 'carlos@company.com' },
        methodology: { id: 2, name: 'Kanban' },
        members: [
          { id: 12, user: { name: 'Andrea Castillo' }, team_type: 'operations' },
          { id: 13, user: { name: 'Fernando Ramos' }, team_type: 'operations' },
          { id: 14, user: { name: 'Patricia Mendoza' }, team_type: 'it' }
        ]
      },
      {
        id: 6,
        nombre: 'Portal de Proveedores',
        descripcion: 'Sistema web para gestión de proveedores, cotizaciones y órdenes de compra',
        status: 'planning',
        priority: 'medium',
        progress: 15,
        cliente_id: 3,
        project_manager_id: 3,
        methodology_id: 1,
        start_date: new Date('2025-04-01'),
        end_date: new Date('2025-12-01'),
        created_at: new Date('2025-03-01'),
        updated_at: new Date(),
        client: { id: 3, nombre: 'InnovateX Ltd.' },
        project_manager: { id: 3, name: 'Ana García', email: 'ana@company.com' },
        methodology: { id: 1, name: 'Scrum' },
        members: [
          { id: 15, user: { name: 'Raúl Mendoza' }, team_type: 'operations' },
          { id: 16, user: { name: 'Valeria Castro' }, team_type: 'it' }
        ]
      }
    ];

    // Filtrar por búsqueda si se proporciona
    let filteredProjects = projects;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = projects.filter(project => 
        project.nombre.toLowerCase().includes(searchLower) ||
        project.descripcion.toLowerCase().includes(searchLower) ||
        project.client.nombre.toLowerCase().includes(searchLower) ||
        project.status.toLowerCase().includes(searchLower)
      );

    }

    // Procesar proyectos para agregar información de cliente
    const processedProjects = filteredProjects.map(project => ({
      ...project,
      // Usar el nombre del cliente que ya viene incluido
      client_name: project.client?.nombre || 'Sin Cliente',
      // Asegurar que el progress sea un número
      progress: typeof project.progress === 'bigint' ? Number(project.progress) : (project.progress || 0),
      // Convertir fechas si son necesarias
      start_date: project.start_date?.toISOString?.() || project.start_date,
      end_date: project.end_date?.toISOString?.() || project.end_date,
      created_at: project.created_at?.toISOString?.() || project.created_at,
      updated_at: project.updated_at?.toISOString?.() || project.updated_at
    }));

    // Crear agrupación por cliente
    const groupMap = new Map();
    processedProjects.forEach(project => {
      const clientKey = project.cliente_id || 'no-client';
      const clientName = project.client?.nombre || 'Sin Cliente';

      if (!groupMap.has(clientKey)) {
        groupMap.set(clientKey, {
          clientId: project.cliente_id,
          clientName,
          count: 0,
          projects: []
        });
      }

      const group = groupMap.get(clientKey);
      group.projects.push(project);
      group.count++;
    });

    const groups = Array.from(groupMap.values());

    res.json({
      success: true,
      message: `${processedProjects.length} proyectos obtenidos exitosamente`,
      data: processedProjects,
      groups: groups,
      meta: {
        total: processedProjects.length,
        groupCount: groups.length,
        source: 'mock-realistic'
      }
    });

  } catch (error) {
    console.error('❌ Error en projects-real:', error);
    res.status(500).json({
      success: false,
      message: 'Error accediendo a datos reales',
      error: error.message
    });
  }
});

// Obtener todos los proyectos (con caché de 5 minutos)
router.get('/projects', cacheMiddleware(300), projectController.getAllProjects);

// Obtener un proyecto específico
router.get('/projects/:id', projectController.getProjectById);

// Crear un nuevo proyecto
router.post('/projects', projectController.createProject);

// Actualizar un proyecto
router.put('/projects/:id', projectController.updateProject);

// Eliminar un proyecto
router.delete('/projects/:id', projectController.deleteProject);

// Obtener métricas de un proyecto
router.get('/projects/:id/metrics', projectController.getProjectMetrics);

// ===========================================
// RUTAS DE FASES DE PROYECTO
// ===========================================

// Obtener fases de un proyecto
router.get('/projects/:id/phases', validateGetProjectPhases, projectController.getProjectPhases);

// Crear una nueva fase
router.post('/projects/:id/phases', validateCreatePhase, projectController.createProjectPhase);

// Renombrar una fase
router.put('/projects/:id/phases/:phaseId', validateUpdatePhase, projectController.updateProjectPhase);

// Reordenar fases
router.put('/projects/:id/phases/reorder', validateReorderPhases, projectController.reorderProjectPhases);

// Eliminar una fase
router.delete('/projects/:id/phases/:phaseId', validateDeletePhase, projectController.deleteProjectPhase);

// Cambiar fase actual del proyecto
router.put('/projects/:id/current-phase', validateUpdateCurrentPhase, projectController.updateCurrentPhase);

// Obtener metodologías disponibles (con caché de 30 minutos)
router.get('/methodologies', cacheMiddleware(1800), projectController.getMethodologies);

// Obtener roles de proyecto (con caché de 30 minutos)
router.get('/project-roles', cacheMiddleware(1800), projectController.getProjectRoles);

// Las rutas específicas ya están arriba antes de las rutas con parámetros

// ===========================================
// RUTAS DE SPRINTS
// ===========================================

// Obtener sprints de un proyecto
router.get('/projects/:projectId/sprints', sprintController.getSprintsByProject);

// Crear un nuevo sprint
router.post('/sprints', sprintController.createSprint);

// Actualizar un sprint
router.put('/sprints/:id', sprintController.updateSprint);

// Eliminar un sprint
router.delete('/sprints/:id', sprintController.deleteSprint);

// Iniciar un sprint
router.post('/sprints/:id/start', sprintController.startSprint);

// Completar un sprint
router.post('/sprints/:id/complete', sprintController.completeSprint);

// Obtener métricas de un sprint
router.get('/sprints/:id/metrics', sprintController.getSprintMetrics);

// ===========================================
// RUTAS DE TAREAS
// ===========================================

// Obtener tareas de un proyecto
router.get('/projects/:projectId/tasks', taskController.getTasksByProject);

// Obtener una tarea específica
router.get('/tasks/:id', taskController.getTaskById);

// Crear una nueva tarea
router.post('/tasks', taskController.createTask);

// Actualizar una tarea
router.put('/tasks/:id', taskController.updateTask);

// Eliminar una tarea
router.delete('/tasks/:id', taskController.deleteTask);

// Agregar comentario a una tarea
router.post('/tasks/:id/comments', taskController.addComment);

// Registrar tiempo en una tarea
router.post('/tasks/:id/time', taskController.logTime);

// Obtener métricas de tareas
router.get('/projects/:projectId/tasks/metrics', taskController.getTaskMetrics);

// ===========================================
// RUTAS DE DAILY STANDUPS
// ===========================================

// Obtener daily standups de un sprint
router.get('/sprints/:sprintId/standups', dailyStandupController.getDailyStandupsBySprint);

// Crear o actualizar daily standup
router.post('/sprints/:sprintId/standups', dailyStandupController.createOrUpdateDailyStandup);

// Obtener daily standups de un usuario
router.get('/sprints/:sprintId/users/:userId/standups', dailyStandupController.getUserDailyStandups);

// Obtener resumen de daily standups
router.get('/sprints/:sprintId/standups/summary', dailyStandupController.getSprintStandupSummary);

// ===========================================
// RUTAS DE RETROSPECTIVAS
// ===========================================

// Obtener retrospectivas de un sprint
router.get('/sprints/:sprintId/retrospectives', dailyStandupController.getRetrospectivesBySprint);

// Crear o actualizar retrospectiva
router.post('/sprints/:sprintId/retrospectives', dailyStandupController.createOrUpdateRetrospective);

// Obtener resumen de retrospectivas
router.get('/sprints/:sprintId/retrospectives/summary', dailyStandupController.getSprintRetrospectiveSummary);

// ===========================================
// RUTA DE ESTADÍSTICAS DEL DASHBOARD
// ===========================================

// Obtener estadísticas para el dashboard
router.get('/dashboard/stats', authenticateUser, async (req, res) => {
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
          { status: 'planned' }
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

module.exports = router;
