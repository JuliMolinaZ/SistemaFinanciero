// controllers/permisosController.js
const db = require('../config/db');

const permisosController = {
  getPermisos: async (req, res) => {
    try {
      const [permisos] = await db.query('SELECT * FROM permisos');
      res.json(permisos); // Asegúrate de que devuelve todos los permisos correctamente.
    } catch (error) {
      console.error('Error al obtener permisos:', error);
      res.status(500).json({ error: 'Error al obtener los permisos.' });
    }
  },

  updatePermiso: async (req, res) => {
    try {
      const { modulo } = req.params; // Nombre del módulo
      const { acceso_administrador } = req.body; // Nuevo estado del permiso

      const [result] = await db.query(
        'UPDATE permisos SET acceso_administrador = ? WHERE modulo = ?',
        [acceso_administrador, modulo]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Módulo no encontrado.' });
      }

      res.status(200).json({ message: 'Permiso actualizado correctamente.' });
    } catch (error) {
      console.error('Error al actualizar permiso:', error);
      res.status(500).json({ error: 'Error al actualizar el permiso.' });
    }
  },
};

module.exports = permisosController;



