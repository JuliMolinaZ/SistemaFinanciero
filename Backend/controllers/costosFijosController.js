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

      // Se inserta cuenta_creada en 0 (no enviado)
      await db.query(
        'INSERT INTO costos_fijos (colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha, cuenta_creada) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [colaborador, puesto, monto_usd, monto_mxn, impuestos_imss, comentarios, fecha, 0]
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

      // No se actualiza cuenta_creada para evitar reiniciar el estado de envío
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

  enviarACuentasPagar: async (req, res) => {
    try {
      const { id } = req.params;
      // Obtener el costo fijo por id
      const [rows] = await db.query('SELECT * FROM costos_fijos WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Costo fijo no encontrado.' });
      }
      const costo = rows[0];
      if (costo.cuenta_creada) {
        return res.status(400).json({ error: 'El costo fijo ya ha sido enviado a cuentas por pagar.' });
      }
      // Mapear los campos para la cuenta por pagar
      const concepto = `Costo Fijo - ${costo.colaborador} (${costo.puesto})`;
      const monto_neto = costo.monto_mxn;
      const monto_con_iva = monto_neto; // Se asume que no se añade IVA adicional
      const requiere_iva = 0;
      const categoria = 'Costo Fijo';
      const proveedor_id = null;
      const fecha = costo.fecha;
      const pagado = 0;
      const pagos_parciales = 0;
      // Insertar en cuentas_por_pagar
      await db.query(
        'INSERT INTO cuentas_por_pagar (concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [concepto, monto_neto, monto_con_iva, requiere_iva, categoria, proveedor_id, fecha, pagado, pagos_parciales]
      );
      // Actualizar costo fijo para marcarlo como enviado
      await db.query('UPDATE costos_fijos SET cuenta_creada = 1 WHERE id = ?', [id]);
      res.json({ message: 'Costo fijo enviado a cuentas por pagar exitosamente.' });
    } catch (error) {
      console.error('Error al enviar costo fijo a cuentas por pagar:', error);
      res.status(500).json({ error: 'Error al enviar costo fijo a cuentas por pagar.' });
    }
  },
};

module.exports = costosFijosController;
