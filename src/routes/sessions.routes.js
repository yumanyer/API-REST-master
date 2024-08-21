import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import LocalStrategy from 'passport-local';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import { createHash } from "../utils/hashFunction.js";
import router from './products.routes.js';

const JWT_SECRET = "s3cr3t";

// Configuración de la estrategia JWT
const opts = {
    jwtFromRequest: ExtractJwt.fromExtractors([(req) => req.cookies.jwt]), // Extrae el token de la cookie
    secretOrKey: JWT_SECRET,
};

// Inicialización de Passport
export const initializePassport = (passport) => {
    // Estrategia para autenticación JWT
    passport.use(new JwtStrategy(opts, async (jwt_payload, done) => {
        try {
            const user = await userModel.findById(jwt_payload.id); 
            if (user) {
                return done(null, user);
            }
            return done(null, false);
        } catch (error) {
            return done(error, false);
        }
    }));

    // Estrategia de registro
    passport.use('register', new LocalStrategy({
        passReqToCallback: true, //  obtengo el request en el callback
        usernameField: 'email',
        passwordField: 'password'
    }, async (req, email, password, done) => {
        try {
            const existingUser = await userModel.findOne({ email });
            if (existingUser) {
                return done(null, false, { message: 'El email ya está en uso.' });
            }




            // Crea un nuevo usuario
            const newUser = await userModel.create({
                first_name: req.body.first_name, 
                last_name: req.body.last_name, 
                email,
                age: req.body.age, 
                password
            });
            return done(null, newUser);
        } catch (error) {
            return done(error);
        }
    }));
};

// Funciones para generar y verificar tokens
export function generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2m"
    });
    return token;
}

export function verifyToken(token) {
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        return decoded;
    } catch (error) {
        throw new Error(`Hubo un error: ${error}`);
    }
}

export default router;
