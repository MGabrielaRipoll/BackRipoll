import { cartsModel } from "../../DB/Models/carts.models.js";

class CartsManager {
    async findAll() {
        const result = await cartsModel.find().lean();
        return result;
    }

    async findById(id) {
        const result = await cartsModel.findById(id);
        return result;
    }

    async createOne() {
        const newCart = {
            products: []
        };
        const result = await cartsModel.create(newCart);
        return result;
    }
    

    async insertOne(obj) {
        const result = await cartsModel.insertOne(obj);
        return result;
    }
    async addProductToCart(cid, pid){
        const selectedCart = await cartsModel.findById(cid);        
        if (selectedCart) {
            const productIndex = selectedCart.product.findIndex(p => p.pid === pid);
    
            if (productIndex !== -1) {
                selectedCart.product[productIndex].quantity += 1;
            } else {
                selectedCart.product.push({
                    pid,
                    quantity: 1
                });
            }
            await cartsModel.updateOne({ _id: cid }, {products: selectedCart.product});            
        return selectedCart;
        }
    }
};

export const Cart = new CartsManager();