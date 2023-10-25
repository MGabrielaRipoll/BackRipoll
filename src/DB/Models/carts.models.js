import mongoose from "mongoose";

const cartsSchema = new mongoose.Schema({

    product : [
        {
            product : {
                type : mongoose.SchemaTypes.ObjectId,
                ref: 'products',
            },
            quantity: {
                tipe: Number,
                // required: true,
            },
            _id: false,
        }   
    ]
});

export const cartsModel = mongoose.model("Carts", cartsSchema);