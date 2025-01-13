// server.js
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Importar rutas
const authRoutes = require('./routes/auth');
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
const phasesRoutes = require('./routes/phases'); // Nuevo archivo de rutas para fases

// Middleware para logs de solicitudes (opcional, útil para depuración)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// Usar rutas con prefijo /api
app.use('/api/auth', authRoutes);
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
app.use('/api/phases', phasesRoutes); // Usar archivo de rutas para las fases

// Manejo de rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Ocurrió un error en el servidor' });
});

// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
