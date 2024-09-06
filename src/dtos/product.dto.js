import Joi from 'joi';

export const productDTO = Joi.object({
  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().max(500).required(),
  code: Joi.string().required(),
  price: Joi.number().positive().required(),
  stock: Joi.number().integer().positive().required(),
  category: Joi.string().min(3).max(50).required(),
  thumbnail:Joi.required()
});
