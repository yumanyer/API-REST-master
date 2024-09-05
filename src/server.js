import express from 'express';
import path from 'path';
import mongoose from 'mongoose';
import passport from 'passport';
import session from 'express-session';
import getDirname from './dirname.js';
import cookieParser from 'cookie-parser';
import { engine } from 'express-handlebars';
import { createServer } from 'http';
import { Server } from 'socket.io';
import productsRouter from './routes/products.routes.js';
import cartsRouter from './routes/carts.routes.js';
import sessionsRouter from './routes/sessions.routes.js';
import usersRouter from './routes/users.routes.js';
import { initializePassport } from './config/passport.config.js';
import { config } from './config/config.js';

const app = express();
initializePassport(passport);

const httpServer = createServer(app);
const io = new Server(httpServer);

// Conexión a MongoDB
mongoose.connect(config.MONGO_URI)
    .then(() => {
        console.log("Se ha conectado a MongoDB");
        initApp();
    })
    .catch((err) => {
        console.error("Error de conexión a MongoDB:", err);
    });

function initApp() {
    // Configuración de Handlebars, middleware estático y rutas
    app.use(express.json());
    app.engine('hbs', engine({ extname: 'hbs' }));
    app.set('view engine', 'hbs');
    app.set('views', path.join(getDirname(), 'views'));
    app.use(express.static(path.join(getDirname(), 'public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    // Configuración de sesiones
    app.use(session({
        secret: 'tu_secreto_aqui', // Cambia esto por un secreto fuerte
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false } // Cambia a true si usas HTTPS
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    // RUTAS
    app.use('/api/products', productsRouter);
    app.use('/api/carts', cartsRouter);
    app.use('/api/users', usersRouter);
    app.use('/api/sessions', sessionsRouter);

    // Ruta para la página de inicio
    app.get('/', (req, res) => {
        res.render('home', { pageTitle: 'Página de Inicio' });
    });

    // Ruta para la página de productos en tiempo real
    app.get('/realtimeproducts', (req, res) => {
        res.render('realTimeProducts', { pageTitle: 'Productos en Tiempo Real' });
    });

    let productos = [];

    // Configuración de Socket.io
    io.on('connection', (socket) => {
        console.log('Nuevo cliente conectado');
        socket.emit('productos', productos);

        socket.on('nuevoProducto', (producto) => {
            productos.push(producto);
            io.emit('productos', productos);
        });

        socket.on('limpiarProductos', () => {
            productos = [];
            io.emit('productos', productos);
        });
    });

    // Iniciar el servidor HTTP
    const PORT = 5000;
    httpServer.listen(PORT, () => {
        console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
}
