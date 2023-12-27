import { messaggeModel } from "../../../DB/Models/messagge.models.js";

class MessagesManager {
    async findAll() {
        const result = await messaggeModel.find().lean();
        return result;
    }

    async createOne(obj) {
        const result = await messaggeModel.create(obj);
        return result;
    }  
}

export const messagesManager = new MessagesManager();