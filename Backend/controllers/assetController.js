const db = require('../config/db');

exports.getAllAssets = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM assets');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAssetById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM assets WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Activo no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createAsset = async (req, res) => {
  try {
    const { category_id, concepto, cantidad, ubicacion } = req.body;
    const [result] = await db.query(
      'INSERT INTO assets (category_id, concepto, cantidad, ubicacion) VALUES (?, ?, ?, ?)',
      [category_id, concepto, cantidad, ubicacion]
    );
    res.status(201).json({ id: result.insertId, category_id, concepto, cantidad, ubicacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const { category_id, concepto, cantidad, ubicacion } = req.body;
    const [result] = await db.query(
      'UPDATE assets SET category_id = ?, concepto = ?, cantidad = ?, ubicacion = ? WHERE id = ?',
      [category_id, concepto, cantidad, ubicacion, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Activo no encontrado' });
    res.json({ id, category_id, concepto, cantidad, ubicacion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteAsset = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM assets WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Activo no encontrado' });
    res.json({ message: 'Activo eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
