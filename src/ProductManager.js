import fs from 'fs';

const path = 'productManager.json';

class productManager {
    async getProductList() {
        try {
            if (fs.existsSync(path)) {
                const productsFile = await fs.promises.readFile(path, 'utf-8');
                return JSON.parse(productsFile);
            } else {
                return [];
            }
        } catch (error) {
            return error;
        }
    }

    async addProduct(producto) {
        try {
            const products = await this.getProductList();
            const { title, description, price, thumbnail, code, stock, status, category } = producto;
            const productoCargado = products.some((product) => product.code === code);

            if (productoCargado) {
                console.log("El código de producto que intenta cargar ya existe");
                return;
            }
            let id;
            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }
            let newProduct = {id, ...producto, status: true}
            products.push(newProduct);
            await fs.promises.writeFile(path, JSON.stringify(products));
            return newProduct;
        } catch (error) {
            return error;
        }
    }

    async getProductById(id) {
        try {
            const products = await this.getProductList();
            const producto = products.find((product) => product.id === id);

            if (producto) {
                console.log(producto);
                return producto;
            } else {
                console.log("ERROR: Not Found");
                return;
            }
        } catch (error) {
            return error;
        }
    }
    async getProductByCodigo(code) {
        try {
            console.log(code);
            const products = await this.getProductList();
            console.log(products);
            const producto = products.find((product) => product.code === code);
            console.log(producto);

            if (producto) {
                console.log(producto);
                return producto;
            } else {
                console.log("ERROR: Not Found");
                return;
            }
        } catch (error) {
            return error;
        }
    }

    async deleteProductById(id) {
        try {
            const products = await this.getProductList();
            const productsFiltrados = products.filter((product) => product.id !== id);
            await fs.promises.writeFile(path, JSON.stringify(productsFiltrados));
            return products;
        } catch (error) {
            return error;
        }
    
    }
    async updateProduct(id, obj) {
        try {
            const products = await this.getProductList();
            console.log(products);
            const index = products.findIndex((u) => u.id === id);
            console.log(index);
            if (index === -1) {
                return null;
            }
            const updateProduct = { ...products[index], ...obj };
            products.splice(index, 1, updateProduct);
            fs.promises.writeFile(path, JSON.stringify(products));
            console.log(updateProduct);
            console.log(products);
            return updateProduct;
            
            } catch (error) {
            return error;
        }
      }
    // async updateProduct(id, campo, valor) {
    //     try {
    //         const products = await this.getProductList();
    //         const productsUpdate = this.getProductById(id);
    //         productsUpdate[campo] =valor;
    //         products= products.push(productsUpdate)
            

    //         await fs.promises.writeFile(path, JSON.stringify(products));
    
    //     } catch (error) {
    //         return error;
    //     }
    // }
    }

export const Manager = new productManager();

// const producto1 = new productManager();

// (async () => {
//     await producto1.addProduct({
//         title: 'hola',
//         description: 'hola',
//         price: '1500',
//         thumbnail: 'www.kksksk.ww',
//         code: '55',
//         stock: '5'
//     });

//     await producto1.addProduct({
//         title: 'chau',
//         description: 'hola',
//         price: '2500',
//         thumbnail: 'www.kksksk.ww',
//         code: '65',
//         stock: '5'
//     });
//     await producto1.updateProduct(2,'stock', 10)


//     await producto1.getProductById(1);
//     await producto1.getProductById(2);
// })();