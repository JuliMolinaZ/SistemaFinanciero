const db = require('../config/db');

// Obtener costos de un proyecto
exports.getCostsByProjectId = async (req, res) => {
  try {
    const { projectId } = req.params;
    const [rows] = await db.query('SELECT * FROM project_costs WHERE project_id = ?', [projectId]);
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Agregar un costo a un proyecto
exports.addCostToProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const { concepto, factura, monto } = req.body;

    await db.query(
      'INSERT INTO project_costs (project_id, concepto, factura, monto) VALUES (?, ?, ?, ?)',
      [projectId, concepto, factura || null, monto]
    );

    res.status(201).json({ message: 'Costo agregado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un costo existente
exports.updateCost = async (req, res) => {
  try {
    const { costId } = req.params;
    const { concepto, factura, monto } = req.body;

    await db.query(
      'UPDATE project_costs SET concepto = ?, factura = ?, monto = ? WHERE id = ?',
      [concepto, factura || null, monto, costId]
    );

    res.status(200).json({ message: 'Costo actualizado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Eliminar un costo por ID
exports.deleteCost = async (req, res) => {
  try {
    const { costId } = req.params;

    await db.query('DELETE FROM project_costs WHERE id = ?', [costId]);

    res.status(200).json({ message: 'Costo eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



