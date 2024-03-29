import { Manager } from "../DAL/daos/MongoDB/productManager.mongo.js"


export const findAll = (obj) => {
    const products = Manager.findAll(obj);
    return products;
};

export const findById = (id) => {
    const product = Manager.findById(id);
    return product;
};

export const createOne = (obj) => {
    const createdProduct = Manager.createOne(obj);
    return createdProduct;
};

export const deleteOneProduct = (pid) => {
    const productDelete = Manager.deleteOne(pid);
    return productDelete;
};

export const updateProduct = (pid, obj) => {
    const productModific = Manager.updateOne( pid, obj);
    return productModific;
};