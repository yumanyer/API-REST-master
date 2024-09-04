import { Product } from "../models/product.model.js";

export class ProductRepository {

    // GET PRODUCT BY ID
  async findById(id) {
    try {
      return await Product.findById(id).exec();
    } catch (error) {
      throw new Error(`Erro al enctropar el producto: ${error.message}`);
    }
  }

  // POST PRODUCT
  async create(data) {
    try {
      const product = new Product(data);
      return await product.save();
    } catch (error) {
      throw new Error(`Error al crear el producto: ${error.message}`);
    }
  }

  // PUT PRODUCT
  async update(id, data) {
    try {
      return await Product.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      throw new Error(`Error al actualizar el producto: ${error.message}`);
    }
  }

  // DELETE PRODUCT BY ID
  async delete(id) {
    try {
      return await Product.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Error al eliminar el producto: ${error.message}`);
    }
  }

  // GET PRODUCT
  async findAll() {
    try {
      return await Product.find().exec();
    } catch (error) {
      throw new Error(`Error al encontrar los productos: ${error.message}`);
    }
  }
}

