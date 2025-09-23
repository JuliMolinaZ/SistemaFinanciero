const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ========================================
// CONTROLADOR DE GESTIÓN DE PROYECTOS (PM) - TABLA INDEPENDIENTE
// ========================================

/**
 * Obtener todos los proyectos de gestión (TABLA INDEPENDIENTE)
 */
const getAllProjects = async (req, res) => {
  try {
    console.log('🔍 GET /api/management-projects - Tabla management_projects');

    const { search } = req.query;

    // Query SQL directo para la tabla management_projects
    let projects;

    if (search) {
      projects = await prisma.$queryRaw`
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.cliente_id,
          p.project_manager_id,
          p.methodology_id,
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
        WHERE p.nombre LIKE ${`%${search}%`}
           OR p.descripcion LIKE ${`%${search}%`}
        ORDER BY p.created_at DESC
      `;
    } else {
      projects = await prisma.$queryRaw`
        SELECT
          p.id,
          p.nombre,
          p.descripcion,
          p.cliente_id,
          p.project_manager_id,
          p.methodology_id,
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
        ORDER BY p.created_at DESC
      `;
    }

    // Obtener miembros para cada proyecto
    for (let i = 0; i < projects.length; i++) {
      const projectId = projects[i].id;
      const members = await prisma.$queryRaw`
        SELECT
          m.id,
          m.user_id,
          m.role_id,
          m.team_type,
          u.name as user_name,
          r.name as role_name
        FROM management_project_members m
        LEFT JOIN users u ON m.user_id = u.id
        LEFT JOIN project_roles r ON m.role_id = r.id
        WHERE m.project_id = ${Number(projectId)} AND m.is_active = true
      `;

      // Convertir miembros al formato esperado
      projects[i].members = members.map(member => ({
        id: Number(member.id),
        user_id: Number(member.user_id),
        role_id: Number(member.role_id),
        team_type: member.team_type,
        user: {
          id: Number(member.user_id),
          name: member.user_name || `Usuario #${member.user_id}`
        },
        role: {
          id: Number(member.role_id),
          name: member.role_name || `Rol #${member.role_id}`
        }
      }));
    }

    // Convertir BigInt a Number
    const convertedProjects = projects.map(project => ({
      ...project,
      id: Number(project.id),
      cliente_id: project.cliente_id ? Number(project.cliente_id) : null,
      project_manager_id: project.project_manager_id ? Number(project.project_manager_id) : null,
      methodology_id: project.methodology_id ? Number(project.methodology_id) : null,
      progress: Number(project.progress),
      client: project.cliente_id ? {
        id: Number(project.cliente_id),
        nombre: project.client_name || `Cliente #${project.cliente_id}`
      } : null,
      project_manager: project.project_manager_id ? {
        id: Number(project.project_manager_id),
        nombre: 'Manager #' + project.project_manager_id
      } : null,
      methodology: project.methodology_id ? {
        id: Number(project.methodology_id),
        name: 'Metodología #' + project.methodology_id
      } : null,
      members: project.members || [] // Miembros obtenidos de la base de datos
    }));

    // Agrupar por cliente
    const groups = {};
    convertedProjects.forEach(project => {
      const clientId = project.cliente_id || 'sin-cliente';
      const clientName = project.client?.nombre || 'Sin Cliente';

      if (!groups[clientId]) {
        groups[clientId] = {
          clientId: project.cliente_id,
          clientName,
          count: 0,
          projects: []
        };
      }

      groups[clientId].count++;
      groups[clientId].projects.push(project);
    });

    const groupsArray = Object.values(groups);

    console.log(`✅ Encontrados ${convertedProjects.length} proyectos de gestión`);
    res.json({
      success: true,
      message: 'Proyectos obtenidos exitosamente',
      data: convertedProjects,
      groups: groupsArray,
      meta: {
        total: convertedProjects.length,
        groupCount: groupsArray.length,
        search: search || null
      }
    });
  } catch (error) {
    console.error('❌ Error al obtener proyectos de gestión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proyectos de gestión',
      error: error.message
    });
  }
};

