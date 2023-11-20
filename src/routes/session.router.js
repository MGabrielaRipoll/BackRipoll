import { Router } from "express";
import { Users } from "../dao/MongoDB/usersManager.mongo.js";
import { hashData, compareData } from "../utils.js";
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

router.post("/signup",(req, res, next)=>{ passport.authenticate("signup", {
        successRedirect: '/api/views/home',
        failureRedirect: '/api/views/error'
        })(req, res, next)
    });
    
router.post('/login', (req, res, next) => {
    passport.authenticate('login', { // Asegúrate de que 'req' esté disponible aquí
        successRedirect: '/api/views/home',
        failureRedirect: '/api/views/error'
    })(req, res, next);
});
    

//   GIT HUB

router.get("/auth/github", passport.authenticate("github", { 
    scope: ["user:email"] })
);

router.get("/callback", passport.authenticate("github"), (req, res) => {
    res.redirect("/api/views/home");
});

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


export default router;