import { dirname } from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import jwt from "jsonwebtoken";


const SECRET_KEY_JWT = "secretJWT";

export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
    console.log(data);
    return bcrypt.compare(data, hashedData);
};

export const generateToken = (user) => {
    const token = jwt.sign(user, SECRET_KEY_JWT, { expiresIn: 3600 });
    console.log("token", token);
    return token;
};


