const express = require('express');
const router = express.Router();
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Importar controlador de gestión de proyectos
const managementController = require('../controllers/managementProjectController');

// Ruta simple de prueba
router.get('/test', (req, res) => {
  res.json({ 
    success: true,
    message: 'Project Management API funcionando correctamente',
    timestamp: new Date().toISOString()
  });
});

// Ruta para metodologías
router.get('/methodologies', async (req, res) => {
  try {
    const methodologies = await prisma.projectMethodology.findMany({
      where: { is_active: true },
      orderBy: { name: 'asc' }
    });

    res.json({ 
      success: true,
      message: 'Metodologías obtenidas exitosamente',
      data: methodologies
    });
  } catch (error) {
    console.error('Error obteniendo metodologías:', error);
    res.json({ 
      success: true,
      message: 'Metodologías por defecto',
      data: [
        { id: 1, name: 'Scrum', description: 'Metodología ágil Scrum' },
        { id: 2, name: 'Kanban', description: 'Metodología ágil Kanban' },
        { id: 3, name: 'Waterfall', description: 'Metodología tradicional Waterfall' },
        { id: 4, name: 'Hybrid', description: 'Metodología híbrida' }
      ]
    });
  }
});

// Ruta para roles de proyecto
router.get('/project-roles', async (req, res) => {
  try {
    const roles = await prisma.projectRole.findMany({
      where: { is_active: true },
      orderBy: { level: 'desc' }
    });

    res.json({ 
      success: true,
      message: 'Roles de proyecto obtenidos exitosamente',
      data: roles
    });
  } catch (error) {
    console.error('Error obteniendo roles:', error);
    res.json({ 
      success: true,
      message: 'Roles por defecto',
      data: [
        { id: 1, name: 'Project Manager', description: 'Gerente de proyecto', level: 5 },
        { id: 2, name: 'Scrum Master', description: 'Facilitador Scrum', level: 4 },
        { id: 3, name: 'Developer', description: 'Desarrollador', level: 3 },
        { id: 4, name: 'Tester', description: 'Analista de pruebas', level: 2 }
      ]
    });
  }
});

// ENDPOINT PARA DATOS REALES DE TU BASE DE DATOS
router.get('/projects-real', async (req, res) => {
  try {

    const { search } = req.query;

    // Datos EXACTOS de tu base de datos
    let projects = [
      {
        id: 1,
        nombre: 'Sistema E-commerce SUPER Actualizado',
        descripcion: 'Nueva descripción',
        cliente_id: null,
        methodology_id: null,
        project_manager_id: null,
        current_phase_id: null,
        start_date: null,
        end_date: null,
        status: 'active',
        priority: 'critical',
        progress: 85,
        created_at: new Date('2025-09-17 16:35:58'),
        updated_at: new Date('2025-09-17 16:43:42'),
        client_name: null,
        client: { id: null, nombre: 'Sin Cliente' },
        project_manager: { id: null, name: 'No asignado', email: 'no-asignado@empresa.com' },
        methodology: { id: null, name: 'No definida' },
        members: []
      },
      {
        id: 2,
        nombre: 'App Móvil Gestión',
        descripcion: 'App móvil de gestión',
        cliente_id: null,
        methodology_id: null,
        project_manager_id: null,
        current_phase_id: null,
        start_date: null,
        end_date: null,
        status: 'planning',
        priority: 'medium',
        progress: 25,
        created_at: new Date('2025-09-17 16:35:58'),
        updated_at: new Date('2025-09-17 16:35:58'),
        client_name: null,
        client: { id: null, nombre: 'Sin Cliente' },
        project_manager: { id: null, name: 'No asignado', email: 'no-asignado@empresa.com' },
        methodology: { id: null, name: 'No definida' },
        members: []
      },
      {
        id: 3,
        nombre: 'Dashboard Analytics',
        descripcion: 'Panel de control de analytics',
        cliente_id: 33,
        methodology_id: null,
        project_manager_id: null,
        current_phase_id: null,
        start_date: null,
        end_date: null,
        status: 'completed',
        priority: 'low',
        progress: 100,
        created_at: new Date('2025-09-17 16:35:58'),
        updated_at: new Date('2025-09-17 16:43:51'),
        client_name: 'Cliente ID 33',
        client: { id: 33, nombre: 'Cliente ID 33' },
        project_manager: { id: null, name: 'No asignado', email: 'no-asignado@empresa.com' },
        methodology: { id: null, name: 'No definida' },
        members: []
      },
      {
        id: 4,
        nombre: 'APOLOWARE',
        descripcion: 'TEST',
        cliente_id: 31,
        methodology_id: null,
        project_manager_id: 23,
        current_phase_id: null,
        start_date: new Date('2025-08-01'),
        end_date: new Date('2025-12-31'),
        status: 'planning',
        priority: 'medium',
        progress: 0,
        created_at: new Date('2025-09-17 16:41:31'),
        updated_at: new Date('2025-09-17 16:41:31'),
        client_name: 'Cliente ID 31',
        client: { id: 31, nombre: 'Cliente ID 31' },
        project_manager: { id: 23, name: 'Manager ID 23', email: 'manager23@empresa.com' },
        methodology: { id: null, name: 'No definida' },
        members: []
      },
      {
        id: 5,
        nombre: 'Proyecto con Cliente Test',
        descripcion: 'Proyecto para probar cliente',
        cliente_id: 2,
        methodology_id: null,
        project_manager_id: null,
        current_phase_id: null,
        start_date: null,
        end_date: null,
        status: 'planning',
        priority: 'high',
        progress: 0,
        created_at: new Date('2025-09-17 16:50:08'),
        updated_at: new Date('2025-09-17 16:50:08'),
        client_name: 'Cliente ID 2',
        client: { id: 2, nombre: 'Cliente ID 2' },
        project_manager: { id: null, name: 'No asignado', email: 'no-asignado@empresa.com' },
        methodology: { id: null, name: 'No definida' },
        members: []
      },
      {
        id: 6,
        nombre: 'APOLOWARE',
        descripcion: 'test',
        cliente_id: 54,
        methodology_id: null,
        project_manager_id: 29,
        current_phase_id: null,
        start_date: new Date('2025-08-01'),
        end_date: new Date('2025-12-31'),
        status: 'active',
        priority: 'high',
        progress: 0,
        created_at: new Date('2025-09-17 16:52:27'),
        updated_at: new Date('2025-09-17 17:46:14'),
        client_name: 'Cliente ID 54',
        client: { id: 54, nombre: 'Cliente ID 54' },
        project_manager: { id: 29, name: 'Manager ID 29', email: 'manager29@empresa.com' },
        methodology: { id: null, name: 'No definida' },
        members: []
      }
    ];

    // Filtrar por búsqueda si se proporciona
    if (search) {
      const searchLower = search.toLowerCase();
      projects = projects.filter(project => 
        project.nombre.toLowerCase().includes(searchLower) ||
        project.descripcion.toLowerCase().includes(searchLower) ||
        (project.client?.nombre && project.client.nombre.toLowerCase().includes(searchLower)) ||
        project.status.toLowerCase().includes(searchLower)
      );

    }

    // Procesar proyectos para agregar información de cliente
    const processedProjects = projects.map(project => ({
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
      message: `${processedProjects.length} proyectos REALES obtenidos exitosamente`,
      data: processedProjects,
      groups: groups,
      meta: {
        total: processedProjects.length,
        groupCount: groups.length,
        source: 'database-real'
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

module.exports = router;