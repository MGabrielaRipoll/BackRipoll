import { dirname } from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";
import config from "../src/config/config.js"

const secretKeyJwt = config.secret_jwt;

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
    console.log(data);
    return bcrypt.compare(data, hashedData);
};

export const generateToken = (user) => {
    const token = jwt.sign(user, secretKeyJwt, { expiresIn: 3600 });
    console.log("token", token);
    return token;
};

export const generateUniqueCode = () => {
    const prefix = 'ORDER'; // Puedes personalizar esto según tus necesidades
    const timestamp = Date.now().toString(36); // Convertir la fecha actual a base36
    const random = Math.random().toString(36).substr(2, 5); // Número aleatorio en base36
    // Concatenar los elementos para formar el código único
    const uniqueCode = `${prefix}-${timestamp}-${random}`;
    return uniqueCode.toUpperCase(); // Convertir todo a mayúsculas si es necesario
}
