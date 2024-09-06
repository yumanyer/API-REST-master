
import { Product} from "../models/product.model.js";

export async function checkStock(req, res, next) {
  const cart = req.body.cart; 

  try {
    for (const item of cart) {
      const product = await Product.findById(item.productId);
      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Not enough stock for product ${product.title}` });
      }
    }
    next();
  } catch (error) {
    return res.status(500).json({ message: `Error checking stock: ${error.message}` });
  }
}

