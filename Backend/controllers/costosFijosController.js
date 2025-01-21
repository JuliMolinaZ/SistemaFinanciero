// controllers/costosFijosController.js
const db = require('../config/db');

const costosFijosController = {
  getCostosFijos: async (req, res) => {
    try {
      const { mes } = req.query;
      let query = 'SELECT * FROM costos_fijos';
      const params = [];

      if (mes) {
        query += ' WHERE MONTH(fecha) = ?';
        params.push(mes);
      }

      const [costos] = await db.query(query, params);
      res.json(costos);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener costos fijos.' });
    }
  },

  createCostoFijo: async (req, res) => {
    try {
      const { colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha } = req.body;

      await db.query(
        'INSERT INTO costos_fijos (colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha]
      );

      res.status(201).json({ message: 'Costo fijo creado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al crear costo fijo.' });
    }
  },

  updateCostoFijo: async (req, res) => {
    try {
      const { id } = req.params;
      const { colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha } = req.body;

      await db.query(
        'UPDATE costos_fijos SET colaborador = ?, puesto = ?, monto_usd = ?, monto_mxn = ?, impuestos_imss = ?, comentarios = ?, fecha = ? WHERE id = ?',
        [colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha, id]
      );

      res.status(200).json({ message: 'Costo fijo actualizado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al actualizar costo fijo.' });
    }
  },

  deleteCostoFijo: async (req, res) => {
    try {
      const { id } = req.params;

      await db.query('DELETE FROM costos_fijos WHERE id = ?', [id]);

      res.status(200).json({ message: 'Costo fijo eliminado exitosamente.' });
    } catch (error) {
      res.status(500).json({ error: 'Error al eliminar costo fijo.' });
    }
  },
};

module.exports = costosFijosController;





