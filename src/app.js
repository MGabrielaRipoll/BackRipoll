import  express  from 'express';
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import chatsRouter from './routes/chats.router.js'
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { Server } from "socket.io";
import { engine } from "express-handlebars";
// import { Manager } from './dao/fileSystem/ProductManager.js';
import { messagesManager } from "./dao/MongoDB/messaggeManager.mongo.js";
import "./DB/configDB.js";


const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

app.engine("handlebars", engine());
app.set("views", __dirname + "/views");
app.set("view engine", "handlebars");

app.use('/api/products', productRouter)
app.use('/api/cart', cartRouter)
app.use("/api/views", viewsRouter);
app.use("/api/chat", chatsRouter);


const httpServer = app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
});

const socketServer = new Server(httpServer);

socketServer.on("connection", (socket) => {
    console.log(`Cliente conectado: ${socket.id}`);
    socket.on("newUser", (user) => {
        socket.broadcast.emit("userConnected", user);
        socket.emit("connected");
    });
    socket.on("message", async(infoMessage) => {
        await messagesManager.createOne(infoMessage);
        const allMessages = await messagesManager.findAll()
        socketServer.emit("chat", allMessages);
    });
});

// socketServer.on('connection', async (socket) => {
//     try {
//         const productosActualizados = await Manager.getProductList();
//         socketServer.emit('productosActualizados', productosActualizados);
//         console.log('Un cliente se ha conectado.');

//         socket.on('agregado', async (nuevoProducto) => {
//             try {
//                 const products = await Manager.addProduct(nuevoProducto);
//                 const productosActualizados = await Manager.getProductList();
//                 console.log(productosActualizados);

//                 socketServer.emit('productosActualizados', productosActualizados);
//             } catch (error) {
//                 console.error('Error al agregar el producto:', error);
//             }
//         });

//         socket.on('eliminar', async (id) => {
//             try {
//                 const products = await Manager.deleteProductById(id);
//                 const productosActualizados = await Manager.getProductList();
//                 console.log(productosActualizados);
            
//                 socketServer.emit('productosActualizados', productosActualizados);
//             } catch (error) {
//                 console.error('Error al eliminar el producto:', error);
//             }
//     })  
   
    // socket.on('disconnect', () => {
    //     console.log('Un cliente se ha desconectado.');
    // })
    //         catch (error) {
    //             console.error ("error de conexion")
    //         }

