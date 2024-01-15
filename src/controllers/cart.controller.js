import { findAll, findCById, createOne, addProduct, deleteOneProduct, deleteAll, updateCart } from "../service/cart.service.js";
import { findById } from "../service/product.service.js";
import { Cart } from "../DAL/daos/MongoDB/cartsManager.mongo.js";
import { createOneT } from "../service/ticket.service.js";
import { generateUniqueCode } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js" 
import CustomError from "../errors/error.generate.js";
import { ErrorMessages, ErrorName } from "../errors/errors.enum.js";
import {logger} from "../logger.js"



export const findCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await findCById(cid);
        ;
        if (!cart) {
            // return res.status(404).json({ message: "Cart not found" });
            return CustomError.generateError(ErrorMessages.CART_NOT_FOUND,404,ErrorName.CART_NOT_FOUND);
        }
        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
};

export const findAllCart = async (req, res) => {
    try {
        const carts = await findAll();
        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: "No carts found" });
        }
        res.status(200).json({ message: "Carts found", carts });
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createOneCart = async (req, res) => {
    try {
        const cart = await createOne();
        res.status(201).json({ message: "Cart created", cart });
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addProductCart = async (req, res) => {
    const { cid , pid } = req.params;
    // console.log( "cid", cid, "pid", pid);
    try {
        const productAdd = await findById(pid);
        const cartNow = await findCById(cid);
        if (productAdd.stock) {
            const response = await addProduct(cid,pid);
            res.status(200).json({ message: "Product added to cart", cart: response })}
            else {
                res.status(404).json({ message: "Stock insuficiente" });
            };
    } catch (error) {
        logger.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteOneProdCart = async (req, res) => {
    try {
        const { cid, pid } = req.params;
        const response = await deleteOneProduct(cid,pid);
        res.status(200).json({ message: "Product delete to cart", cart: response });
    
    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
}

export const deleteOneCartAll = async (req, res) => {
    try {
        const { cid } = req.params;
        const response = await deleteAll(cid);
        res.status(200).json({ message: "Cart delette", cart: response });   
    } catch (error){
        logger.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCartQuantity = async (req, res) => {
    const { pid , quantity } = req.body;
    const { cid } = req.params;
    try {
        const response = await Cart.update(cid , pid , quantity);
        // console.log(response);
        res.status(200).json({ message: "cart update", cart: response });
    } catch (error){
        logger.error(error)
        res.status(500).json({ message: "Internal server error" });
    }
}

// export const cartBuy = async (req,res) => {
//     try {
//         const cartId = req.params.cid;
//         const cart = await findById(cartId);
//         if (!cart) {
//             return res.status(404).json({ error: 'Carrito no encontrado' });
//         }
//     // Verificar el stock y actualizar la base de datos si es posible
//     const promises = cart.products.map(async (item) => {      
//         const product = item.product;
//         const requestedQuantity = item.quantity;
        
//         if (product.stock >= requestedQuantity) {
//                 product.stock -= requestedQuantity;
//                 await product.save();
//             // const newCart = await deleteOneProduct(item.product);
//         }  
//         else {
//                 return Promise.reject(`No hay suficiente stock para ${product.title}`);
//         }});
//         // console.log(newCart, "cartttttt");
//     await Promise.all(promises);
//         // Puedes agregar más lógica aquí, como generar el código de compra, calcular el monto total, etc.
//         // Eliminar el carrito después de la compra
//         // await Cart.findByIdAndRemove(cartId);
//     res.json({ success: true, message: 'Compra exitosa' });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Error interno del servidor' });
// }};
export const cartBuy = async (req,res) => {
    try {
        const { cid } = req.params;
        console.log("cid ticket", cid);
        const secretKeyJwt = config.secret_jwt;        
        const cart = await Cart.findCById(cid);  
        console.log("cart ticket",cart);
        const products = cart.products;
        console.log("product ticket",products);
        let availableProducts = [];
        let unavailableProducts = [];
        let totalAmount = 0;
    
        for (let item of products) {
            if (item.product.stock >= item.quantity) {
                // disponible
                availableProducts.push(item);
                item.product.stock -= item.quantity;
                await item.product.save();
                totalAmount += item.quantity * item.product.price;
            } else {
                //no disponible
                unavailableProducts.push(item);
            }
        }    
        logger.info("disponible", availableProducts, "nodisp", unavailableProducts);
        cart.products = unavailableProducts;
        await cart.save();
        // const token = req.cookie.token;
        const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTZlMWFjMjU1YzY4OTdjODNmNDdjZDMiLCJuYW1lIjoiR2FicmllbGEiLCJtYWlsIjoiZ2FieW1hdWp3QGdtYWlsLmNvbSIsInJvbGUiOiJ1c2VyIiwiaWF0IjoxNzAzNzIxMDkwLCJleHAiOjE3MDM3MjQ2OTB9.lKMgvK37iteA4BTGSKa3EXJyBB2ekxqOb7wtEeD7Kho";
        logger.info("token ticket",token);
        const userToken = jwt.verify(token, secretKeyJwt);
        logger.info("userticket", userToken);
        // req.user = userToken;
        // console.log("userCart", req.cookies);
        if (availableProducts.length) {
            const ticket = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: userToken.mail,
            };

            logger.info("ticket", ticket);
            const ticketFinal = await createOneT(ticket);
            // location.reload(true);
            return { availableProducts, totalAmount, ticketFinal };
        }
        return { unavailableProducts };
    } catch (error) {
        logger.error(error)
        res.status(500).json({ error: 'Error interno del servidor' }); 
    }};