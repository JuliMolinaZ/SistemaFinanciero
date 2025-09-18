// controllers/costosFijosController.js
const { prisma } = require('../config/database');

// Obtener todos los costos fijos
exports.getCostosFijos = async (req, res) => {
  try {
    const { mes } = req.query;
    
    // Construir filtro de mes si se proporciona
    let whereClause = {};
    if (mes && mes.trim()) {
      whereClause.fecha = {
        gte: new Date(`${mes}-01`),
        lt: new Date(new Date(`${mes}-01`).getFullYear(), new Date(`${mes}-01`).getMonth() + 1, 1)
      };
    }

    // Obtener costos fijos con filtro de fechas válidas
    let costos;
    try {
      costos = await prisma.costoFijo.findMany({
        where: {
          ...whereClause,
          fecha: { 
            not: null, 
            gte: new Date('1900-01-01') 
          }
        },
        orderBy: { id: 'desc' }
      });
    } catch (dateError) {
      // Si falla por fechas inválidas, intentar sin la columna fecha
      console.log('⚠️ Error con fechas, intentando sin filtro de fecha...');
      costos = await prisma.costoFijo.findMany({
        where: whereClause,
        select: {
          id: true,
          colaborador: true,
          puesto: true,
          monto_usd: true,
          monto_mxn: true,
          impuestos_imss: true,
          comentarios: true,
          created_at: true,
          updated_at: true,
          cuenta_creada: true
          // Excluimos fecha si causa problemas
        },
        orderBy: { id: 'desc' }
      });
    }

    res.json({
      success: true,
      data: costos,
      message: 'Costos fijos obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener costos fijos:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener costos fijos'
    });
  }
};

// Crear un nuevo costo fijo
exports.createCostoFijo = async (req, res) => {
  try {
    const { colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha } = req.body;

    const costoFijo = await prisma.costoFijo.create({
      data: {
        colaborador: colaborador?.trim(),
        puesto: puesto?.trim(),
        monto_usd: parseFloat(monto_usd) || 0,
        monto_mxn: parseFloat(monto_mxn) || 0,
        impuestos_imss: parseFloat(impuestos_imss) || 0,
        comentarios: comentarios?.trim(),
        fecha: fecha ? new Date(fecha) : null
      }
    });

    res.status(201).json({
      success: true,
      data: costoFijo,
      message: 'Costo fijo creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear costo fijo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear costo fijo'
    });
  }
};

// Actualizar un costo fijo
exports.updateCostoFijo = async (req, res) => {
  try {
    const { id } = req.params;
    const { colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha } = req.body;

    // Verificar si existe el costo fijo
    const costoExistente = await prisma.costoFijo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!costoExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Costo fijo no encontrado' 
      });
    }

    const costoFijo = await prisma.costoFijo.update({
      where: { id: parseInt(id) },
      data: {
        colaborador: colaborador?.trim(),
        puesto: puesto?.trim(),
        monto_usd: parseFloat(monto_usd) || 0,
        monto_mxn: parseFloat(monto_mxn) || 0,
        impuestos_imss: parseFloat(impuestos_imss) || 0,
        comentarios: comentarios?.trim(),
        fecha: fecha ? new Date(fecha) : null
      }
    });

    res.json({
      success: true,
      data: costoFijo,
      message: 'Costo fijo actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar costo fijo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar costo fijo'
    });
  }
};

// Eliminar un costo fijo
exports.deleteCostoFijo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el costo fijo
    const costoExistente = await prisma.costoFijo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!costoExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Costo fijo no encontrado' 
      });
    }

    await prisma.costoFijo.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Costo fijo eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar costo fijo:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar costo fijo'
    });
  }
};

// Enviar a cuentas por pagar
exports.enviarACuentasPagar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el costo fijo
    const costoFijo = await prisma.costoFijo.findUnique({
      where: { id: parseInt(id) }
    });

    if (!costoFijo) {
      return res.status(404).json({ 
        success: false, 
        message: 'Costo fijo no encontrado' 
      });
    }

    // Crear cuenta por pagar
    const cuentaPagar = await prisma.cuentaPagar.create({
      data: {
        concepto: `Costo fijo: ${costoFijo.colaborador} - ${costoFijo.puesto}`,
        monto_neto: costoFijo.monto_mxn,
        monto_con_iva: costoFijo.monto_mxn,
        categoria: 'Costos Fijos',
        fecha: new Date(),
        pagado: false,
        autorizado: true,
        requiere_iva: false,
        pagos_parciales: 0.00, // Debe ser Decimal, no Boolean
        monto_transferencia: 0.00,
        monto_efectivo: 0.00
      }
    });

    // Marcar como cuenta creada
    await prisma.costoFijo.update({
      where: { id: parseInt(id) },
      data: { cuenta_creada: true }
    });

    res.json({
      success: true,
      data: cuentaPagar,
      message: 'Costo fijo enviado a cuentas por pagar exitosamente'
    });
  } catch (error) {
    console.error('Error al enviar a cuentas por pagar:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al enviar a cuentas por pagar'
    });
  }
};
