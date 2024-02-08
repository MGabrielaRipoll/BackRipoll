import { Router } from "express";
import  config  from "../config/config.js";
import { Users } from "../DAL/daos/MongoDB/usersManager.mongo.js";
import { hashData, compareData } from "../utils/utils.js";
import { generateToken } from "../utils/utils.js";
import { transporter } from "../utils/nodemailer.js"
import jwt from 'jsonwebtoken';


// import { jwtValidation } from "../middlewares/jwt.middlewares.js";
// import { authMiddleware } from "../middlewares/auth.mifflewares.js";
import passport from "passport";
// import pkg from 'jsonwebtoken';

const router = Router();
// const { sign, verify } = pkg;


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
        successRedirect: '/api/views/login',
        failureRedirect: '/api/views/error'
        })(req, res, next)
    });

    
// router.post('/login', (req, res, next) => {
//     passport.authenticate('login', (err, user) => {
//         console.log("user", user);
//         if (user) {
//             return next(err);
//         }
//         if (!user) {
//             return res.redirect('/api/views/signup'); 
//         }
//         const payload = {
//             sub: user._id, 
//             name: user.name,
//             mail : user.email,
//             role: user.role,
//         };
//         // Generar el token JWT
//         const token = generateToken(payload);
//             res.cookie('token', token, { maxAge: 60000, httpOnly: true });
//             return res.redirect('/api/views/home');
//         })(req, res, next);
//     });
    router.post('/login', (req, res, next) => {
        const { email , password } = req.body
        passport.authenticate("login", (err, user) => {
            // console.log("user", req.body, user, req.user, req.cookies.token);
            if (err) {
                return next(err);
            }

            if (!req) {
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
            const carritoUser = user.cartId;
            res.cookie('cartId', carritoUser, { maxAge: 60000, httpOnly: true });
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
    // console.log(req.user);
    const payload = {
        sub: req.user._id, 
        name: req.user.name,
        mail : req.user.email,
        role: req.user.role,
    };
    // Generar el token JWT
    const token = generateToken(payload);
    res.cookie('token', token, { maxAge: 60000, httpOnly: true });
    const carritoUser = req.user.cartId;
    res.cookie('cartId', carritoUser, { maxAge: 60000, httpOnly: true });
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
        // console.log(req.user);
        const payload = {
            sub: req.user._id, 
            name: req.user.name,
            mail : req.user.email,
            role: req.user.role,
        };
        // Generar el token JWT
        const token = generateToken(payload);
        res.cookie('token', token, { maxAge: 60000, httpOnly: true });
        const carritoUser = req.user.cartId;
        res.cookie('cartId', carritoUser, { maxAge: 60000, httpOnly: true });
        res.redirect("/api/views/home");
    }
);
// signuot con session
// router.get("/signout", (req, res) => {
//     req.session.destroy(() => {
//         res.redirect("/api/views/login");
//     });
// });

router.get("/signout", (req, res) => {
    res.clearCookie('token');
    res.redirect("/api/views/login");
});

router.post("/restaurarviamail", async (req, res) => {
    const { email } = req.body;

    try {
        const user = await Users.findByEmail(email);

        if (!user) {
            return res.redirect("/api/session/signup");
        }
        const token = jwt.sign({ email }, config.secret_jwt, { expiresIn: '1h' }); // Token válido por 1 hora

        await transporter.sendMail({
            from: "mariagabriela.ripoll@gmail.com",
            to: email,
            subject: "Recuperacion de contraseña",
            html: `<b>Por favor haga clic en el siguiente link para restablecer su contraseña http://localhost:8080/api/views/restaurar?token=${token} </b>`,
        });

        res.status(200).json({ success: 'Mail enviado con éxito' });
    } catch (error) {
        console.error("Error al enviar el correo:", error);
        res.status(500).json({ error: 'Hubo un error interno en el servidor.' });
    }
});

// router.post("/restaurar", async (req, res) => {
//     const { email, password } = req.body;
//     if (!email && !password){
//         return res.status(400).json({ error: 'All fields are required' });
//     }
//     try {
//         const tokenHeader = req.headers.authorization;
//         if (tokenHeader && typeof tokenHeader === 'string') {
//             const tokenArray = tokenHeader.split(" ");
//             if (tokenArray.length === 2) {
//                 const token = tokenArray[1];
//                 console.log("Token por fin:", token);
//                 if (!token) {
//                     return res.status(400).json({ error: 'Falta el token en el enlace.' });
//                 }
//             }}
//         const decoded = jwt.verify(token, secretKey);
//         const timestampInSeconds = decoded.iat;
//         const currentTimeInSeconds = Math.floor(Date.now() / 1000);
//         const expirationTimeInSeconds = timestampInSeconds + 60 * 60; 
//         if (currentTimeInSeconds > expirationTimeInSeconds) {
//             return res.status(403).json({ error: 'El enlace ha caducado.' });
//         }

//         const user = await Users.findByEmail(email);
//         if (!user) {

//             return res.redirect("/api/session/signup");
//         }
//         const hashedPassword = await hashData(password);
//         user.password = hashedPassword;
//         await user.save();
        
//         res.redirect("/api/views/login")
//         // res.status(200).json({ message: "Password updated" });
//         } catch (error) {
//         res.status(500).json({  error: 'Hubo un error interno en el servidor.' });
//     }
// });

router.post("/restaurar", async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // const tokenHeader = req.headers.authorization;
        // console.log(tokenHeader, typeof tokenHeader, "whatsss");

        // if (!tokenHeader || typeof tokenHeader !== 'string') {
        //     return res.status(400).json({ error: 'Falta el token en el enlace.' });
        // }

        // const tokenArray = tokenHeader.split(" ");

        // if (tokenArray.length !== 2) {
        //     return res.status(400).json({ error: 'Formato de token inválido.' });
        // }

        // const token = tokenArray[1];
        // console.log("Token:", token);
        const token = req.cookies.tokenRest;
        console.log("qu onda", token);
        const decoded = jwt.verify(token, config.secret_jwt);
        console.log("decoded", decoded, decoded.iat);

        const timestampInSeconds = decoded.iat;
        const currentTimeInSeconds = Math.floor(Date.now() / 1000);
        const expirationTimeInSeconds = timestampInSeconds + 60 * 60;
        console.log("oooo", currentTimeInSeconds > expirationTimeInSeconds);
        if (currentTimeInSeconds > expirationTimeInSeconds) {
            return res.status(403).json({ error: 'El enlace ha caducado.' });
        }

        const user = await Users.findByEmail(email);

        if (!user) {
            return res.redirect("/api/session/signup");
        }

        const hashedPassword = await hashData(password);
        user.password = hashedPassword;
        await user.save();

        res.redirect("/api/views/login");
        // res.status(200).json({ message: "Password updated" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Hubo un error interno en el servidor.' });
    }
});


router.get('/current', passport.authenticate('current', {session: false}), async(req, res) => {
    res.status(200).json({message: 'User logged', user: req.user})  
})

export default router;