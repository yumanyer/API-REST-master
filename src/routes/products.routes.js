import express from "express";
import { Router } from "express";

const router = Router();

// Middleware para parsear JSON en el cuerpo de las solicitudes
router.use(express.json());

router.get("/", async (req, res) => {
  try {
    const { limit = 10, page = 1, sort, query } = req.query;

    // Aplicar filtros de búsqueda si se proporcionan
    let filters = {};
    if (query) {
      filters = {
        $or: [
          { titulo: { $regex: query, $options: "i" } },
          { descripcion: { $regex: query, $options: "i" } },
        ],
      };
    }

    const totalProducts = await Product.countDocuments(filters);
    const totalPages = Math.ceil(totalProducts / limit);
    const offset = (page - 1) * limit;

    let sortCriteria = {};
    if (sort) {
      sortCriteria = { precio: sort === "desc" ? -1 : 1 };
    }

    const products = await Product.find(filters)
      .sort(sortCriteria)
      .skip(offset)
      .limit(limit);

    res.json({
      status: "success",
      payload: products,
      totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
      page,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevLink: page > 1 ? `/api/products?limit=${limit}&page=${page - 1}&sort=${sort}&query=${query}` : null,
      nextLink: page < totalPages ? `/api/products?limit=${limit}&page=${page + 1}&sort=${sort}&query=${query}` : null,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json(product);
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { titulo, descripcion, code, precio, stock, categoria, thumbnail } = req.body;
    const newProduct = new Product({
      titulo,
      descripcion,
      code,
      precio,
      stock,
      categoria,
      thumbnail,
    });

    await newProduct.save();

    res.status(201).json({
      status: "success",
      message: "Producto creado exitosamente",
      product: newProduct,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { titulo, descripcion, code, precio, stock, categoria, thumbnail } = req.body;
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { titulo, descripcion, code, precio, stock, categoria, thumbnail },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }

    res.json({
      status: "success",
      message: "Producto actualizado exitosamente",
      product: updatedProduct,
    });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);
    if (!deletedProduct) {
      return res.status(404).json({ status: "error", message: "Producto no encontrado" });
    }
    res.json({
      status: "success",
      message: "Producto eliminado exitosamente",
      product: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});



export default router;