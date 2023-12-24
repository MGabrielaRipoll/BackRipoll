



export const authMiddleware = (roles) => {
    return (req, res, next) => {
        const { user } = req;
       
        if (roles.includes(req.user.role)) {
            return next();
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json("Not authorized");
        }
        next();
    };
};

