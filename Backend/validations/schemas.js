const Joi = require('joi');

// Esquemas base reutilizables
const baseId = Joi.number().integer().positive().required();
const baseString = Joi.string().trim().min(1).max(255);
const baseEmail = Joi.string().email().max(255);
const baseDate = Joi.date().iso();
const baseAmount = Joi.number().positive().precision(2);
const baseBoolean = Joi.boolean();

// Esquema para usuarios
const userSchema = {
  create: Joi.object({
    firebase_uid: Joi.string().required().min(1).max(255),
    email: baseEmail.required(),
    name: baseString.required().min(2).max(100),
    role: baseString.required().valid('juan carlos', 'administrador', 'usuario', 'defaultRole'),
    avatar: Joi.string().uri().allow('', null).max(500)
  }),

  update: Joi.object({
    name: baseString.min(2).max(100),
    role: baseString.valid('juan carlos', 'administrador', 'usuario', 'defaultRole'),
    avatar: Joi.string().uri().allow('', null).max(500)
  }).min(1) // Al menos un campo debe estar presente
};

// Esquema para clientes
const clientSchema = {
  create: Joi.object({
    run_cliente: baseString.required().min(8).max(20),
    nombre: baseString.required().min(2).max(100),
    rfc: baseString.required().min(10).max(13),
    direccion: baseString.required().min(5).max(255)
  }),

  update: Joi.object({
    run_cliente: baseString.min(8).max(20),
    nombre: baseString.min(2).max(100),
    rfc: baseString.min(10).max(13),
    direccion: baseString.min(5).max(255)
  }).min(1)
};

// Esquema para proyectos
const projectSchema = {
  create: Joi.object({
    nombre: baseString.required().min(2).max(255),
    cliente_id: baseId,
    monto_sin_iva: baseAmount.required(),
    monto_con_iva: baseAmount.required(),
    phase_id: Joi.number().integer().positive().allow(null),
    descripcion: Joi.string().trim().max(1000).allow('', null),
    fecha_inicio: baseDate.allow(null),
    fecha_fin: baseDate.allow(null),
    estado: baseString.valid('activo', 'pausado', 'completado', 'cancelado').default('activo')
  }),

  update: Joi.object({
    nombre: baseString.min(2).max(255),
    cliente_id: baseId,
    monto_sin_iva: baseAmount,
    monto_con_iva: baseAmount,
    phase_id: Joi.number().integer().positive().allow(null),
    descripcion: Joi.string().trim().max(1000).allow('', null),
    fecha_inicio: baseDate.allow(null),
    fecha_fin: baseDate.allow(null),
    estado: baseString.valid('activo', 'pausado', 'completado', 'cancelado')
  }).min(1)
};

// Esquema para proveedores
const providerSchema = {
  create: Joi.object({
    nombre: baseString.required().min(2).max(100),
    rfc: baseString.required().min(10).max(13),
    direccion: baseString.required().min(5).max(255),
    telefono: Joi.string().trim().pattern(/^[\d\s\-\+\(\)]+$/).min(10).max(20).allow('', null),
    email: baseEmail.allow('', null),
    contacto: baseString.max(100).allow('', null)
  }),

  update: Joi.object({
    nombre: baseString.min(2).max(100),
    rfc: baseString.min(10).max(13),
    direccion: baseString.min(5).max(255),
    telefono: Joi.string().trim().pattern(/^[\d\s\-\+\(\)]+$/).min(10).max(20).allow('', null),
    email: baseEmail.allow('', null),
    contacto: baseString.max(100).allow('', null)
  }).min(1)
};

// Esquema para cuentas por pagar
const cuentasPagarSchema = {
  create: Joi.object({
    concepto: baseString.required().min(2).max(255),
    monto_neto: baseAmount.required(),
    requiere_iva: baseBoolean.required(),
    categoria: baseString.required().min(2).max(100),
    proveedor_id: Joi.number().integer().positive().allow(null),
    fecha: baseDate.required(),
    pagado: baseBoolean.default(false),
    pagos_parciales: Joi.number().min(0).precision(2).default(0),
    descripcion: Joi.string().trim().max(500).allow('', null),
    numero_factura: Joi.string().trim().max(50).allow('', null)
  }),

  update: Joi.object({
    concepto: baseString.min(2).max(255),
    monto_neto: baseAmount,
    requiere_iva: baseBoolean,
    categoria: baseString.min(2).max(100),
    proveedor_id: Joi.number().integer().positive().allow(null),
    fecha: baseDate,
    pagado: baseBoolean,
    pagos_parciales: Joi.number().min(0).precision(2),
    descripcion: Joi.string().trim().max(500).allow('', null),
    numero_factura: Joi.string().trim().max(50).allow('', null)
  }).min(1)
};

// Esquema para cuentas por cobrar
const cuentasCobrarSchema = {
  create: Joi.object({
    concepto: baseString.required().min(2).max(255),
    monto: baseAmount.required(),
    cliente_id: baseId.required(),
    fecha_emision: baseDate.required(),
    fecha_vencimiento: baseDate.required(),
    estado: baseString.valid('pendiente', 'pagado', 'vencido', 'parcial').default('pendiente'),
    numero_factura: Joi.string().trim().max(50).allow('', null),
    descripcion: Joi.string().trim().max(500).allow('', null)
  }),

  update: Joi.object({
    concepto: baseString.min(2).max(255),
    monto: baseAmount,
    cliente_id: baseId,
    fecha_emision: baseDate,
    fecha_vencimiento: baseDate,
    estado: baseString.valid('pendiente', 'pagado', 'vencido', 'parcial'),
    numero_factura: Joi.string().trim().max(50).allow('', null),
    descripcion: Joi.string().trim().max(500).allow('', null)
  }).min(1)
};

