import mongoose,{ Schema, model } from "mongoose";
import { createHash } from "../utils/hashFunction.js";

const userSchema = new mongoose.Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    age: { type: Number, required: true },
    password: { type: String, required: true },
    cart: { type: mongoose.Schema.Types.ObjectId, ref: 'Cart' },
    role: { type: String, default: 'user' }
});

// middleware de mongoose

// antes de que se guarde el registro va a realizar lo que este dentro  de esta funcion 
// este caso es validacion de email para que tenga @ y . 
userSchema.pre('save', function(next) {
    if(this.email.includes("@") && this.email.includes(".")){
        return next()
    }

    next(new Error('Email inválido'))
})


// COMO BUENA PRACTICA SE DEBE HASHEAR LA CONTRASEÑA DE LOS USUARIOS
// ANTES DE QUE SE GUARDE 

userSchema.pre('save', async function(next) {

    const newPassword = await createHash(this.password);  // hashear contraseña

    this.password = newPassword;

    next()
})

export const userModel = model('user', userSchema);