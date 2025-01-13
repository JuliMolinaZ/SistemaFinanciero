// controllers/usuarioController.js
const db = require('../config/db');

exports.getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM users');
    res.json(rows);
  } catch (error) {
    console.error('Error en getAllUsers:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM users WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getUserById:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.getUserByFirebaseUid = async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const [rows] = await db.query('SELECT * FROM users WHERE firebase_uid = ?', [firebase_uid]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(rows[0]);
  } catch (error) {
    console.error('Error en getUserByFirebaseUid:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.createUser = async (req, res) => {
  try {
    const { firebase_uid, email, name, role, avatar } = req.body;
    const [result] = await db.query(
      'INSERT INTO users (firebase_uid, email, name, role, avatar) VALUES (?, ?, ?, ?, ?)',
      [firebase_uid, email, name, role, avatar]
    );
    res.status(201).json({ id: result.insertId, firebase_uid, email, name, role, avatar });
  } catch (error) {
    console.error('Error en createUser:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, role, avatar } = req.body;
    const [result] = await db.query(
      'UPDATE users SET name = ?, role = ?, avatar = ? WHERE id = ?',
      [name, role, avatar, id]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ id, name, role, avatar });
  } catch (error) {
    console.error('Error en updateUser:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM users WHERE id = ?', [id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ message: 'Usuario eliminado' });
  } catch (error) {
    console.error('Error en deleteUser:', error);
    res.status(500).json({ error: error.message });
  }
};

// Actualizar un usuario por firebase_uid
exports.updateUserByFirebaseUid = async (req, res) => {
  try {
    const { firebase_uid } = req.params;
    const { name, role, avatar } = req.body;
    const [result] = await db.query(
      'UPDATE users SET name = ?, role = ?, avatar = ? WHERE firebase_uid = ?',
      [name, role, avatar, firebase_uid]
    );
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json({ firebase_uid, name, role, avatar });
  } catch (error) {
    console.error('Error en updateUserByFirebaseUid:', error);
    res.status(500).json({ error: error.message });
  }
};
