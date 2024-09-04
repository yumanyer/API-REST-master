import bcrypt from 'bcrypt';

const SALT_ROUND = 10;

// Función para crear un hash de la contraseña
export async function createHash(password) {
    // Genera un hash de la contraseña con un número de saltos especificado
    const hashPassword = await bcrypt.hash(password, SALT_ROUND);
    return hashPassword;
}

export async function veryfyPassword(password, hash){
    // compare devuleve un booleano 
    const isPasswordCorrect = await bcrypt.compare(password, hash);
    console.log("Contraseña correcta?", isPasswordCorrect); // Log para verificar la contraseña
    return isPasswordCorrect;
}