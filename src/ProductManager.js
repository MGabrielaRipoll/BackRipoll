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
            const { title, description, price, thumbnail, code, stock } = producto;
            const productoCargado = products.some((product) => product.code === code);

            if (productoCargado) {
                console.log("El código de producto que intenta cargar ya existe");
                return;
            }

            if (!title || !description || !price || !thumbnail || !code || stock === undefined) {
                console.log("Para agregar un producto debe completar todos los campos");
                return;
            }

            let id;
            if (!products.length) {
                id = 1;
            } else {
                id = products[products.length - 1].id + 1;
            }
            products.push({ id, ...producto });
            await fs.promises.writeFile(path, JSON.stringify(products));
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

    async deleteProductById(id) {
        try {
            const products = await this.getProductList();
            const productsFiltrados = products.filter((product) => product.id !== id);
            await fs.promises.writeFile(path, JSON.stringify(productsFiltrados));
        } catch (error) {
            return error;
        }
    }
    async updateProduct(id, campo, valor) {
        try {
            const products = await this.getProductList();
    
            products.forEach((product, index) => {
                if (product.id === id) {
                    product[campo] = valor;
                }
            });

            await fs.promises.writeFile(path, JSON.stringify(products));
    
        } catch (error) {
            return error;
        }
    }
    
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
