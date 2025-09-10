const { prisma } = require('../config/database');

exports.getAllRecuperaciones = async (req, res) => {
  try {
    const recuperaciones = await prisma.recuperacion.findMany({
      include: {
        clients: {
          select: {
            nombre: true
          }
        },
        projects: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    // Transformar los datos para mantener la estructura esperada
    const transformedData = recuperaciones.map(r => ({
      id: r.id,
      concepto: r.concepto,
      monto: r.monto,
      fecha: r.fecha,
      recuperado: r.recuperado,
      cliente_nombre: r.clients?.nombre || null,
      proyecto_nombre: r.projects?.nombre || null
    }));

    res.json(transformedData);
  } catch (error) {
    console.error('Error al obtener recuperaciones:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getRecuperacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const recuperacion = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) },
      include: {
        clients: {
          select: {
            nombre: true
          }
        },
        projects: {
          select: {
            nombre: true
          }
        }
      }
    });

    if (!recuperacion) {
      return res.status(404).json({ message: 'Recuperación no encontrada' });
    }

    // Transformar los datos para mantener la estructura esperada
    const transformedData = {
      ...recuperacion,
      cliente_nombre: recuperacion.clients?.nombre || null,
      proyecto_nombre: recuperacion.projects?.nombre || null
    };

    res.json(transformedData);
  } catch (error) {
    console.error('Error al obtener recuperación por ID:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createRecuperacion = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado } = req.body;

    // Registrar en consola los datos recibidos para depuración
    console.log("Datos recibidos en createRecuperacion:", {
      concepto,
      monto,
      fecha,
      cliente_id,
      proyecto_id,
      categoria,
      recuperado
    });

    // Insertar en la base de datos usando Prisma
    const recuperacion = await prisma.recuperacion.create({
      data: {
        concepto: concepto?.trim(),
        monto: parseFloat(monto) || 0,
        fecha: fecha ? new Date(fecha) : new Date(),
        cliente_id: cliente_id ? parseInt(cliente_id) : null,
        proyecto_id: proyecto_id ? parseInt(proyecto_id) : null,
        categoria: categoria?.trim(),
        recuperado: recuperado || false
      }
    });

    // Responder con el nuevo registro creado
    res.status(201).json({ 
      id: recuperacion.id, 
      concepto: recuperacion.concepto, 
      monto: recuperacion.monto, 
      fecha: recuperacion.fecha, 
      cliente_id: recuperacion.cliente_id, 
      proyecto_id: recuperacion.proyecto_id, 
      categoria: recuperacion.categoria, 
      recuperado: recuperacion.recuperado 
    });
  } catch (error) {
    // Registrar error en consola y responder con mensaje de error
    console.error('Error en createRecuperacion:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecuperacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado } = req.body;

    // Verificar si existe la recuperación
    const recuperacionExistente = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!recuperacionExistente) {
      return res.status(404).json({ message: 'Recuperación no encontrada' });
    }

    const recuperacion = await prisma.recuperacion.update({
      where: { id: parseInt(id) },
      data: {
        concepto: concepto?.trim(),
        monto: parseFloat(monto) || 0,
        fecha: fecha ? new Date(fecha) : recuperacionExistente.fecha,
        cliente_id: cliente_id ? parseInt(cliente_id) : null,
        proyecto_id: proyecto_id ? parseInt(proyecto_id) : null,
        categoria: categoria?.trim(),
        recuperado: recuperado || false
      }
    });

    res.json({ 
      id: recuperacion.id, 
      concepto: recuperacion.concepto, 
      monto: recuperacion.monto, 
      fecha: recuperacion.fecha, 
      cliente_id: recuperacion.cliente_id, 
      proyecto_id: recuperacion.proyecto_id, 
      categoria: recuperacion.categoria, 
      recuperado: recuperacion.recuperado 
    });
  } catch (error) {
    console.error('Error al actualizar recuperación:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecuperacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la recuperación
    const recuperacion = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!recuperacion) {
      return res.status(404).json({ message: 'Recuperación no encontrada' });
    }

    await prisma.recuperacion.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Recuperación eliminada exitosamente' });
  } catch (error) {
    console.error('Error al eliminar recuperación:', error);
    res.status(500).json({ error: error.message });
  }
};

// Función para alternar el estado de recuperado
exports.toggleRecuperado = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la recuperación
    const recuperacion = await prisma.recuperacion.findUnique({
      where: { id: parseInt(id) }
    });

    if (!recuperacion) {
      return res.status(404).json({ message: 'Recuperación no encontrada' });
    }

    // Alternar el estado de recuperado
    const nuevoEstado = !recuperacion.recuperado;
    
    const recuperacionActualizada = await prisma.recuperacion.update({
      where: { id: parseInt(id) },
      data: {
        recuperado: nuevoEstado
      }
    });

    res.json({ 
      message: 'Estado de recuperado actualizado exitosamente',
      recuperado: nuevoEstado,
      id: recuperacionActualizada.id
    });
  } catch (error) {
    console.error('Error al alternar estado de recuperado:', error);
    res.status(500).json({ error: error.message });
  }
};