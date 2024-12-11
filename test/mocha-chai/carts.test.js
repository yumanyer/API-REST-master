import { app } from '../../src/server.js';
import request from 'supertest';
import { expect } from 'chai';

// Variables globales
let token = '';
let productId = '';
let cartId = '';

describe('Rutas de carrito', () => {

  // Antes de ejecutar las pruebas, autenticamos al usuario y obtenemos un token
  it("debería autenticar al usuario y obtener un token", async () => {
    const usuarioExistente = {
        email: 'john.doe@example.com',  
        password: 'password123',
    };

    const respuesta = await request(app)
        .post('/api/users/login')
        .send(usuarioExistente);

    expect(respuesta.status).to.equal(200);  
    expect(respuesta.body).to.have.property('message').that.equals('Sesión iniciada');
    expect(respuesta.body).to.have.property('token');  

    token = respuesta.body.token;  // Guardo el token para las siguientes pruebas
    console.log("Token recibido:", token); // Verifica el token
  });


  // Test: Crear un producto
  it('debería crear un producto y agregarlo al carrito', async () => {
    const productoRespuesta = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: "producto test para el carrito",
        description: "esto es la descripcion hecha en tes",
        code: "code",
        price: 100,
        stock: 50,
        category: 'Electrónica',
        thumbnail: ['http://imagen.url']
      });

    console.log('Respuesta de creación de producto:', productoRespuesta.body); // Verifica la respuesta

    if (!productoRespuesta.body._id) {
      throw new Error('El producto no se ha creado correctamente');
    }

    productId = productoRespuesta.body._id;  // Guardamos el ID del producto
    console.log('ID del producto creado:', productId);

    // Aquí, `productId` debería ser el ID de un producto que has creado previamente
    const productos = [
      { productId: productId, quantity: 2 }  // Añade dos unidades del producto al carrito
    ];
    console.log('Productos a agregar:', productos);

    // Asegúrate de que el carrito y la ruta sean correctos
    const respuesta = await request(app)
      .post(`/api/carts/${cartId}/add-product`)  // Usamos el cartId recién creado
      .set('Authorization', `Bearer ${token}`)
      .send({ products: productos });  // Enviar los productos que queremos agregar al carrito

    expect(respuesta.status).to.equal(200);  // Verifica que la respuesta sea exitosa
    expect(respuesta.body).to.have.property('message').that.equals('Productos agregados al carrito');  // Mensaje de éxito
    expect(respuesta.body.cart).to.have.property('products').that.is.an('array').that.is.not.empty;  // Verifica que los productos se hayan agregado correctamente
    console.log('Productos agregados al carrito');
  });



});
