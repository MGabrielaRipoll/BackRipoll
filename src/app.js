import  express  from 'express';
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import chatsRouter from './routes/chats.router.js'
import sessionsRouter from './routes/session.router.js'
import viewsRouter from "./routes/views.router.js";
import cookieRouter from './routes/cookie.router.js'
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
import { Manager } from './dao/MongoDB/productManager.mongo.js'
import session from "express-session";
import cookieParser from "cookie-parser";
import MongoStore from "connect-mongo";
// import { Manager } from './dao/fileSystem/ProductManager.js';
import { messagesManager } from "./dao/MongoDB/messaggeManager.mongo.js";
import "./DB/configDB.js";
import fileStore from "session-file-store";
const FileStore = fileStore(session);


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser("SecretCookie"));
app.use('/public', express.static('public'));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use('/api/products', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/views', viewsRouter);
app.use("/api/cookie", cookieRouter);
app.use("/api/sessions", sessionsRouter);
app.use('/api/chat', chatsRouter);

const URI =
"mongodb+srv://gabymaujw:Salmo374@cluster0.bs3x8cw.mongodb.net/ecommerce?retryWrites=true&w=majority";

app.use(
    session({
        resave: false,
        saveUninitialized: false,
        store: new MongoStore({
        mongoUrl: URI,
        }),
        secret: "secretSession",
        cookie: { maxAge: 60000 },
    })
);


const httpServer = app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", async (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);

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
        console.log(productosActualizados);
        socketServer.emit('productosActualizados', productosActualizados);

        socket.on('agregado', async (nuevoProducto) => {
            try {
                const products = await Manager.createOne(nuevoProducto);
                const productosActualizados = await Manager.findAll();
                socketServer.emit('productosActualizados', productosActualizados);
            } catch (error) {
                console.error('Error al agregar el producto:', error);
            }
        });

        socket.on('eliminar', async (id) => {
            try {
                const products = await Manager.deleteOne(id);
                const productosActualizados = await Manager.findAll();
                socketServer.emit('productosActualizados', productosActualizados);
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        })
    } catch (error) {
        console.error("Error de conexión");
    }

    socket.on('disconnect', () => {
        console.log('Un cliente se ha desconectado.');
    });
});
