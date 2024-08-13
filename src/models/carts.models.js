import mongoose from 'mongoose';

const cartSchema = new mongoose.Schema({
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;