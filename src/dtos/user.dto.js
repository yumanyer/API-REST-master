import Joi from 'joi';

export const userDTO = Joi.object({
  first_name: Joi.string().min(3).max(50).required(),
  last_name:Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  age:Joi.number().integer().max(100).required(),
  password: Joi.string().min(8).required(),
  role: Joi.string().valid('user', 'admin').default('user'),
});
