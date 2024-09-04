// config de las variables de entorno

import dotenv from 'dotenv';
dotenv.config();

export const config = {
    PORT: process.env.PORT,
    MONGO_URI: process.env.MONGO_URI,
    PERSISTANCE: process.env.PERSISTANCE,
    JWT_SECRET: process.env.JWT_SECRET,
};
