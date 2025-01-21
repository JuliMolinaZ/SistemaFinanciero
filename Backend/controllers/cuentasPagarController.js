// controllers/cuentasPagarController.js
const db = require('../config/db');

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
    if (rows.length === 0) return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear una nueva cuenta por pagar
exports.createCuentaPagar = async (req, res) => {
  try {
    const { concepto, monto_neto, requiere_iva, categoria, proveedor_id, fecha, pagado } = req.body;

    // Calcular el monto con IVA si corresponde
    const monto_con_iva = requiere_iva ? monto_neto * 1.16 : monto_neto;

    const [result] = await db.query(
      'INSERT INTO cuentas_por_pagar (concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado || 0]
    );
    res.status(201).json({ id: result.insertId, concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar una cuenta por pagar existente
exports.updateCuentaPagar = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto_neto, requiere_iva, categoria, proveedor_id, fecha, pagado } = req.body;

    // Calcular el monto con IVA si corresponde
    const monto_con_iva = requiere_iva ? monto_neto * 1.16 : monto_neto;

    const [result] = await db.query(
      'UPDATE cuentas_por_pagar SET concepto = ?, monto_neto = ?, monto_con_iva = ?, requiere_iva = ?, categoria = ?, proveedor_id = ?, fecha = ?, pagado = ? WHERE id = ?',
      [concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    res.json({ id, concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado });
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
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cuenta por Pagar no encontrada' });
    res.json({ message: 'Cuenta por Pagar eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
