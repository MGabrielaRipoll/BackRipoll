import passport from "passport";
import { logger } from "../src/utils/logger.js"
import { Users } from "../src/DAL/daos/MongoDB/usersManager.mongo.js";
import { Cart } from '../src/DAL/daos/MongoDB/cartsManager.mongo.js'
import { ExtractJwt, Strategy as JWTStrategy } from "passport-jwt";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { hashData, compareData } from "../src/utils/utils.js";
import UsersResponse from "./DAL/dtos/users-response.dto.js";

import config from "../src/config/config.js";
// local

const secretKeyJwt = config.secret_jwt;
// console.log(config.secret_jwt);
passport.use("signup", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
        const { name, lastName } = req.body;
        if (!name || !lastName || !email || !password) {
            return done(null, false, {message: 'All fields are required'});
        }
        
        const cart = await Cart.createOne();
        
        try {
            const hashedPassword = await hashData(password);
            const createdUser = await Users.createOne({
            ...req.body,
            password: hashedPassword,
            cartId : cart._id,
            });
            done(null, createdUser);
        } catch (error) {
            done(error);
        }
        }
    )
);

// passport.use("login", new LocalStrategy(
//     { usernameField: "email" },
//     async (email, password, done) => {
//         console.log(email, password);
//     if (!email || !password) {
//         done(null, false);
//     }
//     try {
//         const user = await Users.findByEmail(email);
//         if (!user) {
//             done(null, false);
//         }

//         const isPasswordValid = await compareData(password, user.password);
//         if (!isPasswordValid) {
//             return done(null, false);
//         }
//         // const sessionInfo =
//         //     email === "adminCoder@coder.com"
//         //     ? { email, first_name: user.first_name, isAdmin: true }
//         //     : { email, first_name: user.first_name, isAdmin: false };
//         // req.session.user = sessionInfo;
//         done(null, user);
//     } catch (error) {
//         done(error);
//     }
//     }
// )
// );

passport.use("login", new LocalStrategy(
    { usernameField: "email" },
    async (email, password, done) => {
        const req = this;
        if (!email || !password) {
            return done(null, false, { message: "Email and password are required" });
        }
        try {
            const user = await Users.findByEmail(email);
            if (!user) {
                return done(null, false, { message: "User not found" });
            }
            
            const isPasswordValid = await compareData(password, user.password);
            if (!isPasswordValid) {
                return done(null, false, { message: "Invalid password" });
            }
            const userDate = await Users.updateOne(
                { _id: user.id },
                { last_connection: new Date() } 
            );
            // console.log("user passport", user);
            const userLogin = await Users.findById(user.id);
            return done(null, userLogin);
        } catch (error) {
            return done(error); // Devuelve el error a Passport
        }
    }
));


// github
passport.use("github", 
    new GithubStrategy (
        {
        clientID: "Iv1.6148d02ed6d375ee",
        clientSecret: "1050e5c6c7ff19340244b04987a39b4637cd3073",
        callbackURL: "http://localhost:8080/api/session/callback",
        scope: ["user:email"],
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                
                const userDB = await Users.findByEmail(profile.emails[0].value);
                // login
                if (userDB) {
                    return done(null, userDB);
                    } 
                const cart = await Cart.createOne();
                // signup
                const infoUser = {
                    name: profile._json.name.split(" ")[0], 
                    lastName: profile._json.name.split(" ")[1],
                    email: profile.emails[0].value,
                    password: " ",
                    cartId: cart._id,
                };
                logger.info(infoUser);
                const createdUser = await Users.createOne(infoUser);
                done(null, createdUser);
                } catch (error) {
                    logger.error("created fail")
                    done(error);
                }
        }
    )
);
// GOOGLE

passport.use("google", 
    new GoogleStrategy (
        {
        clientID: "852727672259-33v3qr9j5aq8gvbsatg6coptnlao3bs8.apps.googleusercontent.com",
        clientSecret: "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",
        callbackURL: "http://localhost:8080/api/session/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {

                const userDB = await Users.findByEmail(profile._json.email);
                // login
             
                if (userDB) {
                    return done(null, userDB);
                    } 
                // signup
                const cart = await Cart.createOne();

                const infoUser = {
                    name: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile._json.email,
                    password: " ",
                    cartId: cart._id,                };
                const createdUser = await Users.createOne(infoUser);
                done(null, createdUser);
                } catch (error) {
                done(error);
                }
        }
    )
);
const fromCookies = (req) => {
    return req.cookies.token;
}
passport.use('current', new JWTStrategy({
    jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
    secretOrKey: secretKeyJwt,
}, async (jwt_payload, done) => {
    try {
        // console.log(jwt_payload);
        const user = await Users.findByEmail(jwt_payload.mail);

        // console.log(user);
        if (!user) {
            return done(null, false, { message: 'Usuario no encontrado' });
        }
        const userDTO =  new UsersResponse(user)
        return done(null, userDTO);}
            catch (error) {
                return error
            }
}));

passport.use(
    "jwt",
    new JWTStrategy(
    {
        //jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        jwtFromRequest: ExtractJwt.fromExtractors([fromCookies]),
        secretOrKey: secretKeyJwt,
    },
    async function (jwt_payload, done) {
        // console.log(jwt_payload);
        done(null, jwt_payload);
    }
    )
);

passport.serializeUser((user, done) => {
  // _id
    done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await Users.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});


