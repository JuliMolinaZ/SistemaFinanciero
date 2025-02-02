// routes/emitidas.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const emitidasController = require('../controllers/emitidasController');

// Configuración de multer para guardar en carpeta 'uploads/'
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads')); 
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

// Filtrar tipos (pdf, xml, etc.) si quieres ser estricto
const fileFilter = (req, file, cb) => {
  // Ejemplo genérico: permitir PDF, XML, CSV, XLSX, etc. 
  // Ajusta según tus necesidades
  const allowedMimes = [
    'application/pdf',
    'application/xml',
    'text/xml',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // XLSX
    'text/csv',
    'application/vnd.ms-excel'
  ];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Tipo de archivo no permitido'), false);
  }
};

const upload = multer({ storage, fileFilter });

// Campos de carga múltiples
// maxCount es el número máximo de archivos que se pueden subir en cada campo
const fieldsConfig = upload.fields([
  { name: 'facturasPDF', maxCount: 10 },
  { name: 'facturasXML', maxCount: 10 },
  { name: 'comprobantesPago', maxCount: 10 },
  { name: 'complementosPDF', maxCount: 10 },
  { name: 'complementosXML', maxCount: 10 }
]);

// Rutas
router.get('/', emitidasController.getAllEmitidas);
router.post('/', fieldsConfig, emitidasController.createEmitida);

// Podrías añadir router.get('/:id', router.put('/:id', etc.)

// Manejo de errores Multer
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ error: err.message });
  } else if (err) {
    return res.status(400).json({ error: err.message });
  }
  next();
});

module.exports = router;
