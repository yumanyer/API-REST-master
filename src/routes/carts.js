import express from "express";
import { carritos, writeToFile, carritosPath } from "../data.js";

const router = express.Router();

// Contador para IDs únicos de carritos
let idCartCounter = carritos.length ? Math.max(...carritos.map(c => c.id)) + 1 : 1;

// Clase Cart
class Cart {
    constructor() {
        this.id = idCartCounter++; // ID carrito
        this.products = []; // Array de productos en el carrito
    }
}

// Crear un nuevo carrito
router.post("/", (req, res) => {
    const nuevoCarrito = new Cart();
    carritos.push(nuevoCarrito);
    writeToFile(carritosPath, carritos);
    res.status(201).json({
        message: "Carrito creado exitosamente",
        cart: nuevoCarrito
    });
});

// Ruta para obtener todos los carritos
router.get("/", (req, res) => {
    res.json(carritos);
});

// Ruta para agregar un producto a un carrito específico
router.post("/:id/product/:productId", (req, res) => {
    const { id, productId } = req.params;
    const { quantity } = req.body;

    // Buscar el carrito por ID
    const carrito = carritos.find(cart => cart.id == id);
    if (!carrito) {
        return res.status(404).json({
            message: "Carrito no encontrado"
        });
    }

    // Buscar el producto en el carrito
    const productInCart = carrito.products.find(prod => prod.product == productId);

    if (productInCart) {
        // Si el producto ya está en el carrito, incrementar la cantidad
        productInCart.quantity += quantity;
    } else {
        // Si el producto no está en el carrito, agregarlo con la cantidad proporcionada
        carrito.products.push({
            product: productId,
            quantity: quantity
        });
    }

    writeToFile(carritosPath, carritos);
    res.status(201).json({
        message: "Producto agregado al carrito exitosamente",
        cart: carrito
    });
});

export default router;
