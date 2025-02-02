const db = require('../config/db');

exports.getAllProveedores = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM proveedores');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProveedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM proveedores WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createProveedor = async (req, res) => {
  try {
    const { run_proveedor, nombre, direccion, elemento, datos_bancarios, contacto } = req.body;
    const [result] = await db.query(
      'INSERT INTO proveedores (run_proveedor, nombre, direccion, elemento, datos_bancarios, contacto) VALUES (?, ?, ?, ?, ?, ?)',
      [run_proveedor, nombre, direccion, elemento, datos_bancarios, contacto]
    );
    res.status(201).json({ 
      id: result.insertId, 
      run_proveedor, 
      nombre, 
      direccion, 
      elemento, 
      datos_bancarios, 
      contacto 
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const { run_proveedor, nombre, direccion, elemento, datos_bancarios, contacto } = req.body;
    const [result] = await db.query(
      'UPDATE proveedores SET run_proveedor = ?, nombre = ?, direccion = ?, elemento = ?, datos_bancarios = ?, contacto = ? WHERE id = ?',
      [run_proveedor, nombre, direccion, elemento, datos_bancarios, contacto, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ id, run_proveedor, nombre, direccion, elemento, datos_bancarios, contacto });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProveedor = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM proveedores WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Proveedor no encontrado' });
    res.json({ message: 'Proveedor eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
