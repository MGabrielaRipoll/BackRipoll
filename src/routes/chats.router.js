import { Router } from "express";

const router = Router();

router.get("/chat", (req, res) => {
    res.render("chats");
});

export default router;