// routes/contabilidad.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const router = express.Router();
const contabilidadController = require('../controllers/contabilidadController');

// Configuración de Multer
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Asegúrate de que 'uploads' existe en la raíz del Backend
    cb(null, path.join(__dirname, '..', '..', 'uploads'));
  },
  filename: function(req, file, cb) {
    // Generar un nombre único
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    // Solo el nombre de archivo (NO la ruta absoluta)
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Filtrar tipos de archivos permitidos
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'facturaPDF') {
    // Solo PDFs
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos PDF para facturaPDF'), false);
    }
  } else if (file.fieldname === 'facturaXML') {
    // Permitir XML, XLSX y CSV
    const allowedMimetypes = [
      'text/xml',
      'application/xml',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
      'text/csv',
      'application/vnd.ms-excel' // CSV alternativo
    ];
    if (allowedMimetypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos XML, XLSX o CSV para facturaXML'), false);
    }
  } else {
    cb(new Error('Campo de archivo desconocido'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// Rutas contabilidad
router.get('/', contabilidadController.getAllMovimientos);
router.get('/:id', contabilidadController.getMovimientoById);

router.post(
  '/',
  upload.fields([
    { name: 'facturaPDF', maxCount: 1 },
    { name: 'facturaXML', maxCount: 1 }
  ]),
  contabilidadController.createMovimiento
);

router.put(
  '/:id',
  upload.fields([
    { name: 'facturaPDF', maxCount: 1 },
    { name: 'facturaXML', maxCount: 1 }
  ]),
  contabilidadController.updateMovimiento
);

router.delete('/:id', contabilidadController.deleteMovimiento);

// Generar reporte Excel
router.get('/download/excel', contabilidadController.generarReporteExcel);

// Obtener estadísticas
router.get('/stats/estadisticas', contabilidadController.getEstadisticas);

// Recalcular todos los saldos contables
router.post('/recalcular-saldos', contabilidadController.recalcularSaldos);

// Servir archivos estáticos
router.get('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
  
  // Verificar que el archivo existe
  if (!require('fs').existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
  
  // Determinar el tipo MIME basado en la extensión
  const ext = path.extname(filename).toLowerCase();
  let contentType = 'application/octet-stream';
  
  if (ext === '.pdf') {
    contentType = 'application/pdf';
  } else if (ext === '.xml') {
    contentType = 'application/xml';
  } else if (ext === '.xlsx') {
    contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
  } else if (ext === '.csv') {
    contentType = 'text/csv';
  } else if (['.jpg', '.jpeg', '.png', '.gif'].includes(ext)) {
    contentType = `image/${ext.substring(1)}`;
  }
  
  res.setHeader('Content-Type', contentType);
  res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
  res.sendFile(filePath);
});

// Descargar archivo
router.get('/download/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
  
  if (!require('fs').existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
  
  res.download(filePath);
});

// Eliminar archivo
router.delete('/files/:filename', (req, res) => {
  const { filename } = req.params;
  const filePath = path.join(__dirname, '..', '..', 'uploads', filename);
  
  if (!require('fs').existsSync(filePath)) {
    return res.status(404).json({ error: 'Archivo no encontrado' });
  }
  
  try {
    require('fs').unlinkSync(filePath);
    res.json({ success: true, message: 'Archivo eliminado exitosamente' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar archivo' });
  }
});

// Manejo de errores de multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;






