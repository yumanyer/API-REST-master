import { Product } from "../models/product.model.js";

export class ProductsService {
  static async getAll() {
    return await Product.find();
  }

  static async getById(id) {
    return await Product.findById(id);
  }

  static async create(product) {
    return await Product.create(product);
  }

  static async delete(id) {
    return await Product.deleteOne({ _id: id });
  }

  static async discountStock(id, quantity) {
    return await Product.updateOne(
      {
        _id: id,
      },
      {
        $inc: {
          stock: -quantity,
        },
      }
    );
  }
}
