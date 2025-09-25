// routes/emitidas.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const emitidasController = require('../controllers/emitidasController');

// Configuración de multer para guardar en carpeta 'uploads/'
const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    // Usar path.join para construir la ruta correcta desde la raíz del backend
    const uploadPath = path.join(__dirname, '..', '..', 'uploads');

    cb(null, uploadPath); 
  },
  filename: function(req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const filename = uniqueSuffix + '-' + file.originalname;

    cb(null, filename);
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

const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB máximo por archivo
    files: 50 // máximo 50 archivos total
  }
});

// Middleware de debug para multer
const debugMulter = (req, res, next) => {

  next();
};

// Campos de carga múltiples
// maxCount es el número máximo de archivos que se pueden subir en cada campo
const fieldsConfig = upload.fields([
  { name: 'facturasPDF', maxCount: 10 },
  { name: 'facturasXML', maxCount: 10 },
  { name: 'comprobantesPago', maxCount: 10 },
  { name: 'complementosPDF', maxCount: 10 },
  { name: 'complementosXML', maxCount: 10 }
]);

// Middleware de timeout para evitar peticiones colgadas
const timeoutMiddleware = (req, res, next) => {
  const timeout = setTimeout(() => {

    res.status(408).json({ 
      success: false, 
      error: 'Request Timeout',
      message: 'La petición excedió el tiempo límite de 30 segundos'
    });
  }, 30000); // 30 segundos

  res.on('finish', () => {
    clearTimeout(timeout);
  });

  next();
};

// Rutas
router.get('/', emitidasController.getAllEmitidas);
router.get('/:id', emitidasController.getEmitidaById);
router.post('/', timeoutMiddleware, debugMulter, fieldsConfig, emitidasController.createEmitida);
router.put('/:id', timeoutMiddleware, debugMulter, fieldsConfig, emitidasController.updateEmitida);
router.delete('/:id', emitidasController.deleteEmitida);

// Manejo de errores Multer mejorado
router.use((err, req, res, next) => {

  if (err instanceof multer.MulterError) {

    return res.status(400).json({ 
      success: false,
      error: err.message,
      code: err.code,
      message: 'Error en el procesamiento de archivos'
    });
  } else if (err) {

    return res.status(500).json({ 
      success: false,
      error: err.message,
      message: 'Error interno del servidor'
    });
  }
  next();
});

module.exports = router;
