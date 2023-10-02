import  express  from 'express';
import productRouter from './routes/products.router.js'
import cartRouter from './routes/cart.router.js'
import viewsRouter from "./routes/views.router.js";
import { __dirname } from "./utils.js";
import { engine } from "express-handlebars";




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



app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
});