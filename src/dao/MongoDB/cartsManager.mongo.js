import { cartsModel } from "../../DB/Models/carts.models.js";

class CartsManager {
    async findAll() {
        const result = await cartsModel.find();
        return result;
    }
    

    async findById(id) {
        const result = await cartsModel.findById(id)
        .populate({
            path: "products.product",
            model: "Products", 
            select: ["title", "description", "price", "stock", "code", "category", "status", "thumbail"]
        });
        return result;
    }

    async createOne() {
        const newCart = {
            products: []
        };
        const result = await cartsModel.create(newCart);
        return result;
    }
    

    
    async addProductToCart(cid, pid) {
        const selectedCart = await cartsModel.findById(cid);
        
        if (selectedCart) {
            const productIndex = selectedCart.products.findIndex(p => p.product.equals(pid));   
            console.log(productIndex);
            if (productIndex !== -1) {
                selectedCart.products[productIndex].quantity += 1;
            } else {
                selectedCart.products.push({
                    product: pid,
                    quantity: 1,
                });
            }   
            console.log(selectedCart);
            // let suma = 0
            // let contadorTotal = selectedCart.products.forEach(element => { element.quantity })
            // let precioTotal = selectedCart.products.forEach(element => { element.quantity * element.price + precioTotal
            // })
            // console.log("contadorTotal", contadorTotal);
            return (selectedCart.save());
        }
    }   
    async deleteOne(cid, pid) {
        const selectedCart = await cartsModel.findById(cid);
    
        if (selectedCart) {
            const productIndex = selectedCart.products.findIndex(p => p.product.equals(pid));
            if (productIndex !== -1) {
                if (selectedCart.products[productIndex].quantity > 1) {
                    selectedCart.products[productIndex].quantity -= 1;
                } else {
                    selectedCart.products.splice(productIndex, 1);
                }    
                return selectedCart.save();
            }
        }
    }
    async deleteAll(cid) {
        const selectedCart = await cartsModel.findById(cid);
        if (selectedCart) {
            selectedCart.products = [];

        } else {
            res.status(200).json({ message: "Cart not found"});
        }
        return selectedCart.save();
    }

    async update(cid, pid, quantity) {
        const selectedCart = await cartsModel.findById(cid);
        if (selectedCart) {
            const productIndex = selectedCart.products.findIndex(p => p.product.equals(pid));
            console.log(productIndex);
            if (productIndex !== -1) {
                selectedCart.products[productIndex].quantity = quantity;
            } else {            
                selectedCart.products.push({ product: pid, quantity: quantity });
            }           
            return selectedCart.save();
        }
    }
    
};

export const Cart = new CartsManager();