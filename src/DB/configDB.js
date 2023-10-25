import mongoose from "mongoose";

const URI =
    "mongodb+srv://gabymaujw:Salmo374@cluster0.bs3x8cw.mongodb.net/ecommerce?retryWrites=true&w=majority";
mongoose
    .connect(URI)
    .then(() => console.log("Conectado a la DB"))
    .catch((error) => console.log(error));