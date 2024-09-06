import { Schema, model } from "mongoose";

const productSchema = new Schema({
    title: String,
    description: String,
    code: String,
    price: Number,
    stock: Number,
    category: String,
    thumbnail: [String]
});

export const Product = model('Product', productSchema);