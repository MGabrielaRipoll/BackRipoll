import  { Cart }  from "../src/DAL/daos/MongoDB/cartsManager.mongo.js";
import { expect } from "chai";
import "./db.js";
import mongoose from "mongoose";


describe("find All", function (){
    it("should return an array", async function() {
        const result = await Cart.findAll();
        expect(result).to.be.an("array");
    });
})
describe("create one cart", function (){
    it("successful creation", async function(){
        const response = await Cart.createOne();
        expect(response).to.have.property("products")
    })
})
describe("Find Cart", function() {
    it("Find cart by id", async function(){
        let id = "65c95b2a488fe1c9c9efa92a"
        const response = await Cart.findCById(id);
        expect(response).to.have.property("products")
    })
})
describe("Add one product to cart", function() {
    const cartMock1 = {
        products: [
            "product", "665c94cc934728be72b4c5b31",
            "quantity", 2
        ],
        totalProducts: 2,
        totalPrice: 2500,
    }
    it("add one product response", async function(){
        const response = await Cart.addProductToCart("65c95b2a488fe1c9c9efa92a", "65c94cc934728be72b4c5b31")
        expect (response.products).to.be.an("array")
    })
})
describe("Delette one product to cart", function() {
    const cartMock1 = {
        products: [
            "product", "65c94cc934728be72b4c5b31",
            "quantity", 2
        ],
        totalProducts: 2,
        totalPrice: 2500,
    }
    it("delete one product response", async function(){
        const response = await Cart.deleteOne("65c95b2a488fe1c9c9efa92a", "65c94cc934728be72b4c5b31")
        console.log(response, "response delette");
        expect (response.products).to.be.an("array")
    })
})
describe("Delete Cart", function() {
    it("Delete cart by id", async function(){
        let id = "65c95ba10ebee6676a112ff3"
        const response = await Cart.deleteAll(id);
        expect(response).to.have.property("products");
    })
})
describe("Update one product to cart", function() {
    const cartMock1 = {
        products: [
            "product", "65c94cc934728be72b4c5b31",
            "quantity", 2
        ],
        totalProducts: 2,
        totalPrice: 2500,
    }
    it("update one product response", async function(){
        const response = await Cart.update("65c95b2a488fe1c9c9efa92a", cartMock1.products.product , cartMock1.totalProducts)
        console.log(response, "response delette");
        expect (response.products).to.be.an("array")
    })
})