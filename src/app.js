import  express  from 'express';
import { Manager } from './ProductManager.js';

const app = express();
app.use(express.json());

app.get("/api/products", async (req, res) => {
    
    const { limit } = req.query;
    
    try {
        const products = await Manager.getProductList(limit);
        if (limit) {
            const productsLimit = products.slice(0, parseInt(limit))
            res.status(200).json({ message: "Product found", productsLimit });}
            else {
                res.status(200).json({ message: "Product found", products });
            }        
        } catch (error) {
            res.status(500).json({ message: error.message });
        }}
        );

app.get("/api/products/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Manager.getProductById(parseInt(id));
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

app.listen(8080, () => {
    console.log("Escuchando al puerto 8080");
});