// Esquema para contabilidad
const contabilidadSchema = {
  create: Joi.object({
    concepto: baseString.required().min(2).max(255),
    monto: baseAmount.required(),
    tipo: baseString.required().valid('ingreso', 'gasto'),
    categoria: baseString.required().min(2).max(100),
    fecha: baseDate.required(),
    descripcion: Joi.string().trim().max(500).allow('', null),
    numero_comprobante: Joi.string().trim().max(50).allow('', null),
    metodo_pago: baseString.valid('efectivo', 'transferencia', 'cheque', 'tarjeta').allow('', null)
  }),

  update: Joi.object({
    concepto: baseString.min(2).max(255),
    monto: baseAmount,
    tipo: baseString.valid('ingreso', 'gasto'),
    categoria: baseString.min(2).max(100),
    fecha: baseDate,
    descripcion: Joi.string().trim().max(500).allow('', null),
    numero_comprobante: Joi.string().trim().max(50).allow('', null),
    metodo_pago: baseString.valid('efectivo', 'transferencia', 'cheque', 'tarjeta').allow('', null)
  }).min(1)
};

// Esquema para categorías
const categoriaSchema = {
  create: Joi.object({
    nombre: baseString.required().min(2).max(100),
    descripcion: Joi.string().trim().max(500).allow('', null),
    tipo: baseString.valid('ingreso', 'gasto', 'ambos').default('gasto'),
    activo: baseBoolean.default(true)
  }),

  update: Joi.object({
    nombre: baseString.min(2).max(100),
    descripcion: Joi.string().trim().max(500).allow('', null),
    tipo: baseString.valid('ingreso', 'gasto', 'ambos'),
    activo: baseBoolean
  }).min(1)
};

// Esquema para fases
const phaseSchema = {
  create: Joi.object({
    nombre: baseString.required().min(2).max(100),
    descripcion: Joi.string().trim().max(500).allow('', null),
    orden: Joi.number().integer().min(1).required(),
    activo: baseBoolean.default(true)
  }),

  update: Joi.object({
    nombre: baseString.min(2).max(100),
    descripcion: Joi.string().trim().max(500).allow('', null),
    orden: Joi.number().integer().min(1),
    activo: baseBoolean
  }).min(1)
};

// Esquema para costos fijos
const costosFijosSchema = {
  create: Joi.object({
    concepto: baseString.required().min(2).max(255),
    monto: baseAmount.required(),
    categoria: baseString.required().min(2).max(100),
    frecuencia: baseString.required().valid('mensual', 'trimestral', 'semestral', 'anual'),
    fecha_inicio: baseDate.required(),
    activo: baseBoolean.default(true),
    descripcion: Joi.string().trim().max(500).allow('', null)
  }),

  update: Joi.object({
    concepto: baseString.min(2).max(255),
    monto: baseAmount,
    categoria: baseString.min(2).max(100),
    frecuencia: baseString.valid('mensual', 'trimestral', 'semestral', 'anual'),
    fecha_inicio: baseDate,
    activo: baseBoolean,
    descripcion: Joi.string().trim().max(500).allow('', null)
  }).min(1)
};

// Esquema para cotizaciones
const cotizacionSchema = {
  create: Joi.object({
    cliente_id: baseId.required(),
    concepto: baseString.required().min(2).max(255),
    monto: baseAmount.required(),
    fecha_emision: baseDate.required(),
    fecha_vencimiento: baseDate.required(),
    estado: baseString.valid('pendiente', 'aprobada', 'rechazada', 'vencida').default('pendiente'),
    descripcion: Joi.string().trim().max(1000).allow('', null),
    condiciones: Joi.string().trim().max(1000).allow('', null)
  }),

  update: Joi.object({
    cliente_id: baseId,
    concepto: baseString.min(2).max(255),
    monto: baseAmount,
    fecha_emision: baseDate,
    fecha_vencimiento: baseDate,
    estado: baseString.valid('pendiente', 'aprobada', 'rechazada', 'vencida'),
    descripcion: Joi.string().trim().max(1000).allow('', null),
    condiciones: Joi.string().trim().max(1000).allow('', null)
  }).min(1)
};

// Esquema para filtros de fecha
const dateFilterSchema = Joi.object({
  fechaInicio: baseDate,
  fechaFin: baseDate,
  filtroMes: Joi.number().integer().min(1).max(12)
}).custom((value, helpers) => {
  if (value.fechaInicio && value.fechaFin && value.fechaInicio > value.fechaFin) {
    return helpers.error('any.invalid', { message: 'La fecha de inicio no puede ser mayor que la fecha de fin' });
  }
  return value;
});

module.exports = {
  userSchema,
  clientSchema,
  projectSchema,
  providerSchema,
  cuentasPagarSchema,
  cuentasCobrarSchema,
  contabilidadSchema,
  categoriaSchema,
  phaseSchema,
  costosFijosSchema,
  cotizacionSchema,
  dateFilterSchema
}; 