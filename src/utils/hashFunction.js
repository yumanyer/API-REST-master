import bcrypt from "bcrypt";

const SALT_ROUND = 10;

export async function createHash(password){
// genSaltSync ayuda a la encriptacion de datos , marca la cantidad de saltos que se van a realizar
const hashPassword = await bcrypt.hashSync(
    password,
    bcrypt.genSaltSync(SALT_ROUND)
  );
  return hashPassword;
}

// generalmente se hace 
// desincreptar la contraseña y compararla 

// LO QUE HACE ES 
//  la contraseña que no esta hasheada la hashe y la compara con 
// la que si esta hasheada

export async function veryfyPassword(password, hash){
    // compare devuleve un booleano 
    const isPasswordCorrect = await bcrypt.compare(password, hash);
    console.log("Contraseña correcta?", isPasswordCorrect); // Log para verificar la contraseña
    return isPasswordCorrect;
}