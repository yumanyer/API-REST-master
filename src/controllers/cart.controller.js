import { v4 as uuid } from "uuid";
import { Cart } from "../models/carts.models.js";
import { Product } from "../models/product.model.js";
import { ProductsService } from "../services/products.service.js";
import { ticketModel } from "../models/ticket.model.js";

export class CartController {
  // Método para agregar un carro
  async addCart(req, res) {
    try {
      const newCart = new Cart(req.body);
      await newCart.save();
      res.status(201).json(newCart);
    } catch (error) {
      res.status(500).json({ message: "Error al agregar el carro", error });
    }
  }

  // Método para actualizar un carro
  async updateCart(req, res) {
    try {
      const { id } = req.params;
      const cartExists = await Cart.findById(id);

      if (!cartExists) {
        return res.status(404).json({ message: "Carro no encontrado" });
      }

      const updatedCart = await Cart.findByIdAndUpdate(id, req.body, { new: true });
      res.json(updatedCart);
    } catch (error) {
      res.status(500).json({ message: "Error al actualizar el carro", error });
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
  async getCarts(req, res) {
    try {
      const { id } = req.params;
      const carts = id ? await Cart.findById(id) : await Cart.find({});
      
      if (!carts) {
        return res.status(404).json({ message: "Carro no encontrado" });
      }
      
      res.json(carts);
    } catch (error) {
      res.status(500).json({ message: "Error al obtener los carros", error });
    }
  }
}