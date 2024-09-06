import express from 'express';
import passport from 'passport';
import { authorizeRole } from '../middleware/role.middleware.js';
import { ProductController } from '../controllers/product.controller.js';
import { validateDTO } from '../middleware/validate.dto.js';
import { productDTO } from '../dtos/product.dto.js';
const router = express.Router();
const productController = new ProductController();

router.use(passport.authenticate('jwt', { session: false }));

router.post('/', authorizeRole(['admin']),validateDTO(productDTO), productController.addProduct.bind(productController));
router.put('/:id', authorizeRole(['admin']),validateDTO(productDTO), productController.updateProduct.bind(productController));
router.delete('/:id', authorizeRole(['admin']), productController.deleteProduct.bind(productController));
router.get('/', productController.getProducts.bind(productController));

export default router;
