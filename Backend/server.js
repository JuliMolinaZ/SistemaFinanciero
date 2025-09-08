// server.js
const express = require('express')
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
      'http://localhost:3000',
      'http://localhost:2103',
      'http://localhost:3005'                     
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
const authRoutes = require('./src/routes/auth');
const permisosRoutes = require('./src/routes/permisos');
const usuariosRoutes = require('./src/routes/usuarios');
const clientsRoutes = require('./src/routes/clients');
const projectsRoutes = require('./src/routes/projects');
const proveedoresRoutes = require('./src/routes/proveedores');
const cuentasPagarRoutes = require('./src/routes/cuentasPagar');
const cuentasCobrarRoutes = require('./src/routes/cuentasCobrar');
const contabilidadRoutes = require('./src/routes/contabilidad');
const categoriasRoutes = require('./src/routes/categorias');
const recuperacionRoutes = require('./src/routes/recuperacion');
const rolesRoutes = require('./src/routes/roles');
const assetsRoutes = require('./src/routes/assets');
const phasesRoutes = require('./src/routes/phases');
const costosFijosRoutes = require('./src/routes/costosFijos');
const projectCostsRoutes = require('./src/routes/projectCosts');
const emitidasRoutes = require('./src/routes/emitidas');
const flowRecoveryV2Routes = require('./src/routes/flowRecoveryV2');
const complementosPagoRoutes = require('./src/routes/complementosPago');
const requisicionesRoutes = require('./routes/requisiciones');

// Nueva ruta para Cotizaciones
const cotizacionesRoutes = require('./src/routes/cotizaciones');

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
// app.use('/api/graph', graphRoutes); // Ruta no disponible
app.use('/api/project-costs', projectCostsRoutes);
app.use('/api/emitidas', emitidasRoutes);
app.use('/api/flowRecoveryV2', flowRecoveryV2Routes);
app.use('/api/complementos-pago', complementosPagoRoutes);
app.use('/api/requisiciones', requisicionesRoutes);

// Nueva ruta de cotizaciones
app.use('/api/cotizaciones', cotizacionesRoutes);

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
