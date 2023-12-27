import jwt from "jsonwebtoken";
import config from "../config/config.js" 


const secretKeyJwt = config.secret_jwt;



export const authMiddleware = (roles) => {
    return (req, res, next) => {
        const token = req.cookies.token;
        const userToken = jwt.verify(token, secretKeyJwt);
        req.user = userToken;
        console.log(req.user);
        if (roles.includes(req.user.role)) {
            return next();
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json("Not authorized");
        }
        next();
    };
};

