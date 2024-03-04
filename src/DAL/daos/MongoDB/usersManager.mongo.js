import { usersModel } from "../../../DB/Models/users.models.js";

class UsersManager {
    async findAll() {
        const response = await usersModel.find();
        return response; 
    }
    async findById(id) {
        const response = await usersModel.findById(id);
        return response;
    }

    async deleteOne(id) {
        const response = await usersModel.deleteOne({ _id: id });
        return response
    }

    async deleteByEmail(email) {
        const response = await usersModel.deleteOne({ email: email });
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