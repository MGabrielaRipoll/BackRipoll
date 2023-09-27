// import fs from 'fs';

// const path = 'carts.json';

// class carts {
//     async getCartList() {
//         try {
//             if (fs.existsSync(path)) {
//                 const cartsFile = await fs.promises.readFile(path, 'utf-8');
//                 return JSON.parse(cartsFile);
//             } else {
//                 return [];
//             }
//         } catch (error) {
//             throw error;
//         }
//     }

//     async getCartById(id) {
//         try {
//             const carts = await this.getCartList();
//             const cartFind = carts.find((cart) => cart.id === id);

//             if (cartFind) {
//                 console.log(cartFind);
//                 return cartFind;
//             } else {
//                 console.log("ERROR: Not Found");
//                 return null;
//             }

//         } catch (error) {
//             throw error;
//         }
//     }

//     async addProductCart(cid, pid) {
//         try {
//             const carts = await this.getCartById(cid);
//             if (!carts) {
//                 throw new Error("Cart not found")}
//             if (!carts.products) {
//                 carts.products = []; 
//             }
//             const productInCart = carts.products.find((p)=> p.id === pid)
//                 if (productInCart) {
//                     productInCart.quantity++
//                 } else {
//                     carts.products.push({id: pid, quantity:1});
//                 }
//                 await fs.promises.writeFile(path, JSON.stringify(carts));
//         } catch (error) {
//             throw error; 
//         }
//     }

//     async crearCart(pid) {
//         try{
//             const carts = await this.getCartList();
//             let id;
//             if (!carts.length) {
//                 id = 1;
//             } else {
//                 id = carts[carts.length - 1].id + 1;
//             }
//             const product = {pid, quantity:1}
//             const newCart = { id, products:[product] };
//             carts.push(newCart);
//             await fs.promises.writeFile(path, JSON.stringify(carts));
//             return carts;
//         } catch (error) {
//             throw error;
//         }
//     }

// }


// export const Cart = new carts();
import fs from 'fs';

const path = 'carts.json';

class Carts {
    async getCartList() {
        try {
            if (fs.existsSync(path)) {
                const cartsFile = await fs.promises.readFile(path, 'utf-8');
                return JSON.parse(cartsFile);
            } else {
                return [];
            }
        } catch (error) {
            throw error;
        }
    }

    async getCartById(id) {
        try {
            const carts = await this.getCartList();
            const cartFind = carts.find((cart) => cart.id === id);

            if (cartFind) {
                console.log(cartFind);
                return cartFind;
            } else {
                console.log("ERROR: Not Found");
                return null;
            }
        } catch (error) {
            throw error;
        }
    }

    async addProductCart(cid, pid) {
        try {
            const carts = await this.getCartById(cid);
            if (!carts) {
                throw new Error("Cart not found");
            }
            if (!carts.products) {
                carts.products = [];
            }
            const productInCart = carts.products.find((p) => p.id === pid);
            if (productInCart) {
                productInCart.quantity++;
            } else {
                carts.products.push({ id: pid, quantity: 1 });
            }
            await fs.promises.writeFile(path, JSON.stringify(carts));
        } catch (error) {
            throw error;
        }
    }

    async createCart(pid) {
        try {
            const carts = await this.getCartList();
            let id;
            if (!carts.length) {
                id = 1;
            } else {
                id = carts[carts.length - 1].id + 1;
            }
            const product = { pid, quantity: 1 };
            const newCart = { id, products: [product] };
            carts.push(newCart);
            await fs.promises.writeFile(path, JSON.stringify(carts));
            return carts;
        } catch (error) {
            throw error;
        }
    }
}

export const Cart = new Carts();
