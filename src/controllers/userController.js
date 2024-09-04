import { User } from "../models/user.model.js";
import { generateToken } from "../config/jwt.config.js";
import bcrypt from "bcrypt";
import { veryfyPassword } from "../utils/hashFunction.js";

// Registro de usuario
export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "El email ya está en uso." });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role: role || "user",
    });
    console.log("Usuario creado:", newUser);

    // Generar un token y enviarlo en la respuesta
    const token = generateToken({ id: newUser._id });
    res
      .status(201)
      .json({
        status: "success",
        message: "Usuario creado exitosamente",
        token,
      });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};

// Login de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      const isPasswordCorrect = await veryfyPassword(password.trim(), user.password);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
  
      // Generar el token aquí
      const token = generateToken({ id: user._id, role: user.role });
  
      return res.status(200).json({ message: "Sesión iniciada", token });
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error", details: error.message });
    }
  };
