import express from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authorizeRole } from '../middleware/role.middleware.js'; 
import { authenticateUser } from '../middleware/auth.middleware.js';
import { validateDTO } from '../middleware/validate.dto.js';
import { cartDTO } from '../dtos/cart.dto.js';

const router = express.Router();
const cartController = new CartController();


// Ruta para obtener carritos
router.get('/:id?', authenticateUser, cartController.getCarts.bind(cartController));

router.post('/add-product', authenticateUser,validateDTO(cartDTO), cartController.addProductToCart.bind(cartController));

router.post('/:cid/purchase', authenticateUser,validateDTO(cartDTO), cartController.purchaseCart.bind(cartController));

router.put('/:id', authenticateUser, cartController.updateCart.bind(cartController));

router.delete('/:id',authenticateUser, cartController.deleteCart.bind(cartController));

export default router;
