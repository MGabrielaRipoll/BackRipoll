import { Router } from "express";
import { authMiddleware } from '../middlewares/auth.middlewares.js';

// import {Manager} from '../dao/fileSystem/ProductManager.js'
import { Manager } from '../DAL/daos/MongoDB/productManager.mongo.js'
import { Cart } from '../DAL/daos/MongoDB/cartsManager.mongo.js'
import { Users } from '../DAL/daos/MongoDB/usersManager.mongo.js'
import { Cookie } from "express-session";
import passport from "passport";
import cookieParser from 'cookie-parser';
import { generateProduct } from "../faker.js";


// import { paginate } from "mongoose-paginate-v2";


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
        // console.log("productos... ",products.info);
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const {pages, nextPage, prevPage}  = products.info;
        const sort = req.query.orders;
        const cart = await Cart.findCById(req.user.cartId)

        res.render("home",  { cartId: req.user.cartId, quantity: cart.totalProducts, user: req.user, name: req.user.name, email : req.user.email, products: result, sort: sort, pages : pages, limit:limit, nextPage: nextPage,  prevPage: prevPage, style: "product" } );
    } catch (error) {
        // console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});
// router.get("/home", async (req, res) => {

//     if (!req.cookies.token) {
//         return res.redirect("/api/views/login");
//     }
    
//     console.log(req.user);
//     try {
//         const products = await Manager.findAll(req.query);
//         const productsFinal = products.info.results;
//         const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
//         const result = clonedProducts;
//         const paginate = products.info.pages;
//         const sort = req.query.orders;
//         res.render("home",  { cartId: req.user.cartId, user: req.user, name: req.user.name, email : req.user.email, products: result, paginate: paginate, sort: sort, style:"product"} );
//     } catch (error) {
//         console.error(error);
//         res.status(500).send("Error interno del servidor");
//     }
// });

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

router.get("/restaurar", (req, res) => {
    res.render("restaurar", { style:"product" });
});

router.get("/error", (req, res) => {
    res.render("error", {style:"product"});
});


router.get('/carts/:cartId', async (req, res) => {
    const { cartId } = req.params;
    
    try {
        const cart = await Cart.findCById(cartId);
        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        // console.log("cart1",cart);
        const cartProducts = cart.products.map(doc => doc.toObject());
        // console.log( "cart2", cartProducts.totalProducts);
        // console.log("cartid del carrito...", cartId);
        res.render('carts', {  cartId : cartId, products:cartProducts, style:"product" });
    } catch (error) {
        // console.error(error);
        res.status(500).send('Error interno del servidor');
    }
});
router.get('/carts/:cartId/purchase', async (req, res) => {
    try {
        const {cartId} = req.params;
        // console.log("cartTickeeloco", cartId);
        const cart = await Cart.findCById(cartId);
        res.render ('ticket', {cart: cart, cartId : cartId});
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }});

// router.get("/products/:pid", async (req,res) => {
//     try {
//         const { pid } = req.params
//         console.log(pid);
//         // const cartId = req.session.user.cartId
//         // console.log(cartId);
//         const productFound = await Manager.findById(pid)
//         console.log(productFound);
//         if (!productFound) {
//             return res.status(404).send('Producto no encontrado');
//         }
        
//         res.render("productDetail", { pid: pid, product : productFound, style:"product"})
//     } catch (error) {
//         res.status(500).send('Error interno del servidor')
//     }
// })

router.get("/products/:pid", async (req, res) => {
    try {
        const { pid } = req.params;
        // console.log( "cookis", req.cookies);
        const cartId = req.cookies.cartId;
        // console.log("cartId", cartId);
        const productFound = await Manager.findById(pid);
        const cart = await Cart.findCById(cartId);
        if (!productFound) {
            return res.status(404).send('Producto no encontrado');
        }
        // Clone the object before passing it to Handlebars
        const clonedProduct = Object.assign({}, productFound);
        res.render("productDetail", {cartId: cartId, quantity: cart.totalProducts,  pid: pid, product: clonedProduct, style: "product" });
    } catch (error) {
        res.status(500).send('Error interno del servidor');
    }
});


router.get("/changeproducts", async (req, res) => {
    try {
        // const products = await Manager.getProductList();
    res.render("changeproducts");
    } catch {
        error
    }
});



router.get("/realTimeProducts", authMiddleware(["admin"]), async (req, res) => {
    try {
        const products = await Manager.findAll({});
        // const clonedProduct = products.docs.map(item => Object.assign({}, item));
        // const template = handlebars.compile(yourTemplate);
        // const result = template(clonedProduct);
        const clonedProduct = products.docs.map(doc => doc.toObject());

        // console.log(clonedProduct);

        res.render("realTimeProducts", { products: clonedProduct, style: "product" });
    } catch (error) {
        // console.error("Error en la ruta /realTimeProducts:", error);
        res.status(500).send("Internal Server Error");
    }
});

router.get("/chat", async (req, res) => {
    try {
        // const products = await Manager.getProductList();
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