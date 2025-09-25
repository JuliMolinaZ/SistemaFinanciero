// controllers/moneyFlowRecoveryController.js
const { prisma } = require('../config/database');

// Obtener todos los registros de money flow recovery
exports.getAllMoneyFlowRecovery = async (req, res) => {
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

    const [moneyFlowRecovery, total] = await Promise.all([
      prisma.flow_recovery_v2.findMany({
        where: whereClause,
        include: {
          clients: {
            select: {
              id: true,
              nombre: true,
              run_cliente: true
            }
          },
          projects: {
            select: {
              id: true,
              nombre: true,
              descripcion: true
            }
          }
        },
        orderBy: { id: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.flow_recovery_v2.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: moneyFlowRecovery,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Registros de money flow recovery obtenidos exitosamente'
    });
  } catch (error) {
    console.error('❌ Error al obtener money flow recovery:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener money flow recovery'
    });
  }
};

// Obtener un registro de money flow recovery por ID
exports.getMoneyFlowRecoveryById = async (req, res) => {
  try {
    const { id } = req.params;
    const moneyFlowRecovery = await prisma.flow_recovery_v2.findUnique({
      where: { id: parseInt(id) },
      include: {
        clients: {
          select: {
            id: true,
            nombre: true,
            run_cliente: true
          }
        },
        projects: {
          select: {
            id: true,
            nombre: true,
            descripcion: true
          }
        }
      }
    });

    if (!moneyFlowRecovery) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registro de money flow recovery no encontrado' 
      });
    }

    res.json({
      success: true,
      data: moneyFlowRecovery,
      message: 'Registro de money flow recovery obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener money flow recovery:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener money flow recovery'
    });
  }
};

// Crear un nuevo registro de money flow recovery
exports.createMoneyFlowRecovery = async (req, res) => {
  try {

    const { 
      concepto, 
      monto, 
      fecha, 
      cliente_id, 
      proyecto_id, 
      categoria, 
      estado,
      descripcion,
      prioridad,
      notas,
      fecha_vencimiento,
      recuperado 
    } = req.body;

    if (!concepto || !monto) {
      return res.status(400).json({ 
        success: false, 
        message: 'Concepto y monto son requeridos' 
      });
    }

    // PROTECCIÓN CRÍTICA: Validar que el monto sea válido para creación
    const montoFinal = parseFloat(monto);
    if (isNaN(montoFinal) || montoFinal <= 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'El monto debe ser un número válido mayor a 0' 
      });
    }

    const moneyFlowRecovery = await prisma.flow_recovery_v2.create({
      data: {
        concepto: concepto.trim(),
        monto: montoFinal,
        fecha: fecha ? new Date(fecha) : new Date(),
        cliente_id: cliente_id ? parseInt(cliente_id) : null,
        proyecto_id: proyecto_id ? parseInt(proyecto_id) : null,
        categoria: categoria?.trim() || '',
        estado: estado?.trim() || 'pendiente',
        descripcion: descripcion?.trim() || '',
        prioridad: prioridad?.trim() || 'media',
        notas: notas?.trim() || '',
        fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
        recuperado: recuperado || false
      }
    });

    res.status(201).json({
      success: true,
      data: moneyFlowRecovery,
      message: 'Registro de money flow recovery creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear money flow recovery:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear money flow recovery'
    });
  }
};

// Actualizar un registro de money flow recovery
exports.updateMoneyFlowRecovery = async (req, res) => {
  try {

    const { id } = req.params;
    const { 
      concepto, 
      monto, 
      fecha, 
      cliente_id, 
      proyecto_id, 
      categoria, 
      estado,
      descripcion,
      prioridad,
      notas,
      fecha_vencimiento,
      recuperado 
    } = req.body;

    // Verificar si existe el registro
    const moneyFlowRecoveryExistente = await prisma.flow_recovery_v2.findUnique({
      where: { id: parseInt(id) }
    });

    if (!moneyFlowRecoveryExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registro de money flow recovery no encontrado' 
      });
    }

    // PROTECCIÓN CRÍTICA: Validar que el monto no se pierda
    let montoFinal = moneyFlowRecoveryExistente.monto;
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

    const moneyFlowRecovery = await prisma.flow_recovery_v2.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({
      success: true,
      data: moneyFlowRecovery,
      message: 'Registro de money flow recovery actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar money flow recovery:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar money flow recovery'
    });
  }
};

// Eliminar un registro de money flow recovery
exports.deleteMoneyFlowRecovery = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el registro
    const moneyFlowRecoveryExistente = await prisma.flow_recovery_v2.findUnique({
      where: { id: parseInt(id) }
    });

    if (!moneyFlowRecoveryExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Registro de money flow recovery no encontrado' 
      });
    }

    await prisma.flow_recovery_v2.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Registro de money flow recovery eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar money flow recovery:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar money flow recovery'
    });
  }
};
