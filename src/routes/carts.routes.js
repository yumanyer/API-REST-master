// src/routes/carts.routes.js

import express from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authorizeRole } from '../middleware/role.middleware.js'; // Correcta importación
import { authenticateUser } from '../middleware/auth.middleware.js';

const router = express.Router();
const cartController = new CartController();

// Rutas para carros

router.post('/add-product', authenticateUser, cartController.addProductToCart.bind(cartController));
router.put('/:id', authenticateUser, cartController.updateCart.bind(cartController));
router.delete('/:id',authenticateUser, cartController.deleteCart.bind(cartController));
router.get('/:id?',authenticateUser, cartController.getCarts.bind(cartController)); // Soporta GET por ID o todos los carros
router.get('/:id?',authorizeRole(['admin']), cartController.getCarts.bind(cartController)); // Soporta GET por ID o todos los carros

export default router;
