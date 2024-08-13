import express from "express";
import Cart from "../models/carts.models.js";
import Product from "../models/products.models.js";
import mongoose from "mongoose"; 
const router = express.Router();
const { ObjectId } = mongoose.Types; 

// Middleware para parsear JSON en el cuerpo de las solicitudes
router.use(express.json());

// Ruta para obtener todos los carritos
router.get("/", async (req, res) => {
  try {
    const carts = await Cart.find();
    res.json({ status: "success", payload: carts });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Ruta para obtener un carrito por su ID
router.get("/:id", async (req, res) => {
  try {
    const cart = await Cart.findById(req.params.id);
    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({ status: "success", payload: cart });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Ruta para crear un nuevo carrito
router.post("/", async (req, res) => {
  try {
    const { products } = req.body;
    const newCart = new Cart({ products });
    await newCart.save();
    res.status(201).json({
      status: "success",
      message: "Carrito creado exitosamente",
      payload: newCart,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// Ruta para actualizar un carrito por su ID
router.put("/:id", async (req, res) => {
  try {
    const { products } = req.body;

    // Verificar si los productos existen en la base de datos antes de actualizar el carrito
    const validProductIds = await Product.find({
      _id: { $in: products },
    }).select("_id");

    if (validProductIds.length !== products.length) {
      return res.status(400).json({
        status: "error",
        message: "Alguno de los productos proporcionados no existe",
      });
    }

    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      { products },
      { new: true }
    );

    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }

    res.json({
      status: "success",
      message: "Carrito actualizado exitosamente",
      payload: updatedCart,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

// Ruta para eliminar un carrito por su ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedCart = await Cart.findByIdAndDelete(req.params.id);
    if (!deletedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "Carrito no encontrado" });
    }
    res.json({
      status: "success",
      message: "Carrito eliminado exitosamente",
      payload: deletedCart,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

// Ruta para eliminar un producto específico del carrito por su ID
router.delete("/:cid/products/:pid", async (req, res) => {
    try {
      const { cid, pid } = req.params;
  
      // Verificar si los IDs son válidos ObjectId
      if (!ObjectId.isValid(cid) || !ObjectId.isValid(pid)) {
        return res.status(400).json({ status: "error", message: "ID inválido" });
      }
  
      // Buscar el carrito por su ID y eliminar el producto del array de productos
      const updatedCart = await Cart.findByIdAndUpdate(
        cid,
        { $pull: { products: pid } }, // Elimina el producto específico del array
        { new: true }
      );
  
      if (!updatedCart) {
        return res
          .status(404)
          .json({ status: "error", message: "Carrito no encontrado" });
      }
  
      res.json({
        status: "success",
        message: "Producto eliminado del carrito exitosamente",
        payload: updatedCart,
      });
    } catch (error) {
      res.status(500).json({ status: "error", message: error.message });
    }
  });

export default router;