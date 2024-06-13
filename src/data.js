import fs from "fs";
import path from "path";

// Ruta de los archivos JSON
const productosPath = path.resolve("data/productos.json");
const carritosPath = path.resolve("data/carritos.json");

// Función para leer datos desde un archivo JSON
const readFromFile = (filePath) => {
  try {
    const data = fs.readFileSync(filePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    console.error(`Error al leer el archivo ${filePath}:`, error);
    return [];
  }
};

// Función para escribir datos en un archivo JSON
const writeToFile = (filePath, data) => {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error(`Error al escribir en el archivo ${filePath}:`, error);
  }
};

// Inicializar datos desde los archivos JSON
const productos = readFromFile(productosPath);
const carritos = readFromFile(carritosPath);

// Exportar datos y funciones
export { productos, carritos, writeToFile, productosPath, carritosPath };
