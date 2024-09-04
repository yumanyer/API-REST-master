import { Schema, model } from "mongoose";

const productSchema = new Schema({
    titulo: String,
    descripcion: String,
    code: String,
    precio: Number,
    stock: Number,
    categoria: String,
    thumbnail: [String]
});

export const Product = model('Product', productSchema);