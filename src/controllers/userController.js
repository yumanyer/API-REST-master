import { userModel } from '../models/user.model.js';
import { generateToken } from '../utils/passport.config.js';
import bcrypt from 'bcrypt';
import { veryfyPassword } from '../utils/hashFunction.js';

// Registro de usuario
export const registerUser = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ status: 'error', message: 'El email ya está en uso.' });
        }

        // Hashear la contraseña solo una vez
        const newUser = await userModel.create({ 
            first_name, 
            last_name, 
            email, 
            age, 
            password
        });
        console.log("Usuario creado:", newUser);

        // Generar un token y enviarlo en la respuesta
        const token = generateToken({ id: newUser._id });
        res.status(201).json({ status: 'success', message: 'Usuario creado exitosamente', token });
    } catch (error) {
        res.status(400).json({ status: 'error', message: error.message });
    }
};

// Login de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: "Todos los campos son requeridos" });
    }

    try {
        const user = await userModel.findOne({ email });

        if (!user) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }

        const isPasswordCorrect = await veryfyPassword(password.trim(), user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: "Contraseña incorrecta" });
        }

        // Generar un token si se requiere
        const token = generateToken({ id: user._id });

        return res.status(200).json({ message: "Sesión iniciada", token });
    } catch (error) {
        return res.status(500).json({ error: "Hubo un error", details: error.message });
    }
};
