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
