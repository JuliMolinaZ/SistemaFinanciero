const Joi = require('joi');

// Esquema de prueba
const userSchema = Joi.object({
  firebase_uid: Joi.string().required().min(1).max(255),
  email: Joi.string().email().max(255).required(),
  name: Joi.string().required().min(2).max(100),
  role: Joi.string().required().valid('juan carlos', 'administrador', 'usuario', 'defaultRole'),
  avatar: Joi.string().uri().allow('', null).max(500)
});

// Datos de prueba inválidos
const invalidData = {
  firebase_uid: '',
  email: 'invalid-email',
  name: 'A',
  role: 'invalid_role'
};

// Probar validación

const { error, value } = userSchema.validate(invalidData, {
  abortEarly: false,
  stripUnknown: true,
  allowUnknown: false
});

if (error) {

  error.details.forEach(detail => {

  });
} else {

}
