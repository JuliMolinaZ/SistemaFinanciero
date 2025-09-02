const Joi = require('joi');

// Esquemas de validación para usuarios
const userSchemas = {
  create: Joi.object({
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(100).required(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('admin', 'user', 'manager').default('user'),
    avatar: Joi.string().uri().optional()
  }),

  update: Joi.object({
    email: Joi.string().email().optional(),
    name: Joi.string().min(2).max(100).optional(),
    password: Joi.string().min(6).optional(),
    role: Joi.string().valid('admin', 'user', 'manager').optional(),
    avatar: Joi.string().uri().optional()
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  })
};

// Esquemas de validación para clientes
const clientSchemas = {
  create: Joi.object({
    run_cliente: Joi.string().max(50).optional(),
    nombre: Joi.string().min(2).max(255).required(),
    rfc: Joi.string().max(50).optional(),
    
    // Información geográfica
    pais: Joi.string().max(100).optional(),
    estado: Joi.string().max(100).optional(),
    ciudad: Joi.string().max(100).optional(),
    direccion: Joi.string().optional(),
    
    // Información de contacto
    telefono: Joi.string().max(20).optional(),
    email: Joi.string().email().max(255).optional(),
    
    // Estado del cliente
    status: Joi.string().valid('activo', 'inactivo').default('activo')
  }),

  update: Joi.object({
    run_cliente: Joi.string().max(50).optional(),
    nombre: Joi.string().min(2).max(255).optional(),
    rfc: Joi.string().max(50).optional(),
    
    // Información geográfica
    pais: Joi.string().max(100).optional(),
    estado: Joi.string().max(100).optional(),
    ciudad: Joi.string().max(100).optional(),
    direccion: Joi.string().optional(),
    
    // Información de contacto
    telefono: Joi.string().max(20).optional(),
    email: Joi.string().email().max(255).optional(),
    
    // Estado del cliente
    status: Joi.string().valid('activo', 'inactivo').optional()
  })
};

// Esquemas de validación para proyectos
const projectSchemas = {
  create: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    cliente_id: Joi.number().integer().positive().required(),
    monto_sin_iva: Joi.number().positive().optional(),
    monto_con_iva: Joi.number().positive().optional(),
    phase_id: Joi.number().integer().positive().optional(),
    estado: Joi.string().max(50).optional(),
    descripcion: Joi.string().optional()
  }),

  update: Joi.object({
    nombre: Joi.string().min(2).max(255).optional(),
    cliente_id: Joi.number().integer().positive().optional(),
    monto_sin_iva: Joi.number().positive().optional(),
    monto_con_iva: Joi.number().positive().optional(),
    phase_id: Joi.number().integer().positive().optional(),
    estado: Joi.string().max(50).optional(),
    descripcion: Joi.string().optional()
  })
};

// Esquemas de validación para impuestos e IMSS
const impuestosIMSSSchemas = {
  create: Joi.object({
    concepto: Joi.string().min(2).max(255).required(),
    tipo_impuesto: Joi.string().max(100).required(),
    monto_base: Joi.number().positive().optional(),
    monto_impuesto: Joi.number().positive().optional(),
    monto_total: Joi.number().positive().required(),
    fecha_vencimiento: Joi.date().optional(),
    periodo: Joi.string().max(50).required(),
    proveedor_id: Joi.number().integer().positive().optional(),
    comentarios: Joi.string().optional()
  }),

  update: Joi.object({
    concepto: Joi.string().min(2).max(255).optional(),
    tipo_impuesto: Joi.string().max(100).optional(),
    monto_base: Joi.number().positive().optional(),
    monto_impuesto: Joi.number().positive().optional(),
    monto_total: Joi.number().positive().optional(),
    fecha_vencimiento: Joi.date().optional(),
    fecha_pago: Joi.date().optional(),
    estado: Joi.string().valid('pendiente', 'pagado', 'vencido').optional(),
    periodo: Joi.string().max(50).optional(),
    proveedor_id: Joi.number().integer().positive().optional(),
    factura_pdf: Joi.string().max(255).optional(),
    factura_xml: Joi.string().max(255).optional(),
    comentarios: Joi.string().optional(),
    autorizado: Joi.boolean().optional()
  })
};

