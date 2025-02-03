// controllers/cuentasPagarController.js
const db = require('../config/db');
const { Parser } = require('json2csv');

// Obtener todas las cuentas por pagar con información del proveedor
exports.getAllCuentasPagar = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT cp.*, p.nombre AS proveedor_nombre 
      FROM cuentas_por_pagar cp
      LEFT JOIN proveedores p ON cp.proveedor_id = p.id
    `);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtener una cuenta por pagar por su ID
exports.getCuentaPagarById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT cp.*, p.nombre AS proveedor_nombre 
      FROM cuentas_por_pagar cp
      LEFT JOIN proveedores p ON cp.proveedor_id = p.id
      WHERE cp.id = ?
    `, [id]);
    if (rows.length === 0) 
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cuenta por pagar (incluyendo pagos_parciales, que por defecto es 0)
exports.createCuentaPagar = async (req, res) => {
  try {
    const { concepto, monto_neto, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales } = req.body;
    // Si no se envía pagos_parciales, se toma 0
    const pagosParciales = pagos_parciales || 0;
    // Calcular el monto con IVA si corresponde
    const monto_con_iva = requiere_iva ? monto_neto * 1.16 : monto_neto;
    const [result] = await db.query(
      'INSERT INTO cuentas_por_pagar (concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado || 0, pagosParciales]
    );
    res.status(201).json({ 
      id: result.insertId, 
      concepto, 
      monto_neto, 
      monto_con_iva, 
      requiere_iva, 
      categoria, 
      proveedor_id, 
      fecha, 
      pagado, 
      pagos_parciales: pagosParciales 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una cuenta por pagar existente (incluyendo pagos_parciales)
exports.updateCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto_neto, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales } = req.body;
    // Calcular el monto con IVA si corresponde
    const monto_con_iva = requiere_iva ? monto_neto * 1.16 : monto_neto;
    const [result] = await db.query(
      'UPDATE cuentas_por_pagar SET concepto = ?, monto_neto = ?, monto_con_iva = ?, requiere_iva = ?, categoria = ?, proveedor_id = ?, fecha = ?, pagado = ?, pagos_parciales = ? WHERE id = ?',
      [concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales, id]
    );
    if (result.affectedRows === 0) 
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    res.json({ 
      id, 
      concepto, 
      monto_neto, 
      monto_con_iva, 
      requiere_iva, 
      categoria, 
      proveedor_id, 
      fecha, 
      pagado, 
      pagos_parciales 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Alternar el estado de "pagado"
exports.togglePagado = async (req, res) => {
  try {
    const { id } = req.params;
    const [currentStatus] = await db.query(
      'SELECT pagado FROM cuentas_por_pagar WHERE id = ?',
      [id]
    );
    if (currentStatus.length === 0) {
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }
    const newStatus = currentStatus[0].pagado === 1 ? 0 : 1;
    await db.query('UPDATE cuentas_por_pagar SET pagado = ? WHERE id = ?', [newStatus, id]);
    res.json({ message: 'Estado de pago actualizado', pagado: newStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una cuenta por pagar
exports.deleteCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM cuentas_por_pagar WHERE id = ?', [id]);
    if (result.affectedRows === 0) 
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    res.json({ message: 'Cuenta por Pagar eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Exportar datos a CSV con filtros (si existen)
// Soporta: ?filtroMes= (número del mes) y/o ?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
exports.exportCuentasPagarCSV = async (req, res) => {
  try {
    let query = 'SELECT * FROM cuentas_por_pagar';
    const params = [];
    const conditions = [];

    // Filtro por mes (si se pasa "filtroMes")
    if (req.query.filtroMes) {
      conditions.push('MONTH(fecha) = ?');
      params.push(parseInt(req.query.filtroMes, 10));
    }

    // Filtro por rango de fechas (si se pasan "fechaInicio" y "fechaFin")
    if (req.query.fechaInicio && req.query.fechaFin) {
      // Utilizamos: fecha >= ? AND fecha < ? (sumando un día a la fecha final)
      conditions.push('fecha >= ? AND fecha < ?');
      const fechaInicio = req.query.fechaInicio;
      const fechaFin = new Date(req.query.fechaFin);
      fechaFin.setDate(fechaFin.getDate() + 1);
      const fechaFinPlusOne = fechaFin.toISOString().split('T')[0];
      params.push(fechaInicio, fechaFinPlusOne);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    const [data] = await db.query(query, params);

    // Definir los campos que se exportarán (incluyendo pagos_parciales)
    const fields = [
      'id',
      'concepto',
      'monto_neto',
      'monto_con_iva',
      'requiere_iva',
      'categoria',
      'proveedor_id',
      'fecha',
      'pagado',
      'pagos_parciales'
    ];
    const opts = { fields };
    const json2csvParser = new Parser(opts);
    const csv = json2csvParser.parse(data);

    res.header('Content-Type', 'text/csv');
    res.attachment('cuentas-pagar.csv');
    return res.send(csv);
  } catch (err) {
    console.error('Error al exportar CSV:', err);
    res.status(500).json({ error: 'Error al exportar CSV' });
  }
};



