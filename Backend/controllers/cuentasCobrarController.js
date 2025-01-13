// controllers/cuentasCobrarController.js
const db = require('../config/db');

exports.getAllCuentasCobrar = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM cuentas_por_cobrar');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCuentaCobrarById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM cuentas_por_cobrar WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Cuenta por Cobrar no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCuentaCobrar = async (req, res) => {
  try {
    const { proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha } = req.body;
    const [result] = await db.query(
      'INSERT INTO cuentas_por_cobrar (proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha) VALUES (?, ?, ?, ?, ?)',
      [proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha]
    );
    res.status(201).json({ id: result.insertId, proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCuentaCobrar = async (req, res) => {
  try {
    const { id } = req.params;
    const { proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha } = req.body;
    const [result] = await db.query(
      'UPDATE cuentas_por_cobrar SET proyecto_id = ?, concepto = ?, monto_sin_iva = ?, monto_con_iva = ?, fecha = ? WHERE id = ?',
      [proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cuenta por Cobrar no encontrada' });
    res.json({ id, proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCuentaCobrar = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM cuentas_por_cobrar WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cuenta por Cobrar no encontrada' });
    res.json({ message: 'Cuenta por Cobrar eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};