const Joi = require('joi');

/**
 * Joi validation schema for creating a new caterer.
 * All fields are required on POST.
 */
const catererSchema = Joi.object({
  name: Joi.string().trim().min(2).max(100).required().messages({
    'string.min': 'Name must be at least 2 characters',
    'string.max': 'Name cannot exceed 100 characters',
    'any.required': 'Name is required',
  }),
  location: Joi.string().trim().min(2).max(150).required().messages({
    'any.required': 'Location is required',
  }),
  pricePerPlate: Joi.number().positive().precision(2).required().messages({
    'number.positive': 'Price per plate must be a positive number',
    'any.required': 'Price per plate is required',
  }),
  cuisines: Joi.array()
    .items(Joi.string().trim().min(1))
    .min(1)
    .required()
    .messages({
      'array.min': 'At least one cuisine must be provided',
      'any.required': 'Cuisines are required',
    }),
  rating: Joi.number().min(0).max(5).precision(1).required().messages({
    'number.min': 'Rating must be between 0 and 5',
    'number.max': 'Rating must be between 0 and 5',
    'any.required': 'Rating is required',
  }),
});

/**
 * Validate caterer input against schema
 * @param {Object} data - Raw request body
 * @returns {{ value: Object, error: Object|undefined }}
 */
function validateCaterer(data) {
  return catererSchema.validate(data, { abortEarly: false });
}

module.exports = { validateCaterer };
