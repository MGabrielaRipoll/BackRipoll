import { productsModel } from "../../DB/Models/products.models.js";



class ProductsManager {
    // async findAll() {
    //     const result = await productsModel.find().lean();
    //     return result;
    // }
    async findAll(obj) {
        const { limit = 20, page = 1, orders = 1, ...filter } = obj;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: parseInt(orders) === 1 ? 'price' : '-price',
        };
        
        const response = await productsModel.paginate(filter, options);
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
        console.log(info);
        return {info};
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