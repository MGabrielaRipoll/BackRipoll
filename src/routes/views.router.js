import { Router } from "express";
// import {Manager} from '../dao/fileSystem/ProductManager.js'
import { Manager } from '../dao/MongoDB/productManager.mongo.js'


const router = Router();

router.get("/home", async (req, res) => {
    try {
        const products = await Manager.findAll(req.query);
        const result = products.info.results;
        console.log(result);
        res.render("home", { result });
    } catch {
        error
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
        // const products = await Manager.getProductList();
    res.render("realTimeProducts");
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