/**
 * Obtener un proyecto de gestión por ID
 */
const getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 GET /api/management-projects/${id}`);

    const project = await prisma.$queryRaw`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.cliente_id,
        p.project_manager_id,
        p.methodology_id,
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
      WHERE p.id = ${parseInt(id)}
    `;

    if (project.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto de gestión no encontrado'
      });
    }

    const projectData = project[0];

    // Obtener miembros del proyecto
    const members = await prisma.$queryRaw`
      SELECT
        m.id,
        m.user_id,
        m.role_id,
        m.team_type,
        u.name as user_name,
        r.name as role_name
      FROM management_project_members m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN project_roles r ON m.role_id = r.id
      WHERE m.project_id = ${parseInt(id)} AND m.is_active = true
    `;

    // Convertir miembros al formato esperado
    const formattedMembers = members.map(member => ({
      id: Number(member.id),
      user_id: Number(member.user_id),
      role_id: Number(member.role_id),
      team_type: member.team_type,
      user: {
        id: Number(member.user_id),
        name: member.user_name || `Usuario #${member.user_id}`
      },
      role: {
        id: Number(member.role_id),
        name: member.role_name || `Rol #${member.role_id}`
      }
    }));

    const convertedProject = {
      ...projectData,
      id: Number(projectData.id),
      cliente_id: projectData.cliente_id ? Number(projectData.cliente_id) : null,
      project_manager_id: projectData.project_manager_id ? Number(projectData.project_manager_id) : null,
      methodology_id: projectData.methodology_id ? Number(projectData.methodology_id) : null,
      progress: Number(projectData.progress),
      client: projectData.cliente_id ? {
        id: Number(projectData.cliente_id),
        nombre: projectData.client_name || `Cliente #${projectData.cliente_id}`,
        color: projectData.client_color || '#3B82F6'
      } : null,
      project_manager: projectData.project_manager_id ? {
        id: Number(projectData.project_manager_id),
        nombre: 'Manager #' + projectData.project_manager_id
      } : null,
      methodology: projectData.methodology_id ? {
        id: Number(projectData.methodology_id),
        name: 'Metodología #' + projectData.methodology_id
      } : null,
      members: formattedMembers
    };

    console.log(`✅ Proyecto de gestión encontrado: ${convertedProject.nombre}`);
    res.json({
      success: true,
      message: 'Proyecto obtenido exitosamente',
      data: convertedProject
    });
  } catch (error) {
    console.error('❌ Error al obtener proyecto de gestión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener proyecto de gestión',
      error: error.message
    });
  }
};

/**
 * Crear un nuevo proyecto de gestión
 */
