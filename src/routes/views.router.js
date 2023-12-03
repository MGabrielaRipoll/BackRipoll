import { Router } from "express";
// import {Manager} from '../dao/fileSystem/ProductManager.js'
import { Manager } from '../dao/MongoDB/productManager.mongo.js'
import { Cart } from '../dao/MongoDB/cartsManager.mongo.js'
import { Users } from '../dao/MongoDB/usersManager.mongo.js'
import { Cookie } from "express-session";
import passport from "passport";

// import { paginate } from "mongoose-paginate-v2";


const router = Router();

router.get("/home", passport.authenticate('current', { session: false }), async (req, res) => {
    if (!req.cookies.token) {
        return res.redirect("/api/views/login");
    }
    console.log(req.user);
    try {
        const products = await Manager.findAll(req.query);
        const productsFinal = products.info.results;
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const paginate = products.info.pages;
        const sort = req.query.orders;
        res.render("home",  { cartId: req.user.cartId, user: req.user, name: req.user.name, email : req.user.email, products: result, paginate: paginate, sort: sort, style:"product"} );
    } catch (error) {
        console.error(error);
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
        if (req.cookies.token) {    
            return res.redirect("/home", {style:"product"});
        }
    res.render("login", {style:"product"});
});

router.get("/signup", async (req, res) => {

    if (req.session.user) {
        
        return res.redirect("/login", { style:"product"})    
    }
    
    res.render("signup", {style:"product"})
});

router.get("/restaurar", (req, res) => {
    res.render("restaurar", {style:"product"});
});

router.get("/error", (req, res) => {
    res.render("error", {style:"product"});
});


router.get('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    
    try {
        const cart = await Cart.findById(cid);

        if (!cart) {
            return res.status(404).send('Carrito no encontrado');
        }
        const cartProducts = cart.products.map(doc => doc.toObject());

        
        console.log(cartProducts);
        res.render('carts', { cid : cid, products:cartProducts, style:"product" });
    } catch (error) {
        console.error(error);
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



router.get("/realTimeProducts", async (req, res) => {
    try {
        const products = await Manager.findAll({});
        res.render("realTimeProducts", { products:products, style: "product"});
    } catch {
        error
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

export default router;