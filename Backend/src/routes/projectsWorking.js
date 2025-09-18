// 🚀 RUTAS DE PROYECTOS QUE FUNCIONAN - VERSIÓN TEMPORAL
// ======================================================

const express = require('express');
const router = express.Router();

// 📊 DATOS MOCK REALISTAS
const mockProjects = [
  {
    id: 1,
    nombre: 'Sistema ERP Empresarial',
    status: 'active',
    descripcion: 'Sistema integral de planificación de recursos empresariales con módulos de contabilidad, inventario y RRHH',
    priority: 'high',
    progress: 78,
    cliente_id: 1,
    start_date: '2025-01-15',
    end_date: '2025-08-30',
    created_at: '2025-01-15T08:00:00.000Z',
    updated_at: '2025-09-17T18:00:00.000Z'
  },
  {
    id: 2,
    nombre: 'Plataforma E-commerce B2B',
    status: 'planning',
    descripcion: 'Desarrollo de marketplace B2B con funcionalidades de catálogo, cotizaciones y logística integrada',
    priority: 'medium',
    progress: 25,
    cliente_id: 2,
    start_date: '2025-03-01',
    end_date: '2025-11-15',
    created_at: '2025-02-15T09:30:00.000Z',
    updated_at: '2025-09-17T16:45:00.000Z'
  },
  {
    id: 3,
    nombre: 'App Móvil Corporativa',
    status: 'active',
    descripcion: 'Aplicación móvil multiplataforma para gestión de tareas, comunicación interna y aprobaciones',
    priority: 'high',
    progress: 92,
    cliente_id: 1,
    start_date: '2024-11-01',
    end_date: '2025-05-15',
    created_at: '2024-10-20T10:15:00.000Z',
    updated_at: '2025-09-17T14:20:00.000Z'
  },
  {
    id: 4,
    nombre: 'Portal de Analytics Avanzado',
    status: 'planning',
    descripcion: 'Dashboard ejecutivo con inteligencia de negocios, reportes automatizados y visualizaciones interactivas',
    priority: 'low',
    progress: 55,
    cliente_id: 3,
    start_date: '2025-02-01',
    end_date: '2025-09-30',
    created_at: '2025-01-25T11:00:00.000Z',
    updated_at: '2025-09-17T12:30:00.000Z'
  },
  {
    id: 5,
    nombre: 'Sistema de Gestión Documental',
    status: 'completed',
    descripcion: 'Plataforma para digitalización, almacenamiento y gestión de documentos empresariales con workflows',
    priority: 'medium',
    progress: 100,
    cliente_id: 2,
    start_date: '2024-08-01',
    end_date: '2025-02-28',
    created_at: '2024-07-15T13:45:00.000Z',
    updated_at: '2025-03-01T17:00:00.000Z'
  },
  {
    id: 6,
    nombre: 'Proyecto Sin Cliente',
    status: 'planning',
    descripcion: 'Proyecto interno sin cliente asignado',
    priority: 'low',
    progress: 15,
    cliente_id: null,
    start_date: '2025-06-01',
    end_date: '2025-12-01',
    created_at: '2025-05-15T10:00:00.000Z',
    updated_at: '2025-09-17T11:00:00.000Z'
  }
];

