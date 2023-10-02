import {Router} from 'express'
import { __dirname } from "../utils.js"
import {Manager} from '../ProductManager.js'

const router = Router();

router.get("/", async (req, res) => {
    const { limit } = req.query;
    
    try {
        const products = await Manager.getProductList(+limit);
        if (limit) {
            const productsLimit = products.slice(0, parseInt(limit))
            res.status(200).json({ message: "Products found", products: productsLimit });
        } else {
            res.status(200).json({ message: "Products found", products });
        }        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.get("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const product = await Manager.getProductById(+pid);
        if (!product) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product found", product });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    });

router.post("/", async (req, res) => {
    const { title, description, price, code, stock, category } = req.body;

    if (!title || !description || !price || !code || !stock || ! category) {
        return res.status(400).json({ message: "Some data is missing" });
    }
    try {
        const response = await Manager.addProduct(req.body);
        res.status(200).json({ message: "Producto created", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
router.delete("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await Manager.deleteProductById(+pid);
        if (!response) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product deleted" });
        } catch (error) {
        res.status(500).json({ message: error.message });
        }
    });
router.put("/:pid", async (req, res) => {
    const { pid } = req.params;
    try {
        const response = await Manager.updateProduct(+pid, req.body);
        console.log(req.body);
        if (!response) {
            return res
            .status(404)
            .json({ message: "Product not found with the id provided" });
        }
        res.status(200).json({ message: "Product updated", response });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post("/change", async (req, res) => {
    const accion = req.body.accion;
    const code = req.body.code;
    console.log(code);

    try {
        if (accion === "BUSCAR") {
            const productFind = await Manager.getProductByCodigo(code);
            console.log(productFind);
            res.render("changeproducts2", {productFind});
        } 
        else if (accion === "AGREGAR") {
            const productNew = Manager.addProduct(req.body);
        } 
        else if (accion === "ELIMINAR") {
            const productFind = Manager.getProductByCodigo(code);
            if (productFind) {
                Manager.deleteProductById(productFind.id);
                // Aquí puedes hacer algo después de eliminar el producto
            } else {
                console.log("Producto no encontrado para eliminar.");
            }
        } else {
            console.log("Acción no válida.");
        }

        // Respuesta de éxito
        res.status(200).send("Operación exitosa");
    } catch (error) {
        console.error("Error:", error);
        res.status(500).send("Error interno del servidor");
    }
});


export default router