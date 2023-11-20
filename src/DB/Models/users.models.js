import mongoose from "mongoose";

const usersSchema = new mongoose.Schema({  
    name: {
        type: String,
        required: true,      
    },  
    lastName: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        index: true,
    },
    password: {
        type: String,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false,
    },
    isGithub: {
        type: Boolean,
        default: false,
    },
});


export const usersModel = mongoose.model("Users", usersSchema);