// 📊 GET ALL PROJECTS WITH GROUPING
router.get('/projects', async (req, res) => {
  try {
    console.log('🔍 GET /projects - Endpoint funcional con agrupación');

    const { PrismaClient } = require('@prisma/client');
    const prisma = new PrismaClient();

    const { search } = req.query;

    // Obtener proyectos reales de la base de datos con colores de cliente
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

    console.log('🔍 Proyectos obtenidos de BD:', projects.length);

    // Procesar client JSON y agregar miembros
    for (const project of projects) {
      if (project.client) {
        try {
          project.client = JSON.parse(project.client);
        } catch (e) {
          project.client = null;
        }
      }

      // Obtener miembros del proyecto
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

      // Obtener fase actual
      if (project.current_phase_id) {
        try {
          const currentPhase = await prisma.projectPhase.findUnique({
            where: { id: project.current_phase_id },
            select: {
              id: true,
              name: true
            }
          });
          project.current_phase = currentPhase;
        } catch (e) {
          project.current_phase = null;
        }
      } else {
        project.current_phase = null;
      }
    }

    // Filtrar por búsqueda si se proporciona
    let filteredProjects = projects;
    if (search) {
      const searchLower = search.toLowerCase();
      filteredProjects = projects.filter(project =>
        project.nombre.toLowerCase().includes(searchLower) ||
        project.descripcion?.toLowerCase().includes(searchLower)
      );
    }

    // Los proyectos ya tienen toda la información necesaria desde la BD
    const projectsWithClients = filteredProjects;

    // Agrupar por cliente
    const groupMap = new Map();
    
    projectsWithClients.forEach(project => {
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

    // Convertir a array y ordenar (Sin Cliente al final)
    const groups = Array.from(groupMap.values()).sort((a, b) => {
      if (a.clientId === null) return 1;
      if (b.clientId === null) return -1;
      return a.clientName.localeCompare(b.clientName);
    });

    console.log(`✅ Proyectos obtenidos: ${projectsWithClients.length} en ${groups.length} grupos`);

    res.json({
      success: true,
      message: 'Proyectos obtenidos exitosamente',
      data: projectsWithClients,
      groups,
      meta: {
        total: projectsWithClients.length,
        groupCount: groups.length,
        search: search || null
      }
    });
  } catch (error) {
    console.error('❌ Error en endpoint projects:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
});

// 👁️ GET PROJECT BY ID
router.get('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('🔍 GET /projects/:id - ID:', id);

    const project = mockProjects.find(p => p.id === parseInt(id));
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Agregar información completa
    const fullProject = {
      ...project,
      client: project.cliente_id ? {
        id: project.cliente_id,
        nombre: project.cliente_id === 1 ? 'TechCorp Solutions' : 
                project.cliente_id === 2 ? 'GlobalSoft Inc.' : 
                project.cliente_id === 3 ? 'InnovateX Ltd.' : 'Cliente Desconocido'
      } : null,
      members: [
        { id: 1, team_type: 'operations', user: { id: 1, name: 'Juan Pérez' } },
        { id: 2, team_type: 'operations', user: { id: 2, name: 'María García' } },
        { id: 3, team_type: 'it', user: { id: 3, name: 'Carlos López' } },
        { id: 4, team_type: 'it', user: { id: 4, name: 'Ana Martín' } }
      ],
      current_phase: {
        id: `phase-${project.id}`,
        name: project.progress < 25 ? 'Planificación' : 
              project.progress < 50 ? 'Desarrollo' :
              project.progress < 75 ? 'Testing' : 
              project.progress < 100 ? 'Despliegue' : 'Completado'
      }
    };

    console.log('✅ Proyecto encontrado:', fullProject.nombre);

    res.json({
      success: true,
      message: 'Proyecto obtenido exitosamente',
      data: fullProject
    });

  } catch (error) {
    console.error('❌ Error obteniendo proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// ✏️ UPDATE PROJECT
router.put('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('✏️ PUT /projects/:id - ID:', id, 'Data:', req.body);

    const projectIndex = mockProjects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Actualizar proyecto
    mockProjects[projectIndex] = {
      ...mockProjects[projectIndex],
      ...req.body,
      updated_at: new Date().toISOString()
    };

    const updatedProject = {
      ...mockProjects[projectIndex],
      client: mockProjects[projectIndex].cliente_id ? {
        id: mockProjects[projectIndex].cliente_id,
        nombre: mockProjects[projectIndex].cliente_id === 1 ? 'TechCorp Solutions' : 
                mockProjects[projectIndex].cliente_id === 2 ? 'GlobalSoft Inc.' : 
                mockProjects[projectIndex].cliente_id === 3 ? 'InnovateX Ltd.' : 'Cliente Desconocido'
      } : null
    };

    console.log('✅ Proyecto actualizado:', updatedProject.nombre);

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      data: updatedProject
    });

  } catch (error) {
    console.error('❌ Error actualizando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

// 🗑️ DELETE PROJECT
router.delete('/projects/:id', (req, res) => {
  try {
    const { id } = req.params;
    console.log('🗑️ DELETE /projects/:id - ID:', id);

    const projectIndex = mockProjects.findIndex(p => p.id === parseInt(id));
    
    if (projectIndex === -1) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    const deletedProject = mockProjects.splice(projectIndex, 1)[0];

    console.log('✅ Proyecto eliminado:', deletedProject.nombre);

    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
      data: { id: parseInt(id), nombre: deletedProject.nombre }
    });

  } catch (error) {
    console.error('❌ Error eliminando proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: error.message
    });
  }
});

module.exports = router;
