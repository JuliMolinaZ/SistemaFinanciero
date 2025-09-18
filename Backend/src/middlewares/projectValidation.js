// 🛡️ MIDDLEWARE DE VALIDACIONES ROBUSTAS PARA GESTIÓN DE PROYECTOS
const { body, param, validationResult } = require('express-validator');

// 🔍 Función helper para manejar errores de validación
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errors: errors.array().map(error => ({
        field: error.path,
        message: error.msg,
        value: error.value
      }))
    });
  }
  next();
};

// 📋 VALIDACIONES PARA PROYECTOS
const validateCreateProject = [
  body('nombre')
    .trim()
    .notEmpty()
    .withMessage('El nombre del proyecto es obligatorio')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres')
    .matches(/^[a-zA-Z0-9\s\-_.,()]+$/)
    .withMessage('El nombre contiene caracteres no válidos'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('cliente_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),

  body('methodology_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID de la metodología debe ser un número entero positivo'),

  body('project_manager_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del gerente de proyecto debe ser un número entero positivo'),

  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe tener formato válido (YYYY-MM-DD)'),

  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe tener formato válido (YYYY-MM-DD)')
    .custom((value, { req }) => {
      if (req.body.start_date && value) {
        const startDate = new Date(req.body.start_date);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    }),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('La prioridad debe ser: low, medium, high o critical'),

  body('budget')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El presupuesto debe ser un número positivo'),

  body('monto_sin_iva')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El monto sin IVA debe ser un número positivo'),

  body('monto_con_iva')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('El monto con IVA debe ser un número positivo'),

  body('members')
    .optional()
    .isArray()
    .withMessage('Los miembros deben ser un array'),

  body('members.*.user_id')
    .if(body('members').exists())
    .isInt({ min: 1 })
    .withMessage('El ID del usuario debe ser un número entero positivo'),

  body('members.*.role_id')
    .if(body('members').exists())
    .isInt({ min: 1 })
    .withMessage('El ID del rol debe ser un número entero positivo'),

  handleValidationErrors
];

// 📝 VALIDACIONES PARA ACTUALIZACIÓN DE PROYECTOS
const validateUpdateProject = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  body('nombre')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('El nombre del proyecto no puede estar vacío')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('descripcion')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('La descripción no puede exceder 2000 caracteres'),

  body('cliente_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del cliente debe ser un número entero positivo'),

  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe tener formato válido'),

  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe tener formato válido')
    .custom((value, { req }) => {
      if (req.body.start_date && value) {
        const startDate = new Date(req.body.start_date);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    }),

  body('status')
    .optional()
    .isIn(['planning', 'active', 'on_hold', 'completed', 'cancelled'])
    .withMessage('El estado debe ser: planning, active, on_hold, completed o cancelled'),

  handleValidationErrors
];

// 🔍 VALIDACIONES PARA SPRINTS
const validateCreateSprint = [
  body('project_id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto es obligatorio y debe ser un número entero positivo'),

  body('name')
    .trim()
    .notEmpty()
    .withMessage('El nombre del sprint es obligatorio')
    .isLength({ min: 3, max: 255 })
    .withMessage('El nombre debe tener entre 3 y 255 caracteres'),

  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de inicio debe tener formato válido'),

  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de fin debe tener formato válido')
    .custom((value, { req }) => {
      if (req.body.start_date && value) {
        const startDate = new Date(req.body.start_date);
        const endDate = new Date(value);
        if (endDate <= startDate) {
          throw new Error('La fecha de fin debe ser posterior a la fecha de inicio');
        }
      }
      return true;
    }),

  handleValidationErrors
];

// 📋 VALIDACIONES PARA TAREAS
const validateCreateTask = [
  body('project_id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto es obligatorio'),

  body('title')
    .trim()
    .notEmpty()
    .withMessage('El título de la tarea es obligatorio')
    .isLength({ min: 3, max: 255 })
    .withMessage('El título debe tener entre 3 y 255 caracteres'),

  body('priority')
    .optional()
    .isIn(['low', 'medium', 'high', 'critical'])
    .withMessage('La prioridad debe ser: low, medium, high o critical'),

  body('status')
    .optional()
    .isIn(['todo', 'in_progress', 'review', 'done', 'cancelled'])
    .withMessage('El estado debe ser: todo, in_progress, review, done o cancelled'),

  body('estimated_hours')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Las horas estimadas deben ser un número positivo'),

  body('assignee_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('El ID del asignado debe ser un número entero positivo'),

  body('due_date')
    .optional()
    .isISO8601()
    .withMessage('La fecha de vencimiento debe tener formato válido')
    .custom((value) => {
      if (value) {
        const dueDate = new Date(value);
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (dueDate < today) {
          throw new Error('La fecha de vencimiento no puede ser anterior a hoy');
        }
      }
      return true;
    }),

  handleValidationErrors
];

// 🔍 VALIDACIÓN DE ID SIMPLE
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID debe ser un número entero positivo'),
  handleValidationErrors
];

// 📊 VALIDACIÓN DE PAGINACIÓN
const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('La página debe ser un número entero positivo'),

  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('El límite debe ser un número entero entre 1 y 100'),

  handleValidationErrors
];

module.exports = {
  validateCreateProject,
  validateUpdateProject,
  validateCreateSprint,
  validateCreateTask,
  validateId,
  validatePagination,
  handleValidationErrors
};