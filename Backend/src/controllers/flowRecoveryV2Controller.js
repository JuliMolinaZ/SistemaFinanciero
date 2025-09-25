// controllers/flowRecoveryV2Controller.js
const { prisma } = require('../config/database');

// Obtener todos los registros de flow recovery v2
exports.getAllFlowRecoveryV2 = async (req, res) => {
  try {

    const { page = 1, limit = 50, fecha_inicio, fecha_fin, concepto, monto_min, monto_max } = req.query;
    const offset = (page - 1) * limit;

    // Construir filtros
    let whereClause = {};
    
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }
    
    if (concepto) {
      whereClause.concepto = { contains: concepto, mode: 'insensitive' };
    }
    
    if (monto_min || monto_max) {
      whereClause.monto = {};
      if (monto_min) whereClause.monto.gte = parseFloat(monto_min);
      if (monto_max) whereClause.monto.lte = parseFloat(monto_max);
    }

    const [flowRecovery, total] = await Promise.all([
      prisma.recuperacion.findMany({
        where: whereClause,
        orderBy: { id: 'desc' },
        skip: offset,
        take: parseInt(limit),
        include: {
          clients: true,
          projects: true
        }
      }),
      prisma.recuperacion.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: flowRecovery,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Registros de flow recovery v2 obtenidos exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al obtener flow recovery v2:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener flow recovery v2'
    });
  }
};

// Obtener un registro de flow recovery v2 por ID
exports.getFlowRecoveryV2ById = async (req, res) => {
  try {
    const { id } = req.params;
    const flowRecovery = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) },
      include: {
        clients: true,
        projects: true
      }
    });

    if (!flowRecovery) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registro de flow recovery v2 no encontrado' 
      });
    }

    res.json({
      success: true,
      data: flowRecovery,
      message: 'Registro de flow recovery v2 obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener flow recovery v2:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener flow recovery v2'
    });
  }
};

// Crear un nuevo registro de flow recovery v2
exports.createFlowRecoveryV2 = async (req, res) => {
  try {

    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, estado, descripcion, prioridad, notas, fecha_vencimiento, recuperado } = req.body;

    // PROTECCIÓN CRÍTICA: Validar monto
    if (!concepto || !monto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Concepto y monto son requeridos' 
      });
    }

    const montoFinal = parseFloat(monto);
    if (isNaN(montoFinal) || montoFinal <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Monto debe ser un número válido mayor a 0' 
      });
    }

    const flowRecovery = await prisma.recuperacion.create({
      data: {
        concepto: concepto.trim(),
        monto: montoFinal,
        fecha: fecha ? new Date(fecha) : new Date(),
        cliente_id: cliente_id ? parseInt(cliente_id) : null,
        proyecto_id: proyecto_id ? parseInt(proyecto_id) : null,
        categoria: categoria?.trim() || '',
        estado: estado || 'pendiente',
        descripcion: descripcion?.trim() || '',
        prioridad: prioridad || 'media',
        notas: notas?.trim() || '',
        fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
        recuperado: recuperado || false
      }
    });

    res.status(201).json({
      success: true,
      data: flowRecovery,
      message: 'Registro de flow recovery v2 creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear flow recovery v2:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear flow recovery v2'
    });
  }
};

// Actualizar un registro de flow recovery v2
exports.updateFlowRecoveryV2 = async (req, res) => {
  try {

    const { id } = req.params;
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, estado, descripcion, prioridad, notas, fecha_vencimiento, recuperado } = req.body;

    // Verificar si existe el registro
    const flowRecoveryExistente = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!flowRecoveryExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registro de flow recovery v2 no encontrado' 
      });
    }

    // PROTECCIÓN CRÍTICA: Validar que el monto no se pierda
    let montoFinal = flowRecoveryExistente.monto;
    if (monto !== undefined && monto !== null && monto !== '') {
      const montoNuevo = parseFloat(monto);
      if (!isNaN(montoNuevo) && montoNuevo > 0) {
        montoFinal = montoNuevo;
      } else {

      }
    }

    // PROTECCIÓN CRÍTICA: Solo actualizar campos que realmente se enviaron
    const updateData = {};
    
    // Solo actualizar campos que se enviaron explícitamente
    if (concepto !== undefined && concepto !== null && concepto !== '') {
      updateData.concepto = concepto.trim();
    }
    
    updateData.monto = montoFinal; // Ya validado arriba
    
    if (fecha !== undefined && fecha !== null && fecha !== '') {
      updateData.fecha = new Date(fecha);
    }
    
    // PROTECCIÓN CRÍTICA: Solo actualizar cliente_id si se envió explícitamente
    if (cliente_id !== undefined && cliente_id !== null && cliente_id !== '') {
      updateData.cliente_id = parseInt(cliente_id);
    }
    
    // PROTECCIÓN CRÍTICA: Solo actualizar proyecto_id si se envió explícitamente
    if (proyecto_id !== undefined && proyecto_id !== null && proyecto_id !== '') {
      updateData.proyecto_id = parseInt(proyecto_id);
    }
    
    if (categoria !== undefined && categoria !== null && categoria !== '') {
      updateData.categoria = categoria.trim();
    }
    
    if (estado !== undefined && estado !== null && estado !== '') {
      updateData.estado = estado.trim();
    }
    
    if (descripcion !== undefined && descripcion !== null && descripcion !== '') {
      updateData.descripcion = descripcion.trim();
    }
    
    if (prioridad !== undefined && prioridad !== null && prioridad !== '') {
      updateData.prioridad = prioridad.trim();
    }
    
    if (notas !== undefined && notas !== null && notas !== '') {
      updateData.notas = notas.trim();
    }
    
    if (fecha_vencimiento !== undefined && fecha_vencimiento !== null && fecha_vencimiento !== '') {
      updateData.fecha_vencimiento = new Date(fecha_vencimiento);
    }
    
    if (recuperado !== undefined && recuperado !== null) {
      updateData.recuperado = Boolean(recuperado);
    }

    const flowRecovery = await prisma.recuperacion.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: flowRecovery,
      message: 'Registro de flow recovery v2 actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar flow recovery v2:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar flow recovery v2'
    });
  }
};

// Eliminar un registro de flow recovery v2
exports.deleteFlowRecoveryV2 = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el registro
    const flowRecoveryExistente = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!flowRecoveryExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registro de flow recovery v2 no encontrado' 
      });
    }

    await prisma.recuperacion.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Registro de flow recovery v2 eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar flow recovery v2:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar flow recovery v2'
    });
  }
};
