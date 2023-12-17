import {Router} from 'express'
import { __dirname } from "../utils.js"
import { findProductById, findAllProduct, createOneProduc, deleteOneProdAll, updateProducts } from '../controllers/products.controller.js';

const router = Router();

router.get("/", findAllProduct)
router.get("/:pid", findProductById)
router.post("/", createOneProduc)
router.delete("/:pid", deleteOneProdAll)
router.put("/:pid", updateProducts)


// router.post("/change", async (req, res) => {
//     const accion = req.body.accion;
//     const id = req.body.id;

//     try {
//         if (accion === "AGREGAR") {
//             const productNew = Manager.createOne(req.body);
//         } 
//         else {
//             Manager.deleteOne(+id);
//         }
//         res.status(200).send("Operación exitosa");

//     } catch (error) {
//         console.error("Error:", error);
//         res.status(500).send("Error interno del servidor");
//     }
// });


export default router