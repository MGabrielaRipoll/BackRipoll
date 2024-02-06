// import supertest from "supertest";
// import jwt from "jsonwebtoken";
// import { expect } from "chai";
// import mongoose from "mongoose";
// import { Manager }  from "../src/DAL/daos/MongoDB/productManager.mongo.js";
// import { Users } from "../src/DAL/daos/MongoDB/usersManager.mongo.js";

// const requester = supertest("http://localhost:8080");

// describe("Product endpoints", async () => {
//     after(function() {
//                 mongoose.connection.collections.products.drop();
//                 mongoose.connection.collections.users.drop();
//             });
//     let cookieTestDef;
//     beforeEach(async () => {
//         const user = {
//             name: 'admin',
//             lastName: 'admin1',
//             email: 'admin@mail.com',
//             password: '1234',
//             role: 'admin'
//         };
//         const userTest = await Users.createOne(user);
//         const response = await requester.post("/api/session/login").send(user);
//         const cookieTest = response.headers["set-cookie"][0];
//         const cookieTestDef = {
//             name: cookieTest.split("=")[0],
//             value: cookieTest.split("=")[1].split(";")[0]
//         }
//         console.log(cookieTestDef, "cookie login");

//     })
//     const productMock1 = {
//         title: "La, la, la",
//         description: "movie",
//         price: "2500",
//         stock: "20",
//         code: "20",
//         category: "movie"
//     }
//     const productMockUpdate = {
//         title: "La, la, la",
//         description: "serie",
//         price: "2500",
//         stock: "20",
//         code: "20",
//         category: "movie"
//     }
//     describe("GET '/api/products'", async () => {  
//         it("should all products", async() => {
//             const productTest  = await Manager.createOne(productMock1);  
//             const queryTest ={
//                 limit: 10,
//                 page: 1,
//                 orders: 1,
//             }
//             const response = await requester.get("/api/products")
//                 .query(queryTest)
//             console.log(response, "responseGet");
//             expect(response._body.payload).to.be.an("array");
//         });
//         it ("should one product by ID", async () => { 
//             // const productTest  = await Manager.createOne(productMock1);  
//             // const id = productTest._id.toString();
//             const response = await requester.get(`/api/products/65c1633addbe2dbfb692444d`);
//             console.log(response, "responseGetId");
//             expect(response._body.payload).to.have.lengthOf(0);
//         })});
    
//     describe("POST '/api/products", async () => {
//         it("create one product", async()=> {
//             const response = await requester.post("/api/products")
//             .set("Authorization", `Bearer ${cookieTestDef.value}`)
//             .send(productMock1);
//             console.log(response, "response");
//             expect(response._body.payload.owner).to.be.equal("admin");
//         });   
//         });
        
//     describe("DELETE '/api/products/pid", async () => {
//         it("delete one product by ID", async()=> {
//             const productTest  = await Manager.createOne(productMock1)
//             const response = await requester.delete(`/api/products/:${productTest._id}`)
//             .set("Authorization", `Bearer ${cookieTestDef.value}`);
//             console.log(response, "responseDelete");
//             expect(response._body.payload).to.have.lengthOf(0);
//         })});   
//     describe("PUT '/api/products/pid", async () => {
//         it ("update one product", async()=> {
//             const productTest  = await Manager.createOne(productMock1)
//             const response = await requester.put(`/api/products/:${productTest._id}`)
//             .set("Authorization", `Bearer ${cookieTestDef.value}`)
//             .send(productMockUpdate);
//             console.log(response, "responseUpdate");
//             expect(response._body.payload.description).to.be.equal("serie");
//         })});    
// })

import supertest from "supertest";
import jwt from "jsonwebtoken";
import { expect } from "chai";
import mongoose from "mongoose";
import { ObjectId } from "mongoose";
import { Manager } from "../src/DAL/daos/MongoDB/productManager.mongo.js";
import { Users } from "../src/DAL/daos/MongoDB/usersManager.mongo.js";

const requester = supertest("http://localhost:8080");

describe("Product endpoints", async () => {
    let cookieTestDef;

    beforeEach(async () => {
        const user = {
            name: 'admin',
            lastName: 'admin1',
            email: 'admin@mail.com',
            password: '1234',
            role: 'admin'
        };

        // Create the user
        const userTest = await Users.createOne(user);
        const userLogin = {
            email: userTest.email,
            password: userTest.password
        };
        console.log(userLogin);        
        const response = await requester.post("/api/session/login")
            .send(userLogin);
        // console.log(response, "resp... login");
        const cookieTest = response.headers["set-cookie"][0];
        cookieTestDef = {
            name: cookieTest.split("=")[0],
            value: cookieTest.split("=")[1].split(";")[0]
        };
        console.log(cookieTestDef, "cookie login");
    });

    const productMock1 = {
        title: "La, la, la",
        description: "movie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie"
    };

    const productMockUpdate = {
        title: "La, la, la",
        description: "serie",
        price: "2500",
        stock: "20",
        code: "20",
        category: "movie"
    };

    describe("GET '/api/products'", async () => {
        it("should return all products", async () => {
            const productTest = await Manager.createOne(productMock1);
            const opt = {limit : 0};
            const response = await requester.get("/api/products").query(opt);
            console.log(response._body, "responseGet");
            expect(response._body.payload).to.be.an("array");
        });

        it("should return one product by ID", async () => {
            const productTest = await Manager.createOne(productMock1);
            console.log(productTest, productTest._id, "q onda");
            const id = productTest._id.toString();
            const response = await requester.get(`/api/products/${id}`);
            console.log(response._body, "responseGetId");
            expect(response._body.payload).to.have.lengthOf(1);
        });
    });

    // describe("POST '/api/products'", async () => {
    //     it("should create one product", async () => {
    //         const response = await requester.post("/api/products")
    //             .set("Authorization", `Bearer ${cookieTestDef.value}`)
    //             .send(productMock1);
    //         console.log(response, "response");
    //         expect(response._body.payload.owner).to.be.equal("admin");
    //     });
    // });

    // describe("DELETE '/api/products/:pid'", async () => {
    //     it("should delete one product by ID", async () => {
    //         const productTest = await Manager.createOne(productMock1);
    //         const response = await requester.delete(`/api/products/${productTest._id}`)
    //             .set("Authorization", `Bearer ${cookieTestDef.value}`)
    //             .send(productTest._id);
    //         console.log(response._body, "responseDelete");
    //         expect(response._body.payload).to.have.lengthOf(0);
    //     });
    // });

    // describe("PUT '/api/products/:pid'", async () => {
    //     it("should update one product", async () => {
    //         const productTest = await Manager.createOne(productMock1);
    //         const response = await requester.put(`/api/products/${productTest._id}`)
    //             .set("Authorization", `Bearer ${cookieTestDef.value}`)
    //             .send(productMockUpdate);
    //         console.log(response.body, "responseUpdate");
    //         expect(response.body.payload.description).to.be.equal("serie");
    //     });
    // });
});
