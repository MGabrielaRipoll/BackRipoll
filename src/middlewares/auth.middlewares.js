

// export const authMiddleware = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return res.status(403).json("Not authorized");
//     }
//     next();
//   };
// };

export const authMiddleware = (roles) => {
    return (req, res, next) => {
        if (roles.includes("ADMIN")) {
            return next();
        }
        if (!roles.includes(req.user.role)) {
            return res.status(403).json("Not authorized");
        }
        next();
    };
  };