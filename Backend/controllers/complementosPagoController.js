const db = require('../config/db');

// Obtener todos los complementos de pago de una cuenta
exports.getComplementosByCuenta = async (req, res) => {
  try {
    const { cuentaId } = req.params;
    const [rows] = await db.query('SELECT * FROM complementos_pago WHERE cuenta_id = ?', [cuentaId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crear un nuevo complemento de pago para una cuenta
exports.createComplemento = async (req, res) => {
  try {
    const { cuentaId } = req.params;
    const { fecha_pago, concepto, monto_sin_iva, monto_con_iva } = req.body;
    const [result] = await db.query(
      'INSERT INTO complementos_pago (cuenta_id, fecha_pago, concepto, monto_sin_iva, monto_con_iva) VALUES (?, ?, ?, ?, ?)',
      [cuentaId, fecha_pago, concepto, monto_sin_iva, monto_con_iva]
    );
    res.status(201).json({ id: result.insertId, cuenta_id: cuentaId, fecha_pago, concepto, monto_sin_iva, monto_con_iva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un complemento (opcional)
exports.updateComplemento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha_pago, concepto, monto_sin_iva, monto_con_iva } = req.body;
    const [result] = await db.query(
      'UPDATE complementos_pago SET fecha_pago = ?, concepto = ?, monto_sin_iva = ?, monto_con_iva = ? WHERE id = ?',
      [fecha_pago, concepto, monto_sin_iva, monto_con_iva, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Complemento no encontrado' });
    res.json({ id, fecha_pago, concepto, monto_sin_iva, monto_con_iva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un complemento de pago
exports.deleteComplemento = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM complementos_pago WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Complemento no encontrado' });
    res.json({ message: 'Complemento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};