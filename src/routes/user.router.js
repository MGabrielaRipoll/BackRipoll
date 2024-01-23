import { Router } from "express";

import {  findUserById, findUserByEmail, createUser, updateUserNow } from "../controllers/users.controller.js";
const router = Router();

router.get(
  "/:idUser", findUserById
);
router.put("/premium/:uid", updateUserNow);


export default router;