import express from 'express';
import { registerUser, loginUser } from '../controllers/userController.js';
import passport from 'passport';
import { validateDTO } from '../middleware/validate.dto.js';
import { userDTO } from '../dtos/user.dto.js';

const router = express.Router(); 

// Middleware para parsear JSON en el cuerpo de las solicitudes
router.use(express.json());

// Ruta para registrar un nuevo usuario
router.post('/register',validateDTO(userDTO), registerUser);

// Ruta de login
router.post('/login', loginUser);

// Ruta para obtener el usuario actual
router.get('/current', passport.authenticate('jwt', { session: false }), (req, res) => {
    res.json({ status: 'success', payload: req.user });
});

export default router;
