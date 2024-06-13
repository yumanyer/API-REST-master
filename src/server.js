import express from "express";
import { engine } from "express-handlebars";
import path from "path";
import { createServer } from "http";
import { Server } from "socket.io";
import { productos } from "./data.js";
import usersRouter from "./routes/products.js"; // Importa el enrutador de productos
import cartsRouter from "./routes/carts.js";
import getDirname from "./dirname.js"; // Importa la función getDirname

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer);

app.use(express.json());
app.use(express.static('public'));

// Configuramos nuestro server
app.use(express.urlencoded({ extended: true }));

// Configurar Handlebars
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
// Usa la función getDirname para obtener el directorio actual
app.set('views', path.join(getDirname(), 'views'));

// Configurar la carpeta pública
// Usa la función getDirname para obtener el directorio actual
app.use(express.static(path.join(getDirname(), 'public')));

// PORT
const PORT = 5000;

// Usar el enrutador de productos y carritos
app.use("/api/products", usersRouter);
app.use("/api/carts", cartsRouter);

// Ruta para la página de inicio
app.get('/', (req, res) => {
  res.render('home', { productos });
});

// Ruta para realTimeProducts
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});


// Configurar Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  
  // Enviar la lista de productos actualizada a los clientes
  socket.emit('productos', productos);

  // Actualizar lista de productos cuando se agregue un nuevo producto
  socket.on('nuevoProducto', (producto) => {
    productos.push(producto);
    io.emit('productos', productos); // Emitir lista de productos actualizada a todos los clientes
  });

  // Actualizar lista de productos cuando se elimine un producto
  socket.on('eliminarProducto', (id) => {
    const index = productos.findIndex(p => p.id === id);
    if (index !== -1) {
      productos.splice(index, 1);
      io.emit('productos', productos); // Emitir lista de productos actualizada a todos los clientes
    }
  });
});

httpServer.listen(PORT, () => {
  console.log(`listening on http://localhost:${PORT}`);
});
