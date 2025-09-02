// controllers/cuentasCobrarController.js
const { prisma } = require('../config/database');

exports.getAllCuentasCobrar = async (req, res) => {
  try {
    const cuentas = await prisma.cuentaCobrar.findMany({
      include: {
        projects: true
      },
      orderBy: {
        created_at: 'desc'
      }
    });
    res.json(cuentas);
  } catch (error) {
    console.error('Error al obtener cuentas por cobrar:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getCuentaCobrarById = async (req, res) => {
  try {
    const { id } = req.params;
    const cuenta = await prisma.cuentaCobrar.findUnique({
      where: { id: parseInt(id) },
      include: {
        projects: true
      }
    });
    if (!cuenta) return res.status(404).json({ message: 'Cuenta por Cobrar no encontrada' });
    res.json(cuenta);
  } catch (error) {
    console.error('Error al obtener cuenta por cobrar:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createCuentaCobrar = async (req, res) => {
  try {
    const { proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha, estado } = req.body;
    const cuenta = await prisma.cuentaCobrar.create({
      data: {
        proyecto_id: proyecto_id ? parseInt(proyecto_id) : null,
        concepto,
        monto_sin_iva: monto_sin_iva ? parseFloat(monto_sin_iva) : null,
        monto_con_iva: monto_con_iva ? parseFloat(monto_con_iva) : null,
        fecha: fecha ? new Date(fecha) : null,
        estado: estado || 'pendiente'
      }
    });
    res.status(201).json(cuenta);
  } catch (error) {
    console.error('Error al crear cuenta por cobrar:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateCuentaCobrar = async (req, res) => {
  try {
    const { id } = req.params;
    const { proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha, estado } = req.body;
    
    const cuenta = await prisma.cuentaCobrar.update({
      where: { id: parseInt(id) },
      data: {
        proyecto_id: proyecto_id ? parseInt(proyecto_id) : null,
        concepto,
        monto_sin_iva: monto_sin_iva ? parseFloat(monto_sin_iva) : null,
        monto_con_iva: monto_con_iva ? parseFloat(monto_con_iva) : null,
        fecha: fecha ? new Date(fecha) : null,
        estado: estado || 'pendiente'
      }
    });
    
    res.json(cuenta);
  } catch (error) {
    console.error('Error al actualizar cuenta por cobrar:', error);
    if (error.code === 'P2025') {
      return res.status(404).json({ message: 'Cuenta por Cobrar no encontrada' });
    }
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCuentaCobrar = async (req, res) => {
  try {
    const { id } = req.params;
    
    // En lugar de eliminar, marcamos como inactivo
    // Como no existe un campo de status en el esquema actual,
    // comentamos esta funcionalidad para evitar borrar datos
    res.status(403).json({ 
      message: 'No se permite eliminar cuentas por cobrar. Los datos deben mantenerse por razones de auditoría.',
      error: 'DELETE_OPERATION_NOT_ALLOWED'
    });
    
    // Alternativa: si se quiere implementar un soft delete, se necesitaría:
    // 1. Agregar un campo 'status' o 'deleted_at' al esquema
    // 2. Cambiar delete por update con el nuevo campo
  } catch (error) {
    console.error('Error al procesar solicitud de eliminación:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener estadísticas de cuentas por cobrar
exports.getEstadisticasCuentasCobrar = async (req, res) => {
  try {
    const totalCuentas = await prisma.cuentaCobrar.count();
    
    // Obtener cuentas pendientes (sin fecha de pago o con fecha futura)
    const cuentasPendientes = await prisma.cuentaCobrar.count({
      where: {
        OR: [
          { fecha: null },
          { fecha: { gt: new Date() } }
        ]
      }
    });
    
    // Obtener cuentas pagadas (con fecha de pago en el pasado)
    const cuentasPagadas = await prisma.cuentaCobrar.count({
      where: {
        fecha: { lte: new Date() }
      }
    });
    
    // Calcular totales monetarios
    const totalPendientes = await prisma.cuentaCobrar.aggregate({
      _sum: {
        monto_con_iva: true
      },
      where: {
        OR: [
          { fecha: null },
          { fecha: { gt: new Date() } }
        ]
      }
    });
    
    const totalPagadas = await prisma.cuentaCobrar.aggregate({
      _sum: {
        monto_con_iva: true
      },
      where: {
        fecha: { lte: new Date() }
      }
    });
    
    const totalGeneral = await prisma.cuentaCobrar.aggregate({
      _sum: {
        monto_con_iva: true
      }
    });
    
    const estadisticas = {
      totalCuentas,
      cuentasPendientes,
      cuentasPagadas,
      montoTotalPendiente: parseFloat(totalPendientes._sum.monto_con_iva || 0),
      montoTotalPagadas: parseFloat(totalPagadas._sum.monto_con_iva || 0),
      montoTotalGeneral: parseFloat(totalGeneral._sum.monto_con_iva || 0)
    };
    
    res.json({
      success: true,
      data: estadisticas,
      message: 'Estadísticas de cuentas por cobrar obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener estadísticas de cuentas por cobrar:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener estadísticas de cuentas por cobrar'
    });
  }
};

// Generar reporte Excel de cuentas por cobrar
exports.generarReporteExcel = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin, estado } = req.query;
    
    let whereClause = {};
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }
    
    if (estado && estado !== 'todos') {
      whereClause.estado = estado;
    }

    const cuentas = await prisma.cuentaCobrar.findMany({
      where: whereClause,
      include: {
        projects: {
          include: {
            client: true
          }
        }
      },
      orderBy: [
        { fecha: 'asc' },
        { id: 'asc' }
      ]
    });

    const ExcelJS = require('exceljs');
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Cuentas por Cobrar');

    // Configurar columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Proyecto', key: 'proyecto', width: 30 },
      { header: 'Cliente', key: 'cliente', width: 30 },
      { header: 'Concepto', key: 'concepto', width: 40 },
      { header: 'Monto Sin IVA', key: 'monto_sin_iva', width: 15 },
      { header: 'Monto Con IVA', key: 'monto_con_iva', width: 15 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Estado', key: 'estado', width: 15 },
      { header: 'Fecha Creación', key: 'created_at', width: 20 }
    ];

    // Agregar datos
    cuentas.forEach(cuenta => {
      worksheet.addRow({
        id: cuenta.id,
        proyecto: cuenta.projects?.nombre || 'Sin proyecto',
        cliente: cuenta.projects?.client?.nombre || 'Sin cliente',
        concepto: cuenta.concepto || '',
        monto_sin_iva: parseFloat(cuenta.monto_sin_iva || 0).toFixed(2),
        monto_con_iva: parseFloat(cuenta.monto_con_iva || 0).toFixed(2),
        fecha: cuenta.fecha ? cuenta.fecha.toLocaleDateString('es-MX') : 'N/A',
        estado: cuenta.estado || 'pendiente',
        created_at: cuenta.created_at ? cuenta.created_at.toLocaleDateString('es-MX') : 'N/A'
      });
    });

    // Configurar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=cuentas_por_cobrar.xlsx');

    await workbook.xlsx.write(res);
    res.end();
  } catch (error) {
    console.error('Error al generar reporte Excel:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al generar reporte Excel'
    });
  }
};