// controllers/contabilidadController.js
const { prisma } = require('../config/database');
const ExcelJS = require('exceljs');

// Obtener todos los movimientos contables
exports.getAllMovimientos = async (req, res) => {
  try {
    const { page = 1, limit = 50, fecha_inicio, fecha_fin, tipo, status } = req.query;
    const offset = (page - 1) * limit;

    // Construir filtros
    let whereClause = {};
    
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }
    
    if (tipo) {
      whereClause.tipo = tipo;
    }
    
    if (status) {
      whereClause.status = status;
    }

    const [movimientos, total] = await Promise.all([
      prisma.contabilidad.findMany({
        where: whereClause,
        orderBy: [
          { fecha: 'asc' },
          { id: 'asc' }
        ],
        skip: offset,
        take: parseInt(limit)
      }),
      prisma.contabilidad.count({ where: whereClause })
    ]);

    res.json({
      success: true,
      data: movimientos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      },
      message: 'Movimientos contables obtenidos exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener movimientos:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener movimientos contables'
    });
  }
};

// Obtener un movimiento por ID
exports.getMovimientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const movimiento = await prisma.contabilidad.findUnique({
      where: { id: parseInt(id) }
    });

    if (!movimiento) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movimiento no encontrado' 
      });
    }

    res.json({
      success: true,
      data: movimiento,
      message: 'Movimiento obtenido exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener movimiento:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener movimiento'
    });
  }
};

// Crear un nuevo movimiento
exports.createMovimiento = async (req, res) => {
  try {
    const { fecha, concepto, monto, tipo, categoria, descripcion, estado } = req.body;

    // Obtener el último saldo para calcular el nuevo saldo
    const ultimoMovimiento = await prisma.contabilidad.findFirst({
      orderBy: [
        { fecha: 'desc' },
        { id: 'desc' }
      ]
    });

    const saldoAnterior = ultimoMovimiento ? parseFloat(ultimoMovimiento.saldo) : 0;
    
    // Calcular cargo y abono según el tipo
    let cargo = 0;
    let abono = 0;
    let nuevoSaldo = saldoAnterior;
    
    if (tipo === 'ingreso' || tipo === 'Ingreso') {
      abono = parseFloat(monto) || 0;
      nuevoSaldo = saldoAnterior + abono;
    } else if (tipo === 'egreso' || tipo === 'Egreso') {
      cargo = parseFloat(monto) || 0;
      nuevoSaldo = saldoAnterior - cargo;
    } else {
      // Si no se especifica tipo, usar el campo monto directamente
      if (parseFloat(monto) > 0) {
        abono = parseFloat(monto);
        nuevoSaldo = saldoAnterior + abono;
      } else {
        cargo = Math.abs(parseFloat(monto));
        nuevoSaldo = saldoAnterior - cargo;
      }
    }

    // Procesar archivos subidos
    let facturaPDF = null;
    let facturaXML = null;

    if (req.files) {
      if (req.files.facturaPDF && req.files.facturaPDF[0]) {
        facturaPDF = req.files.facturaPDF[0].filename;
      }
      if (req.files.facturaXML && req.files.facturaXML[0]) {
        facturaXML = req.files.facturaXML[0].filename;
      }
    }

    const movimiento = await prisma.contabilidad.create({
      data: {
        fecha: fecha ? new Date(fecha) : new Date(),
        concepto: concepto?.trim(),
        monto: parseFloat(monto) || 0,
        cargo: cargo,
        abono: abono,
        saldo: parseFloat(nuevoSaldo.toFixed(2)),
        status: estado?.trim() || 'Activo',
        notas: descripcion?.trim(),
        tipo: tipo?.trim() || 'General',
        facturaPDF: facturaPDF,
        facturaXML: facturaXML
      }
    });

    res.status(201).json({
      success: true,
      data: movimiento,
      message: 'Movimiento creado exitosamente'
    });
  } catch (error) {
    console.error('Error al crear movimiento:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al crear movimiento'
    });
  }
};

