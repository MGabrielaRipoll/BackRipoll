// import  dotenv  from "dotenv";

// dotenv.config()

// export default {
//     port: process.env.PORT,
//     mongo_uri: process.env.MONGO_URI,
//     secret_jwt: process.env.SECRET_KEY_JW,
// }
import dotenv from "dotenv";

dotenv.config();

export default {
    // port: process.env.PORT,
    mongo_uri: process.env.MONGO_URI,
    secret_jwt: process.env.SECRET_KEY_JWT,
    environment: process.env.ENVIRONMENT,
    gmail_user: process.env.GMAIL_USER,
    gmail_password: process.env.GMAIL_PASSWORD,
    stripe_secret_key: process.env.REACT_APP_STRIPE_KEY,
};
