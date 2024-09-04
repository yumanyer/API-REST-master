import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

export const authenticateUser = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // Obtiene el token de la cabecera Authorization
  if (!token) {
    return res.status(401).json({ message: 'No autorizado' });
  }

  jwt.verify(token, config.JWT_SECRET, (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Token inválido' });
    }
    req.user = decoded; // Guarda la información del usuario en req.user
    next();
  });
};
