// src/routes/users.routes.js
import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import passport from 'passport';

const router = express.Router(); 

// Middleware para parsear JSON en el cuerpo de las solicitudes
router.use(express.json());

// Ruta para registrar un nuevo usuario
router.post('/register', registerUser);

// Ruta de login
router.post('/login', loginUser);

// Ruta para obtener el usuario actual
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ status: 'success', payload: req.user });
});

export default router;