import { Cart } from "../DAL/daos/MongoDB/cartsManager.mongo.js"


export const findAll = () => {
    const carts = Cart.findAll();
    return carts;
};

export const findCById = (id) => {
    const cart = Cart.findCById(id)        
    return cart;
};


export const createOne = (obj) => {
    const createdCart = Cart.createOne(obj);
    return createdUser;
};

export const addProduct = (cid,pid) => {
    const cartModific = Cart.addProductToCart(cid,pid);
    return cartModific;
};

export const deleteOneProduct = (cid,pid) => {
    const cartModific = Cart.deleteOne(cid,pid);
    return cartModific;
};

export const deleteAll = (cid) => {
    const listaCarts = Cart.deleteAll(cid);
    return listaCarts;
};

export const updateCart = (cid, pid, quantity) => {
    const cartsModific = Cart.update(cid, pid, quantity);
    return cartsModific;
};