const createProject = async (req, res) => {
  try {
    const {
      nombre,
      descripcion,
      cliente_id,
      project_manager_id,
      methodology_id,
      status = 'planning',
      priority = 'medium',
      progress = 0,
      start_date,
      end_date,
      members = []
    } = req.body;

    console.log('🔍 POST /api/management-projects');
    console.log('📝 Datos recibidos:', { nombre, cliente_id, project_manager_id, members: members.length });

    // Validar datos requeridos
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre del proyecto es requerido'
      });
    }

    // Verificar si ya existe un proyecto con el mismo nombre
    const existingProject = await prisma.$queryRaw`
      SELECT id, nombre FROM management_projects 
      WHERE nombre = ${nombre} 
      LIMIT 1
    `;

    if (existingProject.length > 0) {
      return res.status(400).json({
        success: false,
        message: `Ya existe un proyecto con el nombre "${nombre}". Por favor, elige un nombre diferente.`
      });
    }

    const project = await prisma.$queryRaw`
      INSERT INTO management_projects (
        nombre, descripcion, cliente_id, project_manager_id, methodology_id,
        status, priority, progress, start_date, end_date,
        created_at, updated_at
      ) VALUES (
        ${nombre},
        ${descripcion || null},
        ${cliente_id ? parseInt(cliente_id) : null},
        ${project_manager_id ? parseInt(project_manager_id) : null},
        ${methodology_id ? parseInt(methodology_id) : null},
        ${status},
        ${priority},
        ${parseInt(progress)},
        ${start_date ? new Date(start_date) : null},
        ${end_date ? new Date(end_date) : null},
        NOW(),
        NOW()
      )
    `;

    // Obtener el proyecto creado
    const createdProject = await prisma.$queryRaw`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.cliente_id,
        p.project_manager_id,
        p.methodology_id,
        p.status,
        p.priority,
        p.progress,
        p.start_date,
        p.end_date,
        p.created_at,
        p.updated_at
      FROM management_projects p
      WHERE p.nombre = ${nombre}
      ORDER BY p.created_at DESC
      LIMIT 1
    `;

    const projectData = createdProject[0];
    const projectId = Number(projectData.id);

    // Guardar miembros del proyecto en la base de datos
    const savedMembers = [];
    if (members && members.length > 0) {
      console.log('💾 Guardando miembros del proyecto:', members);

      for (const member of members) {
        try {
          await prisma.$queryRaw`
            INSERT INTO management_project_members (
              project_id, user_id, role_id, team_type, is_active, created_at, updated_at
            ) VALUES (
              ${projectId},
              ${parseInt(member.user_id)},
              ${parseInt(member.role_id)},
              ${member.team_type || 'operations'},
              true,
              NOW(),
              NOW()
            )
          `;

          // Obtener información del usuario y rol para la respuesta
          const userInfo = await prisma.$queryRaw`
            SELECT name FROM users WHERE id = ${parseInt(member.user_id)} LIMIT 1
          `;
          const roleInfo = await prisma.$queryRaw`
            SELECT name FROM project_roles WHERE id = ${parseInt(member.role_id)} LIMIT 1
          `;

          savedMembers.push({
            user_id: parseInt(member.user_id),
            role_id: parseInt(member.role_id),
            team_type: member.team_type || 'operations',
            user: {
              id: parseInt(member.user_id),
              name: userInfo.length > 0 ? userInfo[0].name : `Usuario #${member.user_id}`
            },
            role: {
              id: parseInt(member.role_id),
              name: roleInfo.length > 0 ? roleInfo[0].name : `Rol #${member.role_id}`
            }
          });
        } catch (memberError) {
          console.error('❌ Error al guardar miembro:', memberError);
        }
      }
    }

    // Obtener el nombre real del cliente si existe
    let clientName = null;
    if (projectData.cliente_id) {
      try {
        const clientResult = await prisma.$queryRaw`
          SELECT nombre FROM clients WHERE id = ${Number(projectData.cliente_id)} LIMIT 1
        `;
        clientName = clientResult.length > 0 ? clientResult[0].nombre : `Cliente #${projectData.cliente_id}`;
      } catch (clientError) {
        console.warn('⚠️ No se pudo obtener nombre del cliente:', clientError.message);
        clientName = `Cliente #${projectData.cliente_id}`;
      }
    }

    const convertedProject = {
      ...projectData,
      id: Number(projectData.id),
      cliente_id: projectData.cliente_id ? Number(projectData.cliente_id) : null,
      project_manager_id: projectData.project_manager_id ? Number(projectData.project_manager_id) : null,
      methodology_id: projectData.methodology_id ? Number(projectData.methodology_id) : null,
      progress: Number(projectData.progress),
      client: projectData.cliente_id ? {
        id: Number(projectData.cliente_id),
        nombre: clientName
      } : null,
      project_manager: projectData.project_manager_id ? {
        id: Number(projectData.project_manager_id),
        nombre: 'Manager #' + projectData.project_manager_id
      } : null,
      methodology: projectData.methodology_id ? {
        id: Number(projectData.methodology_id),
        name: 'Metodología #' + projectData.methodology_id
      } : null,
      members: savedMembers  // Incluir los miembros guardados en la base de datos
    };

    console.log(`✅ Proyecto de gestión creado: ${convertedProject.nombre} (ID: ${convertedProject.id})`);
    res.status(201).json({
      success: true,
      message: 'Proyecto de gestión creado exitosamente',
      data: convertedProject
    });
  } catch (error) {
    console.error('❌ Error al crear proyecto de gestión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear proyecto de gestión',
      error: error.message
    });
  }
};

