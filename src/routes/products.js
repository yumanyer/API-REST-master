import express from "express";
import { productos, writeToFile, productosPath } from "../data.js";

const router = express.Router();

// Inicializar el contador de ID en el máximo ID existente más 1
let idCounter = productos.length ? Math.max(...productos.map(p => p.id)) + 1 : 1;

router.get("/", (req, res) => {
  res.json(productos);
});

router.get("/:id", (req, res) => {
  const idProducto = parseInt(req.params.id, 10);
  const productoEncontrado = productos.find(
    (producto) => producto.id === idProducto
  );

  if (productoEncontrado) {
    res.json(productoEncontrado);
  } else {
    res.status(404).json({ error: "Producto no encontrado" });
  }
});

class Product {
  constructor(titulo, descripcion, code, precio, stock, categoria, thumbnail) {
    this.id = idCounter++; // Asignar el ID y luego incrementar el contador
    this.titulo = titulo;
    this.descripcion = descripcion;
    this.code = code;
    this.precio = precio;
    this.status = true;
    this.stock = stock;
    this.categoria = categoria;
    this.thumbnail = thumbnail;
  }
}

router.post("/", (req, res) => {
  const { titulo, descripcion, code, precio, stock, categoria, thumbnail } = req.body;
  if (!titulo || !descripcion || !code || !precio || !stock || !categoria) {
    return res.status(400).json({
      status: "error",
      message: "Todos los campos deben ser completados",
    });
  }

  // Validacion de precios
  if (
    typeof precio !== "number" ||
    precio <= 0 ||
    typeof stock !== "number" ||
    stock < 0
  ) {
    return res.status(400).json({
      status: "error",
      message: "Precio y stock deben ser números positivos",
    });
  }

  const nuevoProducto = new Product(
    titulo,
    descripcion,
    code,
    precio,
    stock,
    categoria,
    thumbnail
  );

  // Agregar el nuevo producto a la lista de productos
  productos.push(nuevoProducto);

  // Guardar la lista actualizada de productos en el archivo JSON
  writeToFile(productosPath, productos);

  res.status(201).json({
    message: "Producto creado exitosamente",
    producto: nuevoProducto,
    id: nuevoProducto.id // Incluye el ID generado en la respuesta
  });
});



router.put("/:id", (req, res) => {
  const idProducto = parseInt(req.params.id, 10);
  const { titulo, descripcion, code, precio, stock, categoria, thumbnail } = req.body;
  const productoIndex = productos.findIndex(producto => producto.id === idProducto);

  if (productoIndex === -1) {
    return res.status(404).json({
      status: "error",
      message: "Producto no encontrado",
    });
  }

  // Actualizar los campos del producto, excepto el ID
  productos[productoIndex] = {
    ...productos[productoIndex],
    titulo,
    descripcion,
    code,
    precio,
    stock,
    categoria,
    thumbnail
  };
  writeToFile(productosPath, productos);

  res.json({
    message: "Producto actualizado exitosamente",
    producto: productos[productoIndex],
  });
});

router.delete("/:id", (req, res) => {
  const idProducto = parseInt(req.params.id, 10);
  const productoIndex = productos.findIndex(
    (producto) => producto.id === idProducto
  );

  if (productoIndex === -1) {
    return res.status(404).json({
      message: "Producto no encontrado",
    });
  }

  productos.splice(productoIndex, 1);
  writeToFile(productosPath, productos);

  res.json({
    message: "Producto eliminado exitosamente",
  });
});

export default router;
