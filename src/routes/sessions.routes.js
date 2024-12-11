import express from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authorizeRole } from '../middleware/role.middleware.js'; 
import { validateDTO } from '../middleware/validate.dto.js';
import { cartDTO } from '../dtos/cart.dto.js';

const router = express.Router();
const cartController = new CartController();

router.post('/', authorizeRole(['admin']), validateDTO(cartDTO),cartController.addCart.bind(cartController));
router.put('/:id', authorizeRole(['admin']),validateDTO(cartDTO), cartController.updateCart.bind(cartController));
router.delete('/:id', authorizeRole(['admin']), cartController.deleteCart.bind(cartController));
router.get('/:id?', cartController.getCarts.bind(cartController));
router.post('/add-product', authorizeRole(['user']), cartController.addProductToCart.bind(cartController));

export default router;
