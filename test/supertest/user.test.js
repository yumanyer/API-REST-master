import { app } from '../../src/server.js';
import request from 'supertest'; 
import { expect } from 'chai';

let token = ''; // Variable global para almacenar el token JWT

describe('Rutas de usuario', () => {
 // Limpiar la base de datos después de cada prueba

  // 1. Registrar un nuevo usuario
it('debería registrar un nuevo usuario', async () => {
    const nuevoUsuario = {
        first_name: 'John',
        last_name: 'Doe',
        email: 'john.doe@example.com',
        age: 30,
        password: 'password123',
        role: 'admin'
    };

    const respuesta = await request(app)
        .post('/api/users/register')
        .send(nuevoUsuario);

    expect(respuesta.status).to.equal(201);  
    expect(respuesta.body).to.have.property('message').that.equals('Usuario creado exitosamente');  
});

  // 2. Iniciar sesión con un usuario existente y devolver un token JWT
it('debería iniciar sesión con un usuario existente y devolver un token JWT', async () => {
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

  // 3. Prueba para obtener el usuario actual cuando está autenticado con JWT
    it('debería obtener el usuario actual cuando esté autenticado con JWT', async () => {
    if (!token) {
        throw new Error('Token JWT no disponible');
    }

    const respuesta = await request(app)
        .get('/api/users/current')
        .set('Authorization', `Bearer ${token}`);  

        // Log para ver el resultado
        console.log(respuesta.body);  
    
    expect(respuesta.status).to.equal(200);  
    expect(respuesta.body.payload).to.have.property('email').that.equals('john.doe@example.com');  
    expect(respuesta.body.payload).to.have.property('first_name').that.equals('John');  
    expect(respuesta.body.payload).to.have.property('last_name').that.equals('Doe');  
    expect(respuesta.body.payload).to.have.property('role').that.equals('admin');  
});

});
