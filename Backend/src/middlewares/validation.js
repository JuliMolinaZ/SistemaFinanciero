const Joi = require('joi');
const { validationResult } = require('express-validator');

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

// Middleware para validación con Joi
const validateWithJoi = (schema) => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req.body, {
      abortEarly: false,
      stripUnknown: false,
      allowUnknown: true
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        success: false,
        message: 'Errores de validación',
        errors: errorDetails
      });
    }

    // Reemplazar req.body con los datos validados
    req.body = value;
    next();
  };
};

// Middleware para validar IDs
const validateId = (req, res, next) => {
  const { id } = req.params;
  if (!id || isNaN(parseInt(id)) || parseInt(id) <= 0) {
    return res.status(400).json({
      success: false,
      message: 'ID inválido',
      errors: [{
        field: 'id',
        message: 'El ID debe ser un número entero positivo',
        value: id
      }]
    });
  }
  req.params.id = parseInt(id);
  next();
};

// Middleware para validar paginación
const validatePagination = (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  
  if (page < 1 || limit < 1 || limit > 100) {
    return res.status(400).json({
      success: false,
      message: 'Parámetros de paginación inválidos',
      errors: [{
        field: 'pagination',
        message: 'Página debe ser >= 1, límite debe estar entre 1 y 100',
        value: { page, limit }
      }]
    });
  }
  
  req.pagination = { page, limit, offset: (page - 1) * limit };
  next();
};

module.exports = {
  handleValidationErrors,
  validateWithJoi,
  validateId,
  validatePagination
}; 