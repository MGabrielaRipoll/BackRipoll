import  express  from 'express';
import productRouter from './routes/products.router.js'
import paymentsRouter from './routes/payments.router.js'
import cartRouter from './routes/cart.router.js'
import chatsRouter from './routes/chats.router.js'
import sessionRouter from './routes/session.router.js'
import viewsRouter from "./routes/views.router.js";
import usersRouter from "./routes/user.router.js";
import loggerRouter from "./routes/logger.router.js";
import mockingRouter from "./routes/mockingproducts.router.js"
import cookieRouter from './routes/cookie.router.js'
import cors from "cors"
import { __dirname } from "../src/utils/utils.js"
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { Manager } from './DAL/daos/MongoDB/productManager.mongo.js'
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
// import { Manager } from './dao/fileSystem/ProductManager.js';
import { messagesManager } from "./DAL/daos/MongoDB/messaggeManager.mongo.js";
import "./DB/configDB.js";
import "./passport.js";
import passport from "passport";
import fileStore from "session-file-store";
import { logger } from "../src/utils/logger.js"
import  config  from "../src/config/config.js";
import { swaggerSetup } from "../src/utils/swagger.js";
import swaggerUi from "swagger-ui-express";
import { authMiddleware } from './middlewares/auth.middlewares.js';
import { errorMiddleware } from './middlewares/error.middlewares.js';
const FileStore = fileStore(session);

// const PORT = config.port;
// console.log(PORT);
const app = express();
const URI = config.mongo_uri;
app.use(
    session({
        store: new MongoStore({
            mongoUrl: URI,
        }),
        secret: "secretSession",
        cookie: { maxAge: 60000 },
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"));
app.use('/public', express.static('public'));
app.use(express.static(__dirname + "/public"));
// app.use(authMiddleware);



app.use(passport.initialize());
app.use(passport.session());
app.use(cookieParser());


app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");
app.use('/api/payments', paymentsRouter);
app.use('/api/products', productRouter);
app.use('/api/mockingProducts', mockingRouter);
app.use('/api/cart', cartRouter);
app.use('/api/views', viewsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/session", sessionRouter);
app.use("/api/users", usersRouter);
app.use('/api/chat', chatsRouter);
app.use('/api/loggerTest', loggerRouter);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSetup));


app.use(errorMiddleware);

const httpServer = app.listen(8080, () => {
    logger.info('Escuchando al puerto 8080');
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    logger.info(`Cliente conectado: ${socket.id}`);

    // Manejo de mensajes
    socket.on("newUser", (user) => {
        socket.broadcast.emit("userConnected", user);
        socket.emit("connected");
    });

    socket.on("message", async (infoMessage) => {
        await messagesManager.createOne(infoMessage);
        const allMessages = await messagesManager.findAll();
        socketServer.emit("chat", allMessages);
    });

    try {
        // Manejo de productos (solo si estás utilizando Manager)
        const productosActualizados = await Manager.findAll(objeto);
        logger.info(productosActualizados);
        socketServer.emit('productosActualizados', productosActualizados);

        socket.on('agregado', async (nuevoProducto) => {
            try {
                const products = await Manager.createOne(nuevoProducto);
                const productosActualizados = await Manager.findAll();
                socketServer.emit('productosActualizados', productosActualizados);
            } catch (error) {
                logger.error('Error al agregar el producto:', error);
            }
        });

        socket.on('eliminar', async (id) => {
            try {
                const products = await Manager.deleteOne(id);
                const productosActualizados = await Manager.findAll();
                socketServer.emit('productosActualizados', productosActualizados);
            } catch (error) {
                logger.error('Error al eliminar el producto:', error);
            }
        })
    } catch (error) {
        logger.error("Error de conexión");
    }

    socket.on('disconnect', () => {
        logger.info('Un cliente se ha desconectado.');
    });
});
