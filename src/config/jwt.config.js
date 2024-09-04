import jwt from "jsonwebtoken";
import { config } from "./config.js";

export const generateToken = (payload) => {
    return jwt.sign(payload, config.JWT_SECRET, {
      expiresIn: "1h",
    });
  };
  
  export const verifyToken = (token) => {
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
  
      return decoded;
    } catch (error) {
      throw new Error("Token no valido");
    }
  };