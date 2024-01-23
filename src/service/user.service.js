import { Users } from "../DAL/daos/MongoDB/usersManager.mongo.js";
import { hashData } from "../utils/utils.js";
import UsersResponse from "../DAL/dtos/users-response.dto.js";




export const findById = (id) => {
    const user = Users.findById(id);
    return user;
};

export const findByEmail = (id) => {
    const user = Users.findByEmail(id);
    return user;
};


export const updateUser = async (id, obj) => {
    try {

        const userModific = await Users.updateOne({ _id: id }, obj);
        return userModific;
    } catch (error) {
        throw new Error(`Error updating user: ${error.message}`);
    }
};


export const createOne = (obj) => {
    const hashedPassword = hashData(obj.password);
    const newObj = { ...obj, password: hashedPassword };
    const createdUser = Users.createOne(newObj);
    return createdUser;
};

// name - email - password