// Backend/controllers/flowRecoveryV2Controller.js
const db = require('../config/db');

// Obtiene todas las recuperaciones de terceros (Flow Recovery V2)
exports.getAllFlowRecoveryV2 = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT
        fr.id,
        fr.concepto,
        fr.monto,
        fr.fecha,
        fr.recuperado,
        c.nombre AS cliente_nombre,
        p.nombre AS proyecto_nombre
      FROM flow_recovery_v2 fr
      LEFT JOIN clients c ON fr.cliente_id = c.id
      LEFT JOIN projects p ON fr.proyecto_id = p.id
    `);
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener Flow Recovery V2:', error);
    res.status(500).json({ error: error.message });
  }
};

// Obtiene una recuperación específica por ID
exports.getFlowRecoveryV2ById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT
        fr.*,
        c.nombre AS cliente_nombre,
        p.nombre AS proyecto_nombre
      FROM flow_recovery_v2 fr
      LEFT JOIN clients c ON fr.cliente_id = c.id
      LEFT JOIN projects p ON fr.proyecto_id = p.id
      WHERE fr.id = ?
    `, [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: 'Registro no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Crea un registro nuevo de Flow Recovery V2
exports.createFlowRecoveryV2 = async (req, res) => {
  try {
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado } = req.body;
    console.log("Datos recibidos en createFlowRecoveryV2:", { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado });
    const [result] = await db.query(
      'INSERT INTO flow_recovery_v2 (concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado || 0]
    );
    res.status(201).json({
      id: result.insertId,
      concepto,
      monto,
      fecha,
      cliente_id,
      proyecto_id,
      categoria,
      recuperado: recuperado || 0
    });
  } catch (error) {
    console.error('Error en createFlowRecoveryV2:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualiza un registro de Flow Recovery V2
exports.updateFlowRecoveryV2 = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado } = req.body;
    const [result] = await db.query(
      'UPDATE flow_recovery_v2 SET concepto = ?, monto = ?, fecha = ?, cliente_id = ?, proyecto_id = ?, categoria = ?, recuperado = ? WHERE id = ?',
      [concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado, id]
    );
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Registro no encontrado' });
    res.json({ id, concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Elimina un registro de Flow Recovery V2
exports.deleteFlowRecoveryV2 = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM flow_recovery_v2 WHERE id = ?', [id]);
    if (result.affectedRows === 0)
      return res.status(404).json({ message: 'Registro no encontrado' });
    res.json({ message: 'Registro eliminado con éxito' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Alterna el estado de "recuperado" del registro
exports.toggleFlowRecoveryV2 = async (req, res) => {
  try {
    const { id } = req.params;
    const [current] = await db.query('SELECT recuperado FROM flow_recovery_v2 WHERE id = ?', [id]);
    if (!current.length)
      return res.status(404).json({ message: 'Registro no encontrado' });
    const nuevoStatus = current[0].recuperado ? 0 : 1;
    await db.query('UPDATE flow_recovery_v2 SET recuperado = ? WHERE id = ?', [nuevoStatus, id]);
    res.json({ message: 'Estado actualizado', recuperado: nuevoStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
