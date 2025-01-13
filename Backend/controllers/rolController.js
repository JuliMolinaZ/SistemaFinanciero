// controllers/rolController.js
const db = require('../config/db');

exports.getAllRoles = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM roles');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};