// Esquemas de validación para proveedores
const providerSchemas = {
  create: Joi.object({
    run_proveedor: Joi.string().max(50).optional(),
    nombre: Joi.string().min(2).max(255).required(),
    direccion: Joi.string().optional(),
    elemento: Joi.string().max(255).optional().default(''),
    datos_bancarios: Joi.string().max(255).optional().default(''),
    contacto: Joi.string().max(255).optional().default(''),
    telefono: Joi.string().max(50).optional(),
    email: Joi.string().email().max(255).optional(),
    tipo_proveedor: Joi.string().valid('servicio', 'producto').default('producto'),
    estado: Joi.string().valid('activo', 'inactivo').default('activo')
  }),

  update: Joi.object({
    run_proveedor: Joi.string().max(50).optional(),
    nombre: Joi.string().min(2).max(255).optional(),
    direccion: Joi.string().optional(),
    elemento: Joi.string().max(255).optional(),
    datos_bancarios: Joi.string().max(255).optional(),
    contacto: Joi.string().max(255).optional(),
    telefono: Joi.string().max(50).optional(),
    email: Joi.string().email().max(255).optional(),
    tipo_proveedor: Joi.string().valid('servicio', 'producto').optional(),
    estado: Joi.string().valid('activo', 'inactivo').optional()
  })
};

// Esquemas de validación para cuentas por pagar
const cuentaPagarSchemas = {
  create: Joi.object({
    concepto: Joi.string().max(255).required(),
    monto_neto: Joi.number().positive().required(),
    monto_con_iva: Joi.number().positive().required(),
    categoria: Joi.string().max(255).optional(),
    proveedor_id: Joi.number().integer().positive().optional(),
    fecha: Joi.date().required(),
    pagado: Joi.boolean().default(false),
    autorizado: Joi.boolean().default(false),
    requiere_iva: Joi.boolean().default(false)
  }),

  update: Joi.object({
    concepto: Joi.string().max(255).optional(),
    monto_neto: Joi.number().positive().optional(),
    monto_con_iva: Joi.number().positive().optional(),
    categoria: Joi.string().max(255).optional(),
    proveedor_id: Joi.number().integer().positive().optional(),
    fecha: Joi.date().optional(),
    pagado: Joi.boolean().optional(),
    autorizado: Joi.boolean().optional(),
    requiere_iva: Joi.boolean().optional()
  })
};

// Esquemas de validación para cuentas por cobrar
const cuentaCobrarSchemas = {
  create: Joi.object({
    concepto: Joi.string().max(255).required(),
    monto_sin_iva: Joi.number().positive().required(),
    monto_con_iva: Joi.number().positive().required(),
    proyecto_id: Joi.number().integer().positive().optional(),
    fecha: Joi.date().required()
  }),

  update: Joi.object({
    concepto: Joi.string().max(255).optional(),
    monto_sin_iva: Joi.number().positive().optional(),
    monto_con_iva: Joi.number().positive().optional(),
    proyecto_id: Joi.number().integer().positive().optional(),
    fecha: Joi.date().optional()
  })
};

// Esquemas de validación para contabilidad
const contabilidadSchemas = {
  create: Joi.object({
    fecha: Joi.date().required(),
    concepto: Joi.string().max(255).required(),
    monto: Joi.number().required(),
    cargo: Joi.number().default(0),
    abono: Joi.number().default(0),
    saldo: Joi.number().default(0),
    status: Joi.string().max(50).default('Incompleto'),
    notas: Joi.string().optional(),
    tipo: Joi.string().max(50).optional(),
    facturaPDF: Joi.string().max(255).optional(),
    facturaXML: Joi.string().max(255).optional()
  }),

  update: Joi.object({
    fecha: Joi.date().optional(),
    concepto: Joi.string().max(255).optional(),
    monto: Joi.number().optional(),
    cargo: Joi.number().optional(),
    abono: Joi.number().optional(),
    saldo: Joi.number().optional(),
    status: Joi.string().max(50).optional(),
    notas: Joi.string().optional(),
    tipo: Joi.string().max(50).optional(),
    facturaPDF: Joi.string().max(255).optional(),
    facturaXML: Joi.string().max(255).optional()
  })
};

