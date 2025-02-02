// controllers/emitidasController.js

const db = require('../config/db'); // Tu conexión a MySQL

const emitidasController = {
  // Obtener todas las facturas emitidas
  getAllEmitidas: async (req, res) => {
    try {
      const [rows] = await db.query('SELECT * FROM emitidas ORDER BY id DESC');
      res.json(rows);
    } catch (error) {
      console.error('Error al obtener emitidas:', error);
      res.status(500).json({ error: 'Error al obtener facturas emitidas' });
    }
  },

  // Crear nueva factura emitida
  createEmitida: async (req, res) => {
    try {
      // Campos básicos en body
      const {
        rfcReceptor,
        razonSocial,
        fechaEmision,
        subtotal,
        iva,
        total,
        claveSat,
        descripcion,
        facturaAdmon,
        pue,
        ppd,
        pagos
      } = req.body;

      // Convierte string a boolean si es necesario
      const facturaAdmonBool = (facturaAdmon === 'true' || facturaAdmon === true) ? 1 : 0;
      const pueBool = (pue === 'true' || pue === true) ? 1 : 0;
      const ppdBool = (ppd === 'true' || ppd === true) ? 1 : 0;

      // Parsea pagos (JSON string -> array)
      let pagosJSON = [];
      if (pagos) {
        pagosJSON = JSON.parse(pagos); 
      }

      // Archivos subidos (múltiples) vienen en req.files
      // Este objeto se configura según Multer + upload.fields
      // Ej: req.files.facturasPDF, req.files.facturasXML, etc.
      const facturasPDF = req.files.facturasPDF?.map(file => file.filename) || [];
      const facturasXML = req.files.facturasXML?.map(file => file.filename) || [];
      const comprobantesPago = req.files.comprobantesPago?.map(file => file.filename) || [];
      const complementosPDF = req.files.complementosPDF?.map(file => file.filename) || [];
      const complementosXML = req.files.complementosXML?.map(file => file.filename) || [];

      // Insertar en la base de datos
      const sql = `
        INSERT INTO emitidas 
        (rfcReceptor, razonSocial, fechaEmision, subtotal, iva, total, claveSat, descripcion,
         facturaAdmon, pue, ppd, pagos, facturasPDF, facturasXML, comprobantesPago, complementosPDF, complementosXML)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const [result] = await db.query(sql, [
        rfcReceptor,
        razonSocial,
        fechaEmision,
        parseFloat(subtotal) || 0,
        parseFloat(iva) || 0,
        parseFloat(total) || 0,
        claveSat,
        descripcion || '',
        facturaAdmonBool,
        pueBool,
        ppdBool,
        JSON.stringify(pagosJSON),
        JSON.stringify(facturasPDF),
        JSON.stringify(facturasXML),
        JSON.stringify(comprobantesPago),
        JSON.stringify(complementosPDF),
        JSON.stringify(complementosXML)
      ]);

      res.status(201).json({
        id: result.insertId,
        message: 'Factura emitida creada correctamente'
      });
    } catch (error) {
      console.error('Error al crear factura emitida:', error);
      res.status(500).json({ error: 'Error al crear factura emitida' });
    }
  },

  // Obtener una factura emitida por ID
  getEmitidaById: async (req, res) => {
    try {
      const { id } = req.params;
      const [rows] = await db.query('SELECT * FROM emitidas WHERE id = ?', [id]);
      if (rows.length === 0) {
        return res.status(404).json({ error: 'Factura emitida no encontrada' });
      }
      res.json(rows[0]);
    } catch (error) {
      console.error('Error al obtener factura emitida:', error);
      res.status(500).json({ error: 'Error al obtener factura emitida' });
    }
  },

  // Actualizar una factura emitida por ID
  updateEmitida: async (req, res) => {
    try {
      const { id } = req.params;
      // Similar lógica a createEmitida, pero usando UPDATE SQL
      // Extraer campos y archivos como en createEmitida
      const {
        rfcReceptor,
        razonSocial,
        fechaEmision,
        subtotal,
        iva,
        total,
        claveSat,
        descripcion,
        facturaAdmon,
        pue,
        ppd,
        pagos
      } = req.body;

      // Convierte string a boolean si es necesario
      const facturaAdmonBool = (facturaAdmon === 'true' || facturaAdmon === true) ? 1 : 0;
      const pueBool = (pue === 'true' || pue === true) ? 1 : 0;
      const ppdBool = (ppd === 'true' || ppd === true) ? 1 : 0;

      // Parsea pagos (JSON string -> array)
      let pagosJSON = [];
      if (pagos) {
        pagosJSON = JSON.parse(pagos); 
      }

      // Archivos subidos (múltiples) vienen en req.files
      const facturasPDF = req.files.facturasPDF?.map(file => file.filename) || [];
      const facturasXML = req.files.facturasXML?.map(file => file.filename) || [];
      const comprobantesPago = req.files.comprobantesPago?.map(file => file.filename) || [];
      const complementosPDF = req.files.complementosPDF?.map(file => file.filename) || [];
      const complementosXML = req.files.complementosXML?.map(file => file.filename) || [];

      // Actualizar en la base de datos
      const sql = `
        UPDATE emitidas SET 
          rfcReceptor = ?, 
          razonSocial = ?, 
          fechaEmision = ?, 
          subtotal = ?, 
          iva = ?, 
          total = ?, 
          claveSat = ?, 
          descripcion = ?, 
          facturaAdmon = ?, 
          pue = ?, 
          ppd = ?, 
          pagos = ?, 
          facturasPDF = ?, 
          facturasXML = ?, 
          comprobantesPago = ?, 
          complementosPDF = ?, 
          complementosXML = ?
        WHERE id = ?
      `;

      await db.query(sql, [
        rfcReceptor,
        razonSocial,
        fechaEmision,
        parseFloat(subtotal) || 0,
        parseFloat(iva) || 0,
        parseFloat(total) || 0,
        claveSat,
        descripcion || '',
        facturaAdmonBool,
        pueBool,
        ppdBool,
        JSON.stringify(pagosJSON),
        JSON.stringify(facturasPDF),
        JSON.stringify(facturasXML),
        JSON.stringify(comprobantesPago),
        JSON.stringify(complementosPDF),
        JSON.stringify(complementosXML),
        id
      ]);

      res.json({ message: 'Factura emitida actualizada correctamente' });
    } catch (error) {
      console.error('Error al actualizar factura emitida:', error);
      res.status(500).json({ error: 'Error al actualizar factura emitida' });
    }
  },

  // Eliminar una factura emitida por ID
  deleteEmitida: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query('DELETE FROM emitidas WHERE id = ?', [id]);
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'Factura emitida no encontrada' });
      }
      res.json({ message: 'Factura emitida eliminada correctamente' });
    } catch (error) {
      console.error('Error al eliminar factura emitida:', error);
      res.status(500).json({ error: 'Error al eliminar factura emitida' });
    }
  }
};

module.exports = emitidasController;
