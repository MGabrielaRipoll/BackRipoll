import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middlewares.js';


const router = Router();

router.get("/chat", authMiddleware(["user"]), (req, res) => {
    res.render("chats");
});

export default router;