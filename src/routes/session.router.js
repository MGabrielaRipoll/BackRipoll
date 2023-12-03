import { Router } from "express";
import { Users } from "../dao/MongoDB/usersManager.mongo.js";
import { hashData, compareData } from "../utils.js";
import { generateToken } from "../utils.js";

// import { jwtValidation } from "../middlewares/jwt.middlewares.js";
// import { authMiddleware } from "../middlewares/auth.mifflewares.js";
import passport from "passport";

const router = Router();

// router.post("/signup", async (req, res) => {
//     const { name, lastName , email, password } = req.body;
//     if (!name || !lastName || !email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     try {
//         const createdUser = await Users.createOne(req.body);
//         res.redirect("/api/views/login");
//         // res.status(200).json({ message: "User created", user: createdUser });
//     } catch (error) {
//         res.status(500).json({ error });
//     }
//     });

// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     console.log(req.body);
//     if (!email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     try {
//         const user = await Users.findByEmail(email);
//         console.log(user);
//         if (!user) {
//         return res.redirect("/api/views/signup");
//         }
//         const isPasswordValid = password === user.password;
//         if (!isPasswordValid) {
//         return res.status(401).json({ message: "Password is not valid" });
//         }
//         let sessionInfo;
//         if (email === "adminCoder@coder.com" && password === "adminCod3r123") {
//             sessionInfo =  { email: email, name: user.name, isAdmin: true }
//             req.session.user = sessionInfo;
//             res.redirect("/api/views/realTimeProducts");

//         } else {
//             sessionInfo = { email: email , name: user.name, isAdmin: false }
//             req.session.user = sessionInfo;
//             res.redirect("/api/views/home");

//         };
//         // req.session.user = sessionInfo;
//         // res.redirect("/api/views/home");
//     } catch (error) {
//         res.status(500).json({ error });
//     }
// });
// router.get(
//     "/:idUser",
//     //jwtValidation,
//     passport.authenticate("jwt", { session: false }),
//     authMiddleware(["USER"]),
//     async (req, res) => {
//       console.log("Passport jwt");
//       const { idUser } = req.params;
//       const user = await usersManager.findById(idUser);
//       res.json({ message: "User", user });
//     }
//   );
router.post("/signup",(req, res, next)=>{ passport.authenticate("signup", {
        successRedirect: '/api/views/home',
        failureRedirect: '/api/views/login'
        })(req, res, next)
    });

    router.post('/login', (req, res, next) => {
        passport.authenticate('login', (err, user) => {
            if (err) {
                return next(err);
            }
            if (!user) {
                return res.redirect('/api/views/signup'); 
            }
            const payload = {
                sub: user._id, 
                name: user.name,
                mail : user.email,
                role: user.role,
            };
            // Generar el token JWT
            const token = generateToken(payload);
            res.cookie('token', token, { maxAge: 60000, httpOnly: true });
            return res.redirect('/api/views/home');
        })(req, res, next);
    });
    




// router.post("/login", async (req, res) => {
//     const { email, password } = req.body;
//     console.log(req.body);
//     if (!email || !password) {
//         return res.status(400).json({ message: "All fields are required" });
//     }
//     try {
//         const user = await usersManager.findByEmail(email);
//         if (!user) {
//             return res.redirect("/signup");
//         }
//         const isPasswordValid = await compareData(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ message: "Password is not valid" });
//         }
//         console.log(user);
//         // const { name, lastName, role } = user;
//         // console.log(user);
//         const token = generateToken({ user });
//         res.cookie("token", token, { maxAge: 60000, httpOnly: true }).send("Welcome");
//         res
//             .status(200)
//             .cookie("token", token, { httpOnly: true })
//             .json({ message: "Bienvenido", token });
//             console.log(token);
//         } catch (error) {
        
//         res.status(500).json({ error });
//     }
// });

//   GIT HUB

router.get("/auth/github", passport.authenticate("github", { 
    scope: ["user:email"] })
);

router.get("/callback", passport.authenticate("github"), (req, res) => {
    res.redirect("/api/views/home");
});

// GOOGLE

router.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
    "/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/api/views/error" }),
    (req, res) => {
        console.log(req);
        res.redirect("/api/views/home");
    }
);

router.get("/signout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/api/views/login");
    });
});

router.post("/restaurar", async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await Users.findByEmail(email);
        if (!user) {

            return res.redirect("/api/session/signup");
        }
        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();
        
        res.redirect("/api/views/login")
        // res.status(200).json({ message: "Password updated" });
        } catch (error) {
        res.status(500).json({ error });
    }
});

router.get('/current', passport.authenticate('current', {session: false}), async(req, res) => {
    res.status(200).json({message: 'User logged', user: req.user})  
})

export default router;