import dotenv from 'dotenv';
import { Command } from 'commander';
import args from '../utils/args.util.js';

const { mode } = args;

// Selecciona el archivo `.env` correcto según el modo
const path = "./.env." + mode;

// Carga las variables de entorno desde el archivo seleccionado
dotenv.config({ path });

// Exporta las configuraciones
export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    PERSISTANCE: process.env.PERSISTANCE,
    JWT_SECRET: process.env.JWT_SECRET,
    mailer: {
        host: process.env.MAILER_HOST,
        port: process.env.MAILER_PORT,
        auth: {
            user: process.env.MAILER_USER,
            pass: process.env.MAILER_PASSWORD,
        },
    },
};
