// controllers/emitidasController.js

const { prisma } = require('../config/database');

// Obtener todas las facturas emitidas
exports.getAllEmitidas = async (req, res) => {
  try {
    const { page = 1, limit = 50, fecha_inicio, fecha_fin, rfc, razon_social } = req.query;
    const offset = (page - 1) * limit;

    // Construir filtros
    let whereClause = {};
    
    if (fecha_inicio && fecha_fin) {
      whereClause.fechaEmision = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }
    
    if (rfc) {
      whereClause.rfcReceptor = { contains: rfc, mode: 'insensitive' };
    }
    
    if (razon_social) {
      whereClause.razonSocial = { contains: razon_social, mode: 'insensitive' };
    }

    const [emitidas, total] = await Promise.all([
      prisma.emitidas.findMany({
        where: whereClause,
        orderBy: { id: 'desc' },
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.emitidas.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: emitidas,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Facturas emitidas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener facturas emitidas:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener facturas emitidas'
    });
  }
};

// Obtener una factura emitida por ID
exports.getEmitidaById = async (req, res) => {
  try {
    const { id } = req.params;
    const emitida = await prisma.emitidas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!emitida) {
      return res.status(404).json({ 
        success: false, 
        message: 'Factura emitida no encontrada' 
      });
    }

    res.json({
      success: true,
      data: emitida,
      message: 'Factura emitida obtenida exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener factura emitida:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener factura emitida'
    });
  }
};

// Crear una nueva factura emitida
exports.createEmitida = async (req, res) => {
  try {
    const { 
      rfcReceptor, 
      razonSocial, 
      fechaEmision, 
      subtotal, 
      iva, 
      total, 
      claveSat, 
      descripcion, 
      facturaAdmon, 
      pue, 
      ppd, 
      pagos 
    } = req.body;

    // Procesar archivos subidos
    const facturasPDF = req.files?.facturasPDF ? req.files.facturasPDF.map(file => file.filename) : [];
    const facturasXML = req.files?.facturasXML ? req.files.facturasXML.map(file => file.filename) : [];
    const comprobantesPago = req.files?.comprobantesPago ? req.files.comprobantesPago.map(file => file.filename) : [];
    const complementosPDF = req.files?.complementosPDF ? req.files.complementosPDF.map(file => file.filename) : [];
    const complementosXML = req.files?.complementosXML ? req.files.complementosXML.map(file => file.filename) : [];

    const emitida = await prisma.emitidas.create({
      data: {
        rfcReceptor: rfcReceptor?.trim(),
        razonSocial: razonSocial?.trim(),
        fechaEmision: fechaEmision ? new Date(fechaEmision) : new Date(),
        subtotal: parseFloat(subtotal) || 0,
        iva: parseFloat(iva) || 0,
        total: parseFloat(total) || 0,
        claveSat: claveSat?.trim(),
        descripcion: descripcion?.trim(),
        facturaAdmon: Boolean(facturaAdmon),
        pue: Boolean(pue),
        ppd: Boolean(ppd),
        pagos: pagos,
        facturasPDF: facturasPDF.length > 0 ? facturasPDF : null,
        facturasXML: facturasXML.length > 0 ? facturasXML : null,
        comprobantesPago: comprobantesPago.length > 0 ? comprobantesPago : null,
        complementosPDF: complementosPDF.length > 0 ? complementosPDF : null,
        complementosXML: complementosXML.length > 0 ? complementosXML : null
      }
    });

    res.status(201).json({
      success: true,
      data: emitida,
      message: 'Factura emitida creada exitosamente'
    });
  } catch (error) {
    console.error('Error al crear factura emitida:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear factura emitida'
    });
  }
};

// Actualizar una factura emitida
exports.updateEmitida = async (req, res) => {
  try {

    const { id } = req.params;

    const { 
      rfcReceptor, 
      razonSocial, 
      fechaEmision, 
      subtotal, 
      iva, 
      total, 
      claveSat, 
      descripcion, 
      facturaAdmon, 
      pue, 
      ppd, 
      pagos 
    } = req.body;

    // Verificar si existe la factura emitida
    const emitidaExistente = await prisma.emitidas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!emitidaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Factura emitida no encontrada' 
      });
    }

    // Procesar archivos subidos
    const facturasPDF = req.files?.facturasPDF ? req.files.facturasPDF.map(file => file.filename) : [];
    const facturasXML = req.files?.facturasXML ? req.files.facturasXML.map(file => file.filename) : [];
    const comprobantesPago = req.files?.comprobantesPago ? req.files.comprobantesPago.map(file => file.filename) : [];
    const complementosPDF = req.files?.complementosPDF ? req.files.complementosPDF.map(file => file.filename) : [];
    const complementosXML = req.files?.complementosXML ? req.files.complementosXML.map(file => file.filename) : [];

    const emitida = await prisma.emitidas.update({
      where: { id: parseInt(id) },
      data: {
        rfcReceptor: rfcReceptor?.trim(),
        razonSocial: razonSocial?.trim(),
        fechaEmision: fechaEmision ? new Date(fechaEmision) : emitidaExistente.fechaEmision,
        subtotal: parseFloat(subtotal) || 0,
        iva: parseFloat(iva) || 0,
        total: parseFloat(total) || 0,
        claveSat: claveSat?.trim(),
        descripcion: descripcion?.trim(),
        facturaAdmon: Boolean(facturaAdmon),
        pue: Boolean(pue),
        ppd: Boolean(ppd),
        pagos: pagos,
        facturasPDF: facturasPDF.length > 0 ? facturasPDF : emitidaExistente.facturasPDF,
        facturasXML: facturasXML.length > 0 ? facturasXML : emitidaExistente.facturasXML,
        comprobantesPago: comprobantesPago.length > 0 ? comprobantesPago : emitidaExistente.comprobantesPago,
        complementosPDF: complementosPDF.length > 0 ? complementosPDF : emitidaExistente.complementosPDF,
        complementosXML: complementosXML.length > 0 ? complementosXML : emitidaExistente.complementosXML
      }
    });

    res.json({
      success: true,
      data: emitida,
      message: 'Factura emitida actualizada exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar factura emitida:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar factura emitida'
    });
  }
};

// Eliminar una factura emitida
exports.deleteEmitida = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la factura emitida
    const emitidaExistente = await prisma.emitidas.findUnique({
      where: { id: parseInt(id) }
    });

    if (!emitidaExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Factura emitida no encontrada' 
      });
    }

    await prisma.emitidas.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Factura emitida eliminada exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar factura emitida:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar factura emitida'
    });
  }
};
