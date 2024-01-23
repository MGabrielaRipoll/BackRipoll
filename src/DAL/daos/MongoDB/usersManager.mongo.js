import { usersModel } from "../../../DB/Models/users.models.js";

class UsersManager {
    async findById(id) {
        const response = await usersModel.findById(id);
        return response;
    }

    async findByEmail(email) {
        const response = await usersModel.findOne({ email });
        return response;
    }

    async createOne(obj) {
        const response = await usersModel.create(obj);
        return response;
    }
    async updateOne(id, obj) {
        const result = await usersModel.updateOne({ _id: id }, obj);
        return result;
    }
}

export const Users = new UsersManager();