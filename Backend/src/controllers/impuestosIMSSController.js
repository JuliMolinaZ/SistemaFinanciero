// controllers/impuestosIMSSController.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { Parser } = require('json2csv');

// Obtener todos los impuestos e IMSS con información completa del proveedor
exports.getAllImpuestosIMSS = async (req, res) => {
  try {

    // Consulta usando Prisma con relaciones
    const impuestosIMSS = await prisma.impuestosIMSS.findMany({
      include: {
        provider: {
          select: {
            id: true,
            nombre: true,
            run_proveedor: true,
            direccion: true,
            elemento: true,
            datos_bancarios: true,
            contacto: true
          }
        }
      },
      orderBy: [
        {
          estado: 'asc'
        },
        {
          fecha_vencimiento: 'asc'
        }
      ]
    });
    
    // Transformar los datos para mantener la estructura esperada
    const transformedData = impuestosIMSS.map(imp => {
      let estadoDetallado = 'Pendiente';
      if (imp.estado === 'pagado') {
        estadoDetallado = 'Pagado';
      } else if (imp.estado === 'vencido') {
        estadoDetallado = 'Vencido';
      }
      
      // Calcular días de vencimiento
      let diasVencido = 0;
      if (imp.fecha_vencimiento && imp.estado !== 'pagado') {
        const hoy = new Date();
        const vencimiento = new Date(imp.fecha_vencimiento);
        const diffTime = hoy - vencimiento;
        diasVencido = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      }
      
      return {
        id: imp.id,
        concepto: imp.concepto,
        tipo_impuesto: imp.tipo_impuesto,
        monto_base: imp.monto_base,
        monto_impuesto: imp.monto_impuesto,
        monto_total: imp.monto_total,
        fecha_vencimiento: imp.fecha_vencimiento,
        fecha_pago: imp.fecha_pago,
        estado: imp.estado,
        periodo: imp.periodo,
        proveedor_id: imp.proveedor_id,
        factura_pdf: imp.factura_pdf,
        factura_xml: imp.factura_xml,
        comentarios: imp.comentarios,
        autorizado: imp.autorizado,
        created_at: imp.created_at,
        updated_at: imp.updated_at,
        proveedor_id_real: imp.provider?.id || null,
        proveedor_nombre: imp.provider?.nombre || null,
        proveedor_rfc: imp.provider?.run_proveedor || null,
        proveedor_email: imp.provider?.contacto || null,
        proveedor_telefono: imp.provider?.contacto || null,
        proveedor_direccion: imp.provider?.direccion || null,
        estado_detallado: estadoDetallado,
        dias_vencido: diasVencido
      };
    });

    // Log de la primera cuenta para debugging
    if (transformedData.length > 0) {

    }
    
    res.json(transformedData);
  } catch (error) {
    console.error("❌ Error en getAllImpuestosIMSS:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener estadísticas de impuestos e IMSS
exports.getEstadisticasImpuestosIMSS = async (req, res) => {
  try {
    const totalImpuestos = await prisma.impuestosIMSS.count();
    
    // Obtener impuestos pagados
    const impuestosPagados = await prisma.impuestosIMSS.count({
      where: { estado: 'pagado' }
    });
    
    // Obtener impuestos pendientes
    const impuestosPendientes = await prisma.impuestosIMSS.count({
      where: { estado: 'pendiente' }
    });
    
    // Obtener impuestos vencidos
    const impuestosVencidos = await prisma.impuestosIMSS.count({
      where: { estado: 'vencido' }
    });
    
    // Obtener totales por tipo de impuesto
    const totalesPorTipo = await prisma.impuestosIMSS.groupBy({
      by: ['tipo_impuesto'],
      _sum: {
        monto_total: true
      }
    });
    
    // Calcular totales
    const totalMonto = await prisma.impuestosIMSS.aggregate({
      _sum: {
        monto_total: true
      }
    });
    
    const totalMontoPagado = await prisma.impuestosIMSS.aggregate({
      where: { estado: 'pagado' },
      _sum: {
        monto_total: true
      }
    });
    
    const totalMontoPendiente = await prisma.impuestosIMSS.aggregate({
      where: { estado: 'pendiente' },
      _sum: {
        monto_total: true
      }
    });
    
    const totalMontoVencido = await prisma.impuestosIMSS.aggregate({
      where: { estado: 'vencido' },
      _sum: {
        monto_total: true
      }
    });
    
    // Obtener impuestos por mes (últimos 12 meses)
    const doceMesesAtras = new Date();
    doceMesesAtras.setMonth(doceMesesAtras.getMonth() - 12);
    
    const impuestosPorMes = await prisma.impuestosIMSS.groupBy({
      by: ['periodo'],
      where: {
        created_at: {
          gte: doceMesesAtras
        }
      },
      _sum: {
        monto_total: true
      },
      _count: true
    });
    
    const estadisticas = {
      total_impuestos: totalImpuestos,
      impuestos_pagados: impuestosPagados,
      impuestos_pendientes: impuestosPendientes,
      impuestos_vencidos: impuestosVencidos,
      total_monto: totalMonto._sum.monto_total || 0,
      total_monto_pagado: totalMontoPagado._sum.monto_total || 0,
      total_monto_pendiente: totalMontoPendiente._sum.monto_total || 0,
      total_monto_vencido: totalMontoVencido._sum.monto_total || 0,
      totales_por_tipo: totalesPorTipo,
      impuestos_por_mes: impuestosPorMes,
      porcentaje_pagado: totalImpuestos > 0 ? ((impuestosPagados / totalImpuestos) * 100).toFixed(2) : 0,
      porcentaje_pendiente: totalImpuestos > 0 ? ((impuestosPendientes / totalImpuestos) * 100).toFixed(2) : 0,
      porcentaje_vencido: totalImpuestos > 0 ? ((impuestosVencidos / totalImpuestos) * 100).toFixed(2) : 0
    };

    res.json(estadisticas);
  } catch (error) {
    console.error("❌ Error en getEstadisticasImpuestosIMSS:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener impuesto por ID
exports.getImpuestoIMSSById = async (req, res) => {
  try {
    const { id } = req.params;

    const impuesto = await prisma.impuestosIMSS.findUnique({
      where: { id: parseInt(id) },
      include: {
        provider: {
          select: {
            id: true,
            nombre: true,
            run_proveedor: true,
            direccion: true,
            elemento: true,
            datos_bancarios: true,
            contacto: true
          }
        }
      }
    });
    
    if (!impuesto) {

      return res.status(404).json({ error: 'Impuesto no encontrado' });
    }

    res.json(impuesto);
  } catch (error) {
    console.error("❌ Error en getImpuestoIMSSById:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear nuevo impuesto
exports.createImpuestoIMSS = async (req, res) => {
  try {

    const {
      concepto,
      tipo_impuesto,
      monto_base,
      monto_impuesto,
      monto_total,
      fecha_vencimiento,
      periodo,
      proveedor_id,
      comentarios
    } = req.body;
    
    // Validar campos requeridos
    if (!concepto || !tipo_impuesto || !monto_total || !periodo) {
      return res.status(400).json({
        error: 'Los campos concepto, tipo_impuesto, monto_total y periodo son requeridos'
      });
    }
    
    // Crear el impuesto
    const nuevoImpuesto = await prisma.impuestosIMSS.create({
      data: {
        concepto,
        tipo_impuesto,
        monto_base: monto_base ? parseFloat(monto_base) : null,
        monto_impuesto: monto_impuesto ? parseFloat(monto_impuesto) : null,
        monto_total: parseFloat(monto_total),
        fecha_vencimiento: fecha_vencimiento ? new Date(fecha_vencimiento) : null,
        periodo,
        proveedor_id: proveedor_id ? parseInt(proveedor_id) : null,
        comentarios,
        estado: 'pendiente',
        autorizado: false
      }
    });

    res.status(201).json(nuevoImpuesto);
  } catch (error) {
    console.error("❌ Error en createImpuestoIMSS:", error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar impuesto
exports.updateImpuestoIMSS = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      concepto,
      tipo_impuesto,
      monto_base,
      monto_impuesto,
      monto_total,
      fecha_vencimiento,
      fecha_pago,
      estado,
      periodo,
      proveedor_id,
      factura_pdf,
      factura_xml,
      comentarios,
      autorizado
    } = req.body;
    
    // Construir objeto de actualización dinámicamente
    const updateData = {};
    if (concepto !== undefined) updateData.concepto = concepto;
    if (tipo_impuesto !== undefined) updateData.tipo_impuesto = tipo_impuesto;
    if (monto_base !== undefined) updateData.monto_base = monto_base ? parseFloat(monto_base) : null;
    if (monto_impuesto !== undefined) updateData.monto_impuesto = monto_impuesto ? parseFloat(monto_impuesto) : null;
    if (monto_total !== undefined) updateData.monto_total = monto_total ? parseFloat(monto_total) : null;
    if (fecha_vencimiento !== undefined) updateData.fecha_vencimiento = fecha_vencimiento ? new Date(fecha_vencimiento) : null;
    if (fecha_pago !== undefined) updateData.fecha_pago = fecha_pago ? new Date(fecha_pago) : null;
    if (estado !== undefined) updateData.estado = estado;
    if (periodo !== undefined) updateData.periodo = periodo;
    if (proveedor_id !== undefined) updateData.proveedor_id = proveedor_id ? parseInt(proveedor_id) : null;
    if (factura_pdf !== undefined) updateData.factura_pdf = factura_pdf;
    if (factura_xml !== undefined) updateData.factura_xml = factura_xml;
    if (comentarios !== undefined) updateData.comentarios = comentarios;
    if (autorizado !== undefined) updateData.autorizado = autorizado;

    const impuestoActualizado = await prisma.impuestosIMSS.update({
      where: { id: parseInt(id) },
      data: updateData
    });

    res.json({ message: 'Impuesto actualizado correctamente', impuesto: impuestoActualizado });
  } catch (error) {
    console.error("❌ Error en updateImpuestoIMSS:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar impuesto
exports.deleteImpuestoIMSS = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.impuestosIMSS.delete({
      where: { id: parseInt(id) }
    });

    res.json({ message: 'Impuesto eliminado correctamente' });
  } catch (error) {
    console.error("❌ Error en deleteImpuestoIMSS:", error);
    res.status(500).json({ error: error.message });
  }
};

// Exportar impuestos a CSV
exports.exportarImpuestosIMSSCSV = async (req, res) => {
  try {

    const impuestos = await prisma.impuestosIMSS.findMany({
      include: {
        provider: {
          select: {
            nombre: true,
            run_proveedor: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    
    // Transformar datos para exportación
    const datosExportacion = impuestos.map(imp => ({
      ID: imp.id,
      Concepto: imp.concepto,
      'Tipo de Impuesto': imp.tipo_impuesto,
      'Monto Base': imp.monto_base,
      'Monto Impuesto': imp.monto_impuesto,
      'Monto Total': imp.monto_total,
      'Fecha Vencimiento': imp.fecha_vencimiento ? new Date(imp.fecha_vencimiento).toLocaleDateString('es-MX') : 'N/A',
      'Fecha Pago': imp.fecha_pago ? new Date(imp.fecha_pago).toLocaleDateString('es-MX') : 'N/A',
      Estado: imp.estado,
      Periodo: imp.periodo,
      'Proveedor': imp.provider?.nombre || 'N/A',
      'RFC Proveedor': imp.provider?.run_proveedor || 'N/A',
      Autorizado: imp.autorizado ? 'Sí' : 'No',
      Comentarios: imp.comentarios || 'N/A',
      'Fecha Creación': new Date(imp.created_at).toLocaleDateString('es-MX')
    }));
    
    // Configurar parser CSV
    const parser = new Parser({
      fields: Object.keys(datosExportacion[0] || {}),
      delimiter: ','
    });
    
    const csv = parser.parse(datosExportacion);
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', `attachment; filename=impuestos_imss_${new Date().toISOString().split('T')[0]}.csv`);

    res.send(csv);
  } catch (error) {
    console.error("❌ Error en exportarImpuestosIMSSCSV:", error);
    res.status(500).json({ error: error.message });
  }
};
