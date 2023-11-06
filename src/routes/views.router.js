import { Router } from "express";
// import {Manager} from '../dao/fileSystem/ProductManager.js'
import { Manager } from '../dao/MongoDB/productManager.mongo.js'
import { Cart } from '../dao/MongoDB/cartsManager.mongo.js'

// import { paginate } from "mongoose-paginate-v2";


const router = Router();

router.get("/home", async (req, res) => {
    try {
        const products = await Manager.findAll(req.query);
        const productsFinal = products.info.results;
        const clonedProducts = productsFinal.map(product => Object.assign({}, product._doc));
        const result = clonedProducts;
        const paginate = products.info.pages;
        const sort = req.query.orders;
        console.log(result);
        res.render("home",  {products: result, paginate: paginate, sort: sort, style:"product"} );
    } catch (error) {
        console.error(error);
        res.status(500).send("Error interno del servidor");
    }
});
router.get("/login", (req, res) => {
    if (req.session.user) {
        return res.redirect("/profile");
    }
    res.render("login");
});
  
router.get("/signup", (req, res) => {
    if (req.session.user) {
        return res.redirect("/profile");
    }
    res.render("signup");
});
  
router.get("/profile", (req, res) => {
    if (!req.session.user) {
        return res.redirect("/login");
    }
    console.log(req.session.user);
    res.render("profile", { user: req.session.user });
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
        res.render('carts', { products:cartProducts, style:"product" });
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



// router.get("/realTimeProducts", async (req, res) => {
//     try {
//         const products = await Manager.findAll();
//         res.render("realTimeProducts", products);
//     } catch {
//         error
//     }
// });
router.get("/chat", async (req, res) => {
    try {
        // const products = await Manager.getProductList();
    res.render("chats");
    } catch {
        error
    }
});

export default router;