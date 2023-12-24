import { authMiddleware } from '../middlewares/auth.middlewares.js';
import { Router } from 'express';
import { findCartById, findAllCart, addProductCart, createOneCart, cartBuy, deleteOneProdCart, deleteOneCartAll, updateCartQuantity } from '../controllers/cart.controller.js';


const router = Router();

router.get("/", findAllCart)
router.post("/",authMiddleware(["user"]),  createOneCart)
router.get("/:cid", findCartById)
router.get("/:cid/purchase", cartBuy)
router.put("/:cid/products/:pid",authMiddleware(["user"]),  updateCartQuantity)
router.post("/:cid/products/:pid",authMiddleware(["user"]), addProductCart)
router.delete("/:cid/products/:pid",authMiddleware(["user"]), deleteOneProdCart)
router.delete("/:cid",authMiddleware(["user"]),  deleteOneCartAll)

export default router;