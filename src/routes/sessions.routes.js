import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { config } from "../config/config.js";
import { authenticateUser } from "../middleware/auth.middleware.js";

const router = express.Router();

export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: 'Todos los campos son requeridos' });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
  
      const isPasswordValid = await verifyPassword(password, user.password);
  
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Contraseña incorrecta' });
      }
  
      const token = jwt.sign({ id: user._id, role: user.role }, config.JWT_SECRET, { expiresIn: '2h' });
  
      return res.status(200).json({ message: 'Sesión iniciada', token });
    } catch (error) {
      return res.status(500).json({ error: 'Hubo un error', details: error.message });
    }
  };

router.post(
  "/register", authenticateUser, (req, res) => {
    res.json({ message: 'Acceso autorizado', user: req.user });
  });
export default router;
