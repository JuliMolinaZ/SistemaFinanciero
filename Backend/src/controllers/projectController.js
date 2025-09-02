// controllers/projectController.js
const { prisma } = require('../config/database');

exports.getAllProjects = async (req, res) => {
  try {
    const projects = await prisma.project.findMany({
      include: {
        client: true,
        phases: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    res.json(projects);
  } catch (error) {
    console.error('Error al obtener proyectos:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: {
        client: true,
        phases: true
      }
    });
    if (!project) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(project);
  } catch (error) {
    console.error('Error al obtener proyecto:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { nombre, cliente_id, monto_sin_iva, monto_con_iva, phase_id, estado, descripcion } = req.body;
    
    // Validar campos requeridos
    if (!nombre) {
      return res.status(400).json({ error: 'El nombre del proyecto es requerido' });
    }
    
    const project = await prisma.project.create({
      data: {
        nombre,
        cliente_id: cliente_id ? parseInt(cliente_id) : null,
        monto_sin_iva: monto_sin_iva ? parseFloat(monto_sin_iva) : null,
        monto_con_iva: monto_con_iva ? parseFloat(monto_con_iva) : null,
        phase_id: phase_id ? parseInt(phase_id) : null,
        estado: estado || 'activo',
        descripcion: descripcion || null
      }
    });
    res.status(201).json(project);
  } catch (error) {
    console.error('Error al crear proyecto:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    console.log('🔍 BACKEND - ==========================================');
    console.log('🔍 BACKEND - ACTUALIZACIÓN DE PROYECTO INICIADA');
    console.log('🔍 BACKEND - ID del proyecto:', id);
    console.log('🔍 BACKEND - req.body completo:', req.body);
    console.log('🔍 BACKEND - Tipo de req.body:', typeof req.body);
    console.log('🔍 BACKEND - req.body.keys:', Object.keys(req.body));
    console.log('🔍 BACKEND - req.body.length:', req.body ? Object.keys(req.body).length : 'undefined');
    console.log('🔍 BACKEND - req.headers:', req.headers);
    
    const { nombre, cliente_id, monto_sin_iva, monto_con_iva, phase_id, estado, descripcion } = req.body;
    
    console.log('🔍 BACKEND - Campos extraídos:', { nombre, cliente_id, monto_sin_iva, monto_con_iva, phase_id, estado, descripcion });
    
    // Construir objeto de datos solo con los campos enviados
    const updateData = {};
    
    if (nombre !== undefined) updateData.nombre = nombre;
    if (cliente_id !== undefined) updateData.cliente_id = cliente_id ? parseInt(cliente_id) : null;
    if (monto_sin_iva !== undefined) updateData.monto_sin_iva = monto_sin_iva ? parseFloat(monto_sin_iva) : null;
    if (monto_con_iva !== undefined) updateData.monto_con_iva = monto_con_iva ? parseFloat(monto_con_iva) : null;
    if (phase_id !== undefined) updateData.phase_id = phase_id ? parseInt(phase_id) : null;
    if (estado !== undefined) updateData.estado = estado;
    if (descripcion !== undefined) updateData.descripcion = descripcion;
    
    console.log('🔍 BACKEND - Datos a actualizar:', updateData);
    console.log('🔍 BACKEND - Total de campos a actualizar:', Object.keys(updateData).length);
    console.log('🔍 BACKEND - ==========================================');
    
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ message: 'Proyecto actualizado correctamente', project });
  } catch (error) {
    console.error('Error al actualizar proyecto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.updateProjectPhase = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { phaseId } = req.body;

    const project = await prisma.project.update({
      where: { id: parseInt(projectId) },
      data: {
        phase_id: phaseId ? parseInt(phaseId) : null
      }
    });

    res.json({ message: 'Fase asignada correctamente', project });
  } catch (error) {
    console.error('Error al actualizar fase del proyecto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    
    const project = await prisma.project.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Proyecto eliminado', project });
  } catch (error) {
    console.error('Error al eliminar proyecto:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }
    res.status(500).json({ error: error.message });
  }
};
