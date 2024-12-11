import { app } from '../../src/server.js';  // Asegúrate de importar tu servidor correctamente
import request from 'supertest';
import { expect } from 'chai';

let token = ''; // Variable para almacenar el token JWT
let productId = ''; // Variable para almacenar el ID del producto creado

// Mover la definición de nuevoProducto fuera de los tests
let nuevoProducto = {
  title: "producto test",
  description: "esto es la descripcion hecha en tes",
  code: "code",
  price: 100,
  stock: 50,
  category: 'Electrónica',
  thumbnail: ['http://imagen.url']
};

describe('Rutas de productos', () => {

  // 1. Registrar un usuario y obtener un token
  it("debería obtener un token al hacer login", async () => {
    const usuarioExistente = {
      email: 'john.doe@example.com',
      password: 'password123',
    };

    const respuestaLogin = await request(app)
      .post('/api/users/login')
      .send(usuarioExistente);

    token = respuestaLogin.body.token; // Guarda el token para las pruebas
    console.log("Token recibido:", token); // Verifica el token
  });

  // 2. Crear un nuevo producto
  it('debería crear un nuevo producto', async () => {
    const respuesta = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)  // Usamos el token JWT
      .send(nuevoProducto);

    expect(respuesta.status).to.equal(201);
    expect(respuesta.body).to.have.property('_id');
    expect(respuesta.body).to.have.property('title');
    expect(respuesta.body).to.have.property('description');
    expect(respuesta.body).to.have.property('code');
    expect(respuesta.body).to.have.property('price');
    expect(respuesta.body).to.have.property('stock');
    expect(respuesta.body).to.have.property('category');
    expect(respuesta.body).to.have.property('thumbnail');

    productId = respuesta.body._id; // Guarda el ID del producto creado
});

  // 3. Actualizar un producto existente
  it('debería actualizar un producto existente', async () => {
    const productoActualizado = {
        title: 'Producto Test Actualizado',
        description: 'Esto es la descripcion modifica en tes',
        code: 'code-actualizado',
        price: 120,
        stock: 90,
        category: 'Electrónica',
        thumbnail: ['http://imagen.url']
        };
        
    const respuesta = await request(app)
      .put(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`)
      .send(productoActualizado);
      console.log("producty actualizado:", respuesta.body);


    expect(respuesta.status).to.equal(200);
    expect(respuesta.body).to.have.property('_id');
    expect(respuesta.body).to.have.property('title');
    expect(respuesta.body).to.have.property('description');
    expect(respuesta.body).to.have.property('code');
    expect(respuesta.body).to.have.property('price');
    expect(respuesta.body).to.have.property('stock');
    expect(respuesta.body).to.have.property('category');
    expect(respuesta.body).to.have.property('thumbnail');
  });

    // 4. Obtener todos los productos
it('debería obtener todos los productos', async () => {
    const respuesta = await request(app)
      .get('/api/products')
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.status).to.equal(200);
    expect(respuesta.body).to.be.an('array');
    expect(respuesta.body).to.have.lengthOf.above(0);
});

    // 5. Eliminar un producto
it('debería eliminar un producto', async () => {
    const respuesta = await request(app)
      .delete(`/api/products/${productId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.status).to.equal(200);
    expect(respuesta.body).to.have.property('message').that.equals('Producto eliminado');
});

    // 6. Generar productos falsos (mock products)
it('debería generar productos falsos', async () => {
    const respuesta = await request(app)
      .post('/api/products/mocks/products/5')
      .set('Authorization', `Bearer ${token}`);

    expect(respuesta.status).to.equal(200);
    expect(respuesta.body).to.have.property('message').that.equals('Productos generados');
    expect(respuesta.body.products).to.be.an('array').that.has.lengthOf(5);
});
});
