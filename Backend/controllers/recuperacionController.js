const db = require('../config/db');

exports.getAllRecuperaciones = async (req, res) => {
  try {
    const [rows] = await db.query(`
      SELECT 
        r.id, r.concepto, r.monto, r.fecha, r.recuperado,
        c.nombre AS cliente_nombre,
        p.nombre AS proyecto_nombre 
      FROM recuperacion r
      LEFT JOIN clients c ON r.cliente_id = c.id
      LEFT JOIN projects p ON r.proyecto_id = p.id
    `);
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
        r.*, r.recuperado,
        c.nombre AS cliente_nombre,
        p.nombre AS proyecto_nombre 
      FROM recuperacion r
      LEFT JOIN clients c ON r.cliente_id = c.id
      LEFT JOIN projects p ON r.proyecto_id = p.id
      WHERE r.id = ?
    `, [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Recuperación no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createRecuperacion = async (req, res) => {
  try {
    // Extraer datos del cuerpo de la solicitud
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado } = req.body;

    // Registrar en consola los datos recibidos para depuración
    console.log("Datos recibidos en createRecuperacion:", {
      concepto,
      monto,
      fecha,
      cliente_id,
      proyecto_id,
      categoria,
      recuperado
    });

    // Insertar en la base de datos
    const [result] = await db.query(
      'INSERT INTO recuperacion (concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado || 0]
    );

    // Responder con el nuevo registro creado
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
    // Registrar error en consola y responder con mensaje de error
    console.error('Error en createRecuperacion:', error);
    res.status(500).json({ error: error.message });
  }
};


exports.updateRecuperacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado } = req.body;
    const [result] = await db.query(
      'UPDATE recuperacion SET concepto = ?, monto = ?, fecha = ?, cliente_id = ?, proyecto_id = ?, categoria = ?, recuperado = ? WHERE id = ?',
      [concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Recuperación no encontrada' });
    res.json({ id, concepto, monto, fecha, cliente_id, proyecto_id, categoria, recuperado });
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

// Endpoint para cambiar status de recuperación si es necesario
exports.toggleRecuperado = async (req, res) => {
  try {
    const { id } = req.params;
    const [current] = await db.query('SELECT recuperado FROM recuperacion WHERE id = ?', [id]);
    if (!current.length) return res.status(404).json({ message: 'Recuperación no encontrada' });
    const nuevoStatus = current[0].recuperado ? 0 : 1;
    await db.query('UPDATE recuperacion SET recuperado = ? WHERE id = ?', [nuevoStatus, id]);
    res.json({ message: 'Estado actualizado', recuperado: nuevoStatus });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
