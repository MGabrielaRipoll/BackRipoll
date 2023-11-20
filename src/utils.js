import { dirname } from "path";
import bcrypt from "bcrypt";
import { fileURLToPath } from "url";
import { log } from "console";


export const __dirname = dirname(fileURLToPath(import.meta.url));

export const hashData = async (data) => {
    return bcrypt.hash(data, 10);
};

export const compareData = async (data, hashedData) => {
    console.log(data);
    return bcrypt.compare(data, hashedData);
};