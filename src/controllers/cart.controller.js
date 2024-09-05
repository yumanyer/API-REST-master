import { v4 as uuid } from "uuid";
import { Cart } from "../models/carts.models.js";
import { Product } from "../models/product.model.js";
import { ProductsService } from "../services/products.service.js";
import { ticketModel } from "../models/ticket.model.js";

export class CartController {
  // Método para agregar un carro
  async addCart(req, res) {
    try {
      // Crear el carrito y asignar al usuario autenticado
      const newCart = new Cart({
        ...req.body,
        user: req.user.id, // Asignar el userId al carrito
      });
      await newCart.save();
  
      // Actualizar el modelo del usuario para asignarle el carrito
      await User.findByIdAndUpdate(req.user.id, { cart: newCart._id });
  
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: "Error al agregar el carro", error });
    }
  }
  
  // Método para actualizar un carro
  async updateCart(req, res) {
    try {
      const { id } = req.params;
      const { products } = req.body;
  
      const cart = await Cart.findById(id);
      if (!cart) {
        return res.status(404).json({ message: "Carro no encontrado" });
      }
  
      // Verifica si el carrito pertenece al usuario o si el usuario es un admin
      if (cart.user.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: "No autorizado para modificar este carrito" });
      }
  
      // Obtenemos los productos actuales del carrito para compararlos después
      const oldProducts = cart.products;
  
      // Limpiamos los productos en el carrito actual
      cart.products = [];
      for (const item of products) {
        const { productId, quantity } = item;
  
        if (!productId || !quantity) {
          return res.status(400).json({ message: "Todos los campos del producto son requeridos" });
        }
  
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
  
        if (quantity > product.stock) {
          return res.status(400).json({ message: "Cantidad no disponible en stock" });
        }
  
        // Agregamos el nuevo producto al carrito
        cart.products.push({ productId, quantity });
  
        // Ajustamos el stock del producto
        const oldProduct = oldProducts.find(p => p.productId.toString() === productId);
        const oldQuantity = oldProduct ? oldProduct.quantity : 0;
        const quantityChange = quantity - oldQuantity;
  
        // Si hay un cambio en la cantidad, ajustamos el stock
        if (quantityChange !== 0) {
          product.stock -= quantityChange;
          await product.save();
        }
      }
  
      // Guardamos el carrito actualizado
      await cart.save();
  
      return res.status(200).json({ message: "Carrito actualizado", cart });
    } catch (error) {
      return res.status(500).json({ message: "Error al actualizar el carro", error });
    }
  }
  

  
  // Método para eliminar un carro
  async deleteCart(req, res) {
    try {
      const { id } = req.params;
      const cartExists = await Cart.findById(id);

      if (!cartExists) {
        return res.status(404).json({ message: "Carro no encontrado" });
      }

      await Cart.findByIdAndDelete(id);
      res.json({ message: "Carro eliminado correctamente" });
    } catch (error) {
      res.status(500).json({ message: "Error al eliminar el carro", error });
    }
  }

  // Método para obtener carros
  // src/controllers/cart.controller.js

async getCarts(req, res) {
  try {
    const { id } = req.params;
    // Verifica si el usuario es admin o si se está solicitando un carrito específico
    if (req.user.role === 'admin') {
      // Si el usuario es admin, retorna todos los carritos o el carrito específico si se proporciona un id
      const carts = id ? await Cart.findById(id) : await Cart.find({});
      if (!carts) {
        return res.status(404).json({ message: "Carro no encontrado" });
      }
      return res.json(carts);
    } else {
      // Si el usuario no es admin, retorna solo su carrito
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

  
  // Método para agregar un producto al carrito
  async addProductToCart(req, res) {
    const { products } = req.body;
  
    if (!products || !Array.isArray(products)) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
  
    try {
      // Obtener el carrito del usuario autenticado
      let cart = await Cart.findOne({ user: req.user.id });
  
      // Si el usuario no tiene carrito, crear uno
      if (!cart) {
        cart = new Cart({ user: req.user.id, products: [] });
      }
  
      // Agregar los productos al carrito
      for (const item of products) {
        const { productId, quantity } = item;
        
        if (!productId || !quantity) {
          return res.status(400).json({ message: "Todos los campos del producto son requeridos" });
        }
  
        // Verificar si el producto existe
        const product = await Product.findById(productId);
        if (!product) {
          return res.status(404).json({ message: "Producto no encontrado" });
        }
  
        // Verificar si hay suficiente stock
        if (product.stock < quantity) {
          return res.status(400).json({ message: "Stock insuficiente para el producto",product:productId });
        }
  
        // Verificar si el producto ya está en el carrito
        const existingProductIndex = cart.products.findIndex(p => p.productId.toString() === productId);
        if (existingProductIndex >= 0) {
          // Si ya está en el carrito, actualizar la cantidad
          cart.products[existingProductIndex].quantity += quantity;
        } else {
          // Si no está, agregarlo al carrito
          cart.products.push({ productId, quantity });
        }
  
        // Restar el stock del producto
        product.stock -= quantity;
        await product.save();
      }
  
      // Guardar el carrito actualizado
      await cart.save();
  
      return res.status(200).json({ message: "Productos agregados al carrito", cart });
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error", details: error.message });
    }
  }
}