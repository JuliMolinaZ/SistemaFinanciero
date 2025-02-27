// controllers/permisosController.js
const pool = require('../config/db');

const permisosController = {
  // Obtener todos los permisos
  getPermisos: async (req, res) => {
    try {
      const [rows] = await pool.query('SELECT * FROM permisos ORDER BY id');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      res.status(500).json({ error: 'Error al obtener permisos' });
    }
  },

  // Actualizar el permiso usando el id
  updatePermiso: async (req, res) => {
    try {
      const { id } = req.params;
      const { acceso_administrador } = req.body;
      const [result] = await pool.query(
        'UPDATE permisos SET acceso_administrador = ? WHERE id = ?',
        [acceso_administrador, id]
      );
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Módulo no encontrado' });
      }
      res.json({ message: 'Permiso actualizado correctamente' });
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      res.status(500).json({ error: 'Error al actualizar permiso' });
    }
  },
};

module.exports = permisosController;
