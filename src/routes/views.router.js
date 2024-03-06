import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middlewares.js';
import jwt from "jsonwebtoken";
// import {Manager} from '../dao/fileSystem/ProductManager.js'
import { Manager } from '../DAL/daos/MongoDB/productManager.mongo.js'
import { Cart } from '../DAL/daos/MongoDB/cartsManager.mongo.js'
import { Users } from '../DAL/daos/MongoDB/usersManager.mongo.js'
import { Cookie } from "express-session";
import passport from "passport";
import cookieParser from 'cookie-parser';
import { generateProduct } from "../faker.js";
import config from "../config/config.js";
import { paginate } from "mongoose-paginate-v2";
import path from 'path';
// import { log } from "console";
import { oldUsers } from "../controllers/users.controller.js";
import { Ticket } from "../DAL/daos/MongoDB/ticketManager.mongo.js";



const router = Router();

router.get("/home", passport.authenticate('current', { session: false }), async (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/api/views/login");
    }
    // console.log(req.user);
    try {
        const products = await Manager.findAll(req.query);
        const { limit  } = req.params;
        const productsFinal = products.info.results;
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const {pages, nextPage, prevPage}  = products.info;
        const sort = req.query.orders;
        const cart = await Cart.findCById(req.user.cartId)
        const foto = req.user.avatar.map(item => item.reference);
        const avatar = foto.map(foto => path.basename(foto));
        // console.log(clonedProducts, "probando");
        res.render("home",  { avatar : avatar, cartId: req.user.cartId, uid: req.user.id, quantity: cart.totalProducts, user: req.user, name: req.user.name, email : req.user.email, products: result, sort: sort, pages : pages, limit:limit, nextPage: nextPage,  prevPage: prevPage, style: "product" } );
    } catch (error) {
        // console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});


router.get("/login", (req, res) => {
    // console.log("cookies", req.cookies.token);
        if (req.cookies.token) {    
            return res.redirect("/home", { style:"product" });
        }
    res.render("login", { style:"product" });
});

router.get("/signup", async (req, res) => {
    if (req.session.user) {    
        return res.redirect("/login", { style:"product" })    
    } 
    res.render("signup", { style:"product" })
});

router.get("/restaurarviamail", (req,res) => {
    const token = jwt.sign({}, config.secret_jwt);
    res.render("restaurarviamail", { token: token, style:"product"});
});

router.get("/restaurar", (req, res) => {
    const { token } = req.query;
    res.cookie('tokenRest', token);
    res.render("restaurar", {  token: token, style:"product" });
});

router.get("/users/:uid", (req, res) => {
    const { uid } = req.params;
    res.render("usersPerfil", { uid: uid, style: "product" });
});

router.get("/users", passport.authenticate("current", {session:false}), authMiddleware(["admin"]),  async (req, res) => {
    const users = await Users.findAll();

    const clonedUsers = users.map(user => Object.assign({}, user._doc));
    res.render("usersAll", { users: clonedUsers, style: "product" });
});

router.get("/userOld",  async (req, res) => {
    const users = await oldUsers();
    const users1 = JSON.stringify(users);
    const clonedUsers = users.map(user => Object.assign({}, user._doc));
    res.render("userOld", { users: clonedUsers, users1: users1, style: "product" });
});

router.get("/error", (req, res) => {
    res.render("error", {style:"product"});
});

router.get("/adminUsers/:uid", async (req, res) => {
    const { uid } = req.params;
    const user = await Users.findById(uid);
    res.render("adminUsers", {email: user.email, role: user.role, id: user._id, style:"product"});
});

router.get('/carts/:cartId', async (req, res) => {
    const { cartId } = req.params;
    try {
        const cart = await Cart.findCById(cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        const cartProducts = cart.products.map(doc => doc.toObject());
        res.render('carts', {  token:req.cookies.token, cartId : cartId, products:cartProducts, style:"product" });
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
router.get('/purchase', async (req, res) => {
    try {
        const secretKeyJwt = config.secret_jwt; 
        const ticket = req.cookies.ticketId;       
        const ticketDecod = await Ticket.findById(ticket);
        res.render ("ticket", { comprador : ticketDecod.purchaser, code : ticketDecod.code , style : "product"});
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }});


router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        const cartId = req.cookies.cartId;
        const productFound = await Manager.findById(pid);
        const cart = await Cart.findCById(cartId);
        if (!productFound) {
            return res.status(404).send('Producto no encontrado');
        }
        const clonedProduct = Object.assign({}, productFound);
        res.render("productDetail", {cartId: cartId, quantity: cart.totalProducts,  pid: pid, product: clonedProduct, style: "product" });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});


router.get("/changeproducts", async (req, res) => {
    try {
    res.render("changeproducts");
    } catch {
        error
    }
});



router.get("/realTimeProducts", authMiddleware(["admin" , "premium"]), async (req, res) => {
    try {
        const products = await Manager.findAll({});
        const clonedProduct = products.docs.map(doc => doc.toObject());
        res.render("realTimeProducts", { products: clonedProduct, token: req.cookies.token, style: "product" });
    } catch (error) {
        res.status(500).send("Internal Server Error");
    }
});
router.get("/ticket", async(req,res)=>{
    const ticketFound = findticketById(req.cookies.ticketId);
    res.render("ticket", {ticket:ticketFound})
})
router.get("/chat", async (req, res) => {
    try {
        res.render("chats");
    } catch {
        error
    }
});
router.get("/mockingProducts", (req, res) => {
    const products = [];
    for (let i = 0; i < 100; i++) {
        const product = generateProduct();
        products.push(product);
    }
    res.render("mockingProducts", {products:products,style:"product"});
});
export default router;