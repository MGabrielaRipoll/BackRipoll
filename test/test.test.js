import { expect } from "chai";
import supertest from "supertest";

const requester = supertest("http://localhost:8080");

const user = {
	email: 'hola@jjj.com',
	password: '2525',
};
let cookieData;

describe("Products Endpoints", () => {
	before(async () => {
		const response = await requester.post("/api/session/login").send(user);
		const cookie = response.headers["set-cookie"][1];
		cookieData = {
			name: cookie.split("=")[0],
			value: cookie.split("=")[1].split(";")[0]
		};
	});
	describe("POST '/api/products'", () => {
		it("Endpoint POST /api/products create product", async () => {
			const product1 = {
				"title": "Test",
				"description": "Test",
				"code": "432",
				"price": 3.99,
				"status": true,
				"thumbnails": "sss.webp",
				"category": "Test",
				"stock": 50
			};
			const response = await requester.post("/api/products").set("Cookie", [`${cookieData.name}=${cookieData.value}`]).send(product1);
			console.log('==> response', response)
			expect(response.status).to.equal(200);
		});
	it("Endpoint PUT /api/products update product", async () => {
		const product1 = {
			"title": "Test",
			"description": "TestPrueba",
			"code": "605",
			"price": 3.99,
			"status": true,
			"thumbnails": "sss.webp",
			"category": "Test",
			"stock": 50
		};
		const response = await requester.put("/api/products/65c40a5a0666f1324d771038")
			.set("Cookie", [`${cookieData.name}=${cookieData.value}`])
			.send(product1);
		console.log('==> response 2', response)
		expect(response.status).to.equal(200);
		});
	});
	describe("GET '/api/products'", async () => {
        it("should return all products", async () => {
            const opt = {limit : 0,
                        page: 1,
                        orders: 0};
            const response = await requester.get("/api/products").query(opt);
            expect(response._body.products.docs).to.be.an("array");
        });

        it("should return one product by ID", async () => {
            const response = await requester.get(`/api/products/6536fde93a1ffc43d021abe0`);
            expect(response._body.message).to.be.equal("Product found");
        });
    });
	// describe("DELETE '/api/products'", () => {
	// 	it("Endpoint DELETE /api/products delete product by ID", async () => {
	// 		const id = "65c414cde7651effc4951aac";
	// 		const response = await requester.delete("/api/products/65c414cde7651effc4951aac")
	// 			.set("Cookie", [`${cookieData.name}=${cookieData.value}`])
	// 			.send({id});
	// 		// console.log('==> response', response)
	// 		expect(response.status).to.equal(200);
	// 	});
	// })
});
