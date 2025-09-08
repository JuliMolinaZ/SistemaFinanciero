const pool = require('../config/db');

const requisicionesController = {
  // Crear una nueva requisición (inicialmente sin aprobaciones)
  createRequisicion: async (req, res) => {
    try {
      const { concepto, solicitante, justificacion, area, fecha_requerida, costos, link_cotizaciones } = req.body;
      const sql = `
        INSERT INTO requisiciones 
          (concepto, solicitante, justificacion, area, fecha_requerida, costos, link_cotizaciones, aceptacion_gerente, aceptacion_direccion)
        VALUES (?, ?, ?, ?, ?, ?, ?, 0, 0)
      `;
      const [result] = await pool.query(sql, [
        concepto,
        solicitante,
        justificacion,
        area,
        fecha_requerida,
        costos,
        link_cotizaciones || null,
      ]);
      res.status(201).json({ id: result.insertId, mensaje: 'Requisición creada con éxito' });
    } catch (error) {
      console.error('Error al crear requisición:', error);
      res.status(500).json({ error: 'Error al crear requisición' });
    }
  },

  // Obtener todas las requisiciones
  getRequisiciones: async (req, res) => {
    try {
      const [rows] = await pool.query("SELECT * FROM requisiciones");
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener requisiciones:', error);
      res.status(500).json({ error: 'Error al obtener requisiciones' });
    }
  },

  // Actualizar una requisición (todos los campos se actualizan, incluyendo la fecha y las aprobaciones)
  updateRequisicion: async (req, res) => {
    try {
      const {
        concepto,
        solicitante,
        justificacion,
        area,
        fecha_requerida,
        costos,
        link_cotizaciones,
        aceptacion_gerente,
        aceptacion_direccion,
      } = req.body;

      const sql = `
        UPDATE requisiciones
        SET concepto = ?,
            solicitante = ?,
            justificacion = ?,
            area = ?,
            fecha_requerida = ?,
            costos = ?,
            link_cotizaciones = ?,
            aceptacion_gerente = ?,
            aceptacion_direccion = ?
        WHERE id = ?
      `;
      await pool.query(sql, [
        concepto,
        solicitante,
        justificacion,
        area,
        fecha_requerida,
        costos,
        link_cotizaciones || null,
        aceptacion_gerente ? 1 : 0,
        aceptacion_direccion ? 1 : 0,
        req.params.id,
      ]);
      res.json({ mensaje: 'Requisición actualizada con éxito' });
    } catch (error) {
      console.error('Error al actualizar requisición:', error);
      res.status(500).json({ error: 'Error al actualizar requisición' });
    }
  },

  // Eliminar una requisición
  deleteRequisicion: async (req, res) => {
    try {
      await pool.query("DELETE FROM requisiciones WHERE id = ?", [req.params.id]);
      res.json({ mensaje: 'Requisición eliminada con éxito' });
    } catch (error) {
      console.error('Error al eliminar requisición:', error);
      res.status(500).json({ error: 'Error al eliminar requisición' });
    }
  },
};

module.exports = requisicionesController;
