import passport from "passport";
import { Users } from "../src/dao/MongoDB/usersManager.mongo.js";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { hashData, compareData } from "./utils.js";
import { usersModel } from "../src/DB/Models/users.models.js";

// local

passport.use("signup", new LocalStrategy(
        { passReqToCallback: true, usernameField: "email" },
        async (req, email, password, done) => {
        const { name, lastName } = req.body;
        if (!name || !lastName || !email || !password) {
            return done(null, false);
        }
        try {
            const hashedPassword = await hashData(password);
            const createdUser = await Users.createOne({
            ...req.body,
            password: hashedPassword,
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
            return done(null, false);
        }

        try {
            const user = await Users.findByEmail(email);
            console.log(user);
            if (!user) {
                return done(null, false);
            }
            
            const isPasswordValid = await compareData(password, user.password);
            console.log(isPasswordValid);
            if (!isPasswordValid) {
                return done(null, false);
            }
            
            // La autenticación fue exitosa, se proporciona el usuario autenticado
            return done(null, user);
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
                console.log(profile);
                const userDB = await Users.findByEmail(profile.emails[0].value);
                // login
                console.log(profile._json.email);
                console.log(userDB);
                if (userDB) {
                    if (userDB.isGithub) {
                    return done(null, userDB);
                    } else {
                    return done(null, false);
                    }
                }
                // signup
                const infoUser = {
                    name: profile._json.name.split(" ")[0], 
                    lastName: profile._json.name.split(" ")[1],
                    email: profile.emails[0].value,
                    password: " ",
                    isGithub: true,
                };
                const createdUser = await Users.createOne(infoUser);
                done(null, createdUser);
                } catch (error) {
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
                console.log(profile);
                const userDB = await Users.findByEmail(profile._json.email);
                // login
                console.log(profile._json.email);
                console.log(userDB);
                if (userDB) {
                    if (userDB.isGoogle) {
                    return done(null, userDB);
                    } else {
                    return done(null, false);
                    }
                }
                // signup
                const infoUser = {
                    name: profile._json.given_name,
                    lastName: profile._json.family_name,
                    email: profile._json.email,
                    password: " ",
                    isGoogle: true,
                };
                const createdUser = await Users.createOne(infoUser);
                done(null, createdUser);
                } catch (error) {
                done(error);
                }
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