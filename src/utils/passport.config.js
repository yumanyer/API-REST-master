import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import { Strategy as LocalStrategy } from 'passport-local';
import jwt from 'jsonwebtoken';
import { userModel } from '../models/user.model.js';
import { createHash, veryfyPassword } from '../utils/hashFunction.js';

const JWT_SECRET = "s3cr3t";

// Configuración de la estrategia JWT
const opts = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Extrae el token del encabezado
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
            return done(null, false, { message: 'Usuario no encontrado' });
        } catch (error) {
            return done(error, false);
        }
    }));

    // Estrategia de login (Local Strategy)
    passport.use('local', new LocalStrategy({
        usernameField: 'email', // Usa el campo email como nombre de usuario
        passwordField: 'password', // Usa el campo password como contraseña
    }, async (email, password, done) => {
        try {
            const user = await userModel.findOne({ email });
            if (!user) {
                return done(null, false, { message: 'Usuario no encontrado' });
            }
            const isPasswordValid = await veryfyPassword(password, user.password);
            if (!isPasswordValid) {
                return done(null, false, { message: 'Contraseña incorrecta' });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
}

// Funciones para generar y verificar tokens
export function generateToken(payload) {
    const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: "2m" // El token expira en 2 minutos
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