import { Manager } from "../DAL/daos/MongoDB/productManager.mongo.js";
import { Users } from "../DAL/daos/MongoDB/usersManager.mongo.js";
import CustomError from "../errors/error.generate.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import { jwtValidation } from "../middlewares/jwt.middlewares.js";
import { findAll, findById, createOne, deleteOneProduct, updateProduct } from "../service/product.service.js";
import { transporter } from "../utils/nodemailer.js";

export const findProductById = async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await findById(pid);
        if (!product) {
            // return res
            // .status(404)
            // .json({ message: "Product not found with the id provided" });
            return CustomError.generateError(ErrorMessages.PRODUCT_NOT_FOUND,404, ErrorName.PRODUCT_NOT_FOUND);
        }
        res.status(200).json({ message: "Product found", product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
};

export const findAllProduct = async (req, res) => {
    try {
        const products = await findAll(req.query); 
        res.status(200).json({ message: "Product found", products });   
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const createOneProduc = async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !description || !price || !code || !stock || ! category) {
        // return res.status(400).json({ message: "Some data is missing" });
        return CustomError.generateError(ErrorMessages.ALL_FIELDS_REQUIRED,400,ErrorName.ALL_FIELDS_REQUIRED);
    }
  
    try {
        const existingProduct = await Manager.findByCode(code);
        if (existingProduct.length >= 1) {
            res.status(500).json({ message: error.message });
        }
        if (req.user.role === "premium") {
            const newProduct = {...req.body, owner:req.user.mail};
            const response = await createOne(newProduct);
            res.status(200).json({ message: "Producto created", response });

        } else {
            const response = await createOne(req.body);
            res.status(200).json({ message: "Producto created", response });

        }
        // res.status(200).json({ message: "Producto created", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

export const deleteOneProdAll = async (req, res) => {
    const { id } = req.body;
    const producForDelette = await findById(id);
    const user = await Users.findByEmail(producForDelette.owner);
    
    try {
        if (req.user.role === "premium") {
            if (producForDelette.owner === user.email) {
                const response = await deleteOneProduct(id);
                if (!response) {
                    return res.status(404).json({ message: "Product not found" });
                }
                return res.status(200).json({ message: "Product deleted" });
            } else {
                return res.status(500).json({ message: "This product was not created by you" });
            }
        } else {
            const response = await deleteOneProduct(id);
            await transporter.sendMail({
                from: "mariagabriela.ripoll@gmail.com",
                to: user.email,
                subject: "Producto Eliminado en Pelimania",
                html: `<b>Estimado, su producto ${producForDelette.title}, ha sido eliminado de nuestra pagina, ante cualquier duda o reclamo comuniquese con nosotros. Atte. Pelimania </b>`,
            });
            if (!response) {
                return res.status(404).json({ message: "Product not found" });
            }
            return res.status(200).json({ message: "Product deleted" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error" });
    }
};


export const updateProducts = async (req, res) => {
    const { _id } = req.body;
    try {
        const response = await updateProduct(_id, req.body);
        if (!response) {
            return CustomError.generateError(ErrorMessages.PRODUCT_NOT_FOUND,404, ErrorName.PRODUCT_NOT_FOUND);
        }
        res.status(200).json({ message: "Product updated", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
