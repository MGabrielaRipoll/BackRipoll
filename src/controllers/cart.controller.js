import { findAll, findCById, createOne, addProduct, deleteOneProduct, deleteAll, updateCart } from "../service/cart.service.js";
import { findById } from "../service/product.service.js";
import { Cart } from "../DAL/daos/MongoDB/cartsManager.mongo.js";
import { createOneTicket } from "../controllers/ticket.controller.js";
import { generateUniqueCode } from "../utils.js";
import jwt from "jsonwebtoken";
import config from "../config/config.js" 



export const findCartById = async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await findCById(cid);
        ;
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        console.error(error);
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
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    }
}

export const createOneCart = async (req, res) => {
    try {
        const cart = await createOne();
        res.status(201).json({ message: "Cart created", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const addProductCart = async (req, res) => {
    const { cid , pid } = req.params;
    console.log( "cid", cid, "pid", pid);
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
        console.error(error);
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
        res.status(500).json({ message: "Internal server error" });
    }
}

export const updateCartQuantity = async (req, res) => {
    const { pid , quantity } = req.body;
    const { cid } = req.params;
    try {
        const response = await Cart.update(cid , pid , quantity);
        console.log(response);
        res.status(200).json({ message: "cart update", cart: response });
    } catch (error){
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
        const cart = await Cart.findCById(cid).populate("products.product");   
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
        console.log("disponible", availableProducts, "nodisp", unavailableProducts);
        cart.products = unavailableProducts;
        await cart.save();
        const token = req.cookies.token;
        console.log(token);
        const userToken = jwt.verify(token, secretKeyJwt);
        console.log(userToken);
        req.user = userToken;
        // console.log("userCart", req.cookies);
        if (availableProducts.length) {
            const ticket = {
                code: generateUniqueCode(),
                purchase_datetime: new Date(),
                amount: totalAmount,
                purchaser: req.user.email,
            };
            console.log("ticket", ticket);
            await createOneTicket(ticket);
            return { availableProducts, totalAmount };
        }
        return { unavailableProducts };
    } catch (error) {
        
        // res.status(500).json({ error: 'Error interno del servidor' }); 
    }};