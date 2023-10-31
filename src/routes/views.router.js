import { Router } from "express";
// import {Manager} from '../dao/fileSystem/ProductManager.js'
import { Manager } from '../dao/MongoDB/productManager.mongo.js'
import { paginate } from "mongoose-paginate-v2";


const router = Router();

router.get("/home", async (req, res) => {
    try {
        const products = await Manager.findAll(req.query);
        const productsFinal = products.info.results;
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const paginate = products.info.pages;
        const sort = req.query.orders;
        console.log(result);
        res.render("home", { products: result, paginate: paginate, sort: sort });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});



router.get("/changeproducts", async (req, res) => {
    try {
        // const products = await Manager.getProductList();
    res.render("changeproducts");
    } catch {
        error
    }
});

router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await Manager.findAll();
        res.render("realTimeProducts", products);
    } catch {
        error
    }
});
router.get("/chat", async (req, res) => {
    try {
        // const products = await Manager.getProductList();
    res.render("chats");
    } catch {
        error
    }
});

export default router;