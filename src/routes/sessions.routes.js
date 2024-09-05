// src/routes/carts.routes.js

import express from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authorizeRole } from '../middleware/role.middleware.js'; // Correcta importación

const router = express.Router();
const cartController = new CartController();

// Rutas para carros
router.post('/', authorizeRole(['admin']), cartController.addCart.bind(cartController));
router.put('/:id', authorizeRole(['admin']), cartController.updateCart.bind(cartController));
router.delete('/:id', authorizeRole(['admin']), cartController.deleteCart.bind(cartController));
router.get('/:id?', cartController.getCarts.bind(cartController)); // Soporta GET por ID o todos los carros

// Ruta para agregar un producto al carrito
router.post('/add-product', authorizeRole(['user']), cartController.addProductToCart.bind(cartController));

export default router;
