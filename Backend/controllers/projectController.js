// controllers/projectController.js
const db = require('../config/db');

exports.getAllProjects = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM projects');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM projects WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProject = async (req, res) => {
  try {
    const { nombre, cliente_id, monto_sin_iva, monto_con_iva } = req.body;
    const [result] = await db.query(
      'INSERT INTO projects (nombre, cliente_id, monto_sin_iva, monto_con_iva) VALUES (?, ?, ?, ?)',
      [nombre, cliente_id, monto_sin_iva, monto_con_iva]
    );
    res.status(201).json({ id: result.insertId, nombre, cliente_id, monto_sin_iva, monto_con_iva });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, cliente_id, monto_sin_iva, monto_con_iva } = req.body;
    const [result] = await db.query(
      'UPDATE projects SET nombre = ?, cliente_id = ?, monto_sin_iva = ?, monto_con_iva = ? WHERE id = ?',
      [nombre, cliente_id, monto_sin_iva, monto_con_iva, id]
    );

    if (result.affectedRows === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });

    res.json({ message: 'Proyecto actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProjectPhase = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { phaseId } = req.body;

    const [result] = await db.query(
      'UPDATE projects SET phase_id = ? WHERE id = ?',
      [phaseId, projectId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json({ message: 'Fase asignada correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM projects WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Proyecto no encontrado' });
    res.json({ message: 'Proyecto eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
