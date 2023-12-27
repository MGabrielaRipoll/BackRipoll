
const addToCart = async (cartId, _id) => {
    const id = document.getElementById('pid').value;

    const url = `http://localhost:8080/api/cart/${cartId}/products/${id}`;
    const data = {
        cartId: cartId,
        _id: _id,

    };

    console.log("cart", cartId, "product", _id);

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error adding product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Product added to cart:", result);
        location.reload(true);

    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};


const deleteOne = async (cartId, _id) => {
    // const cartId = button.dataset.cartId;

    const url = `http://localhost:8080/api/cart/${cartId}/products/${_id}`;
    const data = {
        cartId: cartId,  // Use the parameter cid here
        _id: _id,
    };

    console.log("cartId", cartId, "product", _id);

    try {
        const response = await fetch( url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error in delete product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Product delete to cart:", result);
        location.reload(true);

    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};


const addProductToCart = async (cartId, _id) => {
    // const cartId = button.dataset.cartId;
    // const {cid} = req.params;
    // const id = document.getElementById('pid').value;
    // console.log(id);
    const url = `http://localhost:8080/api/cart/${cartId}/products/${_id}`;
    const data = {
        cartId: cartId, 
        _id: _id,
    };

    console.log("cartId", cartId, "product", _id);

    try {
        const response = await fetch( url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error in added product to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();
        console.log("Product add to cart:", result);
        location.reload(true);

    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};

const deleteAll = async (cartId) => {
    // const cartId = document.getElementById('cartId').value;

    const url = `http://localhost:8080/api/cart/${cartId}`;
    const data = {
        cartId: cartId,  
    };

    try {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                // Add any additional headers as needed
            },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            // Handle non-successful responses here
            console.error("Error in delete to cart:", response.status, response.statusText);
            return;
        }

        const result = await response.json();

        console.log(" delete to cart:", result);
        location.reload(true);

    } catch (error) {
        // Handle fetch errors here
        console.error("Fetch error:", error.message);
    }
};

const createOneProduc = async () => {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const stock = document.getElementById('stock').value;
    const code = document.getElementById('code').value;
    const category = document.getElementById('category').value;
    const thumbail = document.getElementById('thumbail').value;

    const data = {
        title: title,
        description: description,
        price: price,
        stock: stock,
        code: code,
        category: category,
        thumbail: thumbail
    };
    const url = 'http://localhost:8080/api/products/';
    try {
    const response = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            // Add any additional headers as needed
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        // Handle non-successful responses here
        console.error("Error in add the product:", response.status, response.statusText);
        return;
    }
    const result = await response.json();

    console.log(" product add:", result);
    location.reload(true);

    } catch (error) {
    // Handle fetch errors here
    console.error("Fetch error:", error.message);
}
};

const deleteOneProdAll = async () => {
    const id = document.getElementById('id').value;

    const url = `http://localhost:8080/api/products/${id}`;
    try {
    const response = await fetch(url, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: id }),
    });
    if (!response.ok) {
        // Handle non-successful responses here
        console.error("Error in eliminacion the product:", response.status, response.statusText);
        return;
    }
    const result = await response.json();

    console.log(" product eliminado:", result);
    location.reload(true);
    } catch (error) {
        console.error("Fetch error:", error.message);        
    }
}