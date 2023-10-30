
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

router.put("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    const { quantity } = req.body;
    try {
        const response = await Cart.update(cid,pid, quantity);
        res.status(200).json({ message: "Update to cart", cart: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});

router.post("/:cid/products/:pid", async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const response = await Cart.addProductToCart(cid,pid);
        res.status(200).json({ message: "Product added to cart", cart: response });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
});
router.delete("/:cid/products/:pid", async (req,res) => {
    try {
        const { cid, pid } = req.params;
        const response = await Cart.deleteOne(cid,pid);
        res.status(200).json({ message: "Product delete to cart", cart: response });
    
    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
});
router.put("/:cid", async (req,res) => {
    const { pid , quantity } = req.body;
    const { cid } = req.params;
    try {
        const response = await Cart.update(cid , pid , quantity);
        console.log(response);
        res.status(200).json({ message: "cart update", cart: response });
    
    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
});
router.delete("/:cid", async (req,res) => {
    try {
        const { cid } = req.params;
        const response = await Cart.deleteAll(cid);
        res.status(200).json({ message: "Cart delette", cart: response });   
    } catch (error){
        res.status(500).json({ message: "Internal server error" });
    }
});
export default router;