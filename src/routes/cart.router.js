

import { Router } from 'express';
import { Cart } from '../carts.js';

const router = Router();

// Ruta para  crear un carrito

router.post("/", async (req,res) => {
    const { pid } = req.body
    try {
        const cart = await Cart.crearCart( +pid );
        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
})

// Ruta para obtener un carrito por su ID
router.get("/:cid", async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await Cart.getCartById(+cid);

        if (!cart) {
        return res.status(404).json({ message: "Cart not found with the provided ID" });
        }

        res.status(200).json({ message: "Cart found", cart });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Ruta para agregar un producto al carrito
router.post("/:cid/product/:pid", async (req, res) => {
    const { cid, pid } = req.params;

    try {
        const response = await Cart.addProductCart(+cid, +pid);
        res.status(200).json({ message: "Product added", cart: response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;