/**
 * Actualizar un proyecto de gestión
 */
const updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 DEBUG - ID recibido:', id, 'Tipo:', typeof id);
    console.log('🔍 DEBUG - Headers:', req.headers);
    console.log('🔍 DEBUG - Body length:', req.headers['content-length']);
    
    // Validar que el ID sea válido
    if (!id || id === 'undefined' || isNaN(parseInt(id))) {
      console.log('❌ ID inválido detectado:', id);
      return res.status(400).json({
        success: false,
        message: 'ID de proyecto inválido'
      });
    }

    const {
      nombre,
      descripcion,
      cliente_id,
      project_manager_id,
      methodology_id,
      status,
      priority,
      progress,
      start_date,
      end_date,
      current_phase_id,
      client_color
    } = req.body;

    console.log(`🔍 PUT /api/management-projects/${id}`);
    console.log('📝 Datos a actualizar:', { 
      nombre, 
      descripcion, 
      cliente_id, 
      project_manager_id, 
      status, 
      priority, 
      progress, 
      start_date, 
      end_date,
      current_phase_id,
      client_color
    });

    // Verificar que el proyecto existe
    const existingProject = await prisma.$queryRaw`
      SELECT id FROM management_projects WHERE id = ${parseInt(id)}
    `;

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto de gestión no encontrado'
      });
    }

    // Construir query de actualización usando $executeRaw con parámetros
    const updateFields = [];
    const updateValues = [];

    if (nombre !== undefined) {
      updateFields.push('nombre = ?');
      updateValues.push(nombre);
    }
    if (descripcion !== undefined) {
      updateFields.push('descripcion = ?');
      updateValues.push(descripcion);
    }
    if (cliente_id !== undefined) {
      updateFields.push('cliente_id = ?');
      updateValues.push(cliente_id ? parseInt(cliente_id) : null);
    }
    if (project_manager_id !== undefined) {
      updateFields.push('project_manager_id = ?');
      updateValues.push(project_manager_id ? parseInt(project_manager_id) : null);
    }
    if (methodology_id !== undefined) {
      updateFields.push('methodology_id = ?');
      updateValues.push(methodology_id ? parseInt(methodology_id) : null);
    }
    if (status !== undefined) {
      updateFields.push('status = ?');
      updateValues.push(status);
    }
    if (priority !== undefined) {
      updateFields.push('priority = ?');
      updateValues.push(priority);
    }
    if (progress !== undefined) {
      updateFields.push('progress = ?');
      updateValues.push(parseInt(progress));
    }
    if (start_date !== undefined) {
      updateFields.push('start_date = ?');
      updateValues.push(start_date ? new Date(start_date) : null);
    }
    if (end_date !== undefined) {
      updateFields.push('end_date = ?');
      updateValues.push(end_date ? new Date(end_date) : null);
    }
    if (current_phase_id !== undefined) {
      updateFields.push('current_phase_id = ?');
      updateValues.push(current_phase_id ? parseInt(current_phase_id) : null);
    }
    // client_color se maneja por separado ya que está en la tabla clients
    // No se incluye en la actualización de management_projects

    updateFields.push('updated_at = NOW()');
    updateValues.push(parseInt(id));

    const updateQuery = `
      UPDATE management_projects
      SET ${updateFields.join(', ')}
      WHERE id = ?
    `;

    console.log('🔧 Query de actualización:', updateQuery);
    console.log('🔧 Valores:', updateValues);

    await prisma.$executeRawUnsafe(updateQuery, ...updateValues);

    // Si se envió client_color, actualizar el color del cliente
    if (client_color !== undefined && cliente_id) {
      try {
        await prisma.$executeRaw`
          UPDATE clients 
          SET color = ${client_color}
          WHERE id = ${parseInt(cliente_id)}
        `;
        console.log('✅ Color del cliente actualizado:', client_color);
      } catch (clientColorError) {
        console.warn('⚠️ Error al actualizar color del cliente:', clientColorError.message);
        // No fallar la actualización del proyecto por este error
      }
    }

    // Obtener el proyecto actualizado con información del cliente
    const updatedProject = await prisma.$queryRaw`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.cliente_id,
        p.project_manager_id,
        p.methodology_id,
        p.status,
        p.priority,
        p.progress,
        p.start_date,
        p.end_date,
        p.created_at,
        p.updated_at,
        c.nombre as client_name,
        c.color as client_color
      FROM management_projects p
      LEFT JOIN clients c ON p.cliente_id = c.id
      WHERE p.id = ${parseInt(id)}
    `;

    const projectData = updatedProject[0];
    const convertedProject = {
      ...projectData,
      id: Number(projectData.id),
      cliente_id: projectData.cliente_id ? Number(projectData.cliente_id) : null,
      project_manager_id: projectData.project_manager_id ? Number(projectData.project_manager_id) : null,
      methodology_id: projectData.methodology_id ? Number(projectData.methodology_id) : null,
      progress: Number(projectData.progress),
      client: projectData.cliente_id ? {
        id: Number(projectData.cliente_id),
        nombre: projectData.client_name || `Cliente #${projectData.cliente_id}`,
        color: projectData.client_color || '#3B82F6'
      } : null,
      project_manager: projectData.project_manager_id ? {
        id: Number(projectData.project_manager_id),
        nombre: 'Manager #' + projectData.project_manager_id
      } : null,
      methodology: projectData.methodology_id ? {
        id: Number(projectData.methodology_id),
        name: 'Metodología #' + projectData.methodology_id
      } : null,
      members: []
    };

    console.log(`✅ Proyecto de gestión actualizado: ${convertedProject.nombre} (ID: ${convertedProject.id})`);
    res.json({
      success: true,
      message: 'Proyecto de gestión actualizado exitosamente',
      data: convertedProject
    });
  } catch (error) {
    console.error('❌ Error al actualizar proyecto de gestión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al actualizar proyecto de gestión',
      error: error.message
    });
  }
};

