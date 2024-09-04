import { User } from "../models/user.model.js";

export class UserRepository {
  
  // GET USER BY ID
  async findById(id) {
    try {
      return await User.findById(id).exec();
    } catch (error) {
      throw new Error(`Error al encontrar el usuario: ${error.message}`);
    }
  }

  // POST USER
  async create(data) {
    try {
      const user = new User(data);
      return await user.save();
    } catch (error) {
      throw new Error(`Errot al crear el usuario: ${error.message}`);
    }
  }

  // PUT PRODUCT
  async update(id, data) {
    try {
      return await User.findByIdAndUpdate(id, data, { new: true }).exec();
    } catch (error) {
      throw new Error(`Error al actualizar el usuario: ${error.message}`);
    }
  }

  // DELETE USER BY ID
  async delete(id) {
    try {
      return await User.findByIdAndDelete(id).exec();
    } catch (error) {
      throw new Error(`Error al eliminar el usuario: ${error.message}`);
    }
  }

  // GET USER
  async findAll() {
    try {
      return await User.find().exec();
    } catch (error) {
      throw new Error(`Error al encontrar los usuarios: ${error.message}`);
    }
  }
}

