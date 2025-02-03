// src/controllers/cotizacionesController.js
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/db'); // Asegúrate de que pool se importe correctamente

// Función auxiliar para obtener el nombre del cliente por su ID
const getClientNameById = async (clientId) => {
  try {
    // Nota: Se usa la tabla "clients" y se selecciona la columna "nombre"
    const [rows] = await pool.promise().query(
      'SELECT nombre FROM clients WHERE id = ?',
      [clientId]
    );
    if (rows.length > 0) {
      // Retorna el nombre obtenido o, en su defecto, el propio ID
      return rows[0].nombre || clientId;
    }
    return clientId;
  } catch (error) {
    console.error('Error al obtener nombre del cliente:', error);
    return clientId;
  }
};

// Función auxiliar para verificar si ya existe una cuenta por cobrar para la cotización
const cuentaCobrarExists = async (cotID, proyecto, clientName) => {
  try {
    const pattern = `%Cotización de ${clientName}%`;
    const [rows] = await pool.promise().query(
      'SELECT id FROM cuentas_por_cobrar WHERE proyecto_id = ? AND concepto LIKE ?',
      [proyecto, pattern]
    );
    return rows.length > 0;
  } catch (error) {
    console.error('Error al verificar cuenta por cobrar existente:', error);
    return false;
  }
};

// Función para crear una cotización
exports.createCotizacion = async (req, res) => {
  try {
    console.log('Body recibido:', req.body);
    console.log('Archivo recibido:', req.file);

    const { cliente, proyecto, montoSinIVA, montoConIVA, descripcion, estado } = req.body;
    const documento = req.file ? req.file.filename : null;

    const sql = `
      INSERT INTO cotizaciones (cliente, proyecto, monto_neto, monto_con_iva, descripcion, documento, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    const values = [cliente, proyecto, montoSinIVA, montoConIVA, descripcion, documento, estado];

    const [result] = await pool.promise().query(sql, values);
    console.log('Resultado de la inserción:', result);

    // Si la cotización se crea con el estado "Aceptada por cliente", crear la cuenta por cobrar
    if (estado === 'Aceptada por cliente') {
      const newCotID = result.insertId;
      const clientName = await getClientNameById(cliente);
      // Se arma el concepto usando el nombre del cliente (no el número de cliente)
      const concepto = `Cotización de ${clientName} - ${descripcion}`;
      
      // Verificar si ya existe una cuenta por cobrar para esta cotización
      const exists = await cuentaCobrarExists(newCotID, proyecto, clientName);
      if (!exists) {
        const sql2 = `
          INSERT INTO cuentas_por_cobrar (proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha)
          VALUES (?, ?, ?, ?, NOW())
        `;
        const values2 = [proyecto, concepto, montoSinIVA, montoConIVA];
        const [result2] = await pool.promise().query(sql2, values2);
        console.log('Cuenta por cobrar creada (create):', result2);
      } else {
        console.log('La cuenta por cobrar ya existe para esta cotización.');
      }
    }

    res.status(201).json({ message: 'Cotización creada con éxito.' });
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({ message: 'Error al crear cotización.' });
  }
};

// Función para listar todas las cotizaciones
exports.getCotizaciones = async (req, res) => {
  try {
    const sql = 'SELECT * FROM cotizaciones';
    const [rows] = await pool.promise().query(sql);
    res.status(200).json(rows);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ message: 'Error al obtener cotizaciones.' });
  }
};

// Función para actualizar una cotización
exports.updateCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    const { cliente, proyecto, montoSinIVA, montoConIVA, descripcion, estado } = req.body;
    const documento = req.file ? req.file.filename : null;

    const [existingRows] = await pool.promise().query('SELECT documento FROM cotizaciones WHERE id = ?', [id]);
    if (existingRows.length === 0) {
      return res.status(404).json({ message: 'Cotización no encontrada.' });
    }
    const existingDocument = existingRows[0].documento;
    const finalDocument = documento || existingDocument;

    const sql = `
      UPDATE cotizaciones 
      SET cliente = ?, proyecto = ?, monto_neto = ?, monto_con_iva = ?, descripcion = ?, documento = ?, estado = ?
      WHERE id = ?
    `;
    const values = [cliente, proyecto, montoSinIVA, montoConIVA, descripcion, finalDocument, estado, id];

    const [result] = await pool.promise().query(sql, values);
    console.log('Resultado de la actualización:', result);

    // Si la cotización se actualiza a "Aceptada por cliente", verificar y crear la cuenta por cobrar si no existe
    if (estado === 'Aceptada por cliente') {
      const clientName = await getClientNameById(cliente);
      const concepto = `Cotización de ${clientName} - ${descripcion}`;
      const exists = await cuentaCobrarExists(id, proyecto, clientName);
      if (!exists) {
        const sql2 = `
          INSERT INTO cuentas_por_cobrar (proyecto_id, concepto, monto_sin_iva, monto_con_iva, fecha)
          VALUES (?, ?, ?, ?, NOW())
        `;
        const values2 = [proyecto, concepto, montoSinIVA, montoConIVA];
        const [result2] = await pool.promise().query(sql2, values2);
        console.log('Cuenta por cobrar creada (update):', result2);
      } else {
        console.log('La cuenta por cobrar ya existe para esta cotización (update).');
      }
    }

    res.status(200).json({ message: 'Cotización actualizada con éxito.' });
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    res.status(500).json({ message: 'Error al actualizar cotización.' });
  }
};

// Función para eliminar una cotización
exports.deleteCotizacion = async (req, res) => {
  try {
    const { id } = req.params;

    const [rows] = await pool.promise().query('SELECT documento FROM cotizaciones WHERE id = ?', [id]);
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Cotización no encontrada.' });
    }
    const documento = rows[0].documento;
    if (documento) {
      const filePath = path.join(__dirname, '../../uploads', documento);
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error('Error al eliminar el archivo:', err);
        } else {
          console.log('Archivo eliminado:', documento);
        }
      });
    }

    const sql = 'DELETE FROM cotizaciones WHERE id = ?';
    const [result] = await pool.promise().query(sql, [id]);
    console.log('Resultado de la eliminación:', result);
    res.status(200).json({ message: 'Cotización eliminada con éxito.' });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({ message: 'Error al eliminar cotización.' });
  }
};