// Actualizar un movimiento
exports.updateMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, concepto, monto, tipo, categoria, descripcion, estado } = req.body;

    // Verificar si existe el movimiento
    const movimientoExistente = await prisma.contabilidad.findUnique({
      where: { id: parseInt(id) }
    });

    if (!movimientoExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movimiento no encontrado' 
      });
    }

    // Obtener el saldo anterior al movimiento que se está editando
    const movimientoAnterior = await prisma.contabilidad.findFirst({
      where: {
        id: { lt: parseInt(id) },
        fecha: { lte: movimientoExistente.fecha }
      },
      orderBy: [
        { fecha: 'desc' },
        { id: 'desc' }
      ]
    });

    const saldoAnterior = movimientoAnterior ? parseFloat(movimientoAnterior.saldo) : 0;
    
    // Calcular cargo y abono según el tipo
    let cargo = 0;
    let abono = 0;
    let nuevoSaldo = saldoAnterior;
    
    if (tipo === 'ingreso' || tipo === 'Ingreso') {
      abono = parseFloat(monto) || 0;
      nuevoSaldo = saldoAnterior + abono;
    } else if (tipo === 'egreso' || tipo === 'Egreso') {
      cargo = parseFloat(monto) || 0;
      nuevoSaldo = saldoAnterior - cargo;
    } else {
      // Si no se especifica tipo, usar el campo monto directamente
      if (parseFloat(monto) > 0) {
        abono = parseFloat(monto);
        nuevoSaldo = saldoAnterior + abono;
      } else {
        cargo = Math.abs(parseFloat(monto));
        nuevoSaldo = saldoAnterior - cargo;
      }
    }

    // Procesar archivos subidos
    let facturaPDF = movimientoExistente.facturaPDF;
    let facturaXML = movimientoExistente.facturaXML;

    if (req.files) {
      if (req.files.facturaPDF && req.files.facturaPDF[0]) {
        facturaPDF = req.files.facturaPDF[0].filename;
      }
      if (req.files.facturaXML && req.files.facturaXML[0]) {
        facturaXML = req.files.facturaXML[0].filename;
      }
    }

    const movimiento = await prisma.contabilidad.update({
      where: { id: parseInt(id) },
      data: {
        fecha: fecha ? new Date(fecha) : movimientoExistente.fecha,
        concepto: concepto?.trim(),
        monto: parseFloat(monto) || 0,
        cargo: cargo,
        abono: abono,
        saldo: parseFloat(nuevoSaldo.toFixed(2)),
        status: estado?.trim() || movimientoExistente.status,
        notas: descripcion?.trim() || movimientoExistente.notas,
        tipo: tipo?.trim() || movimientoExistente.tipo,
        facturaPDF: facturaPDF,
        facturaXML: facturaXML
      }
    });

    res.json({
      success: true,
      data: movimiento,
      message: 'Movimiento actualizado exitosamente'
    });
  } catch (error) {
    console.error('Error al actualizar movimiento:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al actualizar movimiento'
    });
  }
};

// Eliminar un movimiento
exports.deleteMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Verificar si existe el movimiento
    const movimientoExistente = await prisma.contabilidad.findUnique({
      where: { id: parseInt(id) }
    });

    if (!movimientoExistente) {
      return res.status(404).json({ 
        success: false, 
        message: 'Movimiento no encontrado' 
      });
    }

    await prisma.contabilidad.delete({
      where: { id: parseInt(id) }
    });

    res.json({
      success: true,
      message: 'Movimiento eliminado exitosamente'
    });
  } catch (error) {
    console.error('Error al eliminar movimiento:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al eliminar movimiento'
    });
  }
};

// Obtener estadísticas
exports.getEstadisticas = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    
    let whereClause = {};
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }

    // Obtener total de movimientos
    const totalMovimientos = await prisma.contabilidad.count({ where: whereClause });

    // Obtener saldo actual (último movimiento)
    const ultimoMovimiento = await prisma.contabilidad.findFirst({
      where: whereClause,
      orderBy: [
        { fecha: 'desc' },
        { id: 'desc' }
      ]
    });

    const saldoActual = ultimoMovimiento ? parseFloat(ultimoMovimiento.saldo) : 0;

    // Obtener movimientos del mes actual
    const fechaInicioMes = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    const movimientosMes = await prisma.contabilidad.count({
      where: {
        ...whereClause,
        fecha: {
          gte: fechaInicioMes
        }
      }
    });

    // Calcular totales por tipo
    const totalIngresos = await prisma.contabilidad.aggregate({
      _sum: { monto: true },
      where: {
        ...whereClause,
        tipo: 'Ingreso'
      }
    });

    const totalEgresos = await prisma.contabilidad.aggregate({
      _sum: { monto: true },
      where: {
        ...whereClause,
        tipo: 'Egreso'
      }
    });

    const estadisticas = {
      totalMovimientos,
      saldoActual: parseFloat(saldoActual.toFixed(2)),
      movimientosMes,
      totalIngresos: parseFloat((totalIngresos._sum.monto || 0).toFixed(2)),
      totalEgresos: parseFloat((totalEgresos._sum.monto || 0).toFixed(2)),
      balance: parseFloat(((totalIngresos._sum.monto || 0) - (totalEgresos._sum.monto || 0)).toFixed(2)),
      status: saldoActual >= 0 ? 'Completo' : 'Incompleto'
    };

    res.json({
      success: true,
      data: estadisticas,
      message: 'Estadísticas obtenidas exitosamente'
    });
  } catch (error) {
    console.error('Error al obtener estadísticas:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al obtener estadísticas'
    });
  }
};

