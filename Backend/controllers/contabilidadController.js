// controllers/contabilidadController.js
const db = require('../config/db');
const ExcelJS = require('exceljs'); // Para generar XLS

// Funciones de ayuda
const calcularMonto = (cargo, abono) => {
  if (cargo > 0 && abono > 0) {
    throw new Error('Solo se puede ingresar cargo o abono, no ambos.');
  }
  return cargo > 0 ? cargo : -abono;
};

const obtenerUltimoSaldo = async () => {
  const [rows] = await db.query('SELECT saldo FROM contabilidad ORDER BY fecha DESC, id DESC LIMIT 1');
  if (rows.length > 0) {
    return parseFloat(rows[0].saldo);
  }
  return 0.00;
};

const contabilidadController = {
  // Obtener todos los movimientos contables
  getAllMovimientos: async (req, res) => {
    try {
      const [movimientos] = await db.query('SELECT * FROM contabilidad ORDER BY fecha ASC, id ASC');
      res.json(movimientos);
    } catch (error) {
      console.error('Error al obtener movimientos:', error);
      res.status(500).json({ error: 'Error al obtener movimientos contables.' });
    }
  },

  // Crear un nuevo movimiento
  createMovimiento: async (req, res) => {
    try {
      const { fecha, concepto, cargo, abono, tipo, notas } = req.body;

      // Guardamos solo el filename de PDF y XML
      const archivoPDF = req.files && req.files.facturaPDF
        ? req.files.facturaPDF[0].filename
        : null;
      const archivoXML = req.files && req.files.facturaXML
        ? req.files.facturaXML[0].filename
        : null;

      const cargoValido = parseFloat(cargo) || 0;
      const abonoValido = parseFloat(abono) || 0;

      if ((cargoValido > 0 && abonoValido > 0) || (cargoValido === 0 && abonoValido === 0)) {
        return res.status(400).json({ error: 'Debe ingresar solo un valor en "Cargo" o "Abono" y mayor a 0.' });
      }

      const monto = calcularMonto(cargoValido, abonoValido);
      const ultimoSaldo = await obtenerUltimoSaldo();
      const nuevoSaldo = ultimoSaldo + monto;
      const status = nuevoSaldo >= 0 ? 'Completo' : 'Incompleto';

      // Insertar
      const [result] = await db.query(
        `INSERT INTO contabilidad 
         (fecha, concepto, cargo, abono, monto, saldo, status, notas, facturaPDF, facturaXML) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [fecha, concepto, cargoValido, abonoValido, monto, nuevoSaldo, status, notas, archivoPDF, archivoXML]
      );

      res.status(201).json({
        id: result.insertId,
        fecha,
        concepto,
        cargo: cargoValido,
        abono: abonoValido,
        monto: monto.toFixed(2),
        saldo: nuevoSaldo.toFixed(2),
        status,
        notas,
        facturaPDF: archivoPDF,
        facturaXML: archivoXML,
      });
    } catch (error) {
      console.error('Error al crear movimiento contable:', error);
      res.status(500).json({ error: 'Error al crear movimiento contable.' });
    }
  },

  // Actualizar un movimiento
  updateMovimiento: async (req, res) => {
    try {
      const { id } = req.params;
      const { fecha, concepto, cargo, abono, tipo, notas } = req.body;

      const archivoPDF = req.files && req.files.facturaPDF
        ? req.files.facturaPDF[0].filename
        : null;
      const archivoXML = req.files && req.files.facturaXML
        ? req.files.facturaXML[0].filename
        : null;

      const cargoValido = parseFloat(cargo) || 0;
      const abonoValido = parseFloat(abono) || 0;
      if ((cargoValido > 0 && abonoValido > 0) || (cargoValido === 0 && abonoValido === 0)) {
        return res.status(400).json({ error: 'Debe ingresar solo un valor en "Cargo" o "Abono" y mayor a 0.' });
      }

      const monto = calcularMonto(cargoValido, abonoValido);

      // Obtener movimiento actual
      const [movimientos] = await db.query('SELECT * FROM contabilidad WHERE id = ?', [id]);
      if (movimientos.length === 0) {
        return res.status(404).json({ error: 'Movimiento no encontrado.' });
      }
      const movimientoActual = movimientos[0];

      // (Tu lógica de recalcular saldos)
      const [anteriorSaldoRows] = await db.query(
        'SELECT saldo FROM contabilidad WHERE fecha < ? OR (fecha = ? AND id < ?) ORDER BY fecha DESC, id DESC LIMIT 1',
        [fecha, fecha, id]
      );
      const anteriorSaldo = anteriorSaldoRows.length > 0 ? parseFloat(anteriorSaldoRows[0].saldo) : 0;
      const nuevoSaldo = anteriorSaldo + monto;
      const status = nuevoSaldo >= 0 ? 'Completo' : 'Incompleto';

      // Actualizar
      await db.query(
        `UPDATE contabilidad 
         SET fecha = ?, concepto = ?, cargo = ?, abono = ?, monto = ?, saldo = ?, status = ?, notas = ?,
             facturaPDF = COALESCE(?, facturaPDF),
             facturaXML = COALESCE(?, facturaXML)
         WHERE id = ?`,
        [
          fecha,
          concepto,
          cargoValido,
          abonoValido,
          monto,
          nuevoSaldo,
          status,
          notas,
          archivoPDF, // Si es null, no reemplaza
          archivoXML,
          id
        ]
      );

      res.status(200).json({
        id,
        fecha,
        concepto,
        cargo: cargoValido,
        abono: abonoValido,
        monto: monto.toFixed(2),
        saldo: nuevoSaldo.toFixed(2),
        status,
        notas,
        facturaPDF: archivoPDF || movimientoActual.facturaPDF,
        facturaXML: archivoXML || movimientoActual.facturaXML,
      });
    } catch (error) {
      console.error('Error al actualizar movimiento contable:', error);
      res.status(500).json({ error: 'Error al actualizar movimiento contable.' });
    }
  },

  // Eliminar un movimiento
  deleteMovimiento: async (req, res) => {
    try {
      const { id } = req.params;

      const [movimientos] = await db.query('SELECT * FROM contabilidad WHERE id = ?', [id]);
      if (movimientos.length === 0) {
        return res.status(404).json({ error: 'Movimiento no encontrado.' });
      }
      const movimiento = movimientos[0];

      // Eliminar
      await db.query('DELETE FROM contabilidad WHERE id = ?', [id]);

      // Recalcular saldos (si corresponde)
      // ...

      res.status(200).json({ message: 'Movimiento eliminado correctamente.' });
    } catch (error) {
      console.error('Error al eliminar movimiento contable:', error);
      res.status(500).json({ error: 'Error al eliminar movimiento contable.' });
    }
  },

  // Descargar XLS
  downloadXLS: async (req, res) => {
    try {
      const [movimientos] = await db.query('SELECT * FROM contabilidad ORDER BY fecha ASC, id ASC');

      const workbook = new ExcelJS.Workbook();
      const worksheet = workbook.addWorksheet('Movimientos Contables');

      // Definir columnas
      worksheet.columns = [
        { header: 'Fecha', key: 'fecha', width: 15 },
        { header: 'Concepto', key: 'concepto', width: 30 },
        { header: 'Cargo', key: 'cargo', width: 15 },
        { header: 'Abono', key: 'abono', width: 15 },
        { header: 'Monto', key: 'monto', width: 15 },
        { header: 'Saldo', key: 'saldo', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Notas', key: 'notas', width: 30 },
        { header: 'Factura PDF', key: 'facturaPDF', width: 30 },
        { header: 'Factura XML/XLSX/CSV', key: 'facturaXML', width: 30 },
      ];

      // Agregar filas
      movimientos.forEach((m) => {
        worksheet.addRow({
          fecha: m.fecha,
          concepto: m.concepto,
          cargo: m.cargo,
          abono: m.abono,
          monto: m.monto,
          saldo: m.saldo,
          status: m.status,
          notas: m.notas,
          facturaPDF: m.facturaPDF,
          facturaXML: m.facturaXML,
        });
      });

      // Formatear
      worksheet.getColumn('fecha').numFmt = 'dd/mm/yyyy';
      worksheet.getColumn('cargo').numFmt = '$#,##0.00';
      worksheet.getColumn('abono').numFmt = '$#,##0.00';
      worksheet.getColumn('monto').numFmt = '$#,##0.00';
      worksheet.getColumn('saldo').numFmt = '$#,##0.00';

      // Encabezados de descarga
      res.setHeader(
        'Content-Type',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      res.setHeader('Content-Disposition', 'attachment; filename=movimientos_contables.xlsx');

      await workbook.xlsx.write(res);
      res.end();
    } catch (error) {
      console.error('Error al descargar movimientos:', error);
      res.status(500).json({ error: 'Error al descargar movimientos contables.' });
    }
  }
};

module.exports = contabilidadController;



