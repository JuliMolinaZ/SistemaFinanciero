const db = require('../config/db');

exports.getAllClients = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM clients WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createClient = async (req, res) => {
  try {
    const { run_cliente, nombre, rfc, direccion } = req.body;
    const [result] = await db.query(
      'INSERT INTO clients (run_cliente, nombre, rfc, direccion) VALUES (?, ?, ?, ?)',
      [run_cliente, nombre, rfc, direccion]
    );
    res.status(201).json({ id: result.insertId, run_cliente, nombre, rfc, direccion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const { run_cliente, nombre, rfc, direccion } = req.body;
    const [result] = await db.query(
      'UPDATE clients SET run_cliente = ?, nombre = ?, rfc = ?, direccion = ? WHERE id = ?',
      [run_cliente, nombre, rfc, direccion, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ id, run_cliente, nombre, rfc, direccion });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM clients WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Cliente no encontrado' });
    res.json({ message: 'Cliente eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};