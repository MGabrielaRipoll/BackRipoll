
import { Router } from 'express';
// import { Cart } from '../dao/fileSystem/cartsManager.js';
import { Cart } from '../dao/MongoDB/cartsManager.mongo.js'

const router = Router();

router.get("/", async (req, res) => {
    try {
        const carts = await Cart.findAll();

        if (!carts || carts.length === 0) {
            return res.status(404).json({ message: "No carts found" });
        }

        res.status(200).json({ message: "Carts found", carts });
    } catch (error) {
        console.error(error); // Log the error for debugging
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/", async (req, res) => {
    try {
        const cart = await Cart.createOne();
        res.status(201).json({ message: "Cart created", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.get("/:cid", async (req, res) => {
    const { cid } = req.params;

    try {
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const response = await Cart.addProductToCart(cid,pid);
        res.status(200).json({ message: "Product added to cart", cart: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

export default router;
