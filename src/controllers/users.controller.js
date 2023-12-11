import { findByEmail, findById, createOne } from "../services/user.service.js";
import { jwtValidation } from "../middlewares/jwt.middlewares.js";
import { authMiddleware } from "../middlewares/auth.middlewares.js";
import passport from "passport";


export const findUserById = (req, res) => {
    passport.authenticate("jwt", { session: false }),
    authMiddleware(["USER"]),
    async (req, res) => {
        const { idUser } = req.params;
        const user = await findById(idUser);
        if (!user) {
                return res.status(404).json({ message: "No User found with the id" });
            }
        res.json({ message: "User", user });
}};

export const findUserByEmail = async (req, res) => {
    const { UserEmail } = req.body;
    const user = await findByEmail(UserEmail);
    if (!user) {
        return res.status(404).json({ message: "No User found with the id" });
    }
    res.status(200).json({ message: "User found", user });
};

export const createUser =  async (req, res) => {
    const { name, lastName, email, password } = req.body;
    if (!name || !lastName || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const createdUser = await createOne(req.body);
    res.status(200).json({ message: "User created", user: createdUser });
};