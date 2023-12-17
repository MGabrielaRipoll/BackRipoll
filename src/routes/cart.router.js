
import { Router } from 'express';
import { findCartById, findAllCart, addProductCart, createOneCart, deleteOneProdCart, deleteOneCartAll, updateCartQuantity } from '../controllers/cart.controller.js';


const router = Router();

router.get("/", findAllCart)
router.post("/", createOneCart)
router.get("/:cid", findCartById)
router.put("/:cid/products/:pid", updateCartQuantity)
router.post("/:cid/products/:pid",addProductCart)
router.delete("/:cid/products/:pid",deleteOneProdCart)
router.delete("/:cid", deleteOneCartAll)

export default router;