import { Users } from "../daos/MongoDB/usersManager.mongo.js";
import { hashData } from "../utils.js";



export const findById = (id) => {
    const user = Users.findById(id);
    return user;
};

export const findByEmail = (id) => {
    const user = Users.findByEmail(id);
    return user;
};

export const createOne = (obj) => {
    const hashedPassword = hashData(obj.password);
    const newObj = { ...obj, password: hashedPassword };
    const createdUser = Users.createOne(newObj);
    return createdUser;
};

// name - email - password