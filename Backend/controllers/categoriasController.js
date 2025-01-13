// controllers/categoriasController.js
const db = require('../config/db');

exports.getAllCategorias = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM categorias');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getCategoriaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM categorias WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createCategoria = async (req, res) => {
  try {
    const { nombre } = req.body;
    const [result] = await db.query('INSERT INTO categorias (nombre) VALUES (?)', [nombre]);
    res.status(201).json({ id: result.insertId, nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre } = req.body;
    const [result] = await db.query('UPDATE categorias SET nombre = ? WHERE id = ?', [nombre, id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ id, nombre });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteCategoria = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM categorias WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Categoría no encontrada' });
    res.json({ message: 'Categoría eliminada' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};