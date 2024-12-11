// userController.js
import { User } from "../models/user.model.js";
import { generateToken } from "../config/jwt.config.js";
import { veryfyPassword,createHash } from "../utils/hashFunction.js";
import { faker } from "@faker-js/faker";
import errors  from "../utils/errors/error.js";

// Registro de usuario
export const registerUser = async (req, res) => {
  const { first_name, last_name, email, age, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ status: "error", message: "El email ya está en uso." });
    }

    const newUser = await User.create({
      first_name,
      last_name,
      email,
      age,
      password,
      role: role || "user",
    });
    console.log("Usuario creado:", newUser);

    // genero un token y lo envio en la respuesta
    const token = generateToken({ id: newUser._id });
    res
      .status(201)
      .json({
        status: "success",
        message: "Usuario creado exitosamente",
        token,
      });
  } catch (error) {
    res.status(400).json({ status: "error", message: error.message });
  }
};
// Login de usuario
export const loginUser = async (req, res) => {
    const { email, password } = req.body;
  
    if (!email || !password) {
      return res.status(400).json({ message: "Todos los campos son requeridos" });
    }
  
    try {
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ message: "Usuario no encontrado" });
      }
  
      const isPasswordCorrect = await veryfyPassword(password.trim(), user.password);
  
      if (!isPasswordCorrect) {
        return res.status(401).json({ message: "Contraseña incorrecta" });
      }
  
      // Generar el token aquí
      const token = generateToken({ id: user._id, role: user.role });
  
      return res.status(200).json({ message: "Sesión iniciada", token });
    } catch (error) {
      return res.status(500).json({ error: "Hubo un error", details: error.message });
    }
  };

// GENERAR USARIOS FAKER

export const generateFakerUsers = async (req, res) => {
  const { n } = req.params;

  // Validar que n sea un número positivo
  if (!n || isNaN(n) || n <= 0) {
    return res.status(400).json({ message: "El parámetro n debe ser un número positivo." });
  }

  try {
    const usersArray = []; 
    for (let i = 0; i < n; i++) { // Generar n usuarios
      const hashedPassword = await createHash("hola1234")
      const user = { 
        first_name: faker.person.firstName(),
        last_name: faker.person.lastName(),
        email: `${faker.person.firstName()}${faker.person.lastName()}@soham.bio`,
        age: faker.number.int({ min: 18, max: 70 }),
        password: hashedPassword,
        role: faker.datatype.boolean() ? "admin" : "user",
      };
      usersArray.push(user); 
    }
    
    // Insertar los usuarios generados en la base de datos
    await User.insertMany(usersArray);
    // logger para ver los usarios creados
    //console.log("Usuarios generados:", usersArray);
    
    // Respuesta exitosa con los usuarios generados
    res.json({ message: "Usuarios generados", users: usersArray });
  } catch (error) {
    console.error("Error generando usuarios:", error);
    return res.status(500).json({ message: "Hubo un error al generar los usuarios", details: error.message });
  }
};
