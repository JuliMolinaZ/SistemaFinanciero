// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Configuración de CORS para permitir solicitudes desde producción y desde localhost:3000
const corsOptions = {
  origin: (origin, callback) => {
    // Permite solicitudes sin origen (por ejemplo, desde Postman) o cuando no se especifica origen
    if (!origin) return callback(null, true);

    // Lista de orígenes permitidos
    const allowedOrigins = [
      'https://sigma.runsolutions-services.com', 
      'http://localhost:3000'                     
    ];

    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Origen no permitido por CORS'));
    }
  }
};

app.use(cors(corsOptions));
app.use(bodyParser.json());

// Servir archivos estáticos desde la carpeta "uploads"
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Importar rutas
const authRoutes = require('./routes/auth');
const permisosRoutes = require('./routes/permisos');
const usuariosRoutes = require('./routes/usuarios');
const clientsRoutes = require('./routes/clients');
const projectsRoutes = require('./routes/projects');
const proveedoresRoutes = require('./routes/proveedores');
const cuentasPagarRoutes = require('./routes/cuentasPagar');
const cuentasCobrarRoutes = require('./routes/cuentasCobrar');
const contabilidadRoutes = require('./routes/contabilidad');
const categoriasRoutes = require('./routes/categorias');
const recuperacionRoutes = require('./routes/recuperacion');
const rolesRoutes = require('./routes/roles');
const assetsRoutes = require('./routes/assets');
const phasesRoutes = require('./routes/phases');
const costosFijosRoutes = require('./routes/costosFijos');
const graphRoutes = require('./routes/realtimeGraph');
const projectCostsRoutes = require('./routes/projectCosts');
const emitidasRoutes = require('./routes/emitidas');

// Middleware para loggear cada solicitud (opcional)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Prefijo "/api" para las rutas
app.use('/api/auth', authRoutes);
app.use('/api/permisos', permisosRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/clients', clientsRoutes);
app.use('/api/projects', projectsRoutes);
app.use('/api/proveedores', proveedoresRoutes);
app.use('/api/cuentas-pagar', cuentasPagarRoutes);
app.use('/api/cuentas-cobrar', cuentasCobrarRoutes);
app.use('/api/contabilidad', contabilidadRoutes);
app.use('/api/categorias', categoriasRoutes);
app.use('/api/recuperacion', recuperacionRoutes);
app.use('/api/roles', rolesRoutes);
app.use('/api/assets', assetsRoutes);
app.use('/api/phases', phasesRoutes);
app.use('/api/costos-fijos', costosFijosRoutes);
app.use('/api/graph', graphRoutes);
app.use('/api/project-costs', projectCostsRoutes);
app.use('/api/emitidas', emitidasRoutes);

// Ruta 404 para solicitudes no encontradas
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Middleware de manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Ocurrió un error en el servidor.' });
});

// Iniciar el servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
