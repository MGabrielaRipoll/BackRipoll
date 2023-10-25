import mongoose from "mongoose";

const productsSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    stock: {
        type: Number,
        default: 0,
    },
    code: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    thumbail: {
        type: String,
    },
    status: {
        type: Boolean,
        default: true,
    }
});

export const productsModel = mongoose.model("Products", productsSchema);