import { v4 as uuid } from "uuid";
import { Cart } from "../models/carts.models.js";
import { Product } from "../models/product.model.js";
import { Ticket } from "../models/ticket.model.js";
import { MailService } from '../services/email.service.js'; 
export class CartController {
  constructor() {
    this.mailService = new MailService();
  }
  // POST CART
  async addCart(req, res) {
    try {
      const newCart = new Cart({
        ...req.body,
        user: req.user.id, 
      });
      await newCart.save();
  
      await User.findByIdAndUpdate(req.user.id, { cart: newCart._id });
  
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: "Error al agregar el carro", error });
    }
  }
  
  // PUT CART
  async updateCart(req, res) {
    try {
      const { id } = req.params;
  
      // Buscar el carrito por ID
      const cartExists = await Cart.findById(id);
  
      // Verificar si el carrito existe
      if (!cartExists) {
        return res.status(404).json({ message: "Carro no encontrado" });
      }
  
      // Verificar si el usuario tiene permisos para modificar el carrito
      if (cartExists.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "No autorizado para modificar este carrito" });
      }
  
      // Realizar la actualización del carrito
      const updatedCart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
  
      return res.json({ message: "Carro actualizado correctamente", cart: updatedCart });
  
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar el carro", error });
    }
  }

  
// DELETE CART
async deleteCart(req, res) {
  try {
    const { id } = req.params;

    // Buscar el carrito por ID
    const cartExists = await Cart.findById(id);

    // Verificar si el carrito existe
    if (!cartExists) {
      return res.status(404).json({ message: "Carro no encontrado" });
    }

    // Verificar si el usuario tiene permisos para eliminar el carrito
    if (cartExists.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: "No autorizado para eliminar este carrito" });
    }

    // Eliminar el carrito
    await Cart.findByIdAndDelete(id);
    return res.json({ message: "Carro eliminado correctamente" });

  } catch (error) {
    return res.status(500).json({ message: "Error al eliminar el carro", error });
  }
}

  // GET CARTS
  async getCarts(req, res) {
    try {
      const { id } = req.params;
      
      // El admin ve todos los carritos o el carrito que el quiera en base a su id
      if (req.user.role === 'admin') {
        const carts = id ? await Cart.findById(id) : await Cart.find({});
        if (!carts) {
          return res.status(404).json({ message: "Carro no encontrado" });
        }
        return res.json(carts);
      } 
      //El usario ve solo su carrito 
      else {
        const cart = await Cart.findOne({ user: req.user.id });
        if (!cart) {
          return res.status(404).json({ message: "Carro no encontrado" });
        }
        return res.json(cart);
      }
    } catch (error) {
      return res.status(500).json({ message: "Error al obtener los carros", error });
    }
  }
  // POST PRODUCT BY CART
async addProductToCart(req, res) {
  const { products } = req.body;

  if (!products || !Array.isArray(products)) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    let cart = await Cart.findOne({ user: req.user.id });

    if (!cart) {
      cart = new Cart({ user: req.user.id, products: [] });
    }

    for (const item of products) {
      const { productId, quantity } = item;

      if (!productId || !quantity) {
        return res.status(400).json({ message: "Todos los campos del producto son requeridos" });
      }

      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ message: "Producto no encontrado" });
      }

      if (product.stock < quantity) {
        return res.status(400).json({ message: "Stock insuficiente para el producto", product: productId });
      }

      const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
      if (existingProductIndex >= 0) {
        cart.products[existingProductIndex].quantity += quantity;
      } else {
        cart.products.push({ productId, quantity });
      }
    }

    await cart.save();

    return res.status(200).json({ message: "Productos agregados al carrito", cart });
  } catch (error) {
    return res.status(500).json({ error: "Hubo un error", details: error.message });
  }
}


  // FINISH BUY
async purchaseCart(req, res) {
  try {
    const { cid } = req.params;

    const cart = await Cart.findById(cid).populate('products.productId');

    if (!cart) {
      return res.status(404).json({ error: 'No se encontró el carrito' });
    }
    if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado para finalizar la compra de este carrito' });
    }
    if (!req.user || !req.user.email) {
      return res.status(400).json({ error: 'El comprador no está definido' });
    }
    const productsWithoutStock = [];

    for (const item of cart.products) {
      const product = item.productId;

      if (product.stock < item.quantity) {
        productsWithoutStock.push({
          productId: product._id,
          productName: product.titulo,
          quantity: item.quantity,
          stock: product.stock,
        });
      }
    }

    if (productsWithoutStock.length > 0) {
      return res.status(400).json({
        error: 'No hay productos suficientes',
        details: productsWithoutStock,
      });
    }

    // Descontar stock del producto
    const discountPromises = cart.products.map((item) => {
      return Product.findByIdAndUpdate(item.productId._id, {
        $inc: { stock: -item.quantity },
      });
    });

    await Promise.all(discountPromises);

    // Calculo el monto total
    const amount = cart.products.reduce(
      (acc, item) => acc + item.quantity * (item.productId.precio || 0),
      0
    );

    // Creo el ticket 
    const ticket = await Ticket.create({
      code: uuid(),
      purchase_datetime: new Date(),
      amount,
      purchaser: req.user.email,
    });

    cart.products = cart.products.filter(
      (item) => !productsWithoutStock.some((p) => p.productId.equals(item.productId._id))
    );
    await cart.save();

    // Envio correo al usuario
    await this.mailService.sendMail(req.user.email, 'Compra finalizada', 'purchase');

    res.status(200).json({
      message: 'Compra finalizada',
      ticket,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Error al finalizar la compra',
      details: error.message,
    });
  }
}

}
