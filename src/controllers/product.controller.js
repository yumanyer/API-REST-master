import { ProductRepository } from '../repositories/product.repository.js';

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
