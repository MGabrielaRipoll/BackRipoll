import  { Manager }  from "../src/DAL/daos/MongoDB/productManager.mongo.js";
import { expect } from "chai";
import "./db.js";
import mongoose from "mongoose";


describe("find All", function (){
    it("should return an array", async function() {
        const limit = 20;
        const result = await Manager.findAll({ limit });
        expect(result.docs).to.be.an("array");
    });
})
describe("create one product", function (){

    after(function() {
        mongoose.connection.collections.products.drop();
    });
    const productMock1 = {
        title: "La, la, la",
        description: "movie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie"
    }
    const productMock2 = {
        description: "movie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie"
    }
    const productMock3 = {
        title: "La, la, la",
        description: "movie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie",
        owner: "premium"
    }
    it("successful creation", async function(){
        const response = await Manager.createOne(productMock1);
        expect(response).to.have.property("owner")
    })
    it("should throw an error if a required property in missing", async function(){
        try {
            await Manager.createOne(productMock2);
        } catch (error) {
            expect(error).to.be.an("error");
        }
    })
})
describe("Find Products", function() {
    const productMock1 = {
        title: "La, la, la",
        description: "movie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie",
        owner: "premium"
    }
    const productMock2 = {
        title: "La, la, la",
        description: "movie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie"
    }
    it("Find product by owner", async function(){
        const product1 = await Manager.createOne(productMock1);
        const product2 = await Manager.createOne(productMock2);
        const response = await Manager.findByOwner(product1.owner);
        expect(response).to.have.lengthOf(1)
    })
})