/**
 * Eliminar un proyecto de gestión
 */
const deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    console.log(`🔍 DELETE /api/management-projects/${id}`);

    // Verificar que el proyecto existe
    const existingProject = await prisma.$queryRaw`
      SELECT id, nombre FROM management_projects WHERE id = ${parseInt(id)}
    `;

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto de gestión no encontrado'
      });
    }

    const projectName = existingProject[0].nombre;

    // Eliminar el proyecto (esto eliminará automáticamente todas las tareas, sprints y miembros)
    await prisma.$executeRaw`
      DELETE FROM management_projects WHERE id = ${parseInt(id)}
    `;

    console.log(`✅ Proyecto de gestión eliminado: ${projectName} (ID: ${id})`);
    res.json({
      success: true,
      message: 'Proyecto de gestión eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al eliminar proyecto de gestión:', error);
    res.status(500).json({
      success: false,
      message: 'Error al eliminar proyecto de gestión',
      error: error.message
    });
  }
};

/**
 * Agregar miembro a un proyecto
 */
const addProjectMember = async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id, team_type, role_id = 1 } = req.body;

    console.log(`🔍 POST /api/management-projects/${id}/members`);
    console.log('📝 Datos del miembro:', { user_id, team_type, role_id });

    // Verificar que el proyecto existe
    const existingProject = await prisma.$queryRaw`
      SELECT id FROM management_projects WHERE id = ${parseInt(id)}
    `;

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto de gestión no encontrado'
      });
    }

    // Verificar que el usuario existe
    const existingUser = await prisma.$queryRaw`
      SELECT id, name FROM users WHERE id = ${parseInt(user_id)}
    `;

    if (existingUser.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Usuario no encontrado'
      });
    }

    // Verificar que el rol existe
    const existingRole = await prisma.$queryRaw`
      SELECT id, name FROM project_roles WHERE id = ${parseInt(role_id)}
    `;

    if (existingRole.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Rol no encontrado'
      });
    }

    // Verificar que el miembro no esté ya asignado
    const existingMember = await prisma.$queryRaw`
      SELECT id FROM management_project_members 
      WHERE project_id = ${parseInt(id)} AND user_id = ${parseInt(user_id)} AND is_active = true
    `;

    if (existingMember.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'El usuario ya está asignado a este proyecto'
      });
    }

    // Agregar el miembro al proyecto
    await prisma.$queryRaw`
      INSERT INTO management_project_members (
        project_id, user_id, role_id, team_type, is_active, created_at, updated_at
      ) VALUES (
        ${parseInt(id)},
        ${parseInt(user_id)},
        ${parseInt(role_id)},
        ${team_type || 'operations'},
        true,
        NOW(),
        NOW()
      )
    `;

    // Obtener el proyecto actualizado con todos los miembros
    const updatedProject = await prisma.$queryRaw`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.cliente_id,
        p.project_manager_id,
        p.methodology_id,
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
      WHERE p.id = ${parseInt(id)}
    `;

    const projectData = updatedProject[0];

    // Obtener todos los miembros del proyecto
    const members = await prisma.$queryRaw`
      SELECT
        m.id,
        m.user_id,
        m.role_id,
        m.team_type,
        u.name as user_name,
        r.name as role_name
      FROM management_project_members m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN project_roles r ON m.role_id = r.id
      WHERE m.project_id = ${parseInt(id)} AND m.is_active = true
    `;

    // Convertir miembros al formato esperado
    const formattedMembers = members.map(member => ({
      id: Number(member.id),
      user_id: Number(member.user_id),
      role_id: Number(member.role_id),
      team_type: member.team_type,
      user: {
        id: Number(member.user_id),
        name: member.user_name || `Usuario #${member.user_id}`
      },
      role: {
        id: Number(member.role_id),
        name: member.role_name || `Rol #${member.role_id}`
      }
    }));

    const convertedProject = {
      ...projectData,
      id: Number(projectData.id),
      cliente_id: projectData.cliente_id ? Number(projectData.cliente_id) : null,
      project_manager_id: projectData.project_manager_id ? Number(projectData.project_manager_id) : null,
      methodology_id: projectData.methodology_id ? Number(projectData.methodology_id) : null,
      progress: Number(projectData.progress),
      client: projectData.cliente_id ? {
        id: Number(projectData.cliente_id),
        nombre: projectData.client_name || `Cliente #${projectData.cliente_id}`,
        color: projectData.client_color || '#3B82F6'
      } : null,
      project_manager: projectData.project_manager_id ? {
        id: Number(projectData.project_manager_id),
        nombre: 'Manager #' + projectData.project_manager_id
      } : null,
      methodology: projectData.methodology_id ? {
        id: Number(projectData.methodology_id),
        name: 'Metodología #' + projectData.methodology_id
      } : null,
      members: formattedMembers
    };

    console.log(`✅ Miembro agregado al proyecto: ${convertedProject.nombre}`);
    res.json({
      success: true,
      message: 'Miembro agregado exitosamente',
      data: convertedProject
    });
  } catch (error) {
    console.error('❌ Error al agregar miembro al proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al agregar miembro al proyecto',
      error: error.message
    });
  }
};

