// src/routes/products.routes.js
import express from 'express';
import passport from 'passport';
import { authorizeRole } from '../middleware/role.middleware.js';
import { ProductController } from '../controllers/product.controller.js';

const router = express.Router();
const productController = new ProductController();

router.use(passport.authenticate('jwt', { session: false }));

// Rutas para productos
router.post('/', authorizeRole(['admin']), productController.addProduct.bind(productController));
router.put('/:id', authorizeRole(['admin']), productController.updateProduct.bind(productController));
router.delete('/:id', authorizeRole(['admin']), productController.deleteProduct.bind(productController));
router.get('/', productController.getProducts.bind(productController));

export default router;
