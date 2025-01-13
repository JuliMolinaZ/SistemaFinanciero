// controllers/contabilidadController.js
const db = require('../config/db');

exports.getAllMovimientos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contabilidad');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovimientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM contabilidad WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMovimiento = async (req, res) => {
  try {
    const { fecha, concepto, monto } = req.body;
    const [result] = await db.query(
      'INSERT INTO contabilidad (fecha, concepto, monto) VALUES (?, ?, ?)',
      [fecha, concepto, monto]
    );
    res.status(201).json({ id: result.insertId, fecha, concepto, monto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, concepto, monto } = req.body;
    const [result] = await db.query(
      'UPDATE contabilidad SET fecha = ?, concepto = ?, monto = ? WHERE id = ?',
      [fecha, concepto, monto, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json({ id, fecha, concepto, monto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM contabilidad WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json({ message: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};