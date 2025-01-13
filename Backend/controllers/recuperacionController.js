const db = require('../config/db');

exports.getAllRecuperaciones = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id,
        r.concepto,
        r.monto,
        r.fecha,
        c.nombre AS cliente_nombre,
        p.nombre AS proyecto_nombre 
      FROM recuperacion r
      LEFT JOIN clients c ON r.cliente_id = c.id
      LEFT JOIN projects p ON r.proyecto_id = p.id
    `); // Cambié "proyectos" por "projects"
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getRecuperacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query(`
      SELECT 
        r.*,
        c.nombre AS cliente_nombre,
        p.nombre AS proyecto_nombre 
      FROM recuperacion r
      LEFT JOIN clients c ON r.cliente_id = c.id
      LEFT JOIN projects p ON r.proyecto_id = p.id
      WHERE r.id = ?
    `, [id]); // Cambié "proyectos" por "projects"
    if (rows.length === 0) return res.status(404).json({ message: 'Recuperación no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRecuperacion = async (req, res) => {
  try {
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria } = req.body;

    const [result] = await db.query(
      'INSERT INTO recuperacion (concepto, monto, fecha, cliente_id, proyecto_id, categoria) VALUES (?, ?, ?, ?, ?, ?)',
      [concepto, monto, fecha, cliente_id, proyecto_id, categoria]
    );

    res.status(201).json({ id: result.insertId, concepto, monto, fecha, cliente_id, proyecto_id, categoria });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateRecuperacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria } = req.body;

    const [result] = await db.query(
      'UPDATE recuperacion SET concepto = ?, monto = ?, fecha = ?, cliente_id = ?, proyecto_id = ?, categoria = ? WHERE id = ?',
      [concepto, monto, fecha, cliente_id, proyecto_id, categoria, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Recuperación no encontrada' });

    res.json({ id, concepto, monto, fecha, cliente_id, proyecto_id, categoria });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteRecuperacion = async (req, res) => {
  try {
    const { id } = req.params;

    const [result] = await db.query('DELETE FROM recuperacion WHERE id = ?', [id]);

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Recuperación no encontrada' });

    res.json({ message: 'Recuperación eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

