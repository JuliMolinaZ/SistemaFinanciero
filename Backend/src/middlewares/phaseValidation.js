const { body, param, validationResult } = require('express-validator');

// Middleware para manejar errores de validación
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

// Validaciones para crear una nueva fase
const validateCreatePhase = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la fase debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s0-9\-_.]+$/)
    .withMessage('El nombre de la fase contiene caracteres no válidos'),

  handleValidationErrors
];

// Validaciones para actualizar una fase
const validateUpdatePhase = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  param('phaseId')
    .isUUID()
    .withMessage('El ID de la fase debe ser un UUID válido'),

  body('name')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('El nombre de la fase debe tener entre 2 y 100 caracteres')
    .matches(/^[a-zA-ZáéíóúüñÁÉÍÓÚÜÑ\s0-9\-_.]+$/)
    .withMessage('El nombre de la fase contiene caracteres no válidos'),

  handleValidationErrors
];

// Validaciones para reordenar fases
const validateReorderPhases = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  body('phases')
    .isArray({ min: 1 })
    .withMessage('Se requiere un array de fases con al menos un elemento'),

  body('phases.*.phaseId')
    .isUUID()
    .withMessage('Cada fase debe tener un ID UUID válido'),

  body('phases.*.position')
    .isInt({ min: 0 })
    .withMessage('La posición debe ser un número entero no negativo'),

  handleValidationErrors
];

// Validaciones para eliminar una fase
const validateDeletePhase = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  param('phaseId')
    .isUUID()
    .withMessage('El ID de la fase debe ser un UUID válido'),

  handleValidationErrors
];

// Validaciones para actualizar la fase actual
const validateUpdateCurrentPhase = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  body('phaseId')
    .isUUID()
    .withMessage('El ID de la fase debe ser un UUID válido'),

  handleValidationErrors
];

// Validaciones para obtener fases de un proyecto
const validateGetProjectPhases = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('El ID del proyecto debe ser un número entero positivo'),

  handleValidationErrors
];

module.exports = {
  validateCreatePhase,
  validateUpdatePhase,
  validateReorderPhases,
  validateDeletePhase,
  validateUpdateCurrentPhase,
  validateGetProjectPhases,
  handleValidationErrors
};