// controllers/phaseController.js
const db = require('../config/db');

exports.getAllPhases = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM phases');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};