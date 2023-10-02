import { Router } from "express";
import {Manager} from '../ProductManager.js'



const router = Router();

router.get("/home", async (req, res) => {
    try {
        const products = await Manager.getProductList();
    res.render("home", { products });
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


export default router;