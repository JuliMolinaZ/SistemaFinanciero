// controllers/contabilidadController.js
const db = require('../config/db');

exports.getAllMovimientos = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM contabilidad');
    res.json(rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMovimientoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM contabilidad WHERE id = ?', [id]);
    if (rows.length === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json(rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createMovimiento = async (req, res) => {
  try {
    console.log('Datos recibidos en createMovimiento:', req.body);
    const { fecha, concepto, monto, tipo } = req.body;
    
    // Extraer rutas de archivos si fueron cargados por Multer
    let facturaPDF = null;
    let facturaXML = null;
    if (req.files) {
      if (req.files['facturaPDF'] && req.files['facturaPDF'][0]) {
        facturaPDF = req.files['facturaPDF'][0].path;
      }
      if (req.files['facturaXML'] && req.files['facturaXML'][0]) {
        facturaXML = req.files['facturaXML'][0].path;
      }
    }

    const [result] = await db.query(
      `INSERT INTO contabilidad 
        (fecha, concepto, monto, tipo, facturaPDF, facturaXML) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [fecha, concepto, monto, tipo, facturaPDF, facturaXML]
    );
    res.status(201).json({ 
      id: result.insertId, 
      fecha, 
      concepto, 
      monto, 
      tipo, 
      facturaPDF, 
      facturaXML 
    });
  } catch (error) {
    console.error('Error en createMovimiento:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.updateMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const { fecha, concepto, monto, tipo } = req.body;
    
    let facturaPDF = null;
    let facturaXML = null;
    if (req.files) {
      if (req.files['facturaPDF'] && req.files['facturaPDF'][0]) {
        facturaPDF = req.files['facturaPDF'][0].path;
      }
      if (req.files['facturaXML'] && req.files['facturaXML'][0]) {
        facturaXML = req.files['facturaXML'][0].path;
      }
    }

    const [result] = await db.query(
      `UPDATE contabilidad 
         SET fecha = ?, concepto = ?, monto = ?, tipo = ?, facturaPDF = ?, facturaXML = ? 
       WHERE id = ?`,
      [fecha, concepto, monto, tipo, facturaPDF, facturaXML, id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json({ id, fecha, concepto, monto, tipo, facturaPDF, facturaXML });
  } catch (error) {
    console.error('Error en updateMovimiento:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteMovimiento = async (req, res) => {
  try {
    const { id } = req.params;
    const [result] = await db.query('DELETE FROM contabilidad WHERE id = ?', [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: 'Movimiento no encontrado' });
    res.json({ message: 'Movimiento eliminado' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

