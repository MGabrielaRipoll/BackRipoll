import { productsModel } from "../../../DB/Models/products.models.js";



class ProductsManager {
    async findAll(obj) {
        const { limit = 20, page = 1, orders = 1 } = obj;
        const options = {
            limit: parseInt(limit),
            page: parseInt(page),
            sort: parseInt(orders) === 1 ? 'price' : '-price',
        };
        const response = await productsModel.paginate({}, options);
        const info = {
            status: response.docs ? "success" : "error",
            results: response.docs,
            pages: response.totalPages,
            nextPage: response.page === response.totalPages ? null : response.page + 1,
            prevPage: response.page === 1 ? null : response.page - 1,
            next: response.hasNextPage
                ? `http://localhost:8080/api/products?page=${response.page + 1}`
                : null,
            prev: response.hasPrevPage
                ? `http://localhost:8080/api/products?page=${response.page - 1}`
                : null,
        };
        const docs = response.docs;
        return {info, docs};
    }
    async findByOwner(owner) {
        const products = await productsModel.find();
        console.log(owner, products, "ASFSDGSAGAG");
        const result = products.filter(product => product.owner === owner);
        return result;
    }
    async findByCode(code) {
        const products = await productsModel.find();
        const result = products.filter(product => product.code === parseInt(code));
        return result;
    }
    async findById(id) {
        const result = await productsModel.findById(id);
        return result;
    }

    async createOne(obj) {
        const result = await productsModel.create(obj);
        return result;
    }

    async updateOne(id, obj) {
        const result = await productsModel.updateOne({ _id: id }, obj);
        return result;
    }

    async deleteOne(id) {
        const result = await productsModel.deleteOne({ _id: id });
        return result;
    }
    
}

export const Manager = new ProductsManager();