// src/dtos/product.dto.js

import Joi from 'joi';

export const createProductSchema = Joi.object({
  titulo: Joi.string().required(),
  descripcion: Joi.string().required(),
  code: Joi.string().required(),
  precio: Joi.number().required(),
  stock: Joi.number().required(),
  categoria: Joi.string().required(),
  thumbnail: Joi.string().optional(),
});

export const updateProductSchema = Joi.object({
  titulo: Joi.string().optional(),
  descripcion: Joi.string().optional(),
  code: Joi.string().optional(),
  precio: Joi.number().optional(),
  stock: Joi.number().optional(),
  categoria: Joi.string().optional(),
  thumbnail: Joi.string().optional(),
});
