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
    console.log("getAllCuentasPagar: Se obtuvieron", rows.length, "registros.");
    res.json(rows);
  } catch (error) {
    console.error("Error en getAllCuentasPagar:", error);
    res.status(500).json({ error: error.message });
  }
};

// Obtener una cuenta por pagar por su ID
exports.getCuentaPagarById = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("getCuentaPagarById: id =", id);
    const [rows] = await db.query(`
      SELECT cp.*, p.nombre AS proveedor_nombre 
      FROM cuentas_por_pagar cp
      LEFT JOIN proveedores p ON cp.proveedor_id = p.id
      WHERE cp.id = ?
    `, [id]);
    if (rows.length === 0) {
      console.error("getCuentaPagarById: Cuenta no encontrada para id =", id);
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error("Error en getCuentaPagarById:", error);
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cuenta por pagar (incluyendo pagos_parciales, que por defecto es 0)
exports.createCuentaPagar = async (req, res) => {
  try {
    console.log("createCuentaPagar: Datos recibidos:", req.body);
    let { 
      concepto, 
      monto_neto, 
      requiere_iva, 
      categoria, 
      proveedor_id, 
      fecha, 
      pagado, 
      pagos_parciales 
    } = req.body;

    // Validar fecha
    if (!fecha || isNaN(new Date(fecha).getTime())) {
      console.error("createCuentaPagar: Fecha inválida recibida:", fecha);
      return res.status(400).json({ error: 'Debe proporcionar una fecha válida.' });
    }

    // Convertir y validar valores numéricos y booleanos
    const montoNeto = parseFloat(monto_neto) || 0;
    const pagosParciales = parseFloat(pagos_parciales) || 0;
    const requiereIvaNum = requiere_iva ? 1 : 0;
    const pagadoNum = pagado ? 1 : 0;
    const proveedorId = proveedor_id ? parseInt(proveedor_id, 10) : null;

    // Calcular el monto con IVA si corresponde
    const monto_con_iva = requiereIvaNum ? parseFloat((montoNeto * 1.16).toFixed(2)) : montoNeto;

    const [result] = await db.query(
      `INSERT INTO cuentas_por_pagar 
      (concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [concepto, montoNeto, monto_con_iva, requiereIvaNum, categoria, proveedorId, fecha, pagadoNum, pagosParciales]
    );
    console.log("createCuentaPagar: Cuenta creada con id =", result.insertId);
    res.status(201).json({ 
      id: result.insertId, 
      concepto, 
      monto_neto: montoNeto, 
      monto_con_iva, 
      requiere_iva: requiereIvaNum, 
      categoria, 
      proveedor_id: proveedorId, 
      fecha, 
      pagado: pagadoNum, 
      pagos_parciales: pagosParciales 
    });
  } catch (error) {
    console.error("Error en createCuentaPagar:", error, req.body);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una cuenta por pagar existente (incluyendo pagos_parciales)
exports.updateCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("updateCuentaPagar: id =", id, "Datos:", req.body);
    let { 
      concepto, 
      monto_neto, 
      requiere_iva, 
      categoria, 
      proveedor_id, 
      fecha, 
      pagado, 
      pagos_parciales 
    } = req.body;

    // Validar fecha
    if (!fecha || isNaN(new Date(fecha).getTime())) {
      console.error("updateCuentaPagar: Fecha inválida recibida:", fecha);
      return res.status(400).json({ error: 'Debe proporcionar una fecha válida.' });
    }

    // Convertir y validar valores
    const montoNeto = parseFloat(monto_neto) || 0;
    const pagosParciales = parseFloat(pagos_parciales) || 0;
    const requiereIvaNum = requiere_iva ? 1 : 0;
    const pagadoNum = pagado ? 1 : 0;
    const proveedorId = proveedor_id ? parseInt(proveedor_id, 10) : null;
    const monto_con_iva = requiereIvaNum ? parseFloat((montoNeto * 1.16).toFixed(2)) : montoNeto;

    const [result] = await db.query(
      `UPDATE cuentas_por_pagar 
      SET concepto = ?, monto_neto = ?, monto_con_iva = ?, requiere_iva = ?, categoria = ?, proveedor_id = ?, fecha = ?, pagado = ?, pagos_parciales = ? 
      WHERE id = ?`,
      [concepto, montoNeto, monto_con_iva, requiereIvaNum, categoria, proveedorId, fecha, pagadoNum, pagosParciales, id]
    );
    console.log("updateCuentaPagar: Filas afectadas =", result.affectedRows);
    if (result.affectedRows === 0) {
      console.error("updateCuentaPagar: No se encontró cuenta para id =", id);
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }
    res.json({ 
      id, 
      concepto, 
      monto_neto: montoNeto, 
      monto_con_iva, 
      requiere_iva: requiereIvaNum, 
      categoria, 
      proveedor_id: proveedorId, 
      fecha, 
      pagado: pagadoNum, 
      pagos_parciales: pagosParciales 
    });
  } catch (error) {
    console.error("Error en updateCuentaPagar:", error, req.body);
    res.status(500).json({ error: error.message });
  }
};

// Alternar el estado de "pagado"
exports.togglePagado = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("togglePagado: id =", id);
    const [currentStatus] = await db.query(
      'SELECT pagado FROM cuentas_por_pagar WHERE id = ?',
      [id]
    );
    if (currentStatus.length === 0) {
      console.error("togglePagado: Cuenta no encontrada para id =", id);
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }
    const newStatus = currentStatus[0].pagado === 1 ? 0 : 1;
    await db.query('UPDATE cuentas_por_pagar SET pagado = ? WHERE id = ?', [newStatus, id]);
    console.log("togglePagado: Estado de pagado actualizado a", newStatus, "para id =", id);
    res.json({ message: 'Estado de pago actualizado', pagado: newStatus });
  } catch (error) {
    console.error("Error en togglePagado:", error);
    res.status(500).json({ error: error.message });
  }
};

// Eliminar una cuenta por pagar
exports.deleteCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("deleteCuentaPagar: id =", id);
    const [result] = await db.query('DELETE FROM cuentas_por_pagar WHERE id = ?', [id]);
    console.log("deleteCuentaPagar: Filas afectadas =", result.affectedRows);
    if (result.affectedRows === 0) {
      console.error("deleteCuentaPagar: No se encontró cuenta para id =", id);
      return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    }
    res.json({ message: 'Cuenta por Pagar eliminada' });
  } catch (error) {
    console.error("Error en deleteCuentaPagar:", error);
    res.status(500).json({ error: error.message });
  }
};

// Exportar datos a CSV con filtros (si existen)
// Soporta: ?filtroMes= (número del mes) y/o ?fechaInicio=YYYY-MM-DD&fechaFin=YYYY-MM-DD
exports.exportCuentasPagarCSV = async (req, res) => {
  try {
    console.log("exportCuentasPagarCSV: Parámetros recibidos:", req.query);
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
    console.log("exportCuentasPagarCSV: Consulta final:", query, "con parámetros:", params);
    const [data] = await db.query(query, params);
    console.log("exportCuentasPagarCSV: Registros encontrados =", data.length);

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
    console.error("Error en exportCuentasPagarCSV:", err);
    res.status(500).json({ error: 'Error al exportar CSV' });
  }
};