// Esquemas de validación para categorías
const categoriaSchemas = {
  create: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    descripcion: Joi.string().optional(),
    tipo: Joi.string().valid('producto', 'servicio').default('producto'),
    estado: Joi.string().valid('activa', 'inactiva').default('activa'),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).default('#667eea')
  }),

  update: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    descripcion: Joi.string().optional(),
    tipo: Joi.string().valid('producto', 'servicio').optional(),
    estado: Joi.string().valid('activa', 'inactiva').optional(),
    color: Joi.string().pattern(/^#[0-9A-Fa-f]{6}$/).optional()
  })
};

// Esquemas de validación para fases
const phaseSchemas = {
  create: Joi.object({
    nombre: Joi.string().min(2).max(255).required(),
    descripcion: Joi.string().optional()
  }),

  update: Joi.object({
    nombre: Joi.string().min(2).max(255).optional(),
    descripcion: Joi.string().optional()
  })
};

// Esquemas de validación para costos fijos
const costoFijoSchemas = {
  create: Joi.object({
    colaborador: Joi.string().max(255).required(),
    puesto: Joi.string().max(255).required(),
    monto_usd: Joi.number().positive().required(),
    monto_mxn: Joi.number().positive().required(),
    impuestos_imss: Joi.number().positive().required(),
    comentarios: Joi.string().optional(),
    fecha: Joi.date().required()
  }),

  update: Joi.object({
    colaborador: Joi.string().max(255).optional(),
    puesto: Joi.string().max(255).optional(),
    monto_usd: Joi.number().positive().optional(),
    monto_mxn: Joi.number().positive().optional(),
    impuestos_imss: Joi.number().positive().optional(),
    comentarios: Joi.string().optional(),
    fecha: Joi.date().optional()
  })
};

// Esquemas de validación para cotizaciones
const cotizacionSchemas = {
  create: Joi.object({
    cliente: Joi.string().max(255).required(),
    proyecto: Joi.string().max(255).required(),
    monto_neto: Joi.number().positive().required(),
    monto_con_iva: Joi.number().positive().required(),
    descripcion: Joi.string().optional(),
    documento: Joi.string().max(255).optional(),
    estado: Joi.string().valid('No creada', 'En proceso de aceptación', 'Aceptada por cliente', 'No aceptada').default('No creada')
  }),

  update: Joi.object({
    cliente: Joi.string().max(255).optional(),
    proyecto: Joi.string().max(255).optional(),
    monto_neto: Joi.number().positive().optional(),
    monto_con_iva: Joi.number().positive().optional(),
    descripcion: Joi.string().optional(),
    documento: Joi.string().max(255).optional(),
    estado: Joi.string().valid('No creada', 'En proceso de aceptación', 'Aceptada por cliente', 'No aceptada').optional()
  })
};

// Esquemas de validación para paginación
const paginationSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(10),
  search: Joi.string().max(100).optional(),
  sortBy: Joi.string().max(50).optional(),
  sortOrder: Joi.string().valid('asc', 'desc').default('desc')
});

// Esquemas de validación para IDs
const idSchema = Joi.object({
  id: Joi.number().integer().positive().required()
});

// Esquema para filtros de fecha
const dateFilterSchema = Joi.object({
  startDate: Joi.date().optional(),
  endDate: Joi.date().optional(),
  dateField: Joi.string().valid('created_at', 'updated_at', 'fecha').default('fecha')
});

// Exportar todos los esquemas
module.exports = {
  userSchemas,
  clientSchemas,
  projectSchemas,
  providerSchemas,
  cuentaPagarSchemas,
  cuentaCobrarSchemas,
  contabilidadSchemas,
  categoriaSchemas,
  phaseSchemas,
  costoFijoSchemas,
  cotizacionSchemas,
  impuestosIMSSSchemas,
  paginationSchema,
  idSchema,
  dateFilterSchema
}; 