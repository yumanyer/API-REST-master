import mongoose from 'mongoose';

const productSchema = new mongoose.Schema({
    titulo: String,
    descripcion: String,
    code: String,
    precio: Number,
    stock: Number,
    categoria: String,
    thumbnail: [String]
});

const Product = mongoose.model('Product', productSchema);

export default Product;