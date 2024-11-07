// product.controller.js
import { ProductRepository } from '../repositories/product.repository.js';
import { faker } from "@faker-js/faker";
import { Product } from "../models/product.model.js";
export class ProductController {
    constructor() {
        this.productRepository = new ProductRepository();
    }

    async addProduct(req, res) {
        try {
            const product = await this.productRepository.create(req.body);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al agregar el producto' });
        }
    }

    async generateFakerProducts(req, res) {
        const { n } = req.params;

        if (!n || isNaN(n) || n <= 0) {
            return res.status(400).json({ message: "El parámetro n debe ser un número positivo." });
        }

        try {
            const productsArray = [];
            for (let i = 0; i < n; i++) {
                const product = {
                    title: faker.commerce.productName(),
                    description: faker.commerce.productDescription(),
                    code: faker.database.type(),
                    price: faker.commerce.price(),
                    stock: faker.number.int({ min: 1, max: 100 }),
                    category: faker.commerce.department(),
                    thumbnail: [faker.image.avatarGitHub()]
                };
                productsArray.push(product);
                console.log("Productos generados:", productsArray);
            }
            // Guardar los productos en la base de datos
            await Product.insertMany(productsArray);

            res.json({ message: "Productos generados", products: productsArray });
        } catch (error) {
            console.error("Error generando productos:", error);
            return res.status(500).json({ message: "Hubo un error al generar los productos", details: error.message });
        }
    }



    async updateProduct(req, res) {
        try {
            const product = await this.productRepository.update(req.params.id, req.body);
            res.status(200).json(product);
        } catch (error) {
            res.status(500).json({ message: 'Error al actualizar el producto' });
        }
    }

    async deleteProduct(req, res) {
        try {
            await this.productRepository.delete(req.params.id);
            res.status(200).json({ message: 'Producto eliminado' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el producto' });
        }
    }

    async getProducts(req, res) {
        try {
            const products = await this.productRepository.findAll();
            res.status(200).json(products);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener productos' });
        }
    }
}
