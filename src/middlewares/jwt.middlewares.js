import jwt from "jsonwebtoken";
const SECRET_KEY_JWT = "secretJWT";


export const jwtValidation = (req, res, next) => {
    try {
        console.log(req);
        const token = req.cookies.token;
        const userToken = jwt.verify(token, SECRET_KEY_JWT);
        req.user = userToken;
        next();
    } catch (error) {
        res.json({ error: error.message });
    }
};