/**
 * Remover miembro de un proyecto
 */
const removeProjectMember = async (req, res) => {
  try {
    const { id, memberId } = req.params;

    console.log(`🔍 DELETE /api/management-projects/${id}/members/${memberId}`);

    // Verificar que el proyecto existe
    const existingProject = await prisma.$queryRaw`
      SELECT id FROM management_projects WHERE id = ${parseInt(id)}
    `;

    if (existingProject.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Proyecto de gestión no encontrado'
      });
    }

    // Verificar que el miembro existe
    const existingMember = await prisma.$queryRaw`
      SELECT id FROM management_project_members 
      WHERE id = ${parseInt(memberId)} AND project_id = ${parseInt(id)} AND is_active = true
    `;

    if (existingMember.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Miembro no encontrado en este proyecto'
      });
    }

    // Marcar el miembro como inactivo (soft delete)
    await prisma.$queryRaw`
      UPDATE management_project_members 
      SET is_active = false, updated_at = NOW()
      WHERE id = ${parseInt(memberId)}
    `;

    // Obtener el proyecto actualizado con todos los miembros
    const updatedProject = await prisma.$queryRaw`
      SELECT
        p.id,
        p.nombre,
        p.descripcion,
        p.cliente_id,
        p.project_manager_id,
        p.methodology_id,
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
      WHERE p.id = ${parseInt(id)}
    `;

    const projectData = updatedProject[0];

    // Obtener todos los miembros activos del proyecto
    const members = await prisma.$queryRaw`
      SELECT
        m.id,
        m.user_id,
        m.role_id,
        m.team_type,
        u.name as user_name,
        r.name as role_name
      FROM management_project_members m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN project_roles r ON m.role_id = r.id
      WHERE m.project_id = ${parseInt(id)} AND m.is_active = true
    `;

    // Convertir miembros al formato esperado
    const formattedMembers = members.map(member => ({
      id: Number(member.id),
      user_id: Number(member.user_id),
      role_id: Number(member.role_id),
      team_type: member.team_type,
      user: {
        id: Number(member.user_id),
        name: member.user_name || `Usuario #${member.user_id}`
      },
      role: {
        id: Number(member.role_id),
        name: member.role_name || `Rol #${member.role_id}`
      }
    }));

    const convertedProject = {
      ...projectData,
      id: Number(projectData.id),
      cliente_id: projectData.cliente_id ? Number(projectData.cliente_id) : null,
      project_manager_id: projectData.project_manager_id ? Number(projectData.project_manager_id) : null,
      methodology_id: projectData.methodology_id ? Number(projectData.methodology_id) : null,
      progress: Number(projectData.progress),
      client: projectData.cliente_id ? {
        id: Number(projectData.cliente_id),
        nombre: projectData.client_name || `Cliente #${projectData.cliente_id}`,
        color: projectData.client_color || '#3B82F6'
      } : null,
      project_manager: projectData.project_manager_id ? {
        id: Number(projectData.project_manager_id),
        nombre: 'Manager #' + projectData.project_manager_id
      } : null,
      methodology: projectData.methodology_id ? {
        id: Number(projectData.methodology_id),
        name: 'Metodología #' + projectData.methodology_id
      } : null,
      members: formattedMembers
    };

    console.log(`✅ Miembro removido del proyecto: ${convertedProject.nombre}`);
    res.json({
      success: true,
      message: 'Miembro removido exitosamente',
      data: convertedProject
    });
  } catch (error) {
    console.error('❌ Error al remover miembro del proyecto:', error);
    res.status(500).json({
      success: false,
      message: 'Error al remover miembro del proyecto',
      error: error.message
    });
  }
};

module.exports = {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
  addProjectMember,
  removeProjectMember
};