// Generar reporte Excel
exports.generarReporteExcel = async (req, res) => {
  try {
    const { fecha_inicio, fecha_fin } = req.query;
    
    let whereClause = {};
    if (fecha_inicio && fecha_fin) {
      whereClause.fecha = {
        gte: new Date(fecha_inicio),
        lte: new Date(fecha_fin)
      };
    }

    const movimientos = await prisma.contabilidad.findMany({
      where: whereClause,
      orderBy: [
        { fecha: 'asc' },
        { id: 'asc' }
      ]
    });

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Movimientos Contables');

    // Configurar columnas
    worksheet.columns = [
      { header: 'ID', key: 'id', width: 10 },
      { header: 'Fecha', key: 'fecha', width: 15 },
      { header: 'Concepto', key: 'concepto', width: 40 },
      { header: 'Monto', key: 'monto', width: 15 },
      { header: 'Cargo', key: 'cargo', width: 15 },
      { header: 'Abono', key: 'abono', width: 15 },
      { header: 'Saldo', key: 'saldo', width: 15 },
      { header: 'Status', key: 'status', width: 15 },
      { header: 'Tipo', key: 'tipo', width: 15 },
      { header: 'Notas', key: 'notas', width: 30 }
    ];

    // Agregar datos
    movimientos.forEach(movimiento => {
      worksheet.addRow({
        id: movimiento.id,
        fecha: movimiento.fecha.toLocaleDateString('es-MX'),
        concepto: movimiento.concepto,
        monto: movimiento.monto,
        cargo: movimiento.cargo,
        abono: movimiento.abono,
        saldo: movimiento.saldo,
        status: movimiento.status,
        tipo: movimiento.tipo,
        notas: movimiento.notas
      });
    });

    // Configurar respuesta
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', 'attachment; filename=movimientos_contables.xlsx');

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

// Función para recalcular todos los saldos de la contabilidad
exports.recalcularSaldos = async (req, res) => {
  try {

    // Obtener todos los movimientos ordenados por fecha e ID
    const movimientos = await prisma.contabilidad.findMany({
      orderBy: [
        { fecha: 'asc' },
        { id: 'asc' }
      ]
    });

    let saldoAcumulado = 0;
    const movimientosActualizados = [];

    // Recalcular saldos
    for (const movimiento of movimientos) {
      // Calcular cargo y abono según el tipo
      let cargo = 0;
      let abono = 0;
      
      if (movimiento.tipo === 'ingreso' || movimiento.tipo === 'Ingreso') {
        abono = parseFloat(movimiento.monto) || 0;
        saldoAcumulado += abono;
      } else if (movimiento.tipo === 'egreso' || movimiento.tipo === 'Egreso') {
        cargo = parseFloat(movimiento.monto) || 0;
        saldoAcumulado -= cargo;
      } else {
        // Si no se especifica tipo, usar el campo monto directamente
        if (parseFloat(movimiento.monto) > 0) {
          abono = parseFloat(movimiento.monto);
          saldoAcumulado += abono;
        } else {
          cargo = Math.abs(parseFloat(movimiento.monto));
          saldoAcumulado -= cargo;
        }
      }

      // Actualizar el movimiento con los nuevos valores
      const movimientoActualizado = await prisma.contabilidad.update({
        where: { id: movimiento.id },
        data: {
          cargo: cargo,
          abono: abono,
          saldo: parseFloat(saldoAcumulado.toFixed(2))
        }
      });

      movimientosActualizados.push(movimientoActualizado);

    }

    res.json({
      success: true,
      data: {
        totalMovimientos: movimientosActualizados.length,
        saldoFinal: parseFloat(saldoAcumulado.toFixed(2)),
        movimientos: movimientosActualizados
      },
      message: `Saldos recalculados exitosamente. Saldo final: $${saldoAcumulado.toFixed(2)}`
    });
  } catch (error) {
    console.error('❌ Error al recalcular saldos:', error);
    res.status(500).json({ 
      success: false, 
      error: error.message,
      message: 'Error al recalcular saldos contables'
    });
  }
};