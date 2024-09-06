import Joi from 'joi';

export const cartDTO = Joi.object({
  products: Joi.array().items(
    Joi.object({
      productId: Joi.string().required(),
      quantity: Joi.number().integer().positive().required(),
    })
  ).min(1),
  user: Joi.string()
});
