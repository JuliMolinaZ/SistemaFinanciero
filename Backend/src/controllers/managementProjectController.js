// 🚀 CONTROLADOR DE GESTIÓN DE PROYECTOS - VERSIÓN FUNCIONAL
// ===========================================================

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// 🔧 Helper para convertir BigInt a Number
const convertBigIntToNumber = (obj) => {
  if (obj === null || obj === undefined) return obj;
  
  if (typeof obj === 'bigint') {
    return Number(obj);
  }
  
  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToNumber);
  }
  
  if (typeof obj === 'object') {
    const converted = {};
    for (const [key, value] of Object.entries(obj)) {
      converted[key] = convertBigIntToNumber(value);
    }
    return converted;
  }
  
  return obj;
};

// 📋 Obtener todos los proyectos de gestión - AGRUPADOS POR CLIENTE
const getAllProjects = async (req, res) => {
  try {

    const { search } = req.query;

    // Query SQL directo para evitar problemas de esquema
    let projects;
    
    if (search) {
      projects = await prisma.$queryRaw`
        SELECT 
          p.id,
          p.nombre,
          p.descripcion,
          p.cliente_id,
          p.status,
          p.priority,
          p.progress,
          p.start_date,
          p.end_date,
          p.created_at,
          p.updated_at,
          c.nombre as client_name
        FROM management_projects p
        LEFT JOIN clients c ON p.cliente_id = c.id
        WHERE (p.nombre LIKE ${`%${search}%`} OR p.descripcion LIKE ${`%${search}%`} OR c.nombre LIKE ${`%${search}%`})
        ORDER BY 
          CASE WHEN p.cliente_id IS NULL THEN 1 ELSE 0 END,
          c.nombre ASC,
          p.end_date ASC,
          p.created_at DESC
      `;
    } else {
      projects = await prisma.$queryRaw`
        SELECT 
          p.id,
          p.nombre,
          p.descripcion,
          p.cliente_id,
          p.status,
          p.priority,
          p.progress,
          p.start_date,
          p.end_date,
          p.created_at,
          p.updated_at,
          c.nombre as client_name
        FROM management_projects p
        LEFT JOIN clients c ON p.cliente_id = c.id
        ORDER BY 
          CASE WHEN p.cliente_id IS NULL THEN 1 ELSE 0 END,
          c.nombre ASC,
          p.end_date ASC,
          p.created_at DESC
      `;
    }

    // Convertir BigInt a Number y formatear
    const formattedProjects = convertBigIntToNumber(projects).map(project => ({
      id: Number(project.id),
      nombre: project.nombre,
      descripcion: project.descripcion,
      status: project.status,
      priority: project.priority,
      progress: Number(project.progress || 0),
      cliente_id: project.cliente_id ? Number(project.cliente_id) : null,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at,
      client: project.client_name ? {
        id: Number(project.cliente_id),
        nombre: project.client_name
      } : null,
      members: [] // Por ahora vacío
    }));

    // Agrupar por cliente
    const groupMap = new Map();
    
    formattedProjects.forEach(project => {
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

    res.json({
      success: true,
      message: 'Proyectos obtenidos exitosamente',
      data: formattedProjects,
      groups,
      meta: {
        total: formattedProjects.length,
        groupCount: groups.length,
        search: search || null
      }
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

    const projectResult = await prisma.$queryRaw`
      SELECT 
        p.*,
        c.nombre as client_name
      FROM management_projects p
      LEFT JOIN clients c ON p.cliente_id = c.id
      WHERE p.id = ${parseInt(id)}
    `;

    if (projectResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    const project = convertBigIntToNumber(projectResult[0]);
    
    // Formatear proyecto
    const formattedProject = {
      id: Number(project.id),
      nombre: project.nombre,
      descripcion: project.descripcion,
      status: project.status,
      priority: project.priority,
      progress: Number(project.progress || 0),
      cliente_id: project.cliente_id ? Number(project.cliente_id) : null,
      start_date: project.start_date,
      end_date: project.end_date,
      created_at: project.created_at,
      updated_at: project.updated_at,
      client: project.client_name ? {
        id: Number(project.cliente_id),
        nombre: project.client_name
      } : null,
      members: [] // Por ahora vacío
    };

    res.json({
      success: true,
      message: 'Proyecto obtenido exitosamente',
      data: formattedProject
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

    const {
      nombre,
      descripcion,
      cliente_id,
      priority = 'medium',
      start_date,
      end_date,
      project_manager_id
    } = req.body;

    // Validaciones básicas
    if (!nombre || !nombre.trim()) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del proyecto es obligatorio'
      });
    }

    // Insertar proyecto usando SQL directo
    const result = await prisma.$executeRaw`
      INSERT INTO management_projects (
        nombre, descripcion, cliente_id, priority, start_date, end_date, 
        project_manager_id, status, progress
      ) VALUES (
        ${nombre.trim()}, 
        ${descripcion?.trim() || null}, 
        ${cliente_id ? parseInt(cliente_id) : null},
        ${priority || 'medium'},
        ${start_date ? new Date(start_date) : null},
        ${end_date ? new Date(end_date) : null},
        ${project_manager_id ? parseInt(project_manager_id) : null},
        'planning',
        0
      )
    `;

    // Obtener el ID del proyecto creado
    const projectId = await prisma.$queryRaw`SELECT LAST_INSERT_ID() as id`;
    const newProjectId = Number(projectId[0].id);

    // Obtener el proyecto creado
    const createdProjectResult = await prisma.$queryRaw`
      SELECT 
        p.*,
        c.nombre as client_name
      FROM management_projects p
      LEFT JOIN clients c ON p.cliente_id = c.id
      WHERE p.id = ${newProjectId}
    `;

    const createdProject = convertBigIntToNumber(createdProjectResult[0]);

    res.status(201).json({
      success: true,
      message: 'Proyecto creado exitosamente',
      data: {
        id: Number(createdProject.id),
        nombre: createdProject.nombre,
        descripcion: createdProject.descripcion,
        status: createdProject.status,
        priority: createdProject.priority,
        progress: Number(createdProject.progress || 0),
        cliente_id: createdProject.cliente_id ? Number(createdProject.cliente_id) : null,
        start_date: createdProject.start_date,
        end_date: createdProject.end_date,
        created_at: createdProject.created_at,
        updated_at: createdProject.updated_at,
        client: createdProject.client_name ? {
          id: Number(createdProject.cliente_id),
          nombre: createdProject.client_name
        } : null,
        members: []
      }
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

    // Construir la query UPDATE dinámicamente
    const updates = [];
    const values = [];

    if (req.body.nombre !== undefined) {
      updates.push('nombre = ?');
      values.push(req.body.nombre.trim());
    }
    if (req.body.descripcion !== undefined) {
      updates.push('descripcion = ?');
      values.push(req.body.descripcion?.trim() || null);
    }
    if (req.body.cliente_id !== undefined) {
      updates.push('cliente_id = ?');
      values.push(req.body.cliente_id ? parseInt(req.body.cliente_id) : null);
    }
    if (req.body.priority !== undefined) {
      updates.push('priority = ?');
      values.push(req.body.priority);
    }
    if (req.body.status !== undefined) {
      updates.push('status = ?');
      values.push(req.body.status);
    }
    if (req.body.progress !== undefined) {
      updates.push('progress = ?');
      values.push(parseInt(req.body.progress));
    }
    if (req.body.start_date !== undefined) {
      updates.push('start_date = ?');
      values.push(req.body.start_date ? new Date(req.body.start_date) : null);
    }
    if (req.body.end_date !== undefined) {
      updates.push('end_date = ?');
      values.push(req.body.end_date ? new Date(req.body.end_date) : null);
    }

    if (updates.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No hay campos para actualizar'
      });
    }

    // Agregar updated_at
    updates.push('updated_at = NOW()');
    values.push(parseInt(id));

    const updateQuery = `
      UPDATE management_projects 
      SET ${updates.join(', ')} 
      WHERE id = ?
    `;

    await prisma.$executeRawUnsafe(updateQuery, ...values);

    // Obtener el proyecto actualizado
    const updatedProjectResult = await prisma.$queryRaw`
      SELECT 
        p.*,
        c.nombre as client_name
      FROM management_projects p
      LEFT JOIN clients c ON p.cliente_id = c.id
      WHERE p.id = ${parseInt(id)}
    `;

    if (updatedProjectResult.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    const updatedProject = convertBigIntToNumber(updatedProjectResult[0]);

    res.json({
      success: true,
      message: 'Proyecto actualizado exitosamente',
      data: {
        id: Number(updatedProject.id),
        nombre: updatedProject.nombre,
        descripcion: updatedProject.descripcion,
        status: updatedProject.status,
        priority: updatedProject.priority,
        progress: Number(updatedProject.progress || 0),
        cliente_id: updatedProject.cliente_id ? Number(updatedProject.cliente_id) : null,
        start_date: updatedProject.start_date,
        end_date: updatedProject.end_date,
        created_at: updatedProject.created_at,
        updated_at: updatedProject.updated_at,
        client: updatedProject.client_name ? {
          id: Number(updatedProject.cliente_id),
          nombre: updatedProject.client_name
        } : null,
        members: []
      }
    });

  } catch (error) {
    console.error('❌ Error actualizando proyecto:', error);
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

    // Verificar que existe
    const existingProject = await prisma.$queryRaw`
      SELECT nombre FROM management_projects WHERE id = ${parseInt(id)}
    `;

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto no encontrado'
      });
    }

    // Eliminar proyecto (hard delete por ahora)
    await prisma.$executeRaw`
      DELETE FROM management_projects WHERE id = ${parseInt(id)}
    `;

    res.json({
      success: true,
      message: 'Proyecto eliminado exitosamente',
      data: { id: parseInt(id), nombre: existingProject[0].nombre }
    });

  } catch (error) {
    console.error('❌ Error eliminando proyecto:', error);
    
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
