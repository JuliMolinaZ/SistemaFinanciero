// controllers/cuentasPagarController.js
const { prisma } = require('../config/database');
const { Parser } = require('json2csv');

// Obtener todas las cuentas por pagar con información completa del proveedor
exports.getAllCuentasPagar = async (req, res) => {
  try {

    // Consulta usando Prisma con relaciones
    const cuentasPagar = await prisma.cuentaPagar.findMany({
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
          pagado: 'asc'
        },
        {
          fecha: 'desc'
        }
      ]
    });
    
    // Transformar los datos para mantener la estructura esperada
    const transformedData = cuentasPagar.map(cp => {
      let estadoDetallado = 'Por Pagar';
      if (cp.pagado) {
        estadoDetallado = 'Pagada';
      } else if (cp.pagos_parciales > 0) {
        estadoDetallado = 'Pago Parcial';
      }
      
      const montoPendiente = parseFloat(cp.monto_con_iva) - (cp.pagos_parciales || 0);
      
      return {
        id: cp.id,
        concepto: cp.concepto,
        monto_neto: cp.monto_neto,
        monto_con_iva: cp.monto_con_iva,
        requiere_iva: cp.requiere_iva,
        categoria: cp.categoria,
        proveedor_id: cp.proveedor_id,
        fecha: cp.fecha,
        pagado: cp.pagado,
        pagos_parciales: cp.pagos_parciales,
        autorizado: cp.autorizado,
        monto_transferencia: cp.monto_transferencia,
        monto_efectivo: cp.monto_efectivo,
        created_at: cp.created_at,
        updated_at: cp.updated_at,
        proveedor_id_real: cp.provider?.id || null,
        proveedor_nombre: cp.provider?.nombre || null,
        proveedor_rfc: cp.provider?.run_proveedor || null,
        proveedor_email: cp.provider?.contacto || null,
        proveedor_telefono: cp.provider?.contacto || null,
        proveedor_direccion: cp.provider?.direccion || null,
        estado_detallado: estadoDetallado,
        dias_vencida: 0, // No hay fecha_vencimiento en el schema
        monto_pendiente: montoPendiente
      };
    });

    // Log de la primera cuenta para debugging
    if (transformedData.length > 0) {

    }
    
    res.json(transformedData);
  } catch (error) {
    console.error("❌ Error en getAllCuentasPagar:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener estadísticas de cuentas por pagar
exports.getEstadisticasCuentasPagar = async (req, res) => {
  try {
    const totalCuentas = await prisma.cuentaPagar.count();
    
    // Obtener cuentas pagadas
    const cuentasPagadas = await prisma.cuentaPagar.count({
      where: { pagado: true }
    });
    
    // Obtener cuentas pendientes
    const cuentasPendientes = await prisma.cuentaPagar.count({
      where: { pagado: false }
    });
    
    // Calcular totales monetarios
    const totalPagadas = await prisma.cuentaPagar.aggregate({
      _sum: {
        monto_con_iva: true
      },
      where: { pagado: true }
    });
    
    const totalPendientes = await prisma.cuentaPagar.aggregate({
      _sum: {
        monto_con_iva: true
      },
      where: { pagado: false }
    });
    
    const totalGeneral = await prisma.cuentaPagar.aggregate({
      _sum: {
        monto_con_iva: true
      }
    });
    
    // Calcular totales con pagos parciales
    const cuentasConPagosParciales = await prisma.cuentaPagar.findMany({
      where: {
        pagado: false,
        pagos_parciales: {
          gt: 0
        }
      },
      select: {
        monto_con_iva: true,
        pagos_parciales: true
      }
    });
    
    let totalPagosParciales = 0;
    cuentasConPagosParciales.forEach(cuenta => {
      totalPagosParciales += parseFloat(cuenta.pagos_parciales || 0);
    });
    
    const montoTotalPendiente = (totalPendientes._sum.monto_con_iva || 0) - totalPagosParciales;
    const montoTotalPagadas = totalPagadas._sum.monto_con_iva || 0;
    const montoTotalGeneral = totalGeneral._sum.monto_con_iva || 0;
    
    res.json({
      success: true,
      data: {
        totalCuentas,
        cuentasPagadas,
        cuentasPendientes,
        cuentasVencidas: 0, // No hay fecha_vencimiento en el schema
        montoTotalPendiente: parseFloat(montoTotalPendiente),
        montoTotalPagadas: parseFloat(montoTotalPagadas),
        montoTotalGeneral: parseFloat(montoTotalGeneral),
        totalPagosParciales: parseFloat(totalPagosParciales)
      },
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    console.error("❌ Error en getEstadisticasCuentasPagar:", error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener estadísticas'
    });
  }
};

// Obtener una cuenta por pagar por su ID
exports.getCuentaPagarById = async (req, res) => {
  try {
    const { id } = req.params;

    const cuentaPagar = await prisma.cuentaPagar.findUnique({
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
    
    if (!cuentaPagar) {
      console.error("❌ getCuentaPagarById: Cuenta no encontrada para id =", id);
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }

    res.json(cuentaPagar);
  } catch (error) {
    console.error("❌ Error al obtener cuenta por pagar:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cuenta por pagar
exports.createCuentaPagar = async (req, res) => {
  try {

    const {
      // Información básica
      concepto,
      descripcion,
      monto_neto,
      monto_con_iva,
      requiere_iva,
      categoria,
      subcategoria,
      
      // Información de proveedor
      proveedor_id,
      
      // Fechas
      fecha,
      fecha_vencimiento,
      fecha_pago_esperado,
      
      // Estado y pagos
      pagado,
      autorizado,
      prioridad,
      estado,
      
      // Montos de pago
      monto_transferencia,
      monto_efectivo,
      pagos_parciales,
      
      // Documentos
      factura_numero,
      factura_fecha,
      orden_compra,
      cotizacion_numero,
      
      // Notas y observaciones
      notas,
      observaciones,
      tags
    } = req.body;

    // Validaciones básicas
    if (!concepto || !monto_con_iva || !fecha) {
      return res.status(400).json({ 
        error: 'Los campos concepto, monto_con_iva y fecha son obligatorios' 
      });
    }

    const cuentaPagar = await prisma.cuentaPagar.create({
      data: {
        // Información básica
        concepto: concepto?.trim(),
        monto_neto: parseFloat(monto_neto) || 0,
        monto_con_iva: parseFloat(monto_con_iva) || 0,
        requiere_iva: requiere_iva || false,
        categoria: categoria?.trim(),
        proveedor_id: proveedor_id ? parseInt(proveedor_id) : null,
        
        // Fechas
        fecha: fecha ? new Date(fecha) : new Date(),
        
        // Estado y pagos
        pagado: pagado || false,
        pagos_parciales: parseFloat(pagos_parciales) || 0,
        autorizado: autorizado || false,
        monto_transferencia: parseFloat(monto_transferencia) || 0,
        monto_efectivo: parseFloat(monto_efectivo) || 0
      }
    });

    // Incluir información del proveedor en la respuesta
    const cuentaConProveedor = await prisma.cuentaPagar.findUnique({
      where: { id: cuentaPagar.id },
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

    res.status(201).json({
      success: true,
      message: 'Cuenta por pagar creada exitosamente',
      data: cuentaConProveedor
    });
  } catch (error) {
    console.error("❌ Error al crear cuenta por pagar:", error);
    res.status(500).json({ 
      success: false,
      error: error.message 
    });
  }
};

// Actualizar una cuenta por pagar
exports.updateCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      concepto,
      monto_neto,
      monto_con_iva,
      requiere_iva,
      categoria,
      proveedor_id,
      fecha,
      pagado,
      pagos_parciales,
      autorizado,
      monto_transferencia,
      monto_efectivo
    } = req.body;

    // Verificar si existe la cuenta
    const cuentaExistente = await prisma.cuentaPagar.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cuentaExistente) {
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }

    const cuentaPagar = await prisma.cuentaPagar.update({
      where: { id: parseInt(id) },
      data: {
        concepto: concepto?.trim(),
        monto_neto: parseFloat(monto_neto) || 0,
        monto_con_iva: parseFloat(monto_con_iva) || 0,
        requiere_iva: requiere_iva || false,
        categoria: categoria?.trim(),
        proveedor_id: proveedor_id ? parseInt(proveedor_id) : null,
        fecha: fecha ? new Date(fecha) : cuentaExistente.fecha,
        pagado: pagado || false,
        pagos_parciales: parseFloat(pagos_parciales) || 0,
        autorizado: autorizado || false,
        monto_transferencia: parseFloat(monto_transferencia) || 0,
        monto_efectivo: parseFloat(monto_efectivo) || 0
      }
    });

    res.json(cuentaPagar);
  } catch (error) {
    console.error("❌ Error al actualizar cuenta por pagar:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una cuenta por pagar
exports.deleteCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe la cuenta
    const cuentaExistente = await prisma.cuentaPagar.findUnique({
      where: { id: parseInt(id) }
    });

    if (!cuentaExistente) {
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }

    await prisma.cuentaPagar.delete({
      where: { id: parseInt(id) }
    });

    res.status(200).json({ message: 'Cuenta por Pagar eliminada exitosamente.' });
  } catch (error) {
    console.error("❌ Error al eliminar cuenta por pagar:", error);
    res.status(500).json({ error: error.message });
  }
};

// Exportar cuentas por pagar a CSV
exports.exportarCuentasPagarCSV = async (req, res) => {
  try {
    const cuentasPagar = await prisma.cuentaPagar.findMany({
      include: {
        provider: {
          select: {
            nombre: true
          }
        }
      },
      orderBy: {
        fecha: 'desc'
      }
    });

    const csvData = cuentasPagar.map(cp => ({
      ID: cp.id,
      Concepto: cp.concepto,
      'Monto Neto': cp.monto_neto,
      'Monto con IVA': cp.monto_con_iva,
      Categoría: cp.categoria,
      Proveedor: cp.provider?.nombre || 'N/A',
      Fecha: cp.fecha,
      Pagado: cp.pagado ? 'Sí' : 'No',
      'Pagos Parciales': cp.pagos_parciales,
      'Requiere IVA': cp.requiere_iva ? 'Sí' : 'No',
      Autorizado: cp.autorizado ? 'Sí' : 'No',
      'Monto Transferencia': cp.monto_transferencia,
      'Monto Efectivo': cp.monto_efectivo
    }));

    const parser = new Parser();
    const csv = parser.parse(csvData);

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=cuentas_por_pagar.csv');
    res.send(csv);
  } catch (error) {
    console.error("❌ Error en exportarCuentasPagarCSV:", error);
    res.status(500).json({ error: error.message });
  }
};

