import { Cart } from "../models/carts.models.js";

export class CartRepository {
  
  // GET CART BY ID
  async findById(id) {
    try {
      return await Cart.findById(id).populate('products').exec();
    } catch (error) {
      throw new Error(`Error al encontrar el cart: ${error.message}`);
    }
  }

  // POST CART
  async create(data) {
    try {
      const cart = new Cart(data);
      return await cart.save();
    } catch (error) {
      throw new Error(`Error al crear el cart: ${error.message}`);
    }
  }

  // PUT CART 
  async update(id, data) {
    try {
      return await Cart.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      throw new Error(`Error al actualizar el cart: ${error.message}`);
    }
  }

  // DELETE CART BY ID
  async delete(id) {
    try {
      return await Cart.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Error al eliminar el cart: ${error.message}`);
    }
  }

  // GET CART
  async findAll() {
    try {
      return await Cart.find().exec();
    } catch (error) {
      throw new Error(`Error al encontrar los carts: ${error.message}`);
    }
  }
}

