import mongoose from "mongoose";


const URI = "mongodb+srv://gabymaujw:Salmo374@cluster0.bs3x8cw.mongodb.net/ecommerceTest?retryWrites=true&w=majority"

mongoose
    .connect(URI)
    .then(() => console.log("Conectado a la DB Test"))
    .catch((error) => console.log(error));