import { Router } from "express";
import { usersManager } from "../managers/usersManager.js";
import { jwtValidation } from "../middlewares/jwt.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import passport from "passport";
const router = Router();

router.get(
  "/:idUser",
  passport.authenticate("jwt", { session: false }),
  authMiddleware(["USER"]),
  async (req, res) => {

    const { idUser } = req.params;
    const user = await usersManager.findById(idUser);
    res.json({ message: "User", user });
  